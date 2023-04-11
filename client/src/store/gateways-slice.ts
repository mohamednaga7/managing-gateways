import { createSlice } from "@reduxjs/toolkit";
import { Gateway } from "../types/gateways";

export interface GatewaysState {
  gateways: Gateway[];
}

const initialState: GatewaysState = {
  gateways: [],
};

export const gatewaysSlice = createSlice({
  name: "gateways",
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

// export const { setAuthState } = authSlice.actions;

export default gatewaysSlice.reducer;
