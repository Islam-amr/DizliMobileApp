import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';

// theme import
import colors from '../../constants/colors';
import dimensions from '../../constants/dimensions';
import responsiveFont from '../../constants/responsiveFont';
import MyText from './MyText';
import Loading from '../../utils/Loading';

const Button = props => {
  return (
    <TouchableOpacity
      disabled={props.disabled}
      onPress={props.onPress}
      activeOpacity={props.activeOpacity || 0.7}
      style={[
        styles.buttonCon,
        {
          backgroundColor: props.bg || 'transperant',
        },
        props.container,
        {opacity: props.disabled ? 0.6 : 1},
      ]}>
      {props.isLoading ? (
        <Loading color={props.loadingColor} size={props.loadingSize} />
      ) : (
        <MyText
          text={props.title}
          style={props.txtStyle}
          fontType={props.fontType}
        />
      )}

      {props.icon && !props.isLoading && (
        <Image
          source={props.icon}
          style={[styles.icon, {tintColor: props.iconColor}]}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonCon: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  icon: {
    height: '80%',
    resizeMode: 'contain',
    marginHorizontal: '5%',
  },
});

export default Button;
