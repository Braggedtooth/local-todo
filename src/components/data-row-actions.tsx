import { Row } from "@tanstack/react-table";
import { TodoForm } from "./todos";
import { Todo, useStore } from "@/hooks/use-store";
import { Button } from "./ui/button";
import { Cross2Icon, CrossCircledIcon } from "@radix-ui/react-icons";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const task = row.original as Todo;
  const { updateTodo, store, deleteTodo } = useStore();
  return (
    <div className="flex gap-2">
      <TodoForm
        label="Edit"
        successMessage="Todo updated successfully"
        listId={store.currentTodoListId || 0}
        defaultValues={task}
        onSubmit={(todo) => {
          updateTodo(task.id, todo);
        }}
      />
      <Button
        variant="destructive"
        onClick={() => {
          deleteTodo(task.id);
        }}
        size="icon"
      >
        <Cross2Icon className="h-4 w-4" />
      </Button>
    </div>
  );
}
