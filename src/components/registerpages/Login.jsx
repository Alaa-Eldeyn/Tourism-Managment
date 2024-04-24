import React from 'react'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./register.css"
 
 
function Login() {
     
    
     const Navigate = useNavigate();
    const [email , setEmail ] = useState("");
    const [password , setPassword ] = useState("");
    // when user first click 
    const [accept , setAccetp] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);
    const [successMess , setSuccessMess] = useState(false);
    const [loader , setLoader ] = useState(false)

// submit login form 
const submitForm = async (e) => {
    e.preventDefault();
    setAccetp(true);
    if (email === "" || password.length < 5) {
        // Invalid input, no need to proceed with the API call
        return;
    }
    // Show loader
    setLoader(true);
    try {
        // Make API call
        const res = await axios.post(`http://127.0.0.1:8000/api/login`, {
            email: email,
            password: password
        });
        // Hide loader
        setLoader(false);

        // Handle success
        setSuccessMess(true);
        if (res.status === 200) {
            const apiRes = JSON.stringify(res.data)
           localStorage.setItem("user",apiRes);
           Navigate("/Mainpage");
        }
    } catch (error) {
        // Hide loader
        setLoader(false);

        // Handle error
        setErrorMessage(true);
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    }
};     
  return (
    <>
        <section className="bg-white dark:bg-gray-900">
            <div className="container flex items-center justify-center min-h-screen px-6 mx-auto">               
            { 
            successMess &&  <div role="alert" className="alert alert-success  text-red-50 ">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6 text-red-50" fill="none" viewBox="0 0 24 24"><path  strokeLinejoin="round" /></svg>
                                    <span>تم تسجيل الدخول بنجاح</span>
            </div>
            }                     
                <form className="w-full max-w-md" onSubmit={(e) => submitForm(e)} dir="rtl">
                    <img className="w-auto h-7 sm:h-8" src="https://merakiui.com/images/logo.svg" alt=""/>
                    <h1 className="mt-3 text-2xl font-semibold text-gray-800 capitalize sm:text-3xl dark:text-white">تسجيل الدخول</h1>
                    <div className="relative flex items-center mt-8">
                        <span className="absolute">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
                                <path  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </span>
                        <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)}  className="block w-full py-3 text-gray-700 bg-white border rounded-lg px-11 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40" placeholder="البريد الإلكتروني "/>
                    </div>
                        {email == "" && accept && <p className='text-red-600 my-5'> الرجاء إدخال البريد الإلكتروني </p>}

                    <div className="relative flex items-center mt-4">
                        <span className="absolute">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path   d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </span>
                        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="block w-full px-10 py-3 text-gray-700 bg-white border rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40" placeholder="كلمة السر "/>
                    </div>
                        {(password === "" && accept) && <p className='text-red-600 my-5'>الرجاء إدخال كلمة السر</p>}
                        {(password.length > 0 && password.length < 5 && accept) && <p className='text-red-600 my-5'>يجب ألا تقل كلمة السر عن 6 أحرق</p>}
                    <div className='text-right'>   
                    <Link to="/Forgetpasssword"><span className="text-sm  inline-block  font-bold  text-white py-5  hover:cursor-pointer transition duration-200">هل نسيت كلمة السر ؟</span></Link>
                    </div>
                    {errorMessage && <div role="alert" className="alert alert-error">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path  strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <span>هذا المستخدم غير مسموح له بالدخول</span>
                    </div>
                    }
                    <div className="mt-6">
                        <button className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                        سجل الدخول
                        </button>

                    </div>
                </form>
                {loader && <div className="spinner"></div>}
            </div>
        </section>
   
    </>
  )
}

export default Login