// import React, { useEffect, useState } from "react";
// import { Formik, Form } from "formik";
// import { Link, useNavigate } from "react-router-dom";
// import { MdOutlineMail } from "react-icons/md";
// import { FaEye } from "react-icons/fa";
// import { IoIosEyeOff } from "react-icons/io";
// import * as Yup from "yup";
// import axios from "axios";

// const Login = ({ setToken }) => {
//   useEffect(() => {
//     document.title = "Login | InsideBox";
//   }, []);

//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();

//   const validationSchema = Yup.object({
//     email: Yup.string()
//       .trim()
//       .email("Enter a valid email")
//       .required("Email is required"),
//     password: Yup.string()
//       .trim()
//       .required("Password is required")
//       .min(8, "Password must be at least 8 characters"),
//   });

//   const handleSubmit = async (values, { setErrors }) => {
//     try {
//       const response = await axios.post(
//         "http://localhost:5000/api/login",
//         values
//       );

//       if (response?.data?.token) {
//         localStorage.setItem("token", response.data.token);
//         setToken(response.data.token);
//         navigate("/user-note");
//       }
//     } catch (error) {
//       if (error.response?.data?.message) {
//         const errorMessage = error.response.data.message;
//         if (errorMessage.includes("User not found")) {
//           setErrors({ email: "No account found with this email" });
//         } else if (errorMessage.includes("Invalid credentials")) {
//           setErrors({ password: "Incorrect password" });
//         }
//       }
//     }
//   };

//   return (
//     <div className="w-full h-screen flex justify-center items-center bg-gray-100">
//       <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
//         <Formik
//           initialValues={{ email: "", password: "" }}
//           validationSchema={validationSchema}
//           onSubmit={handleSubmit}
//         >
//           {({ values, handleChange, handleBlur, touched, errors }) => (
//             <Form>
//               <h2 className="text-2xl font-bold text-center">
//                 Log in to InsideBox
//               </h2>

//               {/* E-mail Input Field */}
//               <div className="relative mt-6">
//                 <input
//                   className="peer w-full h-12 border border-gray-300 rounded-lg px-3 pt-3.5 pb-1 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-[16px]"
//                   type="email"
//                   name="email"
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   value={values.email}
//                   autoComplete="on"
//                 />
//                 <label
//                   className={`absolute left-3 px-1 bg-white transition-all duration-300 ${
//                     values.email || document.activeElement.name === "email"
//                       ? "-top-2 text-sm text-blue-500"
//                       : "top-3.5 text-gray-400"
//                   } peer-focus:-top-2 peer-focus:text-sm peer-focus:text-blue-500`}
//                 >
//                   E-mail
//                 </label>
//                 <MdOutlineMail className="absolute right-3 top-4 text-gray-400 text-lg" />
//               </div>
//               {errors.email && touched.email && (
//                 <span className="text-sm text-red-500">{errors.email}</span>
//               )}

//               {/* Password Input Field */}
//               <div className="relative mt-4">
//                 <input
//                   className="peer w-full h-12 border border-gray-300 rounded-lg px-3 pt-3.5 pb-1 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-[16px]"
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   value={values.password}
//                   autoComplete="current-password"
//                 />
//                 <label
//                   className={`absolute left-3 px-1 bg-white transition-all duration-300 ${
//                     values.password ||
//                     document.activeElement.name === "password"
//                       ? "-top-2 text-sm text-blue-500"
//                       : "top-3.5 text-gray-400"
//                   } peer-focus:-top-2 peer-focus:text-sm peer-focus:text-blue-500`}
//                 >
//                   Password
//                 </label>
//                 <button
//                   type="button"
//                   className="absolute right-4 top-4"
//                   onClick={() => setShowPassword(!showPassword)}
//                 >
//                   {showPassword ? (
//                     <FaEye className="text-lg text-gray-500" />
//                   ) : (
//                     <IoIosEyeOff className="text-lg text-gray-500" />
//                   )}
//                 </button>
//               </div>
//               {errors.password && touched.password && (
//                 <span className="text-sm text-red-500">{errors.password}</span>
//               )}

//               {/* Submit Button */}
//               <button
//                 className="w-full rounded-lg py-3 bg-blue-500 hover:bg-blue-600 text-xl text-white mt-7 capitalize"
//                 type="submit"
//               >
//                 Log In
//               </button>

//               <p className="mt-5 text-center text-gray-600">
//                 Not a member?
//                 <Link to="/signup" className="text-blue-500 font-medium">
//                   {" "}
//                   Sign up now
//                 </Link>
//               </p>
//             </Form>
//           )}
//         </Formik>
//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineMail } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { IoIosEyeOff } from "react-icons/io";
import * as Yup from "yup";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = ({ setToken }) => {
  useEffect(() => {
    document.title = "Login | InsideBox";
  }, []);

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string()
      .trim()
      .email("Enter a valid email")
      .required("Email is required"),
    password: Yup.string()
      .trim()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters"),
  });

  // const handleSubmit = async (values, { setErrors }) => {
  //   try {
  //     const response = await axios.post(
  //       "http://localhost:5000/api/login",
  //       values
  //     );

  //     if (response?.data?.token) {
  //       localStorage.setItem("token", response.data.token);
  //       setToken(response.data.token);
  //       toast.success("Login successful! 🎉", {
  //         position: "top-right",
  //         autoClose: 3000,
  //       });
  //       navigate("/user-note");
  //     }
  //   } catch (error) {
  //     toast.error("Login failed. Please try again.", {
  //       position: "top-right",
  //       autoClose: 3000,
  //     });

  //     if (error.response?.data?.message) {
  //       const errorMessage = error.response.data.message;
  //       if (errorMessage.includes("User not found")) {
  //         setErrors({ email: "No account found with this email" });
  //       } else if (errorMessage.includes("Invalid credentials")) {
  //         setErrors({ password: "Incorrect password" });
  //       }
  //     }
  //   }
  // };

  const handleSubmit = async (values, { setErrors }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/login",
        values
      );

      if (response?.data?.token) {
        localStorage.setItem("token", response.data.token);
        setToken(response.data.token);

        // ✅ Show toast notification
        toast.success("Login Successful!", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });

        // ✅ Navigate after delay
        setTimeout(() => {
          navigate("/user-note");
        }, 1000);
      }
    } catch (error) {
      if (error.response?.data?.message) {
        const errorMessage = error.response.data.message;

        if (errorMessage.includes("User not found")) {
          setErrors({ email: "No account found with this email" });
        } else if (errorMessage.includes("Invalid credentials")) {
          setErrors({ password: "Incorrect password" });
        }

        // ✅ Optional: show error toast
        toast.error("Login failed! Please check your credentials.", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
      }
    }
  };
  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <ToastContainer />
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, handleBlur, touched, errors }) => (
            <Form>
              <h2 className="text-2xl font-bold text-center">
                Log in to InsideBox
              </h2>

              {/* E-mail */}
              <div className="relative mt-6">
                <input
                  className="peer w-full h-12 border border-gray-300 rounded-lg px-3 pt-3.5 pb-1 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-[16px]"
                  type="email"
                  name="email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                  autoComplete="on"
                />
                <label
                  className={`absolute left-3 px-1 bg-white transition-all duration-300 ${
                    values.email || document.activeElement.name === "email"
                      ? "-top-2 text-sm text-blue-500"
                      : "top-3.5 text-gray-400"
                  } peer-focus:-top-2 peer-focus:text-sm peer-focus:text-blue-500`}
                >
                  E-mail
                </label>
                <MdOutlineMail className="absolute right-3 top-4 text-gray-400 text-lg" />
              </div>
              {errors.email && touched.email && (
                <span className="text-sm text-red-500">{errors.email}</span>
              )}

              {/* Password */}
              <div className="relative mt-4">
                <input
                  className="peer w-full h-12 border border-gray-300 rounded-lg px-3 pt-3.5 pb-1 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-[16px]"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  autoComplete="current-password"
                />
                <label
                  className={`absolute left-3 px-1 bg-white transition-all duration-300 ${
                    values.password ||
                    document.activeElement.name === "password"
                      ? "-top-2 text-sm text-blue-500"
                      : "top-3.5 text-gray-400"
                  } peer-focus:-top-2 peer-focus:text-sm peer-focus:text-blue-500`}
                >
                  Password
                </label>
                <button
                  type="button"
                  className="absolute right-4 top-4"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEye className="text-lg text-gray-500" />
                  ) : (
                    <IoIosEyeOff className="text-lg text-gray-500" />
                  )}
                </button>
              </div>
              {errors.password && touched.password && (
                <span className="text-sm text-red-500">{errors.password}</span>
              )}

              <button
                className="w-full rounded-lg py-3 bg-blue-500 hover:bg-blue-600 text-xl text-white mt-7 capitalize"
                type="submit"
              >
                Log In
              </button>

              <p className="mt-5 text-center text-gray-600">
                Not a member?
                <Link to="/signup" className="text-blue-500 font-medium">
                  {" "}
                  Sign up now
                </Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
