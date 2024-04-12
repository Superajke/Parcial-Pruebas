import { Route, Routes } from "react-router-dom";
import LogIn from "../pages/LogIn";
import ProtectedRoute from "../ProtectedRoute";
import NotFound from "../components/NotFound";
import Home from "../pages/Home";
import PersonalInfo from "../pages/PersonalInfo";

function RoutesPG() {
  return (
    <Routes>
      <Route path="/" element={<LogIn />} />
      <Route path="/login" element={<LogIn />} />
      <Route path="*" element={<NotFound />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/information" element={<PersonalInfo />} />
      </Route>
    </Routes>
  );
}

export default RoutesPG;
