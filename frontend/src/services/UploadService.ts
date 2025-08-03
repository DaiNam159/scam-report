import api from "@/lib/axiosInstance";

const reportUrl = "/upload";
export const UploadService = {
  async uploadFile(file: File) {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post(reportUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data;
    } catch (err) {
      console.error("Error uploading file:", err);
      throw new Error("Unable to upload file. Please try again later.");
    }
  },
  async deleteFile(publicId: string) {
    try {
      const res = await api.delete(reportUrl, {
        data: { public_id: publicId },
      });
      return res.data;
    } catch (err) {
      console.error("Error deleting file:", err);
      throw new Error("Unable to delete file. Please try again later.");
    }
  },
};
