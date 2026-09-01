import { useRef, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { FileText, Loader2, Trash2, UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

function isAccepted(file, accept) {
  const tokens = (accept || "")
    .split(",")
    .map((token) => token.trim())
    .filter(Boolean);
  if (!tokens.length) return true;

  const ext = file.name.toLowerCase().split(".").pop();
  return tokens.some((token) => {
    if (token.startsWith(".")) return `.${ext}` === token.toLowerCase();
    if (token.endsWith("/*")) return file.type.startsWith(token.slice(0, -1));
    if (token.includes("/")) return file.type === token;
    return false;
  });
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * FileDropzone — reusable drag-and-drop / click-to-upload component.
 *
 * Props:
 *   value      – Array of file objects currently stored in the parent (Redux).
 *   onChange   – Callback when files are added/removed. Receives the new array.
 *   accept     – Comma-separated accepted MIME types / extensions.
 *   maxSizeMB  – Optional max file size in MB.
 *   maxFiles   – Optional max number of files allowed.
 *   multiple   – Allow multiple files.
 *   label      – Label text above the dropzone.
 *   hint       – Hint text inside the dropzone.
 *   onUpload   – Optional async function(file) => uploadResult.
 */
export default function FileDropzone({
  value = [],
  onChange,
  accept = "",
  maxSizeMB,
  maxFiles,
  multiple = false,
  label,
  hint,
  onUpload,
}) {
  const { t } = useTranslation();
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState(null);

  // Store raw File references locally (not in Redux) keyed by file name
  const rawFilesRef = useRef(new Map());
  // Always have the latest value in the upload callback
  const valueRef = useRef(value);
  valueRef.current = value;

  const safeValue = Array.isArray(value) ? value : [];

  const uploadFile = useCallback(
    async (fileName) => {
      const rawFile = rawFilesRef.current.get(fileName);
      if (!rawFile) return;

      try {
        const uploadedData = await onUpload(rawFile);

        // Read the latest value at the time the upload completes
        const current = Array.isArray(valueRef.current) ? valueRef.current : [];
        const updatedEntry = {
          ...current.find((f) => f.name === fileName),
          uploading: false,
          uploadError: null,
          uploadedData,
        };

        const newValue = current.map((f) =>
          f.name === fileName && f.uploading ? updatedEntry : f,
        );
        onChange(newValue);
      } catch (err) {
        const message = err?.message ?? t("dropzone.uploadFailed");

        const current = Array.isArray(valueRef.current) ? valueRef.current : [];
        const newValue = current.map((f) =>
          f.name === fileName
            ? { ...f, uploading: false, uploadError: message }
            : f,
        );
        onChange(newValue);
      }
    },
    [onUpload, onChange, t],
  );

  const addFiles = (fileList) => {
    const incoming = Array.from(fileList);
    const valid = [];

    for (const file of incoming) {
      if (!isAccepted(file, accept)) {
        setError(t("dropzone.unsupportedFile", { name: file.name }));
        return;
      }
      if (maxSizeMB && file.size > maxSizeMB * 1024 * 1024) {
        setError(t("dropzone.tooLarge", { name: file.name, max: maxSizeMB }));
        return;
      }
      const entry = {
        name: file.name,
        size: file.size,
        type: file.type,
        preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
        uploading: Boolean(onUpload),
        uploadError: null,
        uploadedData: null,
      };
      valid.push(entry);

      // Store raw File reference locally (not in Redux)
      if (onUpload) {
        rawFilesRef.current.set(file.name, file);
      }
    }

    setError(null);

    const newValue = multiple ? [...safeValue, ...valid] : valid.slice(0, 1);
    if (maxFiles && newValue.length > maxFiles) {
      setError(t("dropzone.tooManyFiles", { max: maxFiles }));
      return;
    }

    onChange(newValue);

    if (onUpload) {
      valid.forEach((fileEntry) => {
        uploadFile(fileEntry.name);
      });
    }
  };

  const removeFile = (index) => {
    const removed = safeValue[index];
    if (removed?.preview) URL.revokeObjectURL(removed.preview);
    rawFilesRef.current.delete(removed?.name);
    onChange(safeValue.filter((_, i) => i !== index));
  };

  const hasUploading = safeValue.some((f) => f.uploading);

  const sizeLabel = maxSizeMB ? `${maxSizeMB} MB` : null;

  const filesLabel = maxFiles
    ? `${safeValue.length}/${maxFiles}`
    : safeValue.length > 0
      ? `${safeValue.length}`
      : null;

  return (
    <div className="flex h-full flex-col">
      {label && <p className="mb-1.5 text-sm font-medium">{label}</p>}

      <div
        role="button"
        tabIndex={0}
        onClick={() => !hasUploading && inputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !hasUploading)
            inputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (!hasUploading) addFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex min-h-[140px] flex-1 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed px-4 py-6 text-center transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          dragging
            ? "border-primary bg-accent"
            : "border-border bg-muted/40 hover:border-primary/50",
          hasUploading && "pointer-events-none opacity-60",
        )}
      >
        <UploadCloud className="h-6 w-6 text-muted-foreground" />
        <p className="text-sm font-medium">{t("dropzone.clickOrDrag")}</p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}

        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          {sizeLabel && <span>{t("dropzone.maxSize", { max: sizeLabel })}</span>}
          {filesLabel && (
            <>
              {sizeLabel && <span aria-hidden="true">·</span>}
              <span>
                {maxFiles
                  ? t("dropzone.fileCount", { current: safeValue.length, max: maxFiles })
                  : t("dropzone.filesUploaded", { count: safeValue.length })}
              </span>
            </>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) addFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}

      {safeValue.length > 0 && (
        <ul className="mt-3 space-y-2">
          {safeValue.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center gap-3 rounded-md border border-border bg-muted/40 p-2"
            >
              {file.preview ? (
                <img
                  src={file.preview}
                  alt={file.name}
                  className="h-10 w-10 shrink-0 rounded object-cover"
                />
              ) : (
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-brand-gradient-soft text-primary">
                  <FileText className="h-5 w-5" />
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatBytes(file.size)}
                </p>
                {file.uploadError && (
                  <p className="mt-0.5 text-xs text-destructive">
                    {file.uploadError}
                  </p>
                )}
                {file.uploadedData && !file.uploading && (
                  <p className="mt-0.5 text-xs text-green-600">
                    {t("dropzone.uploaded")}
                  </p>
                )}
              </div>

              {file.uploading ? (
                <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" />
              ) : (
                <button
                  type="button"
                  title={t("dropzone.remove")}
                  aria-label={t("dropzone.remove")}
                  onClick={() => removeFile(index)}
                  className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
