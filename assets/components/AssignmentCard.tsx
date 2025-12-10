import React from 'react'
import { Text, View, TouchableOpacity, Animated, SectionList, ScrollView, Modal, RefreshControl } from 'react-native'
import { styles } from '@/assets/styles/homeStyles'
import { COLORS } from '@/constants/colors'
import { Image } from 'expo-image'
import {useFocusEffect, useRouter} from 'expo-router'
import Svg, { Rect, Line, Path, Defs, Stop, LinearGradient as SvgLinearGradient } from 'react-native-svg'
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import * as scaling from 'react-native-size-matters'
import { Assignment as AssignmentType } from '../../hooks/useAssignments'
import * as utils from '../../lib/utils'

type AssignmentAPIType = {
    updateAssignment?: (id: string, payload: Partial<AssignmentType>) => Promise<any>;
    fetchAssignments?: () => Promise<void>;
    toggleCompletion?: (id: string) => Promise<any>;
};

const assignmentCard = (assignment: AssignmentType, onEdit?: (assignmentId:string) => void, AssignmentAPI: AssignmentAPIType) => {
    const due = utils.getDueDateFromAssignment(assignment);
    const formattedDue = utils.formatDateShort(due);
    const days = utils.daysUntil(due);

    const markComplete = async () => {
        if (!AssignmentAPI?.updateAssignment) return;
        try {
            const r: any = await AssignmentAPI.updateAssignment(assignment.id, { completed: true });
            if (!r?.success) {
                console.error('Failed to mark assignment as complete:', r?.error ?? r);
                return;
            }

            if (AssignmentAPI.fetchAssignments) {
                await AssignmentAPI.fetchAssignments();
            }
        } catch (err) {
            console.error('Error marking complete:', err);
        }
    };

    return (
        <View
            style={{width: "100%", borderRadius: 10, borderWidth: 3.5, borderCurve: 'circular', borderColor: 'transparent', borderLeftColor: "#f4f4f4", alignSelf: 'center'}}
        >
            <View style={{flexDirection: 'column', gap: 10}}>
                <View style={{ paddingTop: "1%", paddingLeft: 10, marginBottom: "-1%", flexDirection: 'column'}}>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{position: 'absolute', color: COLORS.text, fontSize: scaling.scale(24), alignSelf: 'flex-start', fontWeight: "700"}}>{assignment.title}</Text>
                        <TouchableOpacity style={{left: scaling.scale(200), alignSelf: 'flex-end'}} onPress={() => onEdit(assignment.id)}>
                            <Ionicons name="create-outline" size={scaling.scale(20)} color="black" style={{backgroundColor: 'white', borderRadius:100, borderWidth: 5, borderColor: 'white', borderStyle: 'solid'}}></Ionicons>
                        </TouchableOpacity>
                    </View>
                    <Text style={{top: scaling.scale(3), color: "#d8d8d8", fontSize: scaling.scale(14), fontWeight: "600"}}>{assignment.description}</Text>
                    <View id="HorizontalLine" style={{alignSelf: 'center', marginTop: scaling.scale(10), width: "100%", height: 1, backgroundColor: "rgba(177,177,177,0.33)"}}></View>
                </View>

                <View style={{flexDirection: 'column', height: 'auto', width: 'auto'}}>
                    <View style={{paddingTop: "1%", justifyContent: 'space-evenly', flexDirection: 'row' }}>
                        <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontSize: scaling.scale(12), fontWeight: "400", color: "#d8d8d8"}}>Priority</Text>
                            <Text style={{fontSize: scaling.scale(14), fontWeight: "600", color: COLORS.text}}>{assignment.priority}</Text>
                        </View>
                        <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontSize: scaling.scale(12), fontWeight: "400", color: "#d8d8d8"}}>Due Date</Text>
                            <Text style={{fontSize: scaling.scale(14), fontWeight: "600", color: COLORS.text}}>{formattedDue || '—'}</Text>
                        </View>
                        <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontSize: scaling.scale(12), fontWeight: "400", color: "#d8d8d8"}}>Days Left</Text>
                            <Text style={{fontSize: scaling.scale(14), fontWeight: "600", color: COLORS.text}}>{
                                days === null ? '—' : days === 0 ? 'Today' : days > 0 ? `${days}d left` : `${Math.abs(days)}d ago`
                            }</Text>
                        </View>
                    </View>

                    <TouchableOpacity id="CompleteButton" style={{marginTop: "9%", backgroundColor: "#ffffff", width: "80%", height: scaling.scale(40), borderRadius: 10, justifyContent: 'center', alignItems: 'center', alignSelf: 'center'}} onPress={markComplete}>
                        <Text style={{color: "#000000", fontSize: scaling.scale(16), fontWeight: "600"}}>Mark as Complete</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    )
}

export default assignmentCard;