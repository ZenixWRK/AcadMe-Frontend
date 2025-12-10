// @flow
import * as React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '@/constants/colors';
import * as scaling from 'react-native-size-matters';
import { Assignment as AssignmentType } from '../../hooks/useAssignments';
import * as utils from '../../lib/utils';

export function editAssignmentModal(selectedAssignment: AssignmentType | null, modalVisible: boolean, setModalVisible: (visible: boolean) => void): JSX.Element {
    return (
        <Modal animationType='fade' transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)'}}>
                {selectedAssignment ? (
                    <View style={{width: scaling.scale(300), height: scaling.scale(300), backgroundColor: COLORS.card, borderRadius: 10, padding: 20}}>
                        <Text>Edit Assignment: {selectedAssignment.title}</Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Text>Close</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={{width: scaling.scale(300), height: scaling.scale(200), backgroundColor: COLORS.card, borderRadius: 10, padding: 20}}>
                        <Text>No assignment selected.</Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Text>Close</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </Modal>
    );
};