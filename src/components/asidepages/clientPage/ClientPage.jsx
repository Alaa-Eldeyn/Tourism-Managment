import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import SearchIcon from "@mui/icons-material/Search";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { toast } from "react-toastify";
import { ScrollUp } from "../../ScrollUp";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
//pagenation
import ReactPaginate from "react-paginate";

function ClientPage() {
  const baseUrl = "http://127.0.0.1:8000/api/";
  const [loader, setLoader] = useState(false);
  const [branches, setBranches] = useState([]);
  const [nationalities, setNationalities] = useState([]);

  const userToken = localStorage.getItem("user_token");
  const userRoleName = localStorage.getItem("user_role_name");
 
  const [clients, setClients] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [updateMode, setUpdateMode] = useState(false);
  const [updateClientID, setUpdateClientID] = useState("");
  const Navigate = useNavigate();

  const handleUnauthenticated = () => {
    toast("يجب عليك تسجيل الدخول مرة ثانية لانتهاء الصلاحية", {
      type: "error",
      autoClose: 4000,
    });
    Navigate("/Login");
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_role_name");
  };

  const schema = z.object({
    name: z.string().min(1, { message: "يجب ادخال اسم العميل" }),
    email: z.string().email({ message: "يجب ادخال بريد الكترونى صحيح" }),
    phone_number: z.string().min(1, { message: "يجب ادخال رقم الهاتف" }),
    address: z.string().min(1, { message: "يجب ادخال العنوان" }),
    branch_id: z.string().min(1, { message: "يجب ادخال رقم الفرع" }),
    countries_id: z.string().min(1, { message: "يجب ادخال رمز المدينة" }),
    image: z.any(),
    notes: z.string().min(1, { message: "يجب ادخال ملاحظات" }),
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
    fetchClients();
    fetchBranches();
    fetchNationalities();
    fetchPagenation();
  }, []);

  // fetch pagenation data///////////////////////
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPagenation();
  }, [currentPage]); // Fetch data whenever currentPage changes

  const fetchPagenation = () => {
    setLoader(true);
    axios
      .get(`http://127.0.0.1:8000/api/clients?page=${currentPage}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function (response) {
        setClients(response.data.data);
        setTotalPages(response.data.meta.pagination.last_page);
      })
      .catch(function (error) {
        console.error("Error fetching branches:", error);
      });
  };

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected + 1);
  };
  // fetch pagenation data///////////////////////

  const fetchNationalities = () => {
    setLoader(true);
    axios
      .get(`${baseUrl}countries`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function (response) {
        setNationalities(response.data.data);
      })
      .catch(function (error) {
        console.error("Error fetching nationalities:", error);
      })
      .finally(() => {
        setLoader(false);
      });
  };
  const fetchBranches = () => {
    setLoader(true);
    axios
      .get(`${baseUrl}branches/select-name-id`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function (response) {
        setLoader(false);
        setBranches(response.data.data);
      })
      .catch(function (error) {
        console.error("Error fetching branches:", error);
        handleUnauthenticated();
      })
      .finally(() => {
        setLoader(false);
      });
  };
  const fetchClients = () => {
    setLoader(true);
    axios
      .get(`${baseUrl}clients`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function (response) {
        setClients(response.data.data);
      })
      .catch(function (error) {
        console.error("Error:", error);
      })
      .finally(() => {
        setLoader(false);
      });
  };
  const storeClient = () => {
    setLoader(true);
    const clientData = {
      name: getValues("name"),
      email: getValues("email"),
      phone_number: getValues("phone_number"),
      address: getValues("address"),
      branch_id: getValues("branch_id"),
      countries_id: getValues("countries_id"),
      image: getValues("image[0]"),
      notes: getValues("notes"),
    };
    axios
      .post(`${baseUrl}clients`, clientData, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "content-type": "multipart/form-data",
        },
      })
      .then(function () {
        toast.success("تم تسجيل العميل بنجاح");
        fetchClients();
        reset();
      })
      .catch(function (error) {
        console.log(error);
        toast.error(error.response.data.message);
      })
      .finally(() => {
        setLoader(false);
      });
  };
  const deleteClient = (id) => {
    setLoader(true);
    axios
      .delete(`${baseUrl}clients/${id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function () {
        fetchClients();
        toast.success("تم حذف العميل بنجاح");
      })
      .catch(function (error) {
        toast.error(error.response.data.message);
      });
  };
  const handleClientUpdate = () => {
    setLoader(true);
    axios
      .post(
        `${baseUrl}clients/${updateClientID}`,
        {
          name: getValues("name"),
          email: getValues("email"),
          phone_number: getValues("phone_number"),
          address: getValues("address"),
          branch_id: getValues("branch_id"),
          countries_id: getValues("countries_id"),
          image: getValues("image"),
          notes: getValues("notes"),
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then(function () {
        toast.success("تم تحديث العميل بنجاح");
        fetchClients();
        setUpdateMode(false);
        reset();
      })
      .catch(function (error) {
        toast.error(error.response.data.message);
      })
      .finally(() => {
        setLoader(false);
      });
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    setLoader(true);

    if (!searchValue.trim()) {
      fetchClients();
      return;
    }
    let allClients = [...clients];
    let filteredClients = [];
    allClients.forEach((client) => {
      if (client.name.toLowerCase().includes(searchValue.toLowerCase())) {
        filteredClients.push(client);
      }
    });
    setClients(filteredClients);
    setLoader(false);
  };

  return (
    <div>
     {
      userRoleName === "admin" ? (
        <div className="flex items-center justify-center border-2 rounded-xl p-3 bg-gray-700">
        {/* register & update users */}
        <div className="mx-auto w-full ">
          <form className=" space-y-3">
            <div className=" flex flex-wrap gap-3">
              <div className="flex-grow ">
                <input
                  type="text"
                  {...register("name")}
                  placeholder="اسم العميل "
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
                {errors && (
                  <span className="text-red-500 text-sm">
                    {errors.name?.message}
                  </span>
                )}
              </div>
              <div className="flex-grow">
                <input
                  type="email"
                  {...register("email")}
                  placeholder="البريد الإلكترونى"
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
                {errors && (
                  <span className="text-red-500 text-sm">
                    {errors.email?.message}
                  </span>
                )}
              </div>
            </div>
            <div className=" flex flex-wrap gap-3">
              <div className="flex-grow ">
                <input
                  type="tel"
                  {...register("phone_number")}
                  placeholder="رقم الهاتف"
                  dir="rtl"
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
                {errors && (
                  <span className="text-red-500 text-sm">
                    {errors.phone_number?.message}
                  </span>
                )}
              </div>
              <div className="flex-grow ">
                <input
                  type="text"
                  {...register("address")}
                  placeholder="العنوان"
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
                {errors && (
                  <span className="text-red-500 text-sm">
                    {errors.address?.message}
                  </span>
                )}
              </div>
            </div>
            <div className=" flex flex-wrap gap-3">
              <div className="w-[49%] flex-grow ">
                <select
                  {...register("branch_id")}
                  className="select select-bordered flex-grow w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                >
                  <option value="" disabled selected>
                    اختر الفرع
                  </option>
                  {branches.map((branch) => {
                    const { id, name } = branch;
                    return <option key={id} value={id} label={name} />;
                  })}
                </select>
                {errors && (
                  <span className="text-red-500 text-sm">
                    {errors.branch_id?.message}
                  </span>
                )}
              </div>
              <div className="w-[49%] flex-grow ">
                <select
                  {...register("countries_id")}
                  className="select select-bordered flex-grow w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                >
                  <option value="" disabled selected>
                    الجنسية
                  </option>
                  {nationalities.map((nat) => {
                    const { id, en_short_name } = nat;
                    return <option key={id} value={id} label={en_short_name} />;
                  })}
                </select>
                {errors && (
                  <span className="text-red-500 text-sm">
                    {errors.countries_id?.message}
                  </span>
                )}
              </div>
            </div>
            <div className=" flex flex-wrap gap-3">
              <div className="w-[49%] flex-grow ">
                <textarea
                  {...register("notes")}
                  rows={1}
                  placeholder="ملاحظات"
                  className="w-full overflow-auto rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
                {errors && (
                  <span className="text-red-500 text-sm">
                    {errors.notes?.message}
                  </span>
                )}
              </div>
              <div className="w-[49%] flex-grow ">
                <div className="flex items-center justify-center w-full">
                  {/* <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Upload file</label> */}
                  <input
                    {...register("image")}
                    accept="image/*"
                    className="file-input file-input-bordered w-full"
                    id="file_input"
                    type="file"
                  />
                </div>
              </div>
            </div>
            <div>
              {updateMode ? (
                <button
                  onClick={handleSubmit(handleClientUpdate)}
                  disabled={isSubmitting}
                  className="text-center text-xl mb-3 p-2 w-52 font-bold text-white bg-green-700 rounded-2xl hover:bg-green-400 mx-auto block"
                >
                  تحديث العميل
                </button>
              ) : (
                <button
                  onClick={handleSubmit(storeClient)}
                  // onClick={(e) => storeClient(e)}
                  disabled={isSubmitting}
                  className="text-center text-xl mb-3 p-2 w-52 font-bold text-white bg-green-700 rounded-2xl hover:bg-green-400 mx-auto block"
                >
                  تسجيل عميل جديد
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      ) : "" 
     }

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
              placeholder={`ابحث عن عميل بالاسم`}
              required
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyUp={(e) => handleSearch(e)}
            />
            <button
              onClick={(e) => handleSearch(e)}
              className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              بحث
            </button>
            {/* <div className="absolute end-2.5 bottom-2">
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
            </div> */}
          </div>
        </form>
      </div>
      {/* Table to display branch data */}
      <table className="border-collapse w-full">
        <thead>
         {
          userRoleName === "admin" ? (
            <tr>
            {[
              "الترتيب",
              "الاسم",
              "الجنسية",
              "العنوان",
              "البريد الالكترونى",
              "رقم الموبايل",
              "الفرع",
              "تاريخ الانشاء",
               "تعديل",
            ].map((header, index) => (
              <th
                key={index}
                className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell"
              >
                {header}
              </th>
            ))}
          </tr>
          ) : (
            <tr>
            {[
              "الترتيب",
              "الاسم",
              "الجنسية",
              "العنوان",
              "البريد الالكترونى",
              "رقم الموبايل",
              "الفرع",
              "تاريخ الانشاء",
            ].map((header, index) => (
              <th
                key={index}
                className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell"
              >
                {header}
              </th>
            ))}
          </tr>
          )
         }
        </thead>
        <tbody>
          {console.log(clients)}
          {/* Mapping branches data to table rows */}
          {clients.map((client, index) => {
            const {
              id,
              name,
              address,
              email,
              phone_number,
              branch,
              nationality,
              created_at,
            } = client;
            const tableIndex = (currentPage - 1) * 15 + index + 1;
            return (
              <tr
                key={id}
                className="bg-white lg:hover:bg-gray-200 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-10 lg:mb-0"
              >
                <td className="w-full lg:w-auto p-0 text-gray-800  border border-b text-center block lg:table-cell relative lg</td>:static">
                  {tableIndex}
                </td>
                <td className="w-full lg:w-auto p-0 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  px-2 text-xs font-bold">
                    {name}
                  </span>
                </td>
                <td className="w-full lg:w-auto p-0 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  py-1 px-3 text-xs font-bold">
                    {nationality.nationality}
                  </span>
                </td>
                <td className="w-full lg:w-auto p-0 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  py-1 px-3 text-xs font-bold">
                    {address}
                  </span>
                </td>
                <td className="w-full lg:w-auto p-0 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  py-1 px-3 text-xs font-bold">
                    {email}
                  </span>
                </td>
                <td className="w-full lg:w-auto p-0 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  py-1 px-3 text-xs font-bold">
                    {phone_number}
                  </span>
                </td>
                <td className="w-full lg:w-auto p-0 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  py-1 px-3 text-xs font-bold">
                    {branch.branch_name}
                  </span>
                </td>
                <td className="w-full lg:w-auto  text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  px-1  text-xs font-bold">
                    {created_at}
                  </span>
                </td>
                {
                  userRoleName === "Admin" ? (
                    <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <button
                    onClick={() => {
                      ScrollUp();
                      setUpdateClientID(id);
                      setUpdateMode(true);
                      setValue("name", name);
                      setValue("address", address);
                      setValue("email", email);
                      setValue("phone_number", phone_number.toString());
                      setValue("branch_id", branch.branch_name.toString());
                      setValue("countries_id", nationality.id.toString());
                    }}
                    className="bg-green-700 text-white p-2 rounded hover:bg-green-500"
                  >
                    <DriveFileRenameOutlineIcon />
                  </button>
                  <button
                    onClick={() => deleteClient(id)}
                    className="bg-red-800 text-white p-2 m-1 rounded hover:bg-red-500"
                  >
                    <DeleteForeverIcon />
                  </button>
                </td>
                  ) : ""
                }
              </tr>
            );
          })}
        </tbody>
      </table>
      <div>
        {/* Render pagination */}
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          onPageChange={handlePageClick}
          containerClassName={"flex justify-center mt-4 text-2xl"}
          activeClassName={"bg-blue-500 text-white hover:bg-blue-700"}
          previousLabel={"السابق"}
          nextLabel={"التالي"}
          previousClassName={
            "mx-1 px-4 py-1 border rounded-lg text-[20px] hover:bg-gray-200"
          }
          nextClassName={
            "mx-1 px-4 py-1 border rounded-lg text-[20px] hover:bg-gray-200"
          }
          pageClassName={
            "mx-1 px-4 py-1 border rounded-lg text-[20px] hover:bg-gray-200"
          }
        />
      </div>
      {/* {loader && (
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
                   )} */}
    </div>
  );
}

export default ClientPage;
