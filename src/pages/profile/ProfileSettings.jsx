
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import { updateMyProfile } from "../../services/profileService";

import "./ProfileSettings.css";

const DEFAULT_PROFILE_IMAGE =
  "https://i.pravatar.cc/150?img=47";

export default function ProfileSettings() {
  const { user, updateUser } = useAuth();

  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");

  const [selectedImage, setSelectedImage] = useState(null);

  const [previewImage, setPreviewImage] = useState(
    user?.profilePicture ||
      user?.avatar ||
      user?.image ||
      DEFAULT_PROFILE_IMAGE
  );

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // CLEAN UP PREVIEW IMAGE URL
  useEffect(() => {
    return () => {
      if (previewImage?.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  // SELECT IMAGE FROM COMPUTER
  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");
    setMessage("");

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5 MB.");
      event.target.value = "";
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    setSelectedImage(file);
    setPreviewImage(imageUrl);
  };

  // SAVE PROFILE
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", name.trim());

      if (selectedImage) {
        formData.append(
          "profilePicture",
          selectedImage
        );
      }

      const response = await updateMyProfile(formData);

      // Map this according to your actual backend response.
      const updatedUser =
        response?.user ||
        response?.data?.user ||
        response?.data ||
        {};

      const finalUser = {
        ...updatedUser,
        name: updatedUser.name || name.trim(),
      };

      updateUser(finalUser);

      // Use the server-returned image if available.
      const returnedImage =
        finalUser.profilePicture ||
        finalUser.avatar ||
        finalUser.image;

      if (returnedImage) {
        setPreviewImage(returnedImage);
      }

      setSelectedImage(null);

      setMessage(
        response?.message ||
        "Profile updated successfully."
      );

    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Unable to update profile."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-settings-page">

      <div className="profile-settings-card">

        {/* PAGE HEADER */}

        <div className="profile-settings-header">
          <h2>Profile Settings</h2>

          <p>
            Update your account information and profile photo.
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          {/* PROFILE IMAGE */}

          <div className="profile-image-section">

            <img
              src={previewImage}
              alt="Profile"
              className="profile-settings-avatar"
              onError={(event) => {
                event.currentTarget.src =
                  DEFAULT_PROFILE_IMAGE;
              }}
            />

            <div className="profile-image-controls">

              <label
                htmlFor="profile-image-upload"
                className="upload-image-button"
              >
                Choose Profile Image
              </label>

              <input
                id="profile-image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                hidden
              />

              <small>
                PNG, JPG or JPEG. Maximum size: 5 MB.
              </small>

            </div>
          </div>

          {/* NAME */}

          <div className="profile-form-group">

            <label htmlFor="profile-name">
              Full Name
            </label>

            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="Enter your name"
              required
            />

          </div>

          {/* EMAIL */}

          <div className="profile-form-group">

            <label htmlFor="profile-email">
              Email Address
            </label>

            <input
              id="profile-email"
              type="email"
              value={user?.email || ""}
              readOnly
            />

          </div>

          {/* ROLE */}

          <div className="profile-form-group">

            <label htmlFor="profile-role">
              Account Role
            </label>

            <input
              id="profile-role"
              type="text"
              value={user?.role || "User"}
              readOnly
            />

          </div>

          {/* ERROR MESSAGE */}

          {error && (
            <p className="profile-error">
              {error}
            </p>
          )}

          {/* SUCCESS MESSAGE */}

          {message && (
            <p className="profile-success">
              {message}
            </p>
          )}

          {/* ACTION BUTTONS */}

          <div className="profile-settings-actions">

            <button
              type="button"
              className="profile-cancel-button"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="profile-save-button"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}
