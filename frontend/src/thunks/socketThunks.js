import { createAsyncThunk } from "@reduxjs/toolkit";
import { stopIsProgressLoading } from "../features/socketSlice";

export const handleChapterUpload = createAsyncThunk(
  "socket/handleChapterUpload",
  async (data, { dispatch }) => {
    try {
      if (data?.isVideoUploaded) {
        dispatch(
          stopIsProgressLoading({ isProgress: false, courseId: data?.courseId }),
        );
      }
      return { result: "success" };
    } catch (error) {
      console.log(error);
    }
  },
);
