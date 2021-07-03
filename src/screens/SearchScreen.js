import {isObject} from 'lodash';
import React, {useLayoutEffect, useState} from 'react';
import {
  View,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import SearchInput from '../components/ui/SearchInput';
import colors from '../constants/colors';
import commonStyles from '../constants/commonStyles';
import API from '../redux/BaseURL';
import MyText from '../components/ui/MyText';
import responsiveFont from '../constants/responsiveFont';

const SearchDisplayer = (data = []) => {
  if (data) {
    return;
  } else {
    return (
      <View>
        <MyText text={'islam'} />
      </View>
    );
  }
};

const SearchScreen = ({navigation}) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: null,
    });
  }, []);

  const [value, setValue] = useState('');
  const [results, setResults] = useState([]);
  const userLocation = useSelector(state => state.user.destination);

  const submit = async () => {
    let data = {
      search: value,
      country_id: 3,
      destination: {
        place: userLocation.place,
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
      },
    };
    try {
      const response = await API.post(`customer/v1/search`, data);
      setResults(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => Keyboard.dismiss()}
      style={[commonStyles.mainView, {backgroundColor: colors.white}]}>
      <KeyboardAvoidingView
        style={[commonStyles.mainView, {backgroundColor: colors.white}]}
        behavior={'height'}>
        <View
          style={{
            flex: 0.125,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <SearchInput
            value={value}
            container={{width: '95%', flexDirection: 'row-reverse'}}
            placeholder={'Search'}
            ph={'5%'}
            onChangeText={text => setValue(text)}
            onSubmitEditing={submit}
          />
        </View>
        <ScrollView
          style={{
            flex: 0.875,
            paddingHorizontal: '10%',
          }}>
          {results.grocery
            ? results.grocery.map(item => {
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.itemView}
                    onPress={() => navigation.navigate('Groceries')}>
                    <MyText
                      fontType={4}
                      text={item.name}
                      style={styles.itemTxt}
                    />
                  </TouchableOpacity>
                );
              })
            : null}
          {results.products
            ? results.products.map(item => {
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.itemView}
                    onPress={() => navigation.navigate('Restaurants')}>
                    <MyText
                      fontType={4}
                      text={item.name}
                      style={styles.itemTxt}
                    />
                  </TouchableOpacity>
                );
              })
            : null}
          {results.restaurant
            ? results.restaurant.map(item => {
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.itemView}
                    onPress={() => navigation.navigate('Restaurants')}>
                    <MyText
                      fontType={4}
                      text={item.name}
                      style={styles.itemTxt}
                    />
                  </TouchableOpacity>
                );
              })
            : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  itemView: {
    marginVertical: '5%',
    borderColor: colors.borderColor,
    borderBottomWidth: 1,
  },
  itemTxt: {
    fontSize: responsiveFont(18),
    color: colors.black,
    marginBottom: '2.5%',
  },
});

export default SearchScreen;
