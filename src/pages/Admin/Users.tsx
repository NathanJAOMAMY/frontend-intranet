import { useState, useMemo } from "react";
import UserModale from "../../components/Admin/Modale/UserModale";
import Button from "../../components/UI/Button";
import { userRoles, userRolesTranslat, userVoid } from "../../data/voidData";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux";
import { User, UserRole } from "../../data/typeData";
import { addUserLocal } from "../../redux/features/user/user";
import { v4 as uuid } from "uuid";
import InputField from "../../components/UI/InputField";
import { onAddService, onUpdateService } from "../../components/Admin/serviceUsers";
import { toast } from "react-toastify";
import ModalDialoge from "../../components/UI/ModalDialoge";

const Users = () => {
  const [showModale, setShowModale] = useState(false);
  const [userSlected, setUserSlected] = useState<User>(userVoid);
  const [typeModale, setTypeModale] = useState<"add" | "edit">("add");
  const [showModaleDialoge, setShowModaleDialoge] = useState<boolean>(false)

  // États pour les filtres
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");

  const allUser = useSelector((state: RootState) => state.user.users);
  const dispatch = useDispatch();

  const handelUser = async (user: User) => {
    if (typeModale === "edit") {
      const response = await onUpdateService('users', user);
      if (response === "error") {
        toast.error("Erreur lors de la modification de l'utilisateur");
      }
      else {
        toast.success("Utilisateur modifié avec succès");
        dispatch(addUserLocal(user));
      }

    }
    else {
      const userAdd: User = { ...user, idUser: uuid(), password: '0000' };
      console.log(userAdd)
      const response = await onAddService('addUser', userAdd);
      if (response === "error") {
        toast.error("Erreur lors de l'ajout de l'utilisateur");
      } else {
        toast.success("Utilisateur ajouté avec succès");
        dispatch(addUserLocal(userAdd));
      }
    }

  };

  // Filtrage combiné : recherche + rôle
  const filteredUsers = useMemo(() => {
    return allUser.filter((user) => {
      const matchesSearch =
        `${user.userName} ${user.surname} ${user.pseudo ?? ""} ${user.email}`
          .toLowerCase().includes(search.toLowerCase());

      const matchesRole = roleFilter === "all" || user.roleUser.includes(roleFilter);
      return matchesSearch && matchesRole;
    });
  }, [allUser, search, roleFilter]);
  const onShowModale = (user: User) => {
    // setUserSlected(user)
    console.log(userSlected)
    setShowModaleDialoge(true)
  }
  return (
    <div className="flex flex-col gap-4 p-2">
      {/* Header */}
      <div className="grid grid-cols-[1fr_3fr_1fr] items-center gap-4 border-b-2 pb-2">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <span>Utilisateurs</span>
          <span className="bg-primary/10 text-primary text-sm font-medium px-2 py-0.5 rounded-full">
            {filteredUsers.length}
          </span>
        </h2>
        <div className="flex gap-2 items-center justify-center">
          <InputField onChange={(v) => setSearch(v)} value={search} placeholder="Rechercher un utilisateur..."></InputField>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as UserRole | "all")}
            className="p-2 pl-3 pr-10 border-2 border-primary bg-white rounded-lg text-sm outline-none 
           disabled:opacity-60 disabled:cursor-not-allowed focus:border-primary"
          >
            <option value="all">Tous les rôles</option>
            {
              userRoles.map((userRole, key) => {
                return (
                  <option key={key} value={userRole}>{userRolesTranslat[userRole]}</option>
                )
              })
            }
          </select>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={() => {
              setUserSlected(userVoid);
              setTypeModale("add");
              setShowModale(true);
            }}
            title="Ajouter"
            variant="primary"
            icon="mdi:account-plus"
          />
        </div>
      </div>

      {/* Liste */}
      <div className="flex flex-col gap-1">

        <div className="flex flex-col px-6 py-1 gap-2 h-[65vh] overflow-auto">
          {filteredUsers.length === 0 ? (
            <p className="text-gray-500 text-center italic text-2xl">Aucun utilisateur trouvé.</p>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.idUser}
                className="flex items-center justify-between shadow-primary bg-white shadow-sm rounded-2xl p-4 hover:shadow-md hover:border-primary/40 transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.userName}
                      className="w-14 h-14 rounded-full object-cover border border-gray-300"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-300 to-gray-200 flex items-center justify-center text-lg font-semibold text-gray-700 border border-gray-300">
                      {user.userName.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800 text-base">
                      {user.userName} {user.surname}{" "}
                      {user.pseudo && (
                        <span className="text-gray-500 text-sm">({user.pseudo})</span>
                      )}
                    </span>
                    <span className="text-sm text-gray-600">{user.email}</span>
                    <span className="text-sm text-gray-500">
                      <span className="font-medium text-gray-700">Rôles :</span>{" "}
                      {user.roleUser.join(", ")}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Button
                    onClick={() => { onShowModale(user); setUserSlected(user) }}
                    title="Supprimer"
                    variant="delete"
                    icon="mdi:trash-can-outline"
                  />
                  <Button
                    onClick={() => {
                      setUserSlected(user);
                      setTypeModale("edit");
                      setShowModale(true);
                    }}
                    title="Modifier"
                    variant="primary"
                    icon="mdi:pencil-outline"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {/* Afichage du modale dialogue */}
      {showModaleDialoge && (
        <ModalDialoge action="delete"
          type="User" content={userSlected}
          onClose={() => setShowModaleDialoge(false)}
          title="Utilisateur"></ModalDialoge>)}
      {/* Modale d’ajout/modif */}
      {showModale && (
        <UserModale
          onClose={() => setShowModale(false)}
          type={typeModale}
          userSlected={userSlected}
          onSubmit={handelUser}
        />
      )}
    </div>
  );
};

export default Users;
