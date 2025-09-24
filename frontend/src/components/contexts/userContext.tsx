import { createContext, useEffect, useState, useContext } from "react";
import type { ProfileUserInfo } from "../../types/user";
import type { userContextType } from "../../types/userContextType";
import api from "../../axios";
import { useNavigate } from "react-router";

export const UserContext = createContext<userContextType | undefined>(
  undefined
);

export const UserProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<ProfileUserInfo | undefined>({
    id: 0,
    avatar: "",
    username: "",
    email: "",
    first_login: false,
  });

  useEffect(() => {
    api("/user", { withCredentials: true })
      .then(function (res) {
        setUser(res.data.infos);
      })
      .catch(function (err) {
        if (
          err.response.status == 401 &&
          err.response.data.error == "Unauthorized"
        )
          navigate("/login");
      });
  }, []);

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used inside UserProvider!!!!");
  }
  return context;
};
