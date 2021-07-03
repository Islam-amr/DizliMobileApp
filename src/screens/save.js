const x = {
  addon_groups: [
    {
      addons: [Array],
      id: 5,
      max_selection: 2,
      merchant_id: 91,
      min_selection: 1,
      name: 'toppings',
      team_id: 79,
      type: 1,
    },
  ],

  variant_groups: [
    {id: 12, merchant_id: 91, name: 'size', team_id: 79, variants: [Array]},
  ],
};

const y = [
  {
    addon_groups: [
      {
        addons: [Array],
        id: 2,
        max_selection: 2,
        merchant_id: 68,
        min_selection: 1,
        name: 'Toppings',
        team_id: 57,
        type: 1,
      },
    ],
    variant_groups: [
      {id: 11, merchant_id: 68, name: 'Size', team_id: 57, variants: [Array]},
    ],
  },
];

import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Image,
} from 'react-native';
import {pure} from 'react-recompose';
import {useNavigation} from '@react-navigation/native';
import ActionSheet from 'react-native-actions-sheet';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {TabView, SceneMap} from 'react-native-tab-view';
import colors from '../../constants/colors';
import responsiveFont from '../../constants/responsiveFont';
import dimensions from '../../constants/dimensions';
import MyText from './MyText';
import {useSelector} from 'react-redux';
import fonts from '../../constants/fonts';
import Button from './Button';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import {ScrollView} from 'react-native-gesture-handler';
import SelectMultiple from 'react-native-select-multiple';

let size = 0;
const FirstRoute = ({item, getOptions, variantId, addonId}) => {
  console.log(getOptions, 'el func');
  console.log(item, 'dah item');
  // let [size] = useState(0);
  const [selectedAddon, setSelectedAddon] = useState([]);
  useEffect(() => {
    let variantGroups = [{id: variantId, variant_id: size}];
    console.log(variantGroups);
    getOptions('islam');
  }, [size, selectedAddon]);
  console.log(selectedAddon, size);
  let radio_props;

  return (
    <View style={{flex: 1}}>
      {item.name.toLowerCase() === 'size' ? (
        <View>
          <RadioForm
            radio_props={radio_props}
            initial={0}
            formHorizontal={false}
            labelHorizontal={true}
            buttonColor={colors.primary}
            selectedButtonColor={colors.primary}
            animation={true}
            onPress={value => {
              size = value;
            }}
            labelStyle={{
              fontSize: responsiveFont(15),
              fontFamily: fonts.poppins_medium,
              flex: 1,
            }} //text sixe
            radioStyle={{marginTop: '2.5%'}}
          />
        </View>
      ) : (
        <ScrollView>
          <View style={{flexDirection: 'row', marginVertical: '2.5%'}}>
            {/* <MyText
                    text={item.name}
                    fontType={4}
                    style={{fontSize: responsiveFont(14)}}
                  /> */}
            <SelectMultiple
              items={radio_props2}
              selectedItems={selectedAddon}
              onSelectionsChange={s => setSelectedAddon(s)}
              labelStyle={{
                fontSize: responsiveFont(15),
                fontFamily: fonts.poppins_medium,
                lineHeight: 22,
              }}
              rowStyle={{borderBottomWidth: 0, height: 50}}
            />
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const StoreMenuItem = ({item, onAdd, onRemove}) => {
  const [index, setIndex] = useState(0);
  const getOptions = options => {
    console.log(options);
  };
  let sceneMap = [...item.variant_groups, ...item.addon_groups].map(function (
    i,
  ) {
    return {
      // [i.name]: FirstRoute.bind(this, i, this, getOptions.bind(this)),
      [i.name]: () => (
        <FirstRoute
          item={i}
          getOptions={getOptions.bind(this)}
          variantId={item.variant_groups[0]?.id}
          addonId={item.addon_groups[0]?.id}
        />
      ),
    };
  });
  const routes = [...item.variant_groups, ...item.addon_groups].map(function (
    i,
  ) {
    return {
      key: i.name,
      title: i.name,
    };
  });

  let renderScene = SceneMap(Object.assign({}, ...sceneMap));
  const handleIndexChange = index => setIndex(index);

  const RenderTabBar = props => {
    const inputRange = props.navigationState.routes.map((x, i) => i);
    const nextTab = i => {
      if (i + 1 < routes.length) {
        setIndex(prev => prev + 1);
      } else {
        return;
      }
    };
    const prevTab = i => {
      if (i > 0) {
        setIndex(prev => prev - 1);
      } else {
        return;
      }
    };
    return (
      <View
        style={{
          width: '100%',
          height: dimensions.height * 0.07,
          flexDirection: 'row',
        }}>
        <TouchableOpacity
          onPress={() => prevTab(index)}
          style={{flex: 0.125, justifyContent: 'center', alignItems: 'center'}}>
          <Image
            source={require('../../assets/icons/prev.png')}
            style={{width: '40%', height: '40%', resizeMode: 'contain'}}
          />
        </TouchableOpacity>

        <View style={styles.tabBar}>
          {props.navigationState.routes.map((route, i) => {
            // const opacity = props.position.interpolate({
            //   inputRange,
            //   outputRange: inputRange.map(inputIndex =>
            //     inputIndex === i ? 1 : 0.5,
            //   ),
            // });
            return (
              <TouchableOpacity
                key={i}
                style={styles.tabItem}
                onPress={() => setIndex(i)}>
                <Animated.Text
                  style={{
                    textTransform: 'capitalize',
                    fontSize:
                      props.navigationState.index === i
                        ? responsiveFont(15)
                        : responsiveFont(13),
                    // borderBottomWidth: borderLine === 1 ? 10 : 10,
                    fontFamily:
                      props.navigationState.index === i
                        ? fonts.poppins_medium
                        : fonts.poppins_regular,
                  }}>
                  {route.title}
                </Animated.Text>
                {/* <View
                    style={{
                      width: '100%',
                      marginTop: '10%',
                      backgroundColor: colors.primary,
                      height: props.navigationState.index === i ? 2 : 0,
                    }}
                  /> */}
              </TouchableOpacity>
            );
          })}
        </View>
        <TouchableOpacity
          onPress={() => nextTab(index)}
          style={{flex: 0.125, justifyContent: 'center', alignItems: 'center'}}>
          <Image
            source={require('../../assets/icons/next.png')}
            style={{width: '40%', height: '40%', resizeMode: 'contain'}}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const navigation = useNavigation();
  const Tab = createMaterialTopTabNavigator(); // to declare top tab function
  const cartItem = useSelector(
    state => state.user.userCart.products.find(i => i.id === item.id)?.quantity,
  );
  const actionSheetRef = useRef(); // to control map modal
  const removeFromCart = () => {
    if (!cartItem) {
      return;
    } else {
      onRemove(item.id, item.price, item.name, item.tax);
    }
  };
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
                onPress={() => actionSheetRef.current?.setModalVisible()}
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
                    uri: 'https://content.dizli.net/staging/products/images/0YS3CtC6GlmzyHz9gCach8zi8Srb.jpg',
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
                  text={item.name}
                  fontType={3}
                  style={{fontSize: responsiveFont(16)}}
                />
                <MyText text={'Options'} fontType={1} />
                <MyText text={`₹ ${item.price}`} fontType={3} />
              </View>
            </View>
            <View style={{flex: 0.4}}>
              <TabView
                renderTabBar={props => <RenderTabBar {...props} />}
                style={{
                  width: '100%',
                  alignSelf: 'center',
                  overflow: 'hidden',
                  elevation: 0,
                  borderBottomWidth: 1,
                  borderColor: colors.borderColor,
                }}
                navigationState={{index, routes}}
                renderScene={renderScene}
                initialLayout={{width: dimensions.width}}
                onIndexChange={handleIndexChange}
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
                style={[{fontSize: responsiveFont(16)}]}
              />
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
