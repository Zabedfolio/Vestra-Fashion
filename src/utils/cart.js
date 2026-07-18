import toast from 'react-hot-toast';

// Get items from localStorage
export function getCart() {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem('vestra_cart');
  return saved ? JSON.parse(saved) : [];
}

// Save items to localStorage and trigger change event
export function saveCart(cart) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('vestra_cart', JSON.stringify(cart));
  window.dispatchEvent(new Event('cart-change'));
}

// Add a product to the cart
export function addToCart(product, quantity, color, size) {
  const cart = getCart();
  
  // Find if matching item already exists
  const existing = cart.find(
    (item) => item.id === product.id && item.color === color && item.size === size
  );

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      brand: product.brand,
      image: product.image,
      price: product.price,
      color,
      size,
      quantity
    });
  }

  saveCart(cart);
  toast.success(`Added ${quantity} x ${product.name} to cart!`);
  return cart;
}

// Change item quantity
export function updateQuantity(index, delta) {
  const cart = getCart();
  const item = cart[index];
  
  if (item) {
    const newQty = item.quantity + delta;
    if (newQty > 0) {
      item.quantity = newQty;
      saveCart(cart);
    }
  }
  return cart;
}

// Remove item from cart
export function removeFromCart(index, name) {
  const cart = getCart();
  
  cart.splice(index, 1); // Simple index removal
  saveCart(cart);
  
  if (name) {
    toast.success(`${name} removed from cart`);
  }
  return cart;
}

// Clear cart
export function clearCart() {
  saveCart([]);
  return [];
}
