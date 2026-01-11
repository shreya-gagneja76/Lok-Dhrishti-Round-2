import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../api";

export default function ResetPassword() {
  const { token } = useParams();  // get token from URL param
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setError("Please fill both password fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await resetPassword(token, password);
      setSuccess("Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-6">Reset Password</h2>

      {!token ? (
        <p className="text-red-600">Invalid or missing reset token.</p>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="password" className="block mb-1 font-medium">
            New Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            required
            minLength={6}
            placeholder="Enter new password"
            className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label htmlFor="confirmPassword" className="block mb-1 font-medium">
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setError("");
            }}
            required
            minLength={6}
            placeholder="Confirm new password"
            className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded text-white ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      )}

      {error && (
        <p className="mt-4 text-red-600 whitespace-pre-wrap" role="alert">
          {error}
        </p>
      )}

      {success && (
        <p className="mt-4 text-green-600 whitespace-pre-wrap" role="status">
          {success}
        </p>
      )}
    </div>
  );
}
