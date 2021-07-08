// packages import
import React, {useEffect, useRef} from 'react';
import {
  NavigationContainer,
  getFocusedRouteNameFromRoute,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import ActionSheet from 'react-native-actions-sheet';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {useSelector, useDispatch} from 'react-redux';
import Toast, {BaseToast} from 'react-native-toast-message';
import {enableScreens} from 'react-native-screens';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as userActions from '../redux/actions/user';
// screens import
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import HomeScreen from '../screens/HomeScreen';
import SplashScreen from '../screens/SplashScreen';
import OffersScreen from '../screens/OffersScreen';
import RestaurantsScreen from '../screens/RestaurantsScreen';
import GroceriesScreen from '../screens/GroceriesScreen';
import RestOrGrocScreen from '../screens/RestOrGrocScreen';
import SearchScreen from '../screens/SearchScreen';
import CartScreen from '../screens/CartScreen';
import VerifyScreen from '../screens/VerifyScreen';
import PaymentScreen from '../screens/PaymentScreen';
import OrderDetails from '../screens/OrderDetails';
import MangeAddressScreen from '../screens/MangeAddressScreen';
import SaveLocationScreen from '../screens/SaveLocationScreen';
import ActiveOrderData from '../screens/ActiveOrderData';

// constants import
import colors from '../constants/colors';
import responsiveFont from '../constants/responsiveFont';
import fonts from '../constants/fonts';

// ui components
import AddressModal from '../components/ui/AddressModal';
import CartIcon from '../components/ui/CartIcon';
import AddressHeader from '../components/ui/AddressHeader';

// drawer content import
import DrawerContent from '../components/ui/DrawerContent';
import commonStyles from '../constants/commonStyles';
import CancelOrder from '../screens/CancelOrder';

enableScreens();

const toastConfig = {
  success: ({text1, ...rest}) => (
    <BaseToast
      {...rest}
      style={{borderLeftColor: colors.primary}}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontSize: 10,
      }}
      text2Style={{
        color: 'black',
      }}
    />
  ),
};

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const headerStyle = {
  headerStyle: {
    backgroundColor: colors.primary,
    elevation: 0, // remove shadow on Android
    shadowOpacity: 0, // remove shadow on iOS
    borderBottomWidth: 0,
  },
  headerTintColor: colors.white,
  headerTitleAlign: 'center',
  headerTitleStyle: {
    fontFamily: fonts.poppins_medium,
    fontSize: responsiveFont(18.5),
    lineHeight: 40,
  },
  headerRight: () => <CartIcon />,
};

const AppStack = () => {
  return (
    <Stack.Navigator screenOptions={headerStyle}>
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{headerShown: false, gestureEnabled: true}}
      />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen
        name="Offers"
        component={OffersScreen}
        options={{headerTitle: 'Offers & Specials'}}
      />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Restaurants" component={RestaurantsScreen} />
      <Stack.Screen name="Groceries" component={GroceriesScreen} />
      <Stack.Screen
        name="RestOrGroc"
        component={RestOrGrocScreen}
        options={{headerTitle: () => <AddressHeader noTouch />}}
      />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Sign In" component={SignInScreen} />
      <Stack.Screen name="Sign Up" component={SignUpScreen} />
      <Stack.Screen name="Verify" component={VerifyScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="Order Details" component={OrderDetails} />
      <Stack.Screen name="Mange Address" component={MangeAddressScreen} />
      <Stack.Screen name="Add Address" component={SaveLocationScreen} />
      <Stack.Screen name="Cancel Order" component={CancelOrder} />
      <Stack.Screen
        name="ActiveOrderData"
        options={{title: 'Order Details'}}
        component={ActiveOrderData}
      />
    </Stack.Navigator>
  );
};

const AppDrawer = () => {
  const userLoggedIn = useSelector(state => state.user.isLoggedIn);
  return (
    <Drawer.Navigator
      overlayColor={'rgba(255,255,255,0)'}
      drawerContentOptions={{
        activeTintColor: colors.primary,
        labelStyle: {
          fontSize: responsiveFont(16),
          fontFamily: fonts.Poppins_SemiBold,
        },
      }}
      screenOptions={({route}) => {
        const routeName = getFocusedRouteNameFromRoute(route);
        console.log(routeName, 'asfasf');
        if (routeName === 'Splash') {
          return {swipeEnabled: false};
        } else if (userLoggedIn && routeName) {
          return {swipeEnabled: true};
        } else {
          return {swipeEnabled: false};
        }
      }}
      drawerStyle={{
        width: '100%',
        height: '100%',
      }}
      drawerContent={props => <DrawerContent {...props} />}>
      <Drawer.Screen name="Home" component={AppStack} />
    </Drawer.Navigator>
  );
};

const MainNavigation = () => {
  const dispatch = useDispatch();
  const actionSheetRef = useRef();
  const globalModal = useSelector(state => state.globalModal);

  const getUserCred = async () => {
    const token = await AsyncStorage.getItem('@userToken');
    const userData = await AsyncStorage.getItem('@userData');
    if (token && userData) {
      dispatch(userActions.offlineLogin(token, userData));
    } else {
      return;
    }
  };
  useEffect(() => {
    getUserCred();
  }, []);

  // to handle global modal
  useEffect(() => {
    const subscribe = () => actionSheetRef.current?.setModalVisible();

    return subscribe;
  }, [globalModal]);

  return (
    <>
      <NavigationContainer>
        <AppDrawer />
      </NavigationContainer>
      <ActionSheet
        closeOnPressBack
        closeOnTouchBackdrop
        ref={actionSheetRef}
        containerStyle={commonStyles.globalModal}>
        <AddressModal />
      </ActionSheet>
    </>
  );
};

export default MainNavigation;
