import React from "react";
import Photo, {
  calculateDimensions,
  buildPhotoSrc,
  buildPhotoSrcSet
} from "./Photo";
import { buildImgSrcSet, buildImgSrc } from "lib/imgUri";
import { MOBILE_BEAKPOINT } from "lib/mobile";
import _ from "lodash";

export const ImagePreviewContext = React.createContext({
  setImagePreview: null,
  imagePreview: null
});

export class ImagePreviewProvider extends React.Component {
  state = { imagePreview: null };
  handleSetImagePreview = imagePreview => {
    if (
      imagePreview &&
      _.get(imagePreview, "id") !== _.get(this, "state.imagePreview.id")
    ) {
      this.setState({ imagePreview });
    } else if (!imagePreview) {
      this.setState({ imagePreview: null });
    }
  };

  render() {
    const { imagePreview } = this.state;
    const { children } = this.props;

    return (
      <ImagePreviewContext.Provider
        value={{ imagePreview, setImagePreview: this.handleSetImagePreview }}
      >
        {children}
      </ImagePreviewContext.Provider>
    );
  }
}

class RawImagePreviewViewer extends React.PureComponent {
  render() {
    const { imagePreview } = this.props;
    if (!imagePreview) {
      return null;
    }
    const { url, mimetype } = imagePreview;

    const { width, height } = calculateDimensions({
      photo: imagePreview,
      maxWidth: window.innerWidth * 0.75,
      maxHeight: window.innerHeight
    });

    const src = buildPhotoSrc({ url, width, height, mimetype });
    const srcSet = buildPhotoSrcSet({ url, width, height, mimetype });

    return (
      <div className="ImagePreview">
        <img src={src} key={imagePreview.id} srcSet={srcSet} />

        <style jsx>{`
          .ImagePreview {
            position: fixed;
            top: 0;
            right: 0;
            pointer-events: none;
          }

          img {
            object-fit: contain;
            max-height: 100vh;
          }

          @media (max-width: ${MOBILE_BEAKPOINT}px) {
            .ImagePreview {
              display: none;
            }
          }
        `}</style>
      </div>
    );
  }
}

export const ImagePreviewViewer = () => (
  <ImagePreviewContext.Consumer>
    {({ imagePreview }) => (
      <RawImagePreviewViewer imagePreview={imagePreview} />
    )}
  </ImagePreviewContext.Consumer>
);
