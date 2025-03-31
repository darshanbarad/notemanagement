//---------------------------------------------------------------------\
import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { BsThreeDotsVertical, BsList } from "react-icons/bs";
import axios from "axios";
import Client from "../axios/AxiosConsumer";

const Header = () => {
  const [subMenu, setSubMenu] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [userEmail, setUserEmail] = useState();
  const [setId, setUserId] = useState();

  const btn = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!btn?.current?.contains(event.target)) {
        setSubMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [btn]);

  const handleAuthapi = () => {
    try {
      Client.get("/auth/authenticate")
        .then((response) => {
          console.log("response: ", response);
          setUserId(response?.data?.decodedToken.id);
          setUserEmail(response?.data?.decodedToken.email);
        })
        .catch((error) => {
          if (error.response?.data?.message.match("Invalid token")) {
            localStorage.removeItem("token");
          }
        });
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleDeleteAccount = () => {
    axios
      .delete(
        `https://react-router-back-end-e38b.vercel.app/user/accountdelete/${setId}`,
        {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        }
      )
      .then(() => {
        localStorage.removeItem("token");
        navigate("/login");
      })
      .catch((error) => {
        if (error.response?.data?.message.includes("Authentication required")) {
          navigate("/login");
        }
      });
  };

  return (
    <>
      <header className="shadow sticky z-50 top-0 bg-white text-black">
        <nav className="border-gray-200 px-4 lg:px-6 py-2.5">
          <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
            {/* Logo */}
            <div className="flex items-center relative w-32 ">
              <span className="bg-black inline-block h-8 w-8 text-center text-orange-500 text-2xl rounded-full">
                D
              </span>
              <p className="text-xl absolute right-9 font-extrabold text-orange-400">
                arshan
              </p>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button onClick={() => setMobileMenu(!mobileMenu)}>
                <BsList size={24} />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="hidden lg:flex justify-between items-center w-full lg:w-auto lg:order-1">
              <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                <li>
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `block py-2 pr-4 pl-3 duration-200 ${
                        isActive ? "text-orange-700" : "text-gray-700"
                      } border-b border-gray-100 hover:bg-gray-50 lg:border-0 hover:text-orange-700 lg:p-0`
                    }
                  >
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/user-note"
                    className={({ isActive }) =>
                      `block py-2 pr-4 pl-3 duration-200 ${
                        isActive ? "text-orange-700" : "text-gray-700"
                      } border-b border-gray-100 hover:bg-gray-50 lg:border-0 hover:text-orange-700 lg:p-0`
                    }
                  >
                    userNote
                  </NavLink>
                </li>
                <li>
                  <h2>{userEmail}</h2>
                </li>
              </ul>
            </div>

            {/* Profile Menu */}
            {localStorage.getItem("token") && (
              <div className="relative items-center lg:order-2 hidden lg:block">
                <button onClick={() => setSubMenu(!subMenu)}>
                  <BsThreeDotsVertical size={20} className="mt-1" />
                </button>
                {subMenu && (
                  <div
                    ref={btn}
                    className="absolute bg-black rounded-sm capitalize text-center text-white border-2 w-56 leading-8 right-0 p-3 top-[50px]"
                  >
                    <div>
                      <button onClick={handleClickLogout}>Log Out</button>
                    </div>
                    <div>
                      <button onClick={handleDeleteAccount}>
                        Delete Account
                      </button>
                    </div>
                    <div>
                      <Link to="/update">Change Password</Link>
                    </div>
                    <div>
                      <Link to="/updateprofile">Change Profile</Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* Mobile Menu Blur Effect */}
      {mobileMenu && (
        <div
          className="fixed inset-0 backdrop-blur-sm z-50"
          onClick={() => setMobileMenu(false)}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform ${
          mobileMenu ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300`}
      >
        <button
          className="p-4 text-gray-700"
          onClick={() => setMobileMenu(false)}
        >
          ✖ Close
        </button>
        <ul className="space-y-4 p-4">
          {/* <li className=" hover:text-red-500 z-50">
            <NavLink to="/home" onClick={() => setMobileMenu(false)}>
              Home
            </NavLink>
          </li> */}
          <li className=" hover:text-red-500">
            <NavLink
              to="/usernoteinformation"
              onClick={() => setMobileMenu(false)}
            >
              userNote
            </NavLink>
          </li>
        </ul>
        <div className="border-t mt-4 p-4 space-y-2">
          <h2 className="text-center font-semibold">{userEmail}</h2>
          <button
            onClick={handleDeleteAccount}
            className="block w-full text-left p-1 hover:text-red-500 "
          >
            Delete Account
          </button>
          <Link
            to="/update"
            className="block w-full p-1 hover:text-red-500"
            onClick={() => setMobileMenu(false)}
          >
            Change Password
          </Link>
          <Link
            to="/updateprofile"
            className="block w-full p-1 hover:text-red-500 "
            onClick={() => setMobileMenu(false)}
          >
            Change Profile
          </Link>
          <button
            onClick={handleClickLogout}
            className="block w-full p-1 text-center hover:rounded-md hover:bg-red-500 hover:text-white"
          >
            Log Out
          </button>
        </div>
      </div>
    </>
  );
};

export default Header;
