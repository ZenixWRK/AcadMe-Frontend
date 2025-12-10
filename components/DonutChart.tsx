import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import {COLORS} from "@/constants/colors";

const DonutChart = ({ data, size = 200, strokeWidth = 20, ringBackground = '#1e293b' }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const radius = (size - strokeWidth) / 2;
    const center = size / 2;
    const circumference = 2 * Math.PI * radius;
    let cumulativePercent = 0;

    // Scale font size based on chart size (adjust multiplier as needed)
    const fontSize = size * 0.07;

    return (
        <View style={styles.container}>
            <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <Circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="none"
                    stroke={ringBackground}
                    strokeWidth={strokeWidth}
                />
                {data.map((item, index) => {
                    if (item.value === 0 || total === 0) return null;
                    const percent = item.value / total;
                    const offset = -circumference * cumulativePercent;
                    const dash = circumference * percent;
                    const gap = circumference - dash;
                    cumulativePercent += percent;

                    return (
                        <Circle
                            key={index}
                            cx={center}
                            cy={center}
                            r={radius}
                            fill="none"
                            stroke={item.color}
                            strokeWidth={strokeWidth}
                            strokeDasharray={`${dash} ${gap}`}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                            rotation={-90}
                            origin={`${center}, ${center}`}
                        />
                    );
                })}
            </Svg>

            <View style={[styles.legend, { maxWidth: size * 1.5 }]}>
                {data.map((item, index) => (
                    <View key={index} style={styles.legendItem}>
                        <View style={[styles.legendDot, {
                            backgroundColor: item.color,
                            width: fontSize * 0.7,
                            height: fontSize * 0.7,
                            borderRadius: fontSize * 0.35,
                        }]} />
                        <Text style={[styles.legendLabel, { fontSize }]}>{item.label}</Text>
                        <Text style={[styles.legendPercent, { fontSize }]}>
                            {total > 0 ? ((item.value / total) * 100).toFixed(0) : 0}%
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        alignSelf: 'center',
    },
    legend: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 16,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 8,
        marginVertical: 4,
    },
    legendDot: {
        marginRight: 6,
    },
    legendLabel: {
        color: COLORS.text,
        marginRight: 4,
    },
    legendPercent: {
        color: '#64748b',
    },
});

export default DonutChart;