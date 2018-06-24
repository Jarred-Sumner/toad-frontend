import { Mutation } from "react-apollo";
import Dropzone from "react-dropzone";
import { Queries } from "Toads/Queries";
import { COLORS } from "../lib/colors";
import { SPACING } from "../lib/spacing";
import Alert from "./Alert";
import { MAX_PHOTO_WIDTH } from "./Post/Comment";
// import { logEvent } from "../../lib/analytics";
import { Spinner } from "./Spinner";

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
      onLoad,
      isUploading
    } = this.props;

    return (
      <div className="container">
        <img src={blob || "/static/UploadPhoto/Placeholder@2x.png"} />
        {isUploading && (
          <div className="Loading">
            <Spinner color={COLORS.white} size={18} />
          </div>
        )}

        <style jsx>{`
          .container {
            display: flex;
            max-width: ${MAX_PHOTO_WIDTH}px;
            height: ${height}px;
            position: relative;

            cursor: pointer;
          }

          .Loading {
            padding: ${SPACING.normal}px;
            align-items: center;
            display: flex;
            justify-content: center;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
          }

          img {
            height: auto;
            max-width: ${MAX_PHOTO_WIDTH}px;
            max-height: 100%;
            border: 1px solid rgba(0, 0, 0, 0.05);
            border-radius: 4px;
            object-fit: contain;
            display: block;
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

class EditPhotoContainer extends React.Component {
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
        status: Status.preview
      },
      () => {
        this.props.onChange(file);
      }
    );
  };

  uploadFile = boardId => {
    const { file, status } = this.state;

    this.setState({ status: Status.uploading });

    return this.props
      .createAttachment({
        variables: { mimetype: file.type, filename: file.name }
      })
      .then(({ data }) => {
        const attachment = _.get(data, "Attachment");
        if (attachment) {
          const { id, signed_url } = attachment;
          return window
            .fetch(signed_url, {
              mode: "cors",
              method: "PUT",
              headers: {
                "Content-Type": file.type
              },
              body: file
            })
            .then(response => {
              if (response.ok) {
                this.setState({ status: Status.preview });
                return id;
              } else {
                console.error(response);
                this.setState({ status: Status.error });
                return Promise.reject({
                  message: "File upload failed. Please try again."
                });
              }
            });
        } else {
          this.setState({ status: Status.error });
          return Promise.reject({
            message: "File upload failed. Please try again."
          });
        }
      });
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
      photo,
      onFileDialogCancel
    } = this.state;
    const { remoteSize, dropZoneRef } = this.props;

    return (
      <Dropzone
        multiple={false}
        onFileDialogCancel={onFileDialogCancel}
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
          isUploading={status === Status.uploading}
          width={width}
          height={height}
        />
      </Dropzone>
    );
  }
}

export default class EditPhotoMutation extends React.PureComponent {
  render() {
    const { editPhotoRef, ...otherProps } = this.props;

    return (
      <Mutation mutation={Queries.CreateAttachment}>
        {createAttachment => (
          <EditPhotoContainer
            ref={editPhotoRef}
            {...otherProps}
            createAttachment={createAttachment}
          />
        )}
      </Mutation>
    );
  }
}
