import { useEffect, useId } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { fetchProvinces } from "@/store/slices/electricitySlice";
import { setRegion } from "@/store/slices/solarRequestsSlice";
import LookupStatus from "@/components/common/LookupStatus";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function RegionFilter() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const id = useId();
  const provinces = useSelector((state) => state.electricity.provinces);
  const region = useSelector((state) => state.solarRequests.selectedRegion);
  const loading = provinces.status === "idle" || provinces.status === "loading";
  useEffect(() => { dispatch(fetchProvinces()); }, [dispatch]);

  return (
    <div className="min-w-0 space-y-2">
      <Select value={region} onValueChange={(value) => dispatch(setRegion(value))}>
        <SelectTrigger aria-label={t("solar.allRegions")} aria-describedby={id} loading={loading}>
          <SelectValue placeholder={t("solar.allRegions")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("solar.allRegions")}</SelectItem>
          {provinces.items.map((province) => <SelectItem key={province} value={province}>{province}</SelectItem>)}
          {loading && <div className="px-3 py-2 text-sm text-muted-foreground">{t("common.loading")}</div>}
        </SelectContent>
      </Select>
      <span id={id} className="sr-only" role="status">{loading ? t("common.loading") : ""}</span>
      <LookupStatus lookup={provinces} onRetry={() => dispatch(fetchProvinces())} />
    </div>
  );
}
