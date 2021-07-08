import React, {useLayoutEffect, useEffect, useState} from 'react';
import {View, Text, FlatList, Image, ScrollView} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Button from '../components/ui/Button';
import MyText from '../components/ui/MyText';
import colors from '../constants/colors';
import commonStyles from '../constants/commonStyles';
import dimensions from '../constants/dimensions';
import responsiveFont from '../constants/responsiveFont';
import {useDispatch, useSelector} from 'react-redux';
import * as userActions from '../redux/actions/user';
import CommonList from '../components/ui/CommonList';
import API from '../redux/BaseURL';

const Item = props => {
  const dispatch = useDispatch();
  const onRemove = item => {
    dispatch(userActions.removeFromCartImmediately(item));
  };
  return (
    <View
      style={{
        marginVertical: '2.5%',
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <View style={{flex: 0.6}}>
        <MyText
          nol={2}
          text={`${props.item.name} X${props.item.quantity}`}
          fontType={3}
          style={{
            color: colors.black,
            fontSize: responsiveFont(14),
            marginLeft: '10%',
          }}
        />
        {props.extra && (
          <>
            <MyText
              nol={1}
              text={'Coca-Cola X 2'}
              fontType={2}
              style={{
                color: colors.grey,
                fontSize: responsiveFont(14),
                marginLeft: '20%',
              }}
            />
            <MyText
              nol={1}
              text={'Mushrooms'}
              fontType={2}
              style={{
                color: colors.grey,
                fontSize: responsiveFont(14),
                marginLeft: '20%',
              }}
            />
          </>
        )}
      </View>
      <View
        style={{
          flex: 0.25,
          alignItems: 'center',
        }}>
        <MyText
          nol={1}
          text={`₹${props.item.price}`}
          fontType={3}
          style={{
            color: colors.grey,
            fontSize: responsiveFont(14),
          }}
        />
        {props.extra && (
          <>
            <MyText
              nol={1}
              text={'₹150.20'}
              fontType={2}
              style={{
                color: colors.grey,
                fontSize: responsiveFont(14),
              }}
            />
            <MyText
              nol={1}
              text={'₹150.20'}
              fontType={2}
              style={{
                color: colors.grey,
                fontSize: responsiveFont(14),
              }}
            />
          </>
        )}
      </View>
      <View
        style={{
          flex: 0.15,
          alignItems: 'center',
        }}>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => onRemove({...props.item})}>
          <Image
            source={require('../assets/icons/deletee.png')}
            style={{width: 25, height: 25, resizeMode: 'contain'}}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const CartScreen = ({navigation}) => {
  const userLoggedIn = useSelector(state => state.user.isLoggedIn);
  const userCurrentRest = useSelector(state => state.user.curretCartRestarunt);
  const userCart = useSelector(state => state.user.userCart);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Your Cart',
      headerRight: null,
    });
  }, []);

  if (userCart.products.length === 0) {
    return (
      <View
        style={[
          commonStyles.mainView2,
          {justifyContent: 'center', alignItems: 'center'},
        ]}>
        <MyText
          fontType={4}
          style={{fontSize: responsiveFont(20), color: colors.grey}}
          text={'Your cart is empty'}
        />
        <Button
          title={'ADD ITEMS'}
          container={{
            bottom: 0,
            height: dimensions.height * 0.08,
            position: 'absolute',
            width: '90%',
            backgroundColor: colors.primary,
            marginVertical: '7.5%',
            paddingHorizontal: '7.5%',
            alginSelf: 'center',
          }}
          fontType={4}
          txtStyle={{color: colors.white, fontSize: responsiveFont(16)}}
          onPress={() => navigation.navigate('Home')}
        />
      </View>
    );
  }

  return (
    <View style={commonStyles.mainView2}>
      <CommonList userCurrentRest={userCurrentRest} userCart={userCart} />
      <View style={{paddingHorizontal: '5%'}}>
        <MyText
          text={'We accept payment by cash, card, Net banking, UPI & wallet'}
          fontType={2}
          style={{
            color: colors.grey,
            fontSize: responsiveFont(12),
            lineHeight: 20,
          }}
        />
      </View>
      <View
        style={{
          flex: 0.175,
          justifyContent: 'space-around',
          flexDirection: 'row',
          paddingHorizontal: '5%',
        }}>
        <Button
          title={'ADD ITEMS'}
          container={{
            borderColor: colors.primary,
            borderWidth: 1,
            backgroundColor: colors.white,
            marginVertical: '7.5%',
            paddingHorizontal: '7.5%',
          }}
          fontType={4}
          txtStyle={{color: colors.black, fontSize: responsiveFont(16)}}
          onPress={() => navigation.navigate('RestOrGroc', {addItems: true})}
        />
        <Button
          title={'CHECK OUT'}
          container={{
            backgroundColor: colors.primary,
            marginVertical: '7.5%',
            paddingHorizontal: '7.5%',
          }}
          fontType={4}
          txtStyle={{color: colors.white, fontSize: responsiveFont(16)}}
          onPress={
            userLoggedIn
              ? () => navigation.navigate('Payment')
              : navigation.navigate('Sign In')
          }
        />
      </View>
    </View>
  );
};

export default CartScreen;
