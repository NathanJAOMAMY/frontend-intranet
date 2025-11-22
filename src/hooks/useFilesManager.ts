import { useState } from "react";
import axios from "axios";
import { supabase } from "../supabase";
import { v4 as uuid } from "uuid";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../api";
import { File, Folder } from "../data/typeData";
import { useSelector } from "react-redux";
import { RootState } from "../redux";
import { updateFile, updateFolder, uploadFile } from "../tools/tools";
import { folderVoid } from "../data/voidData";

const useFilesManager = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loadingFile, setLoadingFile] = useState(false);
  const [progress, setProgress] = useState(0);
  const [navagation, setNavigation] = useState<string[]>([]);
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [currentFolder, setCurrentFolder] = useState<Folder>(folderVoid);
  const [isDownloading, setIsDownloading] = useState(false);

  // Récupérer fichiers
  const getFiles = async (
    folder: Folder,
    userId: string = currentUser.idUser,
    isDepartement: boolean = false,
    departmentRoutes?: string
  ) => {
    setLoadingFile(true);
    try {
      const params: {
        folderId: string;
        userId?: string;
        departmentRoutes?: string;
      } = {
        folderId: folder.id,
        departmentRoutes: departmentRoutes,
      };
      if (!isDepartement) {
        params.userId = userId;
      }

      const res = await axios.get<{ allFiles: File[] }>(
        `${API_BASE_URL}/file`,
        { params: params }
      );

      setFiles(res.data.allFiles);
    } catch (err) {
      console.error("Erreur getFiles:", err);
    } finally {
      setLoadingFile(false);
    }
  };

  // Récupérer dossiers
  const getFolders = async (
    parentFolderId: string,
    userId: string = currentUser.idUser,
    isDepartement: boolean = false,
    departmentRoutes?: string
  ) => {
    try {
      const params: {
        parentFolderId: string;
        departmentRoutes?: string;
        userId?: string;
      } = { parentFolderId, departmentRoutes: departmentRoutes };
      if (!isDepartement) {
        params.userId = userId;
      }

      const res = await axios.get<{ data: Folder[] }>(
        `${API_BASE_URL}/folder`,
        { params: params }
      );

      setFolders(res.data.data);
    } catch (err) {
      console.error("Erreur getFolders:", err);
    }
  };

// 🧩 Cache global pour les dossiers déjà créés
const folderCache: Record<string, string> = {};

// 🔹 Crée récursivement les dossiers pour un chemin relatif
const ensureFolderPath = async (
  relativePath: string,
  parentId: string | "/"
): Promise<string> => {
  const parts = relativePath.split("/").filter(Boolean);
  let currentParentId = parentId;
  let currentPath = "";

  for (const folderName of parts) {
    currentPath = currentPath ? `${currentPath}/${folderName}` : folderName;

    // 🔍 Vérifie si ce chemin a déjà été créé (A, A/B, etc.)
    if (folderCache[currentPath]) {
      currentParentId = folderCache[currentPath];
      continue;
    }

    // 🔍 Vérifie si le dossier existe déjà localement
    let existing = folders.find(
      (f) => f.name === folderName && f.parentFolderId === currentParentId
    );

    if (existing) {
      currentParentId = existing.id;
      folderCache[currentPath] = existing.id; // 🗂️ Mémorise
    } else {
      const newFolder: Folder = {
        id: uuid(),
        name: folderName,
        parentFolderId: currentParentId,
        userId: currentUser.idUser,
        userIdAcces: [],
      };

      await axios.post(`${API_BASE_URL}/folder`, newFolder);
      setFolders((prev) => [...prev, newFolder]);

      currentParentId = newFolder.id;
      folderCache[currentPath] = newFolder.id; // 🗂️ Mémorise
    }
  }

  return currentParentId;
};

// 🔹 Upload des fichiers et création automatique des dossiers
const handleUploadFile = async (files: FileList) => {
  setLoadingFile(true);

  try {
    const allFiles = Array.from(files);
    const hasFile = allFiles.some((file) => file.name.includes("."));
    if (!hasFile) {
      toast.error("Veuillez ajouter uniquement des fichiers, pas des dossiers vides !");
      setLoadingFile(false);
      return;
    }

    for (const file of allFiles) {
      const relativePath = file.webkitRelativePath || file.name;
      const parts = relativePath.split("/");
      const fileName = parts.pop()!;
      const folderPath = parts.join("/");

      let folderId = currentFolder.id;

      // ✅ Crée la hiérarchie complète et unique
      if (folderPath) {
        folderId = await ensureFolderPath(folderPath, currentFolder.id || "/");
      }

      // 🔹 Upload du fichier
      const url = await uploadFile(file, "file/");
      if (!url) continue;

      const infoFile: File = {
        id: uuid(),
        fileName,
        originalName: file.name,
        sizeFile: file.size,
        typeFile: file.name.split(".").pop() || "unknown",
        mimeType: file.type,
        url,
        folderId,
        userId: currentUser.idUser,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "active",
      };

      await axios.post(`${API_BASE_URL}/file`, infoFile);
      toast.success(`${file.name} ajouté avec succès !`);
    }
  } catch (err) {
    console.error(err);
    toast.error("Erreur lors de l’import des fichiers !");
  } finally {
    await getFiles(currentFolder, currentUser.idUser);
    setLoadingFile(false);
  }
};


  // Suppression fichier
  const removeFile = async (id: string, url: string): Promise<void> => {
    try {
      await supabase.storage
        .from("intranet")
        .remove([`file/${url.split("/").pop()}`]);
      await axios.delete(`${API_BASE_URL}/file/${id}`);
      toast.success("Fichier supprimé");
    } catch (err) {
      toast.error("Erreur lors de la suppression");
    } finally {
      // Toujours recharger la liste après suppression
      getFiles(currentFolder, currentUser.idUser);
    }
  };

  // Suppression d’un dossier
  const removeFolder = async (id: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/folder/${id}`);
      toast.success("Dossier supprimé");
      getFolders(currentFolder?.id);
    } catch (err) {
      toast.error("Erreur lors de la suppression du dossier");
    }
  };

  // Télécharger un dossier (zip)
  const downloadFolder = async (folderId: string, folderName: string) => {
    try {
      setIsDownloading(true);
      const response = await axios.get(
        `${API_BASE_URL}/folder/download-folder/${folderId}`,
        {
          responseType: "blob",
          onDownloadProgress: (progressEvent) => {
            console.log(progressEvent);
            const total = progressEvent.total ?? 0;
            const current = progressEvent.loaded;
            const percentCompleted = Math.floor((current / total) * 100);
            setProgress(percentCompleted);
          },
        }
      );
      const blob = new Blob([response.data]);
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `${folderName}.zip`;
      link.click();
      setProgress(0);
      toast.success("Dossier téléchargé avec succès !");
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors du téléchargement du dossier");
      setProgress(0);
    } finally {
      setIsDownloading(false);
    }
  };

  // Création d’un dossier
  const createFolder = async (folderName: string) => {
    if (!folderName.trim()) {
      toast.warning("Le nom du dossier est requis !");
      return;
    }
    const folder: Folder = {
      id: uuid(),
      name: folderName,
      parentFolderId: currentFolder.id,
      userId: currentUser.idUser,
      userIdAcces: [],
    };
    try {
      await axios.post(`${API_BASE_URL}/folder`, folder);
      toast.success("Dossier créé avec succès !");
      getFolders(currentFolder?.id);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la création du dossier");
    }
  };

  // Renommer un fichier
  const renameFile = async (id: string, newName: string) => {
    if (!newName.trim()) {
      toast.warning("Le nouveau nom est requis !");
      return;
    }
    try {
      await updateFile(id, newName);
      toast.success("Fichier renommé avec succès !");
      getFiles(currentFolder);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors du renommage du fichier");
    }
  };

  // Renommer un dossier
  const renameFolder = async (id: string, newName: string) => {
    if (!newName.trim()) {
      toast.warning("Le nouveau nom est requis !");
      return;
    }
    try {
      let response = await updateFolder(id, newName);
      if (response) {
        toast.success("Dossier renommé avec succès !");
        getFolders(currentFolder.id);
      }
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors du renommage du dossier");
    }
  };

  return {
    files,
    folders,
    loadingFile,
    progress,
    navagation,
    currentFolder,
    isDownloading,
    setCurrentFolder,
    setProgress,
    setNavigation,
    getFiles,
    getFolders,
    handleUploadFile,
    removeFile,
    removeFolder,
    renameFile,
    renameFolder,
    downloadFolder,
    createFolder,
  };
};

export default useFilesManager;
