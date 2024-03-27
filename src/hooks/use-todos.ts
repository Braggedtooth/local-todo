import {
  QuestionMarkCircledIcon,
  StopwatchIcon,
  CheckCircledIcon,
  CrossCircledIcon,
} from "@radix-ui/react-icons";
import {
  CircleIcon,
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useLocalStorage } from "usehooks-ts";

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
    icon: StopwatchIcon,
  },
  {
    value: "done",
    label: "Done",
    icon: CheckCircledIcon,
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
  todolist: TodoList[];
  todos: Todo[];
  jsonView: boolean;
}

export const useTodos = () => {
  const [store, setStore] = useLocalStorage<TodoStore>("store", {
    currentTodoListId: 0,
    todolist: [],
    todos: [],
    jsonView: false,
  });

  const addTodoList = (todoList: Omit<TodoList, "id">) => {
    const newTodoList = { ...todoList, id: store.todolist.length + 1 };
    setStore({
      ...store,
      todolist: [...store.todolist, newTodoList],
      currentTodoListId: newTodoList.id,
    });
  };
  const updateTodoList = (
    id: number,
    updatedTodoList: Omit<TodoList, "id">,
  ) => {
    setStore({
      ...store,
      todolist: store.todolist.map((t) =>
        t.id === id ? { ...t, ...updatedTodoList } : t,
      ),
    });
  };
  const deleteTodoList = (id: number) => {
    const newTodoListArray = store.todolist.filter((t) => t.id !== id); // remove the todo list
    // find all todos that belong to the deleted todo list
    const newTodosArray = store.todos.filter((todo) => todo.todoListId === id);
    if (newTodosArray.length > 0) {
      toast.error("Cannot delete a category with todos");
      return;
    }
    setStore({ ...store, todolist: newTodoListArray, currentTodoListId: null });
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
  };

  const updateTodo = (id: number, updatedTodo: Omit<Todo, "id">) => {
    setStore({
      ...store,
      todos: store.todos.map((t) =>
        t.id === id ? { ...t, ...updatedTodo } : t,
      ),
    });
  };
  const deleteTodo = (id: number) => {
    setStore({ ...store, todos: store.todos.filter((todo) => todo.id !== id) });
  };
  const setActiveTodoList = (id: number) => {
    setStore({ ...store, currentTodoListId: id });
  };
  const toggleJsonView = () => {
    // toggle json view
    setStore({ ...store, jsonView: !store.jsonView });
  };
  return {
    store,
    addTodoList,
    updateTodoList,
    deleteTodoList,
    addTodo,
    updateTodo,
    deleteTodo,
    setActiveTodoList,
    toggleJsonView,
  };
};
