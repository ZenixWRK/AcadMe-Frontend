// @flow
import * as React from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { COLORS } from '@/constants/colors';
import * as scaling from 'react-native-size-matters';
import { Assignment as AssignmentType } from '../../hooks/useAssignments';
import DateTimePicker, {
    DateType,
    useDefaultStyles,
    useDefaultClassNames
} from 'react-native-ui-datepicker';
import dayjs from "dayjs";
import * as utils from '../../lib/utils';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

type Props = {
    selectedAssignment: AssignmentType | null;
    modalVisible: boolean;
    setModalVisible: (visible: boolean) => void;
};

const EditAssignmentModal: React.FC<Props> = ({
                                                  selectedAssignment,
                                                  modalVisible,
                                                  setModalVisible
                                              }) => {

    const [dueDate, setDueDate] = React.useState<DateType>();
    const [lastDateSelected, setLastDateSelected] = React.useState<DateType>();
    const [showDatePicker, setShowDatePicker] = React.useState(false);

    const defaultStyles = useDefaultStyles();
    const defaultClassNames = useDefaultClassNames();

    const today = new Date();

    React.useEffect(() => {
        if (selectedAssignment) {
            const due = utils.getDueDateFromAssignment(selectedAssignment);
            if (due && dayjs(due).isValid()) {
                setDueDate(dayjs(due));
            } else {
                setDueDate(undefined);
            }
            setShowDatePicker(false);
        } else {
            setDueDate(undefined);
        }
    }, [selectedAssignment]);

    return (
        <Modal
            animationType="fade"
            transparent
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.overlay}>
                {selectedAssignment ? (
                    <KeyboardAwareScrollView
                        contentContainerStyle={styles.scrollContainer}
                        showsVerticalScrollIndicator={false}
                        enableOnAndroid
                        enableAutomaticScroll
                        extraScrollHeight={40}
                    >
                        <View style={styles.card}>
                            <View style={styles.header}>
                                <Text style={styles.headerTitle}>
                                    Edit Assignment
                                </Text>

                                <TouchableOpacity onPress={() => setModalVisible(false)}>
                                    <Text style={{...styles.closeText, fontSize: scaling.scale(20), marginLeft: scaling.scale(15)}}>⊗</Text>
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.assignmentTitle}>
                                {selectedAssignment.title}
                            </Text>

                            <Text style={styles.sectionLabel}>Due Date</Text>

                            <TouchableOpacity
                                onPress={() => {
                                    setLastDateSelected(dueDate);
                                    setShowDatePicker(!showDatePicker);
                                }}
                                style={styles.dateButton}
                            >
                                <Text style={styles.dateButtonText}>
                                    {dueDate
                                        ? dayjs(dueDate).format('ddd, MMM D')
                                        : 'Select Due Date'}
                                </Text>
                            </TouchableOpacity>

                            {showDatePicker && (
                                <View style={styles.datePickerContainer}>
                                    <DateTimePicker
                                        mode="single"
                                        date={dueDate}
                                        onChange={({ date }) => setDueDate(date)}
                                        minDate={today}
                                        disabledDates={(date) =>
                                            [0, 6].includes(dayjs(date).day())
                                        }
                                        style={styles.datePicker}
                                        classNames={defaultClassNames}
                                        styles={defaultStyles}
                                    />

                                    <View style={styles.datePickerActions}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setDueDate(lastDateSelected);
                                                setShowDatePicker(false);
                                            }}
                                            style={styles.secondaryButton}
                                        >
                                            <Text style={styles.secondaryButtonText}>Cancel</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            onPress={() => setShowDatePicker(false)}
                                            style={styles.primaryButton}
                                        >
                                            <Text style={styles.primaryButtonText}>Done</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        </View>
                    </KeyboardAwareScrollView>
                ) : (
                    <View style={styles.noAssignmentCard}>
                        <Text style={styles.noAssignmentText}>No assignment selected.</Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Text style={styles.closeText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </Modal>
    );
};

export default EditAssignmentModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.45)',
        paddingHorizontal: 20,
    },

    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    card: {
        width: 'auto',
        maxWidth: 380,
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 5,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },

    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#222',
    },

    closeText: {
        fontSize: 20,
        color: '#444',
    },

    assignmentTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },

    sectionLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#555',
        marginBottom: 8,
    },

    dateButton: {
        backgroundColor: '#111',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 15,
    },

    dateButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },

    datePickerContainer: {
        backgroundColor: '#f2f2f2',
        borderRadius: 12,
        padding: 12,
        marginTop: 5,
    },

    datePicker: {
        width: '100%',
        backgroundColor: '#3a3a3a',
        borderRadius: 10,
        padding: 10,
    },

    datePickerActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },

    primaryButton: {
        backgroundColor: '#111',
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
    },

    noAssignmentCard: {
        width: scaling.scale(300),
        height: scaling.scale(200),
        backgroundColor: COLORS.card,
        borderRadius: 12,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },

    noAssignmentText: {
        fontSize: 16,
        marginBottom: 10,
    },
});
