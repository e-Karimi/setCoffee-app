import React from "react";

export default function searchPage(req,{params}) {
  console.log("searchPage ~ params:", params)
  console.log("searchPage ~ req:", req.query);

  return <div>searchPage</div>;
}
