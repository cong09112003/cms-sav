import { Fragment, useState, useEffect } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Overlay.css";

export function OverlayDeleteUser({
  isOpenDelete,
  onClose,
  selectedUser,
  refreshUsers,
}) {
  const handleDelete = async () => {
    const token = localStorage.getItem("sav-token");
    try {
      await axios.delete(
        `https://be-android-project.onrender.com/api/auth/user/${selectedUser._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Xóa người dùng thành công!");
      refreshUsers();
      onClose();
    } catch (error) {
      console.error("Xóa người dùng thất bại:", error);
      alert("Không thể xóa người dùng.");
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
            <h2 style={{ color: "black" }}>Delete User</h2>
            <form className="overlay__form">
              <label class="nodrop">
                Are you sure delete user with username "{" "}
                {selectedUser?.username}
                "?
              </label>
              <button
                type="button"
                onClick={handleDelete}
                disabled={!isOpenDelete}
                className="overlay__update-button"
              >
                Accept
              </button>
            </form>
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default OverlayDeleteUser;
