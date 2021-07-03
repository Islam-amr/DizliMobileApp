import React from 'react';
import {StyleSheet, Image, Text, View} from 'react-native';
import colors from '../../constants/colors';
import dimensions from '../../constants/dimensions';
import responsiveFont from '../../constants/responsiveFont';
import MyText from './MyText';
import Button from './Button';
import {useDispatch, useSelector} from 'react-redux';
import * as userActions from '../../redux/actions/user';
import {useNavigation} from '@react-navigation/native';

const AddressActions = ({item}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const deleteHandler = async id => {
    try {
      await dispatch(userActions.deleteAddress(id));
    } catch (e) {
      console.log(e.message);
    }
  };
  const editHandler = () => {
    navigation.navigate('Add Address', {editedAddress: item});
  };
  return (
    <View style={styles.addressCon}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Image
          source={require('../../assets/icons/locMark.png')}
          style={styles.locIcon}
        />
        <MyText fontType={3} text={item.title} style={styles.title} />
      </View>
      <MyText fontType={2} text={item.address} style={styles.address} />
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: '2.5%',
        }}>
        <Button
          onPress={editHandler}
          title={'EDIT'}
          container={{
            flex: 1,
            borderColor: colors.primary,
            borderWidth: 1,
            backgroundColor: colors.white,
            paddingHorizontal: '5%',
            paddingVertical: '2.5%',
            marginEnd: '5%',
          }}
          fontType={4}
          txtStyle={{color: colors.black, fontSize: responsiveFont(16)}}
          //   onPress={() => navigation.navigate('RestOrGroc', {addItems: true})}
        />
        <Button
          onPress={() => deleteHandler(item.id)}
          title={'DELETE'}
          container={{
            flex: 1,
            backgroundColor: colors.primary,
            paddingHorizontal: '5%',
            paddingVertical: '2.5%',
          }}
          fontType={4}
          txtStyle={{color: colors.white, fontSize: responsiveFont(16)}}
          //   onPress={() => navigation.navigate('Payment')}
        />
      </View>
    </View>
  );
};

export default AddressActions;

const styles = StyleSheet.create({
  addressCon: {
    width: '90%',
    padding: '4%',
    alignSelf: 'center',
  },
  locIcon: {
    width: dimensions.width * 0.075,
    height: dimensions.width * 0.075,
    marginRight: '2.5%',
  },
  title: {
    fontSize: responsiveFont(15),
  },
  address: {
    color: colors.black,
    fontSize: responsiveFont(12),
    marginTop: '2.5%',
  },
});
