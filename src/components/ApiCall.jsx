import React, { useState, useEffect } from "react";
import axios from "axios";

function ApiCall() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("https://api.escuelajs.co/api/v1/users")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div>
      <ul>
        {data.map((item) => (
          <li key={item.id}>
            {item.email} - {item.password}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ApiCall;
