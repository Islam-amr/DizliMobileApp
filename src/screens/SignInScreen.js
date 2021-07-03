import React, {useState, useReducer, useCallback, useLayoutEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import colors from '../constants/colors';
import commonStyles from '../constants/commonStyles';
import dimensions from '../constants/dimensions';
import responsiveFont from '../constants/responsiveFont';
import MyText from '../components/ui/MyText';
import ErrModal from '../components/ui/ErrModal';
import {useDispatch} from 'react-redux';
import * as userActions from '../redux/actions/user';
const UPDATE_SIGN_IN = 'UPDATE_SIGN_IN';

const signInReducer = (state, action) => {
  switch (action.type) {
    case UPDATE_SIGN_IN:
      const updatedInputValue = {
        ...state.inputValues,
        [action.input]: action.payload,
      }; // update inputs individullay
      const updatedinputValidities = {
        ...state.inputValidities,
        [action.input]: action.isValid,
      }; // update Validity individullay
      let updatedFormisValid = true;
      for (const key in updatedinputValidities) {
        updatedFormisValid = updatedFormisValid && updatedinputValidities[key];
      } // update form is valid
      return {
        formisValid: updatedFormisValid,
        inputValues: updatedInputValue,
        inputValidities: updatedinputValidities,
      }; // update all states
    default:
      return state;
  }
};

const SignInScreen = ({navigation}) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => null,
    });
  }, []);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState(false);
  const [errModalVisible, setErrModalVisible] = useState(false);

  const [signInFormStates, dispatchSignInForm] = useReducer(signInReducer, {
    inputValues: {
      mobile: '',
      password: '',
    },
    inputValidities: {
      mobile: false,
      password: false,
    },
    formisValid: false,
  });

  const dispatcher = useCallback(
    (inputId, inputValue, inputValidity) => {
      dispatchSignInForm({
        type: UPDATE_SIGN_IN,
        payload: inputValue,
        isValid: inputValidity,
        input: inputId,
      });
    },
    [dispatchSignInForm], // to re-create function when login reducer actions called
  );

  const signInHandler = async () => {
    setErrMsg(null);
    setIsLoading(true);
    try {
      await dispatch(
        userActions.signIn(
          signInFormStates.inputValues.mobile,
          signInFormStates.inputValues.password,
        ),
      );
      navigation.navigate('Home');
    } catch (e) {
      setErrMsg(e.response.data.message);
      setErrModalVisible(true);
    }
    setIsLoading(false);
  };

  return (
    <>
      <TouchableWithoutFeedback
        onPress={() => Keyboard.dismiss()}
        style={[commonStyles.mainView2, {padding: '5%'}]}>
        <View style={[commonStyles.mainView2, {padding: '7.5%'}]}>
          <Input
            id={'mobile'}
            label={'Mobile Number'}
            keyboardType="phone-pad"
            placeholder={'Mobile Number'}
            number
            indNum
            errMsg={'Please enter valid mobile number'}
            initalValue={signInFormStates.inputValues.mobile}
            initalVaidity={signInFormStates.inputValidities.mobile}
            onInputChangeHandler={dispatcher}
          />
          <Input
            id={'password'}
            label={'Password'}
            placeholder={'Enter your password'}
            min={6}
            secureTextEntry
            errMsg={'Password must be more than 6 letters'}
            onInputChangeHandler={dispatcher}
            initalValue={signInFormStates.inputValues.password}
            initalVaidity={signInFormStates.inputValidities.mobile}
          />
          <View style={styles.inputCon}>
            <Button
              disabled={!signInFormStates.formisValid || isLoading}
              onPress={signInHandler}
              title={'Sign In'}
              bg={colors.primary}
              container={styles.btnCon}
              txtStyle={styles.btnTxt}
              fontType={4}
              loadingColor={colors.white}
              loadingSize={34}
              isLoading={isLoading}
            />
          </View>
          <View style={{flexDirection: 'row', alignSelf: 'center'}}>
            <MyText
              fontType={3}
              style={{color: colors.grey, fontSize: responsiveFont(16)}}
              text={'Not yet a member, '}
            />
            <MyText
              onPress={() => navigation.navigate('Sign Up')}
              fontType={4}
              style={{color: colors.primary, fontSize: responsiveFont(16)}}
              text={'Sign up'}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
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
  inputCon: {
    marginVertical: 10,
  },
  btnCon: {
    width: '100%',
    height: dimensions.height * 0.08,
    padding: '3%',
  },
  btnTxt: {
    color: colors.white,
    fontSize: responsiveFont(18),
    textTransform: 'uppercase',
  },
});

export default SignInScreen;
