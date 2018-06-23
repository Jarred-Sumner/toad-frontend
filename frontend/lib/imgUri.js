const IMAGE_HOST = "https://i.applytodate.com";

const DEFAULT_SIZES = [1.0, 1.5, 2, 3, 4.0];
const DEFAULT_PIXEL_RATIO = 1.0;

const getPixelRatio = () => {
  if (typeof window !== "undefined") {
    return window.devicePixelRatio;
  } else {
    return DEFAULT_PIXEL_RATIO;
  }
};

const normalizeFormat = value => {
  if (typeof value === "string") {
    return parseInt(value.split("px")[0], 10);
  } else {
    return value;
  }
};

const normalizeSize = (size, rawHeight, _pixelRatio = null) => {
  const pixelRatio = _pixelRatio || getPixelRatio();

  if (size && rawHeight) {
    const width = normalizeFormat(size) * pixelRatio;
    const height = normalizeFormat(rawHeight) * pixelRatio;
    return `${width}x${height}`;
  } else {
    return normalizeFormat(size) * pixelRatio;
  }
};

export const buildImgSrc = (source, rawSize, rawHeight, pixelRatio) => {
  if (!rawSize) {
    return source;
  }

  return `${IMAGE_HOST}/${normalizeSize(
    rawSize,
    rawHeight,
    pixelRatio
  )}/${source}`;
};

export const buildImgSrcSet = (
  source,
  rawDesiredSize,
  rawHeight,
  sizes = DEFAULT_SIZES
) => {
  if (!source) {
    return null;
  }

  return DEFAULT_SIZES.map(size =>
    [buildImgSrc(source, rawDesiredSize, rawHeight, size)].join(" ")
  ).join(",\n");
};
