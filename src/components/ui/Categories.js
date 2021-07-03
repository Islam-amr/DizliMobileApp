import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, Image, Text} from 'react-native';
import {ScrollView, FlatList} from 'react-native-gesture-handler';
import colors from '../../constants/colors';
import dimensions from '../../constants/dimensions';
import MyText from './MyText';

const Categories = props => {
  const [active, setActive] = useState(props.data[0].id || 1);

  useEffect(() => {
    props.onChange(active);
  }, [active]);
  
  return (
    <View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={props.data}
        keyExtractor={item => item.id}
        renderItem={({item, index}) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => setActive(item.id)}
              activeOpacity={0.6}
              style={[
                {
                  backgroundColor: 'white',
                  borderColor: colors.borderColor,
                  borderRadius: 5,
                  borderWidth: 2,
                  paddingHorizontal: dimensions.width * 0.075,
                  paddingVertical: dimensions.height * 0.0075,
                  marginEnd: dimensions.width * 0.05,
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                },
                item.id === active
                  ? {
                      backgroundColor: colors.primary,
                      borderColor: colors.primary,
                    }
                  : {},
              ]}>
              {props.icon && (
                <View>
                  <Image
                    source={item.icon}
                    style={{
                      width: dimensions.width * 0.05,
                      height: dimensions.width * 0.05,
                      resizeMode: 'contain',
                      tintColor: colors.black,
                      tintColor: item.id === active ? 'white' : colors.grey,
                    }}
                  />
                </View>
              )}
              <MyText
                text={item.name}
                fontType={2}
                style={{
                  lineHeight: 20,
                  color: item.id === active ? 'white' : colors.grey,
                  marginLeft: props.icon ? dimensions.width * 0.025 : 0,
                  textAlign: 'center',
                }}
              />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default Categories;
