import { useNavigate, useOutletContext } from "react-router";
import "../styles/Cart.css";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import emptyCartIcon from "../assets/shopping-cart_18851977.png";
function Cart() {
  const navigate = useNavigate();
  const {
    cartItemQuantityState,
    uniqueCartItemsState,
    isCartEmptyState,
    handleIncrement2,
    handleDecrement2,
    handleRemove,
  } = useOutletContext();

  const [cartItemQuantity] = cartItemQuantityState;
  const [uniqueCartItems] = uniqueCartItemsState;
  const [isCartEmpty, setIsCartEmpty] = isCartEmptyState;
  const [totalPrice, setTotalPrice] = useState(0);


  useEffect(() => {
    const total = uniqueCartItems.reduce((sum, item) => {
      const qty = Number(cartItemQuantity[item.id]);
      return sum + item.price * qty;
    }, 0);

    setTotalPrice(total);
  }, [uniqueCartItems, cartItemQuantity]);


  const showToast = (message, type = "success") => {
    const emoji = type === "error" ? "❌ " : "✅ ";
    const toast = document.createElement("div");
    toast.classList.add(
      "toast",
      type === "error" ? "toast-error" : "toast-success"
    );
    toast.textContent = emoji + message;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add("show"), 10);
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 400);
    }, 1600);
  };


  const handleCheckoutClick = () => {
    const duration = 3500;
    const animationEnd = Date.now() + duration;

    const colors = [
      "#10b981",
      "#34d399",
      "#facc15",
      "#3b82f6",
      "#f472b6",
      "#ef4444",
    ];

    const defaults = {
      spread: 140,
      ticks: 100,
      gravity: 0.85,
      scalar: 1.1,
      colors,
      origin: { y: 0.6 },
    };

    // 🧨 First burst
    confetti({
      ...defaults,
      particleCount: 180,
      startVelocity: 45,
      origin: { y: 0.6 },
    });

    // 🌈 Side bursts
    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 60 * (timeLeft / duration);
      const side = Math.random() < 0.5 ? 0 : 1;

      confetti({
        ...defaults,
        particleCount,
        startVelocity: 40,
        angle: side === 0 ? 60 : 120,
        drift: side === 0 ? 0.4 : -0.4,
        origin: { x: side, y: Math.random() * 0.4 + 0.1 },
        scalar: Math.random() * 0.9 + 0.8,
      });
    }, 200);

    // ✨ Finale burst
    setTimeout(() => {
      confetti({
        ...defaults,
        particleCount: 200,
        spread: 160,
        startVelocity: 55,
        scalar: 1.3,
        ticks: 120,
      });
    }, duration - 500);

    // ✅ Checkout Toast
    showToast("Order checkout started!", "success");
  };


  const handleRemoveWithEffect = (id) => {
    const itemEl = document.querySelector(`.cart-item-box[data-id='${id}']`);
    if (itemEl) {
      itemEl.classList.add("removing");
      setTimeout(() => {
        handleRemove(id);
        showToast("Item removed from cart", "error");
      }, 350);
    } else {
      handleRemove(id);
      showToast("Item removed from cart", "error");
    }
  };

  return (
    <div>
      <h1 className="section-heading">Your Cart</h1>

      {(uniqueCartItems.length < 1) && (
        <div className="cart-empty">
          <img src={emptyCartIcon} alt="Empty cart" />
          <p>Your cart is empty</p>
          <button onClick={() => navigate("/shop")}>Continue Shopping</button>
        </div>
      )}

      {(uniqueCartItems.length > 0) && (
      <div className="cart-container">
        <div className="cart-items">
          <p className="cart-items-title">
            Cart Items ({uniqueCartItems.length})
          </p>

          {uniqueCartItems.map((cartItem) => (
            <div
              className="cart-item-box"
              key={cartItem.id}
              data-id={cartItem.id}
            >
              <div className="cart-item-row">
                <div className="cart-thumb">
                  <img src={cartItem.image} alt={cartItem.title} />
                </div>

                <div className="cart-details">
                  <p className="cart-title">{cartItem.title}</p>
                  <p className="cart-price">
                    $
                    {(cartItem.price * cartItemQuantity[cartItem.id]).toFixed(
                      2
                    )}
                  </p>
                </div>

                <div className="cart-actions-col">
                  <div className="qty-a">
                    <button
                      className="q-btn"
                      onClick={() => handleDecrement2(cartItem.id)}
                      disabled={cartItemQuantity[cartItem.id] <= 1}
                    >
                      −
                    </button>

                    <input
                      type="number"
                      min={1}
                      value={cartItemQuantity[cartItem.id]}
                      readOnly
                    />

                    <button
                      onClick={() => handleIncrement2(cartItem.id)}
                      className="q-btn"
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveWithEffect(cartItem.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2 className="summary-title">Order Summary</h2>
          <p className="cart-total">
            Total: <span>${(totalPrice || 0).toFixed(2)}</span>
          </p>
          <button className="checkout-btn" onClick={handleCheckoutClick}>
            Proceed to Checkout
          </button>
          <p onClick={() => navigate("/shop")} className="continue-link">
            Continue Shopping
          </p>
        </div>
      </div>
      )}

    </div>
  );
}

export default Cart;
