// import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./Home";
import Dashboard from "./Dashboard";
import Leads from "./Leads";
import Login from "./Login";
import Register from "./Register"
import PageNotFound from "./PageNotFound";
import PrivateRoute from "./RouteGuard"
import Selectleads from "./Selectleads"




export default function App() {
  return (
    <BrowserRouter>
      <Routes >
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
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