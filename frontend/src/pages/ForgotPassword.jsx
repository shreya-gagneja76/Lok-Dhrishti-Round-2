import React, { useState } from "react";
import { forgotPassword } from "../api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetLink, setResetLink] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submit clicked, email:", email);

    if (!email.trim()) {
      setError("Please enter your registered email.");
      console.log("Validation failed: email empty");
      return;
    }

    setLoading(true);
    setError("");
    setResetLink("");
    console.log("Loading set to true");

    try {
      const data = await forgotPassword(email);
      console.log("API response data:", data);
      setResetLink(data.reset_link || "Reset link sent! Check your email.");
    } catch (err) {
      console.error("API error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
      console.log("Loading set to false");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-6">Forgot Password</h2>
      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="email" className="block mb-1 font-medium">
          Registered Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Enter registered email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
            setResetLink("");
          }}
          required
          className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoComplete="email"
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      {error && (
        <p className="mt-4 text-red-600 whitespace-pre-wrap" role="alert">
          {error}
        </p>
      )}

      {resetLink && (
        <p className="mt-4 text-green-600 whitespace-pre-wrap" role="status">
          {resetLink.startsWith("http") ? (
            <a href={resetLink} target="_blank" rel="noopener noreferrer">
              {resetLink}
            </a>
          ) : (
            resetLink
          )}
        </p>
      )}
    </div>
  );
}
