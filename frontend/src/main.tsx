import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./redux/store.ts";
import App from "./App.tsx";
import "./index.css";
import { registerSW } from "virtual:pwa-register";

registerSW({
  immediate: true,
});

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
  </Provider>
);
