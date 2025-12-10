import * as React from 'react'
import {Text, TextInput, TouchableOpacity, View} from 'react-native'
import {useSignUp} from '@clerk/clerk-expo'
import {Link, useRouter} from 'expo-router'
import {styles} from '../../assets/styles/authStyles.js'
import {COLORS} from '../../constants/colors.js'
import {Ionicons} from '@expo/vector-icons'
import {Image} from 'expo-image'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

export default function SignUpScreen() {
    const {isLoaded, signUp, setActive} = useSignUp()
    const router = useRouter()

    const [emailAddress, setEmailAddress] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [pendingVerification, setPendingVerification] = React.useState(false)
    const [code, setCode] = React.useState('')
    const [error, setError] = React.useState("")

    const onSignUpPress = async () => {
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
            await signUp.create({
                emailAddress,
                password,
            })

            await signUp.prepareEmailAddressVerification({strategy: 'email_code'})

            setPendingVerification(true)
        } catch (err) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling

            const errorData = err?.errors?.[0];

            if (errorData?.code === 'form_identifier_exists') {
                setError("An account with this email already exists. Please sign in.")
            } else if (errorData?.code === 'form_password_pwned') {
                setError("This password has been compromised. Please choose a different password.")
            } else if (errorData?.code === 'form_password_length_too_short') {
                setError("Password must be at least 8 characters long.")
            } else if (errorData?.code === 'form_identifier_invalid') {
                setError("Please enter a valid email address.")
            } else {
                setError("Something went wrong. Please try again.")
            }
        }
    }

    const onVerifyPress = async () => {
        if (!isLoaded) return

        setError("")

        try {
            const signUpAttempt = await signUp.attemptEmailAddressVerification({
                code,
            })

            if (signUpAttempt.status === 'complete') {
                await setActive({session: signUpAttempt.createdSessionId})
                router.replace('/')
            } else {

                console.error(JSON.stringify(signUpAttempt, null, 2))
            }
        } catch (err) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling

            if (err?.errors?.[0]?.code === 'form_param_nil' || err?.errors?.[0]?.code === 'verification_failed') {
                setError("Invalid verification code. Please try again.")
            } else if (err?.errors?.[0]?.code === 'verification_expired') {
                setError("Your verification code has expired. Please request a new one.")
            } else if (err?.errors?.[0]?.code === 'too_many_requests') {
                setError("Too many attempts. Please wait before trying again.")
            } else {
                setError("Verification failed. Please try again.")
            }
        }
    }

    if (pendingVerification) {
        return (

            <View style={[styles.verificationContainer]}>

                <KeyboardAwareScrollView style={{flex: 1}} contentContainerStyle={{
                    flexGrow: 0.3,
                    justifyContent: 'center',
                    alignItems: 'center'
                }} enableOnAndroid={true} enabledAutomaticScroll={true} extraScrollHeight={40}>
                    <View style={[styles.container]}>
                        <Image source={require('../../assets/images/Sign-Up-VerificationImage.png')}
                               style={{width: 300, height: 350}}/>
                    </View>

                    <View style={{width: '100%'}}>
                        <Text style={styles.verificationTitle}>Verify your email</Text>

                        {error ? (
                            <View style={[styles.errorBox]}>
                                <Ionicons name="alert-circle" size={16} color={COLORS.expense}/>
                                <Text style={styles.errorText}>{error}</Text>
                                <TouchableOpacity onPress={() => setError("")}>
                                    <Ionicons name="close" size={16} color={COLORS.text}/>
                                </TouchableOpacity>
                            </View>
                        ) : null}


                        <TextInput
                            style={[styles.verificationInput, error && styles.errorInput]}
                            value={code}
                            placeholder="Enter your verification code"
                            placeholderTextColor="#9A8478"
                            onChangeText={(code) => setCode(code)}
                        />
                        <TouchableOpacity style={styles.button} onPress={onVerifyPress}>
                            <Text style={styles.buttonText}>Verify</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.footerContainer} onPress={() => router.push("/sign-up")}>
                            <Text style={styles.footerText}>Want to go back?</Text>
                            <Text style={styles.linkText}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAwareScrollView>
            </View>
        )
    }

    return (
        <KeyboardAwareScrollView style={{flex: 1}}
                                 contentContainerStyle={{flexGrow: 0.3, justifyContent: 'center', alignItems: 'center'}}
                                 enableOnAndroid={true} enabledAutomaticScroll={true} extraScrollHeight={40}>
            <View style={styles.container}>
                <Image source={require('../../assets/images/Sign-UpImage.png')}
                       style={{width: 400, height: 350, padding: 10}}/>
            </View>

            <View style={[styles.container, {width: '100%', paddingBottom: 120}]}>


                <View style={{width: '100%'}}/>
                <Text style={styles.title}>Create An Account</Text>

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
                    style={[styles.input, error && styles.errorInput]}
                    autoCapitalize="none"
                    value={emailAddress}
                    placeholder="Enter email"
                    placeholderTextColor="#9b9998ff"
                    onChangeText={(email) => setEmailAddress(email)}
                />
                <TextInput
                    style={[styles.input, error && styles.errorInput]}
                    value={password}
                    placeholder="Enter password"
                    placeholderTextColor="#9b9998ff"
                    secureTextEntry={true}
                    onChangeText={(password) => setPassword(password)}
                />
                <TouchableOpacity onPress={onSignUpPress} style={styles.button}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>

                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>Already have an account?</Text>
                    <TouchableOpacity activeOpacity={0.5} onPress={() => router.back()}>
                        <Text style={[styles.linkText, {textDecorationLine: 'none'}]}>Sign in</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAwareScrollView>
    );
}