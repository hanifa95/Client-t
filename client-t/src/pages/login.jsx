import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase/firebase-config";
import { useNavigate } from "react-router-dom";
import { getUserByUid, createUser } from "../api/user";
import { useState, useEffect } from "react";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isLoggedIn = () => localStorage.getItem("user") !== null;

  const register = async () => {
    const response = await axios({
      method: "post",
      url: "https://695ff14b7f037703a81543ad.mockapi.io/user",
      data: {
        username: username,
        email: email,
        password: password,
      },
    });
    console.log(response.data);
    if (response.status == 201) {
      alert("User registered successfully");
      window.location.href = "/login2";
    } else {
      alert("User not registered");
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

      navigate("/products");
    } catch (error) {
      console.error("Ошибка входа:", error);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="col-md-5 col-lg-4">
        <div className="card shadow-lg border-0 rounded-4 p-4">
  
          {/* Header */}
          <div className="text-center mb-3">
            <i className="fa-solid fa-user fs-2 text-primary mb-2"></i>
            <h3 className="fw-bold">Регистрация</h3>
            <p className="text-muted small">
              Создайте новую учетную запись
            </p>
          </div>
  
          {/* Username */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Имя пользователя</label>
            <input
              type="text"
              className="form-control rounded-3"
              placeholder="Введите имя пользователя..."
              onChange={(e) => setUsername(e.target.value)}
            />
            <div className="form-text">Минимум 3 символа</div>
          </div>
  
          {/* Email */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              className="form-control rounded-3"
              placeholder="Введите email..."
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
  
          {/* Password */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Пароль</label>
            <input
              type="password"
              className="form-control rounded-3"
              placeholder="Введите пароль..."
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="form-text">Минимум 6 символов</div>
          </div>
  
          {/* Button */}
          <button className="btn btn-primary w-100 rounded-3 fw-semibold mb-3" onClick={register}>
            Создать аккаунт
          </button>
  
          {/* Divider */}
          <div className="text-center text-muted mb-2">или</div>
  
          {/* Google */}
          <button
            onClick={loginWithGoogle}
            className="btn btn-outline-dark w-100 rounded-3"
          >
            <i className="fa-brands fa-google me-2"></i>
            Войти через Google
          </button>
  
        </div>
      </div>
    </div>
  );
};

export default Login;
