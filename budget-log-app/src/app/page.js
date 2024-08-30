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
    if (username) fetchJobs();
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

  const handleSubmitUsername = () => {
    if (username.trim()) fetchJobs();
  };
  
  const handleLogJob = async () => {
    try {
      await axios.post(`${API_URL}/api/jobs`, { username, hours, rate });
      await fetchJobs();
      setHours(0);
      setRate(0);
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
    <div className="min-h-screen bg-base-200 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h1 className="card-title text-3xl font-bold text-center mb-6">Work Hours Logger</h1>
            
            {/* Username Input Section */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <div className="input-group">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="input input-bordered flex-grow"
                />
                <button 
                  onClick={handleSubmitUsername}
                  className="btn btn-primary"
                >
                  Submit
                </button>
              </div>
            </div>

            {username && (
              <div className="space-y-6 mt-6">
                <h2 className="text-2xl font-bold">Welcome, {username}!</h2>
                
                {/* Job Logging Section */}
                <div className="card bg-base-200 shadow-lg">
                  <div className="card-body">
                    <h3 className="card-title">Log New Job</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Hours</span>
                        </label>
                        <input
                          type="number"
                          value={hours}
                          onChange={(e) => setHours(parseFloat(e.target.value))}
                          placeholder="Hours"
                          step="0.5"
                          min="0"
                          className="input input-bordered w-full"
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Rate</span>
                        </label>
                        <input
                          type="number"
                          value={rate}
                          onChange={(e) => setRate(parseFloat(e.target.value))}
                          placeholder="Rate"
                          step="0.5"
                          min="0"
                          className="input input-bordered w-full"
                        />
                      </div>
                    </div>
                    <button 
                      onClick={handleLogJob}
                      className="btn btn-success mt-4"
                    >
                      Log Job
                    </button>
                  </div>
                </div>

                {/* Jobs Table Section */}
                <div className="card bg-base-100 shadow-lg">
                  <div className="card-body">
                    <h3 className="card-title">Logged Jobs</h3>
                    <div className="overflow-x-auto">
                      <table className="table w-full">
                        <thead>
                          <tr>
                            <th>Hours</th>
                            <th>Rate</th>
                            <th>Pay</th>
                          </tr>
                        </thead>
                        <tbody>
                          {jobs.map((job, index) => (
                            <tr key={index}>
                              <td>{job.Hours}</td>
                              <td>${job.Rate.toFixed(2)}</td>
                              <td>${job.Pay.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Total Pay and Reset Section */}
                <div className="card bg-base-200 shadow-lg">
                  <div className="card-body flex-row justify-between items-center">
                    <p className="text-xl font-bold">Total Pay: <span className="text-success">${totalPay.toFixed(2)}</span></p>
                    <button 
                      onClick={handleResetAll}
                      className="btn btn-error"
                    >
                      Reset All
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}