import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "citizen",
    location: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(""); // clear previous error

    try {
      const response = await fetch("http://127.0.0.1:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const msg = await response.text();
        setError(msg || "Registration failed");
        return;
      }

      alert("Registration Successful!");
      navigate("/login");

    } catch (err) {
      console.error(err);
      setError("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black flex items-center justify-center p-4">

      <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-md">

        <h2 className="text-3xl text-center font-bold text-white mb-6">
          Create Account
        </h2>

        {error && (
          <p className="text-red-400 text-center mb-3">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none"
          />

          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300"
          />

          <input
            type="password"
            name="password"
            placeholder="Create password (min 8 characters used upper, lower, number, special)"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={8}
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300"
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/20 text-white"
          >
            <option value="citizen" className="text-black">Citizen</option>
            <option value="ngo"className="text-black">NGO</option>
            <option value="authority" className="text-black">Authority</option>
            <option value="admin" className="text-black">Admin</option>
          </select>

          <input
            type="text"
            name="location"
            placeholder="Enter your city"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300"
          />

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg mt-4 transition"
          >
            Register
          </button>

        </form>

        <p className="text-gray-300 text-center mt-4">
          Already have an account?{" "}
          <span
            className="text-purple-400 cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
};

export default Register;
