import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type NotificationType = "success" | "error" | "info";

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
}

interface UIState {
  notifications: Notification[];
}

const initialState: UIState = {
  notifications: [],
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    addNotification: (
      state,
      action: PayloadAction<{ type: NotificationType; message: string }>
    ) => {
      const id = Math.random().toString(36).substring(2, 9);
      state.notifications.push({ id, ...action.payload });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
    },
  },
});

export const { addNotification, removeNotification } = uiSlice.actions;
export default uiSlice.reducer;
