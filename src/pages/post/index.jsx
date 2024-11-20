import React, { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  useTheme,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FcComments, FcOk } from "react-icons/fc";
import { MdNotInterested, MdReport } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { MdPostAdd } from "react-icons/md";
import OverlayEditPost from "./overlayEdit";
import OverlayDeletePost from "./overlayDelete";
import OverlayAddPost from "./overlayAdd";
import { FaTableCellsRowLock } from "react-icons/fa6";
import OverlaySetDeletePost from "./overlaySetDelete";
import { FaFileCircleCheck } from "react-icons/fa6";
import OverlayActivePost from "./overlayActive";
import OverlayComments from "./overlayComment";
import OverlayCreateReport from "./overlayCreateReport";
const Post = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenSetDelete, setIsOpenSetDelete] = useState(false);
  const [isOpenActive, setIsOpenActive] = useState(false);
  const [isOpenComments, setIsOpenComments] = useState(false);
  const [isOpenCreateReport, setIsOpenCreateReport] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("All"); // Bộ lọc trạng thái
  const [selectedRoomType, setSelectedRoomType] = useState("All"); // Bộ lọc trạng thái
  const [filteredPosts, setFilteredPosts] = useState([]); // Dữ liệu sau khi lọc

  const statusPost = [
    "All",
    "Active",
    "Inactive",
    "Deleted",
    "Pending",
    "Locked",
  ];
  const statusPostColors = {
    Active: "#23ca02",
    Inactive: "#ec8a0e",
    Deleted: "#FF6347",
    Pending: "10d89e",
    Locked: "#ff0000",
  };

  const roomTypePost = [
    "All",
    "Single",
    "Shared",
    "Apartment",
    "Dormitory",
    "Double",
  ];
  const roomTypePostColors = {
    Single: "#23ca02",
    Shared: "#ec8a0e",
    Apartment: "#ff0032",
    Dormitory: "#FFD700",
    Double: "#10d8b1",
  };

  const [selectedPost, setSelectedPost] = useState(null);

  const toggleOverlayEdit = (post) => {
    setSelectedPost(post);
    setIsOpenEdit(!isOpenEdit);
  };
  const toggleOverlayDelete = (post) => {
    setSelectedPost(post);
    setIsOpenDelete(!isOpenDelete);
  };
  const toggleOverlayAdd = () => {
    setIsOpenAdd(!isOpenAdd);
  };

  const toggleOverlaySetDelete = (post) => {
    setSelectedPost(post);
    setIsOpenSetDelete(!isOpenSetDelete);
  };

  const toggleOverlayActive = (post) => {
    setSelectedPost(post);
    setIsOpenActive(!isOpenActive);
  };
  const toggleOverlayComments = (post) => {
    setSelectedPost(post);
    setIsOpenComments(!isOpenComments);
  };

  const toggleOverlayCreateReport = (post) => {
    setSelectedPost(post);
    setIsOpenCreateReport(!isOpenCreateReport);
  };

  const getPosts = async () => {
    const token = localStorage.getItem("sav-token");

    if (token) {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/post/getAll`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setPosts(response.data);
        } else {
          alert("Cannot get posts");
        }
      } catch (error) {
        console.error("Token validation failed:", error);
        localStorage.removeItem("sav-token");
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    getPosts();
  }, [navigate]);

  useEffect(() => {
    if (selectedStatus === "All") {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter((post) => post.status === selectedStatus));
    }
  }, [selectedStatus, posts]);
  useEffect(() => {
    if (selectedRoomType === "All") {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(
        posts.filter((post) => post.roomType === selectedRoomType)
      );
    }
  }, [selectedRoomType, posts]);

  const columns = [
    { field: "_id", headerName: "Post Id", width: 170 },
    {
      field: "title",
      headerName: "Title",
      width: 500,
      cellClassName: "name-column--cell",
    },
    {
      field: "price",
      headerName: "Price per Month",
      type: "number",
      width: 200,
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="100%"
        >
          <span>{params.row.price}</span>
        </Box>
      ),
    },
    {
      field: "location.geoLocation.coordinates",
      headerName: "Coordinates",
      cellClassName: "name-column--cell",
      width: 150,
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="100%"
        >
          <span>
            {params.row.location.geoLocation.coordinates &&
            params.row.location.geoLocation.coordinates.length > 0
              ? params.row.location.geoLocation.coordinates.join(", ")
              : "#"}
          </span>
        </Box>
      ),
    },

    {
      field: "location.address",
      headerName: "Address",
      width: 600,
      valueGetter: (params) =>
        params.row.location ? params.row.location.address : "No Address",
    },
    {
      field: "location.city",
      headerName: "City",
      width: 150,
      headerAlign: "left",
      cellClassName: "name-column--cell",
      valueGetter: (params) =>
        params.row.location ? params.row.location.city : "No City",
    },
    {
      field: "location.district",
      headerName: "District",
      width: 150,
      valueGetter: (params) =>
        params.row.location ? params.row.location.district : "No District",
    },
    {
      field: "location.ward",
      headerName: "Ward",
      width: 150,
      cellClassName: "name-column--cell",
      valueGetter: (params) =>
        params.row.location ? params.row.location.ward : "No Ward",
    },
    {
      field: "averageRating",
      headerName: "Average Rating",
      width: 150,
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="100%"
        >
          <span>{params.row.averageRating ? params.row.averageRating : 0}</span>
        </Box>
      ),
      valueGetter: (params) => params.row.averageRating,
    },
    {
      field: "views",
      headerName: "Views",
      width: 150,
      headerAlign: "center",
      type: "number",
      cellClassName: "name-column--cell",
      renderCell: (params) => (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="100%"
        >
          <span>{params.row.views ? params.row.views : 0}</span>
        </Box>
      ),
      valueGetter: (params) => params.row.views,
    },
    {
      field: "landlord._id",
      headerName: "Landlord Id",
      width: 200,
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="100%"
        >
          <span>{params.row.landlord ? params.row.landlord._id : "#"}</span>
        </Box>
      ),
      valueGetter: (params) =>
        params.row.landlord ? params.row.landlord._id : "#",
    },
    {
      field: "landlord.username",
      headerName: "Landlord username",
      width: 200,
      cellClassName: "name-column--cell",
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="100%"
        >
          <span>
            {params.row.landlord ? params.row.landlord.username : "#"}
          </span>
        </Box>
      ),
      valueGetter: (params) =>
        params.row.landlord ? params.row.landlord.username : "#",
    },
    {
      field: "landlord.email",
      headerName: "Landlord email",
      width: 200,
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="100%"
        >
          <span>{params.row.landlord ? params.row.landlord.email : "#"}</span>
        </Box>
      ),
      valueGetter: (params) =>
        params.row.landlord ? params.row.landlord.email : "#",
    },
    {
      field: "landlord.phone",
      headerName: "Landlord phone",
      width: 200,
      cellClassName: "name-column--cell",
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="100%"
        >
          <span>{params.row.landlord ? params.row.landlord.phone : "#"}</span>
        </Box>
      ),
      valueGetter: (params) =>
        params.row.landlord ? params.row.landlord.phone : "#",
    },
    {
      field: "landlord.address",
      headerName: "Landlord address",
      width: 200,
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="100%"
        >
          <span>{params.row.landlord ? params.row.landlord.address : "#"}</span>
        </Box>
      ),
      valueGetter: (params) =>
        params.row.landlord ? params.row.landlord.address : "#",
    },
    {
      field: "roomType",
      headerName: "Room Type",
      width: 120,
      headerAlign: "center",
      cellClassName: "name-column--cell",
      renderCell: (params) => (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="100%"
        >
          <span
            style={{
              color: roomTypePostColors[params.row.roomType] || "black",
              fontWeight: "bold",
            }}
          >
            {params.row.roomType || "#"}
          </span>
        </Box>
      ),
      valueGetter: (params) =>
        params.row.roomType ? params.row.roomType : "#",
    },
    {
      field: "size",
      headerName: "Size (sqm)",
      type: "number",
      width: 100,
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="100%"
        >
          <span>{params.row.size}</span>
        </Box>
      ),
    },
    {
      field: "availability",
      headerName: "Availability",
      width: 150,
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="100%"
        >
          <IconButton>
            {params.row.availability ? <FcOk /> : <MdNotInterested />}
          </IconButton>
        </Box>
      ),
    },
    {
      field: "amenities.hasWifi",
      headerName: "Wifi",
      width: 150,
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="100%"
        >
          <IconButton>
            {params.row.amenities.hasWifi ? <FcOk /> : <MdNotInterested />}
          </IconButton>
        </Box>
      ),
      valueGetter: (params) => params.row.amenities.hasWifi,
    },
    {
      field: "amenities.hasParking",
      headerName: "Parking",
      width: 150,
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="100%"
        >
          <IconButton>
            {params.row.amenities.hasParking ? <FcOk /> : <MdNotInterested />}
          </IconButton>
        </Box>
      ),
      valueGetter: (params) => params.row.amenities.hasParking,
    },
    {
      field: "amenities.hasAirConditioner",
      headerName: "Air Conditioner",
      width: 150,
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="100%"
        >
          <IconButton>
            {params.row.amenities.hasAirConditioner ? (
              <FcOk />
            ) : (
              <MdNotInterested />
            )}
          </IconButton>
        </Box>
      ),
      valueGetter: (params) => params.row.amenities.hasAirConditioner,
    },
    {
      field: "amenities.hasKitchen",
      headerName: "Kitchen",
      width: 150,
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="100%"
        >
          <IconButton>
            {params.row.amenities.hasKitchen ? <FcOk /> : <MdNotInterested />}
          </IconButton>
        </Box>
      ),
      valueGetter: (params) => params.row.amenities.hasKitchen,
    },
    {
      field: "amenities.hasElevator",
      headerName: "Elevator",
      width: 150,
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="100%"
        >
          <IconButton>
            {params.row.amenities.hasElevator ? <FcOk /> : <MdNotInterested />}
          </IconButton>
        </Box>
      ),
      valueGetter: (params) => params.row.amenities.hasElevator,
    },
    {
      field: "additionalCosts.electricity",
      headerName: "Electricity Cost",
      width: 150,
      cellClassName: "name-column--cell",
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="100%"
        >
          <span>
            {params.row.additionalCosts
              ? params.row.additionalCosts.electricity
              : 0}
          </span>
        </Box>
      ),
      valueGetter: (params) => params.row.additionalCosts.electricity,
    },
    {
      field: "additionalCosts.water",
      headerName: "Water Cost",
      width: 150,
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="100%"
        >
          <span>
            {params.row.additionalCosts ? params.row.additionalCosts.water : 0}
          </span>
        </Box>
      ),
      valueGetter: (params) => params.row.additionalCosts.water,
    },
    {
      field: "additionalCosts.internet",
      headerName: "Internet Cost",
      width: 150,
      cellClassName: "name-column--cell",
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="100%"
        >
          <span>
            {params.row.additionalCosts
              ? params.row.additionalCosts.internet
              : 0}
          </span>
        </Box>
      ),
      valueGetter: (params) => params.row.additionalCosts.internet,
    },
    {
      field: "additionalCosts.cleaningService",
      headerName: "Cleaning Service Cost",
      width: 150,
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="100%"
        >
          <span>
            {params.row.additionalCosts
              ? params.row.additionalCosts.cleaningService
              : 0}
          </span>
        </Box>
      ),
      valueGetter: (params) => params.row.additionalCosts.cleaningService,
    },
    {
      field: "additionalCosts.security",
      headerName: "Security Cost",
      width: 150,
      headerAlign: "center",
      cellClassName: "name-column--cell",
      renderCell: (params) => (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="100%"
        >
          <span>
            {params.row.additionalCosts
              ? params.row.additionalCosts.security
              : 0}
          </span>
        </Box>
      ),
      valueGetter: (params) => params.row.additionalCosts.security,
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="100%"
        >
          <span
            style={{
              color: statusPostColors[params.row.status] || "black", // màu mặc định nếu không khớp
              fontWeight: "bold",
            }}
          >
            {params.row.status}
          </span>
        </Box>
      ),
      valueGetter: (params) => params.row.status,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 250,
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="100%"
        >
          <IconButton onClick={() => toggleOverlayCreateReport(params.row)}>
            <MdReport />
          </IconButton>

          <IconButton onClick={() => toggleOverlayComments(params.row)}>
            <FcComments />
          </IconButton>

          <IconButton onClick={() => toggleOverlayActive(params.row)}>
            <FaFileCircleCheck color="#00a12b" />
          </IconButton>

          <IconButton onClick={() => toggleOverlaySetDelete(params.row)}>
            <FaTableCellsRowLock color="#FA8072" />
          </IconButton>

          <IconButton onClick={() => toggleOverlayEdit(params.row)}>
            <FaEdit />
          </IconButton>

          <IconButton onClick={() => toggleOverlayDelete(params.row)}>
            <AiFillDelete color="#cc1212" />
          </IconButton>
        </Box>
      ),
    },
  ];
  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="POST" subtitle="Welcome to posts" />
        <Box display="flex" alignItems="center" gap="10px">
          <Typography variant="body1" style={{ fontWeight: "bold" }}>
            Filter by:
          </Typography>
          <FormControl>
            <InputLabel>RoomType</InputLabel>
            <Select
              value={selectedRoomType}
              onChange={(e) => setSelectedRoomType(e.target.value)}
              style={{ minWidth: "150px" }}
            >
              {roomTypePost.map((roomType) => (
                <MenuItem key={roomType} value={roomType}>
                  {roomType}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <InputLabel>Status</InputLabel>
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{ minWidth: "150px" }}
            >
              {statusPost.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <IconButton
            onClick={() => {
              toggleOverlayAdd();
            }}
          >
            <MdPostAdd size="30" />
          </IconButton>
        </Box>
      </Box>
      <Box
        m="8px 0 0 0"
        width="100%"
        height="80vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .name-column--cell": { color: colors.greenAccent[300] },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={filteredPosts}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row._id}
        />
      </Box>
      {isOpenEdit && (
        <OverlayEditPost
          isOpenEdit={isOpenEdit}
          onClose={toggleOverlayEdit}
          selectedPost={selectedPost}
          refreshPosts={getPosts}
        ></OverlayEditPost>
      )}
      {isOpenDelete && (
        <OverlayDeletePost
          isOpenDelete={isOpenDelete}
          onClose={toggleOverlayDelete}
          selectedPost={selectedPost}
          refreshPosts={getPosts}
        ></OverlayDeletePost>
      )}
      {isOpenAdd && (
        <OverlayAddPost
          isOpenAdd={isOpenAdd}
          onClose={toggleOverlayAdd}
          refreshPosts={getPosts}
        ></OverlayAddPost>
      )}
      {isOpenSetDelete && (
        <OverlaySetDeletePost
          isOpenSetDelete={isOpenSetDelete}
          onClose={toggleOverlaySetDelete}
          selectedPost={selectedPost}
          refreshPosts={getPosts}
        ></OverlaySetDeletePost>
      )}
      {isOpenActive && (
        <OverlayActivePost
          isOpenActive={isOpenActive}
          onClose={toggleOverlayActive}
          selectedPost={selectedPost}
          refreshPosts={getPosts}
        ></OverlayActivePost>
      )}
      {isOpenComments && (
        <OverlayComments
          isOpenComments={isOpenComments}
          onClose={toggleOverlayComments}
          selectedPost={selectedPost}
        ></OverlayComments>
      )}

      {isOpenCreateReport && (
        <OverlayCreateReport
          isOpenCreateReport={isOpenCreateReport}
          onClose={toggleOverlayCreateReport}
          selectedPost={selectedPost}
        ></OverlayCreateReport>
      )}
    </Box>
  );
};

export default Post;
