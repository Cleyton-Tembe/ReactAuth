import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter, HashRouter } from "react-router-dom";
import AuthProvider from "./Context/AuthProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <HashRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </HashRouter>
  </BrowserRouter>,
);
