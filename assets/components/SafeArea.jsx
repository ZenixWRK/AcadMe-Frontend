import {View, Text} from 'react-native'
import React from 'react'
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {COLORS} from '../../constants/colors.js';

const SafeArea = ({children}) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={{
            paddingTop: insets.top,
            flex: 1,
            width: '100%',
            height: '100%',
            backgroundColor: COLORS.background
        }}>
            {children}
        </View>
    )
}

export default SafeArea