import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import "./Overlay.css";
import Switch from "react-switch";
import { useNavigate } from "react-router-dom";
import { PiEyesFill } from "react-icons/pi";
import Select from "react-select";
import { Slide } from "react-slideshow-image";

export function OverlayEditPost({
  isOpenEdit,
  onClose,
  selectedPost,
  refreshPosts,
}) {
  const roomTypeLists = [
    { value: "Single", label: "Single" },
    { value: "Double", label: "Double" },
    { value: "Shared", label: "Shared" },
    { value: "Apartment", label: "Apartment" },
    { value: "Dormitory", label: "Dormitory" },
  ];
  const [renters, setRenters] = useState([]);
  const statusLists = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
    { value: "Deleted", label: "Deleted" },
    { value: "Pending", label: "Pending" },
    { value: "Locked", label: "Locked" },
  ];
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [previewImages, setPreviewImages] = useState([]);

  const handleAddImages = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map((file) => ({
      url: URL.createObjectURL(file),
      file, // Lưu file để gửi trong API
    }));

    setPreviewImages((prev) => [...prev, ...newPreviews]);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
    setIsEdit(true);
  };

  const handleDeleteImage = (index) => {
    const imageToRemove = previewImages[index];
    if (imageToRemove.file === null) {
      // Nếu ảnh cũ, loại bỏ khỏi `formData.images`
      setFormData((prev) => ({
        ...prev,
        images: prev.images.filter((img) => img.url !== imageToRemove.url),
      }));
    }
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: {
      address: "",
      city: "",
      district: "",
      ward: "",
      geoLocation: {
        type: "Point",
        coordinates: {
          x: 0,
          y: 0,
        },
      },
    },
    landlord: renters[0] && renters[0]._id ? renters[0]._id : "", //+
    roomType: roomTypeLists[0],
    size: 0,
    availability: false,
    amenities: {
      hasWifi: false,
      hasParking: false,
      hasAirConditioner: false,
      hasKitchen: false,
      hasElevator: false,
      other: [""],
    },
    additionalCosts: {
      electricity: 0,
      water: 0,
      internet: 0,
      cleaningService: 0,
      security: 0,
    },
    images: [],
    videos: [""],
    averageRating: 0,
    views: 0,
    status: statusLists[3].value,
  });

  useEffect(() => {
    if (selectedPost) {
      setFormData({
        title: selectedPost.title,
        description: selectedPost.description,
        price: selectedPost.price,
        location: {
          address: selectedPost.location.address,
          city: selectedPost.location.city,
          district: selectedPost.location.district,
          ward: selectedPost.location.ward,
          geoLocation: {
            type: "Point",
            coordinates: {
              x: selectedPost.location.geoLocation.coordinates[0],
              y: selectedPost.location.geoLocation.coordinates[1],
            },
          },
        },
        landlord: selectedPost.landlord._id, //+
        roomType: selectedPost.roomType,
        size: selectedPost.size,
        availability: selectedPost.availability,
        amenities: {
          hasWifi: selectedPost.amenities.hasWifi,
          hasParking: selectedPost.amenities.hasParking,
          hasAirConditioner: selectedPost.amenities.hasAirConditioner,
          hasKitchen: selectedPost.amenities.hasKitchen,
          hasElevator: selectedPost.amenities.hasElevator,
          other: [""],
        },
        additionalCosts: {
          electricity: selectedPost.additionalCosts.electricity,
          water: selectedPost.additionalCosts.water,
          internet: selectedPost.additionalCosts.internet,
          cleaningService: selectedPost.additionalCosts.cleaningService,
          security: selectedPost.additionalCosts.security,
        },
        images: selectedPost.images,
        videos: [],
        averageRating: 0,
        views: 0,
        status: selectedPost.status,
      });
      setPreviewImages(
        selectedPost.images.map((image) => ({
          url: image.url,
          file: null, // Để phân biệt ảnh cũ và mới
        }))
      );
    }
  }, [selectedPost]);

  useEffect(() => {
    if (isOpenEdit) getReters();
  }, [isOpenEdit]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");

    setFormData((prevData) => {
      const newData = { ...prevData };
      let tempData = newData;

      keys.forEach((key, index) => {
        if (index === keys.length - 1) {
          // Kiểm tra xem key có thuộc trường cần số hay không
          const isNumericField = ["price", "size", "availability"].includes(
            key
          );
          tempData[key] =
            isNumericField && value !== "" ? parseFloat(value) : value;
        } else {
          tempData[key] = { ...tempData[key] };
          tempData = tempData[key];
        }
      });

      return newData;
    });

    setIsEdit(true);
  };
  const handleUpdate = async () => {
    const token = localStorage.getItem("sav-token");
    if (token) {
      try {
        const formDataToSend = new FormData();
        const locationData = {
          ...formData.location,
          geoLocation: {
            ...formData.location.geoLocation,
            coordinates: [
              formData.location.geoLocation.coordinates.x,
              formData.location.geoLocation.coordinates.y,
            ],
          },
        };
        const locationJson = JSON.stringify(locationData);
        formDataToSend.append("location", locationJson);
        const amenitiesJson = JSON.stringify(formData.amenities);
        formDataToSend.append("amenities", amenitiesJson);
        const additionalCostsJson = JSON.stringify(formData.additionalCosts);
        formDataToSend.append("additionalCosts", additionalCostsJson);
        formDataToSend.append("title", formData.title);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("price", formData.price);
        formDataToSend.append("landlord", formData.landlord);
        formDataToSend.append("roomType", formData.roomType);
        formDataToSend.append("size", formData.size);
        formDataToSend.append("availability", formData.availability);
        formDataToSend.append("averageRating", formData.averageRating);
        formDataToSend.append("views", formData.views);
        formDataToSend.append("status", formData.status);
        // Truyền tất cả ảnh dưới dạng file
        previewImages.forEach((image, index) => {
          if (image.file) {
            formDataToSend.append("images", image.file);
          } else {
            // Đối với ảnh cũ, gửi lại URL (API backend phải xử lý trường hợp này)
            formDataToSend.append("existingImages", image.url);
          }
        });
        formData.videos.forEach((video, index) =>
          formDataToSend.append(`videos[${index}]`, video)
        );
        await axios.put(
          `${process.env.REACT_APP_API_URL}/api/post/${selectedPost._id}`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        alert("Cập nhập post thành công!");
        setIsEdit(false);
        refreshPosts();
        onClose();
      } catch (error) {
        console.error("Cập nhập post thất bại:", error.response?.data || error);
        alert("Cập nhậpthêm bài post.");
      }
    } else {
      navigate("/login");
    }
  };
  const getReters = async () => {
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
          const renters = response.data.filter(
            (user) => user.user_role === "Renter"
          );
          setRenters(renters);
        } else {
          alert("Không thể lấy danh sách người dùng");
        }
      } catch (error) {
        console.error("Lỗi xác thực token:", error);
        localStorage.removeItem("sav-token");
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  };
  return (
    <Fragment>
      {isOpenEdit && (
        <div className="overlay">
          <div className="overlay__background" onClick={onClose} />
          <div className="overlay__container">
            <div className="overlay__controls">
              <button
                className="overlay__close"
                type="button"
                onClick={onClose}
              />
            </div>
            <h1 style={{ color: "black" }}>Add new post</h1>
            <form className="overlay__form">
              <label>
                Title
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Description
                <input
                  type="textx"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Price (on a month)
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Size (m²)
                <input
                  type="number"
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                />
              </label>
              <h3 style={{ color: "black" }}>Location</h3>
              <label>
                *Address
                <input
                  type="text"
                  name="location.address"
                  value={formData.location.address}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                *City
                <input
                  type="text"
                  name="location.city"
                  value={formData.location.city}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                *District
                <input
                  type="text"
                  name="location.district"
                  value={formData.location.district}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                *Ward
                <input
                  type="text"
                  name="location.ward"
                  value={formData.location.ward}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                *Coordinates X
                <input
                  type="number"
                  name="location.geoLocation.coordinates.x"
                  value={formData.location.geoLocation.coordinates.x}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                *Coordinates Y
                <input
                  type="number"
                  name="location.geoLocation.coordinates.y"
                  value={formData.location.geoLocation.coordinates.y}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Landlord
                <Select
                  options={renters.map((renter) => ({
                    label: renter.username, // Hiển thị tên của renter
                    value: renter._id, // Giá trị của Select là _id
                  }))}
                  value={
                    renters.length > 0 &&
                    renters.find((renter) => renter._id === formData.landlord)
                      ? {
                          label: renters.find(
                            (renter) => renter._id === formData.landlord
                          ).username, // Hiển thị username của renter được chọn
                          value: formData.landlord, // ID của renter
                        }
                      : null // Trường hợp không có renter nào được chọn
                  }
                  onChange={(selectedOption) => {
                    setFormData((prevData) => ({
                      ...prevData,
                      landlord: selectedOption ? selectedOption.value : "", // Cập nhật _id của renter vào formData
                    }));
                    setIsEdit(true);
                  }}
                />
              </label>
              <label>
                Room Types:
                <Select
                  options={roomTypeLists}
                  name="roomType"
                  value={roomTypeLists.find(
                    (roomType) => roomType.value === formData.roomType
                  )}
                  onChange={(selectedOption) => {
                    setFormData((prev) => ({
                      ...prev,
                      roomType: selectedOption.value,
                    }));
                    setIsEdit(true);
                  }}
                />
              </label>
              <label>
                Availability:
                <Switch
                  onChange={(checked) => {
                    setFormData((prev) => ({
                      ...prev,
                      availability: checked,
                    }));
                    if (checked !== formData.availability) {
                      setIsEdit(true);
                    }
                  }}
                  checked={formData.availability}
                />
              </label>
              <h3 style={{ color: "black" }}>Amenities</h3>
              {[
                "Wifi",
                "Parking",
                "Air Conditioner",
                "Kitchen",
                "Elevator",
              ].map((amenity) => (
                <label key={amenity}>
                  {amenity}
                  <Switch
                    onChange={(checked) => {
                      setFormData((prev) => ({
                        ...prev,
                        amenities: {
                          ...prev.amenities,
                          [`has${amenity.replace(" ", "")}`]: checked, // Tạo dynamic key dựa trên tên của tiện ích
                        },
                      }));
                      if (
                        checked !==
                        formData.amenities[`has${amenity.replace(" ", "")}`]
                      ) {
                        setIsEdit(true);
                      }
                    }}
                    checked={
                      formData.amenities[`has${amenity.replace(" ", "")}`]
                    }
                  />
                </label>
              ))}
              <h3 style={{ color: "black" }}>Additional Costs</h3>
              <label>
                Electricity (on a month)
                <input
                  type="number"
                  name="additionalCosts.electricity"
                  value={formData.additionalCosts.electricity}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Water (on a month)
                <input
                  type="number"
                  name="additionalCosts.water"
                  value={formData.additionalCosts.water}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                internet (on a month)
                <input
                  type="number"
                  name="additionalCosts.internet"
                  value={formData.additionalCosts.internet}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                CleaningService (on a month)
                <input
                  type="number"
                  name="additionalCosts.cleaningService"
                  value={formData.additionalCosts.cleaningService}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Security (on a month)
                <input
                  type="number"
                  name="additionalCosts.security"
                  value={formData.additionalCosts.security}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                <h3 style={{ color: "black" }}>Images</h3>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleAddImages}
                  style={{ marginBottom: "10px" }}
                />
                <Slide autoplay={false} indicators={true}>
                  {previewImages.map((image, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={image.url}
                        alt={`Preview ${index}`}
                        style={{
                          width: "400px",
                          height: "300px",
                          objectFit: "contain",
                        }}
                      />
                      <button
                        type="button"
                        className="overlay__update-button"
                        onClick={() => handleDeleteImage(index)}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </Slide>
              </label>
              <label>
                Average Rating
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    width: "100%",
                  }}
                >
                  <input
                    type="number"
                    name="averageRating"
                    value={formData.averageRating}
                    disabled={true}
                    onChange={handleInputChange}
                    style={{
                      marginRight: "10px",
                      minWidth: "400px",
                    }}
                  />
                  <FaStar size={30} color="rgb(255, 255, 0)" />
                </div>
              </label>
              <label>
                Views
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    width: "100%",
                  }}
                >
                  <input
                    type="number"
                    name="views"
                    value={formData.views}
                    disabled={true}
                    onChange={handleInputChange}
                    style={{
                      marginRight: "10px",
                      minWidth: "400px",
                    }}
                  />
                  <PiEyesFill size={30} color="rgb(102, 51, 153)" />
                </div>
              </label>
              <label>
                Status
                <Select
                  options={statusLists}
                  name="status"
                  value={statusLists.find(
                    (status) => status.value === formData.status
                  )}
                  onChange={(selectedOption) => {
                    setFormData((prev) => ({
                      ...prev,
                      status: selectedOption.value,
                    }));
                    setIsEdit(true);
                  }}
                />
              </label>
              <button
                type="button"
                onClick={() => {
                  handleUpdate();
                }}
                disabled={!isEdit}
                className="overlay__update-button"
              >
                Accept update
              </button>
            </form>
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default OverlayEditPost;
