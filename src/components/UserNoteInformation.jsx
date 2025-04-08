import React, { useEffect, useState } from "react";
import { MdEdit, MdAdd } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import { ClipLoader } from "react-spinners";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Client from "../axios/AxiosConsumer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserNoteInformation = () => {
  const [userNote, setUserNote] = useState([]);
  const [selectId, setSelectId] = useState([]);
  const [modal, setModal] = useState({ type: "", data: null });
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    fetchNotes();
  }, [search, category, date]);
  const fetchNotes = () => {
    setLoading(true);
    Client.get(
      `/note/getuserNote?search=${search}&category=${category}&noteDate=${date}`
    )
      .then((response) => {
        const userNotes = response.data?.userNotes || [];
        const publicNotes = response.data?.publicNotes || [];

        // Combine both arrays
        const allNotes = [...userNotes, ...publicNotes];

        // Optional: sort by date or any other logic
        allNotes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setUserNote(allNotes);
      })
      .catch((error) => {
        console.error("Error fetching notes:", error);
      })
      .finally(() => setLoading(false));
  };

  const handleNoteDelete = (id) => {
    setActionLoading(true);
    Client.delete(`/note/noteDelete/${id}`)
      .then(() => setUserNote((prev) => prev.filter((note) => note._id !== id)))
      .catch((error) => console.log(error))
      .finally(() => setActionLoading(false));
  };

  const handleAllNoteDelete = () => {
    setActionLoading(true);
    Client.delete("/note/multipleNoteDelete", { data: { ids: selectId } })
      .then(() => {
        setUserNote((prev) =>
          prev.filter((note) => !selectId.includes(note._id))
        );
        setSelectId([]);
      })
      .catch((error) => console.error("Error deleting notes:", error))
      .finally(() => setActionLoading(false));
  };

  const handleCreateNote = async (values) => {
    setActionLoading(true);
    try {
      const response = await Client.post("/note/createNote", values);
      const newNote = response.data?.userNote;
      setUserNote((prev) => [...prev, newNote]);
      setModal({ type: "", data: null });
    } catch (error) {
      setErrorMessage("Error creating note");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateNote = async (values) => {
    setActionLoading(true);
    try {
      await Client.patch(`/note/updateNote/${values._id}`, values);
      await fetchNotes();
      setModal({ type: "", data: null });
    } catch (error) {
      setErrorMessage("Error updating note");
    } finally {
      setActionLoading(false);
    }
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().trim().required("Title is required"),
    content: Yup.string().trim().required("Content is required"),
    category: Yup.string().required("Category is required"),
    isPublic: Yup.boolean(),
    noteDate: Yup.date().required("Date is required"),
  });

  return (
    <div className="p-4 max-w-screen-xl mx-auto">
      {/* Search, Filter, and Add Button Bar */}
      <div className="flex flex-wrap sm:flex-nowrap gap-3 mb-6 items-end">
        <input
          type="text"
          placeholder="Search Notes..."
          className="border p-2 rounded w-full sm:w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-2 rounded w-full sm:w-1/3"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Study">Study</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="date"
          className="border p-2 rounded w-full sm:w-1/3"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <button
          onClick={() => setModal({ type: "create", data: null })}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-2 px-4 rounded shadow hover:opacity-90 w-full sm:w-1/4"
        >
          <MdAdd size={20} className="inline mr-1" /> Add Note
        </button>
      </div>

      {/* Multiple Delete Button */}
      {selectId.length > 0 && (
        <div className="text-center mb-4">
          <button
            onClick={handleAllNoteDelete}
            className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700"
          >
            Delete Selected ({selectId.length})
          </button>
        </div>
      )}

      {/* Notes Grid */}
      {loading || actionLoading ? (
        <div className="flex justify-center items-center h-60">
          <ClipLoader color="black" size={60} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {userNote.map((note) => (
            <div
              key={note._id}
              className={`relative rounded-xl p-4 shadow-md overflow-hidden border-2 ${
                note.isPublic
                  ? "bg-green-50 border-green-400"
                  : "bg-white border-gray-300"
              }`}
            >
              <div className="absolute top-2 right-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectId.includes(note._id)}
                  onChange={(e) =>
                    setSelectId((prev) =>
                      e.target.checked
                        ? [...prev, note._id]
                        : prev.filter((id) => id !== note._id)
                    )
                  }
                />
                <button
                  className="hover:text-blue-500"
                  onClick={() => setModal({ type: "update", data: note })}
                >
                  <MdEdit />
                </button>
                <button
                  className="hover:text-red-500"
                  onClick={() => handleNoteDelete(note._id)}
                >
                  <RiDeleteBin6Line />
                </button>
              </div>
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-2 break-words">
                  {note.title}
                </h2>
                <p className="text-gray-700 break-words">{note.content}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Date: {new Date(note.noteDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {modal.type && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] sm:w-[500px]">
            <div className="flex justify-end mb-2">
              <RxCross2
                onClick={() => setModal({ type: "", data: null })}
                className="cursor-pointer text-xl hover:text-red-500"
              />
            </div>
            <Formik
              initialValues={
                modal.data || {
                  title: "",
                  content: "",
                  category: "",
                  isPublic: false,
                  noteDate: "",
                }
              }
              validationSchema={validationSchema}
              onSubmit={
                modal.type === "create" ? handleCreateNote : handleUpdateNote
              }
            >
              {({ errors, touched }) => (
                <Form className="space-y-3">
                  <Field
                    type="text"
                    name="title"
                    placeholder="Title"
                    className="w-full p-2 border rounded"
                  />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="text-red-500 text-sm"
                  />

                  <Field
                    as="textarea"
                    name="content"
                    placeholder="Note content"
                    className="w-full p-2 border rounded h-28 resize-none"
                  />
                  <ErrorMessage
                    name="content"
                    component="div"
                    className="text-red-500 text-sm"
                  />

                  <Field
                    as="select"
                    name="category"
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select Category</option>
                    <option value="Work">Work</option>
                    <option value="Personal">Personal</option>
                    <option value="Study">Study</option>
                    <option value="Other">Other</option>
                  </Field>
                  <ErrorMessage
                    name="category"
                    component="div"
                    className="text-red-500 text-sm"
                  />

                  <Field
                    type="date"
                    name="noteDate"
                    className="w-full p-2 border rounded"
                  />
                  <ErrorMessage
                    name="noteDate"
                    component="div"
                    className="text-red-500 text-sm"
                  />

                  <div className="flex items-center">
                    <Field type="checkbox" name="isPublic" className="mr-2" />
                    <label htmlFor="isPublic">Make this note public</label>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded hover:opacity-90 flex justify-center items-center gap-2"
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <ClipLoader size={20} color="#fff" />
                    ) : modal.type === "create" ? (
                      "Add Note"
                    ) : (
                      "Update Note"
                    )}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default UserNoteInformation;
