import { useUser } from '@clerk/clerk-expo'
import React from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    Animated,
    SectionList,
    ScrollView,
    Modal,
    RefreshControl,
    StyleSheet,
    Platform,
    UIManager,
    LayoutAnimation
} from 'react-native'
import { useAssignments, Assignment as AssignmentType } from '../../hooks/useAssignments'
import LoadingScreen from '../../components/LoadingScreen'
import { COLORS } from '@/constants/colors'
import { SignOutButton } from '../../assets/components/SignOutButton'
import { Image } from 'expo-image'
import { useFocusEffect, useRouter } from 'expo-router'
import Svg, { Rect } from 'react-native-svg'
import { Ionicons } from '@expo/vector-icons'
import * as scaling from 'react-native-size-matters'
import * as utils from '../../lib/utils.js'
import AssignmentCard from '../../assets/components/AssignmentCard'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import SafeArea from "../../assets/components/SafeArea"

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true)
}

export default function Page() {
    const { user } = useUser()
    const router = useRouter()
    const [refreshing, setRefreshing] = React.useState(false)
    const [selectedAssignment, setSelectedAssignment] = React.useState<AssignmentType | null>(null)

    const API = useAssignments(user?.id)
    const {
        loading,
        createAssignment,
        updateAssignment,
        deleteAssignment,
        toggleCompletion,
        fetchAssignmentsBySubject,
        fetchAssignments,
        getCompletedAssignments,
        getPendingAssignments,
        getLateAssignments,
        getAssignmentsByPriority,
        getAssignmentById,
        assignments,
    } = API

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true)
        await fetchAssignments(false)
        setRefreshing(false)
    }, [fetchAssignments])

    useFocusEffect(
        React.useCallback(() => {
            onRefresh()
        }, [onRefresh])
    )

    return (
        <SafeArea useInset={true}>
            <View style={styles.layout.container}>

                <View style={styles.layout.content}>
                    <View style={styles.header.container}>

                        <View style={styles.header.left}>
                            <Svg width={35} height={35} viewBox="0 0 24 24" style={styles.header.logo}>
                                <Rect x="3" y="3" width="7" height="9" fill="none" stroke="#ffffff" strokeWidth="2" />
                                <Rect x="14" y="3" width="7" height="5" fill="none" stroke="#ffffff" strokeWidth="2" />
                                <Rect x="14" y="12" width="7" height="9" fill="none" stroke="#ffffff" strokeWidth="2" />
                                <Rect x="3" y="16" width="7" height="5" fill="none" stroke="#ffffff" strokeWidth="2" />
                            </Svg>

                            <View style={styles.header.welcomeContainer}>
                                <Text style={styles.header.welcomeText}>Welcome,</Text>
                                <Text style={styles.header.usernameText}>
                                    {user?.emailAddresses[0]?.emailAddress.split("@")[0]}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.header.right}>
                            <TouchableOpacity
                                style={styles.header.addButton}
                                onPress={() => router.push("/create-assignment" as any)}
                            >
                                <Ionicons name="add-circle" size={15} color="#000" />
                                <Text style={styles.header.addButtonText}>Add</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.header.randomButton}
                                onPress={createRandomAssignment}
                            >
                                <Ionicons name="shuffle" size={15} color="#000" />
                                <Text style={styles.header.randomButtonText}>Random</Text>
                            </TouchableOpacity>

                            <SignOutButton />
                        </View>
                    </View>

                    <KeyboardAwareScrollView
                        style={styles.layout.scroll}
                        contentContainerStyle={styles.layout.scrollContent}
                        showsVerticalScrollIndicator={false}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                        enableOnAndroid={true}
                        enableAutomaticScroll={true}
                        extraScrollHeight={40}
                    >

                            <View style={styles.dividers.horizontal} />

                            <View style={styles.upcoming.headerWrapper}>
                                <View style={styles.upcoming.headerRow}>
                                    <Text style={styles.upcoming.headerText}>Upcoming Assignments</Text>
                                </View>
                            </View>

                        </View>
                    </KeyboardAwareScrollView>
                </View>
            </View>
        </SafeArea>
    )
}


const styles = StyleSheet.create({
    layout: {
        container: {
            flex: 1,
            backgroundColor: COLORS.background,
        },
        content: {
            padding: 20,
            paddingBottom: 0,
            marginTop: -30,
        },
        scroll: {
            width: '100%',
            backgroundColor: COLORS.background,
        },
        scrollContent: {
            alignItems: 'center',
            paddingBottom: 150,
        },
    },

    header: {
        container: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
            paddingHorizontal: 0,
            paddingVertical: 12,
        },
        left: {
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
        },
        logo: {
            marginRight: 5,
        },
        welcomeContainer: {
            flex: 1,
        },
        welcomeText: {
            fontSize: 15,
            color: COLORS.text,
            marginBottom: 2,
            paddingLeft: 5,
        },
        usernameText: {
            fontSize: 20,
            fontWeight: "600",
            color: COLORS.text,
            paddingLeft: 5,
        },
        right: {
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
        },
        addButton: {
            backgroundColor: COLORS.primary,
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 24,
            flexDirection: "row",
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        },
        addButtonText: {
            color: "#000",
            fontWeight: "700",
            textAlign: "center",
        },
        randomButton: {
            marginLeft: 8,
            backgroundColor: '#e6f7ff',
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 24,
            flexDirection: "row",
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        },
        randomButtonText: {
            color: "#000",
            fontWeight: "700",
            textAlign: "center",
        },
    },

    suggested: {
        cardWrapper: {
            borderRadius: 10,
            width: '100%',
            alignItems: 'center',
        },
        card: {
            height: scaling.scale(250),
            width: "100%",
            borderRadius: 10,
            borderColor: "white",
            borderWidth: 1,
            alignSelf: 'center',
        },
        inner: {
            flexDirection: 'column',
            gap: 10,
        },
        titleRow: {
            paddingLeft: 10,
            paddingTop: 10,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
        },
        title: {
            color: COLORS.text,
            fontSize: scaling.scale(15),
            fontWeight: '800',
        },
        editIcon: {
            backgroundColor: 'transparent',
            color: "#fff",
            marginHorizontal: scaling.scale(120),
        },
        assignmentInfo: {
            paddingTop: "-1%",
            paddingLeft: 10,
            marginBottom: "-1%",
            flexDirection: 'column',
        },
        assignmentName: {
            color: COLORS.text,
            fontSize: scaling.scale(24),
            fontWeight: "700",
        },
        assignmentDescription: {
            top: scaling.scale(3),
            color: "#d8d8d8",
            fontSize: scaling.scale(14),
            fontWeight: "600",
        },
        metaSection: {
            flexDirection: 'column',
            height: 'auto',
            width: 'auto',
        },
        metaRow: {
            paddingTop: "1%",
            justifyContent: 'space-evenly',
            flexDirection: 'row',
        },
        metaItem: {
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        },
        metaLabel: {
            fontSize: scaling.scale(12),
            fontWeight: "400",
            color: "#d8d8d8",
        },
        metaValue: {
            fontSize: scaling.scale(14),
            fontWeight: "600",
            color: COLORS.text,
        },
        completeButton: {
            marginTop: "6%",
            backgroundColor: "#ffffff",
            width: "80%",
            height: "30%",
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
        },
        completeButtonText: {
            color: "#000000",
            fontSize: scaling.scale(16),
            fontWeight: "600",
        },
    },

    upcoming: {
        headerWrapper: {
            width: '90%',
            alignItems: 'center',
            marginTop: scaling.scale(10),
        },
        headerRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
        },
        headerText: {
            color: COLORS.text,
            fontSize: scaling.scale(24),
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
})