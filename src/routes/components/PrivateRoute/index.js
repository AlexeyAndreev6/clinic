import { Navigate, useLocation } from "react-router-dom";

function PrivateRoute({ children }) {
  const location = useLocation();
  const url = new URLSearchParams();
  url.set("redirect", location.pathname + location.search);

  return global.user ? (
    children
  ) : (
    <Navigate
      to={{
        pathname: "/login",
        search: url.toString(),
      }}
    />
  );
}

export default PrivateRoute;
