import React from "react";
// import Home from "../components/Home";
import Header from "../components/Header";
import UserNoteInformation from "../components/UserNoteInformation";

const Routerarray = [
  // { path: "/", title: "home", element: <Home /> },
  { path: "/header", title: "header", element: <Header /> },
  {
    path: "/user-note",
    title: "user-note",
    element: <UserNoteInformation />,
  },
];

export default Routerarray;
