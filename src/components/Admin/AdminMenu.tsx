import { FC } from "react"
import { adminItems } from "../MenuItem";
import SidebarSection from "../UI/SidebarSection";

const AdminMenu: FC = () => {
  return (
    <nav className="h-full w-[250px] overflow-y-auto p-2">
      <SidebarSection title="Administration" items={adminItems} />
    </nav>
  )
}
export default AdminMenu