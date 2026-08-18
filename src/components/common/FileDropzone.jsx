import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FileText, Trash2, UploadCloud } from "lucide-react";
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

export default function FileDropzone({
  value = [],
  onChange,
  accept = "",
  maxSizeMB,
  multiple = false,
  label,
  hint,
}) {
  const { t } = useTranslation();
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState(null);

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
      valid.push({
        name: file.name,
        size: file.size,
        type: file.type,
        preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
      });
    }

    setError(null);
    onChange(multiple ? [...value, ...valid] : valid.slice(0, 1));
  };

  const removeFile = (index) => {
    const removed = value[index];
    if (removed?.preview) URL.revokeObjectURL(removed.preview);
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div>
      {label && <p className="mb-1.5 text-sm font-medium">{label}</p>}

      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed px-4 py-6 text-center transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          dragging ? "border-primary bg-accent" : "border-border bg-muted/40 hover:border-primary/50"
        )}
      >
        <UploadCloud className="h-6 w-6 text-muted-foreground" />
        <p className="text-sm font-medium">{t("dropzone.clickOrDrag")}</p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        {maxSizeMB && (
          <p className="text-xs text-muted-foreground">
            {t("dropzone.maxSize", { max: maxSizeMB })}
          </p>
        )}
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

      {value.length > 0 && (
        <ul className="mt-3 space-y-2">
          {value.map((file, index) => (
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
                <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
              </div>
              <button
                type="button"
                title={t("dropzone.remove")}
                aria-label={t("dropzone.remove")}
                onClick={() => removeFile(index)}
                className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
