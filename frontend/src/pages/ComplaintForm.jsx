import React, { useState, useContext } from "react";
import { submitComplaint } from "../api";
import { AuthContext } from "../context/AuthContext";

export default function ComplaintForm() {
  const { user } = useContext(AuthContext);
  const token = user?.token;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Road",
    location: "",
  });

  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setStatus("You must be logged in to submit a complaint.");
      return;
    }

    try {
      await submitComplaint(
        {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          location: formData.location,
          userEmail: user.email,
        },
        token
      );

      setStatus("Complaint submitted successfully!");

      setFormData({
        title: "",
        description: "",
        category: "Road",
        location: "",
      });
    } catch (error) {
      setStatus(error.message || "Failed to submit complaint.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-navyBlue">Submit a Complaint</h2>

      {status && (
        <div
          className={`mb-4 p-3 rounded ${
            status.startsWith("Failed") || status.startsWith("You must")
              ? "bg-red-200 text-red-800"
              : "bg-green-200 text-green-800"
          }`}
        >
          {status}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block font-semibold mb-1">
            Title
          </label>
          <input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-3 py-2 rounded"
            placeholder="Brief summary of your complaint"
          />
        </div>

        <div>
          <label htmlFor="description" className="block font-semibold mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full border border-gray-300 px-3 py-2 rounded"
            placeholder="Detailed description of the issue"
          />
        </div>

        <div>
          <label htmlFor="category" className="block font-semibold mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded"
          >
            <option value="Road">Road Issue</option>
            <option value="Water">Water Issue</option>
            <option value="Electricity">Electricity Issue</option>
            <option value="Garbage">Garbage Issue</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="location" className="block font-semibold mb-1">
            Location
          </label>
          <input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-3 py-2 rounded"
            placeholder="Enter the location/address"
          />
        </div>

        <button
          type="submit"
          className="bg-navyBlue text-white px-4 py-2 rounded hover:bg-saffron transition-colors"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
