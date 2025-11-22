import { HashRouter, Route, Routes } from "react-router-dom";
//@ts-ignore
import "./App.css";
//@ts-ignore
import "react-toastify/dist/ReactToastify.css";
import GlobalLayout from "./components/GlobalLayout";
import FileLayout from "./components/FileLayout";
import Chat from "./pages/Chat/Chat";
import SocialMedia from "./pages/SocialMedia/SocialMedia";
import Files from "./pages/file/Files";
import Images from "./pages/file/Images";
import Share from "./pages/file/Share";
import ShareMe from "./pages/file/ShareMe";
import Login from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import SignCode from "./pages/Admin/SignCode";
import Users from "./pages/Admin/Users";
import ChatRoom from "./components/Chat/ChatRoom";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchUser } from "./components/Chat/chatFonction";
import { setUser } from "./redux/features/user/user";
import FileComponant from "./pages/HomeFile"
import { departmentRoutes, thematicRoutes } from "./AppRouteConfig";
import Admin from "./pages/Admin/Admin";
import LeadingPage from "./pages/LeadingPage";

const App = () => {

  const dispatch = useDispatch()
  useEffect(() => {
    const getData = async () => {
      const allUser = await fetchUser();
      if (allUser) {
        dispatch(setUser(allUser))
      }
    }
    getData()
  }, []);

  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<ProtectedRoute><GlobalLayout /></ProtectedRoute>}>

            <Route index element={<LeadingPage />}></Route>
            {/* <Route path="/" element={<FileLayout />}>
            </Route> */}
            <Route path="/file/*" element={<FileLayout />}>
              {/* <Route path="file" element={<Files />} /> */}
              <Route path="image" element={<Images />} />
              <Route path="share" element={<Share title="Mes fichiers et dossiers partagés" />} />
              <Route path="share-with-me" element={<ShareMe title="Fichiers et dossiers partagés avec moi" />} />
              <Route path="file" element={<FileComponant title="Bienvenu dans PmbCloud" path="/" />} />
              {/* Sous-menus Département */}
              {departmentRoutes.map(({ path, title }) => (
                <Route
                  key={path}
                  path={path.slice(1)}
                  element={<FileComponant title={title} path={path} departement departementRoutes={path} />}
                />
              ))}

              {/* Sous-menus Thématique */}
              {thematicRoutes.map(({ path, title }) => (
                <Route
                  key={path}
                  path={path}
                  element={<FileComponant title={title} path={path} departement departementRoutes={path} />}
                />
              ))}
            </Route>
            <Route path="/chat/*" element={<Chat />}>
              <Route path=":conversationId" element={<ChatRoom />} />
            </Route>
            <Route path="/admin/*" element={<Admin />}>
              {/* Administration */}
              <Route path="sign-code" element={<SignCode />} />
              <Route path="users" element={<Users />} />
            </Route>
            <Route path="/social-media" element={<SocialMedia />} />
          </Route>
          <Route path="/login" element={<Login />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={7000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          //@ts-ignore : Ne connais pas le bodyClassName
          bodyClassName="bg-primary text-white"
        />
      </HashRouter>
    </AuthProvider>
  );
}

export default App;
