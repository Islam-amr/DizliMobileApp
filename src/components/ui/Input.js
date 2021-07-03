import React, {useEffect, useReducer} from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import colors from '../../constants/colors';
import dimensions from '../../constants/dimensions';
import fonts from '../../constants/fonts';
import responsiveFont from '../../constants/responsiveFont';

// ui components import
import MyText from './MyText';

const INPUT_UPDATE = 'INPUT_UPDATE';
const INPUT_BLUR = 'INPUT_BLUR';
const INPUT_FOCUSED = 'INPUT_FOCUSED';

const inputReducer = (state, action) => {
  switch (action.type) {
    case INPUT_UPDATE:
      return {
        ...state,
        value: action.value,
        isValid: action.isValid,
      };
    case INPUT_BLUR:
      return {
        ...state,
        touched: true,
        focused: false,
      };
    case INPUT_FOCUSED:
      return {
        ...state,
        focused: true,
      };
    default:
      return state;
  }
};

const Input = props => {
  const [inputStates, disptachInputStates] = useReducer(inputReducer, {
    value: props.initalValue || '',
    isValid: props.initalVaidity,
    touched: false,
    focused: false,
  });

  const onChangeTextHandler = text => {
    const emailReg =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    const indianNumberReg =
      /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/;
    let isValid = true;
    if (props.notNum && /[^a-zA-Z]/.test(text)) {
      isValid = false;
    }
    if (props.number && isNaN(text)) {
      isValid = false;
    }
    if (props.email && !emailReg.test(text)) {
      isValid = false;
    }
    if (props.indNum && !indianNumberReg.test(text)) {
      isValid = false;
    }
    if (props.required && text.trim().length === 0) {
      isValid = false;
    }
    if (props.min != null && +text.length < props.min) {
      isValid = false;
    }
    if (props.max != null && +text.length > props.max) {
      isValid = false;
    }
    if (props.confirmPassword && text !== props.confirmPassword) {
      isValid = false;
    }
    disptachInputStates({
      type: INPUT_UPDATE,
      value: text,
      isValid: isValid,
    });
  };

  const lostFocushandler = () => {
    disptachInputStates({type: INPUT_BLUR});
  };

  const inputFocused = () => {
    disptachInputStates({type: INPUT_FOCUSED});
  };

  useEffect(() => {
    props.onInputChangeHandler(
      props.id,
      inputStates.value,
      inputStates.isValid,
    );
  }, [inputStates]);

  return (
    <>
      <View style={styles.inputCon}>
        {props.label && (
          <MyText fontType={4} text={props.label} style={styles.label} />
        )}
        <TextInput
          ref={ref =>
            ref &&
            ref.setNativeProps({
              style: {
                fontFamily: fonts.poppins_regular,
                linehHeight: 22,
              },
            })
          }
          {...props}
          allowFontScaling={false}
          value={inputStates.value}
          style={[
            styles.input,
            {
              borderColor: inputStates.focused
                ? colors.primary
                : colors.borderColor,
            },
          ]}
          onChangeText={text => {
            onChangeTextHandler(text);
          }}
          onBlur={lostFocushandler}
          onFocus={inputFocused}
        />
      </View>
      {!inputStates.isValid && props.errMsg && inputStates.touched && (
        <MyText text={props.errMsg} style={styles.errMsg} />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  inputCon: {
    width: '100%',
    marginVertical: 10,
  },
  label: {
    fontSize: responsiveFont(18),
  },
  input: {
    borderColor: colors.borderColor,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: '5%',
    fontSize: responsiveFont(15),
    height: dimensions.height * 0.07,
  },
  errMsg: {
    fontSize: responsiveFont(14),
    color: colors.primary,
    marginLeft: '5%',
  },
});

export default Input;
