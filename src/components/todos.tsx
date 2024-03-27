import {
  Priority,
  Todo,
  TodoStatus,
  priorities,
  statuses,
  useStore,
} from "@/hooks/use-store";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  SelectContent,
  Select,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Textarea } from "./ui/textarea";
import { CategoryForm } from "./categories";
import { toast } from "sonner";
import { Pencil2Icon } from "@radix-ui/react-icons";

export const TodoList = () => {
  const { store } = useStore();
  const todos = store.todos.filter(
    (todo) => todo.todoListId === store.currentTodoListId,
  );
  if (todos.length === 0) {
    return <EmptyState />;
  }
  return <DataTable data={todos} columns={columns} />;
};

export const TodoForm = ({
  label = "Add Todo",
  listId,
  onSubmit,
  defaultValues,
  successMessage,
}: {
  label?: string;
  listId: number;
  onSubmit: (todo: Omit<Todo, "id">) => void;
  defaultValues?: Omit<Todo, "id">;
  successMessage?: string;
}) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(defaultValues?.title ?? "");
  const [description, setDescription] = useState(
    defaultValues?.description ?? "",
  );
  const [status, setStatus] = useState(defaultValues?.status ?? "backlog");
  const [priority, setPriority] = useState<Priority>(
    defaultValues?.priority ?? "low",
  );
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description, status, priority, todoListId: listId });
    setOpen(false);
    setTitle("");
    setDescription("");
    toast.success(successMessage ?? "Todo added successfully");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {label === "Edit" ? (
          <Button variant="outline" size="icon">
            <Pencil2Icon className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="default" size="sm">
            {label}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
          <div>
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex flex-row items-center justify-between space-x-2">
            <Select
              value={status}
              onValueChange={(e) => setStatus(e as TodoStatus)}
            >
              <SelectTrigger>
                <SelectValue placeholder={status} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  {statuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select
              value={priority}
              onValueChange={(e) => setPriority(e as Priority)}
            >
              <SelectTrigger>
                <SelectValue placeholder={priority} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Priority</SelectLabel>
                  {priorities.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit">Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const EmptyState = () => {
  const { addTodo, store, addTodoList } = useStore();

  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <h3 className="text-2xl font-bold tracking-tight">You have no todos</h3>
      <p className="text-sm text-muted-foreground">
        You can start adding todos as soon as you add a todo list.
      </p>
      {store.currentTodoListId ? (
        <TodoForm
          listId={store.currentTodoListId}
          onSubmit={(todo) => {
            addTodo(todo);
          }}
        />
      ) : (
        <CategoryForm
          onSubmit={function (title: string, description: string) {
            addTodoList({ title, description });
          }}
        />
      )}
    </div>
  );
};
