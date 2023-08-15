# @birdwingo/react-native-spinning-numbers

![npm downloads](https://img.shields.io/npm/dm/%40birdwingo/react-native-spinning-numbers)
![npm version](https://img.shields.io/npm/v/%40birdwingo/react-native-spinning-numbers)
![github release](https://github.com/birdwingo/react-native-spinning-numbers/actions/workflows/release.yml/badge.svg?event=pull_request)
![npm release](https://github.com/birdwingo/react-native-spinning-numbers/actions/workflows/public.yml/badge.svg?event=release)

## About

`react-native-spinning-numbers` is a customizable and animated component that offers a highly captivating way to display numerical values within your React Native application. This component combines an elegant visual effect of rotating numbers with the ability to dynamically change values, adding interactivity and intrigue to your user interfaces. It is used in the [Birdwingo mobile app](https://www.birdwingo.com) to show portfolio values and market prices changing in the real time.

<img src="./src/assets/images/demo.gif" width="300">

## Installation

```bash
npm install react-native-reanimated
npm install @birdwingo/react-native-spinning-numbers
```

## Usage

To use the `SpinningNumbers` component, you need to import it in your React Native application and include it in your JSX code. Here's an example of how to use it:

```jsx
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import SpinningNumbers from '@birdwingo/react-native-spinning-numbers';

const YourComponent = () => {

  const [ value, setValue ] = useState( '$1478.78' );

  return (
    <SpinningNumbers
      style={{
        color: 'grey',
        fontSize: 45,
      }}
    >
      {value}
    </SpinningNumbers>
  );

};

export default YourComponent;
```

## Props

 Name                    | Type                          | Default value           | Description       
-------------------------|-------------------------------|-------------------------|---------------------
 `children`              | string                        | **required**            | Text to be rendered
 `style`                 | ViewStyle & TextStyle         |                         | Styles to be applied to text and container
 `duration`              | number                        | 1000                    | Duration of the animation in ms
 `parentheses`           | boolean                       | false                   | Whether to show parentheses around text
 `extendCharacters`      | string                        | ''                      | A string of characters that could appear in your text. You do not need to use it if your text contains only basic alphabetic characters, numbers or the following characters: `,.-+$%€!?&@#*`

## Sponsor

**react-native-spinning-numbers** is sponsored by [Birdwingo](https://www.birdwingo.com).\
Download Birdwingo mobile app to see react-native-spinning-numbers in action!