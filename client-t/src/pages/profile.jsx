import { useEffect } from "react";

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = localStorage.getItem("user") !== null;

  useEffect(() => {
    if (!isLoggedIn) {
      window.location.href = "/login";
    }
  }, [isLoggedIn]);

  const LogOut = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="container-fluid min-vh-100">

      {isLoggedIn ? (
        <div className="d-flex flex-column align-items-center pt-4">

          {/* Кнопка Products */}
          <div className="w-100 text-center mb-4">
            <a href="/products">
              <button className="btn btn-primary px-5">
                Products
              </button>
            </a>
          </div>

          {/* Информация о текущем аккаунте */}
          <div className="text-center mb-3">
            <h5 className="fw-bold mb-1">
              Вы вошли как:
            </h5>

            <div className="text-success fw-bold">
              {user.name}
            </div>

            <div className="text-muted small">
              {user.email}
            </div>
          </div>

          {/* Profile Card */}
          <div className="col-11 col-sm-8 col-md-5 col-lg-3">
            <div className="card border-0 shadow rounded-4">
              <div className="card-body text-center p-4">

                {/* Avatar */}
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="rounded-circle border border-3 border-success shadow mb-3"
                  width="120"
                  height="120"
                />

                <h3 className="fw-bold text-success mb-1">
                  Profile
                </h3>

                <p className="text-muted small mb-3">
                  Account information
                </p>

                {/* Username */}
                <div className="text-start">
                  <div className="border rounded-3 p-2 mb-2">
                    <i className="fa-solid fa-user text-success me-2"></i>
                    <small className="fw-bold">
                      Username
                    </small>

                    <div className="text-muted">
                      {user.name}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="border rounded-3 p-2">
                    <i className="fa-solid fa-envelope text-success me-2"></i>
                    <small className="fw-bold">
                      Email
                    </small>

                    <div className="text-muted">
                      {user.email}
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="d-grid gap-2 mt-3">

                  <a
                    href={`/edit/${user.id}`}
                    className="btn btn-success rounded-4"
                  >
                    Edit
                  </a>

                  <button
                    className="btn btn-success rounded-pill"
                    onClick={LogOut}
                  >
                    <i className="fa-solid fa-right-from-bracket me-2"></i>
                    Log Out
                  </button>

                </div>
              </div>
            </div>
          </div>

        </div>
      ) : (
        <div className="text-center">
          <i className="fa-solid fa-user-lock fs-1 text-danger"></i>

          <h4 className="text-muted mt-3">
            Not logged in
          </h4>
        </div>
      )}
    </div>
  );
};

export default Profile;