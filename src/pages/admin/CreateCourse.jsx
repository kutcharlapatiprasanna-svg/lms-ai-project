
import { useState } from "react";
import "./admin.css";

const CREATE_COURSE_API =
  "https://mockapi-mauve.vercel.app/api/v1/course/create-course";

const createEmptyVideo = () => ({
  title: "",
  description: "",
  videoUrl: "",
  section: "",
  length: "",
});

const initialFormData = {
  courseName: "",
  description: "",
  price: "",
  estimatedPrice: "",
  thumbnailUrl: "",
  tags: "",
  level: "",
  demoUrl: "",
};

export default function CreateCourse() {
  const [formData, setFormData] = useState(initialFormData);
  const [benefits, setBenefits] = useState([""]);
  const [prerequisites, setPrerequisites] = useState([""]);
  const [videos, setVideos] = useState([createEmptyVideo()]);
  const [thumbnailError, setThumbnailError] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setMessage("");
    setMessageType("");
  };

  const handleListChange = (setter, index, value) => {
    setter((previous) =>
      previous.map((item, i) => (i === index ? value : item))
    );
  };

  const addListItem = (setter) => {
    setter((previous) => [...previous, ""]);
  };

  const removeListItem = (setter, index) => {
    setter((previous) => previous.filter((_, i) => i !== index));
  };

  const handleVideoChange = (index, field, value) => {
    setVideos((previous) =>
      previous.map((video, i) =>
        i === index ? { ...video, [field]: value } : video
      )
    );

    setMessage("");
    setMessageType("");
  };

  const resetForm = () => {
    setFormData({ ...initialFormData });
    setBenefits([""]);
    setPrerequisites([""]);
    setVideos([createEmptyVideo()]);
    setThumbnailError(false);
    setMessage("");
    setMessageType("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setMessageType("");

    if (!formData.courseName.trim() || !formData.description.trim()) {
      setMessageType("error");
      setMessage("Please enter the course name and description.");
      return;
    }

    if (
      formData.price === "" ||
      !Number.isFinite(Number(formData.price)) ||
      Number(formData.price) < 0
    ) {
      setMessageType("error");
      setMessage("Please enter a valid course price.");
      return;
    }

    if (
      formData.estimatedPrice !== "" &&
      (!Number.isFinite(Number(formData.estimatedPrice)) ||
        Number(formData.estimatedPrice) < 0)
    ) {
      setMessageType("error");
      setMessage("Please enter a valid estimated price.");
      return;
    }

    // Convert benefits and prerequisites into the API's expected format.
    const formattedBenefits = benefits
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => ({ title: item }));

    const formattedPrerequisites = prerequisites
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => ({ title: item }));

    // Convert video form fields into the documented API format.
    const formattedCourseData = videos
      .filter((video) => video.title.trim() || video.videoUrl.trim())
      .map((video) => ({
        title: video.title.trim(),
        description: video.description.trim(),
        videoUrl: video.videoUrl.trim(),
        videoSection: video.section.trim(),
        videoLength: Number(video.length) || 0,
      }));

    const courseData = {
      name: formData.courseName.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      thumbnail: formData.thumbnailUrl.trim(),

      // API expects tags as a string, not an array.
      tags: formData.tags.trim(),

      level: formData.level,
      demoUrl: formData.demoUrl.trim(),

      // API expects arrays of objects containing title.
      benefits: formattedBenefits,
      prerequisites: formattedPrerequisites,

      // Use the documented courseData field.
      courseData: formattedCourseData,
    };

    if (formData.estimatedPrice !== "") {
      courseData.estimatedPrice = Number(formData.estimatedPrice);
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("authToken");

      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(CREATE_COURSE_API, {
        method: "POST",
        headers,
        body: JSON.stringify(courseData),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.message ||
            result?.error ||
            `Course creation failed (HTTP ${response.status}).`
        );
      }

      console.log("Create course API response:", result);

      setMessageType("success");
      setMessage(result?.message || "Course created successfully.");

      resetForm();
    } catch (error) {
      console.error("Create course error:", error);

      setMessageType("error");
      setMessage(
        error.message ||
          "Unable to create the course. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-course-page">
      <div className="create-course-page-header">
        <div>
          <a
            className="create-course-back-link"
            href="/admin/admin-dashboard/courses"
          >
            ← Back to All Courses
          </a>

          <h1>Create Course</h1>

          <p>
            Fill in the details below to create a new course on your LMS
            platform.
          </p>
        </div>

        <div className="create-course-header-icon" aria-hidden="true">
          🎓
        </div>
      </div>

      <form className="create-course-form" onSubmit={handleSubmit}>
        {/* SECTION 1: BASIC INFORMATION */}
        <section className="create-course-section">
          <div className="create-course-section-heading">
            <span className="create-course-step">1</span>

            <div>
              <h2>Basic Information</h2>
              <p>Enter the main details of your course.</p>
            </div>
          </div>

          <div className="create-course-basic-grid">
            <div className="create-course-field">
              <label htmlFor="courseName">
                Course Name <span>*</span>
              </label>

              <input
                id="courseName"
                name="courseName"
                value={formData.courseName}
                onChange={handleChange}
                placeholder="e.g. React JS Complete Course"
                required
              />
            </div>

            <div className="create-course-field">
              <label htmlFor="price">
                Price (₹) <span>*</span>
              </label>

              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g. 4999"
                required
              />
            </div>

            <div className="create-course-field">
              <label htmlFor="estimatedPrice">
                Estimated Price (₹)
              </label>

              <input
                id="estimatedPrice"
                name="estimatedPrice"
                type="number"
                min="0"
                step="0.01"
                value={formData.estimatedPrice}
                onChange={handleChange}
                placeholder="e.g. 6999"
              />
            </div>

            <div className="create-course-field create-course-description-field">
              <label htmlFor="description">
                Description <span>*</span>
              </label>

              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe what students will learn..."
                required
              />
            </div>

            <div className="create-course-field create-course-thumbnail-field">
              <label htmlFor="thumbnailUrl">
                Thumbnail URL <span>*</span>
              </label>

              <input
                id="thumbnailUrl"
                name="thumbnailUrl"
                type="url"
                value={formData.thumbnailUrl}
                onChange={(event) => {
                  handleChange(event);
                  setThumbnailError(false);
                }}
                placeholder="https://example.com/image.jpg"
                required
              />

              {formData.thumbnailUrl && (
                <div className="create-course-thumbnail-preview">
                  {thumbnailError ? (
                    <span>Image preview unavailable</span>
                  ) : (
                    <img
                      src={formData.thumbnailUrl}
                      alt="Course thumbnail preview"
                      onError={() => setThumbnailError(true)}
                    />
                  )}
                </div>
              )}
            </div>

            <div className="create-course-field">
              <label htmlFor="tags">
                Tags (comma separated) <span>*</span>
              </label>

              <input
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g. React, JavaScript, Frontend"
                required
              />
            </div>

            <div className="create-course-field">
              <label htmlFor="level">
                Level <span>*</span>
              </label>

              <select
                id="level"
                name="level"
                value={formData.level}
                onChange={handleChange}
                required
              >
                <option value="">Select level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div className="create-course-field create-course-demo-field">
              <label htmlFor="demoUrl">Demo URL</label>

              <input
                id="demoUrl"
                name="demoUrl"
                type="url"
                value={formData.demoUrl}
                onChange={handleChange}
                placeholder="https://example.com/demo"
              />
            </div>
          </div>
        </section>

        {/* SECTION 2: BENEFITS */}
        <section className="create-course-section">
          <div className="create-course-section-heading">
            <span className="create-course-step">2</span>

            <div>
              <h2>Benefits</h2>
              <p>
                Add the key benefits students will get from this course.
              </p>
            </div>
          </div>

          <div className="create-course-dynamic-list">
            {benefits.map((benefit, index) => (
              <div
                className="create-course-dynamic-row"
                key={`benefit-${index}`}
              >
                <input
                  aria-label={`Benefit ${index + 1}`}
                  value={benefit}
                  onChange={(event) =>
                    handleListChange(
                      setBenefits,
                      index,
                      event.target.value
                    )
                  }
                  placeholder="e.g. Lifetime access to course materials"
                />

                <button
                  type="button"
                  className="create-course-delete-btn"
                  onClick={() => removeListItem(setBenefits, index)}
                  aria-label={`Remove benefit ${index + 1}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="create-course-add-btn"
            onClick={() => addListItem(setBenefits)}
          >
            <span>＋</span> Add Benefit
          </button>
        </section>

        {/* SECTION 3: PREREQUISITES */}
        <section className="create-course-section">
          <div className="create-course-section-heading">
            <span className="create-course-step">3</span>

            <div>
              <h2>Prerequisites</h2>
              <p>
                Add what students should know before starting this course.
              </p>
            </div>
          </div>

          <div className="create-course-dynamic-list">
            {prerequisites.map((item, index) => (
              <div
                className="create-course-dynamic-row"
                key={`prerequisite-${index}`}
              >
                <input
                  aria-label={`Prerequisite ${index + 1}`}
                  value={item}
                  onChange={(event) =>
                    handleListChange(
                      setPrerequisites,
                      index,
                      event.target.value
                    )
                  }
                  placeholder="e.g. Basic knowledge of HTML and CSS"
                />

                <button
                  type="button"
                  className="create-course-delete-btn"
                  onClick={() =>
                    removeListItem(setPrerequisites, index)
                  }
                  aria-label={`Remove prerequisite ${index + 1}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="create-course-add-btn"
            onClick={() => addListItem(setPrerequisites)}
          >
            <span>＋</span> Add Prerequisite
          </button>
        </section>

        {/* SECTION 4: COURSE CONTENT */}
        <section className="create-course-section">
          <div className="create-course-section-heading">
            <span className="create-course-step">4</span>

            <div>
              <h2>Course Content</h2>
              <p>Add videos and organize your course structure.</p>
            </div>
          </div>

          <div className="create-course-video-list">
            {videos.map((video, index) => (
              <div
                className="create-course-video-card"
                key={`video-${index}`}
              >
                <div className="create-course-video-heading">
                  <h3>
                    <span className="create-course-play-icon">▶</span>
                    Video {index + 1}
                  </h3>

                  {videos.length > 1 && (
                    <button
                      type="button"
                      className="create-course-delete-btn"
                      onClick={() =>
                        setVideos((previous) =>
                          previous.filter((_, i) => i !== index)
                        )
                      }
                      aria-label={`Remove video ${index + 1}`}
                    >
                      ×
                    </button>
                  )}
                </div>

                <div className="create-course-video-grid">
                  <div className="create-course-field">
                    <label htmlFor={`video-title-${index}`}>
                      Video Title <span>*</span>
                    </label>

                    <input
                      id={`video-title-${index}`}
                      value={video.title}
                      onChange={(event) =>
                        handleVideoChange(
                          index,
                          "title",
                          event.target.value
                        )
                      }
                      placeholder="e.g. Introduction to React"
                      required
                    />
                  </div>

                  <div className="create-course-field">
                    <label htmlFor={`video-section-${index}`}>
                      Video Section <span>*</span>
                    </label>

                    <input
                      id={`video-section-${index}`}
                      value={video.section}
                      onChange={(event) =>
                        handleVideoChange(
                          index,
                          "section",
                          event.target.value
                        )
                      }
                      placeholder="e.g. React Fundamentals"
                      required
                    />
                  </div>

                  <div className="create-course-field">
                    <label htmlFor={`video-description-${index}`}>
                      Description <span>*</span>
                    </label>

                    <textarea
                      id={`video-description-${index}`}
                      rows={3}
                      value={video.description}
                      onChange={(event) =>
                        handleVideoChange(
                          index,
                          "description",
                          event.target.value
                        )
                      }
                      placeholder="What does this video cover?"
                      required
                    />
                  </div>

                  <div className="create-course-field">
                    <label htmlFor={`video-url-${index}`}>
                      Video URL <span>*</span>
                    </label>

                    <input
                      id={`video-url-${index}`}
                      type="url"
                      value={video.videoUrl}
                      onChange={(event) =>
                        handleVideoChange(
                          index,
                          "videoUrl",
                          event.target.value
                        )
                      }
                      placeholder="https://example.com/video"
                      required
                    />
                  </div>

                  <div className="create-course-field">
                    <label htmlFor={`video-length-${index}`}>
                      Video Length (minutes) <span>*</span>
                    </label>

                    <input
                      id={`video-length-${index}`}
                      type="number"
                      min="1"
                      value={video.length}
                      onChange={(event) =>
                        handleVideoChange(
                          index,
                          "length",
                          event.target.value
                        )
                      }
                      placeholder="e.g. 15"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="create-course-add-btn"
            onClick={() =>
              setVideos((previous) => [
                ...previous,
                createEmptyVideo(),
              ])
            }
          >
            <span>＋</span> Add Video
          </button>
        </section>

        {/* SUCCESS OR ERROR MESSAGE */}
        {message && (
          <div
            className={`create-course-message ${
              messageType === "success"
                ? "create-course-message-success"
                : "create-course-message-error"
            }`}
            role="status"
          >
            {message}
          </div>
        )}

        {/* FORM ACTIONS */}
        <div className="create-course-form-actions">
          <button
            type="button"
            className="create-course-cancel-btn"
            disabled={loading}
            onClick={resetForm}
          >
            Reset
          </button>

          <button
            type="submit"
            className="create-course-submit-btn"
            disabled={loading}
          >
            {loading ? "Creating Course..." : "Create Course"}
            {!loading && <span>→</span>}
          </button>
        </div>
      </form>
    </div>
  );
}
