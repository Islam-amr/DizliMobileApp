import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import OrderSteps from './OrderSteps';
import responsiveFont from '../../constants/responsiveFont';
import ActionSheet from 'react-native-actions-sheet';
import dimensions from '../../constants/dimensions';
import colors from '../../constants/colors';
import commonStyles from '../../constants/commonStyles';
import MyText from '../ui/MyText';
import {useNavigation} from '@react-navigation/core';

const RestOrder = ({orderDetails}) => {
  const navigation = useNavigation();
  console.log(orderDetails.order.status);
  let unactive = require('../../assets/icons/orderSteps.png');
  let active = require('../../assets/icons/activeStep.png');
  return (
    <View style={commonStyles.mainView2}>
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
            }}
            source={require('../../assets/icons/checkOrder.png')}
          />
          <MyText
            text={'Payment successful'}
            style={{fontSize: responsiveFont(18), color: colors.white}}
          />
          <MyText
            text={`Your order number is ${orderDetails.order.order_id}`}
            style={{fontSize: responsiveFont(14), color: colors.white}}
          />
        </View>
      </View>
      <View
        style={{
          flex: 0.15,
          paddingHorizontal: '2.5%',
        }}>
        <View
          style={{
            flex: 0.8,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-evenly',
          }}>
          <OrderSteps
            icon={
              orderDetails.order.status === 8 || orderDetails.order.status === 1
                ? active
                : unactive
            }
            bigger={
              orderDetails.order.status === 8 || orderDetails.order.status === 1
            }
          />
          <Image source={require('../../assets/icons/line.png')} />
          <OrderSteps
            icon={orderDetails.order.status === 2 ? active : unactive}
            bigger={orderDetails.order.status === 2}
          />
          {orderDetails.order.delivery_type === 1 ? (
            <>
              <Image source={require('../../assets/icons/line.png')} />
              <OrderSteps
                icon={orderDetails.order.status === 4 ? active : unactive}
                bigger={orderDetails.order.status === 4}
              />
            </>
          ) : (
            <>
              <Image source={require('../../assets/icons/line.png')} />
              <OrderSteps
                icon={orderDetails.order.status === 4 ? active : unactive}
                bigger={orderDetails.order.status === 4}
              />
            </>
          )}
        </View>
        <View
          style={{
            flex: 0.2,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flex: 1,
            }}>
            <MyText
              text={'Order placed'}
              style={{fontSize: responsiveFont(12), color: colors.grey}}
            />
          </View>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
            }}>
            <MyText
              text={'Kitchen Fcooking'}
              style={{fontSize: responsiveFont(12), color: colors.grey}}
            />
          </View>
          <View
            style={{
              flex: 1,
              alignItems: 'flex-end',
            }}>
            <MyText
              text={
                orderDetails.order.delivery_type === 1
                  ? 'Out for delivery'
                  : 'Ready for pickup'
              }
              style={{fontSize: responsiveFont(12), color: colors.grey}}
            />
          </View>
        </View>
      </View>
      <View style={{flex: 0.55, justifyContent: 'space-between'}}>
        <View>
          <View style={{paddingHorizontal: '5%', marginTop: '5%'}}>
            <MyText
              fontType={4}
              text={`Expected time - ${
                orderDetails.order.remaining.time || 60
              } min`}
              style={{fontSize: responsiveFont(18)}}
            />
            <MyText
              text={'Time until your order will be delivered'}
              style={{color: colors.grey}}
            />
          </View>
          {orderDetails.order.delivery_type === 1 && (
            <View style={{paddingHorizontal: '5%', marginTop: '5%'}}>
              <MyText
                fontType={4}
                text={'Deliver to'}
                style={{fontSize: responsiveFont(18)}}
              />
              <MyText
                text={orderDetails.order.destination.place}
                style={{color: colors.grey}}
              />
            </View>
          )}
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ActiveOrderData', {
                orderDetails: orderDetails,
              })
            }
            style={{
              paddingHorizontal: '5%',
              marginTop: '5%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <MyText
              fontType={4}
              text={'Your order'}
              style={{fontSize: responsiveFont(18)}}
            />
            <Image
              style={{
                width: dimensions.width * 0.06,
                height: dimensions.width * 0.06,
                resizeMode: 'contain',
                tintColor: colors.primary,
              }}
              source={require('../../assets/icons/rightArrow.png')}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: '5%',
          }}>
          <MyText
            fontType={2}
            text={'Call support 12345678 (7am-7pm)'}
            style={{fontSize: responsiveFont(12)}}
          />
          <MyText
            onPress={() =>
              navigation.navigate('Cancel Order', {id: orderDetails.order.id})
            }
            fontType={4}
            text={'Cancel order'}
            style={{fontSize: responsiveFont(14), color: colors.primary}}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  btnCon: {
    width: '90%',
    padding: '3%',
    marginVertical: '5%',
    height: dimensions.height * 0.08,
    alignSelf: 'center',
  },
  btnTxt: {
    color: colors.white,
    fontSize: responsiveFont(18),
    textTransform: 'uppercase',
  },
});

export default RestOrder;
