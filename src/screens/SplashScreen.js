//package import
import React, {useRef} from 'react';
import {
  View,
  ImageBackground,
  Image,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import ActionSheet from 'react-native-actions-sheet';
import {useDispatch} from 'react-redux';

// redux action
import * as userActions from '../redux/actions/user';

// ui component import
import Button from '../components/ui/Button';

// constants import
import colors from '../constants/colors';
import commonStyles from '../constants/commonStyles';
import responsiveFont from '../constants/responsiveFont';
import dimensions from '../constants/dimensions';

// map locate address screen import
import LocateAddressScreen from './LocateAddressScreen';

const SplashScreen = ({navigation}) => {
  const isFocused = useIsFocused(); //to hange status bar when the screen is focused
  const dispatch = useDispatch(); // to save address in redux
  const actionSheetRef = useRef(); // to control map modal

  // handle location saving and navigating to Home Screen
  const onClose = destination => {
    actionSheetRef.current?.setModalVisible();
    dispatch(userActions.setAddress(destination));
    navigation.navigate('Home');
  };

  return (
    <>
      {isFocused && <StatusBar backgroundColor={'#B52C46'} />}
      <ImageBackground
        source={require('../assets/images/bg.png')}
        style={commonStyles.fullWH}
        resizeMode="cover">
        <View style={commonStyles.centeredView}>
          <Image
            style={styles.logo}
            source={require('../assets/images/logo.png')}
          />
        </View>
        <View style={[commonStyles.centeredView, {flex: 2}]}>
          <Image
            style={styles.foodImg}
            source={require('../assets/images/food.png')}
          />
        </View>
        <View style={styles.buttonCon}>
          <Button
            title={'order Pickup'}
            fontType={3}
            container={styles.buttonStyle}
            txtStyle={styles.pickupTxt}
            onPress={() => actionSheetRef.current?.setModalVisible()}
          />
          <Button
            title={'order delivery'}
            fontType={3}
            bg={colors.white}
            container={styles.buttonStyle}
            txtStyle={styles.deliveryTxt}
            onPress={() => actionSheetRef.current?.setModalVisible()}
          />
        </View>
      </ImageBackground>
      <ActionSheet ref={actionSheetRef} containerStyle={styles.modalCon}>
        <View style={styles.modalCon}>
          <LocateAddressScreen onClose={onClose} />
        </View>
      </ActionSheet>
    </>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: '60%',
    height: '60%',
    resizeMode: 'contain',
  },
  foodImg: {
    width: '90%',
    height: '90%',
    resizeMode: 'contain',
  },
  buttonCon: {
    flex: 0.75,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: '1.25%',
  },
  buttonStyle: {
    borderColor: 'white',
    borderWidth: 1,
    paddingVertical: '3%',
    paddingHorizontal: '5%',
  },
  pickupTxt: {
    color: 'white',
    textTransform: 'uppercase',
    fontSize: responsiveFont(16),
  },
  deliveryTxt: {
    color: colors.black,
    textTransform: 'uppercase',
    fontSize: responsiveFont(16),
  },
  modalCon: {
    width: dimensions.width,
    height: dimensions.height,
    backgroundColor: colors.white,
  },
});

export default SplashScreen;
