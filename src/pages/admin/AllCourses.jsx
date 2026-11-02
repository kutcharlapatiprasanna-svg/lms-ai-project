
import { useCallback, useEffect, useState } from "react";
import "./admin.css";

const API_BASE = "https://mockapi-mauve.vercel.app/api/v1/course";

const EMPTY_COURSE = {
  name: "",
  description: "",
  price: "",
  estimatedPrice: "",
  thumbnail: "",
  tags: "",
  level: "Beginner",
  demoUrl: "",
};

export default function AllCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [form, setForm] = useState(EMPTY_COURSE);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const getHeaders = () => {
    const token = localStorage.getItem("authToken");

    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const getCourseId = (course) =>
    course._id || course.id || course.courseId;

  const getThumbnail = (course) =>
    typeof course.thumbnail === "string"
      ? course.thumbnail
      : course.thumbnail?.url || course.thumbnailUrl || "";

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE}/get-all-course-dashboard`,
        { headers: getHeaders() }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || `Request failed (${response.status})`
        );
      }

      const list = Array.isArray(result)
        ? result
        : result.courses ||
          result.data?.courses ||
          result.data ||
          [];

      if (!Array.isArray(list)) {
        throw new Error("The API did not return a course list.");
      }

      setCourses(list);
    } catch (err) {
      setError(err.message || "Unable to load courses.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const openView = (course) => {
    setSelectedCourse(course);
    setEditingCourse(null);
    setMessage("");
  };

  const openEdit = (course) => {
    setSelectedCourse(null);
    setEditingCourse(course);

    setForm({
      name: course.name || course.courseName || "",
      description: course.description || "",
      price: course.price ?? "",
      estimatedPrice: course.estimatedPrice ?? "",
      thumbnail: getThumbnail(course),
      tags: Array.isArray(course.tags)
        ? course.tags.join(", ")
        : course.tags || "",
      level: course.level || "Beginner",
      demoUrl: course.demoUrl || "",
    });

    setMessage("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    const id = getCourseId(editingCourse);

    if (!id) {
      setMessage("Course ID is missing. Cannot update this course.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        estimatedPrice:
          form.estimatedPrice === ""
            ? undefined
            : Number(form.estimatedPrice),
        thumbnail: form.thumbnail.trim(),
        tags: form.tags.trim(),
        level: form.level,
        demoUrl: form.demoUrl.trim(),
      };

      const response = await fetch(
        `${API_BASE}/edit-course/${encodeURIComponent(id)}`,
        {
          method: "PUT",
          headers: getHeaders(),
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message || `Update failed (${response.status})`
        );
      }

      setMessage("Course updated successfully.");
      setEditingCourse(null);
      await fetchCourses();
    } catch (err) {
      setMessage(err.message || "Unable to update course.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (course) => {
    const id = getCourseId(course);

    if (!id) {
      setError("Course ID is missing. Cannot delete this course.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${course.name || course.courseName || "this course"}"?`
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `${API_BASE}/delete-course/${encodeURIComponent(id)}`,
        {
          method: "DELETE",
          headers: getHeaders(),
        }
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message || `Delete failed (${response.status})`
        );
      }

      setCourses((previous) =>
        previous.filter((item) => getCourseId(item) !== id)
      );

      setMessage("Course deleted successfully.");
      if (selectedCourse && getCourseId(selectedCourse) === id) {
        setSelectedCourse(null);
      }
    } catch (err) {
      setError(err.message || "Unable to delete course.");
    }
  };

  const filteredCourses = courses.filter((course) => {
    const searchableText = [
      course.name,
      course.courseName,
      course.description,
      course.level,
      course.tags,
    ]
      .map((value) =>
        Array.isArray(value) ? value.join(" ") : value || ""
      )
      .join(" ")
      .toLowerCase();

    return searchableText.includes(search.toLowerCase().trim());
  });

  const formatPrice = (price) => {
    if (price === undefined || price === null || price === "") {
      return "Price not available";
    }

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(Number(price));
  };

  return (
    <div className="all-courses-page">
      <div className="all-courses-heading">
        <div>
          <p className="all-courses-eyebrow">ADMINISTRATION</p>
          <h1>All Courses</h1>
          <p>View and manage courses on your learning platform.</p>
        </div>
        <div className="all-courses-total">
          <span>Total Courses</span>
          <strong>{courses.length}</strong>
        </div>
      </div>

      <div className="all-courses-toolbar">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search courses..."
          aria-label="Search courses"
        />

        <button
          type="button"
          className="course-refresh-btn"
          onClick={fetchCourses}
          disabled={loading}
        >
          {loading ? "Loading..." : "↻ Refresh"}
        </button>
      </div>

      {message && (
        <p className="course-status-message" role="status">
          {message}
        </p>
      )}

      {error && (
        <div className="course-error-message" role="alert">
          {error}
          <button type="button" onClick={fetchCourses}>
            Try Again
          </button>
        </div>
      )}

      {loading ? (
        <div className="course-empty-state">Loading courses...</div>
      ) : filteredCourses.length === 0 ? (
        <div className="course-empty-state">
          <h3>No courses found</h3>
          <p>Try another search or check your API response.</p>
        </div>
      ) : (
        <div className="all-courses-grid">
          {filteredCourses.map((course, index) => {
            const id = getCourseId(course);
            const thumbnail = getThumbnail(course);

            return (
              <article
                className="admin-course-card"
                key={id || index}
              >
                <div className="admin-course-image">
                  {thumbnail ? (
                    <img
                      src={thumbnail}
                      alt={course.name || "Course thumbnail"}
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <span>📚</span>
                  )}

                  <span className="admin-course-level">
                    {course.level || "General"}
                  </span>
                </div>

                <div className="admin-course-body">
                  <h2>
                    {course.name ||
                      course.courseName ||
                      "Untitled Course"}
                  </h2>

                  <p className="admin-course-description">
                    {course.description || "No description available."}
                  </p>

                  <div className="admin-course-price">
                    {formatPrice(course.price)}
                  </div>

                  <div className="admin-course-actions">
                    <button
                      type="button"
                      className="course-view-btn"
                      onClick={() => openView(course)}
                    >
                      View
                    </button>

                    <button
                      type="button"
                      className="course-edit-btn"
                      onClick={() => openEdit(course)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="course-delete-btn"
                      onClick={() => handleDelete(course)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {selectedCourse && (
        <div className="course-modal-overlay">
          <div
            className="course-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="course-view-title"
          >
            <div className="course-modal-heading">
              <h2 id="course-view-title">Course Details</h2>
              <button
                type="button"
                onClick={() => setSelectedCourse(null)}
                aria-label="Close course details"
              >
                ×
              </button>
            </div>

            {getThumbnail(selectedCourse) && (
              <img
                className="course-modal-thumbnail"
                src={getThumbnail(selectedCourse)}
                alt=""
              />
            )}

            <h3>
              {selectedCourse.name ||
                selectedCourse.courseName ||
                "Untitled Course"}
            </h3>
            <p>{selectedCourse.description || "No description"}</p>
            <p><strong>Level:</strong> {selectedCourse.level || "Not specified"}</p>
            <p><strong>Price:</strong> {formatPrice(selectedCourse.price)}</p>
            <p><strong>Tags:</strong> {
              Array.isArray(selectedCourse.tags)
                ? selectedCourse.tags.join(", ")
                : selectedCourse.tags || "None"
            }</p>
            <p><strong>Course ID:</strong> {getCourseId(selectedCourse) || "—"}</p>

            <div className="course-modal-actions">
              <button
                type="button"
                className="course-edit-btn"
                onClick={() => openEdit(selectedCourse)}
              >
                Edit Course
              </button>
              <button
                type="button"
                className="course-cancel-btn"
                onClick={() => setSelectedCourse(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {editingCourse && (
        <div className="course-modal-overlay">
          <form
            className="course-modal course-edit-form"
            onSubmit={handleUpdate}
            aria-label="Edit course form"
          >
            <div className="course-modal-heading">
              <h2>Edit Course</h2>
              <button
                type="button"
                onClick={() => setEditingCourse(null)}
                aria-label="Close edit form"
              >
                ×
              </button>
            </div>

            <label>
              Course Name
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Description
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="3"
                required
              />
            </label>

            <div className="course-edit-two-columns">
              <label>
                Price (₹)
                <input
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Estimated Price (₹)
                <input
                  name="estimatedPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.estimatedPrice}
                  onChange={handleChange}
                />
              </label>
            </div>

            <label>
              Thumbnail URL
              <input
                name="thumbnail"
                type="url"
                value={form.thumbnail}
                onChange={handleChange}
              />
            </label>

            <label>
              Tags
              <input
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="react, javascript, typescript"
              />
            </label>

            <label>
              Level
              <select
                name="level"
                value={form.level}
                onChange={handleChange}
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </label>

            <label>
              Demo URL
              <input
                name="demoUrl"
                type="url"
                value={form.demoUrl}
                onChange={handleChange}
              />
            </label>

            {message && (
              <p className="course-status-message" role="status">
                {message}
              </p>
            )}

            <div className="course-modal-actions">
              <button
                type="submit"
                className="course-edit-btn"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                className="course-cancel-btn"
                onClick={() => setEditingCourse(null)}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
