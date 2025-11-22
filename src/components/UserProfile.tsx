import { FC } from 'react';
import { useSelector } from 'react-redux';
import { findeUser } from '../tools/tools';
import { User } from '../data/typeData';
import { RootState } from '../redux';
interface UserProfileProps {
  user: User | null;
}

const UserProfile: FC<UserProfileProps> = ({ user }) => {
  const allUsers = useSelector((state: RootState) => state.user.users);
  if (!user) return <div className="user-profile-card">Profil non disponible</div>;

  return (
    <div className="user-profile-card">
      <div className="user-profile-avatar">

        {findeUser(user.idUser, allUsers) ? (
          <img
            src={user.avatar}
            alt="avatar"
            style={{ width: '70px', height: '70px', borderRadius: '50%' }}
          />
        ) : (
          user.userName?.charAt(0)?.toUpperCase()
        )}
      </div>
      <div className="user-profile-info">
        <div className="user-profile-name">{user.userName} {user.surname}</div>
        <div className="user-profile-desc">{user.email}</div>
      </div>
    </div>
  );
};

export default UserProfile;