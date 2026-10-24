import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import ProtectedRoute from "./components/protectedRoute";
import Login from "./pages/login";
import Products from "./pages/products";
import Checkout from "./pages/checkout";
import Orders from "./pages/orders";
import Profile from "./pages/profile";
import Registration from "./pages/registration";
import Login2 from "./pages/login2";
import Edit from "./pages/edit";
import Favorites from "./pages/favorites";
import Inventory from "./pages/inventory";
import OrdersDetail from "./pages/orders-details";
import ClientPickupPoint from "./pages/clientPickupPoint";
import PickupPointsList from "./pages/pickupPointsLists";




function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            }
          />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login2" element={<Login2 />} />
          <Route path='/edit/:id' element={<Edit/>} />
          <Route path='/favorites' element={<Favorites/>} />
          <Route path='/inventory' element={<Inventory/>} />
          <Route path="/orders/:id" element={<OrdersDetail />} />
          <Route path="/clientPickupPoint" element={<ClientPickupPoint/>} />
          <Route path="/pickupPointsList" element={<PickupPointsList/>} />
          
          
        </Routes>
      </Router>
    </div>
  );
}

export default App;
