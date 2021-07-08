import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import colors from '../../constants/colors';
import commonStyles from '../../constants/commonStyles';
import responsiveFont from '../../constants/responsiveFont';
import MyText from './MyText';

const DayWorkingHours = ({first, second, noBorder}) => {
  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: '5%',
          marginVertical: '3%',
        }}>
        <View style={{flex: 0.4}}>
          <MyText
            fontType={3}
            text={first}
            style={{textTransform: 'capitalize'}}
          />
        </View>
        <View style={{flex: 0.6, alignItems: 'flex-end'}}>
          <MyText nol={2} fontType={3} text={second} />
        </View>
      </View>
      {!noBorder && <View style={styles.borderLine} />}
    </>
  );
};

const Info = ({route}) => {
  const infoData = route.params?.info;
  return (
    <ScrollView style={commonStyles.mainView2}>
      <View style={styles.workingCon}>
        <MyText fontType={4} text={'Working Hours'} style={styles.textStyle} />
        {Object.entries(infoData.working_hours).map(([key, value]) => {
          return (
            <DayWorkingHours
              key={key}
              first={key}
              second={`${infoData.working_hours[key].from} ${infoData.working_hours[key].from_extension} - ${infoData.working_hours[key].to} ${infoData.working_hours[key].to_extension} `}
            />
          );
        })}
      </View>
      <View style={{padding: '5%'}}>
        <DayWorkingHours
          first={'Delivery Time'}
          second={`${infoData.delivery_time} mins`}
          noBorder
        />
        <DayWorkingHours first={'Delivery Fee'} second={'₹ 15'} noBorder />
        <DayWorkingHours
          first={'Payment'}
          second={`${infoData.payment_types}`}
          noBorder
        />
        {/* <DayWorkingHours
          first={'Cuisines'}
          second={'Breakfast, Lunch, Dinner, Arabic, Indian'}
          noBorder
        /> */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  workingCon: {
    padding: '5%',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor,
  },
  textStyle: {
    fontSize: responsiveFont(15),
    color: colors.black,
    width: '100%',
    borderBottomColor: colors.borderColor,
    paddingBottom: '2.5%',
    borderBottomWidth: 1,
  },
  borderLine: {
    width: '92.5%',
    height: 1,
    backgroundColor: colors.borderColor,
    alignSelf: 'center',
    bottom: 0,
  },
});

export default Info;
