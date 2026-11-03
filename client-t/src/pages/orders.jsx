
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase-config";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Форматирование цены
  const formatPrice = (price) =>
    Number(price || 0).toLocaleString("ru-RU", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  // Получение заказов
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "https://6a2fc982a7f8866418d5125a.mockapi.io/orders"
      );

      if (!response.ok) {
        throw new Error("Не удалось загрузить заказы");
      }

      const data = await response.json();
      setOrders(data.reverse());

    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Ошибка загрузки заказов");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Выход из аккаунта
  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("uid");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Получение стоимости товаров
  const getSubtotal = (order) => {
    if (order.subtotal !== undefined) {
      return Number(order.subtotal) || 0;
    }

    return (order.items || []).reduce((total, product) => {
      const price = Number(product.price) || 0;
      const count = Number(product.count) || 1;

      return total + price * count;
    }, 0);
  };

  // Комиссия
  const getServiceFee = (order) => {
    if (order.serviceFee !== undefined) {
      return Number(order.serviceFee) || 0;
    }

    return getSubtotal(order) * 0.10;
  };

  // Доставка
  const getDeliveryPrice = (order) => {
    if (order.deliveryPrice !== undefined) {
      return Number(order.deliveryPrice) || 0;
    }

    return (Number(order.weight) || 0) * 50;
  };

  // Общая сумма
  const getTotal = (order) => {
    if (order.totalAmount !== undefined) {
      return Number(order.totalAmount) || 0;
    }

    return (
      getSubtotal(order) +
      getServiceFee(order) +
      getDeliveryPrice(order)
    );
  };

  return (
    <div className="bg-light min-vh-100 py-5">

      <div className="container">

        {/* Header */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-5 gap-3">

          <div>
            <h1 className="fw-bold text-primary mb-1">
              📦 My Orders
            </h1>

            <p className="text-muted mb-0">
              Управление и информация о заказах
            </p>
          </div>

          <div className="d-flex align-items-center gap-3">

            <span className="badge bg-primary fs-6 px-3 py-2">
              {orders.length} заказов
            </span>

            <button
              className="btn btn-outline-primary fw-bold"
              onClick={fetchOrders}
              disabled={loading}
            >
              ↻ Обновить
            </button>

            <button
              className="btn btn-danger fw-bold"
              onClick={logout}
            >
              Logout
            </button>

          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary"></div>
            <p className="text-muted mt-3">
              Загрузка заказов...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="alert alert-danger">
            {error}
            <button
              className="btn btn-sm btn-outline-danger ms-3"
              onClick={fetchOrders}
            >
              Повторить
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && orders.length === 0 && (
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body text-center py-5">
              <h2>🛒</h2>
              <h4 className="fw-bold">
                Заказов пока нет
              </h4>
              <p className="text-muted">
                Здесь будут отображаться оформленные заказы.
              </p>

              <a href="/" className="btn btn-primary">
                Перейти к покупкам
              </a>
            </div>
          </div>
        )}

        {/* Orders */}
        {!loading && !error && orders.length > 0 && (
          <div className="row g-4">

            {orders.map((order) => {
              const subtotal = getSubtotal(order);
              const serviceFee = getServiceFee(order);
              const deliveryPrice = getDeliveryPrice(order);
              const totalAmount = getTotal(order);

              return (
                <div
                  className="col-md-6 col-xl-4"
                  key={order.id}
                >

                  <div
                    className="card border-0 shadow rounded-4 h-100"
                    style={{
                      transition: "0.3s",
                    }}
                  >

                    {/* Card Header */}
                    <div
                      className="card-header border-0 text-white p-4 rounded-top-4"
                      style={{
                        background:
                          "linear-gradient(135deg, #0d6efd, #6610f2)",
                      }}
                    >

                      <div className="d-flex justify-content-between align-items-center">

                        <div>
                          <small className="opacity-75">
                            Номер заказа
                          </small>

                          <h4 className="fw-bold mb-0">
                            #{order.id}
                          </h4>
                        </div>

                        <span className="badge bg-white text-primary fs-6">
                          📦 Order
                        </span>

                      </div>

                    </div>

                    {/* Card Body */}
                    <div className="card-body p-4">

                      {/* Customer */}
                      <h6 className="text-primary fw-bold mb-3">
                        👤 Информация о клиенте
                      </h6>

                      <div className="mb-2">
                        <small className="text-muted">
                          Имя клиента
                        </small>

                        <div className="fw-semibold">
                          {order.customerName || "Не указано"}
                        </div>
                      </div>

                      <div className="mb-2">
                        <small className="text-muted">
                          Телефон
                        </small>

                        <div className="fw-semibold">
                          {order.customerPhone || "Не указан"}
                        </div>
                      </div>

                      <div className="mb-3">
                        <small className="text-muted">
                          Адрес доставки
                        </small>

                        <div className="fw-semibold">
                          📍 {order.address || "Не указан"}
                        </div>
                      </div>

                      <hr />

                      {/* Products */}
                      <h6 className="text-primary fw-bold mb-3">
                        🛍️ Товары ({order.items?.length || 0})
                      </h6>

                      {order.items?.length > 0 ? (
                        order.items.map((product, index) => (
                          <div
                            key={`${product.id}-${index}`}
                            className="d-flex justify-content-between align-items-start mb-3"
                          >

                            <div className="me-2">
                              <div className="fw-semibold">
                                {product.title ||
                                  product.name ||
                                  product.description ||
                                  "Товар"}
                              </div>

                              <small className="text-muted">
                                {formatPrice(product.price)} сом ×{" "}
                                {product.count || 1}
                              </small>
                            </div>

                            <strong className="text-nowrap">
                              {formatPrice(
                                Number(product.price) *
                                Number(product.count || 1)
                              )} сом
                            </strong>

                          </div>
                        ))
                      ) : (
                        <p className="text-muted">
                          Информация о товарах отсутствует
                        </p>
                      )}

                      <hr />

                      {/* Weight */}
                      <div className="d-flex justify-content-between mb-3">
                        <span className="text-muted">
                          ⚖️ Вес заказа
                        </span>

                        <strong>
                          {order.weight || 0} кг
                        </strong>
                      </div>

                      {/* Price Details */}
                      <h6 className="text-primary fw-bold mb-3">
                        💰 Расчёт стоимости
                      </h6>

                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">
                          Стоимость товаров
                        </span>

                        <strong>
                          {formatPrice(subtotal)} сом
                        </strong>
                      </div>

                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">
                          🚚 Доставка
                        </span>

                        <strong>
                          {formatPrice(deliveryPrice)} сом
                        </strong>
                      </div>

                      <div className="d-flex justify-content-between mb-3">
                        <span className="text-muted">
                          Комиссия сервиса (10%)
                        </span>

                        <strong className="text-danger">
                          {formatPrice(serviceFee)} сом
                        </strong>
                      </div>

                      {/* Total */}
                      <div
                        className="rounded-3 p-3 mb-3"
                        style={{
                          background: "#e8f5e9",
                        }}
                      >

                        <div className="d-flex justify-content-between align-items-center">

                          <span className="fw-bold">
                            ИТОГО
                          </span>

                          <h4 className="text-success fw-bold mb-0">
                            {formatPrice(totalAmount)} сом
                          </h4>

                        </div>

                      </div>

                      {/* Status */}
                      <div className="d-flex justify-content-between align-items-center">

                        <span className="text-muted">
                          Статус заказа
                        </span>

                        <span className="badge bg-warning text-dark px-3 py-2">
                          {order.status || "pending"}
                        </span>

                      </div>

                    </div>

                    {/* Footer */}
                    <div className="card-footer bg-white border-0 p-4 pt-0">

                      <button
                        className="btn btn-primary w-100 rounded-3 fw-bold"
                        onClick={() =>
                          navigate(`/orders/${order.id}`)
                        }
                      >
                        Посмотреть детали →
                      </button>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>
    </div>
  );
};

export default Orders;
