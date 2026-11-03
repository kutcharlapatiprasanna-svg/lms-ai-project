





import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import S from "./lms.module.css";

import {
  AddLmsReviewApi,
  GetCurriculumApi,
  GetLmsCourseApi,
  GetLmsReviewsApi,
  GetMyLearningApi,
  courseIdOf,
  flattenLearning,
  toList,
} from "./lmsApi";

import {
  Async,
  Empty,
  ErrorBox,
  Field,
  Loading,
  useAsync,
  useForm,
  useWishlist,
} from "./LmsShared";

import { errMsg, thumbnailUrl } from "../../../utils";
import useAuth from "../../../hooks/useAuth";
import CheckoutModal from "../CheckoutModal";

const toItems = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") return value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
  return value && typeof value === "object" ? Object.values(value) : [];
};

const itemText = (item) =>
  typeof item === "string" ? item : item?.title || item?.name || item?.description || "";

const LmsCourseDetail = () => {
  const params = useParams();

  // Supports both /courses/:id and /lms/course/:courseId
  const courseId = params.id || params.courseId;

  const { user } = useAuth();
  const navigate = useNavigate();

  const { ids: wishIds, toggle } = useWishlist();

  console.log("URL Course ID:", courseId);
  console.log("All URL Params:", params);

  const validCourseId =
    courseId &&
    courseId !== "undefined" &&
    courseId !== "null";

  const detail = useAsync(
    () =>
      validCourseId
        ? GetLmsCourseApi(courseId)
        : Promise.reject(new Error("Course ID is missing from the URL")),
    [courseId]
  );

  const curriculum = useAsync(
    () =>
      validCourseId
        ? GetCurriculumApi(courseId)
        : Promise.resolve(null),
    [courseId]
  );

  const reviews = useAsync(
    () =>
      validCourseId
        ? GetLmsReviewsApi(courseId)
        : Promise.resolve(null),
    [courseId]
  );

  const learning = useAsync(
    () =>
      user
        ? GetMyLearningApi().catch(() => null)
        : Promise.resolve(null),
    [courseId, user?._id]
  );

  const [checkout, setCheckout] = useState(false);
  const review = useForm({ rating: "5", comment: "" });
  const [posting, setPosting] = useState(false);

  if (!validCourseId) {
    return (
      <ErrorBox message="Course ID is missing. Please go back and select a course." />
    );
  }

  if (detail.loading) return <Loading />;

  if (detail.error) {
    return <ErrorBox message={detail.error} />;
  }

  const course = detail.data?.course ?? detail.data ?? {};
  const benefits = toItems(course.benefits).map(itemText).filter(Boolean);
  const prerequisites = toItems(course.prerequisites).map(itemText).filter(Boolean);

  const lectures = toList(
    curriculum.data,
    "curriculum",
    "lectures",
    "content"
  );

  const enrolledIds = new Set(
    flattenLearning(learning.data).map(courseIdOf)
  );

  const enrolled = enrolledIds.has(courseId);

  // Group lectures by section title
  const groups = lectures.reduce((acc, lecture) => {
    const key = lecture.videoSection || "Lectures";

    (acc[key] = acc[key] || []).push(lecture);

    return acc;
  }, {});

  const openLecture = (lecture) => {
    if (lecture.locked && !enrolled) {
      return toast("Enroll in this course to unlock this lecture");
    }

    navigate(
      `/lms/course/${courseId}/lecture/${lecture._id}`
    );
  };

  const startLearning = () => {
    navigate("/lms/learning");
  };

  const buy = () => {
    if (!user) {
      toast.error("Please log in to buy this course");
      return navigate("/auth/login");
    }

    setCheckout(true);
  };

  const submitReview = async (event) => {
    event.preventDefault();

    if (!review.values.comment.trim()) {
      return toast.error("Write a comment");
    }

    try {
      setPosting(true);

      await AddLmsReviewApi(courseId, {
        rating: Number(review.values.rating),
        comment: review.values.comment.trim(),
      });

      toast.success("Review added");

      review.reset();
      reviews.reload();
    } catch (error) {
      toast.error(errMsg(error, "Could not add review"));
    } finally {
      setPosting(false);
    }
  };

  return (
    <main className={S.coursePage}>
      <div className={S.detail}>
        <div className={S.detailMedia}>
          <img
            src={thumbnailUrl(course.thumbnail)}
            alt={course.name || "Course"}
          />
        </div>
        <div className={S.detailContent}>
          {course.level && (
            <span className={`${S.badge} ${S.detailLevel}`}>{course.level}</span>
          )}

          <h1>{course.name}</h1>

          <p className={S.detailDescription}>{course.description}</p>

          <div className={S.detailPrice}>
            <strong>₹{Number(course.price ?? 0).toLocaleString("en-IN")}</strong>
            {course.estimatedPrice > course.price && (
              <del>₹{Number(course.estimatedPrice).toLocaleString("en-IN")}</del>
            )}
          </div>

          <div className={S.detailMeta}>
            <span className={S.detailRating}>
              <span aria-hidden="true">★</span> {Number(course.rating || 0)}
            </span>
            <span>{Number(course.purchased || 0).toLocaleString()} students</span>
          </div>

          <div className={S.detailActions}>
            {course.demoUrl && (
              <a
                className={`${S.btn} ${S.detailDemo}`}
                href={course.demoUrl}
                target="_blank"
                rel="noreferrer"
              >
                Watch Demo
              </a>
            )}

            {enrolled ? (
              <button
                className={`${S.btn} ${S.detailPrimary}`}
                onClick={startLearning}
              >
                Start Learning
              </button>
            ) : (
              <button className={`${S.btn} ${S.detailPrimary}`} onClick={buy}>
                Buy Course
              </button>
            )}

            <button
              className={`${S.btn} ${S.btnGhost} ${S.detailWishlist}`}
              onClick={() => toggle(courseId)}
            >
              {wishIds.has(courseId) ? "❤️ In wishlist" : "♡ Add to wishlist"}
            </button>
          </div>
        </div>
      </div>

      <section className={S.courseSection}>
        <div className={S.courseSectionHeading}>
          <div>
            <h2>What You Will Learn</h2>
          </div>
        </div>
        {benefits.length ? (
          <ul className={S.courseInfoList}>
            {benefits.map((benefit, index) => (
              <li key={`${benefit}-${index}`}>{benefit}</li>
            ))}
          </ul>
        ) : (
          <p className={S.courseInfoEmpty}>No benefits added.</p>
        )}
      </section>

      <section className={S.courseSection}>
        <div className={S.courseSectionHeading}>
          <div>
            <h2>Prerequisites</h2>
          </div>
        </div>
        {prerequisites.length ? (
          <ul className={S.courseInfoList}>
            {prerequisites.map((prerequisite, index) => (
              <li key={`${prerequisite}-${index}`}>{prerequisite}</li>
            ))}
          </ul>
        ) : (
          <p className={S.courseInfoEmpty}>No prerequisites added.</p>
        )}
      </section>

      <section className={S.courseSection}>
        <div className={S.courseSectionHeading}>
          <div>
            <h2>Course Content</h2>
          </div>
          <span className={S.lessonCount}>
            {lectures.length} {lectures.length === 1 ? "lesson" : "lessons"}
          </span>
        </div>

        <Async state={curriculum}>
          {() =>
            lectures.length ? (
              Object.entries(groups).map(([section, list]) => (
                <div className={S.lectureGroup} key={section}>
                  <h3>{section}</h3>

                  {list.map((lecture, index) => (
                    <button
                      type="button"
                      key={lecture._id || index}
                      className={`${S.lectureRow} ${
                        lecture.locked && !enrolled ? S.lectureLocked : ""
                      }`}
                      onClick={() => openLecture(lecture)}
                      disabled={Boolean(lecture.locked && !enrolled)}
                    >
                      <span>
                        <span className={S.lectureIcon} aria-hidden="true">
                          {lecture.locked && !enrolled ? "▣" : "▶"}
                        </span>
                        {lecture.title}

                        {lecture.isPreview && (
                          <span
                            className={`${S.badge} ${S.badgeOk}`}
                            style={{ marginLeft: 8 }}
                          >
                            Preview
                          </span>
                        )}
                      </span>

                      {lecture.videoLength > 0 && (
                        <span className={S.muted}>
                          {lecture.videoLength} min
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              ))
            ) : (
              <Empty>No lectures yet.</Empty>
            )
          }
        </Async>
      </section>

      <section className={S.courseSection}>
        <div className={S.courseSectionHeading}>
          <div>
            <h2>Reviews</h2>
          </div>
        </div>

        <Async state={reviews}>
          {(response) => {
            const list = toList(response, "reviews");

            return list.length ? (
              list.map((item, index) => (
                <div
                  className={S.reviewCard}
                  key={item._id || index}
                >
                  <div className={S.reviewHeader}>
                    <strong>
                      {item.user?.name ||
                        item.userName ||
                        "Student"}
                    </strong>
                    <span className={S.reviewRating} aria-label={`${item.rating || 0} out of 5 stars`}>
                      {"★".repeat(Math.max(0, Math.min(5, Math.round(Number(item.rating || 0)))))}
                    </span>
                  </div>
                  <p>{item.comment || item.review}</p>
                </div>
              ))
            ) : (
              <Empty>No reviews yet.</Empty>
            );
          }}
        </Async>

        {enrolled && (
          <form
            className={`${S.panel} ${S.form} ${S.reviewForm}`}
            onSubmit={submitReview}
          >
            <h3>Share your experience</h3>

            <Field label="Rating">
              <select {...review.bind("rating")}>
                {[5, 4, 3, 2, 1].map((number) => (
                  <option key={number} value={number}>
                    {number} star{number > 1 && "s"}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Comment">
              <textarea
                {...review.bind("comment")}
                placeholder="What did you think?"
              />
            </Field>

            <button className={S.btn} disabled={posting}>
              {posting ? "Posting..." : "Submit review"}
            </button>
          </form>
        )}
      </section>

      {checkout && (
        <CheckoutModal
          course={{
            ...course,
            _id: course._id || courseId,
          }}
          onClose={() => setCheckout(false)}
          onPaid={() => {
            setCheckout(false);
            learning.reload();
            curriculum.reload();
            toast.success("Course purchased successfully");
            navigate("/lms/learning");
          }}
        />
      )}
    </main>
  );
};

export default LmsCourseDetail;
