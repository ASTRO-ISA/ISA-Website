import { useAuth } from "@/context/AuthContext";
import Spinner from "./ui/Spinner";
import Login from "@/pages/authentication/Login";
import { Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const { userInfo, isLoggedIn } = useAuth();

  if (!isLoggedIn || !userInfo?.user) {
    return <Login />;
  }

  return <Outlet />;
};

export default PrivateRoute;
