import React, {useEffect, useLayoutEffect, useState} from 'react';
import {View, Image, Text, StyleSheet} from 'react-native';
import colors from '../constants/colors';
import dimensions from '../constants/dimensions';
import responsiveFont from '../constants/responsiveFont';
import API from '../redux/BaseURL';
import MyText from '../components/ui/MyText';
import Button from '../components/ui/Button';
import ErrModal from '../components/ui/ErrModal';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import fonts from '../constants/fonts';
import {useSelector} from 'react-redux';
const CancelOrder = ({navigation, route}) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => null,
    });
  }, []);
  const userToken = useSelector(state => state.user.userToken);

  const [reasons, setReasons] = useState([]);
  const [selectedReason, setSelectedReason] = useState(null);
  const [cancelModal, setCancelModal] = useState(false);
  const cancelOrderHandler = async () => {
    let res = selectedReason ? selectedReason : reasons[0].value;
    // console.log(reasons[0]);
    try {
      await API.post(
        `customer/v1/orders/cancel/${route.params?.id}`,
        {
          reason: res.toString(),
        },
        {
          headers: {
            Authorization: userToken,
          },
        },
      );
      setCancelModal(true);
    } catch (e) {
      console.log(e.response);
    }
  };
  const getReasons = async () => {
    try {
      const response = await API.get('customer/v1/orders/2cxt/cancel/reasons');
      console.log(response.data);
      let reasonss = response.data.reasons.map(function (i) {
        return {
          label: i.content,
          value: i.id,
        };
      });
      setReasons(reasonss);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getReasons();
  }, []);

  const id = route.params?.id;
  return (
    <>
      <View style={{flex: 1}}>
        <View
          style={{
            flex: 0.2,
            backgroundColor: colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Image
              style={{
                width: dimensions.width * 0.125,
                height: dimensions.width * 0.125,
                resizeMode: 'contain',
                tintColor: colors.white,
              }}
              source={require('../assets/icons/error.png')}
            />
            <MyText
              text={'Cancel Order'}
              style={{fontSize: responsiveFont(18), color: colors.white}}
            />
          </View>
        </View>
        <View
          style={{
            flex: 0.6,
            marginTop: '5%',
            padding: '5%',
          }}>
          <MyText
            text={'Why are you cancelling your order?'}
            fontType={4}
            style={{fontSize: responsiveFont(16)}}
          />
          <RadioForm
            radio_props={reasons}
            initial={0}
            formHorizontal={false}
            labelHorizontal={true}
            buttonColor={colors.primary}
            selectedButtonColor={colors.primary}
            animation={true}
            onPress={value => {
              setSelectedReason(value);
            }}
            labelStyle={{
              fontSize: responsiveFont(15),
              fontFamily: fonts.poppins_medium,
            }} //text sixe
            radioStyle={{marginTop: '2.5%'}}
          />
        </View>

        <View style={styles.buttonCon}>
          <Button
            onPress={() => navigation.goBack()}
            title={'Cancel'}
            fontType={3}
            container={styles.buttonStyle}
            txtStyle={styles.pickupTxt}
          />
          <Button
            onPress={cancelOrderHandler}
            title={'Proceed'}
            fontType={3}
            bg={colors.primary}
            container={styles.buttonStyle}
            txtStyle={styles.deliveryTxt}
          />
        </View>
      </View>
      <ErrModal
        visible={cancelModal}
        btnTitle={'OK'}
        errMsg={'Your Order has ben cancelled'}
        onClose={() => {
          setCancelModal(false);
          navigation.navigate('Home');
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  buttonCon: {
    flex: 0.2,
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
    color: 'black',
    textTransform: 'uppercase',
    fontSize: responsiveFont(16),
  },
  deliveryTxt: {
    color: colors.white,
    textTransform: 'uppercase',
    fontSize: responsiveFont(16),
  },
});
export default CancelOrder;
