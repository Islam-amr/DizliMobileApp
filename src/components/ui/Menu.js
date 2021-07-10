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
import SearchInput from '../ui/SearchInput';
const Menu = ({route}) => {
  const Tab = createMaterialTopTabNavigator();
  const dispatch = useDispatch();
  const curentCart = useSelector(state => state.user.curretCartRestarunt);
  console.log(curentCart, 'hiay deeh');
  const [errModalVisible, setErrModalVisible] = useState(false);
  const [cartResetModal, setCartResetModal] = useState(false);
  const restaurantData = route.params?.restaurantData;
  const restaurantStatus = route.params?.restaurantStatus;
  const [searcMode, setSearchMode] = useState(null);
  const [searchResult, setSearchResult] = useState(null);
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

  const searchMeal = text => {
    if (text.length === 0) {
      setSearchResult(null);
      return;
    }
    const newData = menus
      .find(item => item.id === activeMenu)
      .products.filter(item =>
        item.name.toLowerCase().match(text.toLowerCase()),
      );

    setSearchResult(newData);
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
            {searcMode === null && (
              <TouchableOpacity
                activeOpacity={0.6}
                style={{flex: 1}}
                onPress={() => setSearchMode(true)}>
                <MyText
                  text={'Search'}
                  fontType={3}
                  style={{textAlign: 'center', fontSize: responsiveFont(15)}}
                />
              </TouchableOpacity>
            )}
            {/* <View style={{flex: 0.1, backgroundColor: 'green'}}> */}
            {searcMode === null && (
              <View
                style={{width: 1, height: '120%', backgroundColor: colors.grey}}
              />
            )}
            {/* </View> */}
            {searcMode === null && (
              <TouchableOpacity
                onPress={() => setSearchMode(false)}
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
            )}
            {searcMode === false && (
              <TouchableOpacity
                onPress={() => setSearchMode(false)}
                activeOpacity={0.6}
                style={{
                  flex: 1,
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>
                <MyText
                  fontType={3}
                  text={'Availability'}
                  style={{textAlign: 'center', fontSize: responsiveFont(15)}}
                />
                <TouchableOpacity
                  onPress={() => {
                    setSearchMode(null);
                    setSearchResult(null);
                  }}
                  style={{
                    width: 20,
                    height: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    style={{width: '80%', height: '80%', resizeMode: 'contain'}}
                    source={require('../../assets/icons/xMark.png')}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            )}

            {searcMode === true && (
              <View style={{flexDirection: 'row', flex: 1}}>
                <View style={{flex: 0.85}}>
                  <SearchInput
                    container={{
                      flexDirection: 'row-reverse',
                      height: dimensions.height * 0.06,
                    }}
                    placeholder={'Search'}
                    ph={'5%'}
                    onChangeText={searchMeal}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setSearchMode(null);
                    setSearchResult(null);
                  }}
                  style={{
                    flex: 0.15,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    style={{width: 15, height: 15, resizeMode: 'contain'}}
                    source={require('../../assets/icons/xMark.png')}
                  />
                </TouchableOpacity>
              </View>
            )}

            {/* <MyText text={'Search'} style={{textAlign: 'center'}} />
          <View style={{width: 1, backgroundColor: 'red', height: '80%'}} />
          <MyText text={'Availability'} /> */}
          </View>
          <View style={{flex: 1}}>
            <FlatList
              data={
                searcMode === false
                  ? menus
                      .find(item => item.id === activeMenu)
                      .products.filter(
                        x => x.nextAvailableAtMessage === 'Available',
                      )
                  : searchResult === null
                  ? menus.find(item => item.id === activeMenu).products
                  : searchResult
              }
              keyExtractor={(item, index) => index}
              contentContainerStyle={{marginTop: '2.5%', paddingBottom: 20}}
              renderItem={({item, index}) => {
                console.log(item);
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
