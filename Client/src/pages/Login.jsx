import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("location", response.data.location); // Assuming location is in response
      localStorage.setItem("name", response.data.name);
      localStorage.setItem("role", response.data.role);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a0033] to-[#4b0082] text-white relative overflow-hidden">

      {/* Floating crystals / glow circles */}
      <div className="absolute w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-30 -top-10 -left-10"></div>
      <div className="absolute w-72 h-72 bg-pink-500 rounded-full blur-3xl opacity-30 bottom-10 right-10"></div>

      <div className="glass-box p-10 shadow-xl w-[380px] animate-fadeIn">
        <h2 className="text-3xl font-bold text-center mb-6">Welcome Back</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="text-sm">Email</label>
            <input
              type="email"
              className="w-full mt-1 p-3 rounded-xl bg-white/20 focus:outline-none"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="text-sm">Password</label>
            <input
              type="password"
              className="w-full mt-1 p-3 rounded-xl bg-white/20 focus:outline-none"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-xl mt-4 font-semibold transition">
            Login
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-300 underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}


