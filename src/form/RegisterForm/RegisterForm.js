import React, { useEffect, useLayoutEffect, useState } from "react";
import "./RegisterForm.css";
import { FaLock } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function RegisterForm() {
  return (
    <div className="loginBody">
      <div className="wrapper">
        <h1> Register </h1>
      </div>
    </div>
  );
}

export default RegisterForm;
