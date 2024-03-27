import {
  CrossCircledIcon,
  CircleIcon,
  ClockIcon,
  CheckIcon,
  QuestionMarkCircledIcon,
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
} from "@radix-ui/react-icons";

import { toast } from "sonner";
import { useLocalStorage, useReadLocalStorage } from "usehooks-ts";
import { Config } from "./use-config";
import ky from "ky";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type TodoStatus = (typeof statuses)[number]["value"];
export type Priority = (typeof priorities)[number]["value"];

export const statuses = [
  {
    value: "backlog",
    label: "Backlog",
    icon: QuestionMarkCircledIcon,
  },
  {
    value: "todo",
    label: "Todo",
    icon: CircleIcon,
  },
  {
    value: "in progress",
    label: "In Progress",
    icon: ClockIcon,
  },
  {
    value: "done",
    label: "Done",
    icon: CheckIcon,
  },
  {
    value: "canceled",
    label: "Canceled",
    icon: CrossCircledIcon,
  },
] as const;

export const priorities = [
  {
    label: "Low",
    value: "low",
    icon: ArrowDownIcon,
  },
  {
    label: "Medium",
    value: "medium",
    icon: ArrowRightIcon,
  },
  {
    label: "High",
    value: "high",
    icon: ArrowUpIcon,
  },
] as const;

export interface TodoList {
  id: number;
  title: string;
  description: string;
}
export interface Todo {
  id: number;
  title: string;
  description: string;
  status: TodoStatus;
  priority: Priority;
  todoListId: number;
}

export interface TodoStore {
  currentTodoListId: number | null;
  todoList: TodoList[];
  todos: Todo[];
}

export const useStore = () => {
  const [store, setStore] = useLocalStorage<TodoStore>("store", {
    currentTodoListId: 0,
    todoList: [],
    todos: [],
  });
  const config = useReadLocalStorage<Config>("config");

  const {
    data: remoteData,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["remote_data"],
    queryFn: fetchRemoteStore,
    enabled: config?.byob && !!config?.backendUrl,
    retry: 1,
  });

  const { mutate } = useMutation({
    mutationFn: (event: Event) => publishEvent(event),
    onSuccess() {
      utils.invalidateQueries({ queryKey: ["remote_data"] });
    },
  });
  const utils = useQueryClient();
  const { mutate: syncMutate, isPending } = useMutation({
    mutationFn: () => syncStore(store),
    onSuccess() {
      utils.invalidateQueries({ queryKey: ["remote_data"] });
    },
  });
  const addTodoList = (todoList: Omit<TodoList, "id">) => {
    const lastId = store.todoList[store.todoList.length - 1]?.id ?? 0;
    const newTodoList = { ...todoList, id: lastId + 1 };
    setStore({
      ...store,
      todoList: [...store.todoList, newTodoList],
      currentTodoListId: newTodoList.id,
    });
    mutate({ type: "add_todo_list", payload: newTodoList });
  };
  const updateTodoList = (
    id: number,
    updatedTodoList: Omit<TodoList, "id">,
  ) => {
    setStore({
      ...store,
      todoList: store.todoList.map((t) =>
        t.id === id ? { ...t, ...updatedTodoList } : t,
      ),
    });
    mutate({
      type: "update_todo_list",
      payload: { id, ...updatedTodoList },
    });
  };
  const deleteTodoList = (id: number) => {
    const newTodoListArray = store.todoList.filter((t) => t.id !== id);
    const newTodosArray = store.todos.filter((todo) => todo.todoListId === id);
    if (newTodosArray.length > 0) {
      toast.error("Cannot delete a category with todos");
      return;
    }
    setStore({ ...store, todoList: newTodoListArray, currentTodoListId: null });
    toast.success("Category deleted successfully");
    mutate({ type: "delete_todo_list", payload: { id } });
  };
  const addTodo = (todo: Omit<Todo, "id">) => {
    if (store.currentTodoListId === null) {
      toast.error("Please select a category");
      return;
    }
    const newTodo = {
      ...todo,
      id: store.todos.length + 1,
      todoListId: store.currentTodoListId,
    };
    setStore({ ...store, todos: [...store.todos, newTodo] });

    const list = store.todoList?.find((t) => t.id === store.currentTodoListId);
    mutate({
      type: "add_todo",
      payload: {
        todo: {
          id: newTodo.id,
          title: newTodo.title,
          description: newTodo.description,
          status: newTodo.status,
          priority: newTodo.priority,
          todoListId: newTodo.todoListId,
        },
        list: {
          id: list?.id ?? 0,
          title: list?.title ?? "",
          description: list?.description ?? "",
        },
      },
    });
  };

  const updateTodo = (id: number, updatedTodo: Omit<Todo, "id">) => {
    setStore({
      ...store,
      todos: store.todos.map((t) =>
        t.id === id ? { ...t, ...updatedTodo } : t,
      ),
    });
    const list = store.todoList.find((t) => t.id === store.currentTodoListId);
    mutate({
      type: "update_todo",
      payload: {
        todo: { id, ...updatedTodo },
        list: {
          id: list?.id ?? 0,
          title: list?.title ?? "",
          description: list?.description ?? "",
        },
      },
    });
  };
  const deleteTodo = (id: number) => {
    setStore({ ...store, todos: store.todos.filter((todo) => todo.id !== id) });
    toast.success("Todo deleted successfully");
    mutate({ type: "delete_todo", payload: { id } });
  };
  const setActiveTodoList = (id: number) => {
    setStore({ ...store, currentTodoListId: id });
  };

  const pullRemoteStore = async () => {
    refetch();
    if (!remoteData) {
      return;
    }
    const combinedTodos = createSafeDiff(store.todos, remoteData.todos);
    const combinedLists = createSafeDiff(store.todoList, remoteData.todoList);

    setStore((prev) => ({
      ...prev,
      todoList: [...prev.todoList, ...combinedLists],
      todos: [...prev.todos, ...combinedTodos],
    }));
  };

  return {
    store,
    remoteStore: remoteData,
    addTodoList,
    updateTodoList,
    deleteTodoList,
    addTodo,
    updateTodo,
    deleteTodo,
    setActiveTodoList,
    pullRemoteStore,
    pushRemoteStore: syncMutate,
    pullLoading: isLoading,
    pushLoading: isPending,
  };
};

type Event =
  | {
      type: "add_todo";
      payload: {
        list: {
          id: number;
          title: string;
          description: string;
        };
        todo: {
          id: number;
          title: string;
          description: string;
          status: TodoStatus;
          priority: Priority;
          todoListId: number;
        };
      };
    }
  | {
      type: "update_todo";
      payload: {
        list: {
          id: number;
          title: string;
          description: string;
        };
        todo: {
          id: number;
          title: string;
          description: string;
          status: TodoStatus;
          priority: Priority;
          todoListId: number;
        };
      };
    }
  | {
      type: "delete_todo";
      payload: { id: number };
    }
  | {
      type: "add_todo_list";
      payload: { title: string; description: string; id: number };
    }
  | {
      type: "update_todo_list";
      payload: { id: number; title?: string; description?: string };
    }
  | {
      type: "delete_todo_list";
      payload: { id: number };
    };

const getConfig = () => {
  const config = localStorage.getItem("config");
  if (config) {
    return JSON.parse(config) as Config;
  }
  return {
    backendUrl: "",
    headers: {},
    forcePush: false,
    byob: false,
  };
};
const publishEvent = async (event: Event) => {
  const config = getConfig();
  if (config.byob) {
    try {
      const response = (await ky
        .post(config.backendUrl, {
          json: event,
          headers: {
            "Content-Type": "application/json",
            ...config.headers,
          },
        })
        .json()) as Event;
      toast.success(`Event ${event.type} published successfully`);
      return response;
    } catch (error) {
      toast.error(`failed to publish event to ${config.backendUrl}`);
      console.error(error);
    }
  }
};

const fetchRemoteStore = async () => {
  const config = getConfig();
  if (config.byob && !config.backendUrl) {
    try {
      const response = (await ky
        .get(config.backendUrl, {
          headers: {
            "Content-Type": "application/json",
            ...config.headers,
          },
        })
        .json()) as Omit<TodoStore, "jsonView" | "currentTodoListId">;

      return response;
    } catch (error) {
      toast.error(`failed to fetch remote store from ${config.backendUrl}`);
      console.error(error);
    }
  }
};

export const syncStore = async (store: TodoStore) => {
  const config = getConfig();
  const payload = {
    type: "sync",
    payload: {
      todoLists: store.todoList,
      todos: store.todos,
      force: config.forcePush,
    },
  };

  try {
    await ky.post(config.backendUrl, {
      json: payload,
      headers: {
        "Content-Type": "application/json",
        ...config.headers,
      },
    });
    toast.success("Store synced successfully");
  } catch (error) {
    toast.error(`failed to sync store to ${config.backendUrl}`);
    console.error(error);
  }
};

const createSafeDiff = <T extends { id: number }>(store: T[], remote: T[]) => {
  const diff = remote.filter((r) => !store.some((s) => s.id === r.id));
  return diff;
};
