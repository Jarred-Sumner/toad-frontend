import classNames from "classnames";
import { buildImgSrcSet, buildImgSrc } from "../lib/imgUri";
import justifiedLayout from "justified-layout";
import _ from "lodash";
import { Text } from "./Text";
import { COLORS } from "lib/colors";
import { Icon, ICONS } from "./Icon";
import { Spacer } from "./Spacer";
import { SPACING } from "lib/spacing";
import { DownloadLink } from "./DownloadLink";
import { ImagePreviewContext } from "./ImagePreview";
import { pure } from "recompose";

const DEFAULT_SIZE = "126px";

const SUPPORTED_RESIZE_MIMETYPES = [
  "image/png",
  "image/tiff",
  "image/webp",
  "image/jpeg",
  "image/bmp"
];

export const isAutosizingSupported = mimetype => {
  return SUPPORTED_RESIZE_MIMETYPES.includes(mimetype);
};

export const calculateDimensions = ({ photo, maxWidth, maxHeight }) => {
  const MAX_COLUMN_COUNT = 1;
  if (!photo || !photo.metadata) {
    return { width: null, height: null };
  }

  const { width: rawWidth, height: rawHeight } = photo.metadata;

  if (!rawWidth || !rawHeight) {
    return { width: null, height: null };
  }

  const targetDimensions =
    maxWidth > rawWidth || maxHeight > rawHeight
      ? { width: rawWidth, height: rawHeight }
      : { width: maxWidth, height: maxHeight };

  const layout = justifiedLayout([rawWidth / rawHeight], {
    containerWidth: targetDimensions.width,
    targetRowHeight: targetDimensions.height,
    showWidows: true,
    containerPadding: 0,
    maxNumRows: 1,
    boxSpacing: 0
  });

  const { width = maxWidth, height = maxHeight } = _.first(layout.boxes);

  return {
    width: Math.ceil(width),
    height: Math.ceil(height)
  };
};

const OverlayLink = ({ children, icon, tooltip, onClick }) => {
  return (
    <div data-tip={tooltip} onClick={onClick} className="OverlayLink">
      <Icon icon={icon} size="sm" color={"inherit"} />

      <style jsx>{`
        .OverlayLink {
          display: flex;
          align-items: center;
          color: ${COLORS.white};
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

class RawPreviewablePhoto extends React.PureComponent {
  handleSetImagePreview = () => this.props.setImagePreview(this.props.photo);
  handleRemoveImagePreview = () => {
    this.props.setImagePreview(null);
  };

  render() {
    const { photo, setImagePreview, ...otherProps } = this.props;

    return (
      <Photo
        {...otherProps}
        photo={photo}
        onMouseOver={this.handleSetImagePreview}
        onMouseOut={this.handleRemoveImagePreview}
      />
    );
  }
}

export const PreviewablePhoto = ({ photo, ...otherProps }) => (
  <ImagePreviewContext.Consumer>
    {({ setImagePreview }) => (
      <RawPreviewablePhoto
        setImagePreview={setImagePreview}
        photo={photo}
        {...otherProps}
      />
    )}
  </ImagePreviewContext.Consumer>
);

export const buildPhotoSrc = ({ url, mimetype, width, height, size }) => {
  if (isAutosizingSupported(mimetype) && width && height) {
    return buildImgSrc(url, width, height);
  } else if (isAutosizingSupported(mimetype) && size) {
    return buildImgSrc(url, size);
  } else {
    return url;
  }
};

export const buildPhotoSrcSet = ({ url, mimetype, width, height, size }) => {
  if (isAutosizingSupported(mimetype) && width && height) {
    return buildImgSrcSet(url, width, height);
  } else if (isAutosizingSupported(mimetype) && size) {
    return buildImgSrcSet(url, size);
  } else {
    return null;
  }
};

export const Photo = pure(
  ({
    onClick,
    width,
    height,
    size,
    photo,
    circle,
    minHeight,
    ...otherProps
  }) => {
    const { url, mimetype } = photo || {};

    const dimensions = _.pick(_.get(photo, "metadata"), ["width", "height"]);

    return (
      <div
        {...otherProps}
        className={classNames("photo", {
          "photo--hoverable": !!onClick,
          "photo--circle": !!circle
        })}
        onClick={onClick}
      >
        {url && (
          <img
            src={buildPhotoSrc({ url, mimetype, width, height, size })}
            key={photo.id}
            srcSet={buildPhotoSrcSet({ url, mimetype, width, height, size })}
          />
        )}

        <div className="Overlay Overlay--top">
          <Text
            tooltip={photo.filename}
            wrap={false}
            color="white"
            size="12px"
            weight="semiBold"
          >
            {photo.filename}
          </Text>
        </div>

        <div className="Overlay Overlay--bottom">
          <DownloadLink url={url}>
            <OverlayLink tooltip="Download" icon={ICONS.download} />
          </DownloadLink>

          {!_.isEmpty(dimensions) &&
            width > 100 && (
              <Text wrap={false} color="white" size="12px" weight="semiBold">
                {dimensions.width}x{dimensions.height}
              </Text>
            )}

          <a href={url} target="_blank">
            <OverlayLink tooltip="Full screen" icon={ICONS.expand} />
          </a>
        </div>

        <style jsx>{`
          .photo {
            display: inline-block;
            min-height: ${height}px;
            min-width: ${width}px;
            position: relative;
            border-radius: 2px;
          }

          .Overlay {
            position: absolute;
            left: 0;
            right: 0;
            padding: ${SPACING.small}px ${SPACING.normal}px;
            display: flex;
            justify-content: space-between;
            opacity: 0;
            pointer-events: none;
            height: 25px;
            text-shadow: 0px 0px 1px #000;
            background-color: rgba(0, 0, 0, 0.05);
          }

          .OverlayText {
            flex: 0;
            width: 100%;
            text-overflow: ellipsis;
          }

          .Overlay--top {
            top: 0;
          }

          .Overlay--bottom {
            bottom: 0;
          }

          .photo:hover .Overlay {
            opacity: 1;
            pointer-events: all;
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
  }
);

export default Photo;
