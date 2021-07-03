import React from 'react';
import {View, Image, Text} from 'react-native';
import dimensions from '../../constants/dimensions';

const OrderSteps = props => {
  return (
    <>
      <View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={props.icon}
            style={{
              width: props.bigger
                ? dimensions.width * 0.125
                : dimensions.width * 0.1,
              height: props.bigger
                ? dimensions.width * 0.125
                : dimensions.width * 0.1,
              resizeMode: 'contain',
              marginRight: '2.5%',
            }}
          />
        </View>
      </View>
    </>
  );
};

export default OrderSteps;
