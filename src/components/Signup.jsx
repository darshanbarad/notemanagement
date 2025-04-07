import React, { useState } from "react";
import { Formik, Form } from "formik";
import { MdOutlineMail } from "react-icons/md";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Client from "../axios/AxiosConsumer";

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    firstName: Yup.string().trim().required("First name is required"),
    lastName: Yup.string().trim().required("Last name is required"),
    email: Yup.string()
      .trim()
      .email("Enter valid email")
      .required("Email is required"),
    password: Yup.string()
      .trim()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters"),
  });

  const handleSubmit = async (values, { setErrors }) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await Client.post("/api/register", values);
      console.log("API Response:", response.data);
      setLoading(false);

      toast.success("Account created successfully!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      setLoading(false);
      console.error("API Error:", error.response ? error.response.data : error);
      if (error.response && error.response.data.message) {
        setErrorMessage(error.response.data.message);
        setErrors({ email: error.response.data.message });
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <>
      <div className="w-full h-screen flex justify-center items-center bg-gray-100">
        <div className="w-96 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>

          {errorMessage && (
            <p className="text-red-500 text-center">{errorMessage}</p>
          )}

          <Formik
            initialValues={{
              firstName: "",
              lastName: "",
              email: "",
              password: "",
            }}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            {({ values, touched, errors, handleChange, handleBlur }) => (
              <Form className="space-y-4">
                {/* First Name */}
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={values.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full p-2 border rounded"
                />
                {errors.firstName && touched.firstName && (
                  <p className="text-red-500">{errors.firstName}</p>
                )}

                {/* Last Name */}
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={values.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full p-2 border rounded"
                />
                {errors.lastName && touched.lastName && (
                  <p className="text-red-500">{errors.lastName}</p>
                )}

                {/* Email */}
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full p-2 border rounded"
                  />
                  <MdOutlineMail className="absolute right-3 top-3 text-gray-500" />
                </div>
                {errors.email && touched.email && (
                  <p className="text-red-500">{errors.email}</p>
                )}

                {/* Password */}
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full p-2 border rounded"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3"
                  >
                    {showPassword ? (
                      <FaEye className="text-gray-500" />
                    ) : (
                      <FaEyeSlash className="text-gray-500" />
                    )}
                  </button>
                </div>
                {errors.password && touched.password && (
                  <p className="text-red-500">{errors.password}</p>
                )}

                {/* Submit Button with loader */}
                <button
                  type="submit"
                  className="w-full py-2 bg-blue-500 text-white rounded flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? <ClipLoader size={20} color="#fff" /> : "Sign up"}
                </button>
              </Form>
            )}
          </Formik>

          {/* Login Link */}
          <p className="text-center mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500">
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer position="top-center" />
    </>
  );
};

export default Signup;
