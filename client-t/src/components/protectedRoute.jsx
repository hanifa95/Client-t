import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const uid = localStorage.getItem("uid");

  if (!uid) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;