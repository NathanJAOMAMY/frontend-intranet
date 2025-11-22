import { FC, useState } from "react";
import Button from "./Button";
import { File, Folder, User } from "../../data/typeData";
import useFilesManager from "../../hooks/useFilesManager";
import axios from "axios";
import { API_BASE_URL } from "../../api";
import { toast } from "react-toastify";
import { onDeleteService } from "../Admin/serviceUsers";
import { useDispatch } from "react-redux";
import { deletUser } from "../../redux/features/user/user";
import { FiLoader } from "react-icons/fi";


interface ModalDialogeProps {
  onClose: () => void;
  onSuccess?: () => void;
  title: string;
  type: "File" | "Folder" | "Post" | "User";
  action: "delete" | "rename" | "move" | "share";
  content: File | Folder | User | any;
}
const ModalDialoge: FC<ModalDialogeProps> = ({ onClose, onSuccess, title, type, action, content }) => {
  const { removeFile, removeFolder, currentFolder } = useFilesManager()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const dispatch = useDispatch();
  const response = async () => {
    try {
      setIsLoading(true)
      if (type === "File") {
        if (!content.id || !content.url) {
          toast.error("Impossible de supprimer : fichier incomplet (id ou url manquant)");
          return;
        }
        await removeFile(content.id, content.url);
        if (onSuccess) onSuccess();
      } else if (type === "Folder") {
        if (!content.id) {
          toast.error("Impossible de supprimer : dossier incomplet (id manquant)");
          return;
        }
        await removeFolder(content.id);
        if (onSuccess) onSuccess();
      } else if (type === "Post") {
        await axios.delete(`${API_BASE_URL}/social/posts/${content._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        toast.success("Publication supprimée !");
        if (onSuccess) onSuccess();
      } else if (type === "User") {
        // console.log(content)
        const response = await onDeleteService('users', content.idUser);
        if (response === "success") {
          toast.success("Utilisateur supprimer avec sucsses");
          dispatch(deletUser(content as User))
        }
        else toast.error("Utilisateur non suprimer");
      }
    } catch (err) {
      toast.error("Erreur lors de la suppression !");
      console.error(err);
    } finally {
      onClose();
      setIsLoading(false)
    }
  };
  // Texte d'action adapté
  const getActionLabel = () => {
    switch (action) {
      case "delete": return "supprimer";
      case "rename": return "renommer";
      case "move": return "déplacer";
      case "share": return "partager";
      default: return action;
    }
  };
  const getTypeLabel = () => {
    if (type === "Post") return { label: "publication", genre: "f" };
    if (type === "File") return { label: "fichier", genre: "m" };
    if (type === "Folder") return { label: "dossier", genre: "m" };
    return { label: (type as string).toLowerCase(), genre: "m" };
  };
  const { label, genre } = getTypeLabel();
  const article = genre === "f" ? "cette" : "ce";
  const surE = genre === "f" ? "sûre" : "sûr";

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {
        isLoading && <div className="flex items-center justify-center w-full h-full fixed inset-0 z-50">
          <FiLoader className="animate-spin text-primary absolute" size={40} />
        </div>
      }

      <div className="fixed bg-black/50 inset-0 z-9" onClick={onClose}></div>
      <div className="flex flex-col bg-white rounded-lg p-6 z-10 w-1/3">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="mt-2 text-gray-600">
          Êtes-vous {surE} de vouloir {getActionLabel()} {article} {label} ?
        </p>
        <div className="flex gap-4 justify-end mt-6">
          <Button onClick={onClose} title="Non" variant="secondary" />
          <Button onClick={response} title="Oui" variant="primary" />
        </div>
      </div>
    </div>
  )
}
export default ModalDialoge;