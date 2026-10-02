
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Registration = () => {

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const isLoggedIn = () => localStorage.getItem("user") !== null;
  const navigate = useNavigate();

  const SignIn = async () => {
    const response = await axios({
      method: "get",
      url: "https://6953a084a319a928023c1129.mockapi.io/users",
    });
    console.log(response.data);
    if (response.status == 200) {
      const user = response.data.find(
        (user) => user.email == login && user.password == password 
      );
      if (user) {
        alert("User logged in successfully");
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/profile");
      } else {
        alert("User not found");
      }
    }
  };
  useEffect(() => {
    if (isLoggedIn()) {
      window.location.href = "/profile";
    }
  }, [isLoggedIn]);

  return (
    <div className="login container-fluid">
      <div className="row">
        <div className="col-3"></div>

        <div className="col-6">
          <h1 className="text-center mt-5 pb-3 text-success">Login</h1>

       

          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setLogin(e.target.value)}
            className="form-control"
          />
          <br />
          <input
            className="form-control"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <button className="btn btn-success form-control" onClick={SignIn}>
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};
export default Registration;
