import { useConfig } from "@/hooks/use-config";
import { useStep } from "usehooks-ts";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { Button } from "./ui/button";
import { toast } from "sonner";

export const Onboarding = () => {
  const { config, toggleOnboardingScreen } = useConfig();
  const [currentStep, helpers] = useStep(5);
  const {
    canGoToPrevStep,
    canGoToNextStep,
    goToNextStep,
    goToPrevStep,
    setStep,
  } = helpers;

  const saveAndClose = () => {
    if (currentStep === 5) {
      toggleOnboardingScreen();
      toast("Onboarding completed, you can always access it from the settings");
      setStep(1);
      return;
    }
    toast.info("Complete the onboarding to continue");
  };
  return (
    <Dialog open={config.showOnboarding} onOpenChange={saveAndClose}>
      <DialogContent>
        <DialogHeader>
          <span className="text-lg font-semibold">{currentStep} / 5</span>
        </DialogHeader>
        {currentStep === 1 && (
          <div className="flex flex-col items-center justify-between">
            <h1 className="text-2xl font-semibold">Welcome to Local Todo</h1>
            <div className="space-y-2">
              <p className="text-md ">
                A simple todo app to keep track of your tasks that runs entirely
                on your device.
              </p>
            </div>
          </div>
        )}
        {currentStep === 2 && (
          <div className="flex flex-col items-center justify-between">
            <h1 className="text-2xl font-semibold">Add Categories</h1>
            <div className="space-y-2">
              <p className="text-md ">
                Add categories to group your todos, you can add as many
                categories as you want.
              </p>
            </div>
          </div>
        )}
        {currentStep === 3 && (
          <div className="flex flex-col items-center justify-between">
            <h1 className="text-2xl font-semibold">Add Todos</h1>
            <div className="space-y-2">
              <p className="text-md ">
                Add todos to your categories, you can mark them as done or
                delete them.
              </p>
            </div>
          </div>
        )}
        {currentStep === 4 && (
          <div className="flex flex-col items-center justify-between">
            <h1 className="text-2xl font-semibold">Edit Todos</h1>
            <div className="space-y-2">
              <p className="text-md ">
                You can edit your todos, update their status and delete them.
              </p>
            </div>
          </div>
        )}
        {currentStep === 5 && (
          <div className="flex flex-col items-center justify-between">
            <h1 className="text-2xl font-semibold">Data Sync</h1>
            <div className="space-y-2">
              <p className="text-md ">
                Sync your data with the remote server, push and pull your data
                to keep it in sync.
              </p>
            </div>
          </div>
        )}
        <div className="flex flex-1 justify-end space-x-4">
          <Button onClick={goToPrevStep} size="sm" disabled={!canGoToPrevStep}>
            Prev
          </Button>
          {currentStep === 5 ? (
            <Button onClick={saveAndClose} size="sm">
              Close
            </Button>
          ) : (
            <Button
              onClick={goToNextStep}
              size="sm"
              disabled={!canGoToNextStep}
            >
              Next
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
