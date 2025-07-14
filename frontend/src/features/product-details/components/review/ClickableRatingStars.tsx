import { Star } from "lucide-react";
import React, { useState } from "react";
import { usePdpContext } from "../../hooks/pdpContext";

function ClickableRatingStars({
  onRate,
}: {
  onRate: (rating: { option_id: number; ratingId: number }) => void;
}) {
  const { ratingIndicator } = usePdpContext();
  const ratingOptions = ratingIndicator.rating_options!;
  const ratingId = ratingIndicator.rating_id;

  // State to track the currently selected rating
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const handleStarClick = (index: number) => {
    const selectedOption = ratingOptions?.[index];
    if (selectedOption) {
      setSelectedRating(selectedOption.value); // Update the selected rating
      onRate({ option_id: selectedOption.option_id, ratingId });
    }
  };

  const starCount = selectedRating || 0; // Default to 0 if no rating selected

  return (
    <ul className="rating_star_shower flex clickable_stars">
      {ratingOptions?.map((_, index) => (
        <li key={index} onClick={() => handleStarClick(index)}>
          <Star
            fill={index < starCount ? "#FDCC0D" : "#E6E6E6"}
            stroke="transparent"
            className="cursor-pointer"
          />
        </li>
      ))}
    </ul>
  );
}

export default ClickableRatingStars;
