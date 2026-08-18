import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LogIn } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BrandLogo from "@/components/common/BrandLogo";
import { loginSuccess } from "@/store/slices/authSlice";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: replace with real API call
    dispatch(loginSuccess({ id: "1", name: "Ali Raza", email: "ali@example.com" }));
    navigate("/dashboard");
  };

  return (
    <Card className="border-none shadow-2xl">
      <CardHeader className="items-center gap-3 text-center">
        <BrandLogo className="h-9 w-auto" />
        <div>
          <CardTitle className="text-xl">{t("auth.title")}</CardTitle>
          <CardDescription className="mt-1">{t("auth.subtitle")}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <Label htmlFor="email">{t("auth.email")}</Label>
            <Input id="email" type="email" placeholder="you@example.com" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">{t("auth.password")}</Label>
            <Input id="password" type="password" placeholder="••••••••" required />
          </div>
          <Button type="submit" className="w-full">
            <LogIn className="h-4 w-4" />
            {t("auth.signIn")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
