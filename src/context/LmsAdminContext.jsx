import {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

import {
  getAdminAnalytics,
  getAdminCourses,
  getAdminOrders,
  getAdminEnrollments,
  getAdminInstructors,
  getAllCategories,
  getCoupons,
} from "../services/lmsAdminService";

const LmsAdminContext = createContext(null);

function extractArray(response) {
  const data = response?.data;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;

  const possibleKeys = [
    "courses",
    "orders",
    "enrollments",
    "instructors",
    "categories",
    "coupons",
    "results",
    "items",
  ];

  for (const key of possibleKeys) {
    if (Array.isArray(data?.[key])) return data[key];
    if (Array.isArray(data?.data?.[key])) return data.data[key];
  }

  return [];
}

export function LmsAdminProvider({ children }) {
  const [analytics, setAnalytics] = useState({});
  const [courses, setCourses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadAdminData = useCallback(async () => {
    setLoading(true);

    const requests = [
      ["analytics", getAdminAnalytics],
      ["courses", getAdminCourses],
      ["orders", getAdminOrders],
      ["enrollments", getAdminEnrollments],
      ["instructors", getAdminInstructors],
      ["categories", getAllCategories],
      ["coupons", getCoupons],
    ];

    const results = await Promise.allSettled(
      requests.map(([, request]) => request())
    );

    results.forEach((result, index) => {
      const key = requests[index][0];

      if (result.status !== "fulfilled") {
        console.error(`Failed to load ${key}:`, result.reason);
        return;
      }

      if (key === "analytics") {
        setAnalytics(result.value.data?.data ?? result.value.data ?? {});
        return;
      }

      const rows = extractArray(result.value);

      switch (key) {
        case "courses":
          setCourses(rows);
          break;
        case "orders":
          setOrders(rows);
          break;
        case "enrollments":
          setEnrollments(rows);
          break;
        case "instructors":
          setInstructors(rows);
          break;
        case "categories":
          setCategories(rows);
          break;
        case "coupons":
          setCoupons(rows);
          break;
        default:
          break;
      }
    });

    setLoading(false);
  }, []);

  return (
    <LmsAdminContext.Provider
      value={{
        analytics,
        courses,
        orders,
        enrollments,
        instructors,
        categories,
        coupons,
        loading,
        loadAdminData,
        setCourses,
        setCategories,
        setCoupons,
      }}
    >
      {children}
    </LmsAdminContext.Provider>
  );
}

export function useLmsAdmin() {
  const context = useContext(LmsAdminContext);

  if (!context) {
    throw new Error(
      "useLmsAdmin must be used inside LmsAdminProvider"
    );
  }

  return context;
}