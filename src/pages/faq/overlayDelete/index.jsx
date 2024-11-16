import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import "./Overlay.css";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import "react-slideshow-image/dist/styles.css";
import { Label } from "@mui/icons-material";

export function OverlayDeleteNotification({
  isOpenDelete,
  onClose,
  selectedNotification,
  refreshNotifications,
}) {
  const navigate = useNavigate();
  const [isDelete, setIsDelete] = useState(false);
  const handleDelete = async () => {
    const token = localStorage.getItem("sav-token");
    if (token) {
      try {
        const response = await axios.delete(
          `https://be-android-project.onrender.com/api/notification/${selectedNotification._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("Xóa thông báo thành công!");
        setIsDelete(false);
        refreshNotifications();
        onClose();
      } catch (error) {
        console.error("Xóa thông báo thất bại:", error);
        alert("Không thể xóa thông báo.");
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <Fragment>
      {isOpenDelete && (
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

            <form className="overlay__form">
              <h1 style={{ color: "black" }}>Delete notification</h1>
              <label class="nodrop">
                Are you sure delete notification for user :
                {selectedNotification.id_user?.username ||
                  selectedNotification.id_user?.email ||
                  "Unknown User"}
              </label>
              <button
                type="button"
                onClick={handleDelete}
                disabled={!isOpenDelete}
                className="overlay__update-button"
              >
                Accept delete notification
              </button>
            </form>
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default OverlayDeleteNotification;
