import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import checkIcon from "@/assets/icons/dashboardIcons/approvedQuotations.svg";

export default function SuccessDialog({
  open,
  onOpenChange,
  title = "Success",
  description,
  children,
  confirmLabel = "OK",
  onConfirm,
  contentClassName = "",
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className={`gap-6 sm:max-w-md ${contentClassName}`}>
        <AlertDialogHeader className="items-center gap-4 text-center">
          <img src={checkIcon} alt="" className="h-14 w-14" />
          <AlertDialogTitle className="text-xl font-semibold text-foreground">
            {title}
          </AlertDialogTitle>
          {children ?? (
            <AlertDialogDescription className="text-sm text-muted-foreground">
              {description}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center">
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-brand-gradient text-white hover:opacity-95 sm:w-32"
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
