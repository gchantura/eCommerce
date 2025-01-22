export const uploadImage = async (file: File): Promise<string> => {
  console.log('Starting upload process...');
  console.log('File to upload:', {
    name: file.name,
    type: file.type,
    size: file.size
  });

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

  try {
    console.log('Config:', {
      cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
      uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    });

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();
    console.log('Cloudinary response:', data);

    if (!response.ok || !data.secure_url) {
      console.error('Upload error:', data);
      throw new Error(data.error?.message || 'Upload failed');
    }

    console.log('Upload successful! URL:', data.secure_url);
    return data.secure_url;
  } catch (error) {
    console.error('Upload error details:', error);
    throw error;
  }
};

// Add this new function to extract public_id from URL
const getPublicIdFromUrl = (url: string): string | null => {
  try {
    // Extract the public ID from URL like: https://res.cloudinary.com/dvqibvool/image/upload/v1234567/products/eCommerce/image.jpg
    const regex = /\/v\d+\/(.+)\./;
    const match = url.match(regex);
    return match ? match[1] : null;
  } catch (error) {
    console.error('Error extracting public_id:', error);
    return null;
  }
};

export const deleteImage = async (imageUrl: string): Promise<boolean> => {
  const publicId = getPublicIdFromUrl(imageUrl);
  if (!publicId) {
    console.error('Could not extract public_id from URL:', imageUrl);
    return false;
  }

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/destroy`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          public_id: publicId,
          upload_preset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
        }),
      }
    );

    const data = await response.json();
    console.log('Delete response:', data);
    return data.result === 'ok';
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
}; 