import React, {useEffect, useRef} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import HeaderIcon from './HeaderIcon';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import MyText from './MyText';
import * as Animatable from 'react-native-animatable';

const CartIcon = () => {
  const animateRef = useRef();
  const navigation = useNavigation();
  const cartItems = useSelector(state => state.user.userCart?.products || 0);
  useEffect(() => {
    if (cartItems.length === 0) {
      return;
    }
    animateRef.current.bounce();
  }, [cartItems]);
  return (
    <Animatable.View ref={animateRef}>
      <TouchableOpacity
        ref={animateRef}
        style={{justifyContent: 'center', alignItems: 'center'}}
        activeOpacity={0.6}
        onPress={() => navigation.navigate('Cart')}>
        <HeaderIcon
          icon={require('../../assets/icons/cart.png')}
          iconStyle={{width: '60%', height: '60%', resizeMode: 'contain'}}
          onPress={() => navigation.navigate('Cart')}
        />
        <View
          style={{
            position: 'absolute',
            width: '35%',
            height: '35%',
            justifyContent: 'center',
            alignItems: 'center',
            bottom: '25%',
          }}>
          {/* <Text style={{color: 'white'}}>{cartItems.length}</Text> */}
          <MyText
            text={cartItems.length || 0}
            fontType={4}
            style={{color: 'white'}}
          />
        </View>
      </TouchableOpacity>
    </Animatable.View>
  );
};

export default CartIcon;
