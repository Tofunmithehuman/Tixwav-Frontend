import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { Provider } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import store from "./store/store";
import App from "./App.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import ThemedToastContainer from "./components/ThemedToastContainer.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
        <ThemedToastContainer />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);