import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
  name: "socket",
  initialState: {
    isProgressLoading: false,
    courses: [],
  },
  reducers: {
    startIsProgressLoading: (state, action) => {
      const { isProgress, courseId } = action.payload;
      state.isProgressLoading = isProgress;
      state.courses.push(courseId);
    },
    stopIsProgressLoading: (state, action) => {
      const { isProgress, courseId } = action.payload;
      state.isProgressLoading = isProgress;
      const index = state.courses.indexOf(courseId);
      console.log(index);
      state.courses.splice(index, 1);
    },
  },
});

export const { startIsProgressLoading, stopIsProgressLoading } = socketSlice.actions;
export default socketSlice.reducer;