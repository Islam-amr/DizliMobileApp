// package import
import React, {useState, useCallback} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import {useSelector} from 'react-redux';

// ui components import
import Categories from '../components/ui/Categories';
import MyText from '../components/ui/MyText';
import SearchInput from '../components/ui/SearchInput';
import StoreItem from '../components/ui/StoreItem';
import Loading from '../utils/Loading';

// constants import
import colors from '../constants/colors';
import commonStyles from '../constants/commonStyles';
import responsiveFont from '../constants/responsiveFont';

// grocery categories
const categories = [
  {
    id: 1,
    name: 'Fish',
    icon: require('../assets/images/fish.png'),
  },
  {
    id: 2,
    name: 'Meat',
    icon: require('../assets/images/meat.png'),
  },
  {
    id: 3,
    name: 'Chicken',
    icon: require('../assets/images/chicken.png'),
  },
  {
    id: 4,
    name: 'Rice',
    icon: require('../assets/images/rice.png'),
  },
];
const GroceriesScreen = () => {
  // to get available groceries from redux according to user area
  const availableGroceries = useSelector(
    state => state.serviceableMerchants.groceries,
  );
  const merchentsLoading = useSelector(
    state => state.serviceableMerchants.isLoading,
  );

  const [active, setActive] = useState(0); // to specify current category
  const [searchWord, setSearchWord] = useState(''); // to declare search word
  const [result, setResult] = useState([]); // to save search result

  // to update list dynamiclly when user type
  const searchGroceries = useCallback(
    text => {
      // filter declartion
      const newData = availableGroceries.filter(item =>
        item.name.toLowerCase().match(text.toLowerCase()),
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
              placeholder={'Search for grocery stores'}
              ph={'5%'}
              onChangeText={searchGroceries}
            />
          </View>
          <MyText
            text={`${availableGroceries.length} grocery stores available`}
            fontType={4}
            style={{fontSize: responsiveFont(18)}}
          />
          <Categories data={categories} icon onChange={i => setActive(i)} />
        </View>
        <View style={{flex: 0.75}}>
          <FlatList
            data={result.length !== 0 ? result : availableGroceries}
            keyExtractor={(item, index) => index}
            renderItem={({item, index}) => {
              return (
                <StoreItem
                  item={item}
                  img={require(`../assets/images/gre.png`)}
                  restaurant={false}
                />
              );
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  actionCon: {
    flex: 0.25,
    justifyContent: 'space-around',
    paddingHorizontal: '2.5%',
  },
});

export default GroceriesScreen;
