import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Overlay.css";
import Switch from "react-switch";
import { useNavigate } from "react-router-dom";

export function OverlayEditUser({
  isOpenEdit,
  onClose,
  selectedUser,
  refreshUsers,
}) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    avatar: "",
    isOnline: false,
  });
  const [isUpdated, setIsUpdated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (selectedUser) {
      setFormData({
        username: selectedUser.username,
        email: selectedUser.email,
        phone: selectedUser.phone,
        address: selectedUser.address,
        avatar: selectedUser.avatar,
        isOnline: selectedUser.isOnline,
        password: "",
      });
    }
  }, [selectedUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setIsUpdated(true);
  };

  const handleSwitchChange = (checked) => {
    setFormData((prev) => ({
      ...prev,
      isOnline: checked,
    }));
    if (checked !== selectedUser.isOnline) {
      setIsUpdated(true);
    }
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem("sav-token");
    if (token) {
      try {
        // Xây dựng requestBody chỉ chứa các trường cần cập nhật
        const requestBody = {
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          avatar: formData.avatar,
        };

        // Chỉ thêm password và isOnline vào requestBody nếu chúng đã thay đổi
        if (formData.password) {
          requestBody.password = formData.password;
        }
        if (formData.isOnline !== selectedUser.isOnline) {
          requestBody.isOnline = formData.isOnline;
        }

        await axios.put(
          `https://be-android-project.onrender.com/api/auth/update/${selectedUser._id}`,
          requestBody,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert("Cập nhật người dùng thành công!");
        setIsUpdated(false);
        refreshUsers();
        onClose();
      } catch (error) {
        console.error("Cập nhật người dùng thất bại:", error);
        alert("Không thể cập nhật người dùng.");
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <Fragment>
      {isOpenEdit && (
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
            <h1 style={{ color: "black" }}>Edit User</h1>
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
                Online Status:
                <Switch
                  onChange={handleSwitchChange}
                  checked={formData.isOnline}
                />
              </label>
              <button
                type="button"
                onClick={handleUpdate}
                disabled={!isUpdated}
                className="overlay__update-button"
              >
                Update user
              </button>
            </form>
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default OverlayEditUser;
