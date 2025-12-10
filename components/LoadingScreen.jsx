import {View, ActivityIndicator, StyleSheet} from 'react-native';
import React from 'react';
import {styles} from '../assets/styles/createStyles.js';
import {COLORS} from '../constants/colors.js';

export default function LoadingScreen() {
    return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary}/>
        </View>
    );
}