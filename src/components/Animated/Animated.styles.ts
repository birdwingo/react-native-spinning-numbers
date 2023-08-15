import { StyleSheet } from 'react-native';

export default StyleSheet.create( {
  sign: {
    position: 'absolute',
    textAlign: 'center',
  },
  text: {
    overflow: 'visible',
    position: 'absolute',
  },
  separator: {
    position: 'absolute',
    overflow: 'hidden',
    textAlign: 'center',
  },
  measureContainer: {
    width: 0,
    height: 0,
    overflow: 'hidden',
  },
  measureText: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  overflowVisible: {
    overflow: 'visible',
  },
} );
