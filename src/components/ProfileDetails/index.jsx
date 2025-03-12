import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import "./index.css";

const ProfileDetails = () => {
  const [profile, setProfile] = useState(null);
  const [apiStatus, setApiStatus] = useState("INITIAL");

  useEffect(() => {
    const getProfileData = async () => {
      const url = "https://apis.ccbp.in/profile";
      const options = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${Cookies.get("jwt_token")}`,
        },
      };

      setApiStatus("INITIAL");

      try {
        const response = await fetch(url, options);
        if (response.ok) {
          const data = await response.json();
          setProfile(data.profile_details);
          setApiStatus("SUCCESS");
        } else {
          throw new Error("Failed to fetch profile");
        }
      } catch (error) {
        setApiStatus("FAILURE");
      }
    };

    getProfileData();
  }, []);

  if (apiStatus === "INITIAL") {
    return <p>Loading...</p>;
  }

  if (apiStatus === "FAILURE") {
    return (
      <div>
        <p>Something went wrong. Please try again later.</p>
        <button type="button" onClick={() => getProfileData()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="profile">
      {profile ? (
        <>
          <img src={profile.profile_image_url} alt="profile" />
          <h1>{profile.name}</h1>
          <p>{profile.short_bio}</p>
        </>
      ) : (
        <p>No profile data available.</p>
      )}
    </div>
  );
};

export default ProfileDetails;
