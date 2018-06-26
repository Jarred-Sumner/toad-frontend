import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faPlus,
  faTimesCircle,
  faChevronRight,
  faFlag,
  faLink,
  faBackward,
  faForward,
  faDownload,
  faExpandArrowsAlt
} from "@fortawesome/free-solid-svg-icons";

export const ICONS = {
  camera: faCamera,
  plus: faPlus,
  close: faTimesCircle,
  flag: faFlag,
  link: faLink,
  chevronRight: faChevronRight,
  previous: faBackward,
  next: faForward,
  download: faDownload,
  expand: faExpandArrowsAlt
};

export const Icon = FontAwesomeIcon;
export default Icon;
