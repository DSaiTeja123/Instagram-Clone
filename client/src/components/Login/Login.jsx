import React, { useEffect, useState } from "react";
import { Button, Input, Label } from "../ui/index";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { setAuthUser } from "@/store/authSlice";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const baseURL = import.meta.env.VITE_SERVER_URL;

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(`${baseURL}/api/v2/user/signin`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(res.data.user));
        navigate("/");
        toast.success(res.data?.message || "Login successful!");
        setInput({ email: "", password: "" });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/signin");
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-[#405DE6] via-[#833AB4] to-[#E1306C] p-6">
      <h1 className="text-5xl font-extrabold text-white mb-8 drop-shadow-lg">
        Instagram
      </h1>

      <form
        onSubmit={signupHandler}
        className="backdrop-blur-md bg-white/10 border border-white/20 shadow-lg rounded-2xl p-8 w-full max-w-md transition-transform transform hover:scale-[1.03] lg:max-w-lg text-white"
      >
        <div className="text-center mb-6">
          <h1 className="text-4xl font-extrabold tracking-tight">Sign In</h1>
          <p className="text-white/80 mt-2">Please fill in the details below</p>
        </div>

        <div className="mb-6">
          <Label className="block text-xl font-medium text-white/100">
            Email
          </Label>
          <Input
            type="email"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
            className="focus:ring-2 focus:ring-blue-500 focus:outline-none my-2 border border-white/30 rounded-md p-3 w-full bg-white/20 text-white placeholder-white/70 placeholder:text-gray-100"
            placeholder="Enter your email"
          />
        </div>

        <div className="mb-6">
          <Label className="block text-xl font-medium text-white/100">
            Password
          </Label>
          <Input
            type="password"
            name="password"
            value={input.password}
            onChange={changeEventHandler}
            className="focus:ring-2 focus:ring-blue-500 focus:outline-none my-2 border border-white/30 rounded-md p-3 w-full bg-white/20 text-white placeholder-white/70 placeholder:text-gray-100"
            placeholder="Enter your password"
          />
        </div>

        {loading ? (
          <Button className="flex items-center justify-center bg-blue-600 text-white px-4 py-3 rounded-md cursor-not-allowed opacity-75 w-full">
            <Loader2 className="animate-spin mr-2" /> Please Wait
          </Button>
        ) : (
          <Button
            type="submit"
            className="bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 hover:shadow-xl transition-all duration-300 w-full"
          >
            Sign In
          </Button>
        )}

        <div className="text-center mt-6 text-white/80">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-200 hover:underline font-medium"
          >
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
