import React, { Fragment } from "react";
import axios from "axios";
import "./Overlay.css";
import { useNavigate } from "react-router-dom";
export function OverlaySetDeletePost({
  isOpenSetDelete,
  onClose,
  selectedPost,
  refreshPosts,
}) {
  const navigate = useNavigate();
  const handleSetDelete = async () => {
    const token = localStorage.getItem("sav-token");
    if (token) {
      try {
        await axios.put(
          `https://be-android-project.onrender.com/api/post/${selectedPost._id}/delete`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("Chuyển trạng thái post deleted thành công !");
        refreshPosts();
        onClose();
      } catch (error) {
        console.error("chuyển trạng thái post thất bại:", error);
        alert("Không thể chuyển trạng thái post deleted thành công.");
      }
    } else {
      navigate("/login");
    }
  };
  return (
    <Fragment>
      {isOpenSetDelete && (
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
            s<h2 style={{ color: "black" }}>Set status delete of Post</h2>
            <form className="overlay__form">
              <label class="nodrop">
                Are you sure set delete post with title: " {selectedPost?.title}
                " of {selectedPost?.landlord.username} ?
              </label>
              <button
                type="button"
                onClick={handleSetDelete}
                disabled={!isOpenSetDelete}
                className="overlay__update-button"
              >
                Accept set delete post
              </button>
            </form>
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default OverlaySetDeletePost;
