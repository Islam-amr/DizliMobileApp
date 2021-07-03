// Package import
import {Platform, StatusBar, Dimensions} from 'react-native';

let customHeight;

if ((Platform.OS === 'android')) {
  const hasNotch = StatusBar.currentHeight > 24;
  if (hasNotch) {
    customHeight = Dimensions.get('window').height;
  } else {
    customHeight = Dimensions.get('window').height - StatusBar.currentHeight;
  }
} else {
  customHeight = Dimensions.get('window').height;
}

export default {
  width: Dimensions.get('window').width,
  height: customHeight,
};