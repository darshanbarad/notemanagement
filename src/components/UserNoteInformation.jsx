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

  // ✅ Set Reminder Toast on exact time
  // ✅ Set Reminder Toast on exact IST time
  const handleReminderToast = (note) => {
    if (!note.reminder) return;

    // Convert backend UTC time into IST (Asia/Kolkata)
    const reminderTime = new Date(
      new Date(note.reminder).toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      })
    );
    const currentTime = new Date(
      new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      })
    );

    const timeDiff = reminderTime.getTime() - currentTime.getTime();

    console.log("📅 Reminder Time (IST):", reminderTime);
    console.log("🕰️ Current Time (IST):", currentTime);
    console.log("⏳ Time Difference (ms):", timeDiff);

    const formattedTime = reminderTime.toLocaleString("en-IN", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    if (timeDiff > 0) {
      setTimeout(() => {
        toast.info(`⏰ Reminder: ${note.title} - ${formattedTime}`, {
          position: "top-right",
          autoClose: 5000,
        });
      }, timeDiff);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [search, category, date]);

  const fetchNotes = () => {
    setLoading(true);
    Client.get(
      `/note/getuserNote?search=${search}&category=${category}&date=${date}`
    )
      .then((response) => {
        const notes = response.data?.userNoteData || [];
        setUserNote(notes);

        notes.forEach((note) => handleReminderToast(note));
      })
      .catch((error) => {
        console.error("Error fetching notes:", error);
      })
      .finally(() => {
        setLoading(false);
      });
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
      handleReminderToast(newNote);
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
      setUserNote((prev) =>
        prev.map((note) =>
          note._id === values._id ? { ...note, ...values } : note
        )
      );
      handleReminderToast(values);
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
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-2 mb-4 px-3">
        <input
          type="text"
          placeholder="Search Notes..."
          className="border p-2 w-full sm:w-auto flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-2 w-full sm:w-auto"
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
          className="border p-2 w-full sm:w-auto"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <button
          onClick={() => setModal({ type: "create", data: null })}
          className="p-2 bg-blue-500 text-white rounded w-full sm:w-auto flex items-center justify-center gap-2"
        >
          <MdAdd size={20} />
          <span className="text-sm sm:inline">Add</span>
        </button>
      </div>

      {selectId.length > 0 && (
        <div className="flex justify-center mb-4 px-3">
          <button
            onClick={handleAllNoteDelete}
            className="p-2 bg-red-500 text-white rounded"
          >
            Delete Selected ({selectId.length})
          </button>
        </div>
      )}

      {loading || actionLoading ? (
        <div className="flex justify-center items-center h-screen">
          <ClipLoader color="black" size={80} />
        </div>
      ) : (
        <div className="flex flex-wrap relative bg-slate-100 h-auto px-2">
          {userNote.map((note) => (
            <div
              key={note._id}
              className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4"
            >
              <div
                style={{
                  backgroundColor: note.isPublic ? "#d1fae5" : "#f3f4f6",
                }}
                className="p-3 h-60 overflow-hidden rounded-md mt-7 shadow-2xl relative"
              >
                <div className="flex justify-end space-x-3 items-center absolute top-3 right-3">
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
                    onClick={() => setModal({ type: "update", data: note })}
                  >
                    <MdEdit />
                  </button>
                  <button onClick={() => handleNoteDelete(note._id)}>
                    <RiDeleteBin6Line />
                  </button>
                </div>
                <div className="mt-12">
                  <h2 className="font-bold text-2xl mb-3 capitalize">
                    {note.title}
                  </h2>
                  <p className="capitalize">{note.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal.type && (
        <div className="fixed top-0 left-0 w-screen h-screen backdrop-blur-sm bg-opacity-50 flex justify-center items-center">
          <div className="p-3 w-[90%] sm:w-[40%] border rounded-md bg-white">
            <RxCross2 onClick={() => setModal({ type: "", data: null })} />
            <Formik
              initialValues={
                modal.data || {
                  title: "",
                  content: "",
                  category: "",
                  isPublic: false,
                  noteDate: "",
                  reminder: "",
                }
              }
              validationSchema={validationSchema}
              onSubmit={
                modal.type === "create" ? handleCreateNote : handleUpdateNote
              }
            >
              {({ errors, touched }) => (
                <Form>
                  <Field
                    type="text"
                    name="title"
                    placeholder="Title"
                    className="w-full p-2 border rounded"
                  />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="text-red-500 text-sm mb-1"
                  />

                  <Field
                    as="textarea"
                    name="content"
                    placeholder="Note"
                    className="w-full p-2 border rounded h-32 resize-none"
                  />
                  <ErrorMessage
                    name="content"
                    component="div"
                    className="text-red-500 text-sm mb-1"
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
                    className="text-red-500 text-sm mb-1"
                  />

                  <Field
                    type="date"
                    name="noteDate"
                    className="w-full p-2 border rounded mt-2"
                  />
                  <ErrorMessage
                    name="noteDate"
                    component="div"
                    className="text-red-500 text-sm mb-1"
                  />

                  <Field
                    type="datetime-local"
                    name="reminder"
                    className="w-full p-2 border rounded mt-2"
                  />
                  <ErrorMessage
                    name="reminder"
                    component="div"
                    className="text-red-500 text-sm mb-1"
                  />

                  <div className="flex items-center mt-3">
                    <Field type="checkbox" name="isPublic" className="mr-2" />
                    <label htmlFor="isPublic">Make this note public</label>
                  </div>

                  <button
                    type="submit"
                    className="p-2 bg-blue-500 text-white rounded mt-3 w-full flex justify-center items-center gap-2"
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <ClipLoader size={20} color="#ffffff" />
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
    </>
  );
};

export default UserNoteInformation;
