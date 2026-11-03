import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
//import toast from "react-hot-toast";

import S from "./lms.module.css";
//import { errMsg, thumbnailUrl } from "../utils";
import {
  DownloadCertificateApi,
  GetCertificatesApi,
  GetCurriculumApi,
  GetMyLearningApi,
  GetMyPurchasesApi,
  GetProgressAnalyticsApi,
  GetWishlistApi,
  courseIdOf,
  courseOf,
  flattenLearning,
  toList,
} from "./lmsApi";
import { Async, AutoTable, AutoView, CourseCard, Empty, Tabs, useAsync, useWishlist } from "./LmsShared";
import { errMsg, thumbnailUrl } from "../../../utils";
import toast from "react-hot-toast";

const percent = (item) => {
  const p = item.progress ?? item.progressPercentage ?? item.completionPercentage ?? 0;
  return Math.max(0, Math.min(100, Number(typeof p === "object" ? p?.percentage : p) || 0));
};

const StartCourseButton = ({ courseId, progress }) => {
  const navigate = useNavigate();
  const [starting, setStarting] = useState(false);

  const start = async () => {
    try {
      setStarting(true);
      const response = await GetCurriculumApi(courseId);
      const lessons = toList(response, "curriculum", "lectures", "content");
      const lesson = lessons.find((item) => item.locked === false) || lessons[0];

      if (!lesson?._id) {
        toast.error("This course has no lessons available yet");
        return;
      }

      navigate(`/lms/course/${courseId}/lecture/${lesson._id}`);
    } catch (error) {
      toast.error(errMsg(error, "Could not open this course"));
    } finally {
      setStarting(false);
    }
  };

  return (
    <button className={S.btn} onClick={start} disabled={starting}>
      {starting ? "Loading..." : progress > 0 ? "Continue learning" : "Start learning"}
    </button>
  );
};

const MyCourses = () => {
  const state = useAsync(GetMyLearningApi);

  return (
    <Async state={state}>
      {(res) => {
        const items = flattenLearning(res);
        if (!items.length) return <Empty>You have not enrolled in any course yet.</Empty>;

        return (
          <div className={S.grid}>
            {items.map((item) => {
              const course = courseOf(item);
              const id = courseIdOf(item);
              const pct = percent(item);

              return (
                <article className={S.card} key={id}>
                  <img src={thumbnailUrl(course.thumbnail)} alt={course.name} />
                  <div className={S.cardBody}>
                    <h3>{course.name}</h3>
                    <div className={S.progress}>
                      <div className={S.progressBar} style={{ width: `${pct}%` }} />
                    </div>
                    <span className={S.muted}>{Math.round(pct)}% complete</span>
                    <div className={S.learningCardActions}>
                      <StartCourseButton courseId={id} progress={pct} />
                      <Link className={`${S.btn} ${S.btnGhost}`} to={`/lms/course/${id}`}>
                        View course
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        );
      }}
    </Async>
  );
};

const Certificates = () => {
  const state = useAsync(GetCertificatesApi);
  const [busy, setBusy] = useState("");

  const download = async (id) => {
    try {
      setBusy(id);
      await DownloadCertificateApi(id);
    } catch (e) {
      toast.error(errMsg(e, "Download failed"));
    } finally {
      setBusy("");
    }
  };

  return (
    <Async state={state}>
      {(res) => (
        <AutoTable
          title="Certificates"
          rows={toList(res, "certificates")}
          actions={(row) => (
            <button className={`${S.btn} ${S.btnSm}`} disabled={busy === row._id} onClick={() => download(row._id)}>
              {busy === row._id ? "..." : "Download PDF"}
            </button>
          )}
        />
      )}
    </Async>
  );
};

const Wishlist = () => {
  const state = useAsync(GetWishlistApi);
  const { ids, toggle } = useWishlist();

  return (
    <Async state={state}>
      {(res) => {
        const items = toList(res, "wishlist", "courses");
        if (!items.length) return <Empty>Your wishlist is empty.</Empty>;
        return (
          <div className={S.grid}>
            {items.map((item) => {
              const id = courseIdOf(item);
              return (
                <CourseCard
                  key={id}
                  item={item}
                  wished={ids.has(id)}
                  onWish={async (cid) => {
                    await toggle(cid);
                    state.reload();
                  }}
                />
              );
            })}
          </div>
        );
      }}
    </Async>
  );
};

const TABS = [
  ["courses", "My Courses"],
  ["progress", "Progress"],
  ["certificates", "Certificates"],
  ["purchases", "Purchases"],
  ["wishlist", "Wishlist"],
];

const LmsLearning = () => {
  const [tab, setTab] = useState("courses");
  const progress = useAsync(() => (tab === "progress" ? GetProgressAnalyticsApi() : null), [tab]);
  const purchases = useAsync(() => (tab === "purchases" ? GetMyPurchasesApi() : null), [tab]);

  return (
    <>
      <Tabs tabs={TABS} value={tab} onChange={setTab} />

      {tab === "courses" && <MyCourses />}
      {tab === "certificates" && <Certificates />}
      {tab === "wishlist" && <Wishlist />}
      {tab === "progress" && <Async state={progress}>{(d) => <AutoView data={d} />}</Async>}
      {tab === "purchases" && (
        <Async state={purchases}>
          {(d) => <AutoTable title="Purchases" rows={toList(d, "purchases", "orders")} />}
        </Async>
      )}
    </>
  );
};

export default LmsLearning;
