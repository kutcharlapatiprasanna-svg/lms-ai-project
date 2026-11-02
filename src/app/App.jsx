
//Its job is to load the routes and global styles

import AppRoutes from "../routes/AppRoutes";
import "../styles/global.css";
import "../styles/Auth.css";
import "../styles/Pages.css";

export default function App() {
  return <AppRoutes />;
}