import React, { FC, memo } from 'react';
import { View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { TextMeasurment } from '../TextMeasurment';
import { AnimatedSeparatorProps } from '../../core/dto/animatedDTO';
import AnimatedStyles from './Animated.styles';

const AnimatedSeparator: FC<AnimatedSeparatorProps> = ( { separator, style } ) => {

  const index = useSharedValue( 0 );

  const animatedStyles = useAnimatedStyle( () => ( {
    transform: [ { translateY: -index.value * ( style.lineHeight ?? 0 ) } ],
  } ) );

  return (
    <View style={[
      { height: style.lineHeight, width: TextMeasurment.get( separator, style ).width },
      AnimatedStyles.overflowVisible ]}
    >
      <Animated.Text
        style={[
          style,
          { width: TextMeasurment.get( separator, style ).width },
          animatedStyles,
          AnimatedStyles.separator,
        ]}
        allowFontScaling={false}
      >
        {separator}
      </Animated.Text>
    </View>
  );

};

export default memo( AnimatedSeparator );
