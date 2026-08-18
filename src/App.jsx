import AppRoutes from "@/routes/AppRoutes";
import { useLanguageDirection } from "@/hooks/useLanguageDirection";

export default function App() {
  // Keeps <html lang="" dir=""> in sync with the active i18n language
  useLanguageDirection();

  return <AppRoutes />;
}
