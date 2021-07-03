import React, {useLayoutEffect} from 'react';
import {View, FlatList, TouchableOpacity, Image} from 'react-native';
import MenuIcon from '../components/ui/MenuIcon';
import MyText from '../components/ui/MyText';
import Button from '../components/ui/Button';
import commonStyles from '../constants/commonStyles';
import responsiveFont from '../constants/responsiveFont';
import colors from '../constants/colors';
import {useSelector} from 'react-redux';
import AddressActions from '../components/ui/AddressActions';
import dimensions from '../constants/dimensions';

const MangeAddressScreen = ({navigation}) => {
  const userAddress = useSelector(state => state.user.userData?.address);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <MenuIcon />,
      headerRight: () => null,
    });
  }, []);
  return (
    <View style={commonStyles.mainView2}>
      <FlatList
        contentContainerStyle={{flexGrow: 1}}
        data={userAddress}
        keyExtractor={item => item.id}
        renderItem={({item, index}) => {
          return <AddressActions item={item} />;
        }}
      />
      <View style={{flexGrow: 15}}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Add Address')}
          activeOpacity={0.6}
          style={{
            height: dimensions.height * 0.1,
            marginBottom: '2.5%',
            paddingHorizontal: '5%',
            flexDirection: 'row',
          }}>
          <View
            style={{
              flex: 0.2,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={require('../assets/icons/locMark.png')}
              style={{width: '50%', height: '50%', resizeMode: 'contain'}}
            />
          </View>
          <View
            style={{
              flex: 0.65,
              justifyContent: 'center',
            }}>
            <MyText
              text={'Add new Address'}
              fontType={3}
              style={{fontSize: responsiveFont(15)}}
            />
            <MyText
              text={'Choose location on map'}
              fontType={1}
              style={{fontSize: responsiveFont(14)}}
            />
          </View>
          <View
            style={{
              flex: 0.15,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={require('../assets/icons/rightArrow.png')}
              style={{tintColor: colors.primary, alignSelf: 'center'}}
            />
          </View>
        </TouchableOpacity>
        <View
          style={{
            width: '90%',
            alignSelf: 'center',
            borderBottomColor: colors.borderColor,
            borderBottomWidth: 1,
          }}
        />
      </View>
    </View>
  );
};

export default MangeAddressScreen;
