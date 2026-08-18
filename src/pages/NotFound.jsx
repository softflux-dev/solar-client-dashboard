import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-6 text-center">
      <p className="text-brand-gradient text-6xl font-semibold">404</p>
      <p className="text-muted-foreground">{t("notFound.text")}</p>
      <Button asChild>
        <Link to="/dashboard">{t("notFound.back")}</Link>
      </Button>
    </div>
  );
}
