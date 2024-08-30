'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [username, setUsername] = useState('');
  const [hours, setHours] = useState(0);
  const [rate, setRate] = useState(0);
  const [jobs, setJobs] = useState([]);
  const [totalPay, setTotalPay] = useState(0);

  const API_URL = 'http://127.0.0.1:5000';

  useEffect(() => {
    if (username) {
      fetchJobs();
    }
  }, [username]);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/jobs?username=${username}`);
      setJobs(response.data.jobs);
      setTotalPay(response.data.totalPay);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const handleSubmitUsername = async () => {
    if (username.trim()) {
      await fetchJobs();
    }
  };
  
  const handleLogJob = async () => {
    try {
      await axios.post(`${API_URL}/api/jobs`, { username, hours, rate });
      await fetchJobs();
    } catch (error) {
      console.error("Error logging job:", error);
    }
  };
  
  const handleResetAll = async () => {
    try {
      await axios.delete(`${API_URL}/api/jobs?username=${username}`);
      setJobs([]);
      setTotalPay(0);
    } catch (error) {
      console.error("Error resetting jobs:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <h1 className="text-3xl font-bold mb-5 text-center text-gray-800">Work Hours Logger</h1>
          
          <div className="mb-5">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <button 
              onClick={handleSubmitUsername}
              className="mt-3 w-full bg-cyan-500 text-white py-2 px-4 rounded-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50"
            >
              Submit Username
            </button>
          </div>

          {username && (
            <>
              <h2 className="text-2xl font-semibold mb-4 text-gray-700">Welcome, {username}!</h2>
              <div className="space-y-4 mb-5">
                <input
                  type="number"
                  value={hours}
                  onChange={(e) => setHours(parseFloat(e.target.value))}
                  placeholder="Enter work hours"
                  step="0.5"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <input
                  type="number"
                  value={rate}
                  onChange={(e) => setRate(parseFloat(e.target.value))}
                  placeholder="Enter hourly rate"
                  step="0.5"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <button 
                  onClick={handleLogJob}
                  className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                >
                  Log Job
                </button>
              </div>

              <h3 className="text-xl font-semibold mb-3 text-gray-700">Logged Jobs</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pay</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {jobs.map((job, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">{job.Hours}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{job.Rate}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{job.Pay}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="mt-4 text-lg font-semibold text-gray-700">Total Pay: ${totalPay.toFixed(2)}</p>

              <button 
                onClick={handleResetAll}
                className="mt-5 w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              >
                Reset All
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}