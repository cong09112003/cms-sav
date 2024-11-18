import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";
import "./Overlay.css";
import Switch from "react-switch";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import { FaStar } from "react-icons/fa";
import { PiEyesFill } from "react-icons/pi";

export function OverlayAddPost({ isOpenAdd, onClose, refreshPosts }) {
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
    status: statusLists[3],
  });
  const navigate = useNavigate();
  const [isAdd, setIsAdd] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");

  useEffect(() => {
    if (isOpenAdd) getReters();
  }, [isOpenAdd]);

  const handleAddImage = () => {
    if (newImageUrl) {
      setFormData((prevData) => {
        const updatedImages = [...prevData.images];
        updatedImages.push(newImageUrl);
        return {
          ...prevData,
          images: updatedImages,
        };
      });
      setNewImageUrl("");
      setIsAdd(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");

    setFormData((prevData) => {
      const newData = { ...prevData };
      let tempData = newData;
      keys.forEach((key, index) => {
        if (index === keys.length - 1) {
          tempData[key] = isNaN(value) ? value : parseFloat(value);
        } else {
          tempData[key] = { ...tempData[key] };
          tempData = tempData[key];
        }
      });

      return newData;
    });

    setIsAdd(true);
  };

  const handleEditImage = (index, newUrl) => {
    setFormData((prevData) => {
      const updatedImages = [...prevData.images];
      updatedImages[index] = newUrl;
      return {
        ...prevData,
        images: updatedImages,
      };
    });
  };

  const handleDeleteImage = (index) => {
    setFormData((prevData) => {
      const updatedImages = prevData.images.filter((_, i) => i !== index);
      return {
        ...prevData,
        images: updatedImages,
      };
    });
  };

  const handleAdd = async () => {
    const token = localStorage.getItem("sav-token");
    if (token) {
      try {
        const requestBody = {
          title: formData.title,
          description: formData.description,
          price: formData.price,
          location: {
            address: formData.location.address,
            city: formData.location.city,
            district: formData.location.district,
            ward: formData.location.ward,
            geoLocation: {
              type: "Point",
              coordinates: [
                formData.location.geoLocation.coordinates.x,
                formData.location.geoLocation.coordinates.y,
              ],
            },
          },
          landlord: formData.landlord,
          roomType: formData.roomType,
          size: formData.size,
          availability: formData.availability,
          amenities: {
            hasWifi: formData.amenities.hasWifi,
            hasParking: formData.amenities.hasParking,
            hasAirConditioner: formData.amenities.hasAirConditioner,
            hasKitchen: formData.amenities.hasKitchen,
            hasElevator: formData.amenities.hasElevator,
            other: formData.other,
          },
          additionalCosts: {
            electricity: formData.additionalCosts.electricity,
            water: formData.additionalCosts.water,
            internet: formData.additionalCosts.internet,
            cleaningService: formData.additionalCosts.cleaningService,
            security: formData.additionalCosts.security,
          },
          images: formData.images,
          videos: formData.videos,
          averageRating: formData.averageRating,
          views: formData.views,
          status: formData.status,
        };
        await axios.post(
          `${process.env.REACT_APP_API_URL}/api/post/create`,
          requestBody,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("Thêm bài post thành công!");
        setIsAdd(false);
        refreshPosts();
        onClose();
      } catch (error) {
        console.error("Thêm bài post thất bại:", error);
        alert("Không thể thêm bài post.");
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
      {isOpenAdd && (
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
                  type="text"
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
                    setIsAdd(true);
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
                    setIsAdd(true);
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
                      setIsAdd(true);
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
                        setIsAdd(true);
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
                <Slide
                  autoplay={false} // Tắt chế độ tự động chuyển slide
                  canSwipe={true} // Cho phép vuốt qua các ảnh
                  indicators={true} // Hiển thị chỉ báo (dots)
                >
                  {formData.images.map((image, index) => (
                    <div
                      className="each-slide"
                      key={index} // Đảm bảo key duy nhất cho mỗi slide
                      style={{
                        width: "700px",
                        height: "700px",
                        overflow: "hidden",
                        display: "flex",
                        justifyContent: "center", // Căn giữa theo chiều ngang
                        alignItems: "center", // Căn giữa theo chiều dọc
                        flexDirection: "column",
                      }}
                    >
                      <img
                        src={image}
                        alt={`${index}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                      />
                      <div
                        style={{
                          flexDirection: "row",
                          paddingTop: "10px",
                          paddingBottom: "50px",
                        }}
                      >
                        <input
                          type="text"
                          placeholder="Edit image URL"
                          onChange={(e) =>
                            handleEditImage(index, e.target.value)
                          }
                          style={{ minWidth: "400px" }}
                          value={formData.images[index]}
                        />
                        <button
                          type="button"
                          className="overlay__update-button"
                          onClick={() => handleDeleteImage(index)}
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  ))}
                </Slide>
                <div>
                  <input
                    type="text"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)} // Cập nhật giá trị input
                    placeholder="Enter image URL"
                    style={{ minWidth: "400px" }}
                  />
                  <button
                    type="button"
                    className="overlay__update-button"
                    onClick={handleAddImage} // Thêm ảnh vào mảng images
                  >
                    Add Image
                  </button>
                </div>
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
                    setIsAdd(true);
                  }}
                />
              </label>
              <button
                type="button"
                onClick={() => {
                  handleAdd();
                }}
                disabled={!isAdd}
                className="overlay__update-button"
              >
                Create a new
              </button>
            </form>
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default OverlayAddPost;
