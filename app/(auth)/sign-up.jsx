import * as React from 'react'
import { Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { COLORS } from '../../constants/colors.js'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import SafeArea from "../../assets/components/SafeArea"

export default function SignUpScreen() {
    const { isLoaded, signUp, setActive } = useSignUp()
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
            await signUp.create({ emailAddress, password })
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
            setPendingVerification(true)
        } catch (err) {
            const errorData = err?.errors?.[0]

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
            const signUpAttempt = await signUp.attemptEmailAddressVerification({ code })

            if (signUpAttempt.status === 'complete') {
                await setActive({ session: signUpAttempt.createdSessionId })
                router.replace('/')
            } else {
                console.error(JSON.stringify(signUpAttempt, null, 2))
            }
        } catch (err) {
            const errorCode = err?.errors?.[0]?.code

            if (errorCode === 'form_param_nil' || errorCode === 'verification_failed') {
                setError("Invalid verification code. Please try again.")
            } else if (errorCode === 'verification_expired') {
                setError("Your verification code has expired. Please request a new one.")
            } else if (errorCode === 'too_many_requests') {
                setError("Too many attempts. Please wait before trying again.")
            } else {
                setError("Verification failed. Please try again.")
            }
        }
    }

    if (pendingVerification) {
        return (
            <SafeArea useInset={true}>
                <View style={styles.verify.container}>
                    <KeyboardAwareScrollView
                        style={styles.layout.scroll}
                        contentContainerStyle={styles.layout.scrollContent}
                        enableOnAndroid={true}
                        enabledAutomaticScroll={true}
                        extraScrollHeight={40}
                    >
                        <View style={styles.image.wrapper}>
                            <Image
                                source={require('../../assets/images/Sign-Up-VerificationImage.png')}
                                style={styles.image.verify}
                            />
                        </View>

                        <View style={styles.verify.content}>
                            <Text style={styles.verify.title}>Verify your email</Text>

                            {error ? (
                                <View style={styles.verify.error.box}>
                                    <Ionicons name="alert-circle" size={16} color={COLORS.expense} />
                                    <Text style={styles.verify.error.text}>{error}</Text>
                                    <TouchableOpacity onPress={() => setError("")}>
                                        <Ionicons name="close" size={16} color={COLORS.text} />
                                    </TouchableOpacity>
                                </View>
                            ) : null}

                            <TextInput
                                style={[
                                    styles.verify.input,
                                    error && styles.input.error,
                                ]}
                                value={code}
                                placeholder="Enter your verification code"
                                placeholderTextColor="#9A8478"
                                onChangeText={setCode}
                            />

                            <TouchableOpacity style={styles.verify.button.primary} onPress={onVerifyPress}>
                                <Text style={styles.verify.button.text}>Verify</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.footer.container}
                                onPress={() => router.push("/sign-up")}
                            >
                                <Text style={styles.footer.text}>Want to go back?</Text>
                                <Text style={styles.footer.link}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAwareScrollView>
                </View>
            </SafeArea>
        )
    }

    return (
        <SafeArea useInset={true}>
            <KeyboardAwareScrollView
                style={styles.layout.scroll}
                contentContainerStyle={styles.layout.scrollContent}
                enableOnAndroid={true}
                enabledAutomaticScroll={true}
                extraScrollHeight={40}
            >
                <View style={styles.image.wrapper}>
                    <Image
                        source={require('../../assets/images/Sign-UpImage.png')}
                        style={styles.image.main}
                    />
                </View>

                <View style={styles.form.wrapper}>
                    <Text style={styles.form.title}>Create An Account</Text>

                    {error ? (
                        <View style={styles.error.box}>
                            <Ionicons name="alert-circle" size={16} color={COLORS.expense} />
                            <Text style={styles.error.text}>{error}</Text>
                            <TouchableOpacity onPress={() => setError("")}>
                                <Ionicons name="close" size={16} color={COLORS.text} />
                            </TouchableOpacity>
                        </View>
                    ) : null}

                    <TextInput
                        style={[
                            styles.input.field,
                            error && styles.input.error,
                        ]}
                        autoCapitalize="none"
                        value={emailAddress}
                        placeholder="Enter email"
                        placeholderTextColor="#9b9998ff"
                        onChangeText={setEmailAddress}
                    />

                    <TextInput
                        style={[
                            styles.input.field,
                            error && styles.input.error,
                        ]}
                        value={password}
                        placeholder="Enter password"
                        placeholderTextColor="#9b9998ff"
                        secureTextEntry={true}
                        onChangeText={setPassword}
                    />

                    <TouchableOpacity onPress={onSignUpPress} style={styles.button.primary}>
                        <Text style={styles.button.text}>Sign Up</Text>
                    </TouchableOpacity>

                    <View style={styles.footer.container}>
                        <Text style={styles.footer.text}>Already have an account?</Text>

                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={() => {
                                setPendingVerification(false)
                                router.push("/sign-in")
                            }}
                        >
                            <Text style={styles.footer.link}>Sign in</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </SafeArea>
    )
}

const styles = StyleSheet.create({
    layout: {
        scroll: {
            flex: 1,
            backgroundColor: COLORS.background,
        },
        scrollContent: {
            flexGrow: 0.3,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: COLORS.background,
        },
    },

    image: {
        wrapper: {
            width: "100%",
            alignItems: 'center',
        },
        main: {
            width: 400,
            height: 350,
            padding: 10,
        },
        verify: {
            width: 300,
            height: 350,
        },
    },

    form: {
        wrapper: {
            width: "100%",
            paddingBottom: 120,
            alignItems: "center",
        },
        title: {
            fontSize: 32,
            fontWeight: "bold",
            color: COLORS.text,
            marginVertical: 15,
            textAlign: "center",
        },
    },

    verify: {
        container: {
            flex: 1,
            backgroundColor: COLORS.background,
            padding: 40,
            justifyContent: "center",
            alignItems: "center",
        },
        content: {
            width: "100%",
        },
        title: {
            fontSize: 24,
            fontWeight: "bold",
            color: COLORS.text,
            marginBottom: 20,
            textAlign: "center",
        },
        input: {
            backgroundColor: COLORS.white,
            borderRadius: 12,
            padding: 15,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: COLORS.border,
            fontSize: 16,
            color: COLORS.text,
            width: "100%",
            textAlign: "center",
            letterSpacing: 2,
        },
        button: {
            primary: {
                backgroundColor: COLORS.primary,
                borderRadius: 12,
                padding: 16,
                alignSelf: "center",
                alignItems: "center",
                marginTop: 10,
                marginBottom: 20,
                width: "100%",
            },
            text: {
                color: COLORS.white,
                fontSize: 18,
                fontWeight: "600",
            },
        },
        error: {
            box: {
                backgroundColor: "#FFE5E5",
                padding: 12,
                borderRadius: 8,
                borderLeftWidth: 4,
                borderLeftColor: COLORS.expense,
                marginBottom: 16,
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
            },
            text: {
                color: "#B00020",
                marginLeft: 8,
                flex: 1,
                fontSize: 14,
            },
        },
    },

    error: {
        box: {
            backgroundColor: "#FFE5E5",
            padding: 12,
            borderRadius: 8,
            borderLeftWidth: 4,
            borderLeftColor: COLORS.expense,
            marginBottom: 16,
            flexDirection: "row",
            alignItems: "center",
            width: "90%",
        },
        text: {
            color: "#B00020",
            marginLeft: 8,
            flex: 1,
            fontSize: 14,
        },
    },

    input: {
        field: {
            backgroundColor: COLORS.white,
            borderRadius: 12,
            padding: 15,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: COLORS.border,
            fontSize: 16,
            color: COLORS.text,
            width: "90%",
        },
        error: {
            borderColor: COLORS.expense,
        },
    },

    button: {
        primary: {
            backgroundColor: COLORS.primary,
            borderRadius: 12,
            padding: 16,
            alignItems: "center",
            marginTop: 10,
            marginBottom: 20,
            width: "90%",
        },
        text: {
            color: COLORS.white,
            fontSize: 18,
            fontWeight: "600",
        },
    },

    footer: {
        container: {
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
            marginTop: 10,
        },
        text: {
            color: COLORS.text,
            fontSize: 16,
        },
        link: {
            color: COLORS.primary,
            fontSize: 16,
            fontWeight: "600",
        },
    },
})
