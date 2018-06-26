import classNames from "classnames";
import { COLORS } from "../lib/colors";

const TextComponent = ({
  font = "sans-serif",
  type,
  className,
  children,
  size = "14px",
  color = COLORS.black,
  componentType = "div",
  weight = "regular",
  lineHeight,
  casing = "inherit",
  textDecoration = "none",
  letterSpacing = "default",
  align = "inherit",
  wrap = null,
  width,
  animated = false,
  onClick,
  opacity,
  underline = false,
  hoverable = false
}) => {
  const classes = classNames("Text", className, {
    "Text--extraBold": weight == "extraBold",
    "Text--bold": weight === "bold",
    "Text--medium": weight === "medium",
    "Text--semiBold": weight === "semiBold",
    "Text--regular": weight === "regular",
    "Text--sans-serif": font === "sans-serif",
    "Text--lucida": font === "lucida",
    "Text--serif": font === "serif",
    "Text--paragraph": type === "paragraph",
    "Text--title": type === "title",
    "Text--link": type === "link",
    "Text--wrap": wrap === true,
    "Text--noWrap": wrap === false,
    "Text--hoverable": hoverable === true,
    "Text--underline": !!underline
  });

  return (
    <div onClick={onClick} className={classes}>
      <style jsx>{`
        .Text {
          color: ${color};
          display: inline;
          letter-spacing: 0;
          line-height: ${lineHeight || "default"};
          font-size: ${size};
          text-align: ${align};
          letter-spacing: ${letterSpacing};
          text-transform: ${casing};
          text-decoration: ${textDecoration};
          ${opacity && `opacity: ${opacity}`};
        }

        .Text--hoverable {
          cursor: pointer;
        }

        .Text--noWrap {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          ${width && `width: ${width};`};
        }

        .Text :global(a),
        .Text :global(a:visited) {
          color: ${color};
          text-decoration: underline;
        }

        .Text--wrap,
        .Text--wrap strong {
          white-space: pre-wrap;
          word-wrap: break-word;
          word-break: break-word;
        }

        .Text--regular {
          font-weight: 400;
        }

        .Text--medium {
          font-weight: 500;
        }

        .Text--hugeTitle {
          font-size: 46px;
          line-height: 54px;
          letter-spacing: 0.07px;
        }

        .Text--title {
          line-height: 34px;
          white-space: nowrap;
          word-wrap: none;
          word-break: none;
        }

        .Text--underline {
          text-decoration: underline;
        }

        .Text--sans-serif {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
            "Segoe UI Symbol";
        }

        .Text--lucida.Text--extraBold {
          font-weight: 900;
        }

        .Text--sans-serif.Text--extraBold {
          font-weight: 900;
          margin-left: -2.13px;
          line-height: 1.15;
          letter-spacing: -0.015em;
        }

        .Text--serif.Text--bold {
          font-weight: 700;
        }

        .Text--sans-serif.Text--semiBold {
          font-weight: 600;
        }

        .Text--semiBold {
          font-weight: 600;
        }

        .Text--serif.Text--bold,
        .Text--serif strong {
          font-weight: 700;
        }

        .Text--sans-serif.Text--bold,
        .Text--sans-serif strong {
          font-weight: 700;
        }

        .Text :global(strong) {
          font-weight: 700;
        }

        .Text--link {
          cursor: pointer;
        }

        .Text--link:hover {
          color: #000;
        }
      `}</style>

      {children}
    </div>
  );
};

export const Text = ({ type, children, ...otherProps }) => {
  if (type == "Tagline") {
    return (
      <TextComponent {...otherProps} font="serif" color="#000" size="18px">
        {children}
      </TextComponent>
    );
  } else if (type == "ProfilePageTitle") {
    return (
      <TextComponent
        {...otherProps}
        font="serif"
        color="#000"
        size="36px"
        lineHeight="35px"
        weight="bold"
      >
        {children}
      </TextComponent>
    );
  } else if (type == "MatchProfilePageTitle") {
    return (
      <TextComponent
        {...otherProps}
        font="serif"
        color="#000"
        size="20px"
        lineHeight="35px"
        weight="bold"
      >
        {children}
      </TextComponent>
    );
  } else if (type === "PageTitle") {
    return (
      <TextComponent
        {...otherProps}
        font="sans-serif"
        color="#000"
        size="36px"
        lineHeight="35px"
        weight="bold"
      >
        {children}
      </TextComponent>
    );
  } else if (type === "paragraph") {
    return (
      <TextComponent
        {...otherProps}
        weight="regular"
        wrap
        font="serif"
        size="21px"
        lineHeight="30px"
      >
        {children}
      </TextComponent>
    );
  } else if (type === "title") {
    return (
      <TextComponent
        {...otherProps}
        font="lucida"
        size="30px"
        lineHeight="48px"
        weight="extraBold"
      >
        {children}
      </TextComponent>
    );
  } else if (type === "subtitle") {
    return (
      <TextComponent
        {...otherProps}
        font="serif"
        size="21px"
        color="#000000"
        lineHeight="27px"
      >
        {children}
      </TextComponent>
    );
  } else if (type === "validation") {
    return (
      <TextComponent
        {...otherProps}
        color="#E20000"
        size="14px"
        weight="semiBold"
      >
        {children}
      </TextComponent>
    );
  } else if (type === "label") {
    return (
      <TextComponent
        {...otherProps}
        casing="uppercase"
        font="sans-serif"
        size="12px"
        color="#808696"
        weight="extraBold"
      >
        {children}
      </TextComponent>
    );
  } else if (type === "smalltitle") {
    return (
      <TextComponent
        {...otherProps}
        font="sans-serif"
        size="18px"
        color="#000"
        weight="extraBold"
      >
        {children}
      </TextComponent>
    );
  } else if (type === "footerlink") {
    return (
      <TextComponent
        {...otherProps}
        type={type}
        size="12px"
        letterSpacing="1px"
        lineHeight="22px"
        textDecoration="none"
        fontWeight="400"
        font="sans-serif"
        color="#000"
        casing="uppercase"
      >
        {children}
      </TextComponent>
    );
  } else if (type == "hamburgerlink") {
    return (
      <TextComponent
        {...otherProps}
        weight="extraBold"
        type={type}
        size="1.15em"
        letterSpacing="1px"
        lineHeight="22px"
        textDecoration="none"
        font="sans-serif"
        color="#000000"
      >
        {children}
      </TextComponent>
    );
  } else if (type === "link") {
    return (
      <TextComponent
        {...otherProps}
        type={type}
        size="14px"
        lineHeight="26px"
        textDecoration="underline"
      >
        {children}
      </TextComponent>
    );
  } else if (type === "switcher--active") {
    return (
      <TextComponent
        {...otherProps}
        type={type}
        size="12px"
        lineHeight="17px"
        color="white"
        weight="bold"
      >
        {children}
      </TextComponent>
    );
  } else if (type === "switcher--inactive") {
    return (
      <TextComponent
        {...otherProps}
        type={type}
        size="12px"
        lineHeight="17px"
        color="#9396A5"
        weight="bold"
      >
        {children}
      </TextComponent>
    );
  } else if (type === "muted") {
    return (
      <TextComponent
        {...otherProps}
        color="#B0B0B0"
        size={_.get(otherProps, "size", "13px")}
      >
        {children}
      </TextComponent>
    );
  } else if (type === "notification") {
    return (
      <TextComponent {...otherProps} size="14px" lineHeight="19px">
        {children}
      </TextComponent>
    );
  } else {
    return <TextComponent {...otherProps}>{children}</TextComponent>;
  }
};

export default Text;
