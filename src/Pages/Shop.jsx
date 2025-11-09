import { useEffect, useState } from "react";
import { useOutletContext } from "react-router";
import "../styles/shop.css";

function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {
    cartItemsState,
    quantityState,
    cartItemQuantityState,
    uniqueCartItemsState,
    isCartEmptyState,
    handleIncrement,
    handleDecrement,
  } = useOutletContext();
  const [quantity, setQuantity] = quantityState;
  const [cartItems, setCartItems] = cartItemsState;
  const [cartItemQuantity, setCartItemQuantity] = cartItemQuantityState;
  const [uniqueCartItems, setUniqueCartItems] = uniqueCartItemsState;
  const [isCartEmpty, setIsCartEmpty] = isCartEmptyState;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://fakestoreapi.com/products");
        if (!response.ok) throw new Error("Not Found Page!");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const uniqueItems = cartItems.reduce((acc, val) => {
      const exist = acc.find((i) => i.id === val.id);
      if (!exist) acc.push(val);
      return acc;
    }, []);
    setUniqueCartItems(uniqueItems);
    setIsCartEmpty(false);
  }, [cartItems, setUniqueCartItems]);

  if (loading)
    return (
      <div className="status-message loading">
        <span className="spinner" />
        <p>Loading products, please wait...</p>
      </div>
    );

  if (error)
    return (
      <div className="status-message error">
        <span className="error-icon">⚠️</span>
        <p>A Network Error Occurred!</p>
      </div>
    );

  // 🛍️ Add to Cart + Animation Logic
  function handleAddtoCart(id, e) {
    // Add item to cart
    setCartItems((prev) => [...prev, products.find((elem) => elem.id === id)]);
    setCartItemQuantity((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + (quantity[id] || 1),
    }));
    setQuantity((prev) => ({
      ...prev,
      [id]: 1,
    }));

    // ✨ Animate product image → cart
    const card = e.target.closest(".card");
    const img = card?.querySelector("img");
    const cartIcon = document.querySelector(".nav-links a:last-child img");

    if (!img || !cartIcon) return;

    const flyingImg = img.cloneNode(true);
    const imgRect = img.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    flyingImg.style.position = "fixed";
    flyingImg.style.left = `${imgRect.left}px`;
    flyingImg.style.top = `${imgRect.top}px`;
    flyingImg.style.width = `${imgRect.width}px`;
    flyingImg.style.height = `${imgRect.height}px`;
    flyingImg.style.transition = "all 0.9s cubic-bezier(0.45, 0, 0.25, 1)";
    flyingImg.style.borderRadius = "12px";
    flyingImg.style.zIndex = "9999";
    flyingImg.style.pointerEvents = "none";

    document.body.appendChild(flyingImg);

    requestAnimationFrame(() => {
      flyingImg.style.left = `${cartRect.left + 15}px`;
      flyingImg.style.top = `${cartRect.top + 15}px`;
      flyingImg.style.width = "35px";
      flyingImg.style.height = "35px";
      flyingImg.style.opacity = "0.4";
      flyingImg.style.transform = "rotate(360deg)";
    });

    setTimeout(() => {
      flyingImg.remove();

      // 🛒 Add bounce + ripple
      cartIcon.classList.add("cart-bounce");
      const ripple = document.createElement("span");
      ripple.classList.add("cart-ripple");
      const cartParent = cartIcon.parentElement;
      cartParent.appendChild(ripple);

      // ✅ Toast notification
      const toast = document.createElement("div");
      toast.classList.add("toast");
      toast.textContent = "✅ Added to Cart";
      document.body.appendChild(toast);
      setTimeout(() => toast.classList.add("show"), 10);
      setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 400);
      }, 1600);

      setTimeout(() => {
        ripple.remove();
        cartIcon.classList.remove("cart-bounce");
      }, 1000);
    }, 900);
  }

  return (
    <>
      <h1 className="section-heading">Our Products</h1>
      <div className="card-container">
        {products.map((product) => (
          <div className="card" key={product.id}>
            <img src={product.image} alt={product.description} />
            <p className="product-title">{product.title}</p>
            <p className="price">${product.price}</p>
            <div className="quantity-control">
              <button
                onClick={() => handleDecrement(product.id)}
                disabled={quantity[product.id] <= 1}
              >
                -
              </button>
              <input
                type="number"
                min={1}
                value={quantity[product.id] || 1}
                readOnly
              />
              <button onClick={() => handleIncrement(product.id)}>+</button>
            </div>
            <button onClick={(e) => handleAddtoCart(product.id, e)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export default Shop;
