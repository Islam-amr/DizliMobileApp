import React, {useEffect, useState} from 'react';
import {View, Text, Image, StyleSheet, TextInput} from 'react-native';
import colors from '../../constants/colors';
import dimensions from '../../constants/dimensions';
import fonts from '../../constants/fonts';
import responsiveFont from '../../constants/responsiveFont';

const SearchInput = props => {
  return (
    <View
      style={[
        styles.inputCon,
        props.absolute ? {position: 'absolute'} : {},
        props.container,
      ]}>
      <View style={styles.iconCon}>
        <Image
          style={styles.icon}
          source={require('../../assets/icons/searchhh.png')}
        />
      </View>
      <View style={styles.textInputCon}>
        <TextInput
          style={[
            styles.txtInput,
            {
              paddingHorizontal: props.ph || 0,
            },
          ]}
          includeFontPadding={false}
          underlineColorAndroid="rgba(0,0,0,0)"
          autoCorrect={false}
          autoCapitalize={'none'}
          keyboardType={'web-search'}
          returnKeyType={'search'}
          {...props}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputCon: {
    width: '100%',
    flexDirection: 'row',
    alignSelf: 'center',
    // height: dimensions.height * 0.06,
    backgroundColor: colors.white,
    borderRadius: 5,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 16,
    },
    shadowOpacity: 0.1,
    shadowRadius: 16.0,
    elevation: 8,
  },
  iconCon: {
    flex: 0.15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: '45%',
    height: '45%',
    resizeMode: 'contain',
    tintColor: colors.grey,
  },
  textInputCon: {
    flex: 0.85,
    justifyContent: 'center',
  },
  txtInput: {
    fontSize: responsiveFont(15),
    fontFamily: fonts.poppins_regular,
    alignItems: 'center',
    textDecorationLine: 'none',
    // height: '100%',
  },
});

export default SearchInput;
