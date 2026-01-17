import React from 'react';
import { ViewStyle } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { View } from 'react-native';
import {COLORS} from "@/constants/colors";

type Props = {
    children: React.ReactNode;
    useInset?: boolean;
    style?: ViewStyle | ViewStyle[];
};

export default function SafeArea({ children, useInset = false, style }: Props) {
    const insets = useSafeAreaInsets();
    const paddingTop = useInset ? insets.top : 0;
    return (
        <View style={[{ flex: 1, backgroundColor: COLORS.background, paddingTop }, style]}>
            {children}
        </View>
    );
}