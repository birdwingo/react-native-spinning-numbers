import React, { FC, useEffect, memo } from 'react';
import Animated, {
  cancelAnimation, Easing, useAnimatedStyle, useDerivedValue, useSharedValue, withTiming,
} from 'react-native-reanimated';
import { TextMeasurment } from '../TextMeasurment';
import { SIGNS } from '../../core/constants';
import { AnimatedSignProps } from '../../core/dto/animatedDTO';
import AnimatedStyles from './Animated.styles';

const AnimatedSign: FC<AnimatedSignProps> = ( {
  from, to, style, duration,
} ) => {

  const width = Math.ceil( TextMeasurment.get( from, style ).width * 2 );
  const animated = useSharedValue( 0 );
  const from2 = useSharedValue( from );
  const to2 = useSharedValue( to );

  const measurements = SIGNS.split( '\n' ).map( ( n ) => TextMeasurment.get( n, style ).width );

  const index = useDerivedValue( () => {

    const values: { [key: string]: number } = { '+': 0, '-': 1 };

    const start = values[from2.value] ?? 2;
    const end = values[to2.value] ?? 2;

    return start + ( end - start ) * animated.value;

  }, [ animated ] );

  const chartWidth = useDerivedValue( () => {

    const roundedFloor = Math.floor( index.value );
    const roundedCeil = Math.ceil( index.value );

    return index.value === Math.round( index.value )
      ? ( measurements[index.value] || 0 )
      : ( measurements[roundedCeil] || 0 ) * ( index.value - roundedFloor )
      + ( measurements[roundedFloor] || 0 ) * ( roundedCeil - index.value );

  } );

  const animatedStyles = useAnimatedStyle( () => ( {
    transform: [
      { translateY: -index.value * ( style.lineHeight ?? 0 ) },
      { translateX: ( chartWidth.value - width ) / 2 } ],
  } ) );

  const animatedStyles2 = useAnimatedStyle( () => ( {
    width: chartWidth.value,
  } ) );

  useEffect( () => {

    if ( from !== to ) {

      cancelAnimation( animated );
      animated.value = 0;
      animated.value = withTiming( 1, { duration, easing: Easing.bezier( 0.42, 0, 0.58, 1 ) } );
      from2.value = from;
      to2.value = to;

    }

  }, [ from, to, duration ] );

  return (
    <Animated.View style={[ { height: style.lineHeight, width: TextMeasurment.get( '+', style ).width }, animatedStyles2, AnimatedStyles.overflowVisible ]}>
      <Animated.Text style={[ style, { width }, animatedStyles, AnimatedStyles.sign ]}>
        {SIGNS}
      </Animated.Text>
    </Animated.View>
  );

};

export default memo( AnimatedSign );
