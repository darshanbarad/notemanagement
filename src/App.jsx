import React, { useContext, useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Routerarray from "./pagewraper/Routearray";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Header from "./components/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserContext from "./contex/UserContext";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const { notes } = useContext(UserContext);

  useEffect(() => {
    const intervalIds = [];

    notes.forEach((note) => {
      if (note.reminder) {
        const reminderTime = new Date(note.reminder).getTime();
        const currentTime = new Date().getTime();
        const timeDifference = reminderTime - currentTime;

        if (timeDifference > 0) {
          const timeoutId = setTimeout(() => {
            toast.info(`🔔 Reminder for: ${note.title}`, {
              toastId: `reminder-${note._id}`,
            });
          }, timeDifference);

          intervalIds.push(timeoutId);
        }
      }
    });

    return () => {
      intervalIds.forEach(clearTimeout);
    };
  }, [notes]);

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/login" />} />
        {Routerarray?.map((item, index) => (
          <Route
            key={index}
            path={item.path}
            element={
              token ? (
                <Pagewraper
                  title={item.title}
                  path={item.path}
                  element={item.element}
                  token={token}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        ))}
      </Routes>

      {/* 🔔 Toast container globally */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
        style={{
          fontSize: "14px",
          width: "90%",
          maxWidth: "400px",
          margin: "auto",
        }}
      />
    </>
  );
};

export default App;

const Pagewraper = ({ title, element, token }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = `${title}-darshan`;
  }, [pathname]);

  return (
    <>
      {token && <Header />}
      {element}
    </>
  );
};
