import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import eventReducer from "./slices/eventSlice";
import orderReducer from "./slices/orderSlice";
import ticketReducer from "./slices/ticketSlice";
import organizerReducer from "./slices/organizerSlice";
import adminReducer from "./slices/adminSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    event: eventReducer,
    order: orderReducer,
    ticket: ticketReducer,
    organizer: organizerReducer,
    admin: adminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["user/updateAvatar/pending"],
        // FormData args (avatar/event image uploads) live in meta.arg
        ignoredActionPaths: ["meta.arg"],
      },
    }),
  devTools: import.meta.env.DEV,
});

export default store;