import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./Overlay.css";
import { useNavigate } from "react-router-dom";
import { Box, IconButton, TextField, useTheme } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import AccordionSummary from "@mui/material/AccordionSummary";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
import { IoLocation } from "react-icons/io5";
import CloseIcon from "@mui/icons-material/Close";
import { FaMoneyBillWave } from "react-icons/fa";
export function OverlayDetailReport({ isOpenDetail, onClose, selectedReport }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  return (
    <Fragment>
      {isOpenDetail && (
        <Box className="overlay">
          <Box className="overlay__background" onClick={onClose} />
          <Box
            sx={{
              m: "20px",
              backgroundColor: colors.greenAccent[600],
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
                  title="Report"
                  subtitle={`Get detail report from
                ${selectedReport.id_user.username} `}
                />
                <Box
                  component="img"
                  src={selectedReport.id_user?.avatar.url}
                  alt="header image"
                  width="45px"
                  height="45px"
                  sx={{
                    borderRadius: "50%",
                  }}
                />
                <Box
                  sx={{
                    marginTop: "35px",
                  }}
                >
                  <Header
                    title=""
                    subtitle={`for ${selectedReport.id_post._id} `}
                  />
                </Box>
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
              <Accordion defaultExpanded={0}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography color={colors.greenAccent[500]} variant="h5">
                    <Typography>
                      <Box display="flex" alignItems="center" gap="2px">
                        <Box
                          component="img"
                          src={selectedReport.id_user?.avatar.url}
                          alt="header image"
                          width="45px"
                          height="45px"
                          sx={{
                            borderRadius: "50%",
                          }}
                        />
                        <Box
                          sx={{
                            marginTop: "35px",
                          }}
                        >
                          <Header
                            title=""
                            subtitle={`${selectedReport.id_user.username} : " ${selectedReport.report_reason} "`}
                          />
                        </Box>
                      </Box>
                    </Typography>
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="h5">Report details:</Typography>
                  <TextField
                    label="Report Reason"
                    multiline
                    fullWidth
                    value={selectedReport.report_reason}
                    InputProps={{
                      readOnly: true,
                    }}
                    variant="outlined"
                    margin="dense"
                  />
                  <TextField
                    label="Report Description"
                    multiline
                    fullWidth
                    value={selectedReport.description}
                    InputProps={{
                      readOnly: true,
                    }}
                    variant="outlined"
                    margin="dense"
                  />
                  <Typography variant="h5">Post details:</Typography>
                  <Typography variant="body1" color="textSecondary">
                    {selectedReport.id_post.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {selectedReport.id_post.description}
                  </Typography>
                  <Typography color={colors.blueAccent[500]} variant="h6">
                    Location:{selectedReport.id_post.location.address},{" "}
                    {selectedReport.id_post.location.district},{" "}
                    {selectedReport.id_post.city}
                    <IoLocation />
                  </Typography>
                  <Typography color={colors.redAccent[500]} variant="h6">
                    {selectedReport.id_post.landlord && (
                      <Box display="flex" alignItems="center" gap="2px">
                        Landlord: {selectedReport.id_post.landlord.username}
                        <Box
                          component="img"
                          src={selectedReport?.id_post.landlord.avatar.url}
                          alt="header image"
                          width="25px"
                          height="25px"
                          sx={{
                            borderRadius: "50%",
                          }}
                        />
                      </Box>
                    )}
                  </Typography>
                  <Typography color={colors.greenAccent[500]} variant="h7">
                    Price:
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                      minimumFractionDigits: 0,
                    }).format(selectedReport.id_post.price)}
                    /month <FaMoneyBillWave />
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Box>
          </Box>
        </Box>
      )}
    </Fragment>
  );
}
