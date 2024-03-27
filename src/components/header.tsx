import { useConfig } from "@/hooks/use-config";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { PlusIcon, Settings, XCircleIcon } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/hooks/use-store";
import { ArrowUpIcon, ArrowDownIcon, ReloadIcon } from "@radix-ui/react-icons";
import { DocsModal } from "./docs-modal";
import { useDebounceValue } from "usehooks-ts";

export const Byob = () => {
  const { config, toggleByob, setBackendUrl, toggleOnboardingScreen } =
    useConfig();
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
    <Popover>
      <PopoverTrigger>
        <div className="flex items-center gap-2 text-sm font-medium">
          <Settings className="h-5 w-5" />
          <span>BYOB</span>
          <span
            className={cn(
              "text-muted-foreground",
              config.byob && "text-green-400",
            )}
          >
            {config.byob ? "Enabled" : "Disabled"}
          </span>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[28rem]">
        <div className="flex flex-col gap-2 p-4">
          <p className="text-sm text-muted-foreground">
            BYOB stands for Bring Your Own Backend. When enabled, the app will
            send event to the specified backend URL with the specified headers.
            <DocsModal />
          </p>
          <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <p className="text-sm text-muted-foreground">Enable BYOB</p>
            <Switch
              checked={config.byob ? true : false}
              onCheckedChange={toggleByob}
            />
          </div>

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
                <span className="text-sm text-muted-foreground">Headers</span>
                <div className="flex w-full  flex-col gap-2 space-y-0.5 py-2">
                  {Object.entries(config.headers).map(([key, value]) => (
                    <HeaderItem hkey={key} value={value} key={key} />
                  ))}
                </div>
                <AddHeader />
              </div>
              <div className="flex flex-col rounded-lg border p-3 shadow-sm">
                <span className="text-sm text-muted-foreground">Data Sync</span>
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
                <ExportButton />
              </div>
            </div>
          )}
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
      </PopoverContent>
    </Popover>
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
        <XCircleIcon className="h-4 w-4" />
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
        placeholder="Key"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        className="input"
      />
      <Input
        type="text"
        placeholder="Value"
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
    const data = JSON.stringify(localStorage);
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
