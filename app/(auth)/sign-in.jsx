import { useSignIn } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native'
import React from 'react'
import { COLORS } from '../../constants/colors.js'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import SafeArea from "../../assets/components/SafeArea"

export default function Page() {
    const { signIn, setActive, isLoaded } = useSignIn()
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
                await setActive({ session: signInAttempt.createdSessionId })
                router.replace('/')
            } else {
                console.error(JSON.stringify(signInAttempt, null, 2))
            }
        } catch (err) {
            if (err?.errors?.[0]?.code === 'form_identifier_not_found') {
                setError("No account found with this email address.")
            } else if (err?.errors?.[0]?.code === 'form_password_incorrect') {
                setError("Incorrect password. Please try again.")
            } else if (err?.errors?.[0]?.code === 'form_identifier_invalid') {
                setError("Please enter a valid email address.")
            } else if (err?.errors?.[0]?.code === 'too_many_requests') {
                const seconds = err?.retryAfter || 60
                setError(`Too many sign-in attempts. Please wait before trying again. You can retry after ${seconds} seconds.`)
            } else {
                setError("Something went wrong. Please try again.")
            }
        }
    }

    return (
        <SafeArea useInset={true}>
            <KeyboardAwareScrollView
                style={styles.layout.scroll}
                contentContainerStyle={styles.layout.scrollContent}
                enableOnAndroid={true}
                enabledAutomaticScroll={true}
            >

                <View style={styles.image.wrapper}>
                    <Image
                        source={require('../../assets/images/Sign-InImage.png')}
                        style={styles.image.main}
                    />
                </View>

                <View style={styles.form.wrapper}>
                    <Text style={styles.form.title}>Welcome To AcadMe</Text>
                    <Text style={styles.form.subtitle}>Sign In</Text>

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
                        value={password}
                        style={[
                            styles.input.field,
                            error && styles.input.error,
                        ]}
                        placeholder="Enter password"
                        placeholderTextColor="#9b9998ff"
                        secureTextEntry={true}
                        onChangeText={setPassword}
                    />

                    <TouchableOpacity onPress={onSignInPress} style={styles.button.primary}>
                        <Text style={styles.button.text}>Continue</Text>
                    </TouchableOpacity>

                    <View style={styles.footer.row}>
                        <TouchableOpacity
                            activeOpacity={0.6}
                            style={styles.footer.container}
                            onPress={() => router.push('/(auth)/sign-up')}
                        >
                            <Text style={styles.footer.text}>New here?</Text>
                            <Text style={styles.footer.link}>Sign up</Text>
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
            flexGrow: 1,
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
            width: 300,
            height: 300,
            paddingBottom: 40,
            marginLeft: 20,
            overflow: "visible",
        },
    },

    form: {
        wrapper: {
            width: "100%",
            alignItems: 'center',
        },
        title: {
            fontSize: 32,
            fontWeight: "bold",
            color: COLORS.text,
            marginBottom: 10,
            textAlign: "center",
        },
        subtitle: {
            fontSize: 25,
            fontWeight: "bold",
            color: COLORS.text,
            marginBottom: 20,
            textAlign: "center",
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
            width: "75%",
        },
        text: {
            color: COLORS.white,
            fontSize: 18,
            fontWeight: "600",
        },
    },

    footer: {
        row: {
            flexDirection: 'row',
            gap: 3,
        },
        container: {
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
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
