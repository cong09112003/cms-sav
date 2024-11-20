import {
  Box,
  Button,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import SignpostIcon from "@mui/icons-material/Signpost";
import GroupIcon from "@mui/icons-material/Group";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import GeographyChart from "../../components/GeographyChart";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";
import { useEffect, useState } from "react";
import AddHomeWorkIcon from "@mui/icons-material/AddHomeWork";
import { useNavigate } from "react-router-dom";
import OutlinedFlagIcon from "@mui/icons-material/OutlinedFlag";
import axios from "axios";
import { FaStar } from "react-icons/fa";

const Dashboard = () => {
  const theme = useTheme();
  const smScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const colors = tokens(theme.palette.mode);
  const [posts, setPosts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [postTopViews, setPostTopViews] = useState([]);
  const navigate = useNavigate();
  const navigatePost = async () => {
    navigate("/post");
  };
  const navigateUser = async () => {
    navigate("/contacts");
  };
  const navigateReport = async () => {
    navigate("/reports");
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
          setPosts([]);
        }
      } catch (error) {
        setPosts([]);
      }
    } else {
      navigate("/login");
    }
  };
  const getRequests = async () => {
    const token = localStorage.getItem("sav-token");

    if (token) {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/request/getAll`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setRequests(response.data);
        } else {
          setRequests([]);
        }
      } catch (error) {
        setRequests([]);
      }
    } else {
      navigate("/login");
    }
  };
  const getUsers = async () => {
    const token = localStorage.getItem("sav-token");

    if (token) {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/auth/users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setUsers(response.data);
        } else {
          setUsers([]);
        }
      } catch (error) {
        setUsers([]);
      }
    } else {
      navigate("/login");
    }
  };
  const getReport = async () => {
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
          setReports([]);
        }
      } catch (error) {
        setReports([]);
      }
    } else {
      navigate("/login");
    }
  };
  const getPostTop = async () => {
    const token = localStorage.getItem("sav-token");

    if (token) {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/post/top-views`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          setPostTopViews(response.data);
        } else {
          setPostTopViews([]);
        }
      } catch (error) {
        setPostTopViews([]);
      }
    } else {
      navigate("/login");
    }
  };
  useEffect(() => {
    getPosts();
    getRequests();
    getUsers();
    getReport();
    getPostTop();
  }, [navigate]);
  return (
    <Box m="20px">
      <Box
        display={smScreen ? "flex" : "block"}
        flexDirection={smScreen ? "row" : "column"}
        justifyContent={smScreen ? "space-between" : "start"}
        alignItems={smScreen ? "center" : "start"}
        m="10px 0"
      >
        <Header title="SAV" subtitle="Welcome to your SAV CMS" />

        <Box>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box>
      </Box>

      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid xs={12} sm={12} md={6} lg={3} xl={3}>
          <Box
            width="100%"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
            onClick={() => {
              navigatePost();
            }}
          >
            {posts.length > 0 ? (
              <StatBox
                title={posts.length}
                subtitle="Post sent"
                progress={
                  posts.filter((post) => post.status === "Active").length /
                  posts.length
                }
                increase={`+ ${(
                  (posts.filter((post) => post.status === "Pending").length /
                    posts.length) *
                  100
                ).toFixed(1)}%`}
                icon={
                  <SignpostIcon
                    sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                  />
                }
              />
            ) : (
              <Typography color={colors.grey[100]}>
                No posts available
              </Typography>
            )}
          </Box>
        </Grid>
        <Grid xs={12} sm={12} md={6} lg={3} xl={3}>
          <Box
            width="100%"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
            onClick={() => {
              navigateUser();
            }}
          >
            {requests.length > 0 ? (
              <StatBox
                title={requests.length}
                subtitle="Requests Obtained"
                progress={
                  requests.filter((request) => request.status === "Accepted")
                    .length / requests.length
                }
                increase={`+ ${(
                  (requests.filter((request) => request.status === "Pending")
                    .length /
                    requests.length) *
                  100
                ).toFixed(1)}%`}
                icon={
                  <AddHomeWorkIcon
                    sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                  />
                }
              />
            ) : (
              <Typography color={colors.grey[100]}>
                No requests available
              </Typography>
            )}
          </Box>
        </Grid>
        <Grid xs={12} sm={12} md={6} lg={3} xl={3}>
          <Box
            width="100%"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
            onClick={() => {
              navigateUser();
            }}
          >
            {users.length > 0 ? (
              <StatBox
                title={users.length}
                subtitle="Clients join"
                progress={
                  users.filter(
                    (user) =>
                      user.user_role === "User" || user.user_role === "Renter"
                  ).length / users.length
                }
                increase={`+ ${(
                  (users.filter((user) => user.user_role === "User").length /
                    users.length) *
                  100
                ).toFixed(1)}%`}
                icon={
                  <GroupIcon
                    sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                  />
                }
              />
            ) : (
              <Typography color={colors.grey[100]}>
                No users available
              </Typography>
            )}
          </Box>
        </Grid>
        <Grid xs={12} sm={12} md={6} lg={3} xl={3}>
          <Box
            width="100%"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
            onClick={() => {
              navigateReport();
            }}
          >
            <StatBox
              title={reports.length}
              subtitle="Reports Received"
              progress={
                reports.length > 0
                  ? reports.filter((report) => report.status === "Processing")
                      .length / reports.length
                  : 0
              }
              increase={
                reports.length > 0
                  ? `+ ${(
                      (reports.filter((report) => report.status === "Pending")
                        .length /
                        reports.length) *
                      100
                    ).toFixed(1)}%`
                  : "0%"
              }
              icon={
                <OutlinedFlagIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
              }
            />
          </Box>
        </Grid>

        <Grid
          xs={12}
          sm={12}
          md={8}
          lg={8}
          container
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        >
          <Grid xs={12}>
            <Box backgroundColor={colors.primary[400]}>
              <Box
                mt="25px"
                p="0 30px"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography
                    variant="h5"
                    fontWeight="600"
                    color={colors.grey[100]}
                  >
                    Revenue Generated
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight="600"
                    color={colors.greenAccent[500]}
                  >
                    $58,373,698
                  </Typography>
                </Box>
                <Box>
                  <IconButton>
                    <DownloadOutlinedIcon
                      sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                    />
                  </IconButton>
                </Box>
              </Box>
              <Box height="250px" m="-20px 0 0 0">
                <LineChart isDashboard={true} />
              </Box>
            </Box>
          </Grid>
          <Grid xs={12} sm={12} md={6}>
            <Box backgroundColor={colors.primary[400]} p="30px">
              <Typography variant="h5" fontWeight="600">
                Campaign
              </Typography>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                mt="25px"
              >
                <ProgressCircle size="125" />
                <Typography
                  variant="h5"
                  color={colors.greenAccent[500]}
                  sx={{ mt: "15px" }}
                >
                  $48,352 revenue generated
                </Typography>
                <Typography>
                  Includes extra misc expenditures and costs
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid xs={12} sm={12} md={6}>
            <Box backgroundColor={colors.primary[400]}>
              <Typography
                variant="h5"
                fontWeight="600"
                sx={{ padding: "30px 30px 0 30px" }}
              >
                Sales Quantity
              </Typography>
              <Box height="250px" mt="-20px">
                <BarChart isDashboard={true} />
              </Box>
            </Box>
          </Grid>
          <Grid xs={12}>
            <Box backgroundColor={colors.primary[400]} padding="30px">
              <Typography
                variant="h5"
                fontWeight="600"
                sx={{ marginBottom: "15px" }}
              >
                Geography Based Traffic
              </Typography>
              <Box height="200px">
                <GeographyChart isDashboard={true} />
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Grid xs={12} sm={12} md={4} lg={4} xl={4}>
          <Box
            backgroundColor={colors.primary[400]}
            maxHeight="100vh"
            overflow="auto"
            m="25px 0 0 0"
            onClick={() => {
              navigatePost();
            }}
          >
            <Box
              display="flex"
              flexDirection="column"
              borderBottom={`4px solid ${colors.primary[500]}`}
              color={colors.grey[100]}
              p="15px"
            >
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Resent Transaction
              </Typography>
            </Box>
            {postTopViews.map((topPost, index) => (
              <Box
                key={topPost._id}
                display="grid"
                gridTemplateColumns="1fr 1fr auto"
                alignItems="center"
                borderBottom={`4px solid ${colors.primary[500]}`}
                p="15px"
                gap="10px"
              >
                {/* Chủ bài viết và Tiêu đề */}
                <Box>
                  <Typography
                    variant="h6"
                    fontWeight="600"
                    color={colors.greenAccent[100]}
                    noWrap
                    sx={{ textOverflow: "ellipsis", overflow: "hidden" }}
                  >
                    {topPost.landlord.username}
                  </Typography>
                  <Typography
                    color={colors.grey[100]}
                    variant="body2"
                    sx={{
                      display: "block",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "normal", // Cho phép xuống hàng
                      wordBreak: "break-word", // Đảm bảo từ quá dài vẫn bị ngắt
                      maxHeight: "3.6em", // Giới hạn hiển thị tối đa 2 dòng (dòng cao 1.8em)
                      lineHeight: "1.8em", // Đặt chiều cao dòng
                    }}
                  >
                    {topPost.title}
                  </Typography>
                </Box>

                {/* Giá thuê */}
                <Box
                  color={colors.grey[100]}
                  sx={{
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                >
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                    minimumFractionDigits: 0,
                  }).format(topPost.price)}
                  /month
                </Box>

                {/* Rating */}
                <Box
                  color={colors.greenAccent[500]}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  p="5px 10px"
                  borderRadius="4px"
                >
                  {topPost.averageRating}
                  <FaStar size={20} color="rgb(255, 255, 0)" />
                </Box>
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
