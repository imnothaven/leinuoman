import { useState, useCallback } from "react";

export default function CardImage({ card, className = "", style = {} }) {
  const [imgError, setImgError] = useState(false);

  const handleError = useCallback(() => {
    setImgError(true);
  }, []);

  const number = card.number || card.id;

  return (
    <div
      className={`card-image-container ${className}`}
      style={style}
    >
      <img
        src={card.image}
        alt={card.name}
        onError={handleError}
        className={`card-image-real ${imgError ? "is-hidden" : ""}`}
      />

      {(imgError || !card.image) && (
        <div className="card-image-fallback">
          <div className="card-image-fallback-number">
            {number}
          </div>
          <div className="card-image-fallback-name">
            {card.name}
          </div>
          {card.nameEn && (
            <div className="card-image-fallback-en">
              {card.nameEn}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
