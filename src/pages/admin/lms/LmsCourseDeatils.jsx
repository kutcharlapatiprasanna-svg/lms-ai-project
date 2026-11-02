





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

  const lectures = toList(
    curriculum.data,
    "curriculum",
    "lectures",
    "content"
  );

  const enrolledIds = new Set(
    flattenLearning(learning.data).map(courseIdOf)
  );

  const enrolled =
    enrolledIds.has(courseId) ||
    lectures.some(
      (lecture) =>
        lecture.locked === false && !lecture.isPreview
    );

  // Group lectures by section title
  const groups = lectures.reduce((acc, lecture) => {
    const key = lecture.videoSection || "Lectures";

    (acc[key] = acc[key] || []).push(lecture);

    return acc;
  }, {});

  const openLecture = (lecture) => {
    if (lecture.locked) {
      return toast("Enroll in this course to unlock this lecture");
    }

    navigate(
      `/lms/course/${courseId}/lecture/${lecture._id}`
    );
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
    <>
      <div className={S.detail}>
        <img
          src={thumbnailUrl(course.thumbnail)}
          alt={course.name || "Course"}
        />

        <div>
          {course.level && (
            <span className={S.badge}>{course.level}</span>
          )}

          <h1>{course.name}</h1>

          <p>{course.description}</p>

          <p>
            ⭐ {course.rating || 0} · {course.purchased || 0} students
          </p>

          <p className={S.price} style={{ fontSize: 24 }}>
            ₹{course.price ?? 0}

            {course.estimatedPrice > 0 && (
              <del>₹{course.estimatedPrice}</del>
            )}
          </p>

          <div className={S.actions}>
            {enrolled ? (
              <button
                className={S.btn}
                onClick={() => navigate("/lms/learning")}
              >
                Go to My Learning
              </button>
            ) : (
              <button className={S.btn} onClick={buy}>
                Buy course
              </button>
            )}

            <button
              className={`${S.btn} ${S.btnGhost}`}
              onClick={() => toggle(courseId)}
            >
              {wishIds.has(courseId)
                ? "❤️ In wishlist"
                : "🤍 Add to wishlist"}
            </button>

            {course.demoUrl && (
              <a
                className={`${S.btn} ${S.btnGhost}`}
                href={course.demoUrl}
                target="_blank"
                rel="noreferrer"
              >
                Watch demo
              </a>
            )}
          </div>

          {course.benefits?.length > 0 && (
            <>
              <h3 style={{ margin: "16px 0 6px" }}>
                What you will learn
              </h3>

              <ul>
                {course.benefits.map((benefit, index) => (
                  <li key={benefit._id || index}>
                    ✓ {benefit.title}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      <section className={S.section}>
        <h2>Curriculum</h2>

        <Async state={curriculum}>
          {() =>
            lectures.length ? (
              Object.entries(groups).map(([section, list]) => (
                <div className={S.lectureGroup} key={section}>
                  <h3>{section}</h3>

                  {list.map((lecture, index) => (
                    <div
                      key={lecture._id || index}
                      className={`${S.lectureRow} ${
                        lecture.locked ? S.lectureLocked : ""
                      }`}
                      onClick={() => openLecture(lecture)}
                    >
                      <span>
                        {lecture.locked ? "🔒" : "▶️"}{" "}
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
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <Empty>No lectures yet.</Empty>
            )
          }
        </Async>
      </section>

      <section className={S.section}>
        <h2>Reviews</h2>

        <Async state={reviews}>
          {(response) => {
            const list = toList(response, "reviews");

            return list.length ? (
              list.map((item, index) => (
                <div
                  className={S.reviewCard}
                  key={item._id || index}
                >
                  <strong>
                    {item.user?.name ||
                      item.userName ||
                      "Student"}
                  </strong>{" "}

                  {"⭐".repeat(
                    Math.round(Number(item.rating || 0))
                  )}

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
            className={`${S.panel} ${S.form}`}
            onSubmit={submitReview}
            style={{ marginTop: 16 }}
          >
            <h3>Add your review</h3>

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
            toast.success("Course purchased successfully");
            navigate("/lms/learning");
          }}
        />
      )}
    </>
  );
};

export default LmsCourseDetail;
