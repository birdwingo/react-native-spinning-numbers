import { act, render } from '@testing-library/react-native';
import * as Reanimated from 'react-native-reanimated';
import SpinningNumbers from '../src';
import { CHARS_TO_MEASURE } from '../src/core/constants';
import { TextMeasurment } from '../src/components/TextMeasurment';
import { AnimatedNumber, AnimatedSeparator, AnimatedSign, AnimatedText } from '../src/components/Animated';

const sleep = async () => new Promise( ( resolve ) => setTimeout( resolve, 250 ) );
jest.spyOn( Reanimated, 'useSharedValue' ).mockImplementation( ( value ) => ( { value } ) );

SpinningNumbers.defaultProps = { autoMeasure: true };

const style = { fontFamily: '', fontSize: 34 };

describe( 'Spinning numbers test', () => {

  it( 'Should be correct text with parentheses', () => {

    const text = '14,578';
    const { getByTestId } = render( <SpinningNumbers parentheses>{text}</SpinningNumbers> );
    expect( getByTestId( 'spinningContainer' ) ).toHaveTextContent( text );

  } );

  it( 'Should be correct text on rerender', () => {

    const text = '14,578';
    const { getByTestId, rerender } = render( <SpinningNumbers>{text}</SpinningNumbers> );

    const text2 = '17,239';
    rerender( <SpinningNumbers>{text2}</SpinningNumbers> );
    expect( getByTestId( 'spinningContainer' ) ).toHaveTextContent( text2 );

  } );

  it( 'Should be correct text when added decimals', () => {

    const text = '14,578';
    const { getByTestId, rerender } = render( <SpinningNumbers>{text}</SpinningNumbers> );

    const text2 = '47,956.78';
    rerender( <SpinningNumbers>{text2}</SpinningNumbers> );
    expect( getByTestId( 'spinningContainer' ) ).toHaveTextContent( text2 );

  } );

  it( 'Should be correct text when text is empty', () => {

    const text = '14,578';
    const { getByTestId, rerender } = render( <SpinningNumbers>{text}</SpinningNumbers> );

    const text2 = '';
    rerender( <SpinningNumbers>{text2}</SpinningNumbers> );
    expect( getByTestId( 'spinningContainer' ) ).toHaveTextContent( text2 );

  } );

  it( 'Should be correct text when there is no thousand', () => {

    const text = '14,578';
    const { getByTestId, rerender } = render( <SpinningNumbers>{text}</SpinningNumbers> );

    const text2 = '78,89';
    rerender( <SpinningNumbers>{text2}</SpinningNumbers> );
    expect( getByTestId( 'spinningContainer' ) ).toHaveTextContent( text2 );

  } );

  it( 'Should be correct text when there is thousand and rest is the same', () => {

    const text = '14,578';
    const { getByTestId, rerender } = render( <SpinningNumbers>{text}</SpinningNumbers> );

    const text2 = '1,078.89';
    rerender( <SpinningNumbers>{text2}</SpinningNumbers> );
    expect( getByTestId( 'spinningContainer' ) ).toHaveTextContent( text2 );

  } );

  it( 'Should be correct text when changed thousands', () => {

    const text = '14,578.45';
    const { getByTestId, rerender } = render( <SpinningNumbers>{text}</SpinningNumbers> );

    const text2 = '2,078.89';
    rerender( <SpinningNumbers>{text2}</SpinningNumbers> );
    expect( getByTestId( 'spinningContainer' ) ).toHaveTextContent( text2 );

  } );

  it( 'Should work when more decimal points', () => {

    const text = '14,578.457.4878';
    const { getByTestId, rerender } = render( <SpinningNumbers>{text}</SpinningNumbers> );

    const text2 = '2,078.89457989.4579';
    rerender( <SpinningNumbers>{text2}</SpinningNumbers> );
    expect( getByTestId( 'spinningContainer' ) ).toHaveTextContent( text2 );

  } );

  it( 'Should work when more decimal points & no thousands', () => {

    const text = '1,578.457.4878';
    const { getByTestId, rerender } = render( <SpinningNumbers>{text}</SpinningNumbers> );

    const text2 = '78.89457989.4579';
    rerender( <SpinningNumbers>{text2}</SpinningNumbers> );
    expect( getByTestId( 'spinningContainer' ) ).toHaveTextContent( text2 );

  } );

  it( 'Should work with negative number', () => {

    const text = '-71.45';
    const { getByTestId, rerender } = render( <SpinningNumbers>{text}</SpinningNumbers> );

    const text2 = '-78.89';
    rerender( <SpinningNumbers>{text2}</SpinningNumbers> );
    expect( getByTestId( 'spinningContainer' ) ).toHaveTextContent( text2 );

  } );

  it( 'Should work without decimals', () => {

    const text = '-71';
    const { getByTestId, rerender } = render( <SpinningNumbers>{text}</SpinningNumbers> );

    const text2 = '-78.89';
    rerender( <SpinningNumbers>{text2}</SpinningNumbers> );
    expect( getByTestId( 'spinningContainer' ) ).toHaveTextContent( text2 );

  } );

  it( 'Should work with weird char', () => {

    const text = '-71';
    const { getByTestId, rerender } = render( <SpinningNumbers>{text}</SpinningNumbers> );

    const text2 = '<';
    rerender( <SpinningNumbers>{text2}</SpinningNumbers> );
    expect( getByTestId( 'spinningContainer' ) ).toHaveTextContent( text2 );

  } );

  it( 'Should work when prefix changed to suffix', () => {

    const text = '$10';
    const { getByTestId, rerender } = render( <SpinningNumbers>{text}</SpinningNumbers> );

    const text2 = '10€';
    rerender( <SpinningNumbers>{text2}</SpinningNumbers> );
    expect( getByTestId( 'spinningContainer' ) ).toHaveTextContent( text2 );

  } );
  
  it( 'Should work with no defaultProps', () => {

    SpinningNumbers.defaultProps = {};

    const text = '$10';
    const { getByTestId, rerender } = render( <SpinningNumbers>{text}</SpinningNumbers> );

    const text2 = '10€';
    rerender( <SpinningNumbers>{text2}</SpinningNumbers> );
    expect( getByTestId( 'spinningContainer' ) ).toHaveTextContent( text2 );

  } );


  it( 'Should measure chars', async () => {

    SpinningNumbers.defaultProps = { autoMeasure: true };

    const text = '-71,895';
    const { getByTestId, rerender } = render( <SpinningNumbers>{text}</SpinningNumbers> );

    act( () => {

      CHARS_TO_MEASURE.split( '' ).forEach( ( char ) => {

        getByTestId( `${char}MeasureText` ).props.onLayout( { nativeEvent: { layout: { width: 10, height: 10 } } } );
        getByTestId( `${char}MeasureText5` ).props.onLayout( { nativeEvent: { layout: { width: 50, height: 10 } } } );

      } );

    } );

    await sleep();

    const text2 = '+78,745';
    rerender( <SpinningNumbers>{text2}</SpinningNumbers> );
    expect( getByTestId( 'spinningContainer' ) ).toHaveTextContent( '+ - + - 1 0 9 8 7 6 5 4 3 2 11 0 9 8 7 6 5 4 3 2 1' );

  } );

} );

describe( 'TextMeasurment test', () => {

  it( 'Should work with empty text', async () => {

    const result = await TextMeasurment.measure( '' );

    expect( result ).toEqual( { text: '', width: 0, height: 20 } );

  } );

  it( 'Should return mesured value if exists', async () => {

    const result = await TextMeasurment.measure( 'A', style, [] );
    expect( result ).toEqual( { text: 'A', width: 9.8, height: 10 } );

  } );

} );

describe( 'AnimatedText test', () => {

  it( 'Should work with empty text', async () => {

    const { getByTestId } = render( <AnimatedText from="" to="A" duration={500} style={{...style, lineHeight: 40}} /> );

    expect( getByTestId( 'animatedText' ) ).toHaveTextContent( 'A' );

  } );

  it( 'Should work from text to empty text', async () => {

    const { getByTestId } = render( <AnimatedText from="A" to="" duration={500} style={style} /> );

    expect( getByTestId( 'animatedText' ) ).toHaveTextContent( 'A' );

  } );

  it( 'Should work if text is not measured', async () => {

    const { getByTestId } = render( <AnimatedText from=">" to=";" duration={500} style={style} /> );

    expect( getByTestId( 'animatedText' ) ).toHaveTextContent( '>' );

  } );

} );

describe( 'AnimatedNumber test', () => {

  it( 'Should work with default props', async () => {

    const { getByTestId } = render( <AnimatedNumber duration={500} style={{...style, lineHeight: 40}} /> );

    expect( getByTestId( 'animatedNumber' ) ).toHaveTextContent( '0' );

  } );
  
  it( 'Should work without lineHeight', async () => {

    const { getByTestId } = render( <AnimatedNumber duration={500} style={style} /> );

    expect( getByTestId( 'animatedNumber' ) ).toHaveTextContent( '0' );

  } );

} );

describe( 'AnimatedSeparator test', () => {

  it( 'Should work without lineHeight', async () => {

    const { getByTestId } = render( <AnimatedSeparator separator="." style={style} /> );

    expect( getByTestId( 'animatedSeparator' ) ).toHaveTextContent( '.' );

  } );

} );

describe( 'AnimatedSign test', () => {

  it( 'Should work with animation', async () => {

    jest.spyOn( Reanimated, 'useSharedValue' ).mockImplementation( ( value ) => ( { value: typeof value === 'number' ? 0.5 : value } ) );
    const { getByTestId } = render( <AnimatedSign from="-" to="+" duration={500} style={style} /> );

    expect( getByTestId( 'animatedSign' ) ).toHaveTextContent( '+' );

  } );

  it( 'Should work with incorrect sign', async () => {

    jest.spyOn( Reanimated, 'useSharedValue' ).mockImplementation( ( value ) => ( { value: typeof value === 'number' ? 0.2 : value } ) );
    const { getByTestId } = render( <AnimatedSign from="1" to="+" duration={500} style={style} /> );

    expect( getByTestId( 'animatedSign' ) ).toHaveTextContent( '+' );

  } );

} );
