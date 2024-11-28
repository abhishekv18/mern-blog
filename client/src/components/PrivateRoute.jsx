import { useSelector } from "react-redux"
import { Outlet,Navigate } from "react-router-dom";


//outlet means childern

export default function PrivateRoute() {
    const { currentUser } = useSelector((state) => state.user);
  return currentUser ? <Outlet/>:<Navigate to='/sign-in'/>;
}
