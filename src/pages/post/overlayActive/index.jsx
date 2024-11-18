import React, { Fragment } from "react";
import axios from "axios";
import "./Overlay.css";
import { useNavigate } from "react-router-dom";
export function OverlayActivePost({
  isOpenActive,
  onClose,
  selectedPost,
  refreshPosts,
}) {
  const navigate = useNavigate();
  const handleActive = async () => {
    const token = localStorage.getItem("sav-token");
    if (token) {
      try {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/api/post/${selectedPost._id}/activate`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("Chuyển trạng thái post activated thành công !");
        refreshPosts();
        onClose();
      } catch (error) {
        console.error("chuyển trạng thái post thất bại:", error);
        alert("Không thể chuyển trạng thái post activated thành công.");
      }
    } else {
      navigate("/login");
    }
  };
  return (
    <Fragment>
      {isOpenActive && (
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
            s<h2 style={{ color: "black" }}>Set status active of Post</h2>
            <form className="overlay__form">
              <label className="nodrop">
                {selectedPost?.landlord && (
                  <>
                    Are you sure set active post with title: "
                    {selectedPost?.title}" of {selectedPost?.landlord.username}?
                  </>
                )}
              </label>

              <button
                type="button"
                onClick={handleActive}
                disabled={!isOpenActive}
                className="overlay__update-button"
              >
                Accept set active post
              </button>
            </form>
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default OverlayActivePost;
