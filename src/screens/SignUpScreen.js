// package import
import React, {
  useLayoutEffect,
  useEffect,
  useState,
  useReducer,
  useCallback,
} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Image,
} from 'react-native';
import {useDispatch} from 'react-redux';

// user Action import
import * as userActions from '../redux/actions/user';

// app Api
import API from '../redux/BaseURL';

// ui Components import
import Button from '../components/ui/Button';
import MyText from '../components/ui/MyText';
import Input from '../components/ui/Input';

// constants import
import commonStyles from '../constants/commonStyles';
import responsiveFont from '../constants/responsiveFont';
import colors from '../constants/colors';
import dimensions from '../constants/dimensions';
import ErrModal from '../components/ui/ErrModal';

const SIGN_UP_UPDATE = 'SIGN_UP_UPDATE';
const signUpFormReducer = (state, action) => {
  if (action.type === SIGN_UP_UPDATE) {
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
  }
};

const SignUpScreen = ({navigation}) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: null,
    });
  }, []);
  const dispatch = useDispatch(); // to dispatch user action
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState(false);
  const [errModalVisible, setErrModalVisible] = useState(false);
  const [signUpFormStates, dispatchSignUpForm] = useReducer(signUpFormReducer, {
    inputValues: {
      name: '',
      email: '',
      mobile: '',
      password: '',
      confirmPassword: '',
    },
    inputValidities: {
      name: false,
      email: false,
      mobile: false,
      password: false,
      confirmPassword: false,
    },
    formisValid: false,
  });

  const dispatcher = useCallback(
    (inputId, inputValue, inputValidity) => {
      dispatchSignUpForm({
        type: SIGN_UP_UPDATE,
        payload: inputValue,
        isValid: inputValidity,
        input: inputId,
      });
    },
    [dispatchSignUpForm], // to re-create function when login reducer actions called
  );

  const signUpHandler = async () => {
    setErrMsg(null);
    setIsLoading(true);
    try {
      await dispatch(
        userActions.signUp(
          signUpFormStates.inputValues.name,
          signUpFormStates.inputValues.email,
          signUpFormStates.inputValues.mobile,
          2,
          14,
          signUpFormStates.inputValues.password,
          signUpFormStates.inputValues.confirmPassword,
        ),
      );
      navigation.navigate('Verify', {
        phone: signUpFormStates.inputValues.mobile,
      });
    } catch (e) {
      setErrMsg(e.response.data.message);
      setErrModalVisible(true);
    }
    setIsLoading(false);
  };

  return (
    <>
      <TouchableWithoutFeedback
        style={commonStyles.mainView2}
        onPress={() => Keyboard.dismiss()}>
        <ScrollView
          style={[commonStyles.mainView2, {paddingHorizontal: '6.5%'}]}>
          <View style={{marginTop: '2.5%'}}>
            <Input
              id={'name'}
              label={'Name'}
              required
              placeholder={'Enter your name'}
              onInputChangeHandler={dispatcher}
              errMsg={'Please enter your name'}
              initalValue={signUpFormStates.inputValues.name}
              initalVaidity={signUpFormStates.inputValidities.name}
            />
            <Input
              id={'email'}
              label={'Email ID'}
              placeholder={'Enter your email'}
              onInputChangeHandler={dispatcher}
              email
              errMsg={'Please enter valid email'}
              initalValue={signUpFormStates.inputValues.email}
              initalVaidity={signUpFormStates.inputValidities.email}
            />
            <Input
              id={'mobile'}
              label={'Mobile Number'}
              keyboardType="phone-pad"
              placeholder={'Mobile Number'}
              number
              indNum
              errMsg={'Please enter valid mobile number'}
              onInputChangeHandler={dispatcher}
              initalValue={signUpFormStates.inputValues.mobile}
              initalVaidity={signUpFormStates.inputValidities.mobile}
            />
            <Input
              id={'password'}
              label={'Password'}
              placeholder={'Enter your password'}
              confirmPassword={signUpFormStates.inputValues.confirmPassword}
              min={6}
              secureTextEntry
              errMsg={'Password must be more than 6 letters'}
              onInputChangeHandler={dispatcher}
              initalValue={signUpFormStates.inputValues.password}
              initalVaidity={signUpFormStates.inputValidities.password}
            />
            <Input
              id={'confirmPassword'}
              label={'Confirm Password'}
              placeholder={'Confirm your password'}
              confirmPassword={signUpFormStates.inputValues.password}
              min={6}
              secureTextEntry
              errMsg={"Passwords doesn't match"}
              onInputChangeHandler={dispatcher}
              initalValue={signUpFormStates.inputValues.confirmPassword}
              initalVaidity={signUpFormStates.inputValidities.confirmPassword}
            />
            <View style={styles.inputCon}>
              <Button
                onPress={signUpHandler}
                disabled={!signUpFormStates.formisValid || isLoading}
                title={'Sign Up'}
                isLoading={isLoading}
                bg={colors.primary}
                container={styles.btnCon}
                txtStyle={styles.btnTxt}
                fontType={4}
                loadingColor={colors.white}
                loadingSize={34}
              />
            </View>
          </View>
        </ScrollView>
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
  label: {
    fontSize: responsiveFont(16),
    marginBottom: 5,
  },
  inputCon: {
    marginVertical: 10,
  },
  doubleBtnCon: {
    marginVertical: 10,
    flexDirection: 'row',
    marginBottom: '10%',
  },
  input: {
    borderColor: colors.borderColor,
    borderWidth: 2,
    borderRadius: 5,
    paddingHorizontal: '5%',
    fontSize: responsiveFont(16),
    height: dimensions.height * 0.06,
  },
  btnCon: {
    width: '100%',
    padding: '3%',
  },
  btnTxt: {
    color: colors.white,
    fontSize: responsiveFont(18),
    textTransform: 'uppercase',
  },
  or: {
    fontSize: responsiveFont(18),
    color: colors.grey,
  },
  googleBtn: {
    flex: 1,
    marginStart: '5%',
    padding: '5%',
    borderColor: colors.borderColor,
    borderWidth: 2,
    flexDirection: 'row-reverse',
  },
  fbBtn: {
    flex: 1,
    width: '45%',
    padding: '5%',
    borderColor: colors.blue,
    borderWidth: 2,
    flexDirection: 'row-reverse',
  },
  fbTxt: {
    color: colors.blue,
    fontSize: responsiveFont(16),
  },
  googleTxt: {
    color: '#525068',
    fontSize: responsiveFont(16),
  },
});

export default SignUpScreen;
