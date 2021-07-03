import React, {useEffect, useReducer, useRef, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {pure} from 'react-recompose';
import {useNavigation} from '@react-navigation/native';
import ActionSheet from 'react-native-actions-sheet';
import colors from '../../constants/colors';
import responsiveFont from '../../constants/responsiveFont';
import dimensions from '../../constants/dimensions';
import MyText from './MyText';
import {useDispatch, useSelector} from 'react-redux';
import Button from './Button';
import {ScrollView} from 'react-native-gesture-handler';
import * as userActions from '../../redux/actions/user';
import ErrModal from './ErrModal';
import ReorderModal from './ReorderModal';

const UPDATE_ADDONS = 'UPDATE_ADDONS';
const UPDATE_VARIANT = 'UPDATE_VARIANT';

const optionsReducer = (state, action) => {
  switch (action.type) {
    case UPDATE_ADDONS:
      let isExist = state.addon_groups.addons.some(
        i => i.id === action.payload.id,
      );
      return {
        ...state,
        addon_groups: {
          name: '(T)',
          id: state.addon_groups.id,
          addons: isExist
            ? state.addon_groups.addons.filter(i => i.id !== action.payload.id)
            : [...state.addon_groups.addons, action.payload],
        },
        amount: isExist
          ? state.amount - action.payload.price
          : state.amount + action.payload.price,
        tax: isExist
          ? state.tax - action.payload.tax
          : state.tax + action.payload.tax,
      };
    case UPDATE_VARIANT:
      console.log(action.payload.price);
      let newSize = action.payload.price;
      return {
        ...state,
        variant_groups: [action.payload],
        amountSize: newSize + action.itemPrice,
      };
    default:
      return state;
  }
};
const Options = ({item, setOptions}) => {
  let itemPrice = item.price;
  const [counter, setCounter] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(0);
  // console.log(item.addon_groups[0].id);
  let addonId = item.addon_groups[0]?.id;
  let variantId = item.variant_groups[0].id;
  const [optionsStates, dispatchOptions] = useReducer(optionsReducer, {
    addon_groups: {
      name: '(T)',
      id: addonId || null,
      addons: [],
    },

    variant_groups: [],
    amountSize: itemPrice,
    amount: 0,
    tax: 0,
  });
  const sref = useRef();
  const moveBody = index => {
    sref.current.scrollTo({
      x: index * 100,
      animation: false,
    });
  };

  const onNext = () => {
    if (activeTab + 1 < [...item.addon_groups, ...item.variant_groups].length) {
      setActiveTab(prev => prev + 1);
    }
  };

  const onPrev = () => {
    if (activeTab > 0) {
      setActiveTab(prev => prev - 1);
    }
  };

  const addonAdd = item => {
    dispatchOptions({
      type: UPDATE_ADDONS,
      payload: {
        id: item.id,
        name: item.name,
        price: item.price,
        tax: item.tax,
        quantity: 1,
      },
    });
  };

  const variantAdd = item => {
    console.log(item);
    dispatchOptions({
      type: UPDATE_VARIANT,
      payload: {
        id: variantId,
        variant_id: item.id,
        name: item.name,
        price: item.price,
      },
      itemPrice: itemPrice,
    });
  };

  console.log(optionsStates);

  useEffect(() => {
    setOptions(optionsStates);
  }, [optionsStates]);
  // console.log(item);
  // console.log([...item.addon_groups, ...item.variant_groups], 'asfasf');
  return (
    <View style={{flex: 1}}>
      <View style={{flex: 0.15, flexDirection: 'row'}}>
        <TouchableOpacity
          onPress={onPrev}
          style={{
            flex: 0.125,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={require('../../assets/icons/prev.png')}
            style={{width: '40%', height: '40%', resizeMode: 'contain'}}
          />
        </TouchableOpacity>
        <ScrollView
          pagingEnabled
          ref={sref}
          style={{
            flex: 0.8,
          }}
          horizontal>
          {[...item.addon_groups, ...item.variant_groups].map((item, index) => {
            return (
              <TouchableOpacity
                key={item.id}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginEnd: 25,
                  flex: 1,
                }}
                onPress={() => setActiveTab(index)}>
                <MyText
                  text={item.name}
                  fontType={activeTab === index ? 4 : 2}
                  style={{
                    fontSize: responsiveFont(15),
                    textTransform: 'capitalize',
                  }}
                />
                {activeTab === index && (
                  <View
                    style={{
                      position: 'absolute',
                      backgroundColor: colors.primary,
                      height: 1,
                      width: '120%',
                      alignSelf: 'center',
                      bottom: 5,
                    }}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <TouchableOpacity
          onPress={onNext}
          style={{
            flex: 0.125,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={require('../../assets/icons/next.png')}
            style={{width: '40%', height: '40%', resizeMode: 'contain'}}
          />
        </TouchableOpacity>
      </View>
      <View style={{flex: 0.85}}>
        {[...item.addon_groups, ...item.variant_groups][activeTab]?.addons ? (
          <ScrollView style={{marginTop: 10}}>
            {[...item.addon_groups, ...item.variant_groups][
              activeTab
            ].addons.map((item, index) => {
              return (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    flex: 1,
                    justifyContent: 'space-between',
                    marginBottom: 15,
                    alignItems: 'center',
                  }}>
                  <MyText
                    text={item.name}
                    fontType={3}
                    style={{fontSize: responsiveFont(15)}}
                  />
                  <TouchableOpacity
                    // onPress={() =>
                    //   selectedAddons.some(i => i === item.id)
                    //     ? setSelectedAddons(
                    //         selectedAddons.filter(x => x !== item.id),
                    //       )
                    //     : setSelectedAddons(prev => [...prev, item.id])
                    // }
                    onPress={() => addonAdd(item)}
                    activeOpacity={0.6}
                    style={{
                      width: 25,
                      height: 25,
                      borderWidth: 2,
                      borderColor: colors.grey,
                    }}>
                    {optionsStates.addon_groups.addons.some(
                      y => y.id === item.id,
                    ) && (
                      <Image
                        style={{
                          width: '100%',
                          height: '100%',
                          resizeMode: 'contain',
                          tintColor: colors.primary,
                        }}
                        source={require('../../assets/icons/check.png')}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        ) : (
          <ScrollView style={{marginTop: 10}}>
            {[...item.addon_groups, ...item.variant_groups][
              activeTab
            ].variants.map((i, index) => {
              return (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    flex: 1,
                    justifyContent: 'space-between',
                    marginBottom: 15,
                    alignItems: 'center',
                  }}>
                  <MyText
                    text={i.name}
                    fontType={3}
                    style={{fontSize: responsiveFont(15)}}
                  />
                  <TouchableOpacity
                    onPress={() => variantAdd(i)}
                    activeOpacity={0.6}
                    style={{
                      width: 25,
                      height: 25,
                      borderWidth: 2,
                      borderColor: colors.grey,
                    }}>
                    {optionsStates.variant_groups.some(
                      x => x.variant_id === i.id,
                    ) && (
                      <Image
                        style={{
                          width: '100%',
                          height: '100%',
                          resizeMode: 'contain',
                          tintColor: colors.primary,
                        }}
                        source={require('../../assets/icons/check.png')}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const StoreMenuItem = ({
  item,
  onAdd,
  onRemove,
  merchentData,
  restaurantStatus,
}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [errModalVisible, setErrModalVisible] = useState(false);
  const [options, setOptions] = useState([]);
  const cartItem = useSelector(
    state => state.user.userCart.products.find(i => i.id === item.id)?.quantity,
  );
  const actionSheetRef = useRef(); // to control map modal
  // {
  //   id: item.id,
  //   name: item.name,
  //   quantity: 1,
  //   price: item.price,
  //   tax: item.tax,
  // },
  // item.team_id,
  // item.price,
  // item.tax,
  const curentCart = useSelector(state => state.user.curretCartRestarunt);
  const [cartResetModal, setCartResetModal] = useState(false);
  const addOption = () => {
    dispatch(
      userActions.addToCart(
        merchentData,
        {
          id: item.id,
          name: item.name,
          quantity: 1,
          price: options.amount + options.amountSize,
          tax: item.tax,
          addon_groups: options.addon_groups,
          variant_groups: options.variant_groups,
        },
        item.team_id,
        options.amount + options.amountSize,
        options.tax + item.tax,
      ),
    );
    actionSheetRef.current?.setModalVisible();
  };
  const removeFromCart = () => {
    if (!cartItem) {
      return;
    } else {
      onRemove(item.id, item.price, item.name, item.tax);
    }
  };

  const optionsHandler = () => {
    if (curentCart?.itemId) {
      if (curentCart.itemId !== merchentData.itemId) {
        setCartResetModal(true);
        return;
      }
    }
    if (!restaurantStatus) {
      setErrModalVisible(true);
      return;
    }
    actionSheetRef.current?.setModalVisible();
  };
  // const getOptions = options => {
  //   console.log(options);
  // };
  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          width: '90%',
          alignSelf: 'center',
          borderRadius: 5,
          marginBottom: '2.5%',
          padding: '1.25%',
          borderRadius: 5,
          borderWidth: 1,
          borderColor: colors.borderColor,
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={{uri: item.image}}
            style={{
              width: dimensions.width * 0.2,
              height: dimensions.width * 0.2,
              resizeMode: 'cover',
            }}
          />
        </View>
        <View
          style={{
            flex: 2,
            justifyContent: 'space-around',
            padding: '1%',
          }}>
          <MyText
            text={item.name}
            fontType={4}
            nol={1}
            style={{
              fontSize: responsiveFont(14),
              color: colors.black,
            }}
          />
          <View
            style={{
              width: '40%',
              height: 1,
              backgroundColor: colors.grey,
            }}
          />
          <MyText
            text={`₹ ${item.price}`}
            fontType={4}
            style={{
              fontSize: responsiveFont(14),
              color: colors.black,
            }}
          />
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: item.variant_groups[0]?.variants
                ? 'center'
                : 'space-between',
              borderColor: colors.black,
              borderWidth: 1,
              borderRadius: 5,
              paddingVertical: '5%',
              paddingHorizontal: '10%',
            }}>
            {item.variant_groups[0]?.variants ? (
              <MyText
                onPress={optionsHandler}
                text={'Combo Options'}
                style={{
                  fontSize: responsiveFont(13),
                  color: colors.primary,
                  textAlign: 'center',
                }}
              />
            ) : (
              <>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={removeFromCart}
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <MyText
                    text={'-'}
                    style={{
                      fontSize: responsiveFont(16),
                      color: colors.primary,
                    }}
                  />
                </TouchableOpacity>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <MyText
                    text={cartItem || 0}
                    style={{fontSize: responsiveFont(16)}}
                  />
                </View>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    onAdd(
                      {
                        id: item.id,
                        name: item.name,
                        quantity: 1,
                        price: item.price,
                        tax: item.tax,
                      },
                      item.team_id,
                      item.price,
                      item.tax,
                    );
                  }}
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <MyText
                    text={'+'}
                    style={{
                      fontSize: responsiveFont(16),
                      color: colors.primary,
                    }}
                  />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
      <ActionSheet ref={actionSheetRef} containerStyle={styles.modalCon}>
        <View
          style={[
            styles.modalCon,
            {paddingHorizontal: '5%', marginBottom: '5%'},
          ]}>
          <View
            style={{
              paddingHorizontal: '2.5%',
              flexDirection: 'row-reverse',
            }}>
            <TouchableOpacity
              onPress={() => actionSheetRef.current?.setModalVisible()}>
              <Image
                source={require('../../assets/icons/xMark.png')}
                style={styles.xImg}
              />
            </TouchableOpacity>
          </View>
          <View style={{flex: 1}}>
            <View
              style={{
                flex: 0.1,
                flexDirection: 'row',
                paddingVertical: '2.5%',
                alignItems: 'center',
              }}>
              <View
                style={{
                  flex: 0.25,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={{
                    uri: item.image,
                  }}
                  style={{
                    resizeMode: 'cover',
                    width: '95%',
                    height: '100%',
                    borderRadius: 8,
                  }}
                />
              </View>
              <View
                style={{
                  flex: 0.8,
                  paddingHorizontal: '2.5%',
                  justifyContent: 'center',
                }}>
                <MyText
                  onPress={() => console.log(item)}
                  text={item.name}
                  fontType={3}
                  style={{fontSize: responsiveFont(16)}}
                />
                <MyText text={'Options'} fontType={1} />
                <MyText text={`₹ ${item.price}`} fontType={3} />
              </View>
            </View>
            <View style={{flex: 0.4}}>
              <Options
                item={item}
                setOptions={setOptions}
                restaurantStatus={restaurantStatus}
              />
            </View>
            <View
              style={{
                flex: 0.325,
                borderTopColor: colors.grey,
                borderTopWidth: 1,
              }}>
              <MyText
                text={'Your options'}
                fontType={3}
                style={[{fontSize: responsiveFont(16), marginVertical: '2.5%'}]}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <MyText
                  text={item.name}
                  fontType={3}
                  style={[{fontSize: responsiveFont(16)}]}
                />
                <MyText
                  text={`₹${item.price}`}
                  fontType={3}
                  style={[{fontSize: responsiveFont(16)}]}
                />
              </View>
              <ScrollView>
                {options.addon_groups?.addons.map((i, index) => {
                  return (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}
                      key={index}>
                      <View style={{flexDirection: 'row'}}>
                        <MyText
                          text={options.addon_groups.name}
                          fontType={2}
                          style={{
                            fontSize: responsiveFont(15),
                            color: colors.yellow,
                          }}
                        />
                        <MyText
                          text={i.name}
                          fontType={2}
                          style={{fontSize: responsiveFont(15)}}
                        />
                      </View>

                      <MyText
                        text={`₹${i.price}`}
                        fontType={2}
                        style={{fontSize: responsiveFont(15)}}
                      />
                    </View>
                  );
                })}
                {options.length !== 0
                  ? options?.variant_groups.map((x, index) => {
                      return (
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}
                          key={index}>
                          <View style={{flexDirection: 'row'}}>
                            <MyText
                              text={'(S)'}
                              fontType={2}
                              style={{
                                fontSize: responsiveFont(15),
                                color: colors.yellow,
                              }}
                            />
                            <MyText
                              text={x.name}
                              fontType={2}
                              style={{fontSize: responsiveFont(15)}}
                            />
                          </View>
                          <MyText
                            text={`₹${x.price}`}
                            fontType={2}
                            style={{fontSize: responsiveFont(14)}}
                          />
                        </View>
                      );
                    })
                  : null}
              </ScrollView>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: '2.5%',
                }}>
                <MyText
                  text={'Items Total'}
                  fontType={4}
                  style={{fontSize: responsiveFont(16)}}
                />
                <MyText
                  text={`₹${
                    options.amount + options.tax + options.amountSize || 0
                  }`}
                  fontType={4}
                  style={{fontSize: responsiveFont(16)}}
                />
              </View>
            </View>
            <View
              style={{
                flex: 0.15,
              }}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Button
                  onPress={addOption}
                  bg={colors.primary}
                  title={'Add Option'}
                  fontType={3}
                  container={styles.dilverBtn}
                  txtStyle={styles.dilverTxt}
                  fontType={3}
                />
              </View>
            </View>
          </View>
        </View>
      </ActionSheet>
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
const styles = StyleSheet.create({
  modalCon: {
    width: dimensions.width,
    height: dimensions.height,
    backgroundColor: colors.white,
  },
  xImg: {
    width: dimensions.width * 0.04,
    height: dimensions.width * 0.04,
    resizeMode: 'contain',
  },
  tabBar: {
    flex: 0.8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    height: dimensions.height * 0.07,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
  },
  dilverBtn: {
    width: '100%',
    paddingVertical: '4%',
    paddingHorizontal: '5%',
  },
  dilverTxt: {
    color: colors.white,
    textTransform: 'uppercase',
    fontSize: responsiveFont(16),
  },
});

export default pure(StoreMenuItem);
