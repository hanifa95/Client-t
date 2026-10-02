import { useEffect, useState } from "react";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";




// Фикс иконки маркера Leaflet + Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Координаты Бишкека по умолчанию
const BISHKEK = [42.8746, 74.5698];

// Компонент для клика по карте
function MapClickHandler({ onMapClick }) {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng);
        },
    });
    return null;
}

const Checkout = () => {
    const [cart, setCart] = useState([]);
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [address, setAddress] = useState("");

      // Координаты маркера на карте
      const [markerLat, setMarkerLat] = useState(BISHKEK[0]);
      const [markerLng, setMarkerLng] = useState(BISHKEK[1]);

          // Клик по карте — ставит маркер
    function handleMapClick(latlng) {
      setMarkerLat(latlng.lat);
      setMarkerLng(latlng.lng);
  }
    
    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            setCart(JSON.parse(storedCart));
        }
    }, []);
    const addToCart = async (product) => {
        console.log("Adding to cart:", product);
        const cartItem = {
            "customerName": customerName,
            "customerPhone": customerPhone,
            "items":cart,
            "address": address,
            lat: markerLat,
            long: markerLng,
            // "totalAmount": 25000,
            // "status": "confirmed",
            // "note": "test",
        };
        console.log("Cart item:", cartItem);

        try {
            const response = await axios.post("https://6a2fc982a7f8866418d5125a.mockapi.io/orders", cartItem);
            if (response.status === 201) {
                console.log("Product added to cart successfully");
            } else {
                console.error("Failed to add product to cart");
            }
        } catch (error) {
            console.error("Error adding product to cart:", error);
        }

    }
    
    return (
      <div className="container py-5">
        <h1 className="text-center fw-bold mb-5">🛒 Checkout</h1>

        <div className="row g-4">
          {/* Cart */}
          <div className="col-lg-8">
            <div className="card shadow-lg border-0 rounded-4">
              
              {/* <div className="card-header bg-dark text-white rounded-top-4">
                  <h4 className="mb-0">Cart Items ({cart.length})</h4>
                </div> */}

              {/* <div className="card-body">
                  {cart.length === 0 ? (
                    <div className="text-center text-muted py-5">
                      <h4>Your cart is empty 🛒</h4>
                    </div>
                  ) : (
                    cart.map((product) => (
                      <div
                        key={product.id}
                        className="card mb-3 shadow-sm border-0 rounded-3"
                      >
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-center">
                            <h4 className="fw-bold">{product.name}</h4>
      
                            <span className="badge bg-success fs-6 p-2">
                              ${product.price}
                            </span>
                          </div>
      
                          <p className="text-muted mb-3">
                            {product.description}
                          </p>
      
                          <div className="row text-secondary">
                            <div className="col-md-4">
                              <strong>Name</strong>
                              <br />
                              {product.customerName}
                            </div>
      
                            <div className="col-md-4">
                              <strong>Phone</strong>
                              <br />
                              {product.customerPhone}
                            </div>
      
                            <div className="col-md-4">
                              <strong>Address</strong>
                              <br />
                              {product.address}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div> */}

              {/* Правая колонка — карта */}
              <div className="col-md-12">
                <h4>Укажите адрес на карте</h4>
                <p className="text-muted">
                  Нажмите на карту, чтобы поставить метку
                </p>
                <MapContainer
                  center={BISHKEK}
                  zoom={13}
                  style={{ height: 500, width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />
                  <MapClickHandler onMapClick={handleMapClick} />
                  <Marker position={[markerLat, markerLng]} />
                </MapContainer>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="col-lg-4">
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-header bg-primary text-white rounded-top-4">
                <h4 className="mb-0">Order Summary</h4>
              </div>

              <div className="card-body">
                <div className="d-flex justify-content-between mb-4">
                  <span>Total:</span>

                  <h3 className="text-success fw-bold">
                    $
                    {cart.reduce(
                      (total, product) => total + Number(product.price),
                      0
                    )}
                  </h3>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Customer Name
                  </label>

                  <input
                    type="text"
                    className="form-control rounded-3"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Phone Number</label>

                  <input
                    type="text"
                    className="form-control rounded-3"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Address</label>

                  <textarea
                    rows="3"
                    className="form-control rounded-3"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div className="d-grid gap-3">
                  <button
                    className="btn btn-success btn-lg"
                    onClick={addToCart}
                  >
                    Place Order
                  </button>

                  <a href="/orders" className="btn btn-outline-primary btn-lg">
                    View Orders
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

export default Checkout;