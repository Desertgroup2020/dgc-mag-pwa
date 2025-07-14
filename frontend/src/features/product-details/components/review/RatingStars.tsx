import { Star } from "lucide-react";
import React from "react";
import { usePdpContext } from "../../hooks/pdpContext";

function RatingStars({ optionId }: { optionId: number }) {
  
  const {ratingIndicator} = usePdpContext();
  const ratingOptions = ratingIndicator.rating_options;
  

  const selectedOption = ratingOptions?.find(option => option?.option_id === optionId);
  const starCount = selectedOption ? selectedOption.value : 0;
  
  return (
    <ul className="rating_star_shower flex">
      {Array.from({ length: ratingOptions?.length || 5 }).map((_, index) => (
        <li key={index}>
          <Star fill={index < starCount ? "#FDCC0D" : "#E6E6E6"} stroke="transparent" />
        </li>
      ))}
    </ul>
  );
}

export default RatingStars;
