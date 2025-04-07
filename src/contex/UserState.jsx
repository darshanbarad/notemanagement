import { useState } from "react";
import UserContext from "./UserContext";

const UserState = (props) => {
  const [notes, setNotes] = useState([]);

  return (
    <UserContext.Provider value={{ notes, setNotes }}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserState;
