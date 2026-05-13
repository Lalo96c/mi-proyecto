import { BACKEND_URL } from './config';

export const uploadImage = async (repairId: string, file: File): Promise<any> => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${BACKEND_URL}/api/images-repair/${repairId}`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Error uploading image: ${response.statusText}`);
  }

  return response.json();
};

export const getImages = async (repairId: string): Promise<any> => {
  const response = await fetch(`${BACKEND_URL}/api/images-repair/${repairId}`);

  if (!response.ok) {
    throw new Error(`Error fetching images: ${response.statusText}`);
  }

  return response.json();
};

export const deleteImage = async (repairId: string, fileName: string): Promise<any> => {
  const response = await fetch(`${BACKEND_URL}/api/images-repair/${repairId}/${fileName}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Error deleting image: ${response.statusText}`);
  }

  return response.json();
};

export const deleteRepairFolder = async (repairId: string): Promise<any> => {
  const response = await fetch(`${BACKEND_URL}/api/images-repair/${repairId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Error deleting repair folder: ${response.statusText}`);
  }

  return response.json();
};
