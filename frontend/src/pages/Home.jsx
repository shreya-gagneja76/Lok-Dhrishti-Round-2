import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const { user, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  if (user && isAdmin) {
    // Admin View
    return (
      <div className="min-h-screen flex flex-col justify-between bg-gray-50">
        <main className="max-w-5xl mx-auto px-6 py-16 flex-grow text-center">
          <h1 className="text-4xl font-bold mb-6 text-navyBlue">Admin Dashboard Overview</h1>
          <p className="text-lg text-gray-700 mb-8">
            Welcome back, <strong>{user.name || user.email}</strong>. Manage complaints and monitor system activity here.
          </p>
          <div className="flex justify-center gap-8">
            <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
            <Button variant="outline" onClick={() => navigate("/admin/complaints")}>View All Complaints</Button>
          </div>
        </main>
        <footer className="bg-navyBlue text-white py-6 text-center text-sm">
          <p>© {new Date().getFullYear()} Lok Drishti. All rights reserved.</p>
        </footer>
      </div>
    );
  }

  // Regular User or Guest View
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50">
      <main className="max-w-5xl mx-auto px-6 py-16 flex-grow">
        {/* Personalized Greeting */}
        {user && (
          <div className="mb-8 text-right text-lg text-gray-700">
            Welcome, <span className="font-semibold">{user.name || user.email}</span>!
          </div>
        )}

        {/* What is Lok Drishti */}
        <section className="mb-16 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-6 text-navyBlue">What is Lok Drishti?</h1>
          <p className="text-lg leading-relaxed text-gray-800">
            Lok Drishti is a comprehensive digital platform designed to enhance transparency and accountability in public grievance redressal.
            By enabling citizens to lodge complaints, monitor their progress in real-time, and engage with authorities,
            Lok Drishti fosters a collaborative environment that strengthens governance and empowers communities.
          </p>
        </section>

        {/* How to Use Lok Drishti */}
        <section className="mb-16 bg-white shadow-md rounded-lg p-10 max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold mb-8 text-center text-navyBlue">How to Use Lok Drishti</h2>
          <ol className="list-decimal list-inside space-y-6 text-gray-700 text-lg">
            <li>Login or Signup to create your account.</li>
            <li>Submit complaints via your personalized dashboard.</li>
            <li>Track the status of your complaints under “My Complaints.”</li>
            <li>Click on any complaint to view detailed updates and responses.</li>
          </ol>
        </section>

        {/* Action Buttons */}
        <section className="text-center">
          {user ? (
            <div className="flex justify-center gap-8">
              <Button onClick={() => navigate("/complaints/new")}>Submit Complaint</Button>
              <Button variant="outline" onClick={() => navigate("/complaints")}>My Complaints</Button>
            </div>
          ) : (
            <div className="flex justify-center gap-8">
              <Button onClick={() => navigate("/login")}>Login</Button>
              <Button variant="outline" onClick={() => navigate("/signup")}>Signup</Button>
            </div>
          )}
        </section>
      </main>

      <footer className="bg-navyBlue text-white py-6 text-center text-sm">
        <p>© {new Date().getFullYear()} Lok Drishti. All rights reserved.</p>
      </footer>
    </div>
  );
}
