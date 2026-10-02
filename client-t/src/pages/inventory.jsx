import axios from "axios";
import { useEffect, useState } from "react";

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("all");

  const getProducts = async () => {
    try {
      const response = await axios.get(
        "https://6a2fc982a7f8866418d5125a.mockapi.io/products"
      );

      setProducts(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке товаров:", error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const updateProduct = async (product) => {
    try {
      await axios.put(
        `https://6a2fc982a7f8866418d5125a.mockapi.io/products/${product.id}`,
        product
      );
    } catch (error) {
      console.error("Ошибка при обновлении товара:", error);
    }
  };

  const increase = (product) => {
    const updated = {
      ...product,
      quantity: (product.quantity || 0) + 1,
      inStock: true,
    };

    setProducts((prevProducts) =>
      prevProducts.map((p) => (p.id === product.id ? updated : p))
    );

    updateProduct(updated);
  };

  const decrease = (product) => {
    let qty = (product.quantity || 0) - 1;

    if (qty < 0) qty = 0;

    const updated = {
      ...product,
      quantity: qty,
      inStock: qty > 0,
    };

    setProducts((prevProducts) =>
      prevProducts.map((p) => (p.id === product.id ? updated : p))
    );

    updateProduct(updated);
  };

  const toggleStock = (product) => {
    const updated = {
      ...product,
      inStock: !product.inStock,
    };

    setProducts((prevProducts) =>
      prevProducts.map((p) => (p.id === product.id ? updated : p))
    );

    updateProduct(updated);
  };

  // Фильтрация товаров
  const filteredProducts = products.filter((product) => {
    if (filter === "inStock") {
      return product.inStock === true;
    }

    if (filter === "outOfStock") {
      return product.inStock === false;
    }

    return true;
  });

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Склад товаров</h2>

      {/* Фильтр */}
      <div className="d-flex justify-content-center gap-2 mb-4">
        <button
          className={`btn ${
            filter === "all" ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => setFilter("all")}
        >
          Все товары
        </button>

        <button
          className={`btn ${
            filter === "inStock" ? "btn-success" : "btn-outline-success"
          }`}
          onClick={() => setFilter("inStock")}
        >
          В наличии
        </button>

        <button
          className={`btn ${
            filter === "outOfStock" ? "btn-danger" : "btn-outline-danger"
          }`}
          onClick={() => setFilter("outOfStock")}
        >
          Нет в наличии
        </button>
      </div>

      {/* Таблица */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover text-center align-middle">
          <thead className="table-primary">
            <tr>
              <th>Изображение</th>
              <th>Название</th>
              <th>Количество</th>
              <th>Статус</th>
              <th>Управление</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <img
                      src={product.image}
                      width="60"
                      height="60"
                      alt={product.title}
                      className="rounded"
                      style={{ objectFit: "cover" }}
                    />
                  </td>

                  <td>{product.title}</td>

                  <td>
                    <strong>{product.quantity || 0}</strong>
                  </td>

                  <td>
                    {product.inStock ? (
                      <span className="badge bg-success">
                        В наличии
                      </span>
                    ) : (
                      <span className="badge bg-danger">
                        Нет в наличии
                      </span>
                    )}
                  </td>

                  <td>
                    <button
                      className="btn btn-success me-2"
                      onClick={() => increase(product)}
                    >
                      +
                    </button>

                    <button
                      className="btn btn-warning me-2"
                      onClick={() => decrease(product)}
                      disabled={(product.quantity || 0) === 0}
                    >
                      -
                    </button>

                    <button
                      className="btn btn-info"
                      onClick={() => toggleStock(product)}
                    >
                      Изменить статус
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-4">
                  Товаров в этой категории нет
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Количество товаров */}
      <div className="text-center mt-3">
        Показано товаров: <strong>{filteredProducts.length}</strong>
      </div>
    </div>
  );
};

export default Inventory;
