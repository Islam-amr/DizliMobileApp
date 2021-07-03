import React, {useLayoutEffect, useEffect, useRef, useState} from 'react';
import {
  View,
  Image,
  Pressable,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import {useSelector} from 'react-redux';
import MyText from '../components/ui/MyText';
import Button from '../components/ui/Button';
import commonStyles from '../constants/commonStyles';
import responsiveFont from '../constants/responsiveFont';
import ActionSheet from 'react-native-actions-sheet';
import dimensions from '../constants/dimensions';
import colors from '../constants/colors';
import ErrModal from '../components/ui/ErrModal';
import API from '../redux/BaseURL';
import HeaderIcon from '../components/ui/HeaderIcon';
import {BackHandler} from 'react-native';
import RestOrder from '../components/ui/RestOrder';
import DeliveryOrder from '../components/ui/DeliveryOrder';
import GrocOrder from '../components/ui/GrocOrder';
import Loading from '../utils/Loading';

const OrderDetails = ({navigation, route}) => {
  const handleBackButtonClick = () => {
    navigation.navigate('Home');
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
    };
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderIcon
          icon={require('../assets/icons/home.png')}
          onPress={() => navigation.navigate('Home')}
        />
      ),
      headerRight: () => null,
      headerTitle: null,
    });
  }, []);

  const hash = route.params?.hash;
  const [orderDetails, setOrderDetails] = useState({});
  const [orderType, setOrderType] = useState(null);

  const fetchOrderDetails = async () => {
    try {
      const response = await API.get(`customer/v1/orders/${hash}`);
      console.log(response.data);
      let data = await response.data;
      setOrderDetails(data);
      setOrderType(data?.order?.company?.category_type);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    const subscribe = fetchOrderDetails();

    return () => subscribe;
  }, []);
  console.log(orderType);

  if (orderType === null) {
    return (
      <View style={commonStyles.mainView}>
        <Loading color={colors.primary} size={26} />
      </View>
    );
  }
  if (orderType === 1) {
    return <RestOrder orderDetails={orderDetails} />;
  }

  return (
    <View style={{flex: 1}}>
      <GrocOrder orderDetails={orderDetails} />
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
export default OrderDetails;
