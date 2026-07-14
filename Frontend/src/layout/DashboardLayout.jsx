import React from "react";
import Navbar from "../components/Navbar";
import { useUser } from "@clerk/clerk-react";
import SideMenu from "../components/SideMenu";

const DashboardLayout = ({ children }) => {
  const { user } = useUser();
  return (
    <div>
      <Navbar />
      {user && (
        <div className="flex">
          <div className="max-[1080px]:hidden">
            <SideMenu />
          </div>
          <div className="grow mx-5">{children}</div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
