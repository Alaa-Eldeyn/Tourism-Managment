
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import SearchIcon from "@mui/icons-material/Search";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Switch } from "@mui/material";
import axios from "axios";
import { useForm ,  } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { ScrollUp } from "../../ScrollUp";


function Services() {
  const baseUrl = "http://127.0.0.1:8000/api/";
  const [branches, setBranches] = useState([]);
  const [loader, setLoader] = useState(true);
  const Naviagate = useNavigate();
  const userToken = localStorage.getItem("user_token");
  const [branchStatus, setBranchStatus] = useState(false);
  const [updateMode, setUpdateMode] = useState(false);
  const [updateBranchID, setUpdateBranchID] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const schema = z.object({
    categoryName: z.string().min(1, { message: "ادخل اسم الرحلة" }),
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    getValues,
    formState: { errors, isSubmitting },
   
  } = useForm({ resolver: zodResolver(schema) });



  useEffect(() => {
    fetchData();
  }, []);

  // Pagination
  const items =8
  const [current , setcurrent] = useState(1)
  const NbPage = Math.ceil(branches.length / items)
  const offset = (current - 1) * items
  const startIndex =  (current - 1) * items
  const endIndex = startIndex + items
  const DataPerPage = branches.slice(startIndex , endIndex)
  

// fetch data from api
  const fetchData = () => {
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
        } else {
          setLoader(false);
          setBranches(response.data.data);
        }
      })
      .catch(function (error) {
        console.error("حدث خطأ الرجاء محاولة مرة أخ:", error);
        handleUnauthenticated();
      })
      .finally(() => {
        setLoader(false);
      });
  };


  const handleUnauthenticated = () => {
    toast("يجب عليك تسجيل الدخول مرة ثانية لانتهاء الصلاحية", {
      type: "error",
      autoClose: 4000,
    });
    Naviagate("/Login");
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_role_name");
  };

  const storecategory = async ({
    categoryName,
  }) => {
    setLoader(true);
    await axios
      .post(
        `${baseUrl}trips`,
        {
          name: categoryName,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        toast("تم إنشاء الرحلة  بنجاح", { type: "success" });
        reset();
        fetchData();
      })
      .catch((response) => {
        if (response.response.data.message == "Already_exist") {
          toast("هذة الرحلة موجودة بالفعل ", { type: "error" });
        }
      })
      .finally(() => {
        setLoader(false);
      });
  };

  function deleteBranch(id) {
    setLoader(true);
    axios
      .delete(`${baseUrl}trips/${id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function (response) {
        if (response.status === 401) {
          handleUnauthenticated();
        } else if (response.status === 204) {
          toast.success("تم حذف الفرع بنجاح");
          fetchData();
        } else {
          console.error("Unexpected response status:", response.status);
          toast.warning("حدث خطأ غير متوقع");
        }
      })
      .catch(function (error) {
        console.error("Error deleting branch:", error);
        setLoader(true);
        if (
          error.response &&
          error.response.status === 401 &&
          error.response.data.message === "Unauthenticated"
        ) {
          toast("يجب عليك تسجيل الدخول مرة ثانية لانتهاء الصلاحية", {
            type: "error",
          });
        } else {
          console.log("Error deleting branch:", error);
        }
      });
    setLoader(false);
  }

 
  const updateBranch = async () => {
    setLoader(true);
    await axios
      .post(
        `${baseUrl}trips/${updateBranchID}`,
        {
          name: getValues("categoryName"),
          status: branchStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then(() => {
        toast("تم تحديث الرحلة  بنجاح", { type: "success" });
        fetchData();
      })
      .catch((response) => {
        if (response.response.data.message == "Already_exist") {
          toast("هذة الرحلة موجودة بالعفل ", { type: "error" });
        }
        console.log("Error updating branch:", response.response.data.message);
      })
      .finally(() => {
        setLoader(false);
       setUpdateMode(false);
       reset();
      });
     
  };

  const handleSearch = (e) => {
    setLoader(true);
    e.preventDefault();
    axios
      .get(`${baseUrl}trips/${searchValue}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((response) => {
        setBranches([response.data.data]);
      })
      .catch((error) => {
        console.error("Error fetching branches:", error);
        toast(error.response.data.message);
      })
      .finally(() => {
        setLoader(false);
      });
};

return (
    <main className="branchTable">
      {/* add branch form */}
      <div className="flex items-center justify-center border-2 rounded-xl p-3 bg-gray-700">
        <div className="mx-auto w-full ">
          <form>
            <div className="mb-5">
              <input
                type="text"
                {...register("categoryName")}
                placeholder="اسم الرحلة"
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
              {errors && (
                <span className="text-red-500 text-sm">
                  {errors.categoryName?.message}
                </span>
              )}
            </div>
            <div className="mb-5 pt-3">
              <div className="-mx-3 flex flex-wrap">
               
                   {
                    updateMode &&
                    <div className="w-full px-3 sm:w-1/2">
                              <label className="text-white">تفعيل الرحلة أو إلفاء تفعيل الرحلة  ؟</label>
                              <div className="mb-5">
                                <Switch
                                checked={branchStatus === true} 
                                onChange={(e) =>
                                  setBranchStatus(e.target.checked ? true : false)}color="success"/>
                            </div>
                      </div>
                   }
              </div>
            </div>

            <div>
              {updateMode ? (
                <button
                  type="submit"
                  onClick={()=>{handleSubmit(updateBranch)}}
                  disabled={isSubmitting}
                  className="text-center text-xl mb-3 p-2 w-52 font-bold text-white bg-green-700 rounded-2xl hover:bg-green-400 mx-auto block"
                >
                  تحديث الرحلة 
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  onClick={handleSubmit(storecategory)}
                  className="text-center text-xl mb-3 p-2 w-52 font-bold text-white bg-green-700 rounded-2xl hover:bg-green-400 mx-auto block"
                >
                  إنشاء الرحلة 
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      <div className="divider"></div>

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
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="block w-full p-4 pb-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="البحث من عن طريق ID "
              required
            />
            <button
              type="submit"
              onClick={handleSearch}
              className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              بحث{" "}
            </button>
          </div>
        </form>
      </div>
          
      {/* Table to display branch data */}
      <table className="border-collapse w-full">
        <thead>
          <tr>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
              الترتيب
            </th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
              الاسم
            </th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
              الحالة
            </th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
              {" "}
              التاريخ/الوقت{" "}
            </th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
              التعديل
            </th>
          </tr>
        </thead>
        <tbody>
          {/* Mapping branches data to table rows */}
          {branches.map((branch, index) => {
            const {
              name,
              id,
              status,
              created_at,
            } = branch;
            return (
              <tr
                key={id}
                className="bg-white lg:hover:bg-gray-200 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-10 lg:mb-0"
              >
                <td className="w-full lg:w-auto p-0 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  {index + 1}
                </td>
                <td className="w-full lg:w-auto p-0 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  px-2 text-xs font-bold">
                    {name}
                  </span>
                </td>
                <td className="w-full lg:w-auto  text-gray-800   border border-b text-center block lg:table-cell relative lg:static">
                  {status === "مفعل" ? (
                    <div className="bg-green-500 text-white text-sm rounded-md">
                      مفعل
                    </div>
                  ) : (
                    <div className="bg-red-500 text-white rounded-md text-sm">
                      غير مفعل
                    </div>
                  )}
                </td>
                <td className="w-full lg:w-auto  text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  px-1  text-xs font-bold">
                    {created_at}
                  </span>
                </td>


                <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <button
                    onClick={() => {
                      ScrollUp();
                      setUpdateBranchID(id);
                      setUpdateMode(true);
                      setValue("categoryName", name);
                      setBranchStatus(status === "مفعل" ? true : false);
                    }}
                    className="bg-green-700 text-white p-2 rounded hover:bg-green-500"
                  >
                    <DriveFileRenameOutlineIcon />
                  </button>
                  <button
                    onClick={() => deleteBranch(id)}
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
            {/* loader */}
            {loader && (
                          <svg
                            id="loading-spinner"
                            xmlns="http://www.w3.org/2000/svg"
                            width="100"
                            height="100"
                            viewBox="0 0 48 48"
                          >
                            <g fill="none">
                              <path
                                id="track"
                                fill="#C6CCD2"
                                d="M24,48 C10.745166,48 0,37.254834 0,24 C0,10.745166 10.745166,0 24,0 C37.254834,0 48,10.745166 48,24 C48,37.254834 37.254834,48 24,48 Z M24,44 C35.045695,44 44,35.045695 44,24 C44,12.954305 35.045695,4 24,4 C12.954305,4 4,12.954305 4,24 C4,35.045695 12.954305,44 24,44 Z"
                              />
                              <path
                                id="section"
                                fill="#3F4850"
                                d="M24,0 C37.254834,0 48,10.745166 48,24 L44,24 C44,12.954305 35.045695,4 24,4 L24,0 Z"
                              />
                            </g>
                          </svg>
                        )}
      {/* Pagination */}
              <div className="max-w-full md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl mx-auto bg-white p-6 rounded-lg shadow-sm">

                  <div className="flex justify-center">
                      <nav className="flex space-x-2" aria-label="Pagination">
                          <a href="#" className="relative inline-flex items-center px-4 py-2 text-sm bg-gradient-to-r from-violet-300 to-indigo-300 border border-fuchsia-100 hover:border-violet-100 text-white font-semibold cursor-pointer leading-5 rounded-md transition duration-150 ease-in-out focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10">
                              Previous
                          </a>
                          {Array.from({ length: NbPage }, (_, i) => i + 1).map((page) => (
                            <a
                              key={page} // Make sure to include a unique key for each element in the array
                              href="#"
                              className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-fuchsia-100 hover:bg-fuchsia-200 cursor-pointer leading-5 rounded-md transition duration-150 ease-in-out focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10"
                            >
                              {page}
                            </a>
                          ))}

                        
                          <a   href="#" className="relative inline-flex items-center px-4 py-2 text-sm bg-gradient-to-r from-violet-300 to-indigo-300 border border-fuchsia-100 hover:border-violet-100 text-white font-semibold cursor-pointer leading-5 rounded-md transition duration-150 ease-in-out focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10">
                              Next
                          </a>
                      </nav>
                  </div>
              </div>
    
                


    </main>
  );
}

export default Services;
