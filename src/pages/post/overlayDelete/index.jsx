import React, { Fragment } from "react";
import axios from "axios";
import "./Overlay.css";
import { useNavigate } from "react-router-dom";

export function OverlayDeletePost({
  isOpenDelete,
  onClose,
  selectedPost,
  refreshPosts,
}) {
  const navigate = useNavigate();
  const handleDelete = async () => {
    const token = localStorage.getItem("sav-token");
    if (token) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_API_URL}/api/post/${selectedPost._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("Xóa post thành công!");
        refreshPosts();
        onClose();
      } catch (error) {
        console.error("Xóa post thất bại:", error);
        alert("Không thể post.");
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
            <h2 style={{ color: "black" }}>Delete Post</h2>
            <form className="overlay__form">
              <label className="nodrop">
                <>
                  Are you sure delete post with title: "{selectedPost?.title}"
                  {selectedPost?.landlord && selectedPost?.landlord.username}?
                </>
              </label>
              <button
                type="button"
                onClick={handleDelete}
                disabled={!isOpenDelete}
                className="overlay__update-button"
              >
                Accept delete post
              </button>
            </form>
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default OverlayDeletePost;
