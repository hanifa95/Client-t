import axios from "axios";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase/firebase-config";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Login2 = () => {

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const isLoggedIn = () => localStorage.getItem("user") !== null;
  const navigate = useNavigate();

  const SignIn = async () => {
    const response = await axios({
      method: "get",
      url: "https://695ff14b7f037703a81543ad.mockapi.io/user",
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


  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      localStorage.setItem("uid", user.uid);
      const userData = {
        uid: user.uid,
        name: user.displayName || user.email,
        email: user.email,
        avatar: user.photoURL || "",
        phone: user.phoneNumber || "",
      };
      localStorage.setItem("user", JSON.stringify(userData));
      window.dispatchEvent(new Event("userChange"));

      try {
        const existingUser = await getUserByUid(user.uid);
        if (!existingUser) {
          await createUser({
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            avatar: user.photoURL,
            phone: user.phoneNumber || "",
            createdAt: new Date().toISOString(),
          });
        }
      } catch (apiError) {
        console.warn("Не удалось сохранить в mockapi, но в Firebase вошли:", apiError);
      }

      navigate("/profile");
    } catch (error) {
      console.error("Ошибка входа через Google:", error);
      alert("Ошибка входа через Google: " + (error.message || error.code));
    }
  };

  return (
    <div
      className="container-fluid min-vh-100 d-flex justify-content-center align-items-center"
      style={{
        background: "linear-gradient(135deg, #16a34a, #22c55e, #4ade80)",
      }}
    >
      <div className="col-11 col-sm-9 col-md-6 col-lg-4">
        <div className="card border-0 shadow-lg rounded-5 p-4">
          {/* Header */}
          <div className="text-center mb-4">
            <div
              className="mx-auto d-flex justify-content-center align-items-center rounded-circle bg-success text-white mb-3"
              style={{ width: "75px", height: "75px" }}
            >
              <i className="fa-solid fa-right-to-bracket fs-2"></i>
            </div>
  
            <h2 className="fw-bold mb-1">Добро пожаловать!</h2>
            <p className="text-muted">
              Войдите в свой аккаунт
            </p>
          </div>
  
          {/* Email */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Email
            </label>
  
            <div className="input-group">
              <span className="input-group-text bg-white">
                <i className="fa-solid fa-envelope text-success"></i>
              </span>
  
              <input
                type="email"
                className="form-control"
                placeholder="Введите email..."
                onChange={(e) => setLogin(e.target.value)}
              />
            </div>
          </div>
  
          {/* Password */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Пароль
            </label>
  
            <div className="input-group">
              <span className="input-group-text bg-white">
                <i className="fa-solid fa-lock text-success"></i>
              </span>
  
              <input
                type="password"
                className="form-control"
                placeholder="Введите пароль..."
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
  
          {/* Forgot Password */}
          <div className="text-end mb-3">
            <a href="#" className="text-decoration-none text-success small">
              Забыли пароль?
            </a>
          </div>
  
          {/* Login Button */}
          <button
            className="btn btn-success w-100 py-2 rounded-4 fw-bold shadow-sm"
            onClick={SignIn}
          >
            <i className="fa-solid fa-right-to-bracket me-2"></i>
            Войти
          </button>
  
          {/* Divider */}
          <div className="d-flex align-items-center my-4">
            <hr className="flex-grow-1" />
            <span className="mx-3 text-muted small">или</span>
            <hr className="flex-grow-1" />
          </div>
  
          {/* Google */}
          <button className="btn btn-light border w-100 rounded-4 py-2 fw-semibold shadow-sm" onClick={loginWithGoogle}>
            <i className="fa-brands fa-google text-danger me-2"></i>
            Войти через Google
          </button>
  
          {/* Register */}
          <div className="text-center mt-4">
            <span className="text-muted">
              Нет аккаунта?
            </span>
  
            <button className="btn btn-link text-decoration-none fw-bold text-success">
              Зарегистрироваться
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  
};
export default Login2;


