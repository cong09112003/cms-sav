import React, { Fragment, useEffect } from "react";
import axios from "axios";
import "./Overlay.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function OverlayCreateReport({
  isOpenCreateReport,
  onClose,
  selectedPost,
}) {
  const navigate = useNavigate();
  const [isCreateReport, setIsCreateReport] = useState(false);
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
          setAdmin(response.data);
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
  useEffect(() => {
    getAuth();
  }, []);

  useEffect(() => {
    if (admin && selectedPost) {
      setFormData({
        id_user: admin._id,
        id_post: selectedPost._id,
        report_reason: "",
        description: "",
      });
    }
  }, [admin, selectedPost]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreate = async () => {
    const token = localStorage.getItem("sav-token");
    if (token) {
      try {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/api/report/create`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("Chuyển trạng thái post deleted thành công !");
        // refreshReports();
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
      {isOpenCreateReport && (
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
              <label>
                Report Reason
                <input
                  type="text"
                  name="report_reason"
                  value={formData.report_reason}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Description
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                />
              </label>
              <button
                type="button"
                onClick={handleCreate}
                disabled={!isOpenCreateReport}
                className="overlay__update-button"
              >
                Create report
              </button>
            </form>
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default OverlayCreateReport;
