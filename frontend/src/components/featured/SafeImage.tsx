import { useEffect, useState } from "react";

function SafeImage({ src, alt, fallback }) {
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (!src) return setIsValid(false);

    const img = new Image();
    img.onload = () => setIsValid(true);
    img.onerror = () => setIsValid(false);
    img.src = src;
  }, [src]);

  if (!isValid) {
    return fallback; // render upcoming launches, etc.
  }

  return <img src={src} alt={alt} />;
}

export default SafeImage;