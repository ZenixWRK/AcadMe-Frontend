// @flow
import * as React from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    ScrollView,
    Platform,
    UIManager,
    LayoutAnimation,
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
import DropDownPicker from 'react-native-dropdown-picker';
import { Ionicons } from '@expo/vector-icons';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true)
}

type Props = {
    selectedAssignment: AssignmentType | null;
    modalVisible: boolean;
    setModalVisible: (visible: boolean) => void;
    API?: {
        updateAssignment?: (id: string, payload: Partial<AssignmentType>) => Promise<any>;
        fetchAssignments?: (useRefresh?: boolean | null) => Promise<void>;
    };
};

const EditAssignmentModal: React.FC<Props> = ({selectedAssignment, modalVisible, setModalVisible, API}) => {

    const [dueDate, setDueDate] = React.useState<DateType>();
    const [title, setTitle] = React.useState<string>(selectedAssignment ? selectedAssignment.title : '');
    const [description, setdescription] = React.useState<string>(selectedAssignment ? selectedAssignment.description : '');
    const [lastDateSelected, setLastDateSelected] = React.useState<DateType>();
    const [showDatePicker, setShowDatePicker] = React.useState(false);

    const [openPicker, setOpenPicker] = React.useState(false);
    const [valuePicker, setValuePicker] = React.useState(null);
    const [itemsPicker, setItemsPicker] = React.useState([
        {label: 'Low', value: 'low'},
        {label: 'Medium', value: 'medium'},
        {label: 'High', value: 'high'}
    ]);

    const defaultStyles = useDefaultStyles();
    const defaultClassNames = useDefaultClassNames();

    const today = new Date();

    const setPriority = (val: any) => {
        console.log("valuePicker prev", valuePicker)
        setValuePicker(valuePicker)
        console.log("valuePicker new", valuePicker)
    }

    let oldtitle = selectedAssignment ? selectedAssignment.title : '';
    let olddescription = selectedAssignment ? selectedAssignment.description : '';
    let oldPriority = selectedAssignment ? selectedAssignment.priority : '';

    const handleSave = () => {
        if (!API || !selectedAssignment || !API.updateAssignment) return;

        const formattedDate = dueDate
            ? dayjs(dueDate).add(1, 'day').format('YYYY-MM-DD') + 'T12:00:00'
            : undefined;

        API.updateAssignment(selectedAssignment.id, {
            title: title || oldtitle,
            dueDate: formattedDate,
            description: description || olddescription,
            priority: (valuePicker as 'low' | 'medium' | 'high') || oldPriority,
        })
            .then(() => {
                API.fetchAssignments?.(false);
                setModalVisible(false);
            });
    };

    React.useEffect(() => {
        if (selectedAssignment) {
            const due = utils.getDueDateFromAssignment(selectedAssignment);
            if (due && dayjs(due).isValid()) {
                setDueDate(dayjs(due));
            } else {
                setDueDate(undefined);
            }setShowDatePicker(false);
            setTitle(selectedAssignment.title);
            setdescription(selectedAssignment.description);
            setValuePicker(selectedAssignment.priority);
            oldtitle = selectedAssignment.title;
            olddescription = selectedAssignment.description;
            oldPriority = selectedAssignment.priority;
        } else {
            setDueDate(undefined);
            setValuePicker(null);
        }
    }, [selectedAssignment]);


    return (
        <Modal
            animationType="fade"
            transparent
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.overlay.container}>
                {selectedAssignment ? (
                    <View style={styles.card.container}>

                        <View style={styles.header.container}>
                            <Text style={styles.header.title}>Edit Assignment</Text>

                            <TouchableOpacity
                                onPress={() => {
                                    setModalVisible(false);
                                    setShowDatePicker(false);
                                    setTitle(selectedAssignment?.title || '');
                                    setdescription(selectedAssignment?.description || '');
                                    setValuePicker(selectedAssignment?.priority || null);
                                    const due = utils.getDueDateFromAssignment(selectedAssignment);
                                    if (due && dayjs(due).isValid()) {
                                        setDueDate(dayjs(due));
                                    } else {
                                        setDueDate(undefined);
                                    }
                                }}
                            >
                                <Text style={styles.header.closeIcon}>⊗</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView
                            contentContainerStyle={styles.layout.scrollContent}
                            showsVerticalScrollIndicator={false}
                        >

                            <Text style={styles.assignment.title}>
                                {selectedAssignment.title}
                            </Text>

                            <Text style={styles.section.label}>Title</Text>

                            <TextInput
                                value={title}
                                onChangeText={setTitle}
                                placeholder={oldtitle}
                                placeholderTextColor= "#C2C2C2"
                                style={{...styles.input.field, textAlign: 'center'}}
                            />

                            <Text style={styles.section.label}>Description</Text>

                            <TextInput
                                value={description}
                                onChangeText={setdescription}
                                placeholder={olddescription}
                                placeholderTextColor= "#C2C2C2"
                                style={{...styles.input.field, textAlign: 'center'}}
                            />

                            <Text style={styles.section.label}>Due Date</Text>

                            <TouchableOpacity
                                onPress={() => {
                                    setLastDateSelected(dueDate);
                                    setShowDatePicker(!showDatePicker);
                                    LayoutAnimation.configureNext({
                                            duration: 200,
                                            update: { type: LayoutAnimation.Types.easeInEaseOut }
                                        });
                                    }
                                }
                                style={{...styles.date.button, backgroundColor: COLORS.card}}
                            >
                                <Text style={styles.date.buttonText}>
                                    {dueDate
                                        ? dayjs(dueDate).format('ddd, MMM D')
                                        : 'Select Due Date'}
                                </Text>
                            </TouchableOpacity>

                            {showDatePicker && (
                                <View style={styles.datePicker.container}>
                                    <DateTimePicker
                                        mode="single"
                                        date={dueDate}
                                        onChange={({ date }) => setDueDate(date)}
                                        minDate={today}
                                        disabledDates={(date) =>
                                            [0, 6].includes(dayjs(date).day())
                                        }
                                        style={{...styles.datePicker.picker, backgroundColor: COLORS.card}}
                                        classNames={defaultClassNames}
                                        styles={defaultStyles}
                                    />

                                    <View style={styles.datePicker.actions}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setShowDatePicker(false);
                                                setModalVisible(false);
                                                setTitle(selectedAssignment?.title || '');
                                                setdescription(selectedAssignment?.description || '');
                                                setValuePicker(selectedAssignment?.priority || null);
                                                const due = utils.getDueDateFromAssignment(selectedAssignment);
                                                if (due && dayjs(due).isValid()) {
                                                    setDueDate(dayjs(due));
                                                } else {
                                                    setDueDate(undefined);
                                                }
                                            }}style={styles.button.secondary}
                                        >
                                            <Text style={{...styles.card.buttonDisregard, textAlign: 'center', fontWeight: '600'}}>Cancel</Text>
                                        </TouchableOpacity>


                                        <TouchableOpacity
                                            onPress={() => setShowDatePicker(false)}
                                            style={styles.button.primary}
                                        >
                                            <Text style={styles.button.primaryText}>Done</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}

                            <Text style={styles.section.label}>Priority</Text>

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
                                        });
                                    }}
                                    onOpen={() => {
                                        LayoutAnimation.configureNext({
                                            duration: 200,
                                            update: { type: LayoutAnimation.Types.easeInEaseOut }
                                        });
                                    }}

                                    style={{...styles.dropperPicker.container, marginBottom: openPicker ? 170 : 15}}
                                    textStyle={{color: "#fff"}}
                                    dropDownContainerStyle={styles.dropperPicker.container}
                                    ArrowDownIconComponent={() => <Ionicons name="chevron-down" size={20} color="#fff" />}
                                    ArrowUpIconComponent={() => <Ionicons name="chevron-up" size={20} color="#fff" />}
                                    TickIconComponent={() => <Ionicons name="checkmark" size={20} color="#fff" />}
                                />
                            </View>

                            <View style={styles.card.rowView}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setDueDate(lastDateSelected);
                                        setShowDatePicker(false);
                                    }}
                                    style={styles.button.secondary}
                                >
                                    <Text style={{...styles.card.buttonDisregard, textAlign: 'center', fontWeight: '600'}}>Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => handleSave()}
                                    style={{...styles.button.secondary, backgroundColor: "#000000"}}
                                >
                                    <Text style={styles.button.primaryText}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                ) : (
                    <View style={styles.empty.container}>
                        <Text style={styles.empty.text}>No assignment selected.</Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Text style={styles.header.closeIcon}>Close</Text>
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
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.45)',
            paddingHorizontal: 20,
        },
    },

    layout: {
        scrollContent: {
            paddingVertical: 10,
        },
    },

    card: {
        container: {
            width: '100%',
            maxWidth: 380,
            maxHeight: '80%',
            backgroundColor: '#2e2e2e',
            borderRadius: 16,
            padding: 20,
            shadowColor: '#000',
            shadowOpacity: 0.15,
            shadowRadius: 10,
            elevation: 5,
        },
        rowView: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 15,
        },
        buttonDiscard: {
            backgroundColor: '#111',
            paddingVertical: 14,
            borderRadius: 10,
            alignItems: 'center',
            marginBottom: 15,
        },
        buttonText: {
            color: '#fff',
            fontSize: 16,
            fontWeight: '500',
        },
    },

    header: {
        container: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 15,
        },
        title: {
            fontSize: 20,
            fontWeight: '700',
            color: '#dddddd',
        },
        closeIcon: {
            fontSize: scaling.scale(20),
            color: '#b8b8b8',
            marginLeft: scaling.scale(15),
        },
    },

    assignment: {
        title: {
            fontSize: 16,
            fontWeight: '600',
            color: '#a8a8a8',
            marginBottom: 20,
            textAlign: 'center',
        },

    },

    section: {
        label: {
            fontSize: 14,
            fontWeight: '600',
            color: '#555',
            marginBottom: 8,
        },
    },

    input: {
        field: {
            backgroundColor: COLORS.card,
            borderRadius: 10,
            padding: 12,
            marginBottom: 15,
            borderWidth: 1,
            borderColor: COLORS.border,
            fontSize: 16,
            color: COLORS.text,
        },
    },

    date: {
        button: {
            backgroundColor: '#111',
            paddingVertical: 14,
            borderRadius: 10,
            alignItems: 'center',
            marginBottom: 15,
        },
        buttonText: {
            color: '#fff',
            fontSize: 16,
            fontWeight: '500',
        },
    },

    datePicker: {
        container: {
            backgroundColor: COLORS.card,
            borderRadius: 12,
            padding: 12,
            marginTop: 5,
            marginBottom: 15,
        },
        picker: {
            width: '100%',
            backgroundColor: COLORS.card,
            borderRadius: 10,
            padding: 10,
        },
        actions: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 12,
        },
    },

    button: {
        primary: {
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 8,
        },
        primaryText: {
            color: '#fff',
            fontWeight: '600',
        },

        secondary: {
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 8,
            backgroundColor: '#dcdcdc',
        },
        secondaryText: {
            color: '#333',
            fontWeight: '600',
        },
    },

    dropperPicker: {
        container: {
            backgroundColor: COLORS.card,
            borderRadius: 12,
            padding: 12,
            marginTop: 5,
            marginBottom: 15,
        },
    },

    empty: {
        container: {
            width: scaling.scale(300),
            height: scaling.scale(200),
            backgroundColor: COLORS.card,
            borderRadius: 12,
            padding: 20,
            justifyContent: 'center',
            alignItems: 'center',
        },
        text: {
            fontSize: 16,
            marginBottom: 10,
            color: COLORS.text,
        },
    },
});