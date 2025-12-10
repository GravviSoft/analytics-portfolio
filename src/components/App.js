// import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Dashboard from "./Dashboard";
import Leads from "./Leads";
import Login from "./Login";
import Register from "./Register"
import PageNotFound from "./PageNotFound";
import PrivateRoute from "./RouteGuard"
import Selectleads from "./Selectleads"
import AnalyticsDashboard from "./Analytics/AnalyticsDashboard"
import PortfolioLanding from "./PortfolioLanding";
import ProjectDashboardPage from "./ProjectDashboardPage";
import portfolioProjects from "../constants/portfolioProjects";
import About from "./About";




export default function App() {
  return (
    <BrowserRouter>
      <Routes >
        <Route path="/" element={<Layout />}>
          <Route index element={<PortfolioLanding />} />
          <Route path="projects/:projectId" element={<ProjectDashboardPage />} />
          <Route path="analytics" element={<AnalyticsDashboard projectMeta={portfolioProjects[0]} />} />
          <Route path="about" element={<About />} />
          {/* <Route path="dashboard" element={<Dashboard />} /> */}
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="lead/:lead_id" element={<Leads />} />
          <Route path="selectleads" element={<Selectleads />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
