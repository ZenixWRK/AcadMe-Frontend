import {Stack, Redirect} from "expo-router";
import {useAuth} from '@clerk/clerk-expo'
import SafeArea from "../../assets/components/SafeArea";

export default function AuthRoutesLayout() {
    const {isSignedIn} = useAuth();

    if (isSignedIn) {
        return <Redirect href={"/"}/>;
    }

    return (
        <SafeArea>
            <Stack screenOptions={{headerShown: false}}/>
        </SafeArea>
    );
}
