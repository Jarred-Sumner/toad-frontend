import Text from "./Text";
import Dropzone from "react-dropzone";
// import S3Upload from "react-s3-uploader/s3upload";
import Button from "./Button";
import Alert from "./Alert";
// import { BASE_HOSTNAME } from "../../api";
import Photo from "./Photo";
import { COLORS } from "../lib/colors";
import { SPACING } from "../lib/spacing";
// import { logEvent } from "../../lib/analytics";
import { Spinner } from "./Spinner";
import classNames from "classnames";
import { Icon, ICONS } from "./Icon";
import { MAX_PHOTO_WIDTH, MAX_PHOTO_HEIGHT } from "./Post/Comment";

export const materialStyles = theme => ({
  icon: {
    margin: theme.spacing.unit,
    color: COLORS.white,
    fontSize: "62px"
  }
});

class EditablePhoto extends React.PureComponent {
  render() {
    const {
      blob,
      size,
      width,
      height,
      remoteSize,
      onRemove,
      classes,
      onLoad
    } = this.props;

    return (
      <div className="container">
        <img src={blob} />

        <style jsx>{`
          .container {
            display: flex;
            max-width: ${width}px;
            height: ${height}px;
            position: relative;

            cursor: pointer;
          }

          img {
            height: auto;
            max-height: 100%;
            border: 1px solid rgba(0, 0, 0, 0.05);
            border-radius: 4px;
            object-fit: contain;
            display: block;
          }

          .container:hover .Button {
            opacity: 1;
          }

          .Button {
            position: absolute;
            top: -${SPACING.normal}px;
            right: -${SPACING.normal}px;
            border-radius: 50%;
            opacity: 0;
            transition: opacity 0.1s linear;
            background-color: ${COLORS.black};
            width: ${SPACING.normal}px;
            height: ${SPACING.normal}px;
          }
        `}</style>
      </div>
    );
  }
}

const Status = {
  empty: "empty",
  preview: "preview",
  uploading: "uploading",
  error: "error"
};

export default class EditPhotoContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      status: props.photo ? Status.preview : Status.empty,
      photo: props.photo,
      file: null,
      width: 166.25,
      height: 125
    };
  }

  handleDrop = files => {
    if (_.isEmpty(files) || files.length > 1) {
      Alert.error("Please pick a single image");
      return;
    }

    const file = files[0];

    // logEvent("Crop Photo");

    // this.uploader = new S3Upload({
    //   files: [blob],
    //   signingUrl: "/images/sign",
    //   onFinishS3Put: this.handleUploadComplete,
    //   onError: this.handleUploadError,
    //   server: BASE_HOSTNAME,
    //   uploadRequestHeaders: process.env.IS_USING_SPACES === "FALSE" ? {} : null
    // });

    // Alert.info("Uploading...please wait");

    this.setState(
      {
        file,
        status: Status.uploading
      },
      () => {
        this.props.onChange(file);
      }
    );
  };

  handleUploadError = error => {
    console.error(error);
    // Alert.error("Something went wrong while uploading. Please try again");
    // logEvent("Upload Photo (Error)");

    this.setState({
      status: Status.error
    });
  };

  handleUploadComplete = photo => {
    this.props.setPhoto(photo);
    this.setState({ status: Status.preview });
    // Alert.success("Upload complete!");
  };

  handleDeletePhoto = event => {
    event.stopPropagation();
    event.preventDefault();

    // logEvent("Clear Photo");
    this.setState({
      status: Status.empty,
      photo: null
    });

    this.props.setPhoto(null);
  };

  componentWillUnmount() {
    this.uploader = null;
  }

  // TODO
  // handleSetDimensions = ({ width, height }) => this.setState({ width, height });

  render() {
    const {
      status,
      file,
      url,
      width = this.props.width,
      height = this.props.height,
      photo
    } = this.state;
    const { remoteSize, dropZoneRef } = this.props;

    return (
      <Dropzone
        multiple={false}
        // disabled={status === Status.uploading}
        accept="image/*"
        ref={dropZoneRef}
        style={{
          borderWidth: 0,
          borderRadius: 0,
          width: "unset",
          height: "unset"
        }}
        onDrop={this.handleDrop}
      >
        <EditablePhoto
          onRemove={this.handleDeletePhoto}
          photo={this.props.photo}
          // setDimensions={this.handleSetDimensions}
          blob={this.state.file ? this.state.file.preview : null}
          remoteSize={remoteSize}
          width={width}
          height={height}
        />
      </Dropzone>
    );
  }
}
