import { TextStyle, ViewProps } from 'react-native';

export interface SpinningNumbersProps {
  children: string,
  style?: ViewProps & TextStyle
  duration?: number,
  parentheses?: boolean,
  extendCharacters?: string
}
