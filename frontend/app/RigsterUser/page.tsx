"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./page.css"

interface Role {
  id: string;
  name: string;
}

interface User {
  id?: string;
  name: string;
  email: string;
  password: string;
  roleName: string;
  role?: Role;
}

function RegisterUser() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<User>({
    name: "",
    email: "",
    password: "",
    roleName: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(8);
  const rolesFetched = useRef(false);
  const usersFetched = useRef(false);

  const Base_Url = process.env.NEXT_PUBLIC_BASE_URL;

  const fetchRoles = async () => {
    if (rolesFetched.current) return;
    rolesFetched.current = true;
    try {
      const response = await axios.get<Role[]>(`${Base_Url}getrole`);
      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const fetchUsers = async () => {
    if (usersFetched.current) return;
    usersFetched.current = true;
    try {
      const response = await axios.get<User[]>(`${Base_Url}users`);
      const updatedUsers = response.data.map((user) => ({
        ...user,
        roleName: user.role?.name || "N/A",
      }));
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchUsers();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = (user: User) => {
    setIsEditing(true);
    setFormData({
      id: user.id,
      name: user.name,
      email: user.email,
      password: "",
      roleName: user.roleName,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userDataToSend: Partial<User> = {
        name: formData.name,
        email: formData.email,
        roleName: formData.roleName,
      };

      if (formData.password) {
        userDataToSend.password = formData.password;
      }

      if (isEditing && formData.id) {
        const response = await axios.put(
          `${Base_Url}users/${formData.id}`,
          userDataToSend
        );
        setUsers((prev) =>
          prev.map((user) =>
            user.id === formData.id ? { ...user, ...response.data } : user
          )
        );
        toast.success("User updated successfully!");
      } else {
        if (!formData.password) {
          toast.error("Password is required for new users");
          return;
        }
        const response = await axios.post(`${Base_Url}users`, {
          ...userDataToSend,
          password: formData.password,
        });
        setUsers((prev) => [...prev, response.data]);
        toast.success("User registered successfully!");
      }

      setFormData({
        name: "",
        email: "",
        password: "",
        roleName: "",
      });
      setIsEditing(false);
    } catch (error: any) {
      console.error("Error creating/updating user:", error);
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(
        `Failed to ${isEditing ? "update" : "register"} user: ${errorMessage}`
      );
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      await axios.delete(`${Base_Url}users/${userId}`);
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      toast.success("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user. Please try again.");
    }
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(users.length / usersPerPage);

  return (
    <>
      <Navbar />
      <ToastContainer />
      <div className="container my-5">
        <h1 className="text-center">
          {isEditing ? "Edit User" : "Register User"}
        </h1>

        <form className="mb-4" onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label>Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label>Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label>
                Password {isEditing && "(Leave blank to keep current password)"}
              </label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleInputChange}
                required={!isEditing}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label>Role</label>
              <select
                name="roleName"
                className="form-select"
                value={formData.roleName}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.name}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn-primary me-2">
            {isEditing ? "Update" : "Register"}
          </button>
          {isEditing && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  name: "",
                  email: "",
                  password: "",
                  roleName: "",
                });
              }}
            >
              Cancel
            </button>
          )}
        </form>

        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.roleName}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => user.id && handleDelete(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-center mt-4">
          <button
            className="btn border"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            {"<"}
          </button>
          <div>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  className={`btn ${
                    currentPage === page ? "btn btn-primary" : ""
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              )
            )}
          </div>
          <button
            className="btn border"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            {">"}
          </button>
        </div>
      </div>
    </>
  );
}

export default RegisterUser;
