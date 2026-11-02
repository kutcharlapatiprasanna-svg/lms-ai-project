
// import { NavLink } from "react-router-dom";

// const links = [
//   { label: "Overview", path: "/admin/admin-dashboard" },
//   { label: "All Users", path: "/admin/admin-dashboard/users" },
//   { label: "Update User", path: "/admin/admin-dashboard/update-user" },
// ];

// export default function AdminSidebar() {
//   return (
//     <aside className="admin-sidebar">
//       <div className="sidebar-brand">
//         <span className="brand-icon">A</span>
//         <span>AdminPanel</span>
//       </div>

//       <p className="sidebar-label">WORKSPACE</p>

//       <nav className="sidebar-nav">
//         {links.map((link) => (
//           <NavLink
//             key={link.path}
//             to={link.path}
//             end={link.path === "/admin/admin-dashboard"}
//             className={({ isActive }) =>
//               `sidebar-link ${isActive ? "active" : ""}`
//             }
//           >
//             <span>{link.label}</span>
//             <span className="sidebar-arrow">›</span>
//           </NavLink>
//         ))}
//       </nav>

//       <div className="sidebar-footer">
//         User Management System
//       </div>
//     </aside>
//   );
// }



