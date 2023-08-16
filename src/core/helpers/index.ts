import { Children } from 'react';
import { TextStyle } from 'react-native';
import {
  DECIMALS_RE, DECIMAL_SEP_RE, FRACTIONS_RE, NUMBER_RE, NUMERIC_RE, THOUSANDS_SEP_RE,
} from '../constants';
import { AnimationProps } from '../dto/helpersDTO';

export const fontHash = ( style: TextStyle ) => `${style.fontFamily}:${style.fontSize}:${style.fontWeight}`;

export const decimals = ( val: string ) => val.match( DECIMALS_RE )?.[0]?.length || 0;

export const fractions = ( val: string ) => Math.max(
  0,
  ( val.match( FRACTIONS_RE )?.[0]?.length || 0 ) - 1,
);

export const countChars = ( str: string, char: string ) => str.length - str.replaceAll( char, '' ).length;

export const childrenToText = ( children: string ) => Children.map( children, ( c ) => c.toString() ).reduce( ( s, c ) => s + c, '' );

export const createNumericAnimation = ( previous: string, current: string ) => {

  const animation: AnimationProps = {
    text: { previous: previous || '', current: current || '' },
    changed: previous !== current,
    animable: false,
  };

  if ( previous && current && previous !== current ) {

    animation.changed = true;

    const format = {
      previous: previous.match( NUMERIC_RE )?.groups,
      current: current.match( NUMERIC_RE )?.groups,
    };

    if ( format.previous && format.current ) {

      animation.animable = true;

      const separator = {
        decimal: {
          from: format.previous.value.match( DECIMAL_SEP_RE )?.groups?.separator,
          to: format.current.value.match( DECIMAL_SEP_RE )?.groups?.separator,
        },
        thousands: {
          from: format.previous.value.match( THOUSANDS_SEP_RE )?.groups?.separator,
          to: format.current.value.match( THOUSANDS_SEP_RE )?.groups?.separator,
        },
      };
      const dec = separator.decimal;
      const ths = separator.thousands;

      let decimalSeparator = dec.from ?? dec.to;
      let thousandsSeparator = ths.from ?? ths.to;

      if ( dec.from !== dec.to ) {

        decimalSeparator = undefined;
        animation.animable = false;

      } else if ( ths.from !== ths.to ) {

        if ( thousandsSeparator === decimalSeparator ) {

          thousandsSeparator = undefined;

        }

      } else if ( decimalSeparator === thousandsSeparator && decimalSeparator !== undefined ) {

        decimalSeparator = undefined;

      }

      if ( animation.animable ) {

        if ( decimalSeparator && (
          countChars( format.previous.value, decimalSeparator ) > 1
          || countChars( format.current.value, decimalSeparator ) > 1
        ) ) {

          animation.animable = false;

        }

      }

      if ( animation.animable ) {

        const previousValue = format.previous.value.replaceAll( thousandsSeparator!, '' ).replace( decimalSeparator!, '.' );
        const currentValue = format.current.value.replaceAll( thousandsSeparator!, '' ).replace( decimalSeparator!, '.' );

        if ( NUMBER_RE.test( previousValue ) && NUMBER_RE.test( currentValue )
          && fractions( previousValue ) === fractions( currentValue ) ) {

          animation.separator = { decimal: decimalSeparator, thousands: thousandsSeparator };
          animation.presign = { from: format.previous.presign, to: format.current.presign };
          animation.prefix = { from: format.previous.prefix, to: format.current.prefix };
          animation.suffix = { from: format.previous.suffix, to: format.current.suffix };
          animation.sign = { from: format.previous.sign, to: format.current.sign };
          animation.value = {
            from: ( format.previous.sign.includes( '-' ) || format.previous.presign.includes( '-' ) ? -1 : 1 ) * parseFloat( previousValue ),
            to: ( format.current.sign.includes( '-' ) || format.current.presign.includes( '-' ) ? -1 : 1 ) * parseFloat( currentValue ),
          };
          animation.decimals = Math.max( decimals( previousValue ), decimals( currentValue ) );
          animation.fractions = fractions( currentValue );
          animation.pattern = [];

          for ( let i = 0; i < animation.decimals; ++i ) {

            if ( ( i && i % 3 === 0 ) ) {

              animation.pattern.unshift( { separator: thousandsSeparator, exponent: i } );

            }

            animation.pattern.unshift( { exponent: i } );

          }

          if ( animation.fractions ) {

            animation.pattern.push( { separator: decimalSeparator, exponent: 0 } );

            for ( let i = 0; i < animation.fractions; ++i ) {

              animation.pattern.push( { exponent: -1 - i } );

            }

          }

        } else {

          animation.animable = false;

        }

      }

    }

  }

  return animation;

};
