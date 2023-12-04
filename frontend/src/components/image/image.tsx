import clsx from "clsx";

interface ImageProps {
  src: string;
  imageWidth?: string;
  imageHeigth?: string;
  onClick?: () => void;
  className?: string;
}

export default function Image({
  src,
  imageWidth,
  imageHeigth,
  onClick,
  className
}: ImageProps) {
  return (
    <img
      className={clsx(className)}
      onClick={onClick}
      src={src}
      style={{ width: imageWidth, height: imageHeigth }}
    />
  );
}
