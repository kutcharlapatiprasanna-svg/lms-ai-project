
import "./admin.css";

export default function AdminDashboardHome() {
    const overviewCards = [
        {
            emoji: "👥",
            title: "User Management",
            description:
                "View and manage registered users on your platform.",
            value: "Manage Users",
            color: "users",
        },
        {
            emoji: "🎓",
            title: "Course Management",
            description:
                "Create, view, and manage courses available to learners.",
            value: "Manage Courses",
            color: "courses",
        },
        {
            emoji: "🛒",
            title: "Orders",
            description:
                "Review and manage platform orders.",
            value: "Manage Orders",
            color: "orders",
        },
        {
            emoji: "📊",
            title: "Analytics",
            description:
                "Review platform analytics and activity.",
            value: "View Analytics",
            color: "analytics",
        },
    ];

    return (
        <div className="admin-home">
            <div className="admin-welcome-card">
                <h1>Welcome to Your Admin Panel 👋</h1>

                <p>
                    Manage users, courses, orders, and your LMS
                    platform from one place.
                </p>
            </div>

            <div className="admin-home-heading">
                <h2>Dashboard Overview</h2>
                <p>
                    Select an option from the sidebar to manage your
                    platform.
                </p>
            </div>

            <div className="admin-overview-grid">
                {overviewCards.map((card) => (
                    <div
                        className={`admin-overview-card ${card.color}`}
                        key={card.title}
                    >
                        <div className="admin-overview-icon">
                            {card.emoji}
                        </div>

                        <h3>{card.title}</h3>

                        <p>{card.description}</p>

                        <span className="admin-overview-label">
                            {card.value}
                        </span>
                    </div>
                ))}
            </div>

            <div className="admin-content-card admin-quick-info">
                <h2>Quick Information</h2>

                <p>
                    Use <strong>All Users</strong> to view registered
                    users, <strong>Create Course</strong> to add a
                    course, and <strong>All Courses</strong> to manage
                    existing courses.
                </p>

                <p>
                    This overview currently displays static information.
                    Live user counts, course counts, and order totals
                    require connecting the relevant API data.
                </p>
            </div>
        </div>
    );
}
