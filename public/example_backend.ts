const todoLists = new Map<number, unknown>();
const todos = new Map<number, unknown>();
type Events =
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
          status: string;
          priority: string;
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
          status: string;
          priority: string;
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
    }
  | {
      type: "sync";
      payload: {
        todos: {
          id: number;
          title: string;
          description: string;
          status: string;
          priority: string;
          todoListId: number;
        }[];
        todoLists: {
          id: number;
          title: string;
          description: string;
        }[];
      };
    };

const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Headers":
    "Content-Type, Accept, access-control-allow-origin",
  "Access-Control-Allow-Origin": "*",
};

console.log("Hello from bun-server!");
console.log("Starting server...");
// @ts-expect-error - bun is not defined
Bun.serve({
  port: 3001,
  async fetch(req) {
    const origin = req.headers.get("Origin");
    console.log("origin", origin);
    const url = new URL(req.url);

    if (req.method === "OPTIONS") {
      const res = new Response(null, {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Headers":
            "Content-Type, Accept, access-control-allow-origin",
          "Access-Control-Allow-Origin": "*",
        },
      });
      return res;
    }

    if (url.pathname === "/api") {
      const res = await handler(req);

      const res2 = new Response(res?.body, {
        status: res?.status,
        headers: corsHeaders,
      });

      return res2;
    }
    return new Response("404!", {
      status: 404,
    });
  },
});

const handler = async (req: Request) => {
  switch (req.method) {
    case "GET": {
      console.log("GET");
      const data = {
        todos: [...todos.values()],
        todoList: [...todoLists.values()],
      };
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
          ...corsHeaders,
        },
      });
    }
    case "POST": {
      const event = (await req.json()) as Events;
      console.log("event", event);
      switch (event.type) {
        case "add_todo": {
          const { todo, list } = event.payload;
          const hasList = checkList(list.id);
          if (!hasList) {
            todoLists.set(list.id, list);
          }
          todos.set(todo.id, todo);
          const res = new Response(
            JSON.stringify({
              message: "Added todo!",
            }),
            {
              status: 200,
            },
          );
          return res;
        }
        case "update_todo": {
          const { todo, list } = event.payload;
          const hasList = checkList(list.id);
          if (!hasList) {
            todoLists.set(list.id, list);
          }
          const todoExists = todos.get(todo.id);
          if (!todoExists)
            return new Response(
              JSON.stringify({
                message: "Not found!",
              }),
              {
                status: 404,
              },
            );
          todos.set(todo.id, { ...todoExists, ...todo });
          const res = new Response(
            JSON.stringify({
              message: "Updated todo!",
            }),
            {
              status: 200,
            },
          );
          return res;
        }
        case "delete_todo": {
          const { id } = event.payload;
          const todo = todos.get(id);
          if (!todo)
            return new Response(
              JSON.stringify({
                message: "Not found!",
              }),
              {
                status: 404,
                headers: {
                  ...corsHeaders,
                },
              },
            );
          todos.delete(id);
          const res = new Response(
            JSON.stringify({
              message: "Deleted todo!",
            }),
            {
              status: 200,
            },
          );
          return res;
        }
        case "add_todo_list": {
          const { title, description, id } = event.payload;
          todoLists.set(id, { title, description, id });
          const res = new Response(
            JSON.stringify({
              message: "Added todo list!",
            }),
            {
              status: 200,
            },
          );

          return res;
        }
        case "update_todo_list": {
          const { id, ...rest } = event.payload;
          const list = todoLists.get(id);
          if (!list)
            return new Response(
              JSON.stringify({
                message: "Not found!",
              }),
              {
                status: 404,
                headers: {
                  ...corsHeaders,
                },
              },
            );
          todoLists.set(id, { ...list, ...rest });
          const res = new Response(
            JSON.stringify({
              message: "Updated todo list!",
            }),
            {
              status: 200,
            },
          );

          return res;
        }
        case "delete_todo_list": {
          const { id } = event.payload;
          const list = todoLists.get(id);
          if (!list)
            return new Response(
              JSON.stringify({
                message: "Not found!",
              }),
              {
                status: 404,
                headers: {
                  ...corsHeaders,
                },
              },
            );
          todoLists.delete(id);
          const res = new Response(
            JSON.stringify({
              message: "Deleted todo list!",
            }),
            {
              status: 200,
            },
          );
          return res;
        }
        case "sync": {
          const { todos: newTodos, todoLists: newTodoLists } = event.payload;
          console.log("newTodos", newTodos);
          console.log("newTodoLists", newTodoLists);
          newTodos?.forEach((todo) => {
            todos.set(todo.id, todo);
          });
          newTodoLists?.forEach((list) => {
            todoLists.set(list.id, list);
          });
          return new Response(
            JSON.stringify({
              message: "Synced!",
            }),
            {
              status: 200,
            },
          );
        }
        default: {
          return new Response(JSON.stringify({ message: "Not found!" }), {
            status: 404,
          });
        }
      }
    }
    default: {
      return new Response(JSON.stringify({ message: "Not allowed!" }), {
        status: 405,
        headers: {
          ...corsHeaders,
        },
      });
    }
  }
};

const checkList = (listId: number) => {
  return todoLists.has(listId);
};
