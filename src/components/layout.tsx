import { Menu, Package2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CategoriesList } from "./categories";

import { TodoList } from "./todos";
import { Heading } from "./category-heading";
import { useToggle } from "usehooks-ts";
import { Byob } from "./header";

export function Dashboard() {
  const [open, toggle] = useToggle(false);
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="h-18 flex items-center border-b px-4 lg:h-[60px] lg:px-6">
            <a href="/" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6" />
              <span className="">Local Todo</span>
            </a>
          </div>
          <div className="flex-1">
            <CategoriesList />
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet open={open} onOpenChange={toggle}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <CategoriesList toggle={toggle} />
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1" />
          <Byob />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <Heading />
          <div className="">
            <TodoList />
          </div>
        </main>
      </div>
    </div>
  );
}
