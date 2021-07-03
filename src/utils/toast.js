/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import Toast, {BaseToast} from 'react-native-toast-message';
import colors from '../constants/colors';
import responsiveFont from '../constants/responsiveFont';

export const ToastComponent = ({text, show, success, autoHide}) => {
  const toastConfig = {
    success: ({text1, text2, ...rest}) => (
      <BaseToast
        {...rest}
        style={{borderLeftColor: success ? colors.primary : colors.primary}}
        contentContainerStyle={{paddingHorizontal: 15}}
        text1Style={{
          fontSize: responsiveFont(18),
          fontWeight: 'bold',
        }}
        text1={text1}
        text2={text2}
      />
    ),
  };

  useEffect(() => {
    if (show) {
      Toast.show({
        position: 'bottom',
        text1: text,
      });
    }
  }, [show, text]);

  return (
    <Toast
      ref={ref => Toast.setRef(ref)}
      config={toastConfig}
      autoHide={autoHide}
    />
  );
};

const styles = StyleSheet.create({
  titleStyle: {
    color: 'white',
    fontSize: 21,
    fontFamily: 'Montserrat-Arabic-Regular',
  },
  icnCont: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  icn: {width: 35, height: 35},
  menuIcn: {marginTop: 10, width: 40, height: 40},
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
});
