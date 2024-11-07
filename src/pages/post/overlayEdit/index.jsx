import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Overlay.css";
import Switch from "react-switch";

export function OverlayEditPost({
  isOpenEdit,
  onClose,
  selectedPost,
  refreshPosts,
}) {
  return (
    <Fragment>
      {isOpenEdit && (
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
            <h1 style={{ color: "black" }}>Edit</h1>
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default OverlayEditPost;
