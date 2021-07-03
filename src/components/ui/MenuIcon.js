import React from 'react';
import {View, Text} from 'react-native';
import HeaderIcon from '../ui/HeaderIcon';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
const MenuIcon = () => {
  const navigation = useNavigation();
  const userState = useSelector(state => state.user);

  const drawerHandler = () => {
    if (userState.isLoggedIn) {
      navigation.toggleDrawer();
    } else {
      navigation.navigate('Sign In');
    }
  };
  return (
    <HeaderIcon
      icon={require('../../assets/icons/menu.png')}
      onPress={drawerHandler}
    />
  );
};

export default MenuIcon;
