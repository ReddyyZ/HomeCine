import { useState } from "react";
import DefaultImage from "../../assets/img/default-image.jpg";

export default function Image({
  src,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [source, setSource] = useState(src);
  const [errored, setErrored] = useState(false);

  const onError = () => {
    if (!errored) {
      setErrored(true);
      setSource(DefaultImage);
    }
  };

  return <img src={source} {...props} onError={onError} />;
}
