import React, {useLayoutEffect, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import commonStyles from '../constants/commonStyles';
import {useDispatch, useSelector} from 'react-redux';
import CommonList from '../components/ui/CommonList';
import MyText from '../components/ui/MyText';
import Button from '../components/ui/Button';
import responsiveFont from '../constants/responsiveFont';
import colors from '../constants/colors';
import dimensions from '../constants/dimensions';
import ErrModal from '../components/ui/ErrModal';
import ActionSheet from 'react-native-actions-sheet';
import API from '../redux/BaseURL';
import RazorpayCheckout from 'react-native-razorpay';
import * as userActions from '../redux/actions/user';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import fonts from '../constants/fonts';

const radio_props = [
  {label: 'Cash on Delivery', value: false},
  {label: 'Online Payment', value: true},
];

const ActiveTab = ({active}) => {
  return (
    <View
      style={[
        {
          width: 25,
          height: 25,
          borderRadius: 12.5,
          overflow: 'hidden',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: '5%',
        },
        active
          ? {backgroundColor: colors.primary}
          : {borderColor: colors.borderColor, borderWidth: 2},
      ]}>
      {active && (
        <Image
          style={{width: '70%', height: '70%', resizeMode: 'contain'}}
          source={require('../assets/icons/check.png')}
        />
      )}
    </View>
  );
};

const Payment = ({navigation}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errModalVisible, setErrModalVisible] = useState(false);
  const [errModal, setErrModal] = useState(null);
  const userCurrentRest = useSelector(state => state.user.curretCartRestarunt);
  const userCart = useSelector(state => state.user.userCart);
  const userCurrentLocation = useSelector(
    state => state.user.destination?.place,
  );
  const userToken = useSelector(state => state.user.userToken);
  const userDelivery = useSelector(state => state.user.currentDeliverLocation);
  const actionSheetRef = useRef(); // to control map modal
  const [paymentType, setPaymentType] = useState(false);
  const [dilverTo, setDilverTo] = useState(true);
  const [total, setTotal] = useState(0);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => null,
    });
  }, []);

  const onlinePayment = (amount, key, hash) => {
    let options = {
      description: 'Credits towards consultation',
      image:
        'https://i0.wp.com/www.ecommerce-nation.com/wp-content/uploads/2019/02/Razorpay-the-new-epayment-that-will-break-everything-in-2019.png?fit=1000%2C600&ssl=1',
      currency: 'INR',
      key: key,
      amount: amount,
      name: 'Razor Pay',
      theme: {color: '#012652'},
    };
    RazorpayCheckout.open(options)
      .then(data => {
        // handle success
        // alert(`Success: ${data.razorpay_payment_id}`);
        dispatch(userActions.clearCart());
        navigation.navigate('Order Details', {
          hash,
        });
      })
      .catch(error => {
        setErrModal(error.error.reason);
        setErrModalVisible(true);
      });
  };

  const createOrder = async type => {
    let newProduct = userCart.products.map(function (i) {
      return {
        addon_groups: i.addon_groups ? [i.addon_groups] : [],
        id: i.id,
        quantity: i.quantity,
        variant_groups: i.variant_groups ? i.variant_groups : [],
        // {"addon_groups": {"addons": [], "id": null, "name": "(T)"}, "id": 2613, "name": "Simply Veg", "price": 379, "quantity": 1, "tax": 0, "variant_groups": [{"id": 19, "name": "Large", "price": 240, "variant_id": 74}]}
      };
    });
    console.log(newProduct, 'safasf');

    let orderData = {
      amount: total,
      vehicle_type: 2,
      payment_type: type,
      products: newProduct,
      team_id: userCart.team_id,
      delivery_type: dilverTo ? 1 : 2,
      merchant_id: userCart.merchant_id,
      customer_notification_language: 'en',
      customer_notification_type: 1,
      destination: userDelivery,
    };

    setLoading(true);
    try {
      const response = await API.post('customer/v1/orders', orderData, {
        headers: {
          Authorization: userToken,
        },
      });
      actionSheetRef.current?.setModalVisible();

      if (type === 2) {
        let amount = response.data.payment_data.amount;
        let key = response.data.payment_data.key;
        let hash = response.data?.order?.hash;
        onlinePayment(amount, key, hash);
      }
      if (type === 1) {
        dispatch(userActions.clearCart());
        navigation.navigate('Order Details', {
          hash: response.data?.order?.hash,
        });
      }
    } catch (e) {
      console.log(e.response);
    }
    setLoading(false);
  };

  return (
    <>
      <ScrollView style={commonStyles.mainView2}>
        <CommonList
          userCurrentRest={userCurrentRest}
          userCart={userCart}
          scrollEnabled={false}
          noRemove
          setTotal={setTotal.bind(this)}
        />
        <MyText
          text={'We accept payment by cash or card'}
          style={styles.weAccept}
        />
        <View
          style={{
            width: '90%',
            alignSelf: 'center',
            marginTop: '5%',
            marginBottom: '5%',
          }}>
          <View
            style={{
              flexDirection: 'row',
              marginVertical: '2.5%',
              justifyContent: 'space-between',
            }}>
            <MyText
              text={'Any request for the restaurant?'}
              fontType={2}
              style={{fontSize: responsiveFont(14)}}
            />
            <Image
              style={{width: 20, height: 20, resizeMode: 'contain'}}
              source={require('../assets/icons/note.png')}
            />
          </View>
          <View
            style={{
              borderColor: colors.grey,
              borderWidth: 1,
              height: dimensions.height * 0.15,
            }}>
            <TextInput multiline={true} />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginVertical: '5%',
            }}>
            <View style={{flex: 1}}>
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  justifyContent: 'space-evenly',
                }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    flex: 1,
                  }}
                  onPress={() => setDilverTo(true)}>
                  <ActiveTab active={dilverTo} />
                  <MyText
                    text={'Deliver to'}
                    fontType={dilverTo ? 4 : 2}
                    style={{lineHeight: 36}}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
              }}
              onPress={() => setDilverTo(false)}>
              <ActiveTab active={!dilverTo} />
              <MyText
                text={'PickUp'}
                fontType={!dilverTo ? 4 : 2}
                style={{
                  lineHeight: 36,
                }}
              />
            </TouchableOpacity>
          </View>
          <MyText text={userCurrentLocation} />
          <View style={{marginTop: '5%'}}>
            <Button
              onPress={() => actionSheetRef.current?.setModalVisible()}
              title={'Paymen Options'}
              bg={colors.primary}
              container={styles.btnCon}
              txtStyle={styles.btnTxt}
              fontType={4}
            />
          </View>
        </View>
      </ScrollView>
      <ActionSheet ref={actionSheetRef} containerStyle={styles.modalCon}>
        {/* <CashOnDelivery amount={userCart.amount} /> */}
        <View
          style={[
            styles.modalCon,
            {paddingHorizontal: '5%', marginBottom: '5%'},
          ]}>
          <View
            style={{
              paddingHorizontal: '2.5%',
              marginTop: '5%',
              flexDirection: 'row-reverse',
            }}>
            <TouchableOpacity
              onPress={() => actionSheetRef.current?.setModalVisible()}>
              <Image
                source={require('../assets/icons/xMark.png')}
                style={styles.xImg}
              />
            </TouchableOpacity>
          </View>
          <MyText
            fontType={4}
            text={'Payment Amount'}
            style={{textAlign: 'center', fontSize: responsiveFont(22)}}
          />
          <MyText
            fontType={3}
            text={`₹${total}`}
            style={{
              textAlign: 'center',
              fontSize: responsiveFont(16),
            }}
          />
          <View
            style={{
              height: dimensions.height * 0.125,
              justifyContent: 'center',
              marginTop: '5%',
            }}>
            <RadioForm
              radio_props={radio_props}
              initial={0}
              formHorizontal={false}
              labelHorizontal={true}
              buttonColor={colors.primary}
              selectedButtonColor={colors.primary}
              animation={true}
              onPress={value => {
                setPaymentType(value);
              }}
              labelStyle={{
                fontSize: responsiveFont(15),
                fontFamily: fonts.poppins_medium,
              }} //text sixe
              radioStyle={{marginTop: '2.5%'}}
            />
          </View>
          {paymentType && (
            <MyText
              fontType={2}
              text={
                'You will be redirected to the providers’ payment platform to complete the purchase.'
              }
              style={{
                textAlign: 'left',
                fontSize: responsiveFont(14),
                marginTop: '2.5%',
              }}
            />
          )}
          <Button
            onPress={
              paymentType === false
                ? () => createOrder(1)
                : () => createOrder(2)
            }
            isLoading={loading}
            title={'Confirm'}
            bg={colors.primary}
            container={styles.btnCon}
            txtStyle={styles.btnTxt}
            fontType={4}
            loadingColor={colors.white}
            loadingSize={34}
          />
        </View>
      </ActionSheet>
      <ErrModal
        visible={errModalVisible}
        btnTitle={'OK'}
        errMsg={errModal}
        onClose={() => setErrModalVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  toPay: {
    fontSize: responsiveFont(18),
    color: colors.black,
  },
  weAccept: {
    paddingHorizontal: '5%',
    borderBottomColor: colors.borderColor,
    borderBottomWidth: 1,
    paddingBottom: '2.5%',
  },
  btnCon: {
    marginTop: '5%',
    width: '100%',
    padding: '3%',
    height: dimensions.height * 0.08,
  },
  btnTxt: {
    color: colors.white,
    fontSize: responsiveFont(18),
    textTransform: 'uppercase',
  },
  modalCon: {
    width: dimensions.width,
    backgroundColor: colors.white,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  xImg: {
    width: dimensions.width * 0.05,
    height: dimensions.width * 0.05,
    resizeMode: 'contain',
  },
  line: {
    width: '95%',
    alignSelf: 'center',
    height: 4,
    backgroundColor: colors.borderColor,
    marginTop: '5%',
  },
});

export default Payment;
