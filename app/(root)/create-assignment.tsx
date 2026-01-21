import { useUser } from '@clerk/clerk-expo'
import React from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    RefreshControl,
    StyleSheet,
    Platform,
    UIManager,
    LayoutAnimation,
    TextInput,
    Alert
} from 'react-native'
import { useAssignments } from '../../hooks/useAssignments'
import { COLORS } from '@/constants/colors'
import { SignOutButton } from '../../assets/components/SignOutButton'
import { useFocusEffect, useRouter } from 'expo-router'
import Svg, { Rect } from 'react-native-svg'
import { Ionicons } from '@expo/vector-icons'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import SafeArea from "../../assets/components/SafeArea"
import DateTimePicker, {
    DateType,
    useDefaultStyles,
    useDefaultClassNames
} from 'react-native-ui-datepicker'
import dayjs from "dayjs"
import DropDownPicker from 'react-native-dropdown-picker'

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true)
}

export default function Page() {
    const { user } = useUser()
    const router = useRouter()
    const [refreshing, setRefreshing] = React.useState(false)
    const [dueDate, setDueDate] = React.useState<DateType>()
    const [title, setTitle] = React.useState<string>('')
    const [description, setDescription] = React.useState<string>('')
    const [lastDateSelected, setLastDateSelected] = React.useState<DateType>()
    const [showDatePicker, setShowDatePicker] = React.useState(false)

    const [openPicker, setOpenPicker] = React.useState(false)
    const [valuePicker, setValuePicker] = React.useState(null)
    const [itemsPicker, setItemsPicker] = React.useState([
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' }
    ])

    const defaultStyles = useDefaultStyles()
    const defaultClassNames = useDefaultClassNames()
    const today = new Date()

    const API = useAssignments(user?.id)
    const { createAssignment, fetchAssignments } = API

    const handleSave = async () => {
        if (!title.trim()) {
            Alert.alert('Error', 'Please enter a title')
            return
        }
        if (!dueDate) {
            Alert.alert('Error', 'Please select a due date')
            return
        }
        if (!valuePicker) {
            Alert.alert('Error', 'Please select a priority')
            return
        }

        if (!description) {
            Alert.alert('Error', 'Please select a description')
            return
        }

        try {
            await createAssignment({
                title: title.trim(),
                description: description.trim() || '',
                dueDate: dayjs(dueDate).toDate(),
                priority: valuePicker,
                completed: false
            })

            setTitle('')
            setDescription('')
            setDueDate(undefined)
            setValuePicker(null)
            setShowDatePicker(false)

            router.push('/' as any)
        } catch (error) {
            Alert.alert('Error', 'Failed to create assignment')
            console.error(error)
        }
    }

    const handleCancel = () => {
        setTitle('')
        setDescription('')
        setDueDate(undefined)
        setValuePicker(null)
        setShowDatePicker(false)
        router.push('/' as any)
    }

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
            <View style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <Svg width={35} height={35} viewBox="0 0 24 24" style={styles.logo}>
                                <Rect x="3" y="3" width="7" height="9" fill="none" stroke="#ffffff" strokeWidth="2" />
                                <Rect x="14" y="3" width="7" height="5" fill="none" stroke="#ffffff" strokeWidth="2" />
                                <Rect x="14" y="12" width="7" height="9" fill="none" stroke="#ffffff" strokeWidth="2" />
                                <Rect x="3" y="16" width="7" height="5" fill="none" stroke="#ffffff" strokeWidth="2" />
                            </Svg>

                            <View style={styles.welcomeContainer}>
                                <Text style={styles.welcomeText}>Welcome,</Text>
                                <Text style={styles.usernameText}>
                                    {user?.emailAddresses[0]?.emailAddress.split("@")[0]}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.headerRight}>
                            <TouchableOpacity
                                style={styles.dashboardButton}
                                onPress={() => router.push("/" as any)}
                            >
                                <Text style={styles.dashboardButtonText}>Dashboard</Text>
                            </TouchableOpacity>
                            <SignOutButton />
                        </View>
                    </View>

                    <KeyboardAwareScrollView
                        style={styles.scroll}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                        enableOnAndroid={true}
                        enableAutomaticScroll={true}
                    >
                        <ScrollView
                            contentContainerStyle={styles.scrollContent}
                            showsVerticalScrollIndicator={false}
                        >
                            <Text style={styles.pageTitle}>Create New Assignment</Text>

                            <Text style={styles.label}>Title</Text>
                            <TextInput
                                value={title}
                                onChangeText={setTitle}
                                placeholder="E.g., Math Homework 1"
                                placeholderTextColor="#C2C2C2"
                                style={styles.input}
                            />

                            <Text style={styles.label}>Description</Text>
                            <TextInput
                                value={description}
                                onChangeText={setDescription}
                                placeholder="E.g., Complete exercises 1-10 on page 23"
                                placeholderTextColor="#C2C2C2"
                                style={styles.input}
                            />

                            <Text style={styles.label}>Due Date</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    setLastDateSelected(dueDate)
                                    setShowDatePicker(!showDatePicker)
                                    LayoutAnimation.configureNext({
                                        duration: 200,
                                        update: { type: LayoutAnimation.Types.easeInEaseOut }
                                    })
                                }}
                                style={styles.dateButton}
                            >
                                <Text style={styles.dateButtonText}>
                                    {dueDate ? dayjs(dueDate).format('ddd, MMM D') : 'Select Due Date'}
                                </Text>
                            </TouchableOpacity>

                            {showDatePicker && (
                                <View style={styles.datePickerContainer}>
                                    <DateTimePicker
                                        mode="single"
                                        date={dueDate}
                                        onChange={({ date }) => setDueDate(date)}
                                        minDate={today}
                                        disabledDates={(date) => [0, 6].includes(dayjs(date).day())}
                                        style={styles.datePicker}
                                        classNames={defaultClassNames}
                                        styles={defaultStyles}
                                    />

                                    <View style={styles.datePickerActions}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setDueDate(lastDateSelected)
                                                setShowDatePicker(false)
                                            }}
                                            style={styles.secondaryButton}
                                        >
                                            <Text style={styles.secondaryButtonText}>Cancel</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            onPress={() => setShowDatePicker(false)}
                                            style={{...styles.primaryButton, marginLeft: 10}}
                                        >
                                            <Text style={styles.primaryButtonText}>Done</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}

                            <Text style={styles.label}>Priority</Text>
                            <View>
                                <DropDownPicker
                                    open={openPicker}
                                    value={valuePicker}
                                    items={itemsPicker}
                                    setOpen={setOpenPicker}
                                    setValue={setValuePicker}
                                    setItems={setItemsPicker}
                                    listMode="SCROLLVIEW"
                                    onClose={() => {
                                        LayoutAnimation.configureNext({
                                            duration: 200,
                                            update: { type: LayoutAnimation.Types.easeInEaseOut }
                                        })
                                    }}
                                    onOpen={() => {
                                        LayoutAnimation.configureNext({
                                            duration: 200,
                                            update: { type: LayoutAnimation.Types.easeInEaseOut }
                                        })
                                    }}
                                    style={{ ...styles.dropdown, marginBottom: openPicker ? 170 : 15 }}
                                    textStyle={{ color: "#fff" }}
                                    dropDownContainerStyle={styles.dropdown}
                                    ArrowDownIconComponent={() => <Ionicons name="chevron-down" size={20} color="#fff" />}
                                    ArrowUpIconComponent={() => <Ionicons name="chevron-up" size={20} color="#fff" />}
                                    TickIconComponent={() => <Ionicons name="checkmark" size={20} color="#fff" />}
                                />
                            </View>

                            <View style={styles.actionButtons}>
                                <TouchableOpacity onPress={handleCancel} style={styles.secondaryButton}>
                                    <Text style={styles.secondaryButtonText}>Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                                    <Text style={styles.primaryButtonText}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </KeyboardAwareScrollView>
                </View>
            </View>
        </SafeArea>
    )
}

const styles = StyleSheet.create({
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
        justifyContent: 'center',
        paddingBottom: 150,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
        paddingHorizontal: 0,
        paddingVertical: 12,
    },
    headerLeft: {
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
    headerRight: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    dashboardButton: {
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
    dashboardButtonText: {
        color: "#000",
        fontWeight: "700",
        textAlign: "center",
    },

    pageTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#a8a8a8',
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#555',
        marginBottom: 8,
        width: '100%',
        maxWidth: 380,
    },
    input: {
        backgroundColor: COLORS.card,
        borderRadius: 10,
        padding: 12,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: COLORS.border,
        fontSize: 16,
        color: COLORS.text,
        textAlign: 'center',
        width: '100%',
        maxWidth: 380,
    },

    dateButton: {
        backgroundColor: COLORS.card,
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 15,
        width: '100%',
        maxWidth: 380,
    },
    dateButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    datePickerContainer: {
        backgroundColor: COLORS.card,
        borderRadius: 12,
        padding: 12,
        marginTop: 5,
        marginBottom: 15,
        width: '100%',
        maxWidth: 350,
    },
    datePicker: {
        width: '100%',
        backgroundColor: COLORS.card,
        borderRadius: 10,
        padding: 10,
    },
    datePickerActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },

    dropdown: {
        backgroundColor: COLORS.card,
        borderRadius: 12,
        padding: 12,
        marginTop: 5,
        borderWidth: 0,
    },

    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 15,
        width: '100%',
        maxWidth: 380,
    },
    primaryButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    primaryButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    secondaryButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        backgroundColor: '#dcdcdc',
    },
    secondaryButtonText: {
        color: '#333',
        fontWeight: '600',
        textAlign: 'center',
    },
    saveButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        backgroundColor: '#000000',
    },
})