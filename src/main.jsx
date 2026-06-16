import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import store from "./store/store";
import App from "./App.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

// Lets you confirm which build is actually live: open the browser console and
// compare this SHA to the latest commit on the deployed branch.
console.log(`Tixwav build: ${import.meta.env.VITE_BUILD_SHA}`);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
        <ToastContainer
          position="bottom-center"
          autoClose={3500}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastStyle={{
            borderRadius: "12px",
            fontFamily: "inherit",
            fontSize: "14px",
          }}
        />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);