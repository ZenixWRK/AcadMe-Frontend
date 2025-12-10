import { useUser } from '@clerk/clerk-expo'
import React from 'react'
import { Text, View, TouchableOpacity, Animated, SectionList, ScrollView, Modal, RefreshControl } from 'react-native'
import { useAssignments, Assignment as AssignmentType } from '../../hooks/useAssignments'
import LoadingScreen from '../../components/LoadingScreen'
import { styles } from '@/assets/styles/homeStyles'
import { COLORS } from '@/constants/colors'
import { SignOutButton } from '../../assets/components/SignOutButton'
import { Image } from 'expo-image'
import {useFocusEffect, useRouter} from 'expo-router'
import Svg, { Rect, Line, Path, Defs, Stop, LinearGradient as SvgLinearGradient } from 'react-native-svg'
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import * as scaling from 'react-native-size-matters'
import * as utils from '../../lib/utils.js'
import assignmentCard from '../../assets/components/AssignmentCard'
import { editAssignmentModal as assignmentModal } from '../../assets/components/editAssignmentModal'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

export default function Page() {
    const {user} = useUser()
    const router = useRouter()
    const [modalVisible, setModalVisible] = React.useState(false);
    const [refreshing, setRefreshing] = React.useState(false);
    const [selectedAssignment, setSelectedAssignment] = React.useState<AssignmentType | null>(null);

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

    } = API;

    // --- new: create random assignment helper ---
    const createRandomAssignment = async () => {
        const priorities = ['low', 'medium', 'high']
        const randomPriority = priorities[Math.floor(Math.random() * priorities.length)]
        const due = new Date()
        due.setDate(due.getDate() + Math.floor(Math.random() * 14) + 1) // 1-14 days ahead

        const randomAssignment: Partial<AssignmentType> = {
            title: `Random ${Math.random().toString(36).substring(2, 8)}`,
            description: 'Auto-generated assignment',
            priority: randomPriority as any,
            duedate: due.toISOString(),
            subject: 'Random',
        }

        try {
            await createAssignment(randomAssignment as any)
        } catch (err) {
            console.warn('createRandomAssignment failed', err)
        } finally {
            await fetchAssignments()
        }
    }
    // --- end new helper ---

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await fetchAssignments();
        setRefreshing(false);
    }, [fetchAssignments]);

    useFocusEffect(
        React.useCallback(() => {
            onRefresh();
        }, [onRefresh])
    )

    const getChartData = () => {
        // test purposes
        return [
            { label: 'High', value: 38, color: '#e4072e' },
            { label: 'Medium', value: 22, color: '#fff900' },
            { label: 'Low', value: 40, color: '#abe301' },
        ];
    }

    const editAssignmentModal = (assignmentId: string) => {
        setModalVisible(true);
        const assignment = getAssignmentById(assignmentId);
        setSelectedAssignment(assignment || null);
    }

    if (!user?.id || loading) {
        return <LoadingScreen/>
    }

    return (
        <View style={styles.container}>
            <View id="mainHomeContent" style={[styles.content, {marginTop: -30}]}>
                <View style={styles.header}>

                    <View style={styles.headerLeft}>
                        <Svg width={35} height={35} viewBox="0 0 24 24" style={{marginRight: 5}}>
                            <Rect x="3" y="3" width="7" height="9" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <Rect x="14" y="3" width="7" height="5" fill="none" stroke='#ffffff' strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <Rect x="14" y="12" width="7" height="9" fill="none" stroke='#ffffff' strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <Rect x="3" y="16" width="7" height="5" fill="none" stroke='#ffffff' strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </Svg>
                        <View style={styles.welcomeContainer}>
                            <Text style={[styles.welcomeText, {fontSize: 15, paddingLeft: 5}]}>Welcome,</Text>
                            <Text style={[styles.usernameText, {
                                fontSize: 20,
                                paddingLeft: 5
                            }]}>{user?.emailAddresses[0]?.emailAddress.split("@")[0]}</Text>
                        </View>
                    </View>

                    <View style={styles.headerRight}>
                        <TouchableOpacity style={styles.addButton} onPress={() => router.push("/create-assignment" as any)}>
                            <Ionicons name="add-circle" size={15} color="#000000ff"/>
                            <Text style={[styles.addButtonText, {textAlign: 'center', color: "#000000ff"}]}>Add</Text>
                        </TouchableOpacity>

                         {/* jadiel -> remove this later once the full app and API is done, this is for testing only */}

                        {/* --- new Random button --- */}
                        <TouchableOpacity
                            style={[styles.addButton, {marginLeft: 8, backgroundColor: '#e6f7ff'}]}
                            onPress={createRandomAssignment}
                        >
                            <Ionicons name="shuffle" size={15} color="#000"/>
                            <Text style={[styles.addButtonText, {textAlign: 'center', color: "#000"}]}>Random</Text>
                        </TouchableOpacity>
                        {/* --- end Random button --- */}

                        <SignOutButton/>
                    </View>
                </View>

                <KeyboardAwareScrollView
                    style={{width: '100%', backgroundColor: COLORS.background}}
                    contentContainerStyle={{
                        alignItems: 'center',
                        paddingBottom: 150
                    }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                    }
                    enableOnAndroid={true}
                    enableAutomaticScroll={true}
                    extraScrollHeight={40}
                >
                    <View style={{
                        borderRadius: 10,
                        width: '100%',
                        alignItems: 'center'
                    }}>
                        <ExpoLinearGradient
                            colors={['#472ce8', '#2b51a3', '#a80aea']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{height: scaling.scale(270), width: "100%", borderRadius: 10, borderWidth: 3.5, borderCurve: 'circular', borderColor: 'transparent', borderLeftColor: "#f4f4f4", alignSelf: 'center'}}
                        >
                            <View style={{flexDirection: 'column', gap: 10}}>
                                <View id="TitleSection" style={{paddingLeft: 10, paddingTop: 10, flexDirection: 'row', alignItems: 'center', gap: 5}}>
                                    <Ionicons name="stats-chart" size={scaling.scale(15)} color="#ffffff" />
                                    <Text style={{color: COLORS.text, fontSize: scaling.scale(15), fontWeight: '800'}}>Suggested Focus</Text>
                                    <TouchableOpacity onPress={() => editAssignmentModal('some-id')}>
                                        <Ionicons name="create-outline" size={scaling.scale(20)} color="black" style={{backgroundColor: 'white', borderRadius:100, borderWidth: 5, borderColor: 'white', borderStyle: 'solid', marginHorizontal: scaling.scale(110)}}></Ionicons>
                                    </TouchableOpacity>
                                </View>

                                <View style={{ paddingTop: "-1%", paddingLeft: 10, marginBottom: "-1%", flexDirection: 'column'}}>
                                    <Text style={{color: COLORS.text, fontSize: scaling.scale(24), fontWeight: "700"}}>Name Of Assignment</Text>
                                    <Text style={{top: scaling.scale(3), color: "#d8d8d8", fontSize: scaling.scale(14), fontWeight: "600"}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Text>
                                    <View id="HorizontalLine" style={{alignSelf: 'center', marginTop: scaling.scale(10), width: "100%", height: 1, backgroundColor: "rgba(177,177,177,0.33)"}}></View>
                                </View>

                                <View style={{flexDirection: 'column', height: 'auto', width: 'auto'}}>
                                    <View style={{paddingTop: "1%", justifyContent: 'space-evenly', flexDirection: 'row' }}>
                                        <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                                            <Text style={{fontSize: scaling.scale(12), fontWeight: "400", color: "#d8d8d8"}}>Priority</Text>
                                            <Text style={{fontSize: scaling.scale(14), fontWeight: "600", color: COLORS.text}}>High</Text>
                                        </View>
                                        <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                                            <Text style={{fontSize: scaling.scale(12), fontWeight: "400", color: "#d8d8d8"}}>Due Date</Text>
                                            <Text style={{fontSize: scaling.scale(14), fontWeight: "600", color: COLORS.text}}>Mon, Dec 13</Text>
                                        </View>
                                        <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                                            <Text style={{fontSize: scaling.scale(12), fontWeight: "400", color: "#d8d8d8"}}>Days Left</Text>
                                            <Text style={{fontSize: scaling.scale(14), fontWeight: "600", color: COLORS.text}}>Idkkkkkk</Text>
                                        </View>
                                    </View>

                                    <TouchableOpacity id="CompleteButton" style={{marginTop: "9%", backgroundColor: "#ffffff", width: "80%", height: "30%", borderRadius: 10, justifyContent: 'center', alignItems: 'center', alignSelf: 'center'}} onPress={() => {
                                        // Handle marking assignment as complete

                                    }}>
                                        <Text style={{color: "#000000", fontSize: scaling.scale(16), fontWeight: "600"}}>Mark as Complete</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                        </ExpoLinearGradient>

                        <View id='HorizontalLineDivider' style={[styles.HorizontalLineDivider, {height: 3, borderRadius: 10}]}></View>

                        <View style={{width: '90%', alignItems: 'center', marginTop: scaling.scale(10)}}>
                            <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
                                <Svg width={24} height={24} viewBox="0 0 24 24">
                                    <Defs>
                                        <SvgLinearGradient id="grad" y1="0" x2="100%" y2="0">
                                            <Stop offset="0%" stopColor="#472ce8" stopOpacity="1" />
                                            <Stop offset="50%" stopColor="#2b51a3" stopOpacity="1" />
                                            <Stop offset="100%" stopColor="#a80aea" stopOpacity="1" />
                                        </SvgLinearGradient>
                                    </Defs>

                                    <Line x1="10" y1="6" x2="21" y2="6" stroke="#2b51a3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <Line x1="10" y1="12" x2="21" y2="12" stroke="#2b51a3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <Line x1="10" y1="18" x2="21" y2="18" stroke="#2b51a3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <Path d="M4 6h.01" stroke="#2b51a3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <Path d="M4 12h.01" stroke="#2b51a3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <Path d="M4 18h.01" stroke="#2b51a3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </Svg>
                                <Text style={{color: COLORS.text, fontSize: scaling.scale(24), fontWeight: "600"}}>Upcoming Assignments</Text>
                            </View>
                        </View>

                        {getPendingAssignments().map((assignment) => (
                            <View key={assignment.id} style={{width: '100%', height: 'auto', marginTop: scaling.scale(10)}}>
                                {assignmentCard(assignment, editAssignmentModal, API)}
                            </View>
                        ))}

                    </View>
                </KeyboardAwareScrollView>

                {assignmentModal(selectedAssignment, modalVisible, setModalVisible)}

            </View>
        </View>
    )
}