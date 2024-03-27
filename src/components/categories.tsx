import { useStore } from "@/hooks/use-store";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ScrollArea } from "./ui/scroll-area";

export const CategoriesList = ({ toggle }: { toggle?: () => void }) => {
  const { store, setActiveTodoList, addTodoList } = useStore();
  const [categories, setCategories] = useState(store.todoList);

  useEffect(() => {
    setCategories(store.todoList);
  }, [store.todoList]);
  return (
    <div className="grid gap-2 px-4 text-lg font-medium">
      <ScrollArea className="max-h-[45rem]">
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => {
              setActiveTodoList(category.id);
              toggle?.();
            }}
            className={cn(
              "mx-[-0.65rem] flex cursor-pointer items-center gap-4 rounded-xl px-3 py-2  text-muted-foreground hover:text-foreground",
              store.currentTodoListId === category.id &&
                "bg-muted text-foreground ",
            )}
          >
            <h3 className="">{category.title}</h3>
          </div>
        ))}
      </ScrollArea>
      <CategoryForm
        onSubmit={(title, description) => {
          addTodoList({ title, description });
          toggle?.();
        }}
      />
    </div>
  );
};

export const CategoryForm = ({
  onSubmit,
  defaultTitle = "",
  defaultDescription = "",
  triggerLabel = "Add Category",
  modalTitle = "New Category",
  saveBtnLabel = "Save",
  successMessage = "Category added successfully",
}: {
  onSubmit: (title: string, description: string) => void;
  defaultTitle?: string;
  defaultDescription?: string;
  triggerLabel?: string;
  modalTitle?: string;
  saveBtnLabel?: string;
  successMessage?: string;
}) => {
  const [title, setTitle] = useState(defaultTitle);
  const [description, setDescription] = useState(defaultDescription);
  const [open, setOpen] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      onSubmit(title, description);
    } catch (error) {
      toast.error(
        (error as Error)?.message ??
          "Category with the same title already exists",
      );
      return;
    }
    setTitle("");
    setDescription("");
    setOpen(false);
    toast.success(successMessage);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{modalTitle}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
          <div className="space-y-4 py-4">
            <div className="gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                className="col-span-3"
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={description}
                className="col-span-3"
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{saveBtnLabel}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
