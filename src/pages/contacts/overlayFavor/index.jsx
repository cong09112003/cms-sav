import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./Overlay.css";
import { useNavigate } from "react-router-dom";
import { Box, IconButton, useTheme } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { LuBellPlus } from "react-icons/lu";
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
          `https://be-android-project.onrender.com/api/favorite/user/${selectedUser._id}`,
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
        <div className="overlay">
          <div className="overlay__background" onClick={onClose} />
          <Box m="20px" className="overlay__container">
            <Box className="overlay__controls">
              <IconButton className="overlay__close" onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Header
                title="Notification"
                subtitle="Get All Notification Frequently"
              />
              <IconButton onClick={() => {}}>
                <LuBellPlus size={30} />
              </IconButton>
            </Box>

            {favorites.length > 0 ? (
              favorites.map((favorite, index) => (
                <Accordion key={index} defaultExpanded={index === 0}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography color={colors.greenAccent[500]} variant="h5">
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        width="100%"
                        height="100%"
                      >
                        <Box ml={2}>
                          <Typography
                            color={colors.greenAccent[500]}
                            variant="h5"
                          >
                            {favorite.id_user_rent || "Unknown User"}
                          </Typography>
                        </Box>
                      </Box>
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>{"No details available."}</Typography>
                    <Typography variant="body1" color="textSecondary">
                      Date:
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))
            ) : (
              <Typography>No favourite posts.</Typography>
            )}
          </Box>
        </div>
      )}
    </Fragment>
  );
}

export default OverlayFavorUser;
