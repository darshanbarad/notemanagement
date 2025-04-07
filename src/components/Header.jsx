import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { BsThreeDotsVertical, BsList } from "react-icons/bs";
import axios from "axios";
import Client from "../axios/AxiosConsumer";
import { toast } from "react-toastify";

const Header = () => {
  const [subMenu, setSubMenu] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [userEmail, setUserEmail] = useState();
  const [setId, setUserId] = useState();
  const [logoutLoading, setLogoutLoading] = useState(false);

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
  }, []);

  useEffect(() => {
    handleAuthapi();
  }, []);

  const handleAuthapi = () => {
    try {
      Client.get("/auth/authenticate")
        .then((response) => {
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

  const handleClickLogout = async () => {
    try {
      setLogoutLoading(true);
      await Client.post("/api/logoutUser");
      localStorage.removeItem("token");
      toast.success("Logout Successfully");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("token");
      navigate("/login");
    } finally {
      setLogoutLoading(false);
    }
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
      <header className="shadow sticky top-0 z-50 bg-white text-black">
        <nav className="max-w-screen-xl mx-auto px-4 lg:px-6 py-2.5 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center ">
            <span className="bg-black text-orange-500 text-2xl rounded-full h-8 w-8 flex items-center justify-center">
              D
            </span>
            <p className="text-xl font-extrabold text-orange-400">arshan</p>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex gap-8 items-center">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-base font-medium ${
                  isActive ? "text-orange-600" : "text-gray-700"
                } hover:text-orange-600 transition duration-200`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/user-note"
              className={({ isActive }) =>
                `text-base font-medium ${
                  isActive ? "text-orange-600" : "text-gray-700"
                } hover:text-orange-600 transition duration-200`
              }
            >
              UserNote
            </NavLink>
            <span className="text-sm font-semibold text-gray-600">
              {userEmail}
            </span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="lg:hidden"
            >
              <BsList size={24} />
            </button>

            {/* Profile Menu (Desktop only) */}
            {localStorage.getItem("token") && (
              <div
                className="relative hidden lg:flex items-center ml-auto"
                ref={btn}
              >
                <button
                  onClick={() => setSubMenu(!subMenu)}
                  className="hover:bg-gray-100 p-2 rounded-full transition"
                >
                  <BsThreeDotsVertical size={20} />
                </button>
                {subMenu && (
                  <div className="absolute right-0 top-10 bg-black text-white w-56 p-3 rounded-md space-y-2 shadow-lg z-50">
                    <button
                      onClick={handleClickLogout}
                      disabled={logoutLoading}
                      className="w-full text-left hover:text-red-400"
                    >
                      {logoutLoading ? "Logging out..." : "Log Out"}
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      className="w-full text-left hover:text-red-400"
                    >
                      Delete Account
                    </button>
                    <Link to="/update" className="block hover:text-red-400">
                      Change Password
                    </Link>
                    <Link
                      to="/updateprofile"
                      className="block hover:text-red-400"
                    >
                      Change Profile
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* Mobile Menu Backdrop */}
      {mobileMenu && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={() => setMobileMenu(false)}
        ></div>
      )}

      {/* Mobile Side Menu */}
      <div
        className={`fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 transition-transform duration-300 ${
          mobileMenu ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4">
          <button
            onClick={() => setMobileMenu(false)}
            className="text-gray-700 text-lg mb-4"
          >
            ✖ Close
          </button>
          <ul className="space-y-4">
            <li>
              <NavLink
                to="/"
                onClick={() => setMobileMenu(false)}
                className="hover:text-orange-500"
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/user-note"
                onClick={() => setMobileMenu(false)}
                className="hover:text-orange-500"
              >
                UserNote
              </NavLink>
            </li>
          </ul>
          <hr className="my-4" />
          <div className="space-y-2">
            <h2 className="text-center text-gray-700 font-semibold">
              {userEmail}
            </h2>
            <button
              onClick={handleDeleteAccount}
              className="w-full text-left text-red-500 hover:underline"
            >
              Delete Account
            </button>
            <Link
              to="/update"
              className="block hover:text-orange-500"
              onClick={() => setMobileMenu(false)}
            >
              Change Password
            </Link>
            <Link
              to="/updateprofile"
              className="block hover:text-orange-500"
              onClick={() => setMobileMenu(false)}
            >
              Change Profile
            </Link>
            <button
              onClick={handleClickLogout}
              disabled={logoutLoading}
              className="block w-full mt-2 text-center text-white bg-red-500 hover:bg-red-600 rounded-md py-1"
            >
              {logoutLoading ? "Logging out..." : "Log Out"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
