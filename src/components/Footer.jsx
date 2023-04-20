import React, { useContext } from "react";
import { IoHomeSharp } from "react-icons/io5";
import { BsFillCartFill, BsList } from "react-icons/bs";
import { AppContext } from "../App";

const admin = null;
//const admin = 1;
const Footer = () => {
  const { setRoute, user } = useContext(AppContext);
  return (
    <div className="fixed h-16 w-full bg-sky-600 bottom-0 flex justify-evenly items-center">
      <div className="flex items-center gap-2">
        {user && (
          <p className="text-xl font-semibold text-white">
            Usuario logueado: {user.email}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <BsFillCartFill className="text-2xl text-white" />
        <span className="text-xl font-semibold text-white">
          Ecommerce devCamp
        </span>
      </div>

      {admin && (
        <>
          <div className="flex items-center gap-2">
            <div
              className="text-4xl text-white cursor-pointer"
              onClick={() => setRoute("home")}
            >
              <IoHomeSharp />
            </div>
          </div>
          <div
            className="text-4xl text-white cursor-pointer"
            onClick={() => setRoute("db")}
          >
            <BsList />
          </div>
        </>
      )}
    </div>
  );
};

export default Footer;
