import React, { useContext, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { BsFillCartFill } from "react-icons/bs";
import { AppContext } from "../App";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const auth = getAuth();

const Header = () => {
  const { route, setRoute, user, setUser } = useContext(AppContext);
  const { cart, setCart } = useContext(AppContext);
  const quantity = cart.reduce((acc, curr) => {
    return acc + curr.quantity;
  }, 0);

  const totalPrice = cart.reduce((acc, curr) => {
    return acc + curr.quantity * curr.price;
  }, 0);

  const [setCartCountTotal] = useState(0);

  const logout = () => {
    signOut(auth)
      .then(() => {
        setRoute("home");
        setUser(null);
        setCartCountTotal(null);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const emptyTheCart = () => {
    setCart((currentItems) => {
      return currentItems.map((item) => {
        return { ...item, quantity: 0, price: 0 };
      });
    });
  };

  const clickToCart = () => {
    toast.success(
      <>
        <table className="min-w-full divide-y divide-sky-600">
          <thead>
            <tr>
              <th>REF</th>
              <th>QT</th>
              <th>PRICE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {cart.map(
              (item) =>
                item.quantity !== 0 && (
                  <tr key={item.id}>
                    <td className="px-6 py-4  text-gray-800 whitespace-nowrap text-lg font-medium mt-2">
                      {item.name}
                    </td>
                    <td className="px-6 py-4  text-gray-800 whitespace-nowrap text-lg font-medium mt-2">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4  text-gray-800 whitespace-nowrap text-lg font-medium mt-2">
                      {item.price} €
                    </td>
                  </tr>
                )
            )}
          </tbody>
        </table>
        <div className="border-t border-sky-600"></div>
        <table className="min-w-full divide-y divide-sky-600">
          <thead>
            <tr>
              <th></th>
              <th></th>
              <th>TOTAL: {totalPrice} €</th>
            </tr>
          </thead>
        </table>

        <div className="border-t border-sky-600"></div>
      </>,
      {
        position: toast.POSITION.TOP_CENTER,
      }
    );
  };

  return (
    <header className="h-20 w-full bg-gray-100 shadow-lg flex items-center justify-between px-8 fixed top-0">
      <div className="flex items-center gap-2">
        <BsFillCartFill className="text-2xl text-sky-600" />
        <span className="text-xl font-semibold text-sky-600">
          Ecommerce devCamp
        </span>
      </div>
      {user && quantity !== 0 && route !== "ConfirmBuy" && route !== "db" && (
        <>
          <div className="flex items-center gap-2">
            <BsFillCartFill
              className="text-4xl text-sky-600 cart-action hover: transition"
              onClick={clickToCart}
            />
            <span className="text-3xl font-semibold text-sky-700">
              {quantity}
            </span>
            <ToastContainer />

            <button
              className="bg-sky-500 text-white py-3 px-4 rounded hover:bg-sky-700 transition"
              onClick={() => setRoute("ConfirmBuy")}
            >
              Buy
            </button>
          </div>
        </>
      )}

      <div className="flex gap-2">
        {user && route !== "db" ? (
          <>
            <button
              className="bg-sky-500 text-white py-3 px-4 rounded hover:bg-sky-700 transition"
              onClick={() => {
                logout();
                emptyTheCart();
              }}
            >
              logout
            </button>
          </>
        ) : (
          <>
            {route !== "db" && (
              <>
                <button
                  className="bg-sky-500 text-white py-3 px-4 rounded hover:bg-sky-700 transition"
                  onClick={() => setRoute("login")}
                >
                  Login
                </button>

                <button
                  className="bg-sky-500 text-white py-3 px-4 rounded hover:bg-sky-700 transition"
                  onClick={() => setRoute("register")}
                >
                  Register
                </button>
              </>
            )}
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
