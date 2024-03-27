import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
const data = {
  title: "BYOB Documentation",
  description:
    "BYOB (Bring Your Own Backend) mode allows the application to interact with a user-provided backend. When BYOB mode is enabled, the application will send events to the backend URL specified in the configuration.",

  events: [
    {
      type: "pull_todos",
      description: "Fetches all todo items from the backend.",
      payload: {
        type: "object",
        properties: {
          todos: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: "number",
                title: "string",
                description: "string",
                status: "string",
                priority: "string",
                todoListId: "number",
              },
            },
          },
        },
      },
    },
    {
      type: "add_todo",
      description: "Adds a new todo item to a specific list.",
      payload: {
        list: {
          type: "object",
          properties: {
            id: "string",
            title: "string",
            description: "string",
          },
        },
        todo: {
          type: "object",
          properties: {
            id: "number",
            title: "string",
            description: "string",
            status: "string",
            priority: "string",
            todoListId: "number",
          },
        },
      },
    },
    {
      type: "update_todo",
      description: "Updates an existing todo item.",
      payload: {
        type: "object",
        properties: {
          list: {
            type: "object",
            properties: {
              id: "number",
              title: "string",
              description: "string",
            },
          },
          todo: {
            type: "object",
            properties: {
              id: "number",
              title: "string",
              description: "string",
              status: "string",
              priority: "string",
              todoListId: "number",
            },
          },
        },
      },
    },
    {
      type: "delete_todo",
      description: "Deletes a todo item.",
      payload: {
        type: "object",
        properties: {
          id: "number",
        },
      },
    },
    {
      type: "add_todo_list",
      description: "Adds a new todo list.",
      payload: {
        type: "object",
        properties: {
          id: "string",
          title: "string",
          description: "string",
        },
      },
    },
    {
      type: "update_todo_list",
      description: "Updates an existing todo list.",
      payload: {
        type: "object",
        properties: {
          id: "number",
          title: "string",
          description: "string",
        },
      },
    },
    {
      type: "delete_todo_list",

      description: "Deletes a todo list.",
      payload: {
        type: "object",
        properties: {
          id: "number",
        },
      },
    },
    {
      type: "push_todos",
      description:
        "Syncs the current state of the application with the backend.",
      payload: {
        type: "object",
        properties: {
          todos: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: "number",
                title: "string",
                description: "string",
                status: "string",
                priority: "string",
                todoListId: "number",
              },
            },
          },
          todoLists: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: "number",
                title: "string",
                description: "string",
              },
            },
          },
        },
      },
    },
  ],
} as const;

export const DocsModal = () => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">View Docs</Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex h-full max-h-screen flex-col">
        <SheetHeader className="mb-2">
          <SheetTitle>{data.title}</SheetTitle>
          <SheetDescription className="">
            <p className="text-pretty text-left">
              BYOB (Bring Your Own Backend) mode allows the application to
              interact with a user-provided backend.
              <br />
              <span className="text-pretty ">
                When BYOB mode is enabled, the application will send events to
                the backend URL specified in the configuration.
              </span>
            </p>
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[85%] overflow-y-auto">
          <div className="grid gap-4 py-4">
            {data.events.map((event) => {
              return (
                <div key={event.type} className="rounded-lg p-4 shadow-sm">
                  <h3 className="text-lg font-semibold">{event.type}</h3>
                  <p className="text-sm text-muted-foreground">
                    {event.description}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <h4 className="text-sm font-semibold">Payload</h4>
                      <pre className="w-full text-sm text-secondary-foreground">
                        {JSON.stringify(event.payload, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
        <DownloadExampleBackend />
      </SheetContent>
    </Sheet>
  );
};

const DownloadExampleBackend = () => {
  const handleDownload = () => {
    const filePath = "/example_backend.ts";
    fetch(filePath)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filePath);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
      });
  };
  return (
    <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
      <p className="text-sm text-muted-foreground">Download Example Backend</p>
      <Button variant="secondary" onClick={handleDownload}>
        Download
      </Button>
    </div>
  );
};
