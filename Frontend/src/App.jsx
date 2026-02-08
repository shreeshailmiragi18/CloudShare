import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import MyFiles from "./pages/MyFiles";
import PublicFileView from "./pages/PublicFileView";
import Subscription from "./pages/Subscription";
import Transcations from "./pages/Transactions";
import Upload from "./pages/Upload";
import Landing from "./pages/Landing";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/myfiles" element={<MyFiles />} />
        <Route path="/publicfileview" element={<PublicFileView />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/transactions" element={<Transcations />} />
        <Route path="/upload" element={<Upload />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
