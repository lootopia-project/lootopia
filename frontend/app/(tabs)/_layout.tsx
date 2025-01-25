import React from "react";
import { Tabs } from "expo-router";
// import { useAuth } from "@/hooks/providers/AuthProvider";

export default function Layout() {
  let isAuthenticated = false;
    console.log(isAuthenticated);
    
    return (
        <Tabs>
            {isAuthenticated ? (
                <>
                    <Tabs.Screen name="index" />
                </>
            ) : (
                <>
                    <Tabs.Screen name="auth/login" />
                </>
            )}
        </Tabs>
    );
}
