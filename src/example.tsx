import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@shopify/polaris/build/esm/styles.css";
import { AppProvider } from "@shopify/polaris";
import App from "./App";


const rootApp = document.getElementById('root');
if (!rootApp) {
  throw new Error('App root element not found');
}
const root = createRoot(rootApp);
root.render(
  <StrictMode>
    <AppProvider i18n={{}}>
      <App />
    </AppProvider>
  </StrictMode>
);
