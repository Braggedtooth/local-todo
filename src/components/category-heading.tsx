import { useStore } from "@/hooks/use-store";
import { CategoryForm } from "@/components/categories";
import { Button } from "@/components/ui/button";
import { Cross2Icon } from "@radix-ui/react-icons";

export const Heading = () => {
  const { store, deleteTodoList, updateTodoList } = useStore();
  const currentCategory = store.todoList.find(
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
              successMessage="Category updated successfully"
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
              size="icon"
              onClick={() => deleteTodoList(currentCategory?.id)}
            >
              <Cross2Icon className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <p className="text-muted-foreground">{currentCategory?.description}</p>
    </div>
  );
};
