"use client";

type Props = {
  rating: number; // 0–5, supports decimals
  size?: "sm" | "md" | "lg";
};

export default function StarRating({ rating, size = "md" }: Props) {
  const sizeClass = size === "sm" ? "text-sm" : size === "lg" ? "text-xl" : "text-base";

  return (
    <span className={`inline-flex gap-0.5 ${sizeClass}`} aria-label={`${rating.toFixed(1)} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = rating >= star;
        const half = !filled && rating >= star - 0.5;
        return (
          <span key={star} className={filled ? "text-yellow-400" : half ? "text-yellow-300" : "text-gray-300"}>
            ★
          </span>
        );
      })}
    </span>
  );
}
