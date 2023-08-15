import React, {
  FC, useEffect, useState, memo,
} from 'react';
import { View } from 'react-native';
import Animated, {
  cancelAnimation, useSharedValue, withTiming, useAnimatedStyle,
} from 'react-native-reanimated';
import { TextMeasurment } from '../TextMeasurment';
import { AnimatedTextProps } from '../../core/dto/animatedDTO';
import AnimatedStyles from './Animated.styles';

const AnimatedText: FC<AnimatedTextProps> = ( {
  from, to, align, duration, delay = 0, style,
} ) => {

  const index = useSharedValue( 0 );

  const [ previousText, setPreviousText ] = useState( from !== to ? to : '' );
  const [ currentText, setCurrentText ] = useState( to );

  const animatedStyles = useAnimatedStyle( () => (
    { transform: [ { translateY: -index.value * ( style.lineHeight ?? 0 ) } ] } ) );

  const animate = () => {

    cancelAnimation( index );
    setTimeout( () => {

      index.value = withTiming( 1, { duration } );

    }, delay );

  };

  useEffect( () => {

    if ( previousText && ( previousText !== currentText ) ) {

      animate();

    }

  }, [] );

  useEffect(
    () => {

      if ( from !== to ) {

        setPreviousText( from );
        setCurrentText( to );

        animate();

      }

    },
    [ from, to, duration, delay ],
  );

  const previousWidth = previousText.split( '' ).map( ( value ) => TextMeasurment.get( value, style )?.width ?? 0 ).reduce( ( a, b ) => a + b, 0 );
  const currentWidth = currentText.split( '' ).map( ( value ) => TextMeasurment.get( value, style )?.width ?? 0 ).reduce( ( a, b ) => a + b, 0 );

  return (
    <View style={[
      {
        height: style.lineHeight,
        width: previousWidth || currentWidth,
      },
      AnimatedStyles.overflowVisible ]}
    >
      <Animated.Text style={[
        style,
        { textAlign: align, width: currentWidth },
        animatedStyles,
        AnimatedStyles.text ]}
      >
        {[ previousText, currentText ].join( '\n' ).trim()}
      </Animated.Text>
    </View>
  );

};

export default memo( AnimatedText );
