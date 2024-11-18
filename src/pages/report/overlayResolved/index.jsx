import React, { Fragment } from "react";
import axios from "axios";
import "./Overlay.css";
import { useNavigate } from "react-router-dom";
export function OverlayResolved({
  isOpenResolved,
  onClose,
  selectedReport,
  refreshReports,
}) {
  const navigate = useNavigate();
  const handleResolved = async () => {
    const token = localStorage.getItem("sav-token");
    if (token) {
      try {
        await axios.patch(
          `${process.env.REACT_APP_API_URL}/api/report/${selectedReport._id}/status/resolved`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("Set report resolved thành công !");
        refreshReports();
        onClose();
      } catch (error) {
        console.error("Set report resolved thất bại:", error);
        alert("Không thể set report resolved thành công.");
      }
    } else {
      navigate("/login");
    }
  };
  return (
    <Fragment>
      {isOpenResolved && (
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
            <h2 style={{ color: "black" }}>Set resolved report</h2>
            <form className="overlay__form">
              <label className="nodrop">
                {selectedReport?.id_user && (
                  <>
                    Are you sure set resolved report "{selectedReport?._id}" of{" "}
                    {selectedReport?.id_user.username}?
                  </>
                )}
              </label>
              <button
                type="button"
                onClick={handleResolved}
                disabled={!isOpenResolved}
                className="overlay__update-button"
              >
                Accept set resolved report
              </button>
            </form>
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default OverlayResolved;
