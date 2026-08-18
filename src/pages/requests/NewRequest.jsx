import { useLayoutEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import SolarRequestForm from "@/components/features/requests/SolarRequestForm";
import { initForm } from "@/store/slices/requestsSlice";
import { clearSelectedCompany } from "@/store/slices/solarRequestsSlice";

export default function NewRequest() {
  const dispatch = useDispatch();

  const selectedCompanyId = useSelector(
    (state) => state.solarRequests.selectedCompanyId
  );
  const selectedCompany = useSelector((state) =>
    state.solarRequests.companies.find(
      (c) => c.id === state.solarRequests.selectedCompanyId
    )
  );

  // Initialize the form once per mount. If a specific company was chosen
  // (via a company-row "Get Quotations" click), pre-select it and skip the
  // company-selection step.
  const initialized = useRef(false);
  useLayoutEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    dispatch(
      initForm({
        step: 0,
        companyIds: selectedCompanyId ? [selectedCompanyId] : [],
        sourceCompanyName: selectedCompany?.name ?? null,
        skipCompanyStep: Boolean(selectedCompanyId),
      })
    );
    if (selectedCompanyId) dispatch(clearSelectedCompany());
  }, [dispatch, selectedCompanyId, selectedCompany?.name]);

  return (
    <SolarRequestForm />
  );
}
