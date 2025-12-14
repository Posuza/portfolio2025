import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/layout/Layout";
import ErrorNotFound from "./pages/ErrorNotFound";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Users from "./pages/Users";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Educations from "./pages/Educations";
import EducationDetail from "./pages/EducationDetail";
import WorkExperiences from "./pages/WorkExperiences";
import WorkExperienceDetail from "./pages/WorkExperienceDetail";
import References from "./pages/References";
import ReferenceDetail from "./pages/ReferenceDetail";
import Blogs from "./pages/Blogs";
import BlogDetail from "./pages/BlogDetail";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Contact from "./pages/Contact";

const router = createBrowserRouter([
  { path: "/auth", element: <Auth />, errorElement: <ErrorNotFound /> },
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorNotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: "home", element: <Home /> },

      // Public pages - Portfolio showcase
      { path: "projects", element: <Projects /> },
      { path: "projects/:id", element: <ProjectDetail /> },
      { path: "educations", element: <Educations /> },
      { path: "educations/:id", element: <EducationDetail /> },
      { path: "work-experiences", element: <WorkExperiences /> },
      { path: "work-experiences/:id", element: <WorkExperienceDetail /> },
      { path: "references", element: <References /> },
      { path: "references/:id", element: <ReferenceDetail /> },
      { path: "blogs", element: <Blogs /> },
      { path: "blogs/:id", element: <BlogDetail /> },
      { path: "contact", element: <Contact /> },

      // Admin/Protected pages
      { path: "dashboard", element: <ProtectedRoute><Dashboard /></ProtectedRoute> },
      { path: "users", element: <ProtectedRoute><Users /></ProtectedRoute> },
      { path: "users/:id", element: <ProtectedRoute><Users /></ProtectedRoute> },
    ],
  },
]);

export default router;