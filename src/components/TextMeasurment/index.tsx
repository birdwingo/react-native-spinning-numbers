import React, { ReactNode } from 'react';
import {
  TextStyle, View, Text, LayoutChangeEvent,
} from 'react-native';
import { fontHash } from '../../core/helpers';
import TextMeasurmentStyles from './TextMeasurment.styles';

export class TextMeasurment {

  static cache = new Map();

  static get( text: string, style: TextStyle ) {

    if ( !text.length ) {

      return { text, width: 0, height: 20 };

    }

    return this.cache.get( fontHash( style ) ).get( text );

  }

  static async measure( text: string, style: TextStyle, toRender: ReactNode[] ) {

    if ( !text.length ) {

      return { text, width: 0, height: 20 };

    }

    const hash = fontHash( style );

    if ( !this.cache.get( hash )?.has( text ) ) {

      if ( !this.cache.has( hash ) ) {

        this.cache.set( hash, new Map() );

      }

      let promiseResolve: ( val: any ) => void;
      let measurement: { cnt: number, width: number, height: number };

      const onLayout = ( e: LayoutChangeEvent, cnt: number ) => {

        const { width, height } = e.nativeEvent.layout;

        if ( !measurement ) {

          measurement = { cnt, width, height };

        } else {

          const [ m1, m2 ] = [ measurement, { cnt, width, height } ];

          const value = {
            text,
            width: ( m1.width - m2.width ) / ( m1.cnt - m2.cnt ) - 0.20,
            height: Math.max( m1.height, m2.height ),
          };

          this.cache.get( hash ).set( text, value );

          if ( promiseResolve ) {

            promiseResolve( value );

          } else {

            setTimeout( () => promiseResolve( value ), 1 );

          }

        }

      };

      toRender.push(
        <View key={Math.random()} style={TextMeasurmentStyles.measureContainer}>
          <Text
            onLayout={( e ) => onLayout( e, 1 )}
            testID={`${text}MeasureText`}
            style={[ style, TextMeasurmentStyles.measureText ]}
          >
            {text.repeat( 1 )}
          </Text>
          <Text
            onLayout={( e ) => onLayout( e, 5 )}
            testID={`${text}MeasureText5`}
            style={[ style, TextMeasurmentStyles.measureText ]}
          >
            {text.repeat( 5 )}
          </Text>
        </View>,
      );

      return new Promise( ( resolve ) => {

        promiseResolve = resolve;

      } );

    }

    return this.cache.get( hash ).get( text );

  }

}
