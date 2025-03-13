import { useState } from "react";
import Cookies from "js-cookie";
import { Navigate, useNavigate } from "react-router-dom";
import "./index.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showSubmitError, setShowSubmitError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const onChangeUsername = (e) => {
    setUsername(e.target.value);
  };

  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const onSubmitSuccess = (jwtToken) => {
    Cookies.set("jwt_token", jwtToken, { expires: 30 });
    navigate("/", { replace: true });
  };

  const onSubmitFailure = (errorMsg) => {
    setShowSubmitError(true);
    setErrorMsg(errorMsg);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    const userDetails = { username, password };
    const url = "https://apis.ccbp.in/login";
    console.log(password);
    const options = {
      method: "POST",
      body: JSON.stringify(userDetails),
    };
    const response = await fetch(url, options);
    const data = await response.json();
    console.log("Hi");
    console.log(response.ok);
    if (response.ok) {
      onSubmitSuccess(data.jwt_token);
    } else {
      onSubmitFailure(data.error_msg);
    }
  };

  const renderUsernameField = () => (
    <>
      <label type="text" className="input-label" htmlFor="text">
        USERNAME
      </label>
      <input
        type="text"
        id="text"
        className="input-field"
        value={username}
        onChange={onChangeUsername}
        placeholder="Username"
      />
    </>
  );

  const renderPasswordField = () => (
    <>
      <label className="input-label" htmlFor="password">
        PASSWORD
      </label>
      <input
        type="password"
        id="password"
        className="input-field"
        value={password}
        onChange={onChangePassword}
        placeholder="Password"
      />
    </>
  );

  const jwtToken = Cookies.get("jwt_token");
  //sometime api url fails Actually !==
  if (jwtToken === undefined) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="login-container">
      <form className="form-container" onSubmit={submitForm}>
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
        />
        <h1>Login</h1>
        <div>{renderUsernameField()}</div>
        <div>{renderPasswordField()}</div>
        <button type="button" className="submit-button">
          Login
        </button>
        {showSubmitError && <p className="error-message">*{errorMsg}</p>}
      </form>
    </div>
  );
};

export default Login;
