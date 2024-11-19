import React, { useState } from "react";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { AiOutlineDeliveredProcedure } from "react-icons/ai";
import { BiSolidDetail } from "react-icons/bi";
import Header from "../../components/Header";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SiDavinciresolve } from "react-icons/si";
import { RiDeleteBin5Fill } from "react-icons/ri";
import OverlayDelete from "./overlayDelete";
import OverlayProcessing from "./overlayProcessing";
import OverlayResolved from "./overlayResolved";
const Report = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState();
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [isOpenProcessing, setIsOpenProcessing] = useState(false);
  const [isOpenResolved, setIsOpenResolved] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);

  const navigate = useNavigate();
  const statusReport = ["Pending", "Pending", "Resolved"];
  const statusReportColors = {
    Pending: "#23ca02",
    Resolved: "#FF6347",
    Resolved: "10d89e",
  };

  const toggleOverlayDetail = (report) => {
    setSelectedReport(report);
    setIsOpenDetail(!isOpenDetail);
  };
  const toggleOverlayProcessing = (report) => {
    setSelectedReport(report);
    setIsOpenProcessing(!isOpenProcessing);
  };
  const toggleOverlayResolved = (report) => {
    setSelectedReport(report);
    setIsOpenResolved(!isOpenResolved);
  };
  const toggleOverlayDelete = (report) => {
    setSelectedReport(report);
    setIsOpenDelete(!isOpenDelete);
  };

  const getReports = async () => {
    const token = localStorage.getItem("sav-token");
    if (token) {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/report/getAll`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setReports(response.data);
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
    getReports();
  }, [navigate]);

  const columns = [
    { field: "_id", headerName: "ReportId", width: 170 },
    {
      field: "Report Reason",
      headerName: "Report Reason",
      minWidth: 200,
      headerAlign: "center",
      cellClassName: "name-column--cell",
      valueGetter: (params) =>
        params.row.report_reason ? params.row.report_reason : "No reason",
    },
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
            src={params.row.id_user.avatar.url || "../../assets/man.png"}
            alt="avatar user"
            width="40px"
            height="40px"
            style={{ borderRadius: "50%", objectFit: "cover" }}
          />
        </Box>
      ),
    },
    {
      field: "username user",
      headerName: "Username User",
      width: 150,
      headerAlign: "center",
      cellClassName: "name-column--cell",
      valueGetter: (params) =>
        params.row.id_user ? params.row.id_user.username : "No Username",
      renderCell: (params) => (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="100%"
        >
          <span>{params.row.id_user ? params.row.id_user.username : "#"}</span>
        </Box>
      ),
    },
    {
      field: "username phone",
      headerName: "Phone User",
      width: 100,
      headerAlign: "center",
      valueGetter: (params) =>
        params.row.id_user ? params.row.id_user.phone : "No Phone",
      renderCell: (params) => (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="100%"
        >
          <span>{params.row.id_user ? params.row.id_user.phone : "#"}</span>
        </Box>
      ),
    },
    {
      field: "usernam email",
      headerName: "Email User",
      width: 200,
      cellClassName: "name-column--cell",
      headerAlign: "center",
      valueGetter: (params) =>
        params.row.id_user ? params.row.id_user.email : "No Email",
    },
    {
      field: "port",
      headerName: "Port",
      width: 170,
      headerAlign: "center",
      valueGetter: (params) =>
        params.row.id_post ? params.row.id_post._id : "No port",
    },
    {
      field: "Title",
      headerName: "Title",
      minWidth: 200,
      cellClassName: "name-column--cell",
      headerAlign: "center",
      valueGetter: (params) =>
        params.row.id_post ? params.row.id_post.title : "#",
    },
    {
      field: "Location",
      headerName: "Location",
      minWidth: 400,
      headerAlign: "center",
      valueGetter: (params) =>
        params.row.id_post.location ? params.row.id_post.location : "#",
      renderCell: (params) => (
        <span>
          {params.row.id_post.location
            ? `${params.row.id_post.location.address || ""}, ${
                params.row.id_post.location.district || ""
              }, ${params.row.id_post.location.city || ""}`.replace(
                /(^[,\s]+|[,\s]+$)/g,
                ""
              )
            : "#"}
        </span>
      ),
    },
    {
      field: "landlord username",
      headerName: "landlord username",
      width: 150,
      cellClassName: "name-column--cell",
      headerAlign: "center",
      valueGetter: (params) =>
        params.row.id_post.landlord
          ? params.row.id_post.landlord.username
          : "#",
      renderCell: (params) => (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="100%"
        >
          <span>
            {params.row.id_post.landlord
              ? params.row.id_post.landlord.username
              : "#"}
          </span>
        </Box>
      ),
    },
    {
      field: "landlord avatar",
      headerName: "landlord avatar",
      width: 120,
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
            src={
              params.row.id_post.landlord.avatar.url || "../../assets/man.png"
            }
            alt="avatar user"
            width="40px"
            height="40px"
            style={{ borderRadius: "50%", objectFit: "cover" }}
          />
        </Box>
      ),
    },
    {
      field: "landlord email",
      headerName: "landlord email",
      width: 200,
      headerAlign: "center",
      cellClassName: "name-column--cell",
      valueGetter: (params) =>
        params.row.id_post.landlord ? params.row.id_post.landlord.email : "#",
    },
    {
      field: "landlord phone",
      headerName: "landlord phone",
      width: 150,
      headerAlign: "center",
      valueGetter: (params) =>
        params.row.id_post.landlord ? params.row.id_post.landlord.phone : "#",
      renderCell: (params) => (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="100%"
        >
          <span>
            {params.row.id_post.landlord
              ? params.row.id_post.landlord.phone
              : "#"}
          </span>
        </Box>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      headerAlign: "center",
      renderCell: (params) => {
        const status = params.row.status; // Giả sử `status` được lấy từ API trong row
        const statusColor = statusReportColors[status] || "#000"; // Mặc định là màu đen nếu không tìm thấy màu
        return (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="100%"
            height="100%"
            style={{
              backgroundColor: statusColor,
              color: "#fff",
              padding: "5px 10px",
              borderRadius: "5px",
              textAlign: "center",
            }}
          >
            {status || "Unknown"}
          </Box>
        );
      },
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
          <IconButton onClick={() => toggleOverlayDetail(params.row)}>
            <BiSolidDetail />
          </IconButton>
          <IconButton onClick={() => toggleOverlayProcessing(params.row)}>
            <AiOutlineDeliveredProcedure color={colors.blueAccent[600]} />
          </IconButton>
          <IconButton onClick={() => toggleOverlayResolved(params.row)}>
            <SiDavinciresolve color={colors.greenAccent[600]} />
          </IconButton>
          <IconButton onClick={() => toggleOverlayDelete(params.row)}>
            <RiDeleteBin5Fill color={colors.redAccent[600]} />
          </IconButton>
        </Box>
      ),
    },
  ];
  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Report" subtitle="Welcome to report of posts" />
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
          rows={reports}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row._id}
          checkboxSelection={false}
        />
      </Box>
      {isOpenDelete && (
        <OverlayDelete
          isOpenDelete={isOpenDelete}
          onClose={toggleOverlayDelete}
          selectedReport={selectedReport}
          refreshReports={getReports}
        ></OverlayDelete>
      )}
      {isOpenProcessing && (
        <OverlayProcessing
          isOpenProcessing={isOpenProcessing}
          onClose={toggleOverlayProcessing}
          selectedReport={selectedReport}
          refreshReports={getReports}
        ></OverlayProcessing>
      )}
      {isOpenResolved && (
        <OverlayResolved
          isOpenResolved={isOpenResolved}
          onClose={toggleOverlayResolved}
          selectedReport={selectedReport}
          refreshReports={getReports}
        ></OverlayResolved>
      )}
    </Box>
  );
};

export default Report;
