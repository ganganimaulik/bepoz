import React from "react";
import { IUser } from "../types/types";

const UserContext = React.createContext({
  user: null as IUser | null,
  setUser: (user: IUser | null) => {},
});

export default UserContext;
