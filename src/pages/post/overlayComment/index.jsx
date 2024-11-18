import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./Overlay.css";
import { useNavigate } from "react-router-dom";
import { Box, IconButton, useTheme } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import AccordionSummary from "@mui/material/AccordionSummary";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
import CloseIcon from "@mui/icons-material/Close";
import { Slide } from "react-slideshow-image";
import { FaStar } from "react-icons/fa";
import { PiMoneyWavyDuotone } from "react-icons/pi";
import { LiaEyeSolid } from "react-icons/lia";
export function OverlayComments({ isOpenComments, onClose, selectedPost }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (isOpenComments) getCommentsForPost();
  }, [isOpenComments]);

  const getCommentsForPost = async () => {
    const token = localStorage.getItem("sav-token");
    if (token) {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/comment/post/${selectedPost._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setComments(response.data);
      } catch (error) {
        setComments([]);
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <Fragment>
      {isOpenComments && (
        <Box className="overlay">
          <Box className="overlay__background" onClick={onClose} />
          <Box
            sx={{
              m: "20px",
              backgroundColor: "#00a514 ",
              width: "700px",
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
                  title="Comments"
                  subtitle={`Get All Comments Of Post  
                " ${selectedPost.title} "`}
                />
              </Box>
              <IconButton onClick={onClose}>
                <CloseIcon size={30} />
              </IconButton>
            </Box>
            <Box
              sx={{
                maxHeight: "400px",
                overflowY: "auto",
                paddingRight: "10px",
              }}
            >
              {comments.length > 0 ? (
                comments.map((comment, index) => (
                  <Accordion key={index} defaultExpanded={index === 0}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography color={colors.greenAccent[500]} variant="h4">
                        <Typography>
                          <Typography
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Box
                              component="img"
                              src={comment?.user?.avatar.url}
                              alt="header image"
                              width="45px"
                              height="45px"
                              sx={{
                                borderRadius: "50%",
                                marginRight: "10px",
                              }}
                            />
                            {comment?.user?.username} - {comment?.user?.phone} -{" "}
                            {comment?.user?.email}
                          </Typography>
                        </Typography>
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="h5">Comment details:</Typography>
                      <Typography
                        color={colors.greenAccent[400]}
                        variant="body1"
                      >
                        Comment: {comment?.comment}
                      </Typography>
                      <Typography
                        color={colors.greenAccent[400]}
                        variant="body1"
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            width: "100%",
                          }}
                        >
                          Rating: {comment?.rating}
                          <FaStar size={20} color="rgb(255, 255, 0)" />
                        </Box>
                      </Typography>
                      <Typography variant="h5">Post details</Typography>
                      <Typography variant="body1" color="textSecondary">
                        {comment?.house?.title}
                      </Typography>
                      <Typography variant="body1" color="textSecondary">
                        {comment?.house?.description}
                      </Typography>
                      <Typography color={colors.blueAccent[500]} variant="h6">
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            width: "100%",
                          }}
                        >
                          Price:{" "}
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                            minimumFractionDigits: 0,
                          }).format(comment.house.price)}
                          /month
                          <PiMoneyWavyDuotone
                            size={20}
                            color="rgb(255, 255, 0)"
                          />
                        </Box>
                      </Typography>
                      <Typography color={colors.greenAccent[500]} variant="h6">
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            width: "100%",
                          }}
                        >
                          Views:{comment.house.views}
                          <LiaEyeSolid
                            size={20}
                            color={colors.blueAccent[500]}
                          />
                        </Box>
                      </Typography>
                      <Typography variant="body1">
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            width: "100%",
                          }}
                        >
                          Average Rating: {comment?.house?.averageRating}
                          <FaStar size={20} color="rgb(255, 255, 0)" />
                        </Box>
                      </Typography>
                      <Typography color={colors.redAccent[500]} variant="h5">
                        Images
                      </Typography>
                      <Typography>
                        {comment?.house?.images &&
                          comment.house.images.length > 0 && (
                            <Slide
                              autoplay={false}
                              canSwipe={true}
                              indicators={true}
                            >
                              {comment.house.images.map((image, index) => (
                                <Box
                                  className="each-slide"
                                  key={index}
                                  style={{
                                    width: "600px",
                                    height: "600px",
                                    overflow: "hidden",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexDirection: "column",
                                  }}
                                >
                                  <Box
                                    component="img"
                                    src={image.url}
                                    alt={`Image ${index}`}
                                    sx={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "contain",
                                    }}
                                  />
                                </Box>
                              ))}
                            </Slide>
                          )}
                      </Typography>

                      <Typography color={colors.greenAccent[500]} variant="h7">
                        {/* Price:
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                          minimumFractionDigits: 0,
                        }).format(favorite.id_post.price)}
                        /month */}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))
              ) : (
                <Typography>No comemnts for posts.</Typography>
              )}
            </Box>
          </Box>
        </Box>
      )}
    </Fragment>
  );
}

export default OverlayComments;
