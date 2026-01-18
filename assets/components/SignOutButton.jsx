import {useClerk} from '@clerk/clerk-expo'
import * as Linking from 'expo-linking'
import {Alert, Text, TouchableOpacity, StyleSheet} from 'react-native'
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
            <Ionicons style={styles.signoutButton.main} name="log-out-outline" size={28} color="#ffffffff"/>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    signoutButton: {
        main: {
            paddingLeft: 10,
            marginRight: 10
        }
    }
})