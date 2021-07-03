import React from 'react';
import {View, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import colors from '../../constants/colors';
import dimensions from '../../constants/dimensions';
import responsiveFont from '../../constants/responsiveFont';
import MyText from './MyText';
import * as globalModalActions from '../../redux/actions/globalModal';
import * as userActions from '../../redux/actions/user';
const Item = props => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      activeOpacity={0.6}
      style={{
        flexDirection: 'row',
        marginVertical: '5%',
      }}>
      <View
        style={{
          flex: 0.2,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={props.icon}
          style={{
            width: dimensions.width * 0.07,
            height: dimensions.width * 0.07,
            resizeMode: 'contain',
          }}
        />
      </View>
      <View
        style={{
          flex: 0.8,
          justifyContent: 'center',
        }}>
        <MyText text={props.head} fontType={4} style={styles.savedAddress2} />
        <MyText
          text={props.text}
          fontType={2}
          style={[styles.savedAddress2, {fontSize: responsiveFont(12.5)}]}
        />
      </View>
    </TouchableOpacity>
  );
};
const AddressModal = () => {
  const userAddresses = useSelector(state => state.user.userData?.address);
  const userDestination = useSelector(state => state.user.destination);

  const dispatch = useDispatch();
  const toggleModal = () => {
    dispatch(globalModalActions.toggleModal());
  };
  const setDeliveryAddressHandler = address => {
    dispatch(userActions.setDeliveryLocation(address));
    toggleModal();
  };
  return (
    <View
      style={{
        width: '100%',
        maxHeight: dimensions.height * 0.7,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        padding: '5%',
        paddingHorizontal: '7.5%',
        backgroundColor: colors.white,
      }}>
      <View
        style={{
          flexDirection: 'row',
          //   backgroundColor: 'red',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '5%',
        }}>
        <MyText
          text={'Saved address'}
          fontType={2}
          style={styles.savedAddress}
        />
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={toggleModal}
          style={{justifyContent: 'center', alignItems: 'center'}}>
          <Image
            source={require('../../assets/icons/xMark.png')}
            style={{
              width: dimensions.width * 0.04,
              height: dimensions.width * 0.04,
              resizeMode: 'contain',
            }}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={userAddresses}
        keyExtractor={item => item.id}
        renderItem={({item, index}) => {
          return (
            <Item
              onPress={() => setDeliveryAddressHandler(item)}
              head={`Deliver to ${item.title}`}
              text={item.address}
              icon={require('../../assets/icons/locMark.png')}
            />
          );
        }}
      />
      <View style={{flexGrow: 15, marginTop: '5%'}}>
        <Item
          onPress={() =>
            setDeliveryAddressHandler({
              ...userDestination,
              title: 'Current Location',
            })
          }
          head={'Deliver to current location'}
          text={'Give Dizli location access'}
          icon={require('../../assets/icons/locationn.png')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  savedAddress: {
    fontSize: responsiveFont(16),
    // marginBottom: '5%',
  },
  savedAddress2: {
    fontSize: responsiveFont(14),
  },
});

export default AddressModal;
