import { Box, IconButton, useTheme } from "@mui/material";
import Header from "../../components/Header";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tokens } from "../../theme";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuBellPlus } from "react-icons/lu";
import axios from "axios";
import OverlayCreateNotification from "./overlayCreate";
import { toZonedTime, format } from "date-fns-tz";
import EditNotificationsIcon from "@mui/icons-material/EditNotifications";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import OverlayEditNotification from "./overlayEdit";
import OverlayDeleteNotification from "./overlayDelete";
const FAQ = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const getAllNotification = async () => {
    const token = localStorage.getItem("sav-token");
    if (token) {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/notification`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setNotifications(response.data);
      } catch (err) {
        console.error("Token validation failed:", err);
        localStorage.removeItem("sav-token");
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    getAllNotification();
  }, []);

  const toggleOverlayCreate = () => {
    setIsOpenCreate(!isOpenCreate);
  };

  const toVietnamTime = (dateString) => {
    const timeZone = "Asia/Ho_Chi_Minh";
    const zonedDate = toZonedTime(dateString, timeZone); // Sử dụng toZonedTime thay vì utcToZonedTime
    return format(zonedDate, "dd:MM:yyyy HH:mm:ss", { timeZone });
  };

  const toggleOverlayEdit = (notification) => {
    setSelectedNotification(notification);
    setIsOpenEdit(!isOpenEdit);
  };

  const toggleOverlayDelete = (notification) => {
    setSelectedNotification(notification);
    setIsOpenDelete(!isOpenDelete);
  };

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header
          title="Notification"
          subtitle="Get All Notification Frequently"
        />
        <IconButton
          onClick={() => {
            toggleOverlayCreate();
          }}
        >
          <LuBellPlus size={30} />
        </IconButton>
      </Box>

      {notifications.length > 0 ? (
        notifications.map((notification, index) => (
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
                  <img
                    src={notification.id_user?.avatar || "../../assets/man.png"}
                    alt="avatar user"
                    width="50px"
                    height="50px"
                    style={{ borderRadius: "50%", objectFit: "cover" }}
                  />
                  <Box ml={2}>
                    <Typography color={colors.greenAccent[500]} variant="h5">
                      {notification.id_user?.username ||
                        notification.id_user?.email ||
                        "Unknown User"}
                    </Typography>
                  </Box>
                </Box>
              </Typography>

              <Box display="flex" ml="auto">
                <IconButton onClick={() => toggleOverlayEdit(notification)}>
                  <Typography variant="body5">
                    <EditNotificationsIcon />
                  </Typography>
                </IconButton>
                <IconButton onClick={() => toggleOverlayDelete(notification)}>
                  <Typography variant="body5">
                    <DeleteSweepIcon />
                  </Typography>
                </IconButton>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                {notification.message || "No details available."}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Date: {toVietnamTime(notification.create_at)}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))
      ) : (
        <Typography>No notifications available.</Typography>
      )}
      {isOpenCreate && (
        <OverlayCreateNotification
          isOpenCreate={isOpenCreate}
          onClose={toggleOverlayCreate}
          refreshNotifications={getAllNotification}
        ></OverlayCreateNotification>
      )}
      {isOpenEdit && (
        <OverlayEditNotification
          isOpenEdit={isOpenEdit}
          onClose={toggleOverlayEdit}
          selectedNotification={selectedNotification}
          refreshNotifications={getAllNotification}
        ></OverlayEditNotification>
      )}
      {isOpenDelete && (
        <OverlayDeleteNotification
          isOpenDelete={isOpenDelete}
          onClose={toggleOverlayDelete}
          selectedNotification={selectedNotification}
          refreshNotifications={getAllNotification}
        ></OverlayDeleteNotification>
      )}
    </Box>
  );
};

export default FAQ;
