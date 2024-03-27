import { toast } from "sonner";
import { useLocalStorage } from "usehooks-ts";
export interface Config {
  backendUrl: string;
  headers: Record<string, string>;
  byob: boolean;
  showOnboarding: boolean;
}
export const useConfig = () => {
  const [config, setConfig] = useLocalStorage<Config>("config", {
    backendUrl: "",
    headers: {
      "Content-Type": "application/json",
    },
    byob: false,
    showOnboarding: true,
  });
  const addHeaders = (key: string, value: string) => {
    setConfig((prev) => ({
      ...prev,
      headers: { ...prev.headers, [key]: value },
    }));
  };
  const removeHeaders = (key: string) => {
    setConfig((prev) => {
      const headers = { ...prev.headers };
      delete headers[key];
      return { ...prev, headers };
    });
  };
  const toggleByob = () => {
    setConfig((prev) => ({ ...prev, byob: !prev.byob }));
    toast("BYOB mode is now " + (!config.byob ? "enabled" : "disabled"));
  };
  const setBackendUrl = (url: string) => {
    setConfig((prev) => ({ ...prev, backendUrl: url }));
  };
  const toggleOnboardingScreen = () => {
    setConfig((prev) => ({ ...prev, showOnboarding: !prev.showOnboarding }));
  };
  return {
    config,
    setBackendUrl,
    addHeaders,
    removeHeaders,
    toggleByob,
    toggleOnboardingScreen,
  };
};
