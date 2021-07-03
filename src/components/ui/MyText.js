import React from 'react';
import {View, Text} from 'react-native';
import fonts from '../../constants/fonts';

const MyText = props => {
  let fontType;
  switch (props.fontType) {
    case 1:
      fontType = fonts.poppins_thin;
      break;
    case 2:
      fontType = fonts.poppins_regular;
      break;
    case 3:
      fontType = fonts.poppins_medium;
      break;
    case 4:
      fontType = fonts.Poppins_SemiBold;
      break;
    default:
      fontType = fonts.poppins_regular;
  }
  return (
    <Text
      onPress={props.onPress}
      allowFontScaling={false}
      numberOfLines={props.nol}
      style={[{fontFamily: fontType}, props.style]}>
      {props.text}
    </Text>
  );
};

export default MyText;
