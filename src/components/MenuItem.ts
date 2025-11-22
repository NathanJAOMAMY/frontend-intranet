import { UserRole } from "../data/typeData";

export interface NavItem {
  title: string;
  icon: string;
  link: string;
  submenu?: NavItem[];
}
interface RolePermission {
  roles: UserRole[];
  allowedLinks: string[];
}
// Menue principale file
export const navItems: NavItem[] = [
  { title: "Accueil", icon: "flowbite:home-solid", link: "/file/file" },
  // { title: "Images", icon: "ion:images", link: "/file/image" },
  { title: "Partagés", icon: "ic:round-folder-shared", link: "/file/share" },
  { title: "Partagés avec moi", icon: "fa:users", link: "/file/share-with-me" },
];
// Sous menue file
export const fileItems: NavItem[] = [
  {
    title: "Département",
    icon: "bi:building",
    link: "",
    submenu: [
      { title: "Production", icon: "mdi:factory", link: "/file/production" },
      { title: "Qualité", icon: "mdi:check-decagram", link: "/file/quality" },
      {
        title: "Santé-Sécurité",
        icon: "mdi:shield-account",
        link: "/file/health-security",
      },
      {
        title: "Ressources Humaines",
        icon: "mdi:account-group",
        link: "/file/rh",
      },
      { title: "Maintenance", icon: "mdi:tools", link: "/file/maintenance" },
      { title: "Direction", icon: "mdi:briefcase", link: "/file/direction" },
      { title: "Sécurité", icon: "mdi:shield-lock", link: "/file/security" },
      { title: "Logistique", icon: "mdi:truck", link: "/file/logistique" },
      {
        title: "Comptabilité",
        icon: "mdi:calculator-variant",
        link: "/file/comptability",
      },
      {
        title: "Amélioration continue",
        icon: "mdi:chart-line",
        link: "/file/improvement",
      },
      { title: "Infirmerie", icon: "mdi:medical-bag", link: "/file/nurse" },
      {
        title: "Certification",
        icon: "mdi:certificate",
        link: "/file/certification",
      },
      { title: "Divers", icon: "mdi:certificate", link: "/file/other" },
    ],
  },
];

export const thematiqueMenu: NavItem[] = [
  {
    title: "Thématique",
    icon: "mdi:format-list-bulleted-type",
    link: "",
    submenu: [
      { title: "Politique", icon: "mdi:script-text", link: "/file/politique" },
      {
        title: "Manuel",
        icon: "mdi:book-open-page-variant",
        link: "/file/manuel",
      },
      {
        title: "Procédure",
        icon: "mdi:file-document",
        link: "/file/procedure",
      },
      {
        title: "Registre",
        icon: "mdi:clipboard-text",
        link: "/file/fileregistre",
      },
      {
        title: "Formulaire",
        icon: "mdi:form-textbox",
        link: "/file/formulaire",
      },
      { title: "Suivi", icon: "mdi:timeline-check", link: "/file/suivi" },
      { title: "Plan", icon: "mdi:calendar-multiselect", link: "/file/plan" },
      {
        title: "Spécification",
        icon: "mdi:file-search",
        link: "/file/specification",
      },
      { title: "Demande", icon: "mdi:file-send", link: "/file/demande" },
      {
        title: "Compte Rendu",
        icon: "mdi:file-document-edit",
        link: "/file/compte-rendu",
      },
      {
        title: "Procès-Verbal",
        icon: "mdi:scale-balance",
        link: "/file/proces-verbal",
      },
      { title: "Inventaire", icon: "mdi:warehouse", link: "/file/inventaire" },
      { title: "Enquête", icon: "mdi:magnify-scan", link: "/file/enquete" },
    ],
  },
];
// Menu admin
export const adminItems: NavItem[] = [
  // {
  //   title: "Code d'inscription",
  //   icon: "formkit:password",
  //   link: "/admin/sign-code",
  // },
  { title: "Utilisateurs", icon: "vaadin:users", link: "/admin/users" },
];
// Permission des role
export const rolePermissions: RolePermission[] = [
  {
    roles: ["admin"],
    allowedLinks: ["*"], // * = tout est permis
  },
  {
    roles: ["Production"],
    allowedLinks: ["/file/production"],
  },
  {
    roles: ["Quality"],
    allowedLinks: ["/file/quality"],
  },
  {
    roles: ["Health-Safety"],
    allowedLinks: ["/file/health-security"],
  },
  {
    roles: ["Human Resources"],
    allowedLinks: ["/file/rh"],
  },
  {
    roles: ["Maintenance"],
    allowedLinks: ["/file/maintenance"],
  },
  {
    roles: ["Management"],
    allowedLinks: ["/file/direction"],
  },
  {
    roles: ["Security"],
    allowedLinks: ["/file/security"],
  },
  {
    roles: ["Logistics"],
    allowedLinks: ["/file/logistique"],
  },
  {
    roles: ["Certification"],
    allowedLinks: ["/file/certification"],
  },
  {
    roles: ["comptability"],
    allowedLinks: ["/file/comptability"],
  },
  {
    roles: ["improvement"],
    allowedLinks: ["/file/improvement"],
  },
  {
    roles: ["nurse"],
    allowedLinks: ["/file/nurse"],
  },
  {
    roles: ["Other"],
    allowedLinks: ["/file/other"],
  },
];

export const filterNavItemsByRole = (
  items: NavItem[],
  userRoles: UserRole[]
): NavItem[] => {
  // Trouve les liens autorisés selon les rôles
  const allowedLinks = new Set<string>();

  for (const permission of rolePermissions) {
    if (permission.roles.some((r) => userRoles.includes(r))) {
      if (permission.allowedLinks.includes("*")) return items; // admin => tout
      permission.allowedLinks.forEach((link) => allowedLinks.add(link));
    }
  }

  // Filtrage des menus et sous-menus
  return items
    .map((item) => {
      if (item.submenu) {
        const filteredSubmenu = item.submenu.filter((sub) =>
          allowedLinks.has(sub.link)
        );
        return filteredSubmenu.length > 0
          ? { ...item, submenu: filteredSubmenu }
          : null;
      }
      return allowedLinks.has(item.link) ? item : null;
    })
    .filter((item): item is NavItem => item !== null);
};
