import React, { Fragment } from "react";
import axios from "axios";
import "./Overlay.css";
import { useNavigate } from "react-router-dom";
export function OverlayProcessing({
  isOpenProcessing,
  onClose,
  selectedReport,
  refreshReports,
}) {
  const navigate = useNavigate();
  const handleProcessing = async () => {
    const token = localStorage.getItem("sav-token");
    if (token) {
      try {
        await axios.patch(
          `${process.env.REACT_APP_API_URL}/api/report/${selectedReport._id}/status/processing`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("Set report processing thành công !");
        refreshReports();
        onClose();
      } catch (error) {
        console.error("Set report processing thất bại:", error);
        alert("Không thể set report processing thành công.");
      }
    } else {
      navigate("/login");
    }
  };
  return (
    <Fragment>
      {isOpenProcessing && (
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
            <h2 style={{ color: "black" }}>Set processing report</h2>
            <form className="overlay__form">
              <label className="nodrop">
                {selectedReport?.id_user && (
                  <>
                    Are you sure set processing report "{selectedReport?._id}"
                    of {selectedReport?.id_user.username}?
                  </>
                )}
              </label>
              <button
                type="button"
                onClick={handleProcessing}
                disabled={!isOpenProcessing}
                className="overlay__update-button"
              >
                Accept set processing report
              </button>
            </form>
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default OverlayProcessing;
