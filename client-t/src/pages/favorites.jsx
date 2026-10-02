import { useEffect, useState } from "react";


function Favorites() {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("favorites")) || [];
        setFavorites(data);
    }, []);

    const removeFavorite = (id) => {
        const updated = favorites.filter((item) => item.id !== id);

        setFavorites(updated);
        localStorage.setItem("favorites", JSON.stringify(updated));
    };

    return (
        <div className="container py-5">
            
            <h1 className="mb-4 text-danger text-center p-3">❤️ Favorite Products</h1>
            

            {favorites.length === 0 ? (
                <h3>No favorite products</h3>
            ) : (
                <div className="row">
                    {favorites.map((product) => (
                        <div className="col-md-4 mb-4" key={product.id}>
                            <div className="card h-100 shadow">
                                <img
                                    src={product.image}
                                    className="card-img-top p-3"
                                    style={{
                                        height: "250px",
                                        objectFit: "contain",
                                    }}
                                    alt={product.name}
                                />

                                <div className="card-body">
                                    <h5>{product.name}</h5>
                                    <p>{product.description}</p>

                                    <h4 className="text-success">
                                        ${product.price}
                                    </h4>

                                    <button
                                        className="btn btn-danger"
                                        onClick={() => removeFavorite(product.id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Favorites;