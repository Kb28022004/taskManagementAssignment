import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import AddTaskScreen from '../screens/dashboard/AddTaskScreen';
import React from 'react';

const Stack = createStackNavigator();

export const RootNavigator = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) return null;

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
            }}
        >
            {user ? (
                <>
                    <Stack.Screen name="Dashboard" component={DashboardScreen} />
                    <Stack.Screen
                        name="AddTask"
                        component={AddTaskScreen}
                        options={{
                            presentation: 'modal',
                            cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS
                        }}
                    />
                </>
            ) : (
                <>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Register" component={RegisterScreen} />
                </>
            )}
        </Stack.Navigator>
    );
};
