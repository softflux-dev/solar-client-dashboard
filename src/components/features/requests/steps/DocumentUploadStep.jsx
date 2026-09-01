import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import FileDropzone from "@/components/common/FileDropzone";
import StepHeader from "@/components/features/requests/StepHeader";
import { updateFormData } from "@/store/slices/requestsSlice";
import { uploadToCloudinary } from "@/lib/cloudinaryUpload";

// Accepted file types
const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp";
const BILL_ACCEPT = `${IMAGE_ACCEPT},application/pdf,.pdf`;
const VIDEO_ACCEPT = "video/mp4,video/quicktime,.mp4,.mov";

// Max file sizes (in MB)
const IMAGE_MAX_MB = 5;
const BILL_MAX_MB = 5;
const VIDEO_MAX_MB = 50;

export default function DocumentUploadStep() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const documents = useSelector((state) => state.requests.formData.documents);

  const handleChange = (field, value) => {
    dispatch(updateFormData({ section: "documents", data: { [field]: value } }));
  };

  return (
    <div>
      <StepHeader
        title={t("requestForm.steps.documents")}
        description={t("requestForm.steps.documentsHint")}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Electricity Bill — images or PDF, single file */}
        <FileDropzone
          label={t("requestForm.documents.electricityBill")}
          hint={t("requestForm.documents.electricityBillHint")}
          accept={BILL_ACCEPT}
          maxSizeMB={BILL_MAX_MB}
          value={documents.electricityBill}
          onChange={(v) => handleChange("electricityBill", v)}
          onUpload={uploadToCloudinary}
        />

        {/* Roof Images — multiple images, max 5 */}
        <FileDropzone
          label={t("requestForm.documents.roofImages")}
          hint={t("requestForm.documents.roofImagesHint")}
          accept={IMAGE_ACCEPT}
          maxSizeMB={IMAGE_MAX_MB}
          multiple
          maxFiles={5}
          value={documents.roofImages}
          onChange={(v) => handleChange("roofImages", v)}
          onUpload={uploadToCloudinary}
        />

        {/* Property Front — single image */}
        <FileDropzone
          label={t("requestForm.documents.propertyFront")}
          hint={t("requestForm.documents.propertyFrontHint")}
          accept={IMAGE_ACCEPT}
          maxSizeMB={IMAGE_MAX_MB}
          value={documents.propertyFront}
          onChange={(v) => handleChange("propertyFront", v)}
          onUpload={uploadToCloudinary}
        />

        {/* Site Video — optional video, single file */}
        <FileDropzone
          label={t("requestForm.documents.siteVideo")}
          hint={t("requestForm.documents.siteVideoHint")}
          accept={VIDEO_ACCEPT}
          maxSizeMB={VIDEO_MAX_MB}
          value={documents.siteVideo}
          onChange={(v) => handleChange("siteVideo", v)}
          onUpload={uploadToCloudinary}
        />
      </div>
    </div>
  );
}
