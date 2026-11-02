
// import React from "react";
// import ReactDOM from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
// import { AuthProvider } from "./context/AuthContext";
// import App from "./app/App";

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <AuthProvider>
//         <App />
//       </AuthProvider>
//     </BrowserRouter>
//   </React.StrictMode>
// );
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import CourseProvider from "./state-mgmt/CourseContext";
import App from "./app/App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CourseProvider>
          <App />
        </CourseProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);