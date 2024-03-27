import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CategoriesList } from "./categories";

import { TodoList } from "./todos";
import { Heading } from "./category-heading";
import { useToggle } from "usehooks-ts";
import { Byob } from "./header";
import { Onboarding } from "./onboarding";
import { Icons } from "./icons";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

export function Dashboard() {
  const [open, toggle] = useToggle(false);
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2 space-y-2">
          <div className="h-18 flex items-center border-b p-4">
            <a href="/" className="flex items-center gap-2 font-semibold">
              <Icons.logo className="h-6 w-6" />
              <span className="">Local Todo</span>
            </a>
          </div>
          <div className="grid gap-2 px-4 text-lg font-medium">
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
                <Icons.menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col space-y-2">
              <div className="mb-2 flex items-center gap-2 text-lg font-semibold">
                <Icons.logo />
                <span className="">Local Todo</span>
              </div>
              {/* <div className="mb-2 grid gap-2 text-lg font-medium"> */}
              <CategoriesList toggle={toggle} />
              {/* </div> */}
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1" />
          <Byob />
          <a
            className={cn(
              buttonVariants({
                variant: "link",
                size: "icon",
                className: "shrink-0",
              }),
            )}
            target="_blank"
            rel="noreferrer"
            href="https://github.com/Braggedtooth/local-todo"
          >
            <GitHubLogoIcon className="h-5 w-5" />
          </a>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <Heading />
          <div className="flex-1">
            <TodoList />
          </div>
          <Onboarding />
        </main>
      </div>
    </div>
  );
}
