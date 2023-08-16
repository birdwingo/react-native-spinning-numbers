import { fontHash, decimals } from '../src/core/helpers';

describe( 'fontHash helper test', () => {

  it( 'should return a hash', () => {

    const result = fontHash( {
      fontFamily: 'Arial',
      fontSize: 12,
      fontWeight: 800,
    } );

    expect( result ).toBe( 'Arial:12:800' );

  } );

} );

describe( 'decimals helper test', () => {

  it( 'should return decimals', () => {

    const result = decimals( '1.23456789' );

    expect( result ).toBe( 1 );

  } );

  it( 'should return 0', () => {

    const result = decimals( '' );

    expect( result ).toBe( 0 );

  } );

} );
