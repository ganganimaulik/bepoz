import React, { useContext, useEffect } from "react";
import { getAllUsers } from "../API";
import UserContext from "../context/UserContext";
import { IUser } from "../types/types";

function UserSelect() {
  const { setUser } = useContext(UserContext);

  const [users, setUsers] = React.useState([] as IUser[]);
  useEffect(() => {
    getAllUsers().then((res) => {
      setUsers(res.data.users);
      setUser(res.data.users[0]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      SelectUser:{" "}
      <select
        className="user-select"
        onChange={(e) => {
          e.preventDefault();
          let user = users.find((u) => u.id == Number(e.target.value));
          if (user) {
            setUser(user);
          }
        }}
      >
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name} - {user.company ?? "unemployed"}
          </option>
        ))}
      </select>
    </div>
  );
}

export default UserSelect;
