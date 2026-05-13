import { httpClient } from './httpClient';

export const imageRepairService = {
  /**
   * Upload an image for a repair
   */
  uploadImage: async (repairId: string, file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await httpClient.post(
      `/images-repair/${repairId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  /**
   * Get all images for a repair
   */
  getImages: async (repairId: string) => {
    const response = await httpClient.get(`/images-repair/${repairId}`);
    return response.data;
  },

  /**
   * Delete a specific image
   */
  deleteImage: async (repairId: string, fileName: string) => {
    const response = await httpClient.delete(
      `/images-repair/${repairId}/${fileName}`
    );
    return response.data;
  },

  /**
   * Delete all images of a repair (cleanup orphaned images)
   * Used when canceling a new repair form without saving
   */
  deleteRepairFolder: async (repairId: string) => {
    const response = await httpClient.delete(`/images-repair/${repairId}`);
    return response.data;
  },
};
