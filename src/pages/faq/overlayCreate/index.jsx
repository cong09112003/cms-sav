import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import "./Overlay.css";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import "react-slideshow-image/dist/styles.css";
import { Label } from "@mui/icons-material";

export function OverlayCreateNotification({
  isOpenCreate,
  onClose,
  refreshNotifications,
}) {
  const [formData, setFormData] = useState({
    message: "",
    id_user: "",
    createdAt: "",
  });
  const navigate = useNavigate();
  const [isCreate, setIsCreate] = useState(false);
  const [users, setUsers] = useState([]);
  const handleCreate = async () => {
    const token = localStorage.getItem("sav-token");
    if (token) {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/notification/create`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("Thêm thông báo thành công!");
        setIsCreate(false);
        refreshNotifications();
        onClose();
      } catch (error) {
        console.error("Thêm thông báo thất bại:", error);
        alert("Không thể thêm thông báo.");
      }
    } else {
      navigate("/login");
    }
  };

  const getUsers = async () => {
    const token = localStorage.getItem("sav-token");
    if (token) {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/auth/users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          const normalUsers = response.data.filter(
            (user) => user.user_role === "Renter" || user.user_role === "User"
          );
          setUsers(normalUsers);
        } else {
          alert("Không thể lấy danh sách người dùng");
        }
      } catch (error) {
        console.error("Lỗi xác thực token:", error);
        localStorage.removeItem("sav-token");
        navigate("/login");
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
    setIsCreate(true);
  };

  useEffect(() => {
    if (isOpenCreate) getUsers();
  }, [isOpenCreate]);

  return (
    <Fragment>
      {isOpenCreate && (
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
            <h1 style={{ color: "black" }}>Create a new notification</h1>
            <form className="overlay__form">
              <label>
                Message
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="5"
                  cols="30"
                  placeholder="Xin chào,..."
                />
              </label>
              <label>
                Send to:
                <Select
                  options={users.map((user) => ({
                    label: user.username, // Hiển thị tên của renter
                    value: user._id, // Giá trị của Select là _id
                  }))}
                  value={
                    users.length > 0 &&
                    users.find((user) => user._id === formData.id_user)
                      ? {
                          label: users.find(
                            (user) => user._id === formData.id_user
                          ).username, // Hiển thị username của renter được chọn
                          value: formData.id_user, // ID của renter
                        }
                      : null // Trường hợp không có renter nào được chọn
                  }
                  onChange={(selectedOption) => {
                    setFormData((prevData) => ({
                      ...prevData,
                      id_user: selectedOption ? selectedOption.value : "", // Cập nhật _id của renter vào formData
                    }));
                    setIsCreate(true);
                  }}
                />
              </label>
              <label>
                Time
                <input
                  type="datetime-local"
                  name="createdAt"
                  value={formData.createdAt}
                  min={new Date().toISOString().slice(0, 16)} // Đảm bảo thời gian tối thiểu là hiện tại
                  onChange={handleInputChange}
                />
              </label>

              <button
                type="button"
                onClick={() => {
                  handleCreate();
                }}
                disabled={!isCreate}
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

export default OverlayCreateNotification;
