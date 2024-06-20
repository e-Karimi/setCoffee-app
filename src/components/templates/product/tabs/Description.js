import React from "react";

const Description = ({ product }) => {
  return (
    <div>
      <p>توضیحات :</p>
      <hr />
      <h3>{product.name}</h3>
      <p>{product.shortDescription}</p>
      <p>{product.longDescription}</p>
    </div>
  );
};

export default Description;
