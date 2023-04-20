import React, { useState, useEffect } from "react";
import {
  addNewProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "../firebase/productController";
import { uploadFile } from "../firebase/index";
import ApiCall from "../components/ApiCall";

const Db = () => {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    img: "",
    stock: "",
  });
  const [products, setProducts] = useState([]);
  const [mode, setMode] = useState("add");

  const createNewProduct = async () => {
    await addNewProduct(product);
    setProduct({ name: "", price: "", img: "", stock: "" });
    initializeProducs();
  };

  const initializeProducs = () => {
    getProducts()
      .then((p) => setProducts([...p]))
      .catch((e) => console.error(e));
  };

  useEffect(() => {
    initializeProducs();
  }, []);

  const editProduct = (id) => {
    setMode("update");
    const productToEdit = products.find((p) => p.id === id);
    setProduct({ ...productToEdit });
  };

  const removeProduct = async (id) => {
    await deleteProduct(id);
    initializeProducs();
  };

  const updateExistingProduct = async () => {
    await updateProduct(product);
    setProduct({ name: "", price: "", img: "", stock: "" });
    initializeProducs();
  };

  return (
    <div>
      <div className="flex flex-col gap-4 items-center">
        <input
          type="text"
          placeholder="Name"
          className="border shadow outline-none focus:ring ring-sky-600 rounded px-2 py-1"
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          className="border shadow outline-none focus:ring ring-sky-600 rounded px-2 py-1"
          value={product.price}
          onChange={(e) => setProduct({ ...product, price: e.target.value })}
        />
        <input
          type="number"
          placeholder="Stock"
          className="border shadow outline-none focus:ring ring-sky-600 rounded px-2 py-1"
          value={product.stock}
          onChange={(e) => setProduct({ ...product, stock: e.target.value })}
        />
        {mode === "add" && (
          <input
            type="file"
            className="border shadow outline-none focus:ring ring-sky-600 rounded px-2 py-1"
            onChange={(e) => uploadFile(e.target.files[0])}
          />
        )}

        <button
          className="bg-sky-500 text-white py-1 px-3 rounded shadow hover:bg-sky-700 transition"
          onClick={() =>
            mode === "add" ? createNewProduct() : updateExistingProduct()
          }
        >
          {mode === "add" ? "ADD" : "UPDATE"}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mt-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="rounded-lg border border-sky-600 p-4 flex flex-col gap-2"
          >
            <div className="font-semibold">
              <img
                className="object-cover h-48 w-48"
                src={product.img}
                alt=""
              />
            </div>
            <div className="border-t border-sky-600"></div>
            <div className="font-semibold">{product.name} </div>
            <div className="border-t border-sky-600"></div>
            <div className="font-semibold">PRICE: {product.price} €</div>
            <div className="border-t border-sky-600"></div>
            <div className="font-semibold">STOCK: {product.stock}</div>
            <div className="border-t border-sky-600"></div>

            <div className="flex  justify-between">
              <button
                className="bg-sky-500 text-white py-1 px-3 rounded shadow hover:bg-sky-700 transition"
                onClick={() => editProduct(product.id)}
              >
                EDIT
              </button>
              <button
                className="bg-red-600 text-white py-1 px-3 rounded shadow hover:bg-red-700 transition"
                onClick={() => removeProduct(product.id)}
              >
                DELETE
              </button>
            </div>
          </div>
        ))}
        <div className="rounded-lg border border-sky-600 p-4 flex flex-col gap-2">
          <div className="font-semibold">Email/Password</div>
          <div className="border-t border-sky-600"></div>
          <ApiCall />
        </div>
      </div>
    </div>
  );
};

export default Db;
