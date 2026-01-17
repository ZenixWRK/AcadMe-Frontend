import {StyleSheet} from "react-native";
import {COLORS} from "../../constants/colors";
import * as scaling from 'react-native-size-matters'

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: scaling.scale(20),
        height: scaling.scale(275),
        paddingHorizontal: scaling.scale(20),
        borderRadius: 40,
        borderTopStartRadius: 0,
        borderTopEndRadius: 0,
    },

    logoutButton: {
        padding: 10,
        borderRadius: 20,
        backgroundColor: COLORS.card,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: COLORS.text,
        marginVertical: 15,
        textAlign: "center",
    },

    HorizontalLineDivider: {
        alignSelf: 'center',
        marginTop: 15,
        width: "90%",
        height: 1,
        backgroundColor: "rgba(177,177,177,0.33)"
    },

    errorInput: {
        borderColor: COLORS.expense,
    },
    button: {
        backgroundColor: COLORS.primary,
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
        marginTop: 10,
        marginBottom: 20,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: "600",
    },
    footerContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
    },
    footerText: {
        color: COLORS.text,
        fontSize: 16,
    },
    linkText: {
        color: COLORS.primary,
        fontSize: 16,
        fontWeight: "600",
    },

    errorBox: {
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
    errorText: {
        color: COLORS.text,
        marginLeft: 8,
        flex: 1,
        fontSize: 14,
    },
});