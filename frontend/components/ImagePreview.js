import React from "react";
import Photo, { calculateDimensions } from "./Photo";
import { buildImgSrcSet, buildImgSrc } from "lib/imgUri";
import { MOBILE_BEAKPOINT } from "lib/mobile";

export const ImagePreviewContext = React.createContext({
  setImagePreview: null,
  imagePreview: null
});

export class ImagePreviewProvider extends React.Component {
  state = { imagePreview: null };
  handleSetImagePreview = imagePreview => {
    if (imagePreview !== this.state.imagePreview) {
      this.setState({ imagePreview });
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
    const { url } = imagePreview;

    const { width, height } = calculateDimensions({
      photo: imagePreview,
      maxWidth: window.innerWidth * 0.75,
      maxHeight: window.innerHeight
    });

    return (
      <div className="ImagePreview">
        <img
          src={buildImgSrc(url, width, height)}
          key={imagePreview.id}
          srcSet={buildImgSrcSet(url, width, height)}
        />

        <style jsx>{`
          .ImagePreview {
            position: fixed;
            top: 0;
            right: 0;
          }

          img {
            object-fit: contain;
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
