import { FC } from "react";
import { Outlet } from "react-router-dom";
import AdminMenu from "../../components/Admin/AdminMenu";
import TopFile from "../../components/TopFile";

const Admin: FC = () => {
  return (
    <div className="flex flex-col h-full text-gray-800">
      <TopFile></TopFile>
      <div className="flex h-full">
        <AdminMenu />
        <div className="flex-1 bg-white rounded-tl-lg p-2">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
export default Admin;