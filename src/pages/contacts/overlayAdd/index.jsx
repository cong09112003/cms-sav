import { Fragment, useState, useEffect } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Overlay.css";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

export function OverlayAddUser({ isOpenAdd, onClose, refreshUsers }) {
  const userRoles = [
    { value: "Admin", label: "Admin" },
    { value: "User", label: "User" },
    { value: "Renter", label: "Renter" },
  ];

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    avatar:
      "https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg",
    isOnline: false,
    user_role: "User",
  });

  const navigate = useNavigate();
  const [isAdd, setIsAdd] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleAdd = async () => {
    const token = localStorage.getItem("sav-token");
    if (token) {
      try {
        const requestBody = {
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          user_role: formData.user_role,
          password: formData.password,
          avatar: formData.avatar,
        };
        await axios.post(
          `${process.env.REACT_APP_API_URL}/api/auth/admin/create-user`,
          requestBody,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("Cập nhật người dùng thành công!");
        setIsAdd(false);
        refreshUsers();
        onClose();
      } catch (error) {
        console.error("Thêm người dùng thất bại:", error);
        alert("Không thể thêm người dùng.");
      }
    } else {
      navigate("/login");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setIsAdd(true);
  };

  const handleRoleChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      user_role: selectedOption.value,
    }));
    setIsAdd(true);
  };

  return (
    <Fragment>
      {isOpenAdd && (
        <div className="overlay">
          <div className="overlay__background" onClick={onClose} />
          <div className="overlay__container">
            <div className="overlay__controls">
              <button
                className="overlay__close"
                type="button"
                onClick={onClose}
              />
            </div>
            <h1 style={{ color: "black" }}>Add User</h1>
            <form className="overlay__form">
              <div className="avatar-container">
                <img
                  src={formData.avatar}
                  alt="avatar user"
                  width="150px"
                  height="150px"
                  style={{ borderRadius: "50%", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.src =
                      "https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg"; // Default avatar path
                  }}
                />
              </div>
              <label>
                Url:
                <input
                  type="text"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Username
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Phone:
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Address:
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Password:
                <div style={{ display: "flex", alignItems: "center" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      marginLeft: "5px",
                    }}
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </button>
                </div>
              </label>
              <label>
                User role:
                <Select
                  options={userRoles}
                  name="user_role"
                  value={userRoles.find(
                    (role) => role.value === formData.user_role
                  )}
                  onChange={handleRoleChange}
                />
              </label>
              <button
                type="button"
                onClick={handleAdd}
                disabled={!isAdd}
                className="overlay__update-button"
              >
                Create a new
              </button>
            </form>
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default OverlayAddUser;
