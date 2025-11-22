import { Icon } from "@iconify/react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { RootState } from "../redux";

const SideBar = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const nav = [
    {
      icon: "material-symbols-light:folder-rounded",
      link: "/file",
    },
    {
      icon: "mynaui:message-solid",
      link: "/chat",
    },
    {
      icon: "zondicons:network",
      link: "/social-media",
    },
  ];
  const isAdmin = currentUser.roleUser.includes("admin");
  if (isAdmin) {
    nav.push({
      icon: "material-symbols:settings",
      link: "/admin",
    })
  }
  return (
    <div className="h-[100vh] min-w-6 border-r-secondt border-r-2">
      <ul className="p-2">
        {nav.map((item, index) => (
          <NavLink
            to={item.link}
            key={index}
          >
            {({ isActive }) => (
              <li className={`text-gray-800 mb-3 px-3 py-2 rounded-md ${isActive && "bg-primary text-white"}`}>
                <Icon icon={item.icon} className="side-icon" />
              </li>
            )}

          </NavLink>
        ))}
      </ul>
    </div>
  );
};

export default SideBar;
