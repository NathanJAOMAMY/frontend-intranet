import { Folder, User, UserRole } from "./typeData";

export const folderVoid: Folder = {
  id: "/",
  name: "",
  userId: "",
  createdAt: "",
  parentFolderId: "/",
  updatedAt: "",
  userIdAcces: [],
};
export const DEPARTEMENT = [
  { id: "RH", name: "Ressources Humaines" },
  { id: "PRODUCTION", name: "Production" },
  { id: "QUALITE", name: "Qualité" },
];
export const userVoid: User = {
  idUser: "",
  userName: "",
  surname: "",
  email: "",
  pseudo: "",
  password: "",
  statusUser: true,
  roleUser: [],
  responsibilities: [],
  createdAt: "",
  updatedAt: "",
  avatar: "",
};
export const userRoles: UserRole[] = [
  "admin",
  "Production",
  "Quality",
  "Health-Safety",
  "Human Resources",
  "Maintenance",
  "Management",
  "Security",
  "Logistics",
  "Certification",
  "comptability",
  "improvement",
  "nurse",
  "Other",
];

export const userRolesTranslat: Record<string, string> = {
  admin: "Administrateur",
  Production: "Production",
  Quality: "Qualité",
  "Health-Safety": "Santé et Sécurité",
  "Human Resources": "Ressources Humaines",
  Maintenance: "Maintenance",
  Management: "Direction / Gestion",
  Security: "Sécurité",
  Logistics: "Logistique",
  Certification: "Certification",
  comptability: "Comptabilité",
  improvement: "Amelioration",
  nurse: "Infirmerie",
  Other: "Autre",
};
