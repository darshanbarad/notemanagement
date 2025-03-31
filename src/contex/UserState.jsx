import { useState } from "react";
import UserContext from "./UserContext";

const UserState = (props) => {
  let [note, setNote] = useState();
  return (
    <UserContext.Provider value={{ note, setNote }}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserState;
