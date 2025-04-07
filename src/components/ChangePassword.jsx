import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";
import { ClipLoader } from "react-spinners";

const ChangePassword = () => {
  const [loading, setLoading] = useState(false);

  const initialValues = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    oldPassword: Yup.string()
      .required("Old password is required")
      .min(8, "Minimum 8 characters"),
    newPassword: Yup.string()
      .required("New password is required")
      .min(8, "Minimum 8 characters"),
    confirmPassword: Yup.string()
      .required("Confirm your new password")
      .oneOf([Yup.ref("newPassword")], "Passwords do not match"),
  });

  const handleChangePassword = async (values, { resetForm }) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const response = await axios.patch(
        "https://note-back-end-awdm.onrender.com/api/change-password",
        {
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data.message || "Password updated successfully");
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "Password update failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-56px)] flex justify-center items-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Change Password</h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleChangePassword}
        >
          {({ values, handleChange, handleBlur, errors, touched }) => (
            <Form>
              {/* Old Password */}
              <div className="mb-4">
                <label className="block text-sm font-medium">
                  Old Password
                </label>
                <input
                  type="password"
                  name="oldPassword"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 outline-none"
                  value={values.oldPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.oldPassword && touched.oldPassword && (
                  <span className="text-sm text-red-500">
                    {errors.oldPassword}
                  </span>
                )}
              </div>

              {/* New Password */}
              <div className="mb-4">
                <label className="block text-sm font-medium">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 outline-none"
                  value={values.newPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.newPassword && touched.newPassword && (
                  <span className="text-sm text-red-500">
                    {errors.newPassword}
                  </span>
                )}
              </div>

              {/* Confirm Password */}
              <div className="mb-4">
                <label className="block text-sm font-medium">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 outline-none"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.confirmPassword && touched.confirmPassword && (
                  <span className="text-sm text-red-500">
                    {errors.confirmPassword}
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full rounded-lg py-3 text-xl font-semibold text-white relative transition duration-300 ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-lg hover:shadow-xl"
                }`}
              >
                {loading ? (
                  <div className="flex justify-center items-center gap-2">
                    <ClipLoader color="white" size={22} />
                    <span>Updating...</span>
                  </div>
                ) : (
                  "Update Password"
                )}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ChangePassword;
