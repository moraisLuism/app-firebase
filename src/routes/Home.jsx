import React, { useState, useEffect, useContext } from "react";
import { getProducts } from "../firebase/productController";
import { AppContext } from "../App";
import { updateProduct } from "../firebase/productController";

const Home = () => {
  const { user, setCart } = useContext(AppContext);
  const [products, setProduct] = useState([]);
  const [cartCounts, setCartCounts] = useState({});

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const initializeProducts = async () => {
      try {
        const p = await getProducts();
        setProduct([...p]);
      } catch (e) {
        console.error(e);
      }
    };
    initializeProducts();
  }, []);

  const productsPerPage = 6;
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const productsToShow = products.slice(startIndex, endIndex);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const addToCart = (id, price, name, stock) => {
    setCart((currentItems) => {
      const isItemFound = currentItems.find((item) => item.id === id);
      if (isItemFound) {
        return currentItems.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity + 1, price, name };
          } else {
            return item;
          }
        });
      } else {
        return [...currentItems, { id, name, quantity: 1, price }];
      }
    });
    setCartCounts((prevCounts) => ({
      ...prevCounts,
      [id]: (prevCounts[id] || 0) + 1,
    }));
  };

  const removeFromTheCart = (id, stock) => {
    setCart((currentItems) => {
      if (currentItems.find((item) => item.id === id)?.quantity === 1) {
        return currentItems.filter((item) => item.id !== id);
      } else {
        return currentItems.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity - 1 };
          }
          return item;
        });
      }
    });

    setCartCounts((prevCounts) => ({
      ...prevCounts,
      [id]: (prevCounts[id] || 0) - 1,
    }));
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const updateStock = (productId, newStock) => {
    setProduct((currentProducts) => {
      const updatedProduct = currentProducts.find(
        (product) => product.id === productId
      );
      if (updatedProduct) {
        const updatedProductData = {
          id: updatedProduct.id,
          name: updatedProduct.name,
          price: updatedProduct.price,
          img: updatedProduct.img,
          stock: newStock,
        };
        updateProduct(updatedProductData);
        return currentProducts.map((product) =>
          product.id === productId ? { ...product, stock: newStock } : product
        );
      }
      return currentProducts;
    });
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mt-4">
        {productsToShow.map((product) => (
          <div
            key={product.id}
            className="rounded-lg border border-sky-600 p-4 flex flex-col gap-2"
          >
            {cartCounts[product.id] > 0 && user && (
              <span className="p-1 bg-sky-500 rounded text-xl font-semibold text-white">
                {cartCounts[product.id]}
              </span>
            )}

            <div className="border-t border-sky-600"></div>
            <div>
              <img
                className="object-cover h-48 w-48"
                src={product.img}
                alt=""
              />
            </div>
            <div className="border-t border-sky-600"></div>
            <div className="flex gap-2">
              <div className="font-semibold">{product.name} </div>
            </div>
            <div className="border-t border-sky-600"></div>
            <div className="font-semibold">{product.price} €</div>
            <div className="border-t border-sky-600"></div>
            <div className="font-semibold">{product.stock} UDS</div>
            {user ? (
              <>
                <div className="border-t border-sky-600"></div>
                <div className="flex justify-around">
                  {cartCounts[product.id] > 0 ? (
                    <button
                      className="bg-sky-500 text-white py-1 px-2 rounded shadow hover:bg-sky-700 transition"
                      disabled={product.stock === 0}
                      onClick={() => {
                        if (product.stock !== 0) {
                          addToCart(
                            product.id,
                            product.price,
                            product.name,
                            product.stock
                          );
                          updateStock(product.id, product.stock - 1);
                        }
                      }}
                    >
                      {product.stock === 0 ? "SOLD OUT" : "ADD+"}
                    </button>
                  ) : (
                    <div className="flex justify-center">
                      <button
                        className="bg-sky-500 text-white py-1 px-5 rounded shadow hover:bg-sky-700 transition"
                        disabled={product.stock === 0}
                        onClick={() => {
                          if (product.stock !== 0) {
                            addToCart(
                              product.id,
                              product.price,
                              product.name,
                              product.stock
                            );
                            updateStock(product.id, product.stock - 1);
                          }
                        }}
                      >
                        {product.stock === 0 ? "SOLD OUT" : "ADD CART"}
                      </button>
                    </div>
                  )}

                  {cartCounts[product.id] > 0 && (
                    <>
                      <div className="flex justify-center">
                        <button
                          className="bg-red-600 text-white py-1 px-3 rounded shadow hover:bg-red-700 transition"
                          onClick={() => {
                            removeFromTheCart(product.id, product.stock);
                            updateStock(product.id, product.stock + 1);
                          }}
                        >
                          REMOVE
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : null}
          </div>
        ))}
      </div>
      <div className="flex justify-center space-x-2 gap-4 mt-4">
        <div className="rounded-lg border border-sky-600 p-4">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className="bg-sky-500 text-white py-1 px-6 rounded shadow hover:bg-sky-700 transition ml-1 mr-1"
                hidden={pageNumber === currentPage}
              >
                {pageNumber}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
