import {Navigate, Outlet} from "react-router-dom";
import {useSelector} from "react-redux";
import type {RootState} from "../store/store";
import type {UserRole} from "../store/Authslice";

interface Props {
  role: UserRole;
}

export default function ProtectedRoute({role}: Props) {
  const {user, token} = useSelector((state: RootState) => state.auth);

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== role) {
    return (
      <Navigate
        to={
          user.role === "employee"
            ? "/employee/dashboard"
            : "/company/dashboard"
        }
        replace
      />
    );
  }

  return <Outlet />;
}
