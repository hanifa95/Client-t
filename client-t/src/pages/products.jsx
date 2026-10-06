import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  // const [favorites, setFavorites] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [favorites, setFavorites] = useState(() => {
    return JSON.parse(localStorage.getItem("favorites")) || [];
  });

  const handleFavorite = (product) => {
    const exists = favorites.some((item) => item.id === product.id);

    let updated;

    if (exists) {
      updated = favorites.filter((item) => item.id !== product.id);
    } else {
      updated = [...favorites, product];
    }

    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "https://6a2fc982a7f8866418d5125a.mockapi.io/products"
      );
      if (response.status === 200) {
        setProducts(response.data);
      } else {
        console.error("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const categories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];

  const handleAddToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  // const handleFavorite = (product) => {
  //   const exists = favorites.some((item) => item.id === product.id);

  //   if (exists) {
  //     setFavorites(favorites.filter((item) => item.id !== product.id));
  //   } else {
  //     setFavorites([...favorites, product]);
  //   }
  // };

  const addToCart = async (product) => {
    console.log("Adding to cart:", product);
    const cartItem = {
      customerName: "test",
      customerPhone: "+99999999999",
      items: cart,
      address: "Ош",
      totalAmount: 25000,
      status: "confirmed",
      note: "test",
    };
    console.log("Cart item:", cartItem);

    try {
      const response = await axios.post(
        "https://6a2fc982a7f8866418d5125a.mockapi.io/orders",
        cartItem
      );
      if (response.status === 201) {
        console.log("Product added to cart successfully");
      } else {
        console.error("Failed to add product to cart");
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.description
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;

    const matchesMin =
      minPrice === "" || Number(product.price) >= Number(minPrice);

    const matchesMax =
      maxPrice === "" || Number(product.price) <= Number(maxPrice);

    return matchesSearch && matchesCategory && matchesMin && matchesMax;
  });

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-5">
          <h1 className="fw-bold text-success">🛍️ Product Store</h1>

          <a href="/orders">
            <button className="btn btn-success form-control">Order</button>
          </a>

          
          <a href="/inventory">
            <button className="btn btn-success ms-3 fw-bold">Inventory</button>
          </a>

          <a href="/clientPickupPoint">
            <button className="btn btn-success ms-3 fw-bold">PickupPoint</button>
          </a>



          {/* <span className="badge bg-success fs-6 px-3 py-2">
                {products.length} Products
              </span> */}

          <div className="d-flex gap-2">
            <span className="badge bg-danger fs-6 px-3 py-2">
              ❤️ {favorites.length}
            </span>

            <span className="badge bg-success fs-6 px-3 py-2">
              {products.length} Products
            </span>
          </div>
        </div>

        {/* Cart */}
        <div className="card shadow border-0 rounded-4 mb-5">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h3 className="fw-bold text-success">🛒 Shopping Cart</h3>

                {cart.length === 0 ? (
                  <p className="text-muted mb-0">Your cart is empty</p>
                ) : (
                  <ul className="list-group mt-3">
                    {cart.map((product) => (
                      <li
                        key={product.id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <span>{product.name}</span>

                        <span className="badge bg-success rounded-pill">
                          ${product.price}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <a href="/checkout">
                <button className="btn btn-success btn-lg rounded-pill px-4">
                  Checkout
                </button>
              </a>
            </div>
          </div>
        </div>

        {/* Favorites */}
        <div className="card shadow border-0 rounded-4 mb-5">
          <div className="card-body">
            <a href="/favorites">
              <button
                className="btn btn-danger"
                onClick={() => handleFavorite(product)}
              >
                {" "}
                ❤️Favorites
              </button>
            </a>

            <h3 className="fw-bold text-danger text-center p-3">
              ❤️ Favorite Products
            </h3>

            {favorites.length === 0 ? (
              <p className="text-muted">No favorite products</p>
            ) : (
              <ul className="list-group">
                {favorites.map((product) => (
                  <li
                    key={product.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <strong>{product.name}</strong>
                      <br />
                      <small>${product.price}</small>
                    </div>

                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleFavorite(product)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center mb-4">
            <div className="spinner-border text-success"></div>
          </div>
        )}

        {/*Search */}
        <div className="card shadow border-0 rounded-4 mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="🔍 Search by name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="col-md-2">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Min price"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
              </div>

              <div className="col-md-2">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Max price"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>

              <div className="col-md-4">
                <select
                  className="form-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="row g-4">
          {filteredProducts.map((product) => (
            <div className="col-sm-6 col-lg-4" key={product.id}>
              <div
                className="card border-0 shadow h-100 rounded-4"
                style={{
                  transition: "0.3s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-8px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="card-img-top p-4"
                  style={{
                    height: "260px",
                    objectFit: "contain",
                  }}
                />

                <div className="card-body d-flex flex-column">
                  {/* <h5 className="fw-bold">{product.name}</h5> */}

                  <h4 className="">
                    {product.description}
                  </h4>

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="text-success fw-bold">${product.price}</h4>

                    <span className="badge bg-secondary">
                      {product.category}
                    </span>
                  </div>

                  {/* <button
                    className="btn btn-success rounded-pill"
                    onClick={() => handleAddToCart(product)}
                  >
                    🛒 Add to Cart
                  </button> */}

                  <button
                    className="btn btn-success mb-3 "
                    onClick={() => handleAddToCart(product)}
                  >
                    🛒 Add to Cart
                  </button>

                  <button
                    className={`btn ${
                      favorites.some((item) => item.id === product.id)
                        ? "btn-danger"
                        : "btn-outline-danger"
                    }`}
                    onClick={() => handleFavorite(product)}
                  >
                    {favorites.some((item) => item.id === product.id)
                      ? "❤️"
                      : "🤍"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Products;
