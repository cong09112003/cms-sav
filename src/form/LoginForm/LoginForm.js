import React, { useEffect, useLayoutEffect, useState } from "react";
import "./LoginForm.css";
import { FaLock } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = { email: "", password: "" };
    const specialCharRegex = /[^a-zA-Z0-9]/;

    if (email.length < 8 || email === null) {
      newErrors.email = "Invalid email";
    }

    if (
      password.length < 6 ||
      password === null ||
      specialCharRegex.test(password)
    ) {
      newErrors.password = "Invalid password";
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      await loginSubmit();
    }
  };

  const loginSubmit = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/login`,
        { email, password }
      );
      const { token, user } = response.data;
      if (response.data.user.user_role !== "Admin") {
        setLoginError("Unable to access: You must be an Admin.");
        return; // Dừng thực thi nếu không phải Admin
      }
      localStorage.setItem("sav-token", token);
      navigate("/home");
    } catch (error) {
      console.error(
        "Login Failed:",
        error.response?.data?.msg || "An error occurred"
      );
      setLoginError(
        error.response?.data?.msg || "Username or password is incorrect"
      );
    }
  };

  useEffect(() => {
    const checkAuthentication = async () => {
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
            navigate("/home");
          } else {
            navigate("/login");
          }
        } catch (error) {
          console.error("Token validation failed:", error);
          localStorage.removeItem("token");
          navigate("/login");
        }
      } else {
        navigate("/login");
      }
    };

    checkAuthentication();
  }, []);

  return (
    <div className="loginBody">
      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <h1>Login</h1>
          <div className="input_box">
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: "" });
              }}
              required
            />
            <MdOutlineEmail className="icon" />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div className="input_box">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: "" });
              }}
              required
            />
            <FaLock className="icon" />
            {errors.password && <p className="error">{errors.password}</p>}
            {loginError && <p className="error">{loginError}</p>}
          </div>
          <div className="remember-forgot">
            <label>
              <input type="checkbox" />
              Remember me
            </label>
            <a href="/">Forgot password</a>
          </div>
          <button type="submit" onClick={loginSubmit}>
            Login
          </button>
          <div className="register-link">
            <p>
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
