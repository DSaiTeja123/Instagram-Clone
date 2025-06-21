import React, { useEffect, useState } from "react";
import { Button, Input, Label } from "../ui/index";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const Signup = () => {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  const baseURL = import.meta.env.VITE_SERVER_URL;

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(`${baseURL}/api/v2/user/signup`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (res.data.success) {
        navigate("/");
        toast.success(res.data?.message || "Signup successful!");
        setInput({
          username: "",
          email: "",
          password: "",
        });
      }
    } catch (error) {
      console.log("Error while Signing Up:", error);
      toast.error(
        error.response?.data?.message || "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/signup");
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-[#405DE6] via-[#833AB4] to-[#E1306C] p-6">
      <h1 className="text-5xl font-extrabold text-white mb-8 drop-shadow-lg">
        Connectify
      </h1>
      <form
        onSubmit={signupHandler}
        className="backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-8 w-full max-w-lg transition-transform transform hover:scale-[1.02] duration-300"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Create Account
          </h1>
          <p className="text-gray-100 mt-2">Please fill in the details below</p>
        </div>
        <div className="mb-6">
          <Label className="block text-sm font-medium text-white/100">
            Username
          </Label>
          <Input
            type="text"
            name="username"
            value={input.username}
            onChange={changeEventHandler}
            className="border border-white/30 bg-white/10 text-white placeholder-white/90 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-white transition-shadow duration-200 hover:shadow-lg placeholder:text-gray-100"
            placeholder="Enter your username"
          />
        </div>
        <div className="mb-6">
          <Label className="block text-sm font-medium text-white/100">
            Email
          </Label>
          <Input
            type="email"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
            className="border border-white/30 bg-white/10 text-white placeholder-white/70 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-white transition-shadow duration-200 hover:shadow-lg placeholder:text-gray-100"
            placeholder="Enter your email"
          />
        </div>
        <div className="mb-6">
          <Label className="block text-sm font-medium text-white/100">
            Password
          </Label>
          <Input
            type="password"
            name="password"
            value={input.password}
            onChange={changeEventHandler}
            className="border border-white/30 bg-white/10 text-white placeholder-white/70 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-white transition-shadow duration-200 hover:shadow-lg placeholder:text-gray-100"
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
            Sign Up
          </Button>
        )}
        <div className="text-center mt-6 text-white/80">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="text-blue-200 hover:underline font-medium"
          >
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;
