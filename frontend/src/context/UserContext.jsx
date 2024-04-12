import { createContext, useState, useContext, useEffect } from "react";
import {
  createUserRequest,
  loginUserRequest,
  verifyTokenRequest,
  logOutRequest,
  getUserRequest,
  deleteUserRequest,
  updateUserRequest,
} from "../api/user.api";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthPrivider");
  }
  return context;
};
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);

  const signUp = async (user) => {
    try {
      const res = await createUserRequest(user);
      setIsAuthenticated(true);
      setUser(res.data);
      getUsers();
      checkLogin();
      return res;
    } catch (error) {
      return error.response.data;
    }
  };

  const updateUser = async (userDetails) => {
    try {
      await updateUserRequest(userDetails);
      checkLogin();
      return "Usuario actualizado"
    } catch (error) {
      console.log(error);
      return error.response.data;
    }
  };

  const logIn = async (user) => {
    try {
      const res = await loginUserRequest(user);
      setIsAuthenticated(true);
      setUser(res.data);
      checkLogin();
      return "Logeado Correctamente";
    } catch (error) {
      return error.response.data;
    }
  };

  const logOut = async () => {
    try {
      await logOutRequest();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.log(error);
      return ;
    }
  };

  const checkLogin = async () => {
    const cookies = Cookies.get();
    if (!cookies.token) {
      setIsAuthenticated(false);
      setUser(null);
      return;
    }
    try {
      const res = await verifyTokenRequest(cookies.token);
      if (!res.data) {
        return setIsAuthenticated(false);
      }
      setIsAuthenticated(true);
      setUser(res.data);
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const getUsers = async () => {
    try {
      const res = await getUserRequest();
      setUsers(res.data);
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const deleteUser = async (userId) => {
    try {
      await deleteUserRequest(userId);
      getUsers();
    } catch (error) {
      console.log(error);
      return error.response.data;
    }
  };

  useEffect(() => {
    const check = async () => {
      await checkLogin();
    };
    check();
    getUsers();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        users,
        logIn,
        logOut,
        signUp,
        updateUser,
        checkLogin,
        getUsers,
        deleteUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
