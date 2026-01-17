import * as React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors'


export function PageBackButton() {
    const [ currentPage, setCurrentPage ] = React.useState("")


    return (
        <View>
            <Ionicons name="arrow-left" style={{color: COLORS.primary}}/>
        </View>
    );
};