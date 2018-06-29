export const uploadFile = ({ createAttachment, file }) => {
  return createAttachment({
    variables: { mimetype: file.type, filename: file.name }
  }).then(({ data }) => {
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
            return id;
          } else {
            return Promise.reject({
              message: "File upload failed. Please try again."
            });
          }
        });
    } else {
      return Promise.reject({
        message: "File upload failed. Please try again."
      });
    }
  });
};
