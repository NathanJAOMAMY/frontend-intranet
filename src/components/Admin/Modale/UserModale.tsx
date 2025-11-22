import { FC, useState, useEffect } from "react";
import { User } from "../../../data/typeData";
import Button from "../../UI/Button";
import { userRoles, userVoid } from "../../../data/voidData";
import InputField from "../../UI/InputField";
import RoleModal from "./RoleModale";
import { Icon } from "@iconify/react";

interface AddUserProps {
  userSlected: User | null;
  onClose: () => void;
  type: "add" | "edit";
  onSubmit?: (user: User) => void;
}

const UserModale: FC<AddUserProps> = ({ onClose, userSlected, type, onSubmit }) => {
  const [formData, setFormData] = useState<User>(userVoid);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  // Pré-remplir en mode édition
  useEffect(() => {
    if (userSlected && type === "edit") {
      setFormData(userSlected);
    } else {
      setFormData(userVoid);
    }
  }, [userSlected, type]);

  const handleChange = (name: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (onSubmit) onSubmit(formData);
    if (type === "add") setFormData(userVoid);
    onClose();
  };

  const removeRole = (roleToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      roleUser: prev.roleUser.filter((r) => r !== roleToRemove),
    }));
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-[0_6px_20px_rgba(0,0,0,0.2)] w-[90%] sm:w-[600px] flex flex-col overflow-hidden animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-primary text-white py-3 px-5 flex items-center justify-center relative">
          <h3 className="text-lg font-semibold tracking-wide">
            {type === "add" ? "Ajouter un utilisateur" : "Modifier l’utilisateur"}
          </h3>
          <button
            onClick={onClose}
            className="absolute right-4 top-2 text-white hover:text-gray-200 transition"
          >
            <Icon icon="mdi:close" width={22} />
          </button>
        </div>

        {/* Formulaire */}
        <div className="p-5 flex flex-col gap-4 max-h-[70vh] overflow-auto">
          <InputField
            label="Nom"
            name="userName"
            value={formData.userName}
            onChange={(val) => handleChange("userName", val)}
            placeholder="Entrez le nom"
            disabled={type === "edit"}
            required
          />
          <InputField
            label="Prénom"
            name="surname"
            value={formData.surname}
            onChange={(val) => handleChange("surname", val)}
            placeholder="Entrez le prénom"
            disabled={type === "edit"}
            required
          />
          <InputField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={(val) => handleChange("email", val)}
            placeholder="Entrez l’email"
            disabled={type === "edit"}
            required
          />
          <InputField
            label="Pseudo"
            name="pseudo"
            value={formData.pseudo}
            onChange={(val) => handleChange("pseudo", val)}
            placeholder="Entrez le pseudo"
          />

          {/* Rôles */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Rôles</label>
            <div className="flex flex-wrap gap-2">
              {formData.roleUser.length > 0 ? (
                formData.roleUser.map((r) => (
                  <span
                    key={r}
                    className="bg-primary text-white px-3 py-1 rounded-full flex items-center gap-1 text-sm shadow-[0_2px_6px_rgba(59,130,246,0.3)]"
                  >
                    {r}
                    <button
                      type="button"
                      onClick={() => removeRole(r)}
                      className="hover:text-red-200"
                    >
                      ×
                    </button>
                  </span>
                ))
              ) : (
                <span className="text-gray-400 text-sm">
                  Aucun rôle sélectionné
                </span>
              )}
            </div>

            <Button
              title="Sélectionner les rôles"
              onClick={() => setIsRoleModalOpen(true)}
              variant="secondary"
              icon="mdi:shield-account"
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4">
            <Button onClick={onClose} title="Annuler" variant="secondary" />
            <Button
              type="submit"
              onClick={handleSubmit}
              title={type === "add" ? "Ajouter" : "Modifier"}
              variant="primary"
              icon={type === "add" ? "mdi:account-plus" : "mdi:account-edit"}
            />
          </div>
        </div>

        {/* Modal de rôles */}
        {isRoleModalOpen && (
          <RoleModal
            selectedRoles={formData.roleUser}
            onClose={() => setIsRoleModalOpen(false)}
            userRoles={userRoles}
            onSave={(roles) => {
              setFormData((prev) => ({ ...prev, roleUser: roles }));
              setIsRoleModalOpen(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default UserModale;
