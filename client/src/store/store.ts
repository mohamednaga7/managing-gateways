import { Action, configureStore, ThunkDispatch } from "@reduxjs/toolkit";
import gatewayReducer from "./gateways-slice";

export const store = configureStore({
  devTools:
    import.meta.env.VITE_NODE_ENV === "development" ? { trace: true } : false,
  middleware: (getDefaultMiddleware) => [...getDefaultMiddleware()],
  reducer: {
    gateways: gatewayReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type ThunkAppDispatch = ThunkDispatch<RootState, void, Action>;
