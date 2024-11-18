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
export function OverlayFavorUser({ isOpenFavor, onClose, selectedUser }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (isOpenFavor) getFavouritesForUser();
  }, [isOpenFavor]);

  const getFavouritesForUser = async () => {
    const token = localStorage.getItem("sav-token");
    if (token) {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/favorite/user/${selectedUser._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFavorites(response.data);
      } catch (error) {
        setFavorites([]);
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <Fragment>
      {isOpenFavor && (
        <Box className="overlay">
          <Box className="overlay__background" onClick={onClose} />
          <Box
            sx={{
              m: "20px",
              backgroundColor: "#F08080",
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
                  title="Favorites"
                  subtitle={`Get All Favourites Posts Of 
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
              {favorites.length > 0 ? (
                favorites.map((favorite, index) => (
                  <Accordion key={index} defaultExpanded={index === 0}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography color={colors.greenAccent[500]} variant="h5">
                        <Typography>
                          {favorite.id_post.title} - {""}
                          {favorite.id_post.location.address} ,
                          {favorite.id_post.location.district},
                          {favorite.id_post.location.city}
                        </Typography>
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="h6">Post details:</Typography>
                      <Typography variant="body1" color="textSecondary">
                        {favorite.id_post.description}
                      </Typography>
                      <Typography color={colors.redAccent[500]} variant="h7">
                        {favorite.id_post.landlord && (
                          <Typography>
                            Landlord: {favorite.id_post.landlord.username}
                            <Box
                              component="img"
                              src={favorite?.id_post.landlord.avatar.url}
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
                        }).format(favorite.id_post.price)}
                        /month
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))
              ) : (
                <Typography>No favourite posts.</Typography>
              )}
            </Box>
          </Box>
        </Box>
      )}
    </Fragment>
  );
}

export default OverlayFavorUser;