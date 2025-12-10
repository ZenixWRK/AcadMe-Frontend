import {StyleSheet} from "react-native";
import {COLORS} from "../../constants/colors";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        padding: 20,
        paddingBottom: 0,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
        paddingHorizontal: 0,
        paddingVertical: 12,
    },
    headerLeft: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    headerLogo: {
        width: 75,
        height: 75,
    },
    welcomeContainer: {
        flex: 1,
    },
    welcomeText: {
        fontSize: 14,
        color: COLORS.text,
        marginBottom: 2,
    },
    usernameText: {
        fontSize: 16,
        fontWeight: "600",
        color: COLORS.text,
    },
    headerRight: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: COLORS.text,
    },
    addButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 24,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    addButtonText: {
        color: COLORS.white,
        fontWeight: "700",
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

    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        overflow: "visible",
        paddingVertical: 20,
        width: "100%",
        height: "100%"
    },

    statsDivider: {
        width: 1,
        backgroundColor: COLORS.border,
        marginHorizontal: 3,
        opacity: 0.5
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