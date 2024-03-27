import { Row } from "@tanstack/react-table";
import { TodoForm } from "./todos";
import { Todo, useTodos } from "@/hooks/use-todos";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const task = row.original as Todo;
  const { updateTodo, store } = useTodos();
  return (
    <TodoForm
      label="Edit"
      listId={store.currentTodoListId || 0}
      defaultValues={task}
      onSubmit={(todo) => {
        updateTodo(task.id, todo);
      }}
    />
  );
}
