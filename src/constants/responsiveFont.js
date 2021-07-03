// Package import
import {Platform, PixelRatio} from 'react-native';
import Dimensions from './dimensions';

const scale = Dimensions.width / 320;

export default (fontSize) => {
  const newSize = scale * fontSize;
  if ((Platform.OS === 'android')) {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
};