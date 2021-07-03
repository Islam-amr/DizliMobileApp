import React, {useEffect} from 'react';
import {StatusBar, Text, TextInput} from 'react-native';
import {Provider} from 'react-redux';

import RNBootSplash from 'react-native-bootsplash';
import colors from './src/constants/colors';
import MainNavigation from './src/navigation/MainNavigation';
import {store} from './src/redux/store';

const App = () => {
  useEffect(() => {
    setTimeout(() => {
      RNBootSplash.hide({fade: true}); // fade
    }, 600);
  }, []);

  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.allowFontScaling = false;

  TextInput.defaultProps = TextInput.defaultProps || {};
  TextInput.defaultProps.allowFontScaling = false;

  return (
    <>
      <StatusBar backgroundColor={colors.primary} />
      <Provider store={store}>
        <MainNavigation />
      </Provider>
    </>
  );
};

export default App;
