// Cloudinary configuration for direct uploads
export const CLOUDINARY_CLOUD_NAME = 'dkv4g4icb';
export const CLOUDINARY_UPLOAD_PRESET = 'yves-kossonou';

export function getCloudinaryUploadUrl() {
  return `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`;
}

export async function uploadToCloudinary(file: File): Promise<string | null> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'yves-kossonou');

    const response = await fetch(getCloudinaryUploadUrl(), {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('Upload failed');

    const data = await response.json();
    return data.secure_url as string;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    // Fallback: create local object URL for demo
    return URL.createObjectURL(file);
  }
}
