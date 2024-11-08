import React, { useState, useEffect } from "react";
import { Box, useTheme, IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { TiUserAddOutline } from "react-icons/ti";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import OverlayEditUser from "./overlayEdit";
import OverlayDeleteUser from "./overlayDelete";
import OverlayAddUser from "./overlayAdd";

const Contacts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [users, setUsers] = useState([]);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenAdd, setIsOpenAdd] = useState(false);

  const Role = ["Admin", "User", "Renter"];
  const RoleColors = {
    Admin: "#ff0000",
    User: "#23ca02",
    Renter: "#10d89e",
  };

  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  const toggleOverlayEdit = (user) => {
    setSelectedUser(user);
    setIsOpenEdit(!isOpenEdit);
  };
  const toggleOverlayDelete = (user) => {
    setSelectedUser(user);
    setIsOpenDelete(!isOpenDelete);
  };
  const toggleOverlayAdd = () => {
    setIsOpenAdd(!isOpenAdd);
  };

  const getUsers = async () => {
    const token = localStorage.getItem("sav-token");

    if (token) {
      try {
        const response = await axios.get(
          "https://be-android-project.onrender.com/api/auth/users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setUsers(response.data);
        } else {
          alert("Can not get users");
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
    getUsers();
  }, [navigate]);

  const columns = [
    {
      field: "avatar",
      headerName: "Avatar",
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
          <img
            src={params.row.avatar || "../../assets/man.png"}
            alt="avatar user"
            width="40px"
            height="40px"
            style={{ borderRadius: "50%", objectFit: "cover" }}
          />
        </Box>
      ),
    },
    { field: "_id", headerName: "Registrar Id", width: 170 },
    {
      field: "username",
      headerName: "Name",
      width: 200,
      cellClassName: "name-column--cell",
    },
    { field: "phone", headerName: "Phone Number", width: 100 },
    {
      field: "email",
      headerName: "Email",
      width: 250,
      cellClassName: "name-column--cell",
    },
    { field: "address", headerName: "Address", width: 400 },
    {
      field: "user_role",
      headerName: "Role",
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
          <span
            style={{
              color: RoleColors[params.row.user_role] || "black", // màu mặc định nếu không khớp
              fontWeight: "bold",
            }}
          >
            {params.row.user_role}
          </span>
        </Box>
      ),
      valueGetter: (params) => params.row.status,
    },
    {
      field: "zipCode",
      headerName: "Zip Code",
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
          <span>{params.row.zipCode || "+84"}</span>
        </Box>
      ),
    },
    {
      field: "isOnline",
      headerName: "Online",
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
          <IconButton>
            {params.row.isOnline ? (
              <FaEye color="green" />
            ) : (
              <FaEyeSlash color="orange" />
            )}
          </IconButton>
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
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
          <IconButton onClick={() => toggleOverlayEdit(params.row)}>
            <FaEdit />
          </IconButton>
          <IconButton onClick={() => toggleOverlayDelete(params.row)}>
            <AiFillDelete color="red" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <div>
      <Box m="20px">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Header title="CONTACTS" subtitle="Welcome to your Contacts" />
          <IconButton
            onClick={() => {
              toggleOverlayAdd();
            }}
          >
            <TiUserAddOutline size="30" />
          </IconButton>
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
            rows={users}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            getRowId={(row) => row._id}
          />
        </Box>
        {isOpenEdit && (
          <OverlayEditUser
            isOpenEdit={isOpenEdit}
            onClose={toggleOverlayEdit}
            selectedUser={selectedUser}
            refreshUsers={getUsers}
          ></OverlayEditUser>
        )}
        {isOpenDelete && (
          <OverlayDeleteUser
            isOpenDelete={isOpenDelete}
            onClose={toggleOverlayDelete}
            selectedUser={selectedUser}
            refreshUsers={getUsers}
          ></OverlayDeleteUser>
        )}
        {isOpenAdd && (
          <OverlayAddUser
            isOpenAdd={isOpenAdd}
            onClose={toggleOverlayAdd}
            refreshUsers={getUsers}
          ></OverlayAddUser>
        )}
      </Box>
    </div>
  );
};

export default Contacts;
