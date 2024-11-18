import React, { Fragment, useEffect } from "react";
import axios from "axios";
import "./Overlay.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { TrySharp } from "@mui/icons-material";
export function OverlayCreate({ isOpenCreate, onClose, refreshReports }) {
  const navigate = useNavigate();
  const [isAdd, setIsAdd] = useState(false);
  const [posts, setPosts] = useState([]);
  const [admin, setAdmin] = useState(null);
  const [formData, setFormData] = useState({
    id_user: "",
    id_post: "",
    report_reason: "",
    description: "",
  });

  const getAuth = async () => {
    const token = localStorage.getItem("sav-token");
    if (token) {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setAdmin(response.body);
        } else {
          setAdmin(null);
        }
      } catch (error) {
        setAdmin(null);
      }
    } else {
      navigate("/login");
    }
  };

  // useEffect(() => {
  //   if (isOpenCreate) {
  //     getAuth();
  //     getAllPosts();
  //   }
  // }, [isOpenAdd]);

  const handleCreate = async () => {
    const token = localStorage.getItem("sav-token");
    if (token) {
      try {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/api/report/create`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("Chuyển trạng thái post deleted thành công !");
        refreshReports();
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
            <h2 style={{ color: "black" }}>Create report</h2>
            <form className="overlay__form">
              <button
                type="button"
                onClick={handleCreate}
                disabled={!isOpenCreate}
                className="overlay__update-button"
              >
                Create post
              </button>
            </form>
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default OverlayCreate;
