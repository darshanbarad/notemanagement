import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";
import { ClipLoader } from "react-spinners";

const UpdateProfile = () => {
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    firstName: "",
    lastName: "",
  });
  const [fetching, setFetching] = useState(true); // For fetching user data

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
  });

  // Fetch user info on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://note-back-end-awdm.onrender.com/api/getloginuserdata",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setInitialValues({
          firstName: res.data.firstName || "",
          lastName: res.data.lastName || "",
        });
      } catch (error) {
        toast.error("Failed to load user data");
      } finally {
        setFetching(false);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdateProfile = async (values, { resetForm }) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const response = await axios.patch(
        "https://note-back-end-awdm.onrender.com/api/change-profile",
        {
          firstName: values.firstName,
          lastName: values.lastName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data.message || "Profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Profile update failed!");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-[calc(100vh-56px)] flex justify-center items-center">
        <ClipLoader size={35} color="#2563EB" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-56px)] flex justify-center items-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Update Profile</h2>

        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={handleUpdateProfile}
        >
          {({ values, handleChange, handleBlur, errors, touched }) => (
            <Form>
              {/* First Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 outline-none"
                  value={values.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.firstName && touched.firstName && (
                  <span className="text-sm text-red-500">
                    {errors.firstName}
                  </span>
                )}
              </div>

              {/* Last Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 outline-none"
                  value={values.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.lastName && touched.lastName && (
                  <span className="text-sm text-red-500">
                    {errors.lastName}
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
                  "Update Profile"
                )}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default UpdateProfile;
