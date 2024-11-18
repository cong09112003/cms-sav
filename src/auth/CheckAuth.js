import React, { useEffect, useState } from "react";
import axios from "axios";

const checkAuth = async () => {
  const token = localStorage.getItem("sav-token");
  if (token) {
    // return true;
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
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Token validation failed:", error);
      localStorage.removeItem("token");
      return false;
    }
  } else {
    return false;
  }
};
export default checkAuth;
