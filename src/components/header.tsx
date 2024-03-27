import { useTodos } from "@/hooks/use-todos";
import { CategoryForm } from "@/components/categories";
import { Button } from "@/components/ui/button";

export const Heading = () => {
  const { store, deleteTodoList, updateTodoList } = useTodos();
  const currentCategory = store.todolist.find(
    (list) => list.id === store.currentTodoListId,
  );

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">
          {currentCategory?.title}
        </h1>
        {currentCategory && (
          <div className="flex gap-2">
            <CategoryForm
              defaultTitle={currentCategory?.title}
              defaultDescription={currentCategory?.description}
              triggerLabel="Edit Category"
              modalTitle="Edit Category"
              saveBtnLabel="Save"
              onSubmit={(title, description) => {
                updateTodoList(currentCategory?.id, {
                  title,
                  description,
                });
              }}
            />
            <Button
              variant="destructive"
              className="shrink-0"
              onClick={() => deleteTodoList(currentCategory?.id)}
            >
              Delete
            </Button>
          </div>
        )}
      </div>

      <p className="text-muted-foreground">{currentCategory?.description}</p>
    </div>
  );
};
