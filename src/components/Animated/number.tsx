import React, { FC, useEffect, memo } from 'react';
import Animated, {
  cancelAnimation, Easing, useAnimatedStyle, useDerivedValue, useSharedValue, withTiming,
} from 'react-native-reanimated';
import { TextMeasurment } from '../TextMeasurment';
import { NUMBERS } from '../../core/constants';
import { AnimatedNumberProps } from '../../core/dto/animatedDTO';
import AnimatedStyles from './Animated.styles';

const AnimatedNumber: FC<AnimatedNumberProps> = ( {
  from = 0, to = 0, exponent = 0, style, duration,
} ) => {

  const width = Math.ceil( TextMeasurment.get( '0', style ).width * 2 );
  const animated = useSharedValue( from );

  const measurements = NUMBERS.split( '\n' ).map( ( n ) => TextMeasurment.get( n, style ).width );

  const chartWidth = useDerivedValue( () => {

    const offset = Math.min( 0, exponent );
    const showzero = exponent <= 0 || Math.floor( animated.value / ( 10 ** exponent ) ) >= 10;
    const val = animated.value / ( 10 ** offset )
    % ( 10 ** ( exponent - offset + 1 ) ) / ( 10 ** ( exponent - offset ) );
    const index = ( showzero && val < 1 ? 1 : 11 ) - val;
    const roundedFloor = Math.floor( index );
    const roundedCeil = Math.ceil( index );

    return {
      width: index === Math.round( index )
        ? ( measurements[index] )
        : ( measurements[roundedCeil] || 0 ) * ( index - roundedFloor )
      + ( measurements[roundedFloor] || 0 ) * ( roundedCeil - index ),
      index,
    };

  } );

  const animatedStyles = useAnimatedStyle( () => ( {
    transform: [
      { translateY: ( -chartWidth.value.index * ( style.lineHeight ?? 0 ) ) || 0 },
      { translateX: ( ( chartWidth.value.width - width ) / 2 ) || 0 } ],
  } ) );

  const animatedStyles2 = useAnimatedStyle( () => ( {
    width: chartWidth.value.width,
  } ) );

  useEffect( () => {

    const offset = 10 ** exponent;

    cancelAnimation( animated );
    animated.value = withTiming(
      Math.floor( to / offset ) * offset,
      { duration, easing: Easing.bezier( 0.42, 0, 0.58, 1 ) },
    );

  }, [ from, to, duration ] );

  return (
    <Animated.View style={[ { height: style.lineHeight, width: TextMeasurment.get( '1', style ).width }, animatedStyles2, AnimatedStyles.overflowVisible ]} testID="animatedNumber">
      <Animated.Text
        style={[ style, { width }, animatedStyles, AnimatedStyles.sign ]}
        allowFontScaling={false}
      >
        {NUMBERS}
      </Animated.Text>
    </Animated.View>
  );

};

export default memo( AnimatedNumber );
