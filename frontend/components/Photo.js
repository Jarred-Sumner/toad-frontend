import classNames from "classnames";
import { buildImgSrcSet, buildImgSrc } from "../lib/imgUri";

const DEFAULT_SIZE = "126px";

export const calculateDimensions = ({ photo, maxWidth, maxHeight }) => {
  const MAX_COLUMN_COUNT = 1;

  let width,
    height = 0;
  if (photo.width > photo.height) {
    const MAX_SIZE = (maxWidth / MAX_COLUMN_COUNT) * MAX_COLUMN_COUNT;
    width = Math.min(photo.width, MAX_SIZE);
    height = photo.height * (width / photo.width);
  } else if (photo.height > photo.width) {
    const MAX_SIZE = (maxHeight / MAX_COLUMN_COUNT) * MAX_COLUMN_COUNT;
    height = Math.min(photo.height, MAX_SIZE);
    width = photo.width * (height / photo.height);
  } else {
    const MAX_SIZE = (maxWidth / MAX_COLUMN_COUNT) * MAX_COLUMN_COUNT;
    width = Math.min(photo.height, MAX_SIZE);
    height = Math.min(photo.height, MAX_SIZE);
  }

  return { width, height };
};

export default ({
  onClick,
  width,
  height,
  maxHeight,
  size,
  photo,
  circle,
  maxWidth
}) => {
  const { url } = photo || {};

  return (
    <div
      className={classNames("photo", {
        "photo--hoverable": !!onClick,
        "photo--circle": !!circle
      })}
      onClick={onClick}
    >
      {url && (
        <img
          src={size ? buildImgSrc(url, size) : buildImgSrc(url, width, height)}
          key={photo.id}
          srcSet={
            size
              ? buildImgSrcSet(url, size)
              : buildImgSrcSet(url, width, height)
          }
        />
      )}

      <style jsx>{`
        .photo {
          display: inline-block;
          height: ${height}px;
          max-width: ${maxWidth || "unset"};
          max-height: ${maxHeight || "unset"};

          width: ${width}px;
          min-height: 0;
          min-width: 0;
        }

        img {
          height: ${height}px;
          width: ${width}px;
          max-width: ${maxWidth || "unset"};
          max-height: ${maxHeight || "unset"};
          display: inline-block;
          border-radius: 2px;
          object-fit: cover;
          transition: transform 0.1s linear;
        }

        .photo--hoverable img {
          cursor: pointer;
        }

        .photo--hoverable img:hover {
          transform: scale(1.05, 1.05);
        }

        @media (max-width: 500px) {
          .photo--hoverable img:hover {
            transform: scale(1);
          }
        }

        .photo--circle img {
          border-radius: 50%;
          box-shadow: none;
        }
      `}</style>
    </div>
  );
};
