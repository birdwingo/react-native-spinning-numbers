import React, {
  FC, ReactNode, useEffect, useState, memo,
} from 'react';
import { Text, View } from 'react-native';
import { childrenToText, createNumericAnimation } from '../../core/helpers';
import { TextMeasurment } from '../TextMeasurment';
import { SpinningNumbersProps } from '../../core/dto/spinningNumbersDTO';
import SpinningNumbersStyles from './SpinningNumbers.styles';
import {
  AnimatedNumber, AnimatedSeparator, AnimatedSign, AnimatedText,
} from '../Animated';
import { CHARS_TO_MEASURE, DURATION } from '../../core/constants';

const SpinningNumbers: FC<SpinningNumbersProps> = ( {
  children, style = {}, duration = DURATION, parentheses = false, extendCharacters = '',
} ) => {

  const {
    color, fontFamily, fontSize, fontStyle, fontWeight,
    fontVariant, letterSpacing, lineHeight, textAlign, textShadowColor,
    textShadowOffset, textShadowRadius, textTransform, writingDirection,
    ...layoutStyles
  } = style;

  const textStyles = {
    color,
    fontFamily,
    fontSize,
    fontStyle,
    fontWeight,
    fontVariant,
    letterSpacing,
    lineHeight,
    textAlign,
    textShadowColor,
    textShadowOffset,
    textShadowRadius,
    textTransform,
    writingDirection,
  };

  const [ animated, setAnimated ] = useState( false );
  const [ measured, setMeasured ] = useState( false );
  const [ animation, setAnimation ] = useState( createNumericAnimation( '', childrenToText( children ) ) );

  useEffect( () => {

    const currentAnimation = createNumericAnimation(
      animation.text.current,
      childrenToText( children ),
    );

    if ( currentAnimation.changed ) {

      setAnimation( currentAnimation );
      setAnimated( animation.animable );

    }

  }, [ children, duration ] );

  useEffect( () => {

    setAnimation( createNumericAnimation( '', childrenToText( children ) ) );
    setAnimated( false );
    setMeasured( false );

  }, [] );

  const measurementsToRender: ReactNode[] = [];

  if ( animated && !measured ) {

    Promise.all( `${CHARS_TO_MEASURE}${extendCharacters}`.split( '' ).map( ( c ) => TextMeasurment.measure( c, style, measurementsToRender ) ) ).then( () => setMeasured( true ) );

  }

  return (
    <View style={[ layoutStyles, { height: style.lineHeight }, SpinningNumbersStyles.container ]} testID="spinningContainer">
      {parentheses && <Text style={textStyles}>(</Text>}
      { animated && measured
        ? (
          <>
            { animation.presign && (
              <AnimatedSign
                from={animation.presign.from}
                to={animation.presign.to}
                style={textStyles}
                duration={duration}
              />
            )}
            { animation.prefix && (
              <AnimatedText
                from={animation.prefix.from}
                to={animation.prefix.to}
                align="right"
                style={textStyles}
                duration={duration}
              />
            )}
            { animation.sign && (
              <AnimatedSign
                from={animation.sign.from}
                to={animation.sign.to}
                style={textStyles}
                duration={duration}
              />
            )}
            { animation.pattern?.map( ( p, id ) => ( p.separator
              ? <AnimatedSeparator key={String( `sep-${p.exponent}${id}` )} separator={p.separator} style={textStyles} />
              : <AnimatedNumber key={String( `num-${p.exponent}${id}` )} from={animation.value?.from} to={animation.value?.to} exponent={p.exponent} style={textStyles} duration={duration} /> ) )}
            { animation.suffix && <AnimatedText from={animation.suffix.from} to={animation.suffix.to} align="right" style={textStyles} duration={duration} />}
          </>
        )
        : <Text style={style}>{ animation.text.current }</Text>}
      {parentheses && <Text style={textStyles}>)</Text>}
      { measurementsToRender }
    </View>
  );

};

export default memo( SpinningNumbers );