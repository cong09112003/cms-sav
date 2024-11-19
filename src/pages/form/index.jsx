// import React, { useEffect, useState } from "react";
// import { Box, Button, TextField } from "@mui/material";
// import { Formik } from "formik";
// import * as yup from "yup";
// import { useMediaQuery } from "@mui/material";
// import Header from "../../components/Header";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const Form = () => {
//   const isNonMobile = useMediaQuery("(min-width:600px)");
//   const navigate = useNavigate();
//   const [isOpenCreate, setIsCreate] = useState(false);

//   const [formData, setFormData] = useState({
//     _id: "",
//     username: "",
//     email: "",
//     user_role: "",
//     phone: "",
//     address: "",
//     isOnline: "",
//     avatar: "",
//     password: "",
//   });

//   const phoneRegExp = /^[0-9]+$/;

//   const getProfile = async () => {
//     const token = localStorage.getItem("sav-token");
//     if (token) {
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API_URL}/api/auth/me`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         if (response.status === 200) {
//           const data = response.data;
//           setFormData({
//             _id: data._id,
//             username: data.username,
//             email: data.email,
//             user_role: data.user_role,
//             phone: data.phone,
//             address: data.address,
//             isOnline: data.isOnline,
//             avatar: data.avatar,
//           });
//         } else {
//           alert("Không thể lấy thông tin profile.");
//         }
//       } catch (error) {
//         console.error("Token validation failed:", error);
//         localStorage.removeItem("sav-token");
//         navigate("/login");
//       }
//     } else {
//       navigate("/login");
//     }
//   };

//   const handleUpdate = async (values) => {
//     const token = localStorage.getItem("sav-token");
//     if (token) {
//       try {
//         await axios.put(
//           `${process.env.REACT_APP_API_URL}/api/auth/update/${formData._id}`,
//           values,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         alert("Cập nhật thông tin thành công!");
//         getProfile();
//       } catch (error) {
//         console.error("Cập nhật thất bại:", error);
//         alert("Không thể cập nhật thông tin.");
//       }
//     } else {
//       navigate("/login");
//     }
//   };

//   useEffect(() => {
//     getProfile();
//   }, []);

//   const validationSchema = yup.object().shape({
//     phone: yup.string().matches(phoneRegExp, "Số điện thoại không hợp lệ"),
//     email: yup.string().email("Email không hợp lệ").required("Email bắt buộc"),
//     username: yup.string().required("Tên người dùng bắt buộc"),
//     address: yup.string().required("Địa chỉ bắt buộc"),
//     password: yup
//       .string()
//       .min(6, "Mật khẩu phải ít nhất 6 ký tự")
//       .when("confirmPassword", {
//         is: (confirmPassword) => confirmPassword && confirmPassword.length > 0,
//         then: yup.string().required("Vui lòng nhập mật khẩu mới"),
//       }),
//     confirmPassword: yup
//       .string()
//       .oneOf([yup.ref("password"), null], "Mật khẩu không khớp"),
//   });

//   return (
//     <Box m="20px">
//       <Header title="USER PROFILE" subtitle="View and Update Profile" />

//       <Formik
//         enableReinitialize
//         initialValues={formData}
//         validationSchema={validationSchema}
//         onSubmit={handleUpdate}
//       >
//         {({
//           values,
//           errors,
//           touched,
//           handleBlur,
//           handleChange,
//           handleSubmit,
//         }) => (
//           <form onSubmit={handleSubmit}>
//             <Box
//               display="flex"
//               flexDirection="column"
//               alignItems="center"
//               mb={3}
//             >
//               {/* Circular Profile Image */}
//               <Box
//                 component="img"
//                 src={
//                   values.avatar.url ||
//                   "https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg"
//                 }
//                 onError={(e) =>
//                   (e.target.src =
//                     "https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg")
//                 }
//                 alt="Profile Avatar"
//                 sx={{
//                   width: "300px",
//                   height: "300px",
//                   borderRadius: "50%",
//                   objectFit: "cover",
//                   marginBottom: "20px",
//                 }}
//               />
//               {/* Avatar URL Input */}
//               <TextField
//                 fullWidth
//                 variant="filled"
//                 label="Avatar URL"
//                 onBlur={handleBlur}
//                 onChange={(e) => {
//                   handleChange(e);
//                   setFormData({ ...formData, avatar: e.target.value });
//                 }}
//                 value={values.avatar.url}
//                 name="avatar"
//                 sx={{ gridColumn: "span 4" }}
//               />
//             </Box>

//             <Box
//               display="grid"
//               gap="30px"
//               gridTemplateColumns="repeat(4, minmax(0, 1fr))"
//               sx={{
//                 "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
//               }}
//             >
//               <TextField
//                 fullWidth
//                 variant="filled"
//                 type="text"
//                 label="Username"
//                 onBlur={handleBlur}
//                 onChange={(e) => {
//                   handleChange(e);
//                   setFormData({ ...formData, username: e.target.value });
//                 }}
//                 value={values.username}
//                 name="username"
//                 error={!!touched.username && !!errors.username}
//                 helperText={touched.username && errors.username}
//                 sx={{ gridColumn: "span 4" }}
//               />
//               <TextField
//                 fullWidth
//                 variant="filled"
//                 type="email"
//                 label="Email"
//                 onBlur={handleBlur}
//                 onChange={(e) => {
//                   handleChange(e);
//                   setFormData({ ...formData, email: e.target.value });
//                 }}
//                 value={values.email}
//                 name="email"
//                 error={!!touched.email && !!errors.email}
//                 helperText={touched.email && errors.email}
//                 sx={{ gridColumn: "span 4" }}
//               />
//               <TextField
//                 fullWidth
//                 variant="filled"
//                 type="text"
//                 label="Phone"
//                 onBlur={handleBlur}
//                 onChange={(e) => {
//                   handleChange(e);
//                   setFormData({ ...formData, phone: e.target.value });
//                 }}
//                 value={values.phone}
//                 name="phone"
//                 error={!!touched.phone && !!errors.phone}
//                 helperText={touched.phone && errors.phone}
//                 sx={{ gridColumn: "span 4" }}
//               />
//               <TextField
//                 fullWidth
//                 variant="filled"
//                 type="text"
//                 label="Address"
//                 onBlur={handleBlur}
//                 onChange={(e) => {
//                   handleChange(e);
//                   setFormData({ ...formData, address: e.target.value });
//                 }}
//                 value={values.address}
//                 name="address"
//                 error={!!touched.address && !!errors.address}
//                 helperText={touched.address && errors.address}
//                 sx={{ gridColumn: "span 4" }}
//               />
//               <TextField
//                 fullWidth
//                 variant="filled"
//                 type="password"
//                 label="New Password"
//                 onBlur={handleBlur}
//                 onChange={handleChange}
//                 value={values.password}
//                 name="password"
//                 error={!!touched.password && !!errors.password}
//                 helperText={touched.password && errors.password}
//                 sx={{ gridColumn: "span 4" }}
//               />
//               <TextField
//                 fullWidth
//                 variant="filled"
//                 type="password"
//                 label="Confirm Password"
//                 onBlur={handleBlur}
//                 onChange={handleChange}
//                 value={values.confirmPassword}
//                 name="confirmPassword"
//                 error={!!touched.confirmPassword && !!errors.confirmPassword}
//                 helperText={touched.confirmPassword && errors.confirmPassword}
//                 sx={{ gridColumn: "span 4" }}
//               />
//             </Box>
//             <Box display="flex" justifyContent="end" mt="20px">
//               <Button type="submit" color="secondary" variant="contained">
//                 Update Profile
//               </Button>
//             </Box>
//           </form>
//         )}
//       </Formik>
//     </Box>
//   );
// };

// export default Form;

import React, { useEffect, useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useMediaQuery } from "@mui/material";
import Header from "../../components/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Form = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    _id: "",
    username: "",
    email: "",
    user_role: "",
    phone: "",
    address: "",
    isOnline: "",
    avatar: "",
    password: "",
  });
  const [avatarFile, setAvatarFile] = useState(null); // Để lưu file ảnh mới upload

  const phoneRegExp = /^[0-9]+$/;

  const getProfile = async () => {
    const token = localStorage.getItem("sav-token");
    if (token) {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          const data = response.data;
          setFormData({
            _id: data._id,
            username: data.username,
            email: data.email,
            user_role: data.user_role,
            phone: data.phone,
            address: data.address,
            isOnline: data.isOnline,
            avatar: data.avatar,
          });
        } else {
          alert("Không thể lấy thông tin profile.");
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

  const handleUpdate = async (values) => {
    const token = localStorage.getItem("sav-token");
    if (token) {
      try {
        const formDataToSend = new FormData();
        formDataToSend.append("username", values.username);
        formDataToSend.append("email", values.email);
        formDataToSend.append("phone", values.phone);
        formDataToSend.append("address", values.address);
        if (avatarFile) {
          formDataToSend.append("avatar", avatarFile); // Thêm file ảnh
        }
        if (values.password) {
          formDataToSend.append("password", values.password);
        }

        await axios.put(
          `${process.env.REACT_APP_API_URL}/api/auth/users/${formData._id}`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        alert("Cập nhật thông tin thành công!");
        getProfile();
      } catch (error) {
        console.error("Cập nhật thất bại:", error);
        alert("Không thể cập nhật thông tin.");
      }
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const validationSchema = yup.object().shape({
    phone: yup.string().matches(phoneRegExp, "Số điện thoại không hợp lệ"),
    email: yup.string().email("Email không hợp lệ").required("Email bắt buộc"),
    username: yup.string().required("Tên người dùng bắt buộc"),
    address: yup.string().required("Địa chỉ bắt buộc"),
    password: yup
      .string()
      .min(6, "Mật khẩu phải ít nhất 6 ký tự")
      .when("confirmPassword", {
        is: (confirmPassword) => confirmPassword && confirmPassword.length > 0,
        then: yup.string().required("Vui lòng nhập mật khẩu mới"),
      }),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Mật khẩu không khớp"),
  });

  return (
    <Box m="20px">
      <Header title="USER PROFILE" subtitle="View and Update Profile" />

      <Formik
        enableReinitialize
        initialValues={formData}
        validationSchema={validationSchema}
        onSubmit={handleUpdate}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              mb={3}
            >
              {/* Circular Profile Image */}
              <Box
                component="img"
                src={
                  avatarFile
                    ? URL.createObjectURL(avatarFile)
                    : values.avatar.url ||
                      "https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg"
                }
                alt="Profile Avatar"
                sx={{
                  width: "300px",
                  height: "300px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginBottom: "20px",
                }}
              />
              {/* Upload Avatar */}
              <Button
                variant="contained"
                component="label"
                sx={{ marginBottom: "20px" }}
              >
                Upload Avatar
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => setAvatarFile(e.target.files[0])}
                />
              </Button>
            </Box>

            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Username"
                onBlur={handleBlur}
                onChange={(e) => {
                  handleChange(e);
                  setFormData({ ...formData, username: e.target.value });
                }}
                value={values.username}
                name="username"
                error={!!touched.username && !!errors.username}
                helperText={touched.username && errors.username}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="email"
                label="Email"
                onBlur={handleBlur}
                onChange={(e) => {
                  handleChange(e);
                  setFormData({ ...formData, email: e.target.value });
                }}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Phone"
                onBlur={handleBlur}
                onChange={(e) => {
                  handleChange(e);
                  setFormData({ ...formData, phone: e.target.value });
                }}
                value={values.phone}
                name="phone"
                error={!!touched.phone && !!errors.phone}
                helperText={touched.phone && errors.phone}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Address"
                onBlur={handleBlur}
                onChange={(e) => {
                  handleChange(e);
                  setFormData({ ...formData, address: e.target.value });
                }}
                value={values.address}
                name="address"
                error={!!touched.address && !!errors.address}
                helperText={touched.address && errors.address}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="password"
                label="New Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={!!touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="password"
                label="Confirm Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.confirmPassword}
                name="confirmPassword"
                error={!!touched.confirmPassword && !!errors.confirmPassword}
                helperText={touched.confirmPassword && errors.confirmPassword}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Update Profile
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default Form;
