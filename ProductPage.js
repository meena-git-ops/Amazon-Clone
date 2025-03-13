import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./productpage.css";
import Rating from "../imgs/rating.png";
import added from "../imgs/added.png";
import add from "../imgs/not-added.png";
import { AddToCart, RemoveCart } from "../action/Cart";
import { useSelector, useDispatch } from "react-redux";
import VanillaTilt from "vanilla-tilt";
import LowerNav from "./LowerNav";

function ProductPage() {
  const { id } = useParams();
  const location = useLocation();
  const [product, setProduct] = useState(location.state?.product || null);
  const [Size, setSize] = useState("");
  const [AddedIds, setAddedIds] = useState([]);
  const [reviews, setReviews] = useState(null);
  const Quantity = 1;
  const CartItems = useSelector((state) => state.CartItemsAdded.CartItems);
  const dispatch = useDispatch();
  const tiltRef = useRef(null);

  document.title = `${product ? product.title : "Amazon"}`;

  // Manually added products (Including Jewelry Products)
  const manualProducts = [
    // Jewelry Products from Jewelery.js
    {
      id: 101,
      title: "Gold-Plated Necklace with Pendant",
      category: "jewelery",
      image: "/jwelery.jpg",
      price: 2999,
      reviewNumber: 120,
      description: "A stunning gold-plated necklace with a beautiful pendant for any occasion.",
    },
    {
      id: 102,
      title: "Elegant Gold Bracelet",
      category: "jewelery",
      image: "/jwelery2.jpg",
      price: 4999,
      reviewNumber: 85,
      description: "A premium gold bracelet with an elegant design.",
    },
    {
      id: 103,
      title: "Diamond Stud Earrings",
      category: "jewelery",
      image: "/jwelery3.jpg",
      price: 3999,
      reviewNumber: 95,
      description: "Shiny and elegant diamond stud earrings that elevate any look.",
    },
    {
      id: 104,
      title: "Luxury Diamond Ring",
      category: "jewelery",
      image: "/jwelery4.jpg",
      price: 7999,
      reviewNumber: 110,
      description: "A high-end luxury diamond ring for special occasions.",
    },

    // Existing manually added products
    {
      id: 1578,
      title: "Men's Casual Shirt",
      image: "/men-clothes.jpg",
      category: "men's clothing",
      price: 29.99,
      reviewNumber: 120,
      description: "A stylish and comfortable men's casual shirt for everyday wear.",
    },
    {
      id: 1579,
      title: "Men's Fashionable Jacket",
      image: "/menclothes2.jpg",
      category: "men's clothing",
      price: 49.99,
      reviewNumber: 110,
      description: "A trendy and warm jacket, perfect for winter fashion.",
    },
    {
      id: 9992,
      title: "ONLCERA 3/4 SHORT DRESS WV Black",
      price: 49.99,
      category: "women's clothing",
      image: "/womenclothes1.jpg",
      reviewNumber: 80,
      description: "A beautiful short dress with an elegant design.",
    },
    {
      id: 8881,
      title: "All-in-One Wireless Printer with Scanner & Copier",
      price: 79.99,
      category: "electronics",
      image: "/printer.jpg",
      reviewNumber: 95,
      description: "An efficient all-in-one printer with scanning and copying capabilities.",
    },
    {
      id: 8882,
      title: "UltraFast Pro Laptop 15.6” with Intel i7 & 16GB RAM",
      price: 129.99,
      category: "electronics",
      image: "/laptop.jpg",
      reviewNumber: 110,
      description: "A powerful laptop for professionals and gamers.",
    },
  ];

  useEffect(() => {
    if (!product) {
      const fetchProduct = async () => {
        try {
          // Check if the product is manually added
          const foundManualProduct = manualProducts.find((p) => p.id == id);
          if (foundManualProduct) {
            setProduct(foundManualProduct);
            return;
          }

          // Otherwise, fetch from API
          const response = await fetch(`https://fakestoreapi.com/products/${id}`);
          if (!response.ok) throw new Error("Product not found");
          const data = await response.json();
          setProduct(data);
        } catch (error) {
          console.error("Error fetching product:", error);
          setProduct(null);
        }
      };
      fetchProduct();
    }

    setReviews(Math.floor(Math.random() * 81) + 20);
  }, [id, product]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setAddedIds(CartItems.map((item) => item.id));
  }, [CartItems]);

  const isAdded = (itemId) => AddedIds.includes(itemId);

  useEffect(() => {
    if (tiltRef.current) {
      VanillaTilt.init(tiltRef.current, {
        max: 10,
        speed: 100,
        transition: true,
        easing: "ease-out",
      });
    }
  }, []);

  const handleAddToCart = () => {
    if (!isAdded(product.id)) {
      const item = {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        size: Size,
        category: product.category,
        quantity: Quantity,
      };
      dispatch(AddToCart(item));
    } else {
      dispatch(RemoveCart(product.id));
    }
  };

  const handleBuyNow = () => {
    if (!isAdded(product.id)) {
      const item = {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        size: Size,
        category: product.category,
        quantity: Quantity,
      };
      dispatch(AddToCart(item));
    }
  };

  if (product === null) {
    return (
      <>
        <Navbar />
        <div className="loading-container">
          <h2>Loading product...</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{ height: "100%" }} className="product-page">
        <div className="product-dataa animate">
          <div className="item-image">
            <img ref={tiltRef} src={product.image} className="item-img img-style" alt={product.title} />
          </div>
          <div className="product-details">
            <p className="item-title">{product.title}</p>
            <p className="item-desc">{product.description}</p>
            <div className="price-section">
              <div className="item-rating">
                {[...Array(5)].map((_, index) => (
                  <img key={index} src={Rating} className="rating-img" alt="rating" />
                ))}
                <p className="rating-no">({reviews})</p>
              </div>
            </div>
            <hr className="horizontal" />

            <div className="product-actual-price">
              <p className="price-one">Price:</p>
              <p className="price-two">₹{product.price}</p>
              <p className="mrp">₹{Math.round(product.price * 1.66)}</p>
            </div>

            <div className="buying-buttons">
              <Link to="/cart">
                <button onClick={handleBuyNow} className="buy-btn">Buy Now</button>
              </Link>
              <button onClick={handleAddToCart} className="add-cart-btn">
                <img src={isAdded(product.id) ? added : add} className="cart-img" alt="add" />
                <p className="cart-text">{isAdded(product.id) ? "Added" : "Add"}</p>
              </button>
            </div>
          </div>
        </div>
      </div>
      <LowerNav />
      <Footer />
    </>
  );
}

export default ProductPage;
