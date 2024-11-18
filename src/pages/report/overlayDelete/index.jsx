import React, { Fragment } from "react";
import axios from "axios";
import "./Overlay.css";
import { useNavigate } from "react-router-dom";
export function OverlayDelete({
  isOpenDelete,
  onClose,
  selectedReport,
  refreshReports,
}) {
  const navigate = useNavigate();
  const handleDelete = async () => {
    const token = localStorage.getItem("sav-token");
    if (token) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_API_URL}/api/report/delete/${selectedReport._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("Xóa report thành công !");
        refreshReports();
        onClose();
      } catch (error) {
        console.error("Xóa report thất bại:", error);
        alert("Không thể xóa report thành công.");
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
            <h2 style={{ color: "black" }}>Delete report</h2>
            <form className="overlay__form">
              <label className="nodrop">
                {selectedReport?.id_user && (
                  <>
                    Are you sure set deleted report "{selectedReport?._id}" of{" "}
                    {selectedReport?.id_user.username}?
                  </>
                )}
              </label>
              <button
                type="button"
                onClick={handleDelete}
                disabled={!isOpenDelete}
                className="overlay__update-button"
              >
                Accept delete report
              </button>
            </form>
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default OverlayDelete;
