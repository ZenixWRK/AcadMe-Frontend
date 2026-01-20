import {View, ActivityIndicator, StyleSheet} from 'react-native';
import React from 'react';
import {COLORS} from '../constants/colors.js';

export default function LoadingScreen() {
    return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary}/>
        </View>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    }
});