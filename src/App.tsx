import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";

import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import Login from "./pages/login";
import Register from "./pages/Register";

import EmployeeDashboard from "./pages/EmployeeDashboard";
import CompanyDashboard from "./pages/CompanyDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

import JobDetails from "./pages/JobDetails";
import MyApplications from "./pages/MyApplications";
import CreateJob from "./pages/CreateJob";
import ManageJobs from "./pages/ManageJobs";
import Applicants from "./pages/Applicants";
import CompanyProfile from "./pages/CompanyProfile";
import DashboardLayout from "./components/dashboard/DashboardLayout";

import EmployeeProfile from "./pages/EmployeeProfile";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Employee-only pages */}
        {/* Employee-only pages */}
        <Route element={<ProtectedRoute role="employee" />}>
          <Route element={<DashboardLayout />}>
            <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
            <Route path="/employee/applications" element={<MyApplications />} />
            <Route path="/employee/profile" element={<EmployeeProfile />} />
          </Route>
        </Route>

        {/* Company-only pages */}
        <Route element={<ProtectedRoute role="company" />}>
          <Route element={<DashboardLayout />}>
            <Route path="/company/dashboard" element={<CompanyDashboard />} />
            <Route path="/company/jobs/new" element={<CreateJob />} />
            <Route path="/company/jobs" element={<ManageJobs />} />
            <Route path="/company/profile" element={<CompanyProfile />} />
            <Route
              path="/company/jobs/:jobId/applicants"
              element={<Applicants />}
            />
          </Route>
        </Route>

        <Route path="/jobs/:id" element={<JobDetails />} />

        {/* Unknown URLs */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
