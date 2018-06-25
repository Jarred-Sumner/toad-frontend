import classNames from "classnames";
import { buildImgSrcSet, buildImgSrc } from "../lib/imgUri";

const DEFAULT_SIZE = "126px";

export const calculateDimensions = ({ photo, maxWidth, maxHeight }) => {
  const MAX_COLUMN_COUNT = 1;
  if (!photo || !photo.metadata) {
    return { width: null, height: null };
  }

  const { width: rawWidth, height: rawHeight } = photo.metadata;

  let width,
    height = 0;

  if (rawWidth > rawHeight) {
    const MAX_SIZE = (maxWidth / MAX_COLUMN_COUNT) * MAX_COLUMN_COUNT;
    width = Math.min(rawWidth, MAX_SIZE);
    height = rawHeight * (width / rawWidth);
  } else if (rawHeight > rawWidth) {
    const MAX_SIZE = (maxHeight / MAX_COLUMN_COUNT) * MAX_COLUMN_COUNT;
    height = Math.min(rawHeight, MAX_SIZE);
    width = rawWidth * (height / rawWidth);
  } else {
    const MAX_SIZE = Math.min(
      (maxWidth / MAX_COLUMN_COUNT) * MAX_COLUMN_COUNT,
      (maxHeight / MAX_COLUMN_COUNT) * MAX_COLUMN_COUNT
    );

    width = Math.min(rawWidth, MAX_SIZE);
    height = Math.min(rawHeight, MAX_SIZE);
  }

  return { width, height };
};

export default ({ onClick, width, height, size, photo, circle }) => {
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
          min-height: ${height}px;
          min-width: ${width}px;
        }

        img {
          height: ${height}px;
          width: ${width}px;

          display: inline-block;
          border-radius: 2px;
          object-fit: contain;
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
