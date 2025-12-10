import { Stack, Slot } from "expo-router";
import { ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import SafeArea from "../assets/components/SafeArea";

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <SafeArea> 
        <Slot />
      </SafeArea>
    </ClerkProvider>  
  );
}
