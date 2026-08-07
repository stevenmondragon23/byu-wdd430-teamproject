"use client";
import { useEffect, useState } from "react";
import { getUserRating, ratingProduct } from "@/app/lib/rating";

type product = {
    product_id: number;
}

export function UserRating( {product_id} : product  ) {
  const [Stars, setStars] = useState(0);

  async function handleClick(rating: number) {
  setStars(rating);

  const result = await ratingProduct(product_id, rating);

  if (!result.success) {
    alert(result.message);
    setStars(0); 
  }
}

useEffect(() => {
  async function fetchRating() {
    const result = await getUserRating(product_id);
    if (result.success) {
      setStars(result.data);
    }
  }
  fetchRating();
}, []);


  return (
    <div>
      <p> Stars: {Stars}</p>

      {Array(5)
        .fill(0)
        .map((_, index) => (
          <button key={index + 1} onClick={() => handleClick(index + 1)}
          >
            {index + 1 <= Stars ? "⭐" : "☆" }
          </button>
        ))}
    </div>
  );
}
