import React, { useState } from "react";
import { FiEdit, FiX, FiUser, FiLock } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import { User } from "../data/typeData";
import { deleteFile, uploadFile } from "../tools/tools";
import ChangePassword from "./ChangePassword";
import Button from "./UI/Button";
import { classInput } from "./UI/InputField";

interface ProfileModalProps {
  user: User;
  onClose: () => void;
  onUpdate: (updatedUser: Partial<User>) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ user, onClose, onUpdate }) => {
  const [editField, setEditField] = useState<keyof User | null>(null);
  const [tempValue, setTempValue] = useState<string>("");
  const [showChangePassword, setShowChangePassword] = useState<boolean>(false);

  const defaultAvatar =
    "https://mxbzfekwbvybtxlutkpz.supabase.co/storage/v1/object/public/intranet/avatar.png";

  const handleEdit = (field: keyof User) => {
    const value = user[field];
    setTempValue(Array.isArray(value) ? value.join(", ") : value ? String(value) : "");
    setEditField(field);
  };

  const handleSave = () => {
    if (!editField) return;
    const updatedValue =
      editField === "responsibilities"
        ? tempValue.split(",").map((r) => r.trim()).filter(Boolean)
        : tempValue;
    onUpdate({ [editField]: updatedValue });
    setEditField(null);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (user.avatar) await deleteFile(user.avatar);
    const newUrl = await uploadFile(file, "avatar");
    if (newUrl) onUpdate({ avatar: newUrl });
  };

  const EditableField: React.FC<{
    label: string;
    field: keyof User;
    type?: string;
    prefix?: string;
  }> = ({ label, field, type = "text", prefix }) => {
    const value = user[field];
    const displayValue =
      field === "responsibilities" && Array.isArray(value)
        ? value.join(", ")
        : value || "Non défini";

    return (
      <div className="flex text-gray-800 flex-col gap-1">
        <label className="text-sm font-medium text-gray-500">{label}</label>
        {editField === field ? (
          <>
            <input
              type={type}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className={`${classInput}`}
              autoFocus
              placeholder={field}
            />
            <div className="flex gap-2 mt-2 justify-end">
              <Button title="Sauver" variant="primary" onClick={handleSave} />
              <Button title="Annuler" variant="secondary" onClick={() => setEditField(null)} />
            </div>
          </>
        ) : (
          <div className="flex justify-between items-center group">
            <span className="text-gray-800">{prefix}{displayValue}</span>
            <button
              onClick={() => handleEdit(field)}
              className="opacity-0 group-hover:opacity-100 transition text-primary/60 hover:text-primary"
            >
              <FiEdit size={18} />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-primary/70 to-primary text-white p-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FiUser /> Mon profil
            </h2>
            <button onClick={onClose} className="hover:bg-white/20 rounded-full p-1">
              <FiX size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex bg-background-primary flex-col md:flex-row gap-6 p-6">
            {/* Left Column */}
            <div className="flex flex-col items-center md:w-1/3 gap-3">
              <div className="relative w-32 h-32">
                <img
                  src={user.avatar || defaultAvatar}
                  alt="Avatar"
                  className="w-32 h-32 rounded-full object-cover shadow-md cursor-pointer"
                  onClick={() => document.getElementById("avatarInput")?.click()}
                />
                <div
                  className="absolute inset-0 rounded-full bg-black/40 opacity-0 hover:opacity-100 transition flex items-center justify-center text-white cursor-pointer"
                  onClick={() => document.getElementById("avatarInput")?.click()}
                >
                  <FiEdit size={20} />
                </div>
                <input
                  id="avatarInput"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>

              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-800">{user.userName || "Non défini"}</h3>
                <p className="text-gray-500">{user.roleUser?.join(", ") || "Aucun rôle"}</p>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col md:w-2/3 gap-4 max-h-[55vh] overflow-auto">
              {!showChangePassword ? (
                <div className="bg-white rounded-xl p-4 shadow-sm border ">
                  <EditableField label="Nom" field="userName" />
                  <EditableField label="Prénom" field="surname" />
                  <EditableField label="Pseudo" field="pseudo" prefix="@" />
                  <EditableField label="Email" field="email" type="email" />
                </div>
              ) : (
                <div className="bg-white rounded-xl p-4 shadow-sm border ">
                  <ChangePassword idUser={user.idUser} />
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-center gap-3 p-4 bg-background-primary">
            <Button variant="secondary" title="Fermer" onClick={onClose} />
            <Button
              variant={showChangePassword ? "secondary" : "primary"}
              title="Voir mon profil"
              onClick={() => setShowChangePassword(false)}
            />
            <Button
              variant={showChangePassword ? "primary" : "secondary"}
              title="Changer mon mot de passe"
              onClick={() => setShowChangePassword(true)}
              // icon={<FiLock />}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProfileModal;
