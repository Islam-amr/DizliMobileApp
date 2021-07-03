// package import
import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import * as serviceableMerchants from '../redux/actions/serviceableMerchants';

// ui compoenents import
import MyText from '../components/ui/MyText';
import SearchInput from '../components/ui/SearchInput';
import StoreItem from '../components/ui/StoreItem';
import Loading from '../utils/Loading';

// constants import
import colors from '../constants/colors';
import commonStyles from '../constants/commonStyles';
import responsiveFont from '../constants/responsiveFont';

const RestaurantsScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [searchWord, setSearchWord] = useState(''); // to declare search word
  const [result, setResult] = useState([]); // to save search result

  // to get available restaurants from redux according to user area
  const availableRestaurants = useSelector(
    state => state.serviceableMerchants.restaurants,
  );

  const merchentsLoading = useSelector(
    state => state.serviceableMerchants.isLoading,
  );

  // to update list dynamiclly when user type
  const searchRestaurants = useCallback(
    text => {
      // filter declartion
      const newData = availableRestaurants.filter(item =>
        item.itemName.toLowerCase().match(text.toLowerCase()),
      );

      setSearchWord(text);
      setResult(newData);
    },
    [searchWord],
  );

  if (merchentsLoading) {
    return (
      <View style={commonStyles.mainView}>
        <Loading color={colors.primary} size={26} />
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback
      style={commonStyles.mainView}
      onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        style={[commonStyles.mainView, {backgroundColor: colors.white}]}
        behavior={'height'}>
        <View style={styles.actionCon}>
          <View style={{justifyContent: 'center'}}>
            <SearchInput
              container={{flexDirection: 'row-reverse'}}
              placeholder={'Search for restaurant'}
              ph={'5%'}
              onChangeText={searchRestaurants}
            />
          </View>
          <MyText
            text={`${availableRestaurants.length} restaurants open`}
            fontType={3}
            style={{fontSize: responsiveFont(18)}}
          />
        </View>
        <View style={{flex: 0.825}}>
          <FlatList
            data={result.length !== 0 ? result : availableRestaurants}
            keyExtractor={item => item.itemId}
            windowSize={7}
            renderItem={({item}) => {
              return <StoreItem item={item} restaurant={true} />;
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  actionCon: {
    flex: 0.175,
    justifyContent: 'space-around',
    paddingHorizontal: '2.5%',
  },
});

export default RestaurantsScreen;
