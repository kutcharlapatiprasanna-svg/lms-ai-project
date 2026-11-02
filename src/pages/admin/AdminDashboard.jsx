
import { NavLink, Outlet } from "react-router-dom";
import "./admin.css";

export default function AdminDashboard() {
    const links = [
        {
            title: "Dashboard",
            emoji: "🏠",
            path: "/admin/admin-dashboard",
            end: true,
        },
        {
            title: "All Users",
            emoji: "👥",
            path: "/admin/admin-dashboard/all-users",
        },
        {
            title: "Update User",
            emoji: "✏️",
            path: "/admin/admin-dashboard/update-user",
        },
        {
            title: "Create Course",
            emoji: "📚",
            path: "/admin/admin-dashboard/create-course",
        },
        {
            title: "All Courses",
            emoji: "🎓",
            path: "/admin/admin-dashboard/courses",
        },
        {
            title: "Orders",
            emoji: "🛒",
            path: "/admin/admin-dashboard/orders",
        },
        {
            title: "Notifications",
            emoji: "🔔",
            path: "/admin/admin-dashboard/notifications",
        },
        {
            title: "Analytics",
            emoji: "📊",
            path: "/admin/admin-dashboard/analytics",
        },
        {
            title: "Site Layout",
            emoji: "🎨",
            path: "/admin/admin-dashboard/layout",
        },
        {
            title: "LMS Marketplace",
            emoji: "🌐",
            path: "/lms",
        },
         {
            title: "LMS Admin",
            emoji: "🌐",
            path: "/lms/admin",
        },
     
    ];

    return (
        <div className="admin-dashboard-layout">
            <header className="admin-main-header">
                <h2>Admin Panel</h2>
                <p>Welcome, Admin! Manage your LMS platform.</p>
            </header>

            <div className="admin-dashboard-body">
                <aside className="admin-sidebar">
                    <h3>📋 Menu</h3>

                    {links.map((link) => (
                        <NavLink
                            key={link.title}
                            to={link.path}
                            end={link.end}
                            className={({ isActive }) =>
                                `admin-nav-link ${
                                    isActive ? "active" : ""
                                }`
                            }
                        >
                            <span>{link.emoji}</span>
                            <span>{link.title}</span>
                        </NavLink>
                    ))}
                </aside>

                <main className="admin-dashboard-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}



// import { NavLink, Outlet } from "react-router-dom";
// import "./admin.css";

// export default function AdminDashboard() {
//   const menuItems = [
//     { label: "All Users", path: "/admin/admin-dashboard/all-users" },
//     { label: "Create Course", path: "/admin/admin-dashboard/create-course" },
//     { label: "All Courses", path: "/admin/admin-dashboard/courses" },
//     { label: "Orders", path: "/admin/admin-dashboard/orders" },
//     { label: "Notifications", path: "/admin/admin-dashboard/notifications" },
//     { label: "Analytics", path: "/admin/admin-dashboard/analytics" },
//     { label: "Site Layout", path: "/admin/admin-dashboard/layout" },
//   ];

//   return (
//     <div className="admin-dashboard">
//       <aside className="admin-sidebar">
//         <h2>Admin Panel</h2>

//         <nav>
//           <NavLink
//             to="/admin/admin-dashboard"
//             end
//             className="admin-menu-link"
//           >
//             Dashboard
//           </NavLink>

//           {menuItems.map((item) => (
//             <NavLink
//               key={item.path}
//               to={item.path}
//               className={({ isActive }) =>
//                 `admin-menu-link${isActive ? " active" : ""}`
//               }
//             >
//               {item.label}
//             </NavLink>
//           ))}

//           <NavLink to="/lms" className="admin-menu-link">
//             LMS Marketplace
//           </NavLink>
//         </nav>
//       </aside>

//       <main className="admin-dashboard-content">
//         <Outlet />
//       </main>
//     </div>
//   );
// }
