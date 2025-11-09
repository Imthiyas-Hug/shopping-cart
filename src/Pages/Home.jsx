import { useNavigate } from "react-router";
import "../styles/home.css"
function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <h1>Welcome to Our Shop</h1>
      <p>Discover our amazing products with the best quality and prices.</p>
      <button onClick={() => navigate("shop")}>Shop Now</button>

      <div>
        <div>
          <p>Quality Products</p>
          <p>
            All our products are carefully selected to ensure the highest
            quality.
          </p>
        </div>
        <div>
          <p>Fast Shipping</p>
          <p>We deliver your orders quickly and safely to your doorstep.</p>
        </div>
        <div>
          <p>24/7 Support</p>
          <p>Our customer service team is always ready to assist you.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
