import { createSlice } from "@reduxjs/toolkit";

const uiSettingsSlice = createSlice({
  name: "uiSettings",
  initialState: { otpPage: false },
  reducers: {
    toggleOtpPage: (state) => {
      state.otpPage = !state.otpPage;
    }
    
  },
});

export const { toggleOtpPage } = uiSettingsSlice.actions;

export default uiSettingsSlice.reducer;
