import { useState, FormEvent, FC } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Button from "./UI/Button";
import axios from "axios";
import { API_BASE_URL } from "../api";
import { toast } from "react-toastify";
import { classInput } from "./UI/InputField";

interface ValidationErrors {
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

interface ServerMessage {
  type: "success" | "error";
  text: string;
}

interface ChangePasswordProps {
  idUser: string;
}

const ChangePassword: FC<ChangePasswordProps> = ({ idUser }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [serverMessage, setServerMessage] = useState<ServerMessage | null>(null);

  const validate = (): ValidationErrors => {
    const e: ValidationErrors = {};
    if (!oldPassword) e.oldPassword = "Entrez votre ancien mot de passe.";
    if (!newPassword) e.newPassword = "Entrez un nouveau mot de passe.";
    if (newPassword && newPassword.length < 8)
      e.newPassword = "Le mot de passe doit contenir au moins 8 caractères.";
    if (newPassword && newPassword === oldPassword)
      e.newPassword = "Le nouveau mot de passe doit être différent de l'ancien.";
    if (newPassword !== confirmPassword)
      e.confirmPassword = "La confirmation ne correspond pas.";
    return e;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerMessage(null);
    const v = validate();
    setErrors(v);

    if (Object.keys(v).length > 0) return;

    setLoading(true);
    try {
      const response = await axios.put(
        `${API_BASE_URL}/users/pass/${idUser}`,
        { oldPassword, newPassword }
      );

      if (response.status === 200) {
        toast.success("Mot de passe mis à jour avec succès ")
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast.error("L'ancien mot de passe est incorrect")
        } else {
          toast.error('Une erreur est survenue. Veuillez réessayer plus tard.')
        }
      } else {
        toast.error("Erreur est inconue")
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setErrors({});
    setServerMessage(null);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md w-full text-gray-800 rounded-lg space-y-4"
    >
      {serverMessage && (
        <div
          className={`p-3 rounded ${serverMessage.type === "success"
            ? "bg-green-50 text-green-700"
            : "bg-red-50 text-red-700"
            }`}
        >
          {serverMessage.text}
        </div>
      )}

      {/* Champ : Ancien mot de passe */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Ancien mot de passe
        </label>
        <div className="relative">
          <input
            type={showOld ? "text" : "password"}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className={`${classInput} ${errors.oldPassword ? "border-red-400" : "border-gray-200"
              }`}
            placeholder="Entrez votre ancien mot de passe"
          />
          <button
            type="button"
            onClick={() => setShowOld((s) => !s)}
            className="absolute right-2 top-2 text-primary"
          >
            {showOld ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
        {errors.oldPassword && (
          <p className="text-sm text-red-600 mt-1">{errors.oldPassword}</p>
        )}
      </div>

      {/* Champ : Nouveau mot de passe */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Nouveau mot de passe
        </label>
        <div className="relative">
          <input
            type={showNew ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={`${classInput} ${errors.newPassword ? "border-red-400" : "border-gray-200"
              }`}
            placeholder="Nouveau mot de passe"
          />
          <button
            type="button"
            onClick={() => setShowNew((s) => !s)}
            className="absolute right-2 top-2 text-primary"
          >
            {showNew ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
        {errors.newPassword && (
          <p className="text-sm text-red-600 mt-1">{errors.newPassword}</p>
        )}
      </div>

      {/* Champ : Confirmer le mot de passe */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Confirmer le nouveau mot de passe
        </label>
        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`${classInput} ${errors.confirmPassword ? "border-red-400" : "border-gray-200"
              }`}
            placeholder="Confirmer le mot de passe"
          />
          <button
            type="button"
            onClick={() => setShowConfirm((s) => !s)}
            className="absolute right-2 top-2 text-primary"
          >
            {showConfirm ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>
        )}
      </div>

      {/* Boutons */}
      <div className="flex justify-end space-x-2">
        <Button
          onClick={handleReset}
          title="Annuler"
          variant="secondary"
          type="button"
        />
        <Button
          title={loading ? "En cours..." : "Mettre à jour"}
          variant="primary"
          type="submit"
          onClick={() => { handleSubmit }}
        />
      </div>
    </form>
  );
};

export default ChangePassword;
