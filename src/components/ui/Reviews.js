import React, {useState, useReducer} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  ScrollView,
  TextInput,
  StyleSheet,
} from 'react-native';
import colors from '../../constants/colors';
import commonStyles from '../../constants/commonStyles';
import responsiveFont from '../../constants/responsiveFont';
import Button from './Button';
import MyText from './MyText';
import {Rating, AirbnbRating} from 'react-native-ratings';
import dimensions from '../../constants/dimensions';
import {useSelector} from 'react-redux';
import API from '../../redux/BaseURL';

const RateItem = ({title, onRate}) => {
  return (
    <View style={{paddingHorizontal: '10%'}}>
      <MyText
        text={title}
        fontType={3}
        style={{marginVertical: '2.5%', fontSize: responsiveFont(15)}}
      />
      <Rating
        type={'star'}
        ratingCount={5}
        imageSize={30}
        onFinishRating={rate => onRate(rate)}
        // ratingImage={() => (
        //   <Image source={require('../../assets/icons/star.png')} />
        // )}
      />
      <View
        style={{
          width: '80%',
          height: 2,
          backgroundColor: colors.borderColor,
          alignSelf: 'center',
          marginTop: '5%',
        }}
      />
    </View>
  );
};

const UPDATE_REVIEW = 'UPDATE_REVIEW';

const reviewReducer = (state, action) => {
  switch (action.type) {
    case UPDATE_REVIEW:
      return {
        ...state,
        [action.input]: action.payload,
      };
    default:
      return state;
  }
};

const Reviews = ({route}) => {
  const userToken = useSelector(state => state.user.userToken);
  const [addReviewMode, setAddReviewMode] = useState(false);
  const [addedReview, setAddedReview] = useState(false);
  const merchentId = route.params?.id;
  const [review, setReview] = useState(route.params?.review || {});
  const [reviewStates, dispatchReview] = useReducer(reviewReducer, {
    order_packing_stars: 3,
    food_quality_stars: 3,
    value_for_money_stars: 3,
    delivery_time_stars: 3,
    description: '',
  });
  const submitReview = async () => {
    try {
      const response = await API.post(
        'customer/v1/merchant/feedback',
        {
          merchant_id: merchentId,
          ...reviewStates,
        },
        {
          headers: {
            Authorization: userToken,
          },
        },
      );
      setAddedReview(true);
    } catch (e) {
      console.log(e.message);
    }
  };

  if (addReviewMode) {
    return (
      <ScrollView style={commonStyles.mainView2}>
        <RateItem
          title={'Order packaging'}
          onRate={rate =>
            dispatchReview({
              type: UPDATE_REVIEW,
              input: 'order_packing_stars',
              payload: rate,
            })
          }
        />
        <RateItem
          title={'Quality of food'}
          onRate={rate =>
            dispatchReview({
              type: UPDATE_REVIEW,
              input: 'food_quality_stars',
              payload: rate,
            })
          }
        />
        <RateItem
          title={'Value for money'}
          onRate={rate =>
            dispatchReview({
              type: UPDATE_REVIEW,
              input: 'value_for_money_stars',
              payload: rate,
            })
          }
        />
        <RateItem
          title={'Delivery time'}
          onRate={rate =>
            dispatchReview({
              type: UPDATE_REVIEW,
              input: 'delivery_time_stars',
              payload: rate,
            })
          }
        />
        <View style={{width: '90%', alignSelf: 'center', marginBottom: '5%'}}>
          <View
            style={{
              flexDirection: 'row',
              marginVertical: '2.5%',
              justifyContent: 'space-between',
            }}>
            <MyText
              text={'Notes'}
              fontType={3}
              style={{fontSize: responsiveFont(18)}}
            />
            <Image
              style={{width: 20, height: 20, resizeMode: 'contain'}}
              source={require('../../assets/icons/note.png')}
            />
          </View>
          <View
            style={{
              borderColor: colors.grey,
              borderWidth: 1,
              height: dimensions.height * 0.15,
            }}>
            <TextInput
              style={{fontSize: responsiveFont(16)}}
              multiline={true}
              value={reviewStates.description}
              onChangeText={text =>
                dispatchReview({
                  type: UPDATE_REVIEW,
                  input: 'description',
                  payload: text,
                })
              }
            />
          </View>
        </View>
        {addedReview ? (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '7.5%',
            }}>
            <Image
              source={require('../../assets/icons/check.png')}
              style={{
                tintColor: colors.green,
                width: 25,
                height: 20,
                marginHorizontal: '2%',
              }}
            />
            <MyText
              text={'YOUR REVIEW HAS BEEN POSTED'}
              fontType={4}
              style={{
                fontSize: responsiveFont(15),
                lineHeight: 36,
                textAlign: 'center',
              }}
            />
          </View>
        ) : (
          <Button
            onPress={submitReview}
            title={'SUBMIT REVIEW'}
            container={{
              backgroundColor: colors.primary,
              padding: '4%',
              marginHorizontal: '5%',
              marginBottom: '5%',
            }}
            fontType={4}
            txtStyle={{color: colors.white, fontSize: responsiveFont(16)}}
          />
        )}
      </ScrollView>
    );
  }
  return (
    <View style={commonStyles.mainView2}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          padding: '2.5%',
        }}>
        <MyText
          text={`(${review.total_review_count}) Review`}
          fontType={4}
          style={{fontSize: responsiveFont(16)}}
        />
        <Button
          disabled={!userToken}
          onPress={() => setAddReviewMode(true)}
          title={'Add review'}
          bg={colors.primary}
          txtStyle={{fontSize: responsiveFont(18), color: colors.white}}
          fontType={3}
          container={{paddingHorizontal: '10%', paddingVertical: '2.5%'}}
        />
      </View>
      <ScrollView
        style={{
          flex: 1,
        }}>
        <View
          style={{
            flex: 1,
            height: dimensions.height * 0.15,
            paddingHorizontal: '3%',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View style={styles.reviewCard}>
            <Rating
              type={'star'}
              ratingCount={5}
              imageSize={20}
              readonly
              startingValue={review['order_packing_review']}
            />
            <MyText
              text={'Order packaging'}
              fontType={4}
              style={{fontSize: responsiveFont(14), marginTop: '5%'}}
            />
          </View>
          <View style={styles.reviewCard}>
            <Rating
              type={'star'}
              ratingCount={5}
              imageSize={20}
              readonly
              startingValue={review['food_quality_review']}
            />
            <MyText
              text={'Quality of food'}
              fontType={4}
              style={{fontSize: responsiveFont(14), marginTop: '5%'}}
            />
          </View>
        </View>
        <View
          style={{
            flex: 1,
            height: dimensions.height * 0.15,
            paddingHorizontal: '3%',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View style={styles.reviewCard}>
            <Rating
              type={'star'}
              ratingCount={5}
              imageSize={20}
              readonly
              startingValue={review['value_for_money_review']}
            />
            <MyText
              text={'Value for money'}
              fontType={4}
              style={{fontSize: responsiveFont(14), marginTop: '5%'}}
            />
          </View>
          <View style={styles.reviewCard}>
            <Rating
              type={'star'}
              ratingCount={5}
              imageSize={20}
              readonly
              startingValue={review['delivery_time_review']}
            />
            <MyText
              text={'Delivery time'}
              fontType={4}
              style={{fontSize: responsiveFont(14), marginTop: '5%'}}
            />
          </View>
        </View>
        <View style={{flex: 1, paddingHorizontal: '2.5%'}}>
          {review?.reviews.map(item => {
            let date = new Date(item.created_at);
            return (
              <View
                key={item.created_at}
                style={{
                  width: '100%',
                  padding: '2.5%',
                  alignSelf: 'center',
                  backgroundColor: colors.borderColor,
                  borderRadius: 5,
                  marginVertical: '2.5%',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Rating
                      type={'star'}
                      ratingCount={5}
                      imageSize={20}
                      readonly
                      startingValue={item.rating_stars}
                      tintColor={colors.borderColor}
                    />
                  </View>
                  <MyText text={date.toDateString()} fontType={2} />
                </View>
                <MyText
                  fontType={3}
                  text={item.rating_description}
                  style={{lineHeight: 26}}
                />
              </View>
            );
          })}
        </View>
      </ScrollView>
      {/* <View
        style={{
          flex: 0.75,
        }}>
        <FlatList
          data={review?.reviews}
          keyExtractor={(item, index) => index}
          contentContainerStyle={{
            paddingHorizontal: '5%',
          }}
          renderItem={({item, index}) => {
            let date = new Date(item.created_at);
            return (
              <View
                style={{
                  width: '100%',
                  padding: '2.5%',
                  alignSelf: 'center',
                  backgroundColor: colors.borderColor,
                  borderRadius: 5,
                  marginVertical: '2.5%',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Rating
                      type={'star'}
                      ratingCount={5}
                      imageSize={20}
                      readonly
                      startingValue={item.rating_stars}
                      tintColor={colors.borderColor}
                    />
                  </View>
                  <MyText text={date.toDateString()} fontType={2} />
                </View>
                <MyText
                  fontType={3}
                  text={item.rating_description}
                  style={{lineHeight: 26}}
                />
              </View>
            );
          }}
        />
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  reviewCard: {
    flex: 1,
    height: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 8,
    marginHorizontal: '2%',
  },
});

export default Reviews;
