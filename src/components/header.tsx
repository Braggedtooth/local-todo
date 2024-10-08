import { useConfig } from "@/hooks/use-config";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";

import { useState } from "react";
import { useStore } from "@/hooks/use-store";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ReloadIcon,
  GearIcon,
  Cross1Icon,
  PlusIcon,
} from "@radix-ui/react-icons";
import { DocsModal } from "./docs-modal";
import { useDebounceValue } from "usehooks-ts";
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { ScrollArea } from "./ui/scroll-area";

export const Byob = () => {
  const {
    config,
    toggleByob,
    setBackendUrl,
    toggleOnboardingScreen,
    toggleForcePush,
  } = useConfig();
  const [url, setUrl] = useState(config.backendUrl ?? "");
  const [backendUrl] = useDebounceValue(url, 500);
  const {
    pullRemoteStore,
    pushRemoteStore,
    store,
    remoteStore,
    pullLoading,
    pushLoading,
  } = useStore();

  const todoCount = store?.todos?.length;
  const remoteTodoCount = remoteStore?.todos?.length || 0;
  const listCount = store?.todoList?.length;
  const remoteListCount = remoteStore?.todoList?.length || 0;
  const shouldPush = todoCount > remoteTodoCount || listCount > remoteListCount; //  if local data is more than remote data then push
  const shouldPull = remoteTodoCount > todoCount || remoteListCount > listCount; // if remote data is more than local data then pull

  return (
    <Sheet>
      <SheetTrigger>
        <div className="flex items-center gap-2 text-sm font-medium">
          <GearIcon className={cn("h-5 w-5", config.byob && "text-primary")} />
          <span className={cn(config.byob && "text-primary")}>BYOB</span>
        </div>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <div className="flex flex-col gap-2 ">
          <p className="text-sm text-muted-foreground">
            BYOB stands for Bring Your Own Backend. When enabled, the app will
            send event to the specified backend URL with the specified headers.
          </p>
          <DocsModal />
          <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <p className="text-sm text-muted-foreground">Enable BYOB</p>
            <Switch
              checked={config.byob ? true : false}
              onCheckedChange={toggleByob}
            />
          </div>
          <ScrollArea className="h-80 max-h-svh overflow-y-auto py-3 lg:h-full">
            <div className="space-y-4">
              {config.byob && (
                <div className="space-y-4">
                  <div className="flex flex-col space-y-2 rounded-lg border p-3 shadow-sm">
                    <span className="text-sm text-muted-foreground">
                      Backend URL
                    </span>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="Backend URL"
                        value={url}
                        onChange={(e) => {
                          const value = e.target.value;
                          setUrl(value);
                        }}
                        className="input"
                      />
                      {config.backendUrl ? (
                        <Button
                          onClick={() => {
                            setBackendUrl("");
                          }}
                          className="button button-secondary"
                        >
                          Clear
                        </Button>
                      ) : (
                        <Button
                          onClick={() => {
                            setBackendUrl(backendUrl);
                          }}
                          className="button button-secondary"
                        >
                          Set
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col rounded-lg border p-3 shadow-sm">
                    <span className="text-sm text-muted-foreground">
                      Headers
                    </span>
                    <div className="flex w-full  flex-col gap-2 space-y-0.5 py-2">
                      {Object.entries(config.headers).map(([key, value]) => (
                        <HeaderItem hkey={key} value={value} key={key} />
                      ))}
                    </div>
                    <AddHeader />
                  </div>
                  <div className="flex flex-col rounded-lg border p-3 shadow-sm">
                    <span className="text-sm text-muted-foreground">
                      Data Sync
                    </span>
                    <p className="text-sm text-muted-foreground">
                      Sync your data with the remote server
                    </p>
                    <div className="flex flex-row items-center gap-2">
                      {!shouldPush && !shouldPull ? (
                        <p className="w-full py-2 text-sm text-green-500">
                          Data is in sync
                        </p>
                      ) : (
                        <p className="w-full py-2 text-sm text-red-500">
                          Data is not in sync
                        </p>
                      )}
                      {shouldPull && !shouldPush && (
                        <div className="flex flex-row items-center gap-2">
                          <Switch
                            id="force-push"
                            checked={!config.forcePush}
                            onCheckedChange={toggleForcePush}
                          />
                          <Label htmlFor="force-push">Force push?</Label>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-row space-x-2 ">
                      <Button
                        variant="secondary"
                        className="my-2 flex w-full items-center gap-2 "
                        disabled={!shouldPush || pushLoading}
                        onClick={() => pushRemoteStore()}
                      >
                        {pushLoading && (
                          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Push
                        <ArrowUpIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        className="my-2 flex w-full items-center gap-2  space-x-2 "
                        disabled={!shouldPull || pullLoading}
                        onClick={pullRemoteStore}
                      >
                        {pullLoading && (
                          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Pull
                        <ArrowDownIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex flex-col space-y-5 rounded-lg border p-3 shadow-sm">
                <p className="text-sm text-muted-foreground">Export Data</p>
                <ExportButton />
              </div>
            </div>
          </ScrollArea>
          <div className="flex flex-col space-y-5 rounded-lg border p-3 shadow-sm">
            <p className="text-sm text-muted-foreground">
              Show Onboarding Screen
            </p>

            <Button
              onClick={toggleOnboardingScreen}
              variant="outline"
              className="button button-primary"
            >
              Show Onboarding
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const truncate = (str: string, n: number) =>
  str.length > n ? str.substr(0, n - 1) + "..." : str;

const HeaderItem = ({ hkey, value }: { hkey: string; value: string }) => {
  const { removeHeaders } = useConfig();
  return (
    <div className="flex flex-wrap justify-between gap-2 rounded-lg border p-2">
      <div className="flex flex-grow gap-2 space-x-1">
        <span className="text-sm text-muted-foreground">{hkey}</span>
        <span className="truncate break-all text-sm font-medium">
          {truncate(value, 20)}
        </span>
      </div>
      <Button
        size={"icon"}
        variant={"destructive"}
        className="h-6 w-6"
        onClick={() => removeHeaders(hkey)}
      >
        <Cross1Icon className="h-4 w-4" />
      </Button>
    </div>
  );
};

const AddHeader = () => {
  const { addHeaders } = useConfig();
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");

  return (
    <div className="flex gap-2">
      <Input
        type="text"
        placeholder="Authorization"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        className="input"
      />
      <Input
        type="text"
        placeholder="Bearer: xxxxxx"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="input"
      />
      <Button
        onClick={() => {
          addHeaders(key, value);
          setKey("");
          setValue("");
        }}
      >
        <PlusIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};

const ExportButton = () => {
  const exportData = () => {
    const data = JSON.stringify(localStorage, null, "\t");
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    a.click();
  };
  return (
    <Button variant="outline" onClick={exportData} className="mt-4">
      Export Data
    </Button>
  );
};
