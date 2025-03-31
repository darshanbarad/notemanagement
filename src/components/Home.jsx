// import React, { useEffect, useState } from "react";
// import { ClipLoader } from "react-spinners";
// import Client from "../axios/AxiosConsumer";
// import axios from "axios";

// const Home = () => {
//   const [userInfo, setUserInfo] = useState([]);
//   const [searchKey, setSearchKey] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const [Loading, setLoading] = useState(true);
//   const [errorMessage, setErrorMessage] = useState("");

//   const Showapi = async () => {
//     setLoading(true);
//     const token = localStorage.getItem("token");
//     console.log("Token:", token);

//     try {
//       const response = await Client.get("/api/getuserData", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       console.log("API Response: ", response.data);
//       setUserInfo(response.data.data);
//     } catch (error) {
//       console.error("Error fetching users:", error);
//       if (error.response?.status === 401) {
//         localStorage.removeItem("token");
//         window.location.href = "/login";
//       }
//       setErrorMessage("Failed to fetch data. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = async (e) => {
//     const value = e.target.value;
//     setSearchKey(value);

//     if (value.trim() === "") {
//       setSearchResults([]);
//       setErrorMessage("");
//       return;
//     }

//     try {
//       const response = await axios.get(
//         `http://localhost:5000/api/search/${value}`
//       );
//       setSearchResults(response.data);
//     } catch (error) {
//       setErrorMessage(error.response.data?.message || "Search failed.");
//       setSearchResults([]);
//     }
//   };

//   useEffect(() => {
//     Showapi();
//   }, []);

//   return (
//     <>
//       {Loading ? (
//         <div className="flex justify-center items-center h-screen">
//           <ClipLoader color="black" size={85} speedMultiplier={1} />
//         </div>
//       ) : (
//         <div>
//           <div className="flex items-center">
//             <input
//               type="search"
//               onChange={handleSearch}
//               placeholder="Search..."
//               className="bg-slate-300 outline-none py-1 px-8 mt-3 ml-3 mb-3 rounded-md"
//             />
//           </div>
//           {errorMessage ? (
//             <h2 className="text-red-500 pl-3">{errorMessage}</h2>
//           ) : (
//             <div className="w-full overflow-auto pl-3">
//               <table className="border-collapse border border-slate-500">
//                 <thead>
//                   <tr>
//                     <th className="border border-slate-700">First Name</th>
//                     <th className="border border-slate-700">Last Name</th>
//                     <th className="border border-slate-700">Email</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(searchKey && searchResults.length > 0
//                     ? searchResults
//                     : userInfo
//                   )?.map((value, i) => (
//                     <tr key={i}>
//                       <td className="border border-slate-700">
//                         {value.firstName}
//                       </td>
//                       <td className="border border-slate-700">
//                         {value.lastName}
//                       </td>
//                       <td className="border border-slate-700">{value.email}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}
//     </>
//   );
// };

// export default Home;

// import React, { useEffect, useState, useCallback } from "react";
// import { ClipLoader } from "react-spinners";
// import axios from "axios";
// import { debounce } from "lodash";

// const Home = () => {
//   const [userInfo, setUserInfo] = useState([]);
//   const [searchKey, setSearchKey] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const [Loading, setLoading] = useState(true);
//   const [errorMessage, setErrorMessage] = useState("");

//   // Function to fetch all users data
//   const Showapi = async () => {
//     setLoading(true);
//     const token = localStorage.getItem("token");
//     console.log("Token:", token);

//     try {
//       const response = await axios.get("/api/getuserData", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       console.log("API Response: ", response.data);
//       setUserInfo(response.data.data);
//     } catch (error) {
//       console.error("Error fetching users:", error);
//       if (error.response?.status === 401) {
//         localStorage.removeItem("token");
//         window.location.href = "/login";
//       }
//       setErrorMessage("Failed to fetch data. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Function to handle the search with debounce
//   const handleSearch = useCallback(
//     debounce(async (e) => {
//       const value = e.target.value;
//       console.log("Search Input Value:", value); // Debugging line

//       setSearchKey(value);

//       if (value.trim() === "") {
//         setSearchResults([]);
//         setErrorMessage("");
//         return;
//       }

//       try {
//         const response = await axios.get(
//           `http://localhost:5000/api/search?searchKey=${value}` // Your backend search URL
//         );
//         console.log("Search API Response:", response.data); // Debugging line
//         setSearchResults(response.data);
//       } catch (error) {
//         console.error("Search Error:", error); // Debugging line
//         setErrorMessage(error.response?.data?.message || "Search failed.");
//         setSearchResults([]);
//       }
//     }, 500), // Debounce delay in ms
//     []
//   );

//   useEffect(() => {
//     Showapi();
//   }, []);

//   return (
//     <>
//       {Loading ? (
//         <div className="flex justify-center items-center h-screen">
//           <ClipLoader color="black" size={85} speedMultiplier={1} />
//         </div>
//       ) : (
//         <div>
//           <div className="flex items-center">
//             <input
//               type="search"
//               onChange={handleSearch}
//               placeholder="Search..."
//               className="bg-slate-300 outline-none py-1 px-8 mt-3 ml-3 mb-3 rounded-md"
//             />
//           </div>
//           {errorMessage ? (
//             <h2 className="text-red-500 pl-3">{errorMessage}</h2>
//           ) : (
//             <div className="w-full overflow-auto pl-3">
//               <table className="border-collapse border border-slate-500">
//                 <thead>
//                   <tr>
//                     <th className="border border-slate-700">First Name</th>
//                     <th className="border border-slate-700">Last Name</th>
//                     <th className="border border-slate-700">Email</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(searchKey && searchResults.length > 0
//                     ? searchResults
//                     : userInfo
//                   )?.map((value, i) => (
//                     <tr key={i}>
//                       <td className="border border-slate-700">
//                         {value.firstName}
//                       </td>
//                       <td className="border border-slate-700">
//                         {value.lastName}
//                       </td>
//                       <td className="border border-slate-700">{value.email}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}
//     </>
//   );
// };

// export default Home;
