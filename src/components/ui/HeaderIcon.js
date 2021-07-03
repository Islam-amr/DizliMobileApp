import React from 'react';
import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import dimensions from '../../constants/dimensions';

const HeaderIcon = props => {
  return (
    <TouchableOpacity
      style={styles.iconCon}
      activeOpacity={0.6}
      onPress={props.onPress}>
      <Image source={props.icon} style={[styles.icon, props.iconStyle]} />
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  iconCon: {
    width: dimensions.width * 0.125,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: '50%',
    height: '50%',
    resizeMode: 'contain',
  },
});
export default HeaderIcon;
