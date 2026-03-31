"use client";

import { useState, useEffect } from "react";
import useSWR, { mutate } from "swr";

const API_URL = "/api/employee";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  salary: number;
}

function useTheme() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") {
      setDark(true);
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return { dark, toggle };
}

export default function Home() {
  const { data, error, isLoading } = useSWR<Employee[]>(API_URL, fetcher);
  const { dark, toggle } = useTheme();
  const [newEmployee, setNewEmployee] = useState({
    firstName: "",
    lastName: "",
    email: "",
    position: "",
    salary: 0,
  });
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEmployee),
      });
      if (res.ok) {
        mutate(API_URL);
        setNewEmployee({
          firstName: "",
          lastName: "",
          email: "",
          position: "",
          salary: 0,
        });
        setShowForm(false);
      }
    } catch (error) {
      console.error("Error creating employee:", error);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmployee) return;
    try {
      const res = await fetch(`${API_URL}/${editingEmployee.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingEmployee),
      });
      if (res.ok) {
        mutate(API_URL);
        setEditingEmployee(null);
      }
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`${API_URL}/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        mutate(API_URL);
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
    setDeleteTarget(null);
  };

  const totalSalary = data?.reduce((sum, emp) => sum + emp.salary, 0) ?? 0;

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <p className="text-gray-600 dark:text-zinc-400 text-lg">Failed to load employee data</p>
          <button onClick={() => mutate(API_URL)} className="mt-4 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition">
            Try again
          </button>
        </div>
      </div>
    );

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950">
        <div className="text-center">
          <div className="w-10 h-10 mx-auto mb-4 border-2 border-indigo-200 dark:border-indigo-500/30 border-t-indigo-600 dark:border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-gray-400 dark:text-zinc-500 text-sm tracking-wide">Loading...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 transition-colors duration-300">
      {/* Subtle gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-500/[0.03] via-transparent to-purple-500/[0.03] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                Employees
              </h1>
              <p className="mt-1 text-gray-500 dark:text-zinc-500 text-sm">
                Manage your team members and their information
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <button
                onClick={toggle}
                className="relative p-2.5 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all text-gray-500 dark:text-zinc-400"
                title={dark ? "Switch to light mode" : "Switch to dark mode"}
              >
                {/* Sun icon */}
                <svg
                  className={`w-4 h-4 transition-all duration-300 ${dark ? "opacity-0 rotate-90 scale-0 absolute" : "opacity-100 rotate-0 scale-100"}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
                {/* Moon icon */}
                <svg
                  className={`w-4 h-4 transition-all duration-300 ${dark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0 absolute"}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
              </button>

              <button
                onClick={() => setShowForm(!showForm)}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-all duration-200 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showForm ? "M6 18L18 6M6 6l12 12" : "M12 4.5v15m7.5-7.5h-15"} />
                </svg>
                {showForm ? "Cancel" : "Add Employee"}
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-white dark:bg-zinc-900/60 border border-gray-200 dark:border-zinc-800/60 rounded-xl px-5 py-4 shadow-sm dark:shadow-none">
              <p className="text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Total Employees</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">{data?.length ?? 0}</p>
            </div>
            <div className="bg-white dark:bg-zinc-900/60 border border-gray-200 dark:border-zinc-800/60 rounded-xl px-5 py-4 shadow-sm dark:shadow-none">
              <p className="text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Total Payroll</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">${totalSalary.toLocaleString()}</p>
            </div>
            <div className="bg-white dark:bg-zinc-900/60 border border-gray-200 dark:border-zinc-800/60 rounded-xl px-5 py-4 shadow-sm dark:shadow-none">
              <p className="text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Avg. Salary</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                ${data && data.length > 0 ? Math.round(totalSalary / data.length).toLocaleString() : 0}
              </p>
            </div>
          </div>
        </header>

        {/* Create Form */}
        {showForm && (
          <div className="mb-10 bg-white dark:bg-zinc-900/60 border border-gray-200 dark:border-zinc-800/60 rounded-2xl p-8 shadow-sm dark:shadow-none">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">New Employee</h2>
            <form onSubmit={handleCreate}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="John"
                    value={newEmployee.firstName}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, firstName: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/50 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-all text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Doe"
                    value={newEmployee.lastName}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, lastName: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/50 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-all text-sm"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="john@company.com"
                    value={newEmployee.email}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, email: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/50 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-all text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
                    Position
                  </label>
                  <input
                    type="text"
                    placeholder="Software Engineer"
                    value={newEmployee.position}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, position: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/50 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-all text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
                    Salary
                  </label>
                  <input
                    type="number"
                    placeholder="75000"
                    value={newEmployee.salary || ""}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        salary: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/50 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-all text-sm"
                    required
                  />
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-all duration-200 shadow-lg shadow-indigo-500/20"
                >
                  Add Employee
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-300 text-sm font-medium px-6 py-2.5 rounded-lg transition-all border border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Employee Table */}
        <div className="bg-white dark:bg-zinc-900/60 border border-gray-200 dark:border-zinc-800/60 rounded-2xl shadow-sm dark:shadow-none overflow-hidden">
          {data && data.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-zinc-800/60">
                  <th className="text-left text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wider px-6 py-4">Employee</th>
                  <th className="text-left text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wider px-6 py-4">Position</th>
                  <th className="text-left text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wider px-6 py-4">Salary</th>
                  <th className="text-right text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wider px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/40">
                {data.map((employee) => (
                  <tr key={employee.id} className="group hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors">
                    {editingEmployee?.id === employee.id ? (
                      <td colSpan={4} className="px-6 py-4">
                        <form onSubmit={handleUpdate} className="flex flex-wrap items-end gap-3">
                          <div className="flex-1 min-w-[140px]">
                            <label className="block text-xs text-gray-400 dark:text-zinc-500 mb-1">First Name</label>
                            <input
                              type="text"
                              value={editingEmployee.firstName}
                              onChange={(e) =>
                                setEditingEmployee({ ...editingEmployee, firstName: e.target.value })
                              }
                              className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/50 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                              required
                            />
                          </div>
                          <div className="flex-1 min-w-[140px]">
                            <label className="block text-xs text-gray-400 dark:text-zinc-500 mb-1">Last Name</label>
                            <input
                              type="text"
                              value={editingEmployee.lastName}
                              onChange={(e) =>
                                setEditingEmployee({ ...editingEmployee, lastName: e.target.value })
                              }
                              className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/50 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                              required
                            />
                          </div>
                          <div className="flex-1 min-w-[200px]">
                            <label className="block text-xs text-gray-400 dark:text-zinc-500 mb-1">Email</label>
                            <input
                              type="email"
                              value={editingEmployee.email}
                              onChange={(e) =>
                                setEditingEmployee({ ...editingEmployee, email: e.target.value })
                              }
                              className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/50 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                              required
                            />
                          </div>
                          <div className="flex-1 min-w-[140px]">
                            <label className="block text-xs text-gray-400 dark:text-zinc-500 mb-1">Position</label>
                            <input
                              type="text"
                              value={editingEmployee.position}
                              onChange={(e) =>
                                setEditingEmployee({ ...editingEmployee, position: e.target.value })
                              }
                              className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/50 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                              required
                            />
                          </div>
                          <div className="flex-1 min-w-[120px]">
                            <label className="block text-xs text-gray-400 dark:text-zinc-500 mb-1">Salary</label>
                            <input
                              type="number"
                              value={editingEmployee.salary}
                              onChange={(e) =>
                                setEditingEmployee({
                                  ...editingEmployee,
                                  salary: parseInt(e.target.value) || 0,
                                })
                              }
                              className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/50 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                              required
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="submit"
                              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium px-4 py-2 rounded-lg transition-all"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingEmployee(null)}
                              className="text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-300 text-xs font-medium px-4 py-2 rounded-lg transition-all border border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </td>
                    ) : (
                      <>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                              {employee.firstName[0]}{employee.lastName[0]}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {employee.firstName} {employee.lastName}
                              </p>
                              <p className="text-xs text-gray-400 dark:text-zinc-500">{employee.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center text-xs font-medium text-gray-600 dark:text-zinc-300 bg-gray-100 dark:bg-zinc-800/60 px-2.5 py-1 rounded-md">
                            {employee.position}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                            ${employee.salary.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => setEditingEmployee(employee)}
                              className="text-gray-400 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-white p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all"
                              title="Edit"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                              </svg>
                            </button>
                            <button
                              onClick={() => setDeleteTarget(employee)}
                              className="text-gray-400 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                              title="Delete"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-zinc-800/60 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-300 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </div>
              <p className="text-gray-400 dark:text-zinc-500 text-sm">No employees yet</p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-3 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition"
              >
                Add your first employee
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setDeleteTarget(null)}
          />
          <div className="relative bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center">
              Delete Employee
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-zinc-400 text-center">
              Are you sure you want to delete{" "}
              <span className="font-medium text-gray-700 dark:text-zinc-200">
                {deleteTarget.firstName} {deleteTarget.lastName}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 text-sm font-medium px-4 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 text-sm font-medium px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white transition-all shadow-lg shadow-red-500/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
