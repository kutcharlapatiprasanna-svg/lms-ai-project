import { useContext, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import "./Course.css";
import coursesHero from "../../assets/courses-hero.svg";
import { CourseContext } from "../../state-mgmt/CourseContext";
import { tagsToString, thumbnailUrl } from "../../utils";
import Spinner from "../../Spinner";

const getId = (course) => course._id || course.id || course.courseId;

// category can be a plain string or a populated { name } object
const getCategory = (course) =>
  (course.category && typeof course.category === "object"
    ? course.category.name
    : course.category) || "";

export default function Course() {
  const { courses = [], loading, getPublicCourses } = useContext(CourseContext);
  const [searchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // load courses when the page opens
  useEffect(() => {
    if (typeof getPublicCourses !== "function") return;

    getPublicCourses().catch((error) => {
      console.error("Failed to load courses:", error);
      toast.error("Unable to load courses");
    });
  }, [getPublicCourses]);

  // ?search=react in the URL fills the search box
  useEffect(() => {
    const search = searchParams.get("search");
    if (search) setSearchTerm(search);
  }, [searchParams]);

  const publishedCourses = useMemo(
    () => courses.filter((c) => String(c.status || "").toUpperCase() === "PUBLISHED"),
    [courses],
  );

  const categories = useMemo(
    () => ["All", ...new Set(publishedCourses.map(getCategory).filter(Boolean))],
    [publishedCourses],
  );

  const filteredCourses = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return publishedCourses.filter((course) => {
      const haystack = `${course.name || ""} ${course.description || ""} ${tagsToString(course.tags)}`.toLowerCase();

      return (
        haystack.includes(term) &&
        (selectedLevel === "All" || course.level === selectedLevel) &&
        (selectedCategory === "All" || getCategory(course) === selectedCategory)
      );
    });
  }, [publishedCourses, searchTerm, selectedLevel, selectedCategory]);

  if (loading) return <Spinner />;

  return (
    <div className="courses-page">
      {/* 1. HERO */}
      <section className="courses-hero">
        <div className="courses-hero-content">
          <span className="courses-hero-label">LEARN WITHOUT LIMITS</span>
          <h1>
            Explore Our <span>Courses</span>
          </h1>
          <p>Discover courses, improve your skills, and build your future with expert-led learning.</p>
        </div>
        <img
          className="courses-hero-image"
          src={coursesHero}
          alt="Open books and a course card ready to explore"
        />
      </section>

      {/* 2. SEARCH + FILTERS */}
      <section className="courses-toolbar">
        <input
          type="search"
          className="courses-search"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)}>
          <option value="All">All Levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>

        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category === "All" ? "All Categories" : category}
            </option>
          ))}
        </select>
      </section>

      {/* 3. RESULTS */}
      <section className="courses-results">
        <div className="courses-results-head">
          <h2>Available Courses</h2>
          <span>{filteredCourses.length} courses found</span>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="courses-empty">
            <h3>No courses found</h3>
            <p>Try changing your search or filters.</p>
          </div>
        ) : (
          <div className="courses-grid">
            {filteredCourses.map((course, index) => {
              const id = getId(course);
              const to = id ? `/courses/${id}` : "/courses";
              const image = thumbnailUrl(course.thumbnail);
              const category = getCategory(course);
              const title = course.name || "Untitled Course";

              return (
                <article className="courses-card" key={id || index}>
                  <Link to={to} className="courses-card-image" aria-label={title}>
                    <span className="courses-card-initial">{title.charAt(0)}</span>
                    {image && (
                      <img
                        src={image}
                        alt={title}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    )}
                  </Link>

                  <div className="courses-card-body">
                    <div className="courses-card-tags">
                      <span className="courses-level">{course.level || "Beginner"}</span>
                      {category && <span className="courses-category">{category}</span>}
                    </div>

                    <h3>{title}</h3>

                    <div className="courses-card-footer">
                      <strong>₹{Number(course.price ?? 0).toLocaleString("en-IN")}</strong>
                      <Link to={to} className="courses-view-link">
                        View Course →
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}