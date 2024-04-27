import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import SearchIcon from "@mui/icons-material/Search";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";

function Trippage() {
  const baseUrl = "http://127.0.0.1:8000/api/";
  const [loader, setLoader] = useState(true);
  const [inputsMessage, setInputsMessage] = useState(false);
  const [tripName, settripName] = useState("");
  const [tripTime, settriptripTime] = useState("");
  const [tripMail, settripMail] = useState("");
  const [tripPassword, settripPassword] = useState("");
  const [tripPasswordConfirm, settripPasswordConfirm] = useState("");
  const [tripPhone, settripPhone] = useState("");
  const [branchNumber, setBranchNumber] = useState("");
  const [updateMode, setUpdateMode] = useState(false);
  const [searchValue , setSearchValue] = useState("");
  const userToken = localStorage.getItem('user_token');

  const [trips, settrips] = useState([]);
  const [searchWay, setSearchWay] = useState("ID");
  const Naviagate = useNavigate();

// hande unuthenticated
  const handleUnauthenticated = () => {
    alert("يجب عليك التسجيل مرة أخرى لانتهاء وقت الصلاحية");
    Naviagate("/Login");
    localStorage.removeItem("user_token");
  };

  useEffect(() => {
    fetchtrips();
  }, []);
  
  const fetchtrips = () => {
    setLoader(true);
    axios
      .get(`${baseUrl}trips`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function (response) {
        if (response.status === 401) {
          handleUnauthenticated();
          return;
        }
        settrips(response.data.data);
      })
      .catch(function (error) {
        console.error("Error:", error);
      })
      .finally(() => {
        setLoader(false);
      });
  };


// handle trip register
  const handleEmpRegister = (e) => {
    setLoader(true);
    e.preventDefault();
    if (
      tripName === "" ||
      tripMail === "" ||
      tripPassword === "" ||
      tripPasswordConfirm === "" ||
      tripPhone === "" ||
      branchNumber === ""
    ) {
      setInputsMessage(true);
      return;
    }
    if (tripPassword !== tripPasswordConfirm) {
      setInputsMessage(true);
      return;
    }
    setInputsMessage(false);
    const tripData = {
      name: tripName,
      email: tripMail,
      password: tripPassword,
      password_confirmation: tripPasswordConfirm,
      phone_number: tripPhone,
      branch_id: branchNumber,
    };
    axios
      .post(`${baseUrl}trips`, tripData, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(function (response) {
        console.log("emp", response);
        fetchtrips();
      })
      .catch(function (error) {
        console.error("Error fetching", error);
      })
      .finally(() => {
        setLoader(false);
      });
  };
  const deleteEmp = (id) => { 
    setLoader(true);
    axios
      .delete(`${baseUrl}trips/${id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function (response) {
        console.log("emp", response);
        fetchtrips();
      })
      .catch(function (error) {
        console.error("Error fetching", error);
      })
  }
  const updateEmp = (id) => {
    setUpdateEmpID(id);
    setUpdateMode(true);
    const updatedtrip = trips.find((trip) => trip.id === id);
    if (updatedtrip) {
      settripName(updatedtrip.name);
      settripMail(updatedtrip.email);
      settripPassword(updatedtrip.password);
      settripPasswordConfirm(updatedtrip.password_confirmation);
      settripPhone(updatedtrip.phone_number);
      setBranchNumber(updatedtrip.branch_id);
    }
  };
  const handleEmpUpdate = () => {
    setLoader(true);
    axios
      .post(
        `${baseUrl}trips/${updateEmpID}`,
        {
          name: tripName,
          email: tripMail,
          password: tripPassword,
          password_confirmation: tripPasswordConfirm,
          phone_number: tripPhone,
          branch_id: branchNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then(function (response) {
        console.log("emp", response);
        fetchtrips();
        setUpdateMode(false);
      })
      .catch(function (error) {
        console.error("Error fetching", error.response.data.message);
      })
      .finally(() => {
        setLoader(false);
      });
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    setLoader(true);
    let searchUrl;
    if (searchWay === "ID") {
      searchUrl = `${baseUrl}trips/${searchValue}`;
    } else {
      searchUrl = `${baseUrl}trips/${searchValue}/branch`;
    }
    axios
      .get(searchUrl, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function (response) {
        console.log("search", response.data.data);
        settrips([response.data.data]);
      })
      .catch(function (error) {
        console.error("Error fetching", error.response.data.message);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  return (
    <div>
      <div className="flex items-center justify-center border-2 rounded-xl p-3 bg-gray-700">
        {/* register & update users */}
        <div className="mx-auto w-full ">
          <form className=" space-y-3">
            <div className=" flex flex-wrap gap-3">
              <div className="flex-grow ">
                <input
                  type="text"
                  value={tripName}
                  onChange={(e) => settripName(e.target.value)}
                  placeholder="اسم الرحلة "
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
                {inputsMessage && (
                  <p className="text-red-300 py-1 text-sm px-1">
                    ادخل اسم الرحلة 
                  </p>
                )}
              </div>
              <div className="flex-grow">
                <input
                  type="email"
                  value={tripMail}
                  onChange={(e) => settripMail(e.target.value)}
                  placeholder="تكلفة الرحلة "
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
                {inputsMessage && (
                  <p className="text-red-300 text-sm py-1 px-1">
                    ادخل تكلفة الرحلة  
                  </p>
                )}
              </div>
            </div>
            <div className=" flex flex-wrap gap-2">
             
            <div className="w-full px-3 sm:w-1/2">
                        <div className="mb-5">
                            <label  className="mb-3 block text-base font-medium text-white ">
                                   وقت الإقلاع  
                            </label>
                            <input type="time"  value={tripTime} onChange={(e)=> settriptripTime(e.target.value)}
                                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md" />
                                {inputsMessage&& <p className='text-red-600 py-1 px-1'>ادخل وقت الإقلاع</p>}
                        </div>
                    </div>
              <div className="flex-grow ">
              <label  className="mb-3 block text-base font-medium text-white ">
                                      وصف عن الرحلة (إختياري)  
                 </label>
                <input
                  type="text"
                  value={tripPasswordConfirm}
                  onChange={(e) => settripPasswordConfirm(e.target.value)}
                  placeholder="وصف عن رحلتك"
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
              </div>
            </div>
            <div className=" flex flex-wrap gap-3">
              <div className="flex-grow ">
              <label  className="mb-3 block text-base font-medium text-white "> من دولة  </label>
                        <select id="countries" className=" border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <option >اختار اسم الدولة</option>
                            <option value="US">United States</option>
                            <option value="CA">Canada</option>
                            <option value="FR">France</option>
                            <option value="DE">Germany</option>
                        </select>
                {inputsMessage && (
                  <p className="text-red-300 text-sm py-1 px-1">
                    أدخل رقم هاتف صحيح
                  </p>
                )}
              </div>
              <div className="flex-grow ">
              <label  className="mb-3 block text-base font-medium text-white "> إلي دولة  </label>
                        <select id="countries" className=" border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <option >اختار اسم الدولة</option>
                            <option value="US">United States</option>
                            <option value="CA">Canada</option>
                            <option value="FR">France</option>
                            <option value="DE">Germany</option>
                        </select>
                {inputsMessage && (
                  <p className="text-red-300 text-sm py-1 px-1">
                    أدخل رقم هاتف صحيح
                  </p>
                )}
              </div>
               
            </div>

            <div>
           
                <button
                  onClick={(e) => handleEmpRegister(e)}
                  disabled={loader}
                  className="text-center text-xl mb-3 p-2 w-52 font-bold text-white bg-green-700 rounded-2xl hover:bg-green-400 mx-auto block"
                >
                    إنشاء
                </button>
          
            </div>
          </form>
        </div>
      </div>

      {/* Search input form */}
      <div className="my-3">
        <form className="w-full">
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <SearchIcon className="text-white" />
            </div>
            <input
              type="search"
              id="default-search"
              className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder={`ابحث بـ ${searchWay}`}
              required
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <button
              type="submit"
              onClick={(e) => handleSearch(e)}
              className="text-white absolute end-32 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              بحث{" "}
            </button>
            <div className="absolute end-2.5 bottom-2">
              <select
                id="select"
                onChange={(e) => setSearchWay(e.target.value)}
                className="py-2 px-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="ID" className="bg-zinc-900">
                  ID
                </option>
                <option value="branch ID" className="bg-zinc-900">
                  Branch ID
                </option>
              </select>
            </div>
          </div>
        </form>
      </div>
      {/* Table to display branch data */}
      <table className="border-collapse w-full">
        <thead>
          <tr>
            {[
              "",
              "الترتيب",
              "الاسم",
              "البريد",
              "ID",
              "رقم الهاتف",
              "رقم الفرع",
              "الدور",
              "تاريخ الانشاء",
              "التعديل",
            ].map((header, index) => (
              <th
                key={index}
                className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Mapping branches data to table rows */}
          {trips.map((emp, index) => {
            return (
              <tr
                key={emp.id}
                className="bg-white lg:hover:bg-gray-200 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-10 lg:mb-0"
              >
                <td className="w-full lg:w-auto p-0 text-gray-800 text-center border border-b block lg:table-cell relative lg:static">
                  <input type="checkbox" />
                </td>
                <td className="w-full lg:w-auto p-0 text-gray-800  border border-b text-center block lg:table-cell relative lg</td>:static">
                  {index + 1}
                </td>
                <td className="w-full lg:w-auto p-0 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  px-2 text-xs font-bold">
                    {emp.name}
                  </span>
                </td>
                <td className="w-full lg:w-auto p-0 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  py-1 px-3 text-xs font-bold">
                    {emp.email}
                  </span>
                </td>
                <td className="w-full lg:w-auto p-0 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  py-1 px-3 text-xs font-bold">
                    {emp.id}
                  </span>
                </td>
                <td className="w-full lg:w-auto p-0 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  py-1 px-3 text-xs font-bold">
                    {emp.phone_number}
                  </span>
                </td>
                <td className="w-full lg:w-auto p-0 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  py-1 px-3 text-xs font-bold">
                    {emp.branch_id}
                  </span>
                </td>
                <td className="w-full lg:w-auto p-0 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  py-1 px-3 text-xs font-bold">
                    {emp.role_name}
                  </span>
                </td>
                <td className="w-full lg:w-auto  text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  px-1  text-xs font-bold">
                    {emp.created_at}
                  </span>
                </td>
                <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <button
                    onClick={() => updateEmp(emp.id)}
                    className="bg-green-700 text-white p-2 rounded hover:bg-green-500"
                  >
                    <DriveFileRenameOutlineIcon />
                  </button>
                  <button
                    onClick={() => deleteEmp(emp.id)}
                    className="bg-red-800 text-white p-2 m-1 rounded hover:bg-red-500"
                  >
                    <DeleteForeverIcon />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Trippage;