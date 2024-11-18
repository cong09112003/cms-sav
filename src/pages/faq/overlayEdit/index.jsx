import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import "./Overlay.css";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import "react-slideshow-image/dist/styles.css";
import { Label } from "@mui/icons-material";

export function OverlayEditNotification({
  isOpenEdit,
  onClose,
  selectedNotification,
  refreshNotifications,
}) {
  const [formData, setFormData] = useState({
    message: selectedNotification.message || "", // Kiểm tra null và cung cấp giá trị mặc định
    id_user: selectedNotification.id_user
      ? selectedNotification.id_user._id
      : "", // Kiểm tra null và cung cấp giá trị mặc định
    createdAt: selectedNotification.create_at
      ? new Date(selectedNotification.create_at).toISOString().slice(0, 16) // Chuyển đổi định dạng
      : new Date().toISOString().slice(0, 16), // Giá trị mặc định
  });
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(false);
  const [users, setUsers] = useState([]);
  const handleEdit = async () => {
    const token = localStorage.getItem("sav-token");
    if (token) {
      try {
        const response = await axios.put(
          `${process.env.REACT_APP_API_URL}/api/notification/${selectedNotification._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("Thêm thông báo thành công!");
        setIsEdit(false);
        refreshNotifications();
        onClose();
      } catch (error) {
        console.error("Chỉnh sửa thông báo thất bại:", error);
        alert("Không thể chỉnh sửa thông báo.");
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
          "${process.env.REACT_APP_API_URL}/api/auth/users",
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
    setIsEdit(true);
  };

  useEffect(() => {
    if (isOpenEdit) getUsers();
  }, [isOpenEdit]);

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
            <h1 style={{ color: "black" }}>Edit notification</h1>
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
                    formData.id_user
                      ? users.find((user) => user._id === formData.id_user)
                        ? {
                            label: users.find(
                              (user) => user._id === formData.id_user
                            )?.username,
                            value: formData.id_user,
                          }
                        : null
                      : null
                  }
                  onChange={(selectedOption) => {
                    setFormData((prevData) => ({
                      ...prevData,
                      id_user: selectedOption ? selectedOption.value : "", // Cập nhật _id của renter vào formData
                    }));
                    setIsEdit(true);
                  }}
                />
              </label>
              <label>
                Time
                <input
                  type="datetime-local"
                  name="createdAt"
                  value={formData.createdAt}
                  onChange={handleInputChange}
                  disabled={true}
                />
              </label>

              <button
                type="button"
                onClick={() => {
                  handleEdit();
                }}
                disabled={!isEdit}
                className="overlay__update-button"
              >
                Update notification
              </button>
            </form>
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default OverlayEditNotification;
