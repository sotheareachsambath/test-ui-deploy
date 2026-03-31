"use client";

import { useState } from "react";
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

export default function Home() {
  const { data, error, isLoading } = useSWR<Employee[]>(API_URL, fetcher);
  const [newEmployee, setNewEmployee] = useState({
    firstName: "",
    lastName: "",
    email: "",
    position: "",
    salary: 0,
  });
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

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

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (res.ok) {
        mutate(API_URL);
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  if (error) return <div>Failed to load</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-200 mb-2">
            Employee Management
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your team efficiently
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          {/* Create Form */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-8 border border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-6">
              Add New Employee
            </h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter first name"
                    value={newEmployee.firstName}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        firstName: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter last name"
                    value={newEmployee.lastName}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        lastName: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={newEmployee.email}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Position
                  </label>
                  <input
                    type="text"
                    placeholder="Enter position"
                    value={newEmployee.position}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        position: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Salary
                  </label>
                  <input
                    type="number"
                    placeholder="Enter salary"
                    value={newEmployee.salary}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        salary: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
              >
                Add Employee
              </button>
            </form>
          </div>

          {/* Employee List */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-6">
              Employees
            </h2>
            {data && data.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.map((employee) => (
                  <div
                    key={employee.id}
                    className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-600 hover:shadow-md transition duration-200"
                  >
                    {editingEmployee?.id === employee.id ? (
                      <form onSubmit={handleUpdate} className="space-y-3">
                        <input
                          type="text"
                          value={editingEmployee.firstName}
                          onChange={(e) =>
                            setEditingEmployee({
                              ...editingEmployee,
                              firstName: e.target.value,
                            })
                          }
                          className="w-full px-2 py-1 border border-slate-300 dark:border-slate-600 rounded focus:ring-1 focus:ring-blue-500 bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 text-sm"
                          required
                        />
                        <input
                          type="text"
                          value={editingEmployee.lastName}
                          onChange={(e) =>
                            setEditingEmployee({
                              ...editingEmployee,
                              lastName: e.target.value,
                            })
                          }
                          className="w-full px-2 py-1 border border-slate-300 dark:border-slate-600 rounded focus:ring-1 focus:ring-blue-500 bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 text-sm"
                          required
                        />
                        <input
                          type="email"
                          value={editingEmployee.email}
                          onChange={(e) =>
                            setEditingEmployee({
                              ...editingEmployee,
                              email: e.target.value,
                            })
                          }
                          className="w-full px-2 py-1 border border-slate-300 dark:border-slate-600 rounded focus:ring-1 focus:ring-blue-500 bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 text-sm"
                          required
                        />
                        <input
                          type="text"
                          value={editingEmployee.position}
                          onChange={(e) =>
                            setEditingEmployee({
                              ...editingEmployee,
                              position: e.target.value,
                            })
                          }
                          className="w-full px-2 py-1 border border-slate-300 dark:border-slate-600 rounded focus:ring-1 focus:ring-blue-500 bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 text-sm"
                          required
                        />
                        <input
                          type="number"
                          value={editingEmployee.salary}
                          onChange={(e) =>
                            setEditingEmployee({
                              ...editingEmployee,
                              salary: parseInt(e.target.value) || 0,
                            })
                          }
                          className="w-full px-2 py-1 border border-slate-300 dark:border-slate-600 rounded focus:ring-1 focus:ring-blue-500 bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 text-sm"
                          required
                        />
                        <div className="flex space-x-2">
                          <button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 text-white text-sm py-1 px-3 rounded transition duration-200"
                          >
                            Update
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingEmployee(null)}
                            className="bg-gray-600 hover:bg-gray-700 text-white text-sm py-1 px-3 rounded transition duration-200"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                          {employee.firstName} {employee.lastName}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">
                          {employee.email}
                        </p>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">
                          {employee.position}
                        </p>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
                          ${employee.salary.toLocaleString()}
                        </p>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingEmployee(employee)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm py-1 px-3 rounded transition duration-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(employee.id)}
                            className="bg-red-500 hover:bg-red-600 text-white text-sm py-1 px-3 rounded transition duration-200"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 dark:text-slate-400 text-center py-8">
                No employees found. Add your first employee above.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
