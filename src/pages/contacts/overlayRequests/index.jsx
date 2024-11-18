import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./OverlayFavor.css";
import { useNavigate } from "react-router-dom";
import { Box, IconButton, useTheme } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import AccordionSummary from "@mui/material/AccordionSummary";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
import CloseIcon from "@mui/icons-material/Close";
export function OverlayRequests({ isOpenRequests, onClose, selectedUser }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [Requests, setRequests] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (isOpenRequests) getRequestsForUser();
  }, [isOpenRequests]);

  const getRequestsForUser = async () => {
    const token = localStorage.getItem("sav-token");
    if (token) {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/request/renter/${selectedUser._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRequests(response.data);
      } catch (error) {
        setRequests([]);
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <Fragment>
      {isOpenRequests && (
        <Box className="overlay">
          <Box className="overlay__background" onClick={onClose} />
          <Box
            sx={{
              m: "20px",
              backgroundColor: "#e0a001",
            }}
            className="overlay__container"
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box display="flex" alignItems="center" gap="5px">
                <Header
                  title="Requests"
                  subtitle={`Get All Requests Posts Of Renter
                ${selectedUser.username}`}
                />
                <Box
                  component="img"
                  src={selectedUser?.avatar.url}
                  alt="header image"
                  width="45px"
                  height="45px"
                  sx={{
                    borderRadius: "50%",
                  }}
                />
              </Box>
              <IconButton onClick={onClose}>
                <CloseIcon size={30} />
              </IconButton>
            </Box>
            <Box
              sx={{
                maxHeight: "400px", // Giới hạn chiều cao tối đa
                overflowY: "auto", // Bật cuộn dọc
                paddingRight: "10px", // Khoảng cách để hiển thị thanh cuộn đẹp
              }}
            >
              {Requests.length > 0 ? (
                Requests.map((req, index) => (
                  <Accordion key={index} defaultExpanded={index === 0}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography color={colors.greenAccent[500]} variant="h5">
                        <Typography
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Box
                            component="img"
                            src={req?.id_user_rent.avatar.url}
                            alt="header image"
                            width="45px"
                            height="45px"
                            sx={{
                              borderRadius: "50%",
                              marginRight: "10px",
                            }}
                          />
                          {req.id_user_rent.username} - {req.id_user_rent.phone}{" "}
                          - {req.id_user_rent.email}
                        </Typography>
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="h6">
                        Requests Post Details:
                      </Typography>
                      <Typography variant="body1" color="textSecondary">
                        Title: {req.id_post.title}
                      </Typography>
                      <Typography variant="body1" color="textSecondary">
                        {req.id_post.description}
                      </Typography>
                      <Typography color={colors.redAccent[500]} variant="h7">
                        {req.id_post.landlord && (
                          <Typography>
                            Landlord: {req.id_post.landlord.username}
                            <Box
                              component="img"
                              src={req?.id_post.landlord.avatar.url}
                              alt="header image"
                              width="25px"
                              height="25px"
                              sx={{
                                borderRadius: "50%",
                              }}
                            />
                          </Typography>
                        )}
                      </Typography>
                      <Typography color={colors.greenAccent[500]} variant="h7">
                        Price:
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                          minimumFractionDigits: 0,
                        }).format(req.id_post.price)}
                        /month
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))
              ) : (
                <Typography>No favourite requests.</Typography>
              )}
            </Box>
          </Box>
        </Box>
      )}
    </Fragment>
  );
}

export default OverlayRequests;
