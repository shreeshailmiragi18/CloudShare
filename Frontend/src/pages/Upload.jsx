import DashboardLayout from "../layout/DashboardLayout";
import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
const Upload = () => {
  const { getToken } = useAuth();

  useEffect(() => {
    const displayToken = async () => {
      const token = await getToken();
      console.log(token);
    };
    displayToken();
  }, []);

  return (
    <DashboardLayout activeMenu="Upload">
      <div>upload</div>
    </DashboardLayout>
  );
};

export default Upload;
