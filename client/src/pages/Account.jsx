import { useContext } from "react";
import { userContext } from "../UserContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import PlacesPage from "./PlacesPage";
import AccountNav from "../components/AccountNav";
// import { useState } from "react"

const Account = () => {
  const navigate = useNavigate();
  const { ready, user, setUser } = useContext(userContext);
  let { subpage } = useParams();
  if (subpage === undefined) {
    subpage = "profile";
  }

  const logout = async () => {
    await axios.post("/logout");
    navigate("/");
    setUser(null);
  };

  if (!ready) {
    return "Loading...";
  }
  if (ready && !user) {
    navigate("/");
  }


const linkClasses = (type = null) => {
    let classes = "inline-flex gap-1 py-2 px-6 rounded-full";
  
    if (type === subpage || (subpage === undefined && type === "profile")) {
      classes += " bg-primary text-white";
    } else {
      classes += ' bg-gray-200 text-gray-700';
    }
  
    return classes;
  };
  

  return (
    <div>
      <AccountNav/>

      {subpage === "profile" && (
        <div className="text-center max-w-lg mx-auto ">
          Logged in as {user.name} ({user.email}) <br />
          <button className="primary max-w-sm mt-2 " onClick={logout}>
            Log Out
          </button>
        </div>
      )}

      {subpage === "places" && <PlacesPage />}
    </div>
  );
};

export default Account;
