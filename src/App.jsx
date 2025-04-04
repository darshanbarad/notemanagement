// import React, { useEffect, useState } from "react";
// import { Navigate, Route, Routes, useLocation } from "react-router-dom";
// import "./App.css";
// import Routerarray from "./pagewraper/Routearray";
// import Login from "./components/Login";
// import Signup from "./components/Signup";
// import Header from "./components/Header";

// const App = () => {
//   const [token, setToken] = useState(localStorage.getItem("token") || "");

//   return (
//     <>
//       <Routes>
//         <Route path="/login" element={<Login setToken={setToken} />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="*" element={<Navigate to="/login" />} />
//         {Routerarray?.map((item, index) => (
//           <Route
//             key={index}
//             path={item.path}
//             element={
//               token ? (
//                 <Pagewraper
//                   title={item.title}
//                   path={item.path}
//                   element={item.element}
//                   token={token}
//                 />
//               ) : (
//                 <Navigate to="/login" />
//               )
//             }
//           />
//         ))}
//       </Routes>
//     </>
//   );
// };

// export default App;

// const Pagewraper = ({ title, element, token }) => {
//   const { pathname } = useLocation();

//   useEffect(() => {
//     document.title = `${title}-darshan`;
//   }, [pathname]);

//   return (
//     <>
//       {token && <Header />}
//       {element}
//     </>
//   );
// };

import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Routerarray from "./pagewraper/Routearray";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Header from "./components/Header";
import { ToastContainer } from "react-toastify"; // ✅ ToastContainer import
import "react-toastify/dist/ReactToastify.css"; // ✅ CSS import

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

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

      {/* ✅ Toast Container globally */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
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
