
import { useState } from "react";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";

// Настройка иконки Leaflet
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Бишкек
const BISHKEK = [42.8746, 74.5698];

// Тарифы
const DELIVERY_PRICE_PER_KG = 50;
const SERVICE_FEE_PERCENT = 10;

// Клик по карте
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });

  return null;
}

function Checkout() {
  // Загрузка корзины
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch {
      return [];
    }
  });

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [address, setAddress] = useState("");
  const [weight, setWeight] = useState("");

  const [markerLat, setMarkerLat] = useState(BISHKEK[0]);
  const [markerLng, setMarkerLng] = useState(BISHKEK[1]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Сумма товаров
  const subtotal = cart.reduce((total, product) => {
    const price = Number(product.price) || 0;
    const count = Number(product.count) || 1;

    return total + price * count;
  }, 0);

  // Комиссия 10%
  const serviceFee = subtotal * (SERVICE_FEE_PERCENT / 100);

  // Вес
  const orderWeight = Number(weight) || 0;

  // Доставка
  const deliveryPrice = orderWeight * DELIVERY_PRICE_PER_KG;

  // Итоговая сумма
  const totalAmount = subtotal + serviceFee + deliveryPrice;

  // Форматирование денег
  const formatPrice = (price) =>
    Number(price).toLocaleString("ru-RU", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  // Выбор адреса на карте
  const handleMapClick = (latlng) => {
    setMarkerLat(latlng.lat);
    setMarkerLng(latlng.lng);
  };

  // Удаление товара
  const removeProduct = (id) => {
    const updatedCart = cart.filter(
      (product) => product.id !== id
    );

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Оформление заказа
  const addToCart = async () => {
    setMessage("");

    if (cart.length === 0) {
      setMessage("Корзина пуста!");
      return;
    }

    if (!customerName.trim()) {
      setMessage("Введите имя!");
      return;
    }

    if (!customerPhone.trim()) {
      setMessage("Введите номер телефона!");
      return;
    }

    if (!address.trim()) {
      setMessage("Введите адрес!");
      return;
    }

    if (!weight || Number(weight) <= 0) {
      setMessage("Введите правильный вес заказа!");
      return;
    }

    const cartItem = {
      customerName,
      customerPhone,
      items: cart,
      address,

      weight: orderWeight,

      lat: markerLat,
      long: markerLng,

      subtotal: Number(subtotal.toFixed(2)),
      deliveryPrice: Number(deliveryPrice.toFixed(2)),
      serviceFee: Number(serviceFee.toFixed(2)),
      serviceFeePercent: SERVICE_FEE_PERCENT,
      totalAmount: Number(totalAmount.toFixed(2)),

      status: "pending",
      createdAt: new Date().toISOString(),
    };

    try {
      setLoading(true);

      const response = await axios.post(
        "https://6a2fc982a7f8866418d5125a.mockapi.io/orders",
        cartItem
      );

      if (response.status === 201) {
        setMessage("Заказ успешно оформлен!");

        // Очистка корзины
        localStorage.removeItem("cart");
        setCart([]);

        // Очистка формы
        setCustomerName("");
        setCustomerPhone("");
        setAddress("");
        setWeight("");
      }
    } catch (error) {
      console.error("Order error:", error);
      setMessage("Ошибка оформления заказа. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">

      <h1 className="text-center fw-bold mb-5">
        🛒 Оформление заказа
      </h1>

      <div className="row g-4">

        {/* Левая колонка */}
        <div className="col-lg-8">

          {/* Корзина */}
          <div className="card shadow border-0 rounded-4 mb-4">
            <div className="card-body">

              <h4 className="fw-bold mb-4">
                🛒 Моя корзина ({cart.length})
              </h4>

              {cart.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <h5>Корзина пуста</h5>

                  <a href="/" className="btn btn-success mt-3">
                    Вернуться к товарам
                  </a>
                </div>
              ) : (
                cart.map((product) => {
                  const price = Number(product.price) || 0;
                  const count = Number(product.count) || 1;

                  return (
                    <div
                      key={product.id}
                      className="card border-0 shadow-sm mb-3"
                    >
                      <div className="card-body">

                        <div className="d-flex justify-content-between align-items-center">

                          <div>
                            <h5 className="fw-bold">
                              {product.title ||
                                product.name ||
                                product.description}
                            </h5>

                            <p className="text-muted mb-1">
                              Цена: {formatPrice(price)} сом
                            </p>

                            <p className="mb-0">
                              Количество: {count}
                            </p>
                          </div>

                          <div className="text-end">
                            <h5 className="text-success fw-bold">
                              {formatPrice(price * count)} сом
                            </h5>

                            <button
                              className="btn btn-outline-danger btn-sm mt-2"
                              onClick={() =>
                                removeProduct(product.id)
                              }
                            >
                              Удалить
                            </button>
                          </div>

                        </div>

                      </div>
                    </div>
                  );
                })
              )}

            </div>
          </div>

          {/* Карта */}
          <div className="card shadow border-0 rounded-4">
            <div className="card-body">

              <h4 className="fw-bold mb-2">
                📍 Адрес доставки
              </h4>

              <p className="text-muted">
                Нажмите на карту, чтобы выбрать место доставки.
              </p>

              <MapContainer
                center={BISHKEK}
                zoom={13}
                style={{
                  height: "450px",
                  width: "100%",
                  borderRadius: "12px",
                }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap'
                />

                <MapClickHandler
                  onMapClick={handleMapClick}
                />

                <Marker
                  position={[markerLat, markerLng]}
                />
              </MapContainer>

              <p className="text-muted mt-3 mb-0">
                Координаты: {markerLat.toFixed(6)},{" "}
                {markerLng.toFixed(6)}
              </p>

            </div>
          </div>

        </div>

        {/* Правая колонка */}
        <div className="col-lg-4">

          <div className="card shadow-lg border-0 rounded-4">

            <div className="card-header bg-primary text-white rounded-top-4">
              <h4 className="mb-0">
                Order Summary
              </h4>
            </div>

            <div className="card-body">

              {/* Расчёты */}
              <div className="d-flex justify-content-between mb-3">
                <span>Товары:</span>
                <strong>{formatPrice(subtotal)} сом</strong>
              </div>

              <div className="d-flex justify-content-between mb-3">
                <span>Вес:</span>
                <strong>{orderWeight} кг</strong>
              </div>

              <div className="d-flex justify-content-between mb-3">
                <span>Доставка:</span>
                <strong>
                  {formatPrice(deliveryPrice)} сом
                </strong>
              </div>

              <div className="d-flex justify-content-between mb-3">
                <span>Комиссия (10%):</span>
                <strong className="text-danger">
                  {formatPrice(serviceFee)} сом
                </strong>
              </div>

              <hr />

              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold">
                  Итого:
                </h5>

                <h4 className="text-success fw-bold">
                  {formatPrice(totalAmount)} сом
                </h4>
              </div>

              {/* Имя */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Имя клиента
                </label>

                <input
                  type="text"
                  className="form-control rounded-3"
                  placeholder="Введите имя"
                  value={customerName}
                  onChange={(e) =>
                    setCustomerName(e.target.value)
                  }
                />
              </div>

              {/* Телефон */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Телефон
                </label>

                <input
                  type="tel"
                  className="form-control rounded-3"
                  placeholder="+996..."
                  value={customerPhone}
                  onChange={(e) =>
                    setCustomerPhone(e.target.value)
                  }
                />
              </div>

              {/* Адрес */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Адрес
                </label>

                <textarea
                  rows="3"
                  className="form-control rounded-3"
                  placeholder="Введите адрес доставки"
                  value={address}
                  onChange={(e) =>
                    setAddress(e.target.value)
                  }
                />
              </div>

              {/* Вес */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Вес заказа (кг)
                </label>

                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  className="form-control rounded-3"
                  placeholder="Введите вес"
                  value={weight}
                  onChange={(e) =>
                    setWeight(e.target.value)
                  }
                />

                <small className="text-muted">
                  Доставка: 50 сом за 1 кг
                </small>
              </div>

              {/* Сообщение */}
              {message && (
                <div
                  className={`alert ${
                    message.includes("успешно")
                      ? "alert-success"
                      : "alert-danger"
                  }`}
                >
                  {message}
                </div>
              )}

              {/* Кнопки */}
              <div className="d-grid gap-3">

                <button
                  className="btn btn-success btn-lg"
                  onClick={addToCart}
                  disabled={loading || cart.length === 0}
                >
                  {loading
                    ? "Оформление..."
                    : "Place Order"}
                </button>

                <a
                  href="/orders"
                  className="btn btn-outline-primary btn-lg"
                >
                  View Orders
                </a>

              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Checkout;
