import { useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { logout } from "@/store/slices/authSlice";

import logoutIcon from "@/assets/icons/logout.svg";

export default function LogoutDialog({
  open,
  onOpenChange,
  onSuccess,
  successTitle,
  successDescription,
  successLabel,
  confirmLabel,
  cancelLabel,
  title,
  description,
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [step, setStep] = useState("confirm"); // "confirm" | "success"

  const resolvedTitle = title ?? t("nav.logout");
  const resolvedDescription =
    description ?? t("auth.logoutConfirm") ?? "Are you sure you want to log out?";
  const resolvedConfirmLabel = confirmLabel ?? t("nav.logout");
  const resolvedCancelLabel = cancelLabel ?? t("common.cancel") ?? "Cancel";
  const resolvedSuccessTitle =
    successTitle ?? t("auth.logoutSuccess") ?? "Logged Out";
  const resolvedSuccessDescription =
    successDescription ??
    t("auth.logoutSuccessMessage") ??
    "You have been logged out successfully.";
  const resolvedSuccessLabel = successLabel ?? t("common.ok") ?? "OK";

  const handleConfirm = () => {
    dispatch(logout());
    setStep("success");
  };

  const handleSuccessClose = () => {
    setStep("confirm");
    onSuccess?.();
  };

  const handleOpenChange = (value) => {
    if (!value) setStep("confirm");
    onOpenChange(value);
  };

  if (step === "success") {
    return (
      <AlertDialog open={open} onOpenChange={handleSuccessClose}>
        <AlertDialogContent className="gap-6 sm:max-w-md">
          <AlertDialogHeader className="items-center gap-4 text-center">
            <img src={logoutIcon} alt="" className="h-14 w-14" />
            <AlertDialogTitle className="text-xl font-semibold text-foreground">
              {resolvedSuccessTitle}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              {resolvedSuccessDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center">
            <AlertDialogAction
              onClick={handleSuccessClose}
              className="bg-brand-gradient text-white hover:opacity-95 sm:w-32"
            >
              {resolvedSuccessLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="gap-6 sm:max-w-md">
        <AlertDialogHeader className="items-center gap-4 text-center">
          <img src={logoutIcon} alt="" className="h-14 w-14" />
          <AlertDialogTitle className="text-xl font-semibold text-foreground">
            {resolvedTitle}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-muted-foreground">
            {resolvedDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <AlertDialogCancel className="w-full sm:w-32">
            {resolvedCancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90 sm:w-32"
          >
            {resolvedConfirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
