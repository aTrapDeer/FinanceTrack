'use client';

import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [inputUsername, setInputUsername] = useState('');
  const [username, setUsername] = useState('');
  const [hours, setHours] = useState(0);
  const [rate, setRate] = useState(0);
  const [jobs, setJobs] = useState([]);
  const [totalPay, setTotalPay] = useState(0);
  const [expense, setExpense] = useState(0);
  const [expenseDescription, setExpenseDescription] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);

  const API_URL = 'http://127.0.0.1:5000';

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/jobs?username=${username}`);
      setJobs(response.data.jobs);
      setTotalPay(response.data.totalPay);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/expenses?username=${username}`);
      setExpenses(response.data.expenses);
      setTotalExpenses(response.data.totalExpenses);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const handleSubmitUsername = async () => {
    if (inputUsername.trim()) {
      setUsername(inputUsername);
      await fetchJobs();
      await fetchExpenses();
    }
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

  const handleLogExpense = async () => {
    try {
      await axios.post(`${API_URL}/api/expenses`, { username, amount: expense, description: expenseDescription });
      await fetchExpenses();
      setExpense(0);
      setExpenseDescription('');
    } catch (error) {
      console.error("Error logging expense:", error);
    }
  };
  
  const handleResetAll = async () => {
    try {
      await axios.delete(`${API_URL}/api/jobs?username=${username}`);
      await axios.delete(`${API_URL}/api/expenses?username=${username}`);
      setJobs([]);
      setExpenses([]);
      setTotalPay(0);
      setTotalExpenses(0);
    } catch (error) {
      console.error("Error resetting data:", error);
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      await axios.delete(`${API_URL}/api/jobs/${jobId}`);
      await fetchJobs();
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      await axios.delete(`${API_URL}/api/expenses/${expenseId}`);
      await fetchExpenses();
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h1 className="card-title text-3xl font-bold text-center mb-6">Work Hours & Expenses Logger</h1>
            
            {/* Username Input Section */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <div className="input-group">
                <input
                  type="text"
                  value={inputUsername}
                  onChange={(e) => setInputUsername(e.target.value)}
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

                {/* Expense Logging Section */}
                <div className="card bg-base-200 shadow-lg">
                  <div className="card-body">
                    <h3 className="card-title">Log New Expense</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Amount</span>
                        </label>
                        <input
                          type="number"
                          value={expense}
                          onChange={(e) => setExpense(parseFloat(e.target.value))}
                          placeholder="Amount"
                          step="0.01"
                          min="0"
                          className="input input-bordered w-full"
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Description</span>
                        </label>
                        <input
                          type="text"
                          value={expenseDescription}
                          onChange={(e) => setExpenseDescription(e.target.value)}
                          placeholder="Description"
                          className="input input-bordered w-full"
                        />
                      </div>
                    </div>
                    <button 
                      onClick={handleLogExpense}
                      className="btn btn-warning mt-4"
                    >
                      Log Expense
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
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {jobs.map((job) => (
                            <tr key={job.id} className="hover">
                              <td>{job.Hours}</td>
                              <td>${job.Rate.toFixed(2)}</td>
                              <td>${job.Pay.toFixed(2)}</td>
                              <td>
                                <button 
                                  onClick={() => handleDeleteJob(job.id)}
                                  className="btn btn-ghost btn-xs"
                                >
                                  ❌
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Expenses Table Section */}
                <div className="card bg-base-100 shadow-lg">
                  <div className="card-body">
                    <h3 className="card-title">Logged Expenses</h3>
                    <div className="overflow-x-auto">
                      <table className="table w-full">
                        <thead>
                          <tr>
                            <th>Amount</th>
                            <th>Description</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {expenses.map((expense) => (
                            <tr key={expense.id} className="hover">
                              <td>${expense.amount.toFixed(2)}</td>
                              <td>{expense.description}</td>
                              <td>
                                <button 
                                  onClick={() => handleDeleteExpense(expense.id)}
                                  className="btn btn-ghost btn-xs"
                                >
                                  ❌
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Total Pay, Expenses, and Reset Section */}
                <div className="card bg-base-200 shadow-lg">
                  <div className="card-body flex-row justify-between items-center">
                    <div>
                      <p className="text-xl font-bold">Total Pay: <span className="text-success">${totalPay.toFixed(2)}</span></p>
                      <p className="text-xl font-bold">Total Expenses: <span className="text-error">${totalExpenses.toFixed(2)}</span></p>
                      <p className="text-xl font-bold">Net Income: <span className={totalPay - totalExpenses >= 0 ? "text-success" : "text-error"}>${(totalPay - totalExpenses).toFixed(2)}</span></p>
                    </div>
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