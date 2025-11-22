import { FC, useState } from "react";
import { User, UserRole } from "../../../data/typeData";
import { FiX } from "react-icons/fi";
import Button from "../../UI/Button";
import { userRolesTranslat } from "../../../data/voidData";
// import { X } from "lucide-react";

interface RoleModalProps {
  selectedRoles: User["roleUser"];
  onClose: () => void;
  onSave: (roles: User["roleUser"]) => void;
  userRoles: User["roleUser"];
}

const RoleModal: FC<RoleModalProps> = ({
  selectedRoles,
  onClose,
  onSave,
  userRoles,
}) => {
  const [localSelection, setLocalSelection] =
    useState<User["roleUser"]>(selectedRoles);

  const toggleRole = (role: UserRole) => {
    if (localSelection.includes(role)) {
      setLocalSelection(localSelection.filter((r) => r !== role));
    } else {
      setLocalSelection([...localSelection, role]);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-fadeIn scale-100">
        {/* Bouton de fermeture */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
        >
          <FiX className="h-5 w-5" />
        </button>

        {/* Titre */}
        <h3 className="text-xl font-semibold text-gray-800 mb-5 text-center">
          Sélectionner les rôles
        </h3>

        {/* Liste des rôles */}
        <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {userRoles.map((role) => {
            const isSelected = localSelection.includes(role);
            return (
              <label
                key={role}
                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition 
                  border ${isSelected ? "border-primary/50 bg-primary/30" : "border-primary/60 hover:bg-primary/40"}`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleRole(role)}
                  className="accent-primary h-4 w-4"
                />
                <span
                  className={`text-sm font-medium ${
                    isSelected ? "text-primary" : "text-gray-700"
                  }`}
                >
                  {userRolesTranslat[role]}
                </span>
              </label>
            );
          })}
        </div>

        {/* Boutons */}
        <div className="flex justify-end gap-3 mt-6">
          <Button
            onClick={onClose}
            title="Annuler"
            variant="secondary"
          />
          <Button
            onClick={() => onSave(localSelection)}
            title="Valider"
            variant="primary"
          />
        </div>
      </div>
    </div>
  );
};

export default RoleModal;
