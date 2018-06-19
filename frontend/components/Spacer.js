import React from "react";

export class Spacer extends React.PureComponent {
  render() {
    const { width, height } = this.props;
    return (
      <div className="Spacer">
        <style jsx>{`
          .Spacer {
            content: "";
            display: block;
            width: ${width || 1}px;
            height: ${height || 1}px;
          }
        `}</style>
      </div>
    );
  }
}

export default Spacer;
