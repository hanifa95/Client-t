import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase-config";
import { getUserByUid } from "../api/user";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        "https://6a2fc982a7f8866418d5125a.mockapi.io/orders"
      );
      if (response.status === 200) {
        const data = await response.json();
        setOrders(data);
      } else {
        console.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem("uid");
    navigate("/");
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">📦 Orders</h2>

        <span className="badge bg-primary fs-6 px-3 py-2">
          {orders.length} Orders
        </span>
        <div className="">
          <button className="btn btn-primary fw-bold" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="alert alert-warning text-center shadow-sm">
          No orders found.
        </div>
      ) : (
        <div className="row g-4">
          {orders.map((order) => (
            <div className="col-md-6 col-lg-4" key={order.id}>
              <div className="card border-0 shadow-lg rounded-4 h-100">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center rounded-top-4">
                  <h5 className="mb-0">Order #{order.id}</h5>

                  <span className="badge bg-light text-primary">📦</span>
                </div>

                <div className="card-body">
                  <div className="mb-3">
                    <small className="text-muted">Customer</small>
                    <h6 className="fw-bold">{order.customerName}</h6>
                  </div>

                  <div className="mb-3">
                    <small className="text-muted">Phone</small>
                    <p className="mb-0">{order.customerPhone}</p>
                  </div>

                  <div className="mb-3">
                    <small className="text-muted">Address</small>
                    <p className="mb-0">{order.address}</p>
                  </div>

                  {/* <div className="mb-3">
                        <small className="text-muted">Total</small>
                        <h5 className="text-success">
                          ${order.totalAmount}
                        </h5>
                      </div> */}

                  {/* <div className="mb-3">
                        <small className="text-muted">Status</small>
                        <span className="badge bg-success">
                          {order.status}
                        </span>
                      </div> */}
                </div>

                <div className="card-footer bg-white border-0">
                  <a href={`/orders/${order.id}`} className="">
                    <button className="btn btn-primary btn-sm mt-2 ms-2">
                      View Details
                    </button>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
