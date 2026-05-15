import { useState } from "react";
import { loginUser } from "../api/auth";
import { setToken } from "../utils/auth";
import { NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaGoogle, FaFacebookF} from "react-icons/fa"
import { FiEye, FiEyeOff, FiLock, FiMail, FiUser } from "react-icons/fi";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


 const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!email || !password) {
    Swal.fire({
      icon: "error",
      title: "Missing Fields",
      text: "Please fill in email and password",
    });
    return;
  }

  try {
    setLoading(true);

    const res = await loginUser({ email, password });

    console.log("LOGIN SUCCESS:", res);

    // ✅ SAVE TOKEN
    setToken(res.token);

    // OPTIONAL: save user
    const user = res.user;

    Swal.fire({
      icon: "success",
      title: "Login Successful 🎉",
      timer: 1500,
      showConfirmButton: false,
    });

    navigate("/dashboard");

  } catch (err: any) {
    console.log("FULL ERROR:", err);
    console.log("ERROR DATA:", err.response?.data);

    Swal.fire({
      icon: "error",
      title: "Login Failed",
      text: err.response?.data?.message || "Invalid credentials",
    });

  } finally {
    setLoading(false);
  }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-800 to-blue-200 px-4">
      
      {/* CARD */}
      <div className="w-full max-w-5xl bg-white rounded-2xl shadw-xl grid md:grid-cols-2 overflow-hidden">

        {/* LEFT PANEL */}
            <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-secondary to-purple-500 text-white relative">
                  <div className="absolute insert-0 opacity-20 bg-[radial-gradient(circle_at_top_left, white transparent)]">
                  </div>

                  <div className="z-10 text-center">

                      <h2 className="text-6xl font-bold text-center font-mono mb-2 uppercase">
                          planora
                        </h2>
                        <p className="font-mono">Sign in to continue</p>
                  </div>
                  <div className="flex gap-2 mt-5 font-mono">
                    <p>Do not have an account?</p>
                    <NavLink to="/register" className="text-blue-800 underline">Register.</NavLink>
                  </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="p-10">

                <div className="flex justify-center mb-6">
                    <div className="bg-purple-600 text-white p-4 rounded-full shadow-lg">
                          <FiUser size={34} />
                    </div>
                </div>

                <h2 className="text-center font-bold uppercase font-mono text-3xl text-secondary justify-center mb-6">Login</h2>

                {/* FORM */}

                <form onSubmit={handleLogin} className="space-y-5 font-mono" >
                        {/* Email */}
                    <div className="flex ites-center border-b border-gray-300 py-2">
                        <FiMail className="text-secondary text-2xl mr-3" />
                         <input
                          className="w-full font-mono text-secondary outline-none br-transparent"
                          placeholder="Email"
                          onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* Password */}

                    <div className="flex items-center border-b border-gray-300 py-2">
  
                        <FiLock className="text-2xl text-secondary mr-3" />
                        <input
                          type={showPassword ? "text" : "password"}
                          className="w-full font-mono text-secondary outline-none bg-transparent"
                          placeholder="Password"
                          onChange={(e) => setPassword(e.target.value)}
                        />

                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="ml-3 text-secondary hover:scale-110 transition"
                        >
                          {showPassword ? (
                            <FiEyeOff className="text-xl" />
                          ) : (
                            <FiEye className="text-xl" />
                          )}
                        </button>
                    </div>

                    {/* FORGOT PASWORD */}

                    <div className="text-right text-sm text-secondary cursor-pointer">
                      Forgot Password
                    </div>
                        

                        {/* Button */}
                        <button
                          disabled={loading}
                          className={`w-full p-2 rounded text-white flex justify-center items-center gap-2 ${
                            loading ? "bg-gray-400" : "bg-secondary hover:scale-103 transition cursor-pointer"
                          }`}
                        >
                          {loading && (
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          )}
                          {loading ? "Logging in..." : "Login"}
                        </button>
                </form>

                      <div className="mt-5  text-center font-mono">
                          <p className="mb-4 text-gray-400">Or login with</p>

                          <div className="flex justify-center gap-6">
                              <button className="flex items-center gap-2 text-white bg-secondary px-4 py-2 rounded-lg hover:text-gray-400 cursor-pointer">
                                <FaGoogle /> Google
                              </button>
                              <button className="flex items-center gap-2 border text-secondary border-secondary px-4 py-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                                <FaFacebookF /> Facebook
                              </button>
                          </div>
                      </div>
            </div>
      </div>

    </section>
  );
}