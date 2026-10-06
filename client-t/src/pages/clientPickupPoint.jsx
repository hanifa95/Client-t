import { useState } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Фикс иконки Leaflet + Vite
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Пункты выдачи
const pickupPoints = [
    {
        id: 1,
        name: "Пункт выдачи №1",
        address: "ул. Манаса, 25",
        city: "Бишкек",
        phone: "+996 555 123 456",
        schedule: "Пн–Сб: 09:00–20:00",
        status: "Открыт",
        lat: 42.8746,
        lng: 74.5698,
    },
    {
        id: 2,
        name: "Пункт выдачи №2",
        address: "ул. Киевская, 112",
        city: "Бишкек",
        phone: "+996 555 234 567",
        schedule: "Пн–Вс: 10:00–21:00",
        status: "Открыт",
        lat: 42.8715,
        lng: 74.6000,
    },
    {
        id: 3,
        name: "Пункт выдачи №3",
        address: "ул. Ахунбаева, 45",
        city: "Бишкек",
        phone: "+996 555 345 678",
        schedule: "Пн–Сб: 09:00–18:00",
        status: "Закрыт",
        lat: 42.8355,
        lng: 74.5900,
    },
];

// Центр карты
const DEFAULT_CENTER = [42.8746, 74.5698];

// Клик по карте
function MapClickHandler({ onMapClick }) {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng);
        },
    });

    return null;
}

const ClientPickupPoint = () => {
    const [selectedPoint, setSelectedPoint] = useState(
        pickupPoints[0]
    );

    const [search, setSearch] = useState("");

    const filteredPoints = pickupPoints.filter((point) => {
        const text = `
            ${point.name}
            ${point.address}
            ${point.city}
        `.toLowerCase();

        return text.includes(search.toLowerCase());
    });

    const handleSelectPoint = (point) => {
        setSelectedPoint(point);
    };

    return (
        <div
            className="min-vh-100 py-4"
            style={{
                backgroundColor: "#f5f7fb",
            }}
        >
            <div className="container">

                {/* Заголовок */}
                <div className="mb-4">
                    <h2 className="fw-bold mb-1">
                        Выберите пункт выдачи
                    </h2>

                    <p className="text-muted mb-0">
                        Выберите удобный пункт, где вы хотите получить заказ
                    </p>
                </div>

                <div className="row g-4">

                    {/* Левая часть */}
                    <div className="col-lg-5">

                        {/* Поиск */}
                        <div
                            className="card border-0 shadow-sm mb-3"
                            style={{
                                borderRadius: "16px",
                            }}
                        >
                            <div className="card-body p-3">
                                <div className="input-group">
                                    <span className="input-group-text bg-white border-end-0">
                                        <i className="bi bi-search text-muted"></i>
                                    </span>

                                    <input
                                        type="text"
                                        className="form-control border-start-0"
                                        placeholder="Поиск по адресу или пункту..."
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Список пунктов */}
                        <div
                            className="card border-0 shadow-sm"
                            style={{
                                borderRadius: "16px",
                            }}
                        >
                            <div className="card-body p-3">

                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="fw-bold mb-0">
                                        Пункты выдачи
                                    </h5>

                                    <span className="badge bg-primary rounded-pill">
                                        {filteredPoints.length}
                                    </span>
                                </div>

                                {filteredPoints.length === 0 ? (
                                    <div className="text-center py-5">
                                        <i className="bi bi-geo-alt fs-1 text-muted"></i>

                                        <p className="text-muted mt-3 mb-0">
                                            Пункты не найдены
                                        </p>
                                    </div>
                                ) : (
                                    filteredPoints.map((point) => (
                                        <div
                                            key={point.id}
                                            className={`p-3 mb-2 rounded-3 ${
                                                selectedPoint.id === point.id
                                                    ? "border border-primary bg-primary bg-opacity-10"
                                                    : "border bg-white"
                                            }`}
                                            style={{
                                                cursor: "pointer",
                                                transition: "0.2s",
                                            }}
                                            onClick={() =>
                                                handleSelectPoint(point)
                                            }
                                        >
                                            <div className="d-flex">

                                                {/* Иконка */}
                                                <div
                                                    className={`d-flex align-items-center justify-content-center rounded-3 me-3 ${
                                                        selectedPoint.id ===
                                                        point.id
                                                            ? "bg-primary text-white"
                                                            : "bg-light text-primary"
                                                    }`}
                                                    style={{
                                                        width: "45px",
                                                        height: "45px",
                                                        minWidth: "45px",
                                                    }}
                                                >
                                                    <i className="bi bi-shop fs-5"></i>
                                                </div>

                                                {/* Информация */}
                                                <div className="flex-grow-1">

                                                    <div className="d-flex justify-content-between align-items-start">
                                                        <h6 className="fw-bold mb-1">
                                                            {point.name}
                                                        </h6>

                                                        <span
                                                            className={`badge ${
                                                                point.status ===
                                                                "Открыт"
                                                                    ? "bg-success"
                                                                    : "bg-danger"
                                                            }`}
                                                        >
                                                            {point.status}
                                                        </span>
                                                    </div>

                                                    <div className="small text-muted mb-1">
                                                        <i className="bi bi-geo-alt me-2"></i>
                                                        {point.city},{" "}
                                                        {point.address}
                                                    </div>

                                                    <div className="small text-muted">
                                                        <i className="bi bi-clock me-2"></i>
                                                        {point.schedule}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Правая часть */}
                    <div className="col-lg-7">

                        {/* Карта */}
                        <div
                            className="card border-0 shadow-sm overflow-hidden mb-3"
                            style={{
                                borderRadius: "16px",
                            }}
                        >
                            <div
                                style={{
                                    height: "450px",
                                }}
                            >
                                <MapContainer
                                    center={[
                                        selectedPoint.lat,
                                        selectedPoint.lng,
                                    ]}
                                    zoom={13}
                                    style={{
                                        height: "100%",
                                        width: "100%",
                                    }}
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    />

                                    {pickupPoints.map((point) => (
                                        <Marker
                                            key={point.id}
                                            position={[
                                                point.lat,
                                                point.lng,
                                            ]}
                                            eventHandlers={{
                                                click: () =>
                                                    handleSelectPoint(point),
                                            }}
                                        >
                                            <Popup>
                                                <div>
                                                    <h6 className="fw-bold mb-2">
                                                        {point.name}
                                                    </h6>

                                                    <div className="small mb-1">
                                                        <i className="bi bi-geo-alt me-2 text-danger"></i>
                                                        {point.address}
                                                    </div>

                                                    <div className="small">
                                                        <i className="bi bi-clock me-2 text-warning"></i>
                                                        {point.schedule}
                                                    </div>
                                                </div>
                                            </Popup>
                                        </Marker>
                                    ))}

                                    <MapClickHandler
                                        onMapClick={() => {}}
                                    />
                                </MapContainer>
                            </div>
                        </div>

                        {/* Выбранный пункт */}
                        <div
                            className="card border-0 shadow-sm"
                            style={{
                                borderRadius: "16px",
                            }}
                        >
                            <div className="card-body p-4">

                                <div className="d-flex align-items-center mb-4">

                                    <div
                                        className="d-flex align-items-center justify-content-center bg-primary text-white rounded-3 me-3"
                                        style={{
                                            width: "55px",
                                            height: "55px",
                                        }}
                                    >
                                        <i className="bi bi-shop fs-4"></i>
                                    </div>

                                    <div>
                                        <h4 className="fw-bold mb-1">
                                            {selectedPoint.name}
                                        </h4>

                                        <span className="badge bg-success">
                                            <i className="bi bi-check-circle me-1"></i>
                                            {selectedPoint.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="row g-3 mb-4">

                                    <div className="col-md-6">
                                        <div className="d-flex">
                                            <i className="bi bi-geo-alt text-danger fs-5 me-3"></i>

                                            <div>
                                                <small className="text-muted">
                                                    Адрес
                                                </small>

                                                <div className="fw-semibold">
                                                    {selectedPoint.city},{" "}
                                                    {selectedPoint.address}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="d-flex">
                                            <i className="bi bi-clock text-warning fs-5 me-3"></i>

                                            <div>
                                                <small className="text-muted">
                                                    График работы
                                                </small>

                                                <div className="fw-semibold">
                                                    {selectedPoint.schedule}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="d-flex">
                                            <i className="bi bi-telephone text-success fs-5 me-3"></i>

                                            <div>
                                                <small className="text-muted">
                                                    Телефон
                                                </small>

                                                <div className="fw-semibold">
                                                    {selectedPoint.phone}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="d-flex">
                                            <i className="bi bi-pin-map text-primary fs-5 me-3"></i>

                                            <div>
                                                <small className="text-muted">
                                                    Координаты
                                                </small>

                                                <div className="fw-semibold">
                                                    {selectedPoint.lat.toFixed(
                                                        4
                                                    )}
                                                    ,{" "}
                                                    {selectedPoint.lng.toFixed(
                                                        4
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Кнопка */}
                                <button
                                    className="btn btn-primary btn-lg w-100"
                                    disabled={
                                        selectedPoint.status !==
                                        "Открыт"
                                    }
                                    style={{
                                        borderRadius: "10px",
                                    }}
                                    onClick={() => {
                                        console.log(
                                            "Выбран пункт:",
                                            selectedPoint
                                        );
                                    }}
                                >
                                    <i className="bi bi-check2-circle me-2"></i>

                                    {selectedPoint.status === "Открыт"
                                        ? "Выбрать этот пункт"
                                        : "Пункт закрыт"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientPickupPoint;
