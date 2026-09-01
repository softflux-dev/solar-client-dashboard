export const uploadToCloudinary = async (file) => {
  const url = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/auto/upload`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });
  const data = await response.json();

  if (!response.ok || !data?.secure_url) {
    throw new Error(data?.error?.message || "Cloudinary upload failed");
  }

  const derivedName =
    data.original_filename && data.format
      ? `${data.original_filename}.${data.format}`
      : file?.name || data.original_filename || "file";

  const obj = {
    url: data.secure_url,
    secureUrl: data.secure_url,
    public_id: data.public_id,
    name: derivedName,
    size: data.bytes,
    format: data.format,
    mimeType: file?.type || "",
    resourceType: data.resource_type,
  };


  return obj; // This is the image URL
};
