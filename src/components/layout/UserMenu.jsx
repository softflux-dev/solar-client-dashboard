import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import SuccessDialog from "@/components/common/SuccessDialog";
import { logout } from "@/store/slices/authSlice";

import settingIcon from "@/assets/icons/setting.svg";
import logoutIcon from "@/assets/icons/logout.svg";

export default function UserMenu() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const displayName = user?.fullName ?? user?.email ?? "User";
  const initials = displayName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showLogoutSuccess, setShowLogoutSuccess] = useState(false);

  const handleLogoutConfirm = () => {
    setShowLogoutConfirm(false);
    dispatch(logout());
    setShowLogoutSuccess(true);
  };

  const handleLogoutSuccessClose = () => {
    setShowLogoutSuccess(false);
    navigate("/login");
  };

  
    const menuItemClass =
    "group flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-muted-foreground outline-none transition-colors hover:bg-brand-gradient hover:text-white focus-visible:bg-brand-gradient focus-visible:text-white";

  return (
    <>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <Avatar>
            <AvatarImage src={user?.avatarUrl} alt={displayName} />
            <AvatarFallback className="bg-brand-gradient text-white">
              {initials || "U"}
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-start lg:block">
            <span className="block text-sm font-medium leading-tight">
              {displayName}
            </span>
            <span className="block max-w-40 truncate text-xs leading-tight text-muted-foreground">
              {user?.email}
            </span>
          </span>
          <ChevronDown className="hidden h-4 w-4 text-muted-foreground lg:block" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 p-1">
        {/* Profile header — rounded pic with name & email underneath */}
        <DropdownMenuLabel className="flex flex-col items-center gap-2 px-2 py-3 text-center">
          <Avatar className="h-14 w-14">
            <AvatarImage src={user?.avatarUrl} alt={displayName} />
            <AvatarFallback className="bg-brand-gradient text-lg text-white">
              {initials || "U"}
            </AvatarFallback>
          </Avatar>
          <span className="block text-sm font-semibold text-foreground">
            {displayName}
          </span>
          <span className="block max-w-44 truncate text-xs text-muted-foreground">
            {user?.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className={menuItemClass}>
          <button type="button" onClick={() => navigate("/settings")}>
            <img
              src={settingIcon}
              alt=""
              className="h-4 w-4 shrink-0 transition group-hover:brightness-0 group-hover:invert group-focus-visible:brightness-0 group-focus-visible:invert"
            />
            {t("nav.settings")}
          </button>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className={menuItemClass}>
          <button
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
          >
            <img
              src={logoutIcon}
              alt=""
              className="h-4 w-4 shrink-0 transition group-hover:brightness-0 group-hover:invert group-focus-visible:brightness-0 group-focus-visible:invert"
            />
            {t("nav.logout")}
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
      <AlertDialogContent className="gap-6 sm:max-w-md">
        <AlertDialogHeader className="items-center gap-4 text-center">
          <img src={logoutIcon} alt="" className="h-14 w-14" />
          <AlertDialogTitle className="text-xl font-semibold text-foreground">
            {t("nav.logout")}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-muted-foreground">
            {t("auth.logoutConfirm") ?? "Are you sure you want to log out?"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <AlertDialogCancel className="w-full sm:w-32">
            {t("common.cancel") ?? "Cancel"}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleLogoutConfirm}
            className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90 sm:w-32"
          >
            {t("nav.logout")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <SuccessDialog
      open={showLogoutSuccess}
      onOpenChange={handleLogoutSuccessClose}
      title={t("auth.logoutSuccess") ?? "Logged Out"}
      description={t("auth.logoutSuccessMessage") ?? "You have been logged out successfully."}
      confirmLabel={t("common.ok") ?? "OK"}
      onConfirm={handleLogoutSuccessClose}
    />
  </>
  );
}
