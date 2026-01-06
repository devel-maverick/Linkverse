import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useMeetingStore = create((set) => ({
  loading: false,
  error: null,

  createInstantMeeting: async (otherUserId) => {
    try {
      set({ loading: true, error: null });
      const res = await axiosInstance.post("/meeting/instant", { otherUserId });
      set({ loading: false });
      return res.data.meeting;

    } catch (error) {
      console.error("Meeting Error:", error.response?.status, error.response?.data);

      set({
        loading: false,
        error: error.response?.data?.message || "Error creating meeting",
      });

      return null;
    }
  },
}));
