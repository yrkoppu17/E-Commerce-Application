import { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const items = localStorage.getItem('cartItems');
    if (items) {
      setCartItems(JSON.parse(items));
    }
  }, []);

  const saveCart = (items) => {
    setCartItems(items);
    localStorage.setItem('cartItems', JSON.stringify(items));
  };

  const addToCart = (product, qty = 1) => {
    const existItem = cartItems.find((x) => x.product === product._id);

    let newItems;
    if (existItem) {
      const newQty = Math.min(existItem.qty + qty, product.stockQuantity);
      newItems = cartItems.map((x) =>
        x.product === product._id ? { ...existItem, qty: newQty } : x
      );
    } else {
      newItems = [
        ...cartItems,
        {
          product: product._id,
          name: product.name,
          image: product.images[0],
          price: product.price,
          stockQuantity: product.stockQuantity,
          qty: Math.min(qty, product.stockQuantity),
        },
      ];
    }
    saveCart(newItems);
  };

  const removeFromCart = (id) => {
    const newItems = cartItems.filter((x) => x.product !== id);
    saveCart(newItems);
  };

  const updateQuantity = (id, qty) => {
    const item = cartItems.find((x) => x.product === id);
    if (!item) return;
    
    const newQty = Math.max(1, Math.min(qty, item.stockQuantity));
    const newItems = cartItems.map((x) =>
      x.product === id ? { ...x, qty: newQty } : x
    );
    saveCart(newItems);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const itemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemsCount,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
