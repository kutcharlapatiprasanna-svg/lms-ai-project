
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import "./Home.css";
import learningHero from "../../assets/learning-hero.svg";
import { CourseContext } from "../../state-mgmt/CourseContext";
import { errMsg, thumbnailUrl } from "../../utils";

const API_BASE_URL = "https://mockapi-mauve.vercel.app/api/v1";

const Home = () => {
  const { courses, loading, getPublicCourses } = useContext(CourseContext);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getPublicCourses().catch((error) => {
      toast.error(errMsg(error, "Failed to load courses"));
    });

    fetch(`${API_BASE_URL}/lms/categories`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to load categories");
        }
        return response.json();
      })
      .then((data) => {
        const categoryList = Array.isArray(data)
          ? data
          : data?.categories || data?.data?.categories || data?.data || [];

        setCategories(Array.isArray(categoryList) ? categoryList : []);
      })
      .catch(() => setCategories([]));
  }, []);

  return (
    <main className="home-page">
      {/* Hero Section */}
      <section className="home-hero">
        <div className="hero-content">
          <span className="hero-badge">
            SKILLS FOR WHAT'S NEXT
          </span>

          <h1>
            Make your next move
            <span> a big one.</span>
          </h1>

          <p>
            Build practical skills with expert-led courses and take a
            confident step toward the future you want.
          </p>

          <Link to="/courses" className="home-primary-button">
            Find Your Next Course
            <span>→</span>
          </Link>
        </div>

        <img
          className="hero-art"
          src={learningHero}
          alt="A learner building new skills at their laptop"
        />
      </section>

      {/* LMS Marketplace */}
      <section className="home-marketplace">
        <div>
          <span className="section-label">DISCOVER MORE</span>
          <h2>LMS Marketplace</h2>
          <p>
            Browse published courses, wishlist favourites, watch lectures
            with saved progress and earn certificates. Instructors can
            publish courses; admins manage the marketplace.
          </p>
        </div>

        <Link to="/lms" className="home-secondary-button">
          Open LMS Marketplace →
        </Link>
      </section>

      

      {/* Featured Courses */}
      <section className="home-section">
        <div className="home-section-heading">
          <div>
            <span className="section-label">HANDPICKED FOR YOU</span>
            <h2>Featured Courses</h2>
            <p className="section-description">
              Explore courses and take the next step in your learning journey.
            </p>
          </div>

          <Link to="/courses" className="home-text-link">
            Browse all →
          </Link>
        </div>

        {loading ? (
          <p className="home-status">Loading courses...</p>
        ) : courses.length === 0 ? (
          <p className="home-status">
            No featured courses available right now.
          </p>
        ) : (
          <div className="home-course-grid">
            {courses.slice(0, 6).map((course) => (
              <article className="home-course-card" key={course._id}>
                <Link
                  to={`/courses/${course._id}`}
                  className="course-image-link"
                >
                  <img
                    src={thumbnailUrl(course.thumbnail)}
                    alt={course.name}
                    className="home-course-image"
                  />
                </Link>

                <div className="home-course-content">
                  <span className="course-level">
                    {course.level || "All Levels"}
                  </span>

                  <h3>{course.name}</h3>

                  <div className="course-card-footer">
                    <strong>
                      ₹{Number(course.price || 0).toLocaleString("en-IN")}
                    </strong>

                    <Link
                      to={`/courses/${course._id}`}
                      className="course-view-link"
                    >
                      View Course →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* FAQ */}
      <section className="home-faq">
        <span className="section-label">GOT QUESTIONS?</span>
        <h2>Frequently Asked Questions</h2>

        <details>
          <summary>What is jQuery?</summary>
          <p>
            jQuery is a JavaScript library that simplifies common DOM
            manipulation and event-handling tasks.
          </p>
        </details>

        <details>
          <summary>What is AJAX?</summary>
          <p>
            AJAX allows a web page to exchange data with a server without
            reloading the entire page.
          </p>
        </details>
      </section>
    </main>
  );
};

export default Home;
