

// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import useAuth from "../hooks/useAuth";
// import "./Navbar.css";

// const DEFAULT_PROFILE_IMAGE =
//   "https://i.pravatar.cc/150?img=47";

// export default function Navbar() {
//   const { isAuthenticated, user, logout } = useAuth();

//   const [profileOpen, setProfileOpen] = useState(false);
//   const [imageError, setImageError] = useState(false);

//   const navigate = useNavigate();

//   const name = user?.name || "User";
//   const email = user?.email || "Email unavailable";

//   const profileImage =
//     user?.profilePicture ||
//     user?.avatar ||
//     user?.image ||
//     DEFAULT_PROFILE_IMAGE;

//   const isAdmin =
//     user?.role?.toLowerCase() === "admin";

//   const handleLogout = () => {
//     setProfileOpen(false);
//     logout();
//     navigate("/auth/login", { replace: true });
//   };

//   const handleProfileClick = () => {
//     setProfileOpen((previous) => !previous);
//   };

//   return (
//     <nav className="navbar">
//       <Link to="/" className="logo">
//         Skillora<span>.</span>
//       </Link>

//       <div className="nav-links">
//         <Link to="/">Home</Link>
//         <Link to="/courses">Courses</Link>
//         <Link to="/lms">LMS Marketplace</Link>

//         {!isAuthenticated ? (
//           <div className="auth-links">
//             <Link to="/auth/login" className="login-link">
//               Login
//             </Link>

//             <Link to="/auth/register" className="register-link">
//               Register
//             </Link>
//           </div>
//         ) : (
//           <div className="profile-container">
//             <button
//               type="button"
//               className="profile-button"
//               onClick={handleProfileClick}
//               aria-label="Open user profile"
//               aria-expanded={profileOpen}
//             >
//               {!imageError ? (
//                 <img
//                   src={profileImage}
//                   alt={`${name}'s profile`}
//                   className="profile-circle"
//                   onError={() => setImageError(true)}
//                 />
//               ) : (
//                 <span className="profile-fallback">
//                   {name.charAt(0).toUpperCase()}
//                 </span>
//               )}

//               <span className="profile-name">
//                 {name}
//               </span>

//               <span className="dropdown-arrow">
//                 {profileOpen ? "▲" : "▼"}
//               </span>
//             </button>

//             {profileOpen && (
//               <div className="profile-dropdown">
//                 <div className="profile-top">
//                   {!imageError ? (
//                     <img
//                       src={profileImage}
//                       alt="Profile"
//                       className="dropdown-avatar"
//                       onError={() => setImageError(true)}
//                     />
//                   ) : (
//                     <div className="dropdown-avatar-fallback">
//                       {name.charAt(0).toUpperCase()}
//                     </div>
//                   )}

//                   <div className="profile-info">
//                     <strong>{name}</strong>
//                     <span>{email}</span>

//                     {user?.role && (
//                       <small>{user.role}</small>
//                     )}
//                   </div>
//                 </div>

//                 <div className="dropdown-divider" />

//                 <Link
//                   to="/"
//                   onClick={() => setProfileOpen(false)}
//                 >
//                   <span>⌂</span>
//                   Home
//                 </Link>

               

//                 <button
//                   type="button"
//                   className="logout-button"
//                   onClick={handleLogout}
//                 >
//                   <span>↪</span>
//                   Logout
//                 </button>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// }

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";

import "./Navbar.css";

const DEFAULT_PROFILE_IMAGE =
  "https://i.pravatar.cc/150?img=47";

export default function Navbar() {
  const {
    isAuthenticated,
    user,
    logout,
  } = useAuth();

  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const userName = user?.name || "User";
  const userEmail = user?.email || "Email unavailable";

  const profileImage =
    user?.profilePicture ||
    user?.avatar ||
    user?.image ||
    DEFAULT_PROFILE_IMAGE;

  const role = user?.role || "User";

  const isAdmin =
    role.toLowerCase() === "admin";

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    navigate("/auth/login");
  };

  return (
    <nav className="navbar">

      {/* LOGO */}

      <Link to="/" className="logo">
        Skill<span>ora</span>
      </Link>

      {/* NAVIGATION LINKS */}

      <div className="nav-links">

        <Link to="/">
          Home
        </Link>

        <Link to="/courses">
          Courses
        </Link>

        <Link to="/lms">
          LMS
        </Link>

        {!isAuthenticated && (
          <div className="auth-links">

            <Link
              to="/auth/login"
              className="login-link"
            >
              Login
            </Link>

            <Link
              to="/auth/register"
              className="register-link"
            >
              Register
            </Link>

          </div>
        )}

        {/* PROFILE */}

        {isAuthenticated && (
          <div className="profile-container">

            <button
              type="button"
              className="profile-button"
              onClick={() =>
                setProfileOpen((previous) => !previous)
              }
            >

              {!imageError ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="profile-circle"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="profile-fallback">
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}

              <span className="profile-name">
                {userName}
              </span>

              <span className="dropdown-arrow">
                ▼
              </span>

            </button>

            {/* PROFILE DROPDOWN */}

            {profileOpen && (
              <div className="profile-dropdown">

                <div className="profile-top">

                  {!imageError ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="dropdown-avatar"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="dropdown-avatar-fallback">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="profile-info">

                    <strong>
                      {userName}
                    </strong>

                    <span>
                      {userEmail}
                    </span>

                    <small>
                      {role}
                    </small>

                  </div>

                </div>

                <div className="dropdown-divider" />

                <Link
                  to="/"
                  onClick={() => setProfileOpen(false)}
                >
                  <span>⌂</span>
                  Home
                </Link>

                <Link
                  to="/profile-settings"
                  onClick={() => setProfileOpen(false)}
                >
                  <span>⚙</span>
                  Profile Settings
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin/admin-dashboard"
                    onClick={() => setProfileOpen(false)}
                  >
                    <span>▣</span>
                    Admin Dashboard
                  </Link>
                )}

                <div className="dropdown-divider" />

                <button
                  type="button"
                  className="logout-button"
                  onClick={handleLogout}
                >
                  <span>⇥</span>
                  Logout
                </button>

              </div>
            )}

          </div>
        )}

      </div>

    </nav>
  );
}
