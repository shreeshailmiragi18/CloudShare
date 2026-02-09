import { ClerkProvider } from "@clerk/clerk-react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

const ClerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
createRoot(document.getElementById("root")).render(
  <ClerkProvider publishableKey={ClerkPubKey}>
    <App />
  </ClerkProvider>,
);
