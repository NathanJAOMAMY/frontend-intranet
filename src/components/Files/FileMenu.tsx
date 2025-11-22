import { FC} from "react";
import { navItems, fileItems, filterNavItemsByRole, thematiqueMenu } from "../MenuItem";
import SidebarSection from "../UI/SidebarSection";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";

const Sidebar: FC = () => {
const userRole = useSelector((state :RootState)=> state.user.currentUser.roleUser)

  return (
    <aside className="h-full w-[250px] overflow-y-auto p-2">
      {/* <div className="p-4 font-bold text-xl text-gray-800">{title}</div> */}
      <nav className="flex flex-col gap-4">
        <SidebarSection items={navItems} />
        <SidebarSection title="Fichiers" items={filterNavItemsByRole(fileItems , userRole)} />
        <SidebarSection title="Fichiers" items={thematiqueMenu} />
      </nav>
    </aside>
  );
};

export default Sidebar;
