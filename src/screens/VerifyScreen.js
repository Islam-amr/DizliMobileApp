import React, {useEffect, useLayoutEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

// ui Components import
import Button from '../components/ui/Button';
import MyText from '../components/ui/MyText';
import ErrModal from '../components/ui/ErrModal';

// constants import
import commonStyles from '../constants/commonStyles';
import responsiveFont from '../constants/responsiveFont';
import colors from '../constants/colors';
import dimensions from '../constants/dimensions';
import fonts from '../constants/fonts';

// app Api
import API from '../redux/BaseURL';

// user actions import
import * as userActions from '../redux/actions/user';

const CELL_COUNT = 4;

const VerifyScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  const phone = route.params?.phone;
  const user = useSelector(state => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const [resendMode, setResendMode] = useState(false);
  const [errModalVisible, setErrModalVisible] = useState(false);
  const [errMsg, setErrMsg] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => null,
    });
  }, []);

  const sendOtp = async code => {
    try {
      await API.post('customer/v1/auth/sendotp', {
        phone: phone,
      });
    } catch (e) {
      console.log(e.response.data);
    }
  };

  const resendOtp = () => {
    sendOtp();
    setResendMode(true);
    setTimeout(() => {
      setResendMode(false);
    }, 5 * 1000);
  };

  const verifyUser = async code => {
    setIsLoading(true);
    try {
      const response = await API.post('customer/v1/auth/sign-in', {
        phone: phone,
        password: value,
      });
      let token = response.headers.token;
      let userData = await response.data?.user;
      dispatch(userActions.verifyUser(token, userData));
      navigation.navigate('Home');
    } catch (e) {
      setErrMsg(e.response.data.message);
      setErrModalVisible(true);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    sendOtp();
  }, []);

  return (
    <>
      <View style={commonStyles.mainView2}>
        <MyText
          text={'Enter OTP to verify your mobile number'}
          fontType={3}
          style={styles.otpTxt}
        />
        <View style={{paddingHorizontal: '15%'}}>
          <CodeField
            ref={ref}
            {...props}
            // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
            value={value}
            onChangeText={setValue}
            cellCount={CELL_COUNT}
            rootStyle={styles.codeFieldRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={({index, symbol, isFocused}) => (
              <Text
                key={index}
                style={[styles.cell, isFocused && styles.focusCell]}
                onLayout={getCellOnLayoutHandler(index)}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            )}
            onEndEditing={l => verifyUser(l.nativeEvent.text)}
          />
          {!resendMode && (
            <MyText
              onPress={resendOtp}
              text={'Resend OTP'}
              fontType={3}
              style={styles.otpTxt}
            />
          )}
          {resendMode && (
            <MyText
              text={'Resend in 30 sec'}
              fontType={3}
              style={[
                styles.otpTxt,
                {color: colors.grey, textDecorationLine: 'underline'},
              ]}
            />
          )}
        </View>
        <View style={{paddingHorizontal: '10%', marginTop: '5%'}}>
          <Button
            isLoading={isLoading}
            onPress={verifyUser}
            title={'Verify your Mobile'}
            disabled={value.length < 4 || isLoading}
            bg={colors.primary}
            container={styles.btnCon}
            txtStyle={styles.btnTxt}
            fontType={4}
            loadingColor={colors.white}
            loadingSize={34}
          />
        </View>
      </View>
      <ErrModal
        visible={errModalVisible}
        btnTitle={'OK'}
        errMsg={errMsg}
        onClose={() => setErrModalVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  otpTxt: {
    fontSize: responsiveFont(15),
    color: colors.black,
    marginTop: '10%',
    textAlign: 'center',
  },
  btnCon: {
    width: '100%',
    padding: '3%',
    height: dimensions.height * 0.08,
  },
  btnTxt: {
    color: colors.white,
    fontSize: responsiveFont(18),
    textTransform: 'uppercase',
  },
  root: {
    flex: 1,
    height: dimensions.height * 0.1,
    paddingHorizontal: '20%',
  },
  title: {textAlign: 'center', fontSize: 30},
  codeFieldRoot: {marginTop: 20},
  cell: {
    width: '20%',
    height: dimensions.height * 0.08,
    padding: '5%',
    lineHeight: 30,
    fontSize: responsiveFont(18),
    textAlign: 'center',
    backgroundColor: colors.white,
    fontFamily: fonts.poppins_medium,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colors.borderColor,
  },
  focusCell: {
    borderColor: '#000',
  },
});

export default VerifyScreen;
