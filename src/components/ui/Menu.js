import React, {useState} from 'react';
import {View, TouchableOpacity, FlatList, Image} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import colors from '../../constants/colors';
import responsiveFont from '../../constants/responsiveFont';
import fonts from '../../constants/fonts';
import commonStyles from '../../constants/commonStyles';
import Categories from './Categories';
import MyText from './MyText';
import {color} from 'react-native-reanimated';
import dimensions from '../../constants/dimensions';
import {useEffect} from 'react';
import StoreMenuItem from './StoreMenuItem';
import {useDispatch, useSelector} from 'react-redux';
import * as userActions from '../../redux/actions/user';
import ErrModal from './ErrModal';
import ReorderModal from './ReorderModal';

const Menu = ({route}) => {
  const Tab = createMaterialTopTabNavigator();
  const dispatch = useDispatch();
  const curentCart = useSelector(state => state.user.curretCartRestarunt);
  const [errModalVisible, setErrModalVisible] = useState(false);
  const [cartResetModal, setCartResetModal] = useState(false);
  const restaurantData = route.params?.restaurantData;
  const restaurantStatus = route.params?.restaurantStatus;
  // const deliveryTime = route.params?.deliveryTime;
  const [menus, setMenus] = useState(route.params?.itemCategories);
  const [activeMenu, setActiveMenu] = useState(
    route.params?.itemCategories[0].id,
  );
  const [menuItems, setMenuItems] = useState(
    route.params?.itemCategories[0]?.products,
  );

  useEffect(() => {
    setMenuItems(
      route.params?.itemCategories.find(item => item.id === activeMenu)
        .products,
    );
  }, [activeMenu]);

  const onAddToCart = (merchentData, products = {}, teamId, price, tax) => {
    if (curentCart?.itemId) {
      if (curentCart.itemId !== merchentData.itemId) {
        setCartResetModal(true);
        return;
      }
      console.log(curentCart, 'dsfdsf');
      console.log(merchentData, 'sdfsdf');
    }
    if (!restaurantStatus) {
      setErrModalVisible(true);
      return;
    }
    dispatch(userActions.addToCart(merchentData, products, teamId, price, tax));
  };
  const onRemove = (id, price, name, tax) => {
    dispatch(userActions.removeFromCart(id, price, name, tax));
  };

  return (
    <>
      <View style={commonStyles.mainView2}>
        <View style={{marginVertical: '2.5%', marginHorizontal: '5%'}}>
          <Categories
            data={menus}
            onChange={activeMenuId => setActiveMenu(activeMenuId)}
          />
        </View>
        <View
          style={{
            flex: 1,
            //   backgroundColor: 'red',
          }}>
          <View
            style={{
              flexDirection: 'row',
              width: '80%',
              alignSelf: 'center',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: colors.backgroundColor,
              padding: '2.5%',
              marginVertical: '2.5%',
              borderRadius: 5,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 12,
              },
              shadowOpacity: 0.58,
              shadowRadius: 16.0,
              elevation: 10,
            }}>
            <TouchableOpacity activeOpacity={0.6} style={{flex: 1}}>
              <MyText
                text={'Search'}
                fontType={3}
                style={{textAlign: 'center', fontSize: responsiveFont(15)}}
              />
            </TouchableOpacity>
            {/* <View style={{flex: 0.1, backgroundColor: 'green'}}> */}
            <View
              style={{width: 1, height: '120%', backgroundColor: colors.grey}}
            />
            {/* </View> */}
            <TouchableOpacity
              activeOpacity={0.6}
              style={{
                flex: 1,
              }}>
              <MyText
                fontType={3}
                text={'Availability'}
                style={{textAlign: 'center', fontSize: responsiveFont(15)}}
              />
            </TouchableOpacity>

            {/* <MyText text={'Search'} style={{textAlign: 'center'}} />
          <View style={{width: 1, backgroundColor: 'red', height: '80%'}} />
          <MyText text={'Availability'} /> */}
          </View>
          <View style={{flex: 1}}>
            <FlatList
              data={menus.find(item => item.id === activeMenu).products}
              keyExtractor={(item, index) => index}
              contentContainerStyle={{marginTop: '2.5%', paddingBottom: 20}}
              renderItem={({item, index}) => {
                return (
                  <StoreMenuItem
                    merchentData={restaurantData}
                    item={item}
                    onRemove={onRemove}
                    onAdd={onAddToCart.bind(this, restaurantData)}
                    restaurantStatus={restaurantStatus}
                  />
                );
              }}
            />
          </View>
        </View>
      </View>
      <ErrModal
        visible={errModalVisible}
        btnTitle={'OK'}
        errMsg={'This restaurant is closed , please try again later'}
        onClose={() => setErrModalVisible(false)}
      />
      <ReorderModal
        visible={cartResetModal}
        // onOk={reorderHandler}
        msg={
          'You already have order in your cart from another merchant, this will reset your cart'
        }
        leftBtn={'Cancel'}
        txtSize={responsiveFont(16.5)}
        rightBtn={'Reset'}
        onOk={() => {
          dispatch(userActions.clearCart());
          setCartResetModal(false);
        }}
        onCanel={() => setCartResetModal(false)}
      />
    </>
  );
};

export default Menu;
