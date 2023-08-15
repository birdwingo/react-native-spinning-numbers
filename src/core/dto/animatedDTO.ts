import { TextStyle } from 'react-native';

export interface AnimatedNumberProps {
  from?: number,
  to?: number,
  exponent?: number,
  style: TextStyle,
  duration: number,
}

export interface AnimatedSeparatorProps {
  separator: string,
  style: TextStyle,
}

export interface AnimatedSignProps {
  from: string,
  to: string,
  style: TextStyle,
  duration: number,
}

export interface AnimatedTextProps {
  from: string,
  to: string,
  align?: 'left' | 'right' | 'center',
  duration: number,
  delay?: number,
  style: TextStyle,
}
