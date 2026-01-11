import React, { useState, useEffect, useContext } from "react";
import { getComplaints } from "../api";
import { AuthContext } from "../context/AuthContext";

export default function ComplaintList() {
  const { user } = useContext(AuthContext);
  const token = user?.token;

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchComplaints = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getComplaints(user.email, token);
        setComplaints(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [user, token]);

  if (!user) {
    return (
      <p className="text-center text-red-600">Please login to view complaints.</p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-navyBlue">My Complaints</h2>

      {loading && <p>Loading complaints...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {!loading && complaints.length === 0 && (
        <p>No complaints found. Submit a complaint first!</p>
      )}

      <ul className="space-y-4">
        {complaints.map((complaint) => (
          <li
            key={complaint.id}
            className="border p-4 rounded shadow-sm hover:shadow-md transition"
          >
            <p>
              <strong>Complaint ID:</strong> {complaint.id}
            </p>
            <h3 className="font-semibold text-lg">{complaint.title}</h3>
            <p>
              <strong>Description:</strong> {complaint.description}
            </p>
            <p>
              <strong>Category:</strong> {complaint.category}
            </p>
            <p>
              <strong>Location:</strong> {complaint.location}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={
                  complaint.status === "Resolved"
                    ? "text-green-600 font-semibold"
                    : "text-yellow-600 font-semibold"
                }
              >
                {complaint.status}
              </span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
