import React, {
  FC, ReactNode, useEffect, useState, memo, useRef,
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
  children, style = {}, duration = DURATION, parentheses = false, extendCharacters = '', deps = [],
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

  const [ animable, setAnimable ] = useState( false );
  const [ animation, setAnimation ] = useState( createNumericAnimation( '', childrenToText( children ) ) );

  const measured = useRef( false );

  useEffect( () => {

    const currentAnimation = createNumericAnimation(
      animation.text.current,
      childrenToText( children ),
    );

    if ( currentAnimation.changed ) {

      setAnimable( animation.animable );
      setAnimation( currentAnimation );

    }

  }, [ children, duration ] );

  useEffect( () => {

    setAnimable( false );
    setAnimation( createNumericAnimation( '', childrenToText( children ) ) );

  }, deps );

  const measurementsToRender: ReactNode[] = [];

  if ( !measured.current ) {

    Promise.all( `${CHARS_TO_MEASURE}${extendCharacters}`.split( '' ).map( ( c ) => TextMeasurment.measure( c, style, measurementsToRender ) ) ).then( () => {

      measured.current = true;

    } );

  }

  return (
    <View style={[ layoutStyles, { height: style.lineHeight }, SpinningNumbersStyles.container ]} testID="spinningContainer">
      {parentheses && <Text style={textStyles}>(</Text>}
      { animable && measured.current
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
