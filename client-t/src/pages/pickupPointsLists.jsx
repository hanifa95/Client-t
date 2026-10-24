import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import L from "leaflet";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";

import "leaflet/dist/leaflet.css";
import "bootstrap/dist/css/bootstrap.min.css";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const API_URL = "https://6953a084a319a928023c1129.mockapi.io/pickupPoints";

const BISHKEK = [42.8746, 74.5698];

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Приведение координат к числам.
// Поддерживаются lat/long и latitude/longitude.
function getCoordinates(point) {
  const lat = Number(point.lat ?? point.latitude);
  const lng = Number(point.long ?? point.lng ?? point.longitude);

  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lng) ||
    lat < -90 ||
    lat > 90 ||
    lng < -180 ||
    lng > 180
  ) {
    return null;
  }

  return [lat, lng];
}

// Автоматически перемещаем карту к выбранному пункту
function MapFocus({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 16, { duration: 0.7 });
    }
  }, [position, map]);

  return null;
}

export default function PickupPointsList() {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Все");
  const [selectedPoint, setSelectedPoint] = useState(null);
  const mapSectionRef = useRef(null);

  const [mapSearch, setMapSearch] = useState("");
  const [mapResults, setMapResults] = useState([]);
  const [mapSearchLoading, setMapSearchLoading] = useState(false);
  const [mapSearchError, setMapSearchError] = useState("");
  const [mapPosition, setMapPosition] = useState(null);

  // Загрузка всех пунктов из MockAPI
  async function loadPoints() {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(API_URL);
      const data = Array.isArray(response.data) ? response.data : [];

      setPoints(data);
    } catch (err) {
      console.error("Ошибка загрузки пунктов:", err);
      setError(
        "Не удалось загрузить пункты выдачи. Проверь URL MockAPI и подключение к интернету."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPoints();
  }, []);

  // Поиск по названию, адресу и телефону
  const filteredPoints = useMemo(() => {
    const query = search.trim().toLowerCase();

    return points.filter((point) => {
      const matchesSearch = [point.name, point.address, point.phone].some(
        (value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(query)
      );

      const status = point.status || "Открыт";

      const matchesStatus = statusFilter === "Все" || status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [points, search, statusFilter]);

  const openCount = points.filter(
    (point) => (point.status || "Открыт") === "Открыт"
  ).length;

  const closedCount = points.filter(
    (point) => point.status === "Закрыт"
  ).length;

  const temporaryCount = points.filter(
    (point) => point.status === "Временно закрыт"
  ).length;

  const selectedPosition = selectedPoint ? getCoordinates(selectedPoint) : null;

  const mapCenter = selectedPosition || BISHKEK;

  function getStatusClass(status) {
    if (status === "Открыт") return "success";
    if (status === "Закрыт") return "danger";
    return "warning";
  }

  function selectPoint(point) {
    const position = getCoordinates(point);

    if (!position) return;

    setSelectedPoint(point);
    setMapPosition(position);

    mapSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  async function handleMapSearch(e) {
    e?.preventDefault();

    const query = mapSearch.trim();

    if (!query) return;

    setMapSearchLoading(true);
    setMapSearchError("");
    setMapResults([]);

    try {
      const response = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            format: "jsonv2",
            q: query,
            countrycodes: "kg",
            limit: 5,
            addressdetails: 1,
          },
          headers: {
            "Accept-Language": "ru",
          },
        }
      );

      if (response.data.length === 0) {
        setMapSearchError("Адрес не найден. Попробуйте уточнить запрос.");
      } else {
        setMapResults(response.data);
      }
    } catch (err) {
      console.error("Ошибка поиска адреса:", err);
      setMapSearchError("Не удалось выполнить поиск. Попробуйте ещё раз.");
    } finally {
      setMapSearchLoading(false);
    }
  }

  function selectMapAddress(result) {
    const position = [Number(result.lat), Number(result.lon)];

    setMapPosition(position);
    setMapSearch(result.display_name);
    setMapResults([]);
    setMapSearchError("");
  }

  return (
    <div
      className="container-fluid py-4 px-3 px-lg-4"
      style={{
        background: "#f5f7fb",
        minHeight: "100vh",
      }}
    >
      {/* Заголовок */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">📦 Все пункты выдачи</h2>
        </div>

        <button
          className="btn btn-primary"
          onClick={loadPoints}
          disabled={loading}
        >
          {loading ? "Загрузка..." : "↻ Обновить список"}
        </button>
      </div>

      {/* Ошибка */}
      {error && (
        <div className="alert alert-danger">
          {error}
          <button
            className="btn btn-sm btn-outline-danger ms-3"
            onClick={loadPoints}
          >
            Повторить
          </button>
        </div>
      )}

      {/* Статистика */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="text-muted small">Всего пунктов</div>
              <h3 className="fw-bold mb-0">{points.length}</h3>
            </div>
          </div>
        </div>

        <div className="col-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="text-muted small">🟢 Открыты</div>
              <h3 className="fw-bold text-success mb-0">{openCount}</h3>
            </div>
          </div>
        </div>

        <div className="col-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="text-muted small">🔴 Закрыты</div>
              <h3 className="fw-bold text-danger mb-0">{closedCount}</h3>
            </div>
          </div>
        </div>

        <div className="col-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="text-muted small">🟡 Временно закрыты</div>
              <h3 className="fw-bold text-warning mb-0">{temporaryCount}</h3>
            </div>
          </div>
        </div>
      </div>

 

   

      {/* Поиск адреса на карте */}

      {/* Поиск адреса на карте и главная карта */}
      <div ref={mapSectionRef}>
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-3 p-md-4">
            <form onSubmit={handleMapSearch}>
              <label className="form-label fw-semibold">
                🔎 Поиск адреса на карте
              </label>

              <div className="input-group">
                <input
                  type="search"
                  className="form-control"
                  placeholder="Введите улицу, дом или адрес в Бишкеке..."
                  value={mapSearch}
                  onChange={(e) => {
                    setMapSearch(e.target.value);
                    setMapResults([]);
                    setMapSearchError("");
                  }}
                />

                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={mapSearchLoading || !mapSearch.trim()}
                >
                  {mapSearchLoading ? "Поиск..." : "Найти"}
                </button>
              </div>
            </form>

            {mapSearchError && (
              <div className="alert alert-warning mt-3 mb-0">
                {mapSearchError}
              </div>
            )}

            {mapResults.length > 0 && (
              <div className="list-group mt-3">
                {mapResults.map((result) => (
                  <button
                    key={result.place_id}
                    type="button"
                    className="list-group-item list-group-item-action"
                    onClick={() => selectMapAddress(result)}
                  >
                    📍 {result.display_name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Главная карта */}
        {/* Здесь оставь существующую карточку с MapContainer */}
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-3 p-md-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
            <div>
              <h5 className="fw-bold mb-1">🗺 Карта пунктов выдачи</h5>
              <p className="text-muted small mb-0">
                Маркеры соответствуют отфильтрованным пунктам
              </p>
            </div>

            <span className="badge text-bg-primary">
              {filteredPoints.filter((point) => getCoordinates(point)).length}{" "}
              на карте
            </span>
          </div>

          <div
            style={{
              height: 420,
              width: "100%",
              borderRadius: 12,
              overflow: "hidden",
              border: "1px solid #dee2e6",
            }}
          >
            <MapContainer
              center={mapCenter}
              zoom={12}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              <MapFocus position={mapPosition || selectedPosition} />

              {filteredPoints.map((point) => {
                const position = getCoordinates(point);

                if (!position) return null;

                return (
                  <Marker key={point.id} position={position}>
                    <Popup>
                      <strong>{point.name || "Пункт выдачи"}</strong>
                      <br />
                      📍 {point.address || "Адрес не указан"}
                      <br />☎ {point.phone || "Телефон не указан"}
                      <br />
                      🕒 {point.schedule || "График не указан"}
                      <br />
                      Статус: {point.status || "Открыт"}
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>

          {filteredPoints.some((point) => !getCoordinates(point)) && (
            <div className="alert alert-warning mt-3 mb-0 small">
              Некоторые пункты не отображаются на карте, потому что у них
              отсутствуют корректные координаты lat и long.
            </div>
          )}
        </div>
      </div>

      {/* Список карточек */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <h5 className="fw-bold mb-0">Список пунктов</h5>

        <span className="text-muted small">
          Найдено: {filteredPoints.length}
        </span>
      </div>

      {loading ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <div className="spinner-border text-primary mb-3" role="status" />
            <p className="text-muted mb-0">Загружаем пункты выдачи...</p>
          </div>
        </div>
      ) : filteredPoints.length === 0 ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <div style={{ fontSize: 42 }}>📭</div>
            <h5 className="mt-3">Пункты выдачи не найдены</h5>
            <p className="text-muted mb-3">
              {points.length === 0
                ? "В базе пока нет пунктов выдачи."
                : "Измени поисковый запрос или фильтр."}
            </p>

            <button
              className="btn btn-outline-primary"
              onClick={() => {
                setSearch("");
                setStatusFilter("Все");
              }}
            >
              Сбросить фильтры
            </button>
          </div>
        </div>
      ) : (
        <div className="row g-3">
          {filteredPoints.map((point) => (
            <div className="col-md-6 col-xl-4" key={point.id}>
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start gap-2 mb-3">
                    <div>
                      <div className="text-muted small mb-1">
                        ID: {point.id}
                      </div>
                      <h5 className="fw-bold mb-0">
                        {point.name || "Без названия"}
                      </h5>
                    </div>

                    <span
                      className={`badge text-bg-${getStatusClass(
                        point.status || "Открыт"
                      )}`}
                    >
                      {point.status || "Открыт"}
                    </span>
                  </div>

                  <hr />

                  <div className="mb-3">
                    <div className="text-muted small mb-1">📍 Адрес</div>
                    <div>{point.address || "Не указан"}</div>
                  </div>

                  <div className="mb-3">
                    <div className="text-muted small mb-1">☎ Телефон</div>
                    <div>
                      {point.phone ? (
                        <a
                          href={`tel:${point.phone.replace(/[^\d+]/g, "")}`}
                          className="text-decoration-none"
                        >
                          {point.phone}
                        </a>
                      ) : (
                        "Не указан"
                      )}
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="text-muted small mb-1">
                      🕒 График работы
                    </div>
                    <div>{point.schedule || "Не указан"}</div>
                  </div>

                  {getCoordinates(point) && (
                    <div className="text-muted small mb-3">
                      🌐 {getCoordinates(point)[0].toFixed(6)}
                      {", "}
                      {getCoordinates(point)[1].toFixed(6)}
                    </div>
                  )}

                  <button
                    className="btn btn-outline-primary w-100"
                    disabled={!getCoordinates(point)}
                    onClick={() => selectPoint(point)}
                  >
                    <span className="me-1">📍</span>
                    Показать на карте
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-center text-muted small mt-4">
        Всего в базе: {points.length} пунктов выдачи
      </div>
    </div>
  );
}
