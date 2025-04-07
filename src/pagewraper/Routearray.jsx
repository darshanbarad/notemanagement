import React from "react";
// import Home from "../components/Home";
import Header from "../components/Header";
import UserNoteInformation from "../components/UserNoteInformation";
import ChangePassword from "../components/ChangePassword";
import UpdateProfile from "../components/UpdateProfile";

const Routerarray = [
  // { path: "/", title: "home", element: <Home /> },
  { path: "/header", title: "header", element: <Header /> },
  {
    path: "/",
    title: "user-note",
    element: <UserNoteInformation />,
  },
  {
    path: "/change-password",
    title: "change-password",
    element: <ChangePassword />,
  },
  {
    path: "/update-profile",
    title: "update-profile",
    element: <UpdateProfile />,
  },
];

export default Routerarray;
