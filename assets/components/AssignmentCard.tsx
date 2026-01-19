import React from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    Animated,
    StyleSheet,
    Alert,
    Dimensions,
} from 'react-native'
import { COLORS } from '@/constants/colors'
import Feather from '@expo/vector-icons/Feather'
import * as scaling from 'react-native-size-matters'
import { Assignment as AssignmentType } from '../../hooks/useAssignments'
import * as utils from '../../lib/utils'

type AssignmentAPIType = {
    updateAssignment?: (id: string, payload: Partial<AssignmentType>) => Promise<any>;
    fetchAssignments?: () => Promise<void>;
    toggleCompletion?: (id: string) => Promise<any>;
};

type Props = {
    assignment: AssignmentType;
    onEdit?: (assignmentId: string) => void;
    AssignmentAPI: AssignmentAPIType;
    onDelete?: (assignmentId: string) => void;
};

const AssignmentCard: React.FC<Props> = ({ assignment, onEdit, AssignmentAPI, onDelete }) => {
    const due = utils.getDueDateFromAssignment(assignment)
    const formattedDue = utils.formatDateShort(due)
    const days = utils.daysUntil(due)

    const appearanceEffect = React.useRef(new Animated.Value(0)).current
    React.useEffect(() => {
        Animated.timing(appearanceEffect, {
            toValue: 0,
            duration: 1,
            useNativeDriver: true,
        }).start()

        Animated.timing(appearanceEffect, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
        }).start()
    }, [])

    const slideEffect = React.useRef(new Animated.Value(0)).current
    const windowWidth = Dimensions.get('window').width - 40

    const markComplete = () => {
        if (!AssignmentAPI?.updateAssignment) return

        Alert.alert(
            "Mark Complete",
            "Are you sure you want to mark this complete?\nIt will delete the assignment.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Mark Complete",
                    style: "destructive",
                    onPress: () => {
                        Animated.sequence([
                            Animated.timing(slideEffect, {
                                toValue: windowWidth,
                                duration: 150,
                                useNativeDriver: true,
                            }),
                        ]).start(({ finished }) => {
                            if (finished) {
                                AssignmentAPI.updateAssignment!(assignment.id, { completed: true })
                                    .then((r: any) => {
                                        if (!r?.success) {
                                            console.error('Failed to mark assignment as complete:', r?.error ?? r)
                                            slideEffect.setValue(0)
                                            return
                                        }
                                        onDelete?.(assignment.id)
                                    })
                                    .catch((err) => {
                                        console.error('Error marking complete:', err)
                                        slideEffect.setValue(0)
                                    })
                            }
                        })
                    },
                },
            ]
        )
    }

    return (
        <Animated.View
            style={[
                styles.card.container,
                { transform: [{ translateX: slideEffect }, { scale: appearanceEffect }] }
            ]}
        >
            <View style={styles.card.innerColumn}>
                <View style={styles.header.container}>
                    <View style={styles.header.row}>
                        <Text style={styles.header.title}>{assignment.title}</Text>

                        <TouchableOpacity style={styles.header.iconButton} onPress={markComplete}>
                            <Feather name="check-square" size={scaling.scale(20)} style={styles.header.icon} />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.header.iconButton} onPress={() => onEdit?.(assignment.id)}>
                            <Feather name="edit" size={scaling.scale(20)} style={styles.header.icon} />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.header.description}>{assignment.description}</Text>

                    <View style={styles.dividers.horizontal} />
                </View>

                <View style={styles.footer.wrapper}>
                    <View style={styles.footer.row}>
                        <View style={styles.footer.item}>
                            <Text style={styles.footer.label}>Priority</Text>
                            <Text style={styles.footer.value}>{
                                assignment.priority.charAt(0).toUpperCase() + assignment.priority.slice(1)
                            }</Text>
                        </View>

                        <View style={styles.footer.item}>
                            <Text style={styles.footer.label}>Due Date</Text>
                            <Text style={styles.footer.value}>{formattedDue || '—'}</Text>
                        </View>

                        <View style={styles.footer.item}>
                            <Text style={styles.footer.label}>Days Left</Text>
                            <Text style={styles.footer.value}>
                                {days === null
                                    ? '—'
                                    : days === 0
                                        ? 'Today'
                                        : days > 0
                                            ? `${days}d left`
                                            : `${Math.abs(days)}d ago`}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </Animated.View>
    )
}

export default AssignmentCard

const styles = StyleSheet.create({
    card: {
        container: {
            width: "100%",
            borderRadius: 10,
            backgroundColor: '#1c1c1c',
            borderWidth: 1,
            borderColor: "#fff",
            alignSelf: 'center',
            marginBottom: scaling.scale(5),
        },
        innerColumn: {
            flexDirection: 'column',
            gap: 10,
        },
    },

    header: {
        container: {
            paddingTop: "1%",
            paddingLeft: 10,
            marginBottom: "-1%",
            flexDirection: 'column',
        },
        row: {
            flexDirection: 'row',
        },
        title: {
            position: 'absolute',
            color: COLORS.text,
            fontSize: scaling.scale(24),
            alignSelf: 'flex-start',
            fontWeight: "700",
        },
        iconButton: {
            left: scaling.scale(245),
            top: scaling.scale(3),
            alignSelf: 'flex-end',
        },
        icon: {
            color: "#fff",
            paddingRight: 10,
        },
        description: {
            top: scaling.scale(3),
            color: "#d8d8d8",
            fontSize: scaling.scale(14),
            fontWeight: "600",
        },
    },

    dividers: {
        horizontal: {
            alignSelf: 'center',
            marginTop: scaling.scale(10),
            width: "100%",
            height: 1,
            backgroundColor: "rgba(177,177,177,0.33)",
        },
    },

    footer: {
        wrapper: {
            flexDirection: 'column',
            height: 'auto',
            width: 'auto',
            marginBottom: scaling.scale(15),
        },
        row: {
            paddingTop: "1%",
            justifyContent: 'space-evenly',
            flexDirection: 'row',
        },
        item: {
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        },
        label: {
            fontSize: scaling.scale(12),
            fontWeight: "400",
            color: "#d8d8d8",
        },
        value: {
            fontSize: scaling.scale(14),
            fontWeight: "600",
            color: COLORS.text,
        },
    },
})