import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
// import { products } from "../assets/assets";
import { useNavigate } from "react-router-dom";

// 👇 Define types
type CartItems = {
  [itemId: string]: {
    [size: string]: number;
  };
};

interface ShopContextType {
//   products: any[];
  delivery_fee: number;
  currency: string;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  showSearch: boolean;
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
  cartItems: CartItems;
  addToCart: (itemId: string, size: string) => Promise<void>;
  getCartCount: () => number;
  updateQuantity: (itemId: string, size: string, quantity: number) => Promise<void>;
  getCartAmount: () => number;
  navigate: ReturnType<typeof useNavigate>;
}

export const ShopContext = createContext<ShopContextType | undefined>(undefined);

const ShopContextProvider = ({ children }: { children: ReactNode }) => {
  const currency = "$";
  const delivery_fee = 10;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState<CartItems>({});
  const navigate = useNavigate();

  // ✅ Add item to cart
  const addToCart = async (itemId: string, size: string) => {
    if (!size) {
      return;
    }

    const cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = { [size]: 1 };
    }

    setCartItems(cartData);
  };

  // ✅ Count total items in cart
  const getCartCount = () => {
    let totalCount = 0;

    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        const quantity = cartItems[itemId][size];
        if (quantity > 0) {
          totalCount += quantity;
        }
      }
    }

    return totalCount;
  };

  // ✅ Update item quantity
  const updateQuantity = async (itemId: string, size: string, quantity: number) => {
    const cartData = structuredClone(cartItems);
    if (!cartData[itemId]) cartData[itemId] = {};
    cartData[itemId][size] = quantity;
    setCartItems(cartData);
  };

  // ✅ Calculate total amount
  const getCartAmount = () => {
    let totalAmount = 0;

    // for (const itemId in cartItems) {
    //   const itemInfo = products.find((p:any) => p._id === itemId);
    //   if (!itemInfo) continue;

    //   for (const size in cartItems[itemId]) {
    //     const quantity = cartItems[itemId][size];
    //     if (quantity > 0) {
    //       totalAmount += itemInfo.price * quantity;
    //     }
    //   }
    // }

    return totalAmount;
  };

  useEffect(() => {
    console.log(cartItems);
  }, [cartItems]);

  const value: ShopContextType = {
    // products,
    delivery_fee,
    currency,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;
