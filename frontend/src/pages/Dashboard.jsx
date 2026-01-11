import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    rejected: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("http://localhost:8000/api/complaints/stats");
        if (!response.ok) throw new Error("Failed to fetch stats");
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchStats();
  }, []);

  const chartData = [
    { name: "Pending", value: stats.pending },
    { name: "In Progress", value: stats.inProgress },
    { name: "Resolved", value: stats.resolved },
    { name: "Rejected", value: stats.rejected },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* STATS CARDS */}
      <div className="grid md:grid-cols-5 gap-6 mb-8">
        <Card className="rounded-2xl shadow">
          <CardContent className="p-6">
            <h3 className="text-sm text-gray-500">Total Complaints</h3>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow">
          <CardContent className="p-6">
            <h3 className="text-sm text-gray-500">Pending</h3>
            <p className="text-2xl font-bold text-red-500">{stats.pending}</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow">
          <CardContent className="p-6">
            <h3 className="text-sm text-gray-500">In Progress</h3>
            <p className="text-2xl font-bold text-yellow-500">{stats.inProgress}</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow">
          <CardContent className="p-6">
            <h3 className="text-sm text-gray-500">Resolved</h3>
            <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow">
          <CardContent className="p-6">
            <h3 className="text-sm text-gray-500">Rejected</h3>
            <p className="text-2xl font-bold text-gray-600">{stats.rejected}</p>
          </CardContent>
        </Card>
      </div>

      {/* ANALYTICS */}
      <Card className="rounded-2xl shadow">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Complaint Status Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3182ce" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
