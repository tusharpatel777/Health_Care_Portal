import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const wrapperVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const cardVariants = {
  hover: {
    scale: 1.015,
    rotateX: 4,
    rotateY: -4,
    transition: { duration: 0.3 },
  },
};

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("patient");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/users/register",
        {
          username,
          email,
          password,
          role,
        }
      );

      localStorage.setItem("userInfo", JSON.stringify(data));

      if (data.role === "patient") navigate("/dashboard");
      else if (data.role === "healthcare_provider")
        navigate("/provider/dashboard");
      else navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={wrapperVariants}
      className="flex items-center justify-center min-h-screen 
      bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 
      dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
      transition-all duration-700 p-6"
    >
      {/* Card */}
      <motion.form
        onSubmit={submitHandler}
        variants={cardVariants}
        whileHover="hover"
        className="backdrop-blur-lg bg-white/40 dark:bg-gray-800/40
        shadow-2xl rounded-2xl w-full max-w-md p-10 border border-white/30
        dark:border-gray-700/40 transform transition-all duration-300"
      >
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-extrabold text-center 
          text-indigo-700 dark:text-indigo-300 drop-shadow-sm mb-8"
        >
          Create Account
        </motion.h2>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-500/10 border border-red-400/50 text-red-600
              dark:text-red-300 dark:bg-red-900/30 dark:border-red-700 
              p-3 rounded-lg text-sm text-center mb-4"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* USERNAME */}
        <div className="mb-6 relative">
          <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
            Username
          </label>
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="text"
            className="w-full py-3 px-4 rounded-lg bg-white/70 dark:bg-gray-700/60
            border border-gray-300 dark:border-gray-600 text-gray-900 
            dark:text-gray-100 focus:ring-4 focus:ring-indigo-300 
            dark:focus:ring-indigo-600 outline-none transition-all"
            placeholder="Your full name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        {/* EMAIL */}
        <div className="mb-6 relative">
          <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
            Email
          </label>
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="email"
            className="w-full py-3 px-4 rounded-lg bg-white/70 dark:bg-gray-700/60
            border border-gray-300 dark:border-gray-600 text-gray-900 
            dark:text-gray-100 focus:ring-4 focus:ring-indigo-300 
            dark:focus:ring-indigo-600 outline-none transition-all"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* ROLE SELECT */}
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
            Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full py-3 px-4 rounded-lg bg-white/70 dark:bg-gray-700/60 
            border border-gray-300 dark:border-gray-600 text-gray-900 
            dark:text-gray-100 outline-none focus:ring-4 
            focus:ring-indigo-300 dark:focus:ring-indigo-600 transition-all"
          >
            <option value="patient" className="text-black">
              Patient
            </option>
            <option value="healthcare_provider" className="text-black">
              Healthcare Provider
            </option>
          </select>
        </div>

        {/* PASSWORD */}
        <div className="mb-6 relative">
          <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
            Password
          </label>
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="password"
            className="w-full py-3 px-4 rounded-lg bg-white/70 dark:bg-gray-700/60
            border border-gray-300 dark:border-gray-600 text-gray-900 
            dark:text-gray-100 focus:ring-4 focus:ring-indigo-300 
            dark:focus:ring-indigo-600 outline-none transition-all"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="mb-8 relative">
          <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
            Confirm Password
          </label>
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="password"
            className="w-full py-3 px-4 rounded-lg bg-white/70 dark:bg-gray-700/60
            border border-gray-300 dark:border-gray-600 text-gray-900 
            dark:text-gray-100 focus:ring-4 focus:ring-indigo-300 
            dark:focus:ring-indigo-600 outline-none transition-all"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {/* BUTTON */}
        <motion.button
          whileHover={{ scale: 1.04, boxShadow: "0 0 25px rgba(99,102,241,0.5)" }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          className="w-full py-3 rounded-full bg-indigo-600 text-white 
          text-lg font-bold shadow-lg hover:bg-indigo-700 
          transition-all"
        >
          Register
        </motion.button>

        {/* Footer Link */}
        <div className="text-center mt-6">
          <p className="text-gray-700 dark:text-gray-300 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </motion.form>
    </motion.div>
  );
};

export default RegisterPage;
