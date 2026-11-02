
import { useEffect, useState } from "react";
import {
  getLayout,
  createLayout,
  updateLayout,
} from "../../services/layoutService";
import "./SiteLayout.css";

function SiteLayout() {
  const [activeTab, setActiveTab] = useState("banner");

  const [banner, setBanner] = useState({
    title: "",
    subTitle: "",
    image: "",
  });

  const [faq, setFaq] = useState([
    { question: "", answer: "" },
  ]);

  const [categories, setCategories] = useState([
    { title: "" },
  ]);

  const [savedSections, setSavedSections] = useState({
    banner: false,
    faq: false,
    categories: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Load each layout independently.
  useEffect(() => {
    const loadLayout = async () => {
      const requests = [
        { type: "banner", request: getLayout("banner") },
        { type: "faq", request: getLayout("faq") },
        {
          type: "categories",
          request: getLayout("categories"),
        },
      ];

      try {
        const results = await Promise.allSettled(
          requests.map((item) => item.request)
        );

        results.forEach((result, index) => {
          const type = requests[index].type;

          if (result.status === "rejected") {
            console.warn(
              `Unable to load ${type}:`,
              result.reason?.response?.data?.message ??
                result.reason?.message
            );
            return;
          }

          const layout = result.value?.layout;

          if (!layout) return;

          if (type === "banner" && layout.banner) {
            setBanner({
              title: layout.banner.title ?? "",
              subTitle: layout.banner.subTitle ?? "",
              image:
                typeof layout.banner.image === "string"
                  ? layout.banner.image
                  : layout.banner.image?.url ?? "",
            });

            setSavedSections((previous) => ({
              ...previous,
              banner: true,
            }));
          }

          if (type === "faq" && Array.isArray(layout.faq)) {
            setFaq(
              layout.faq.length
                ? layout.faq.map((item) => ({
                    question: item.question ?? "",
                    answer: item.answer ?? "",
                  }))
                : [{ question: "", answer: "" }]
            );

            setSavedSections((previous) => ({
              ...previous,
              faq: layout.faq.length > 0,
            }));
          }

          if (
            type === "categories" &&
            Array.isArray(layout.categories)
          ) {
            setCategories(
              layout.categories.length
                ? layout.categories.map((item) => ({
                    title: item.title ?? "",
                  }))
                : [{ title: "" }]
            );

            setSavedSections((previous) => ({
              ...previous,
              categories: layout.categories.length > 0,
            }));
          }
        });
      } catch (err) {
        setError(
          err.response?.data?.message ??
            "Unable to load site layout."
        );
      } finally {
        setLoading(false);
      }
    };

    loadLayout();
  }, []);

  // Banner input changes
  const handleBannerChange = (event) => {
    const { name, value } = event.target;

    setBanner((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Banner image selection
  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      event.target.value = "";
      return;
    }

    setError("");

    const reader = new FileReader();

    reader.onload = () => {
      setBanner((previous) => ({
        ...previous,
        image: reader.result,
      }));
    };

    reader.onerror = () => {
      setError("Unable to read the selected image.");
    };

    reader.readAsDataURL(file);
  };

  // FAQ changes
  const handleFaqChange = (index, field, value) => {
    setFaq((previous) =>
      previous.map((item, itemIndex) =>
        itemIndex === index
          ? { ...item, [field]: value }
          : item
      )
    );
  };

  const addQuestion = () => {
    setFaq((previous) => [
      ...previous,
      { question: "", answer: "" },
    ]);
  };

  const removeQuestion = (index) => {
    setFaq((previous) =>
      previous.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  // Category changes
  const handleCategoryChange = (index, value) => {
    setCategories((previous) =>
      previous.map((item, itemIndex) =>
        itemIndex === index
          ? { ...item, title: value }
          : item
      )
    );
  };

  const addCategory = () => {
    setCategories((previous) => [
      ...previous,
      { title: "" },
    ]);
  };

  const removeCategory = (index) => {
    setCategories((previous) =>
      previous.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  // Save or update layout
  const handleSave = async (type) => {
    setMessage("");
    setError("");

    let layoutData;

    if (type === "banner") {
      if (!banner.title.trim() || !banner.subTitle.trim()) {
        setError("Please enter the banner title and subtitle.");
        return;
      }

      layoutData = {
        type: "banner",
        title: banner.title.trim(),
        subTitle: banner.subTitle.trim(),
        image: banner.image,
      };
    } else if (type === "faq") {
      const validFaq = faq.filter(
        (item) =>
          item.question.trim() && item.answer.trim()
      );

      if (validFaq.length === 0) {
        setError("Please add at least one complete FAQ.");
        return;
      }

      layoutData = {
        type: "faq",
        faq: validFaq,
      };
    } else if (type === "categories") {
      const validCategories = categories.filter(
        (item) => item.title.trim()
      );

      if (validCategories.length === 0) {
        setError("Please add at least one category.");
        return;
      }

      layoutData = {
        type: "categories",
        categories: validCategories,
      };
    } else {
      setError("Invalid layout section.");
      return;
    }

    try {
      setSaving(true);

      const response = savedSections[type]
        ? await updateLayout(layoutData)
        : await createLayout(layoutData);

      setSavedSections((previous) => ({
        ...previous,
        [type]: true,
      }));

      setMessage(
        response?.message ??
          `${type} saved successfully.`
      );
    } catch (err) {
      setError(
        err.response?.data?.message ??
          `Unable to save ${type}.`
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <p className="layout-loading">
        Loading site layout...
      </p>
    );
  }

  return (
    <div className="site-layout-page">
      <div className="site-layout-heading">
        <div>
          <h2>Site Layout</h2>
          <p>Manage homepage banner, FAQs, and categories.</p>
        </div>
      </div>

      <div className="layout-tabs">
        {["banner", "faq", "categories"].map((tab) => (
          <button
            key={tab}
            type="button"
            className={activeTab === tab ? "active" : ""}
            onClick={() => {
              setActiveTab(tab);
              setMessage("");
              setError("");
            }}
          >
            {tab === "faq"
              ? "FAQ"
              : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {message && (
        <p className="layout-success">{message}</p>
      )}

      {error && (
        <p className="layout-error">{error}</p>
      )}

      {/* Banner section */}
      {activeTab === "banner" && (
        <section className="layout-panel">
          <h3>Homepage Banner</h3>

          {!savedSections.banner && (
            <p className="layout-hint">
              No banner has been created yet. Enter the details
              and save to create one.
            </p>
          )}

          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleSave("banner");
            }}
          >
            <label htmlFor="banner-title">Title</label>
            <input
              id="banner-title"
              name="title"
              value={banner.title}
              onChange={handleBannerChange}
              placeholder="Enter banner title"
              required
            />

            <label htmlFor="banner-subtitle">Sub title</label>
            <input
              id="banner-subtitle"
              name="subTitle"
              value={banner.subTitle}
              onChange={handleBannerChange}
              placeholder="Enter banner subtitle"
              required
            />

            <label htmlFor="banner-image">Image</label>
            <input
              id="banner-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />

            {banner.image && (
              <img
                className="banner-preview"
                src={banner.image}
                alt="Banner preview"
              />
            )}

            <button type="submit" disabled={saving}>
              {saving
                ? "Saving..."
                : savedSections.banner
                  ? "Update banner"
                  : "Save banner"}
            </button>
          </form>
        </section>
      )}

      {/* FAQ section */}
      {activeTab === "faq" && (
        <section className="layout-panel">
          <h3>Frequently Asked Questions</h3>

          {faq.map((item, index) => (
            <div className="layout-item" key={index}>
              <label>Question {index + 1}</label>
              <input
                value={item.question}
                onChange={(event) =>
                  handleFaqChange(
                    index,
                    "question",
                    event.target.value
                  )
                }
                placeholder="What is this course?"
              />

              <label>Answer {index + 1}</label>
              <textarea
                value={item.answer}
                onChange={(event) =>
                  handleFaqChange(
                    index,
                    "answer",
                    event.target.value
                  )
                }
                placeholder="Enter the answer"
                rows={3}
              />

              <button
                type="button"
                className="remove-button"
                onClick={() => removeQuestion(index)}
              >
                Remove
              </button>
            </div>
          ))}

          <div className="layout-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={addQuestion}
            >
              + Add question
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave("faq")}
            >
              {saving ? "Saving..." : "Save FAQ"}
            </button>
          </div>
        </section>
      )}

      {/* Categories section */}
      {activeTab === "categories" && (
        <section className="layout-panel">
          <h3>Course Categories</h3>

          {categories.map((category, index) => (
            <div className="category-item" key={index}>
              <input
                value={category.title}
                onChange={(event) =>
                  handleCategoryChange(
                    index,
                    event.target.value
                  )
                }
                placeholder="Enter category title"
              />

              <button
                type="button"
                className="remove-button"
                onClick={() => removeCategory(index)}
              >
                Remove
              </button>
            </div>
          ))}

          <div className="layout-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={addCategory}
            >
              + Add category
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave("categories")}
            >
              {saving ? "Saving..." : "Save categories"}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

export default SiteLayout;
