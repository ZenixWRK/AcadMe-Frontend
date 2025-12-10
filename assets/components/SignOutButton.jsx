import {useClerk} from '@clerk/clerk-expo'
import * as Linking from 'expo-linking'
import {Alert, Text, TouchableOpacity} from 'react-native'
import {styles} from '../styles/homeStyles'
import {Ionicons} from '@expo/vector-icons'

export const SignOutButton = () => {
    const {signOut} = useClerk()
    const handleSignOut = async () => {
        Alert.alert("Sign Out", "Are you sure you want to sign out?", [
            {
                text: "Cancel",
                style: "cancel",
            },

            {
                text: "Sign Out",
                style: "destructive",
                onPress: async () => {
                    try {
                        await signOut()
                        Linking.openURL(Linking.createURL('/'))
                    } catch (err) {
                        console.error(JSON.stringify(err, null, 2))
                    }
                },
            },
        ])
    }
    return (
        <TouchableOpacity onPress={handleSignOut}>
            <Ionicons style={{paddingLeft: 10, marginRight: 10}} name="log-out-outline" size={28} color="#ffffffff"/>
        </TouchableOpacity>
    )
}