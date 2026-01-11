import React, { useState, useEffect } from "react";

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState(null);

  // Fetch complaints on mount
  useEffect(() => {
    async function fetchComplaints() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://localhost:8000/api/admin/complaints"); // Use admin route now
        if (!res.ok) throw new Error("Failed to fetch complaints");
        const data = await res.json();
        setComplaints(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchComplaints();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`http://localhost:8000/api/admin/complaints/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");

      setComplaints((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
      );
    } catch (err) {
      alert("Error updating status: " + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <p>Loading complaints...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Manage Complaints</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border border-gray-300 p-2 text-left">ID</th>
            <th className="border border-gray-300 p-2 text-left">Title</th>
            <th className="border border-gray-300 p-2 text-left">Description</th>
            <th className="border border-gray-300 p-2 text-left">Location</th>
            <th className="border border-gray-300 p-2 text-left">Status</th>
            <th className="border border-gray-300 p-2 text-left">Update Status</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map(({ id, title, description, location, status }) => (
            <tr key={id} className="even:bg-gray-50">
              <td className="border border-gray-300 p-2">{id}</td>
              <td className="border border-gray-300 p-2">{title}</td>
              <td className="border border-gray-300 p-2">{description}</td>
              <td className="border border-gray-300 p-2">{location}</td>
              <td className="border border-gray-300 p-2">{status}</td>
              <td className="border border-gray-300 p-2">
                <select
                  value={status}
                  disabled={updatingId === id}
                  onChange={(e) => handleStatusChange(id, e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                  <option>Rejected</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
