import {useSignIn} from '@clerk/clerk-expo'
import {Link, useRouter} from 'expo-router'
import {Text, TextInput, TouchableOpacity, View} from 'react-native'
import React from 'react'
import {styles} from '../../assets/styles/authStyles.js'
import {COLORS} from '../../constants/colors.js'
import {Ionicons} from '@expo/vector-icons'
import {Image} from 'expo-image'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

export default function Page() {
    const {signIn, setActive, isLoaded} = useSignIn()
    const router = useRouter()

    const [emailAddress, setEmailAddress] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [error, setError] = React.useState("")


    const onSignInPress = async () => {
        if (!isLoaded) return

        setError("")

        if (!emailAddress.trim()) {
            setError("Please enter an email address.")
            return
        }

        if (!password.trim()) {
            setError("Please enter a password.")
            return
        }

        try {
            const signInAttempt = await signIn.create({
                identifier: emailAddress,
                password,
            })

            if (signInAttempt.status === 'complete') {
                await setActive({session: signInAttempt.createdSessionId})
                router.replace('/')
            } else {
                console.error(JSON.stringify(signInAttempt, null, 2))
            }
        } catch (err) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling

            // Add error handling here
            if (err?.errors?.[0]?.code === 'form_identifier_not_found') {
                setError("No account found with this email address.")
            } else if (err?.errors?.[0]?.code === 'form_password_incorrect') {
                setError("Incorrect password. Please try again.")
            } else if (err?.errors?.[0]?.code === 'form_identifier_invalid') {
                setError("Please enter a valid email address.")
            } else if (err?.errors?.[0]?.code === 'too_many_requests') {
                const seconds = err?.retryAfter || 60;
                setError(`Too many sign-in attempts. Please wait before trying again. You can retry after ${seconds} seconds.`)
            } else {
                setError("Something went wrong. Please try again.")
            }
        }
    }

    return (
        <KeyboardAwareScrollView style={{flex: 1}}
                                 contentContainerStyle={{flexGrow: 0.3, justifyContent: 'center', alignItems: 'center'}}
                                 enableOnAndroid={true} enabledAutomaticScroll={true}>

            <View style={[styles.container, {width: "100%", alignItems: 'center'}]}>
                <Image source={require('../../assets/images/Sign-InImage.png')}
                       style={{width: 300, height: 300, paddingBottom: 40, marginLeft: 20, overflow: "visible"}}/>
            </View>

            <View style={[styles.container, {width: "100%", alignItems: 'center', paddingBottom: 150}]}>
                <Text style={styles.title}>Welcome To AcadMe</Text>

                <Text style={[styles.title, {fontSize: 25, marginBlock: "auto", marginBottom: 20}]}>Sign In</Text>

                {error ? (
                    <View style={styles.errorBox}>
                        <Ionicons name="alert-circle" size={16} color={COLORS.expense}/>
                        <Text style={styles.errorText}>
                            {error}
                        </Text>
                        <TouchableOpacity onPress={() => setError("")}>
                            <Ionicons name="close" size={16} color={COLORS.text}/>
                        </TouchableOpacity>
                    </View>
                ) : null}

                <TextInput
                    style={[styles.input, {width: '100%'}, error && styles.errorInput]}
                    autoCapitalize="none"
                    value={emailAddress}
                    placeholder="Enter email"
                    placeholderTextColor="#9b9998ff"
                    onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
                />
                <TextInput
                    value={password}
                    style={[styles.input, {width: '100%'}, error && styles.errorInput]}
                    placeholder="Enter password"
                    placeholderTextColor="#9b9998ff"
                    secureTextEntry={true}
                    onChangeText={(password) => setPassword(password)}
                />
                <TouchableOpacity onPress={onSignInPress} style={[styles.button, {width: '75%'}]}>
                    <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>
                <View style={{display: 'flex', flexDirection: 'row', gap: 3}}>
                    <TouchableOpacity activeOpacity={0.6} style={styles.footerContainer}
                                      onPress={() => router.push('/(auth)/sign-up')}>
                        <Text style={styles.footerText}>New here?</Text>
                        <Text style={styles.linkText}>Sign up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAwareScrollView>
    )
}