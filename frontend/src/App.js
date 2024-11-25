import React, { useEffect } from "react";
import Home from "./Pages/Home";
import AllTasks from "./Pages/AllTasks";
import ImportantTasks from "./Pages/ImportantTasks";
import CompletedTasks from "./Pages/CompletedTasks";
import IncompletedTasks from "./Pages/IncompletedTasks";
import { Routes, Route, useNavigate } from "react-router-dom";
import { authActions } from "./store/auth";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import { useSelector, useDispatch } from "react-redux";
const App = () => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  useEffect(() => {
    if (localStorage.getItem("id") && localStorage.getItem("token")) {
      dispatch(authActions.login());
    } else if (
      isLoggedIn === false &&
      window.location.pathname !== "/verify-email"
    ) {
      navigate("/login");
    }
  }, []);

  return (
    <div className="bg-gray-900 text-white md:h-[100%] p-2 relative">
      <Routes>
        <Route exact path="/" element={<Home />}>
          <Route index element={<AllTasks />} />
          <Route path="/importantTasks" element={<ImportantTasks />} />
          <Route path="/completedTasks" element={<CompletedTasks />} />
          <Route path="/incompletedTasks" element={<IncompletedTasks />} />
        </Route>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
};

export default App;