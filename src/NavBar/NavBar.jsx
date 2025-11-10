import { NavLink, Outlet } from "react-router";
import cartIcon from "../assets/cart.svg";
import cartIcon2 from "../assets/icons8-cart-32.png";

import { useState } from "react";

function NavBar() {
  const [quantity, setQuantity] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [cartItemQuantity, setCartItemQuantity] = useState({});
  const [uniqueCartItems, setUniqueCartItems] = useState([]);
  const [isCartEmpty, setIsCartEmpty] = useState([true]);

  function handleIncrement(id) {
    setQuantity((prev) => ({
      ...prev,
      [id]: (prev[id] || 1) + 1,
    }));
  }

  function handleDecrement(id) {
    setQuantity((prev) => ({
      ...prev,
      [id]: prev[id] - 1,
    }));
  }

  function handleIncrement2(id) {
    setCartItemQuantity((prev) => ({
      ...prev,
      [id]: (prev[id] || 1) + 1,
    }));
  }

  function handleDecrement2(id) {
    setCartItemQuantity((prev) => ({
      ...prev,
      [id]: prev[id] - 1,
    }));
  }

  function handleRemove(id) {
    const newCartItems = uniqueCartItems.filter((item) => item.id !== id);
    setUniqueCartItems(newCartItems);
    setCartItems(newCartItems);
    if (newCartItems.length == "0") {
      setIsCartEmpty(true);
    }
    setCartItemQuantity((prev) => ({
      ...prev,
      [id]: 0,
    }));
  }

  return (
    <div>
      <div className="header">
        <h1>
          {" "}
          <img src={cartIcon2} />
          Shopping Cart
        </h1>
        <ul className="nav-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="shop">Shop</NavLink>
          <NavLink to="cart">
            <img src={cartIcon} width={25} />
            <button>{uniqueCartItems.length}</button>
          </NavLink>
        </ul>
      </div>
      <main>
        <Outlet
          context={{
            quantityState: [quantity, setQuantity],
            cartItemQuantityState: [cartItemQuantity, setCartItemQuantity],
            cartItemsState: [cartItems, setCartItems],
            uniqueCartItemsState: [uniqueCartItems, setUniqueCartItems],
            isCartEmptyState: [isCartEmpty, setIsCartEmpty],
            handleIncrement,
            handleDecrement,
            handleIncrement2,
            handleDecrement2,
            handleRemove,
          }}
        />
      </main>
    </div>
  );
}
export default NavBar;
