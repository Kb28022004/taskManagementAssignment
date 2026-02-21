import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../api/client';
import { X, Check, Flag, Zap } from 'lucide-react-native';
import { theme } from '../../theme/theme';
import { LinearGradient } from 'expo-linear-gradient';

export default function AddTaskScreen({ navigation }: any) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('MEDIUM');
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        if (!title.trim()) {
            Alert.alert('Error', 'Please enter a task title');
            return;
        }

        setLoading(true);
        try {
            await api.post('/tasks', {
                title: title.trim(),
                description: description.trim(),
                priority,
                status: 'TODO'
            });
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Failed to create task');
        } finally {
            setLoading(false);
        }
    };

    const priorities = [
        { label: 'Low', value: 'LOW', color: theme.colors.primaryLight, icon: Zap },
        { label: 'Medium', value: 'MEDIUM', color: theme.colors.warning, icon: Zap },
        { label: 'High', value: 'HIGH', color: theme.colors.error, icon: Zap },
    ];

    return (
        <View style={styles.outerContainer}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={styles.safeArea}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.closeBtn}
                            onPress={() => navigation.goBack()}
                            activeOpacity={0.7}
                        >
                            <X color={theme.colors.text} size={24} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>New Task</Text>
                        <TouchableOpacity
                            style={styles.saveBtn}
                            onPress={handleCreate}
                            disabled={loading || !title.trim()}
                            activeOpacity={0.7}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color={theme.colors.primary} />
                            ) : (
                                <Text style={[styles.saveBtnText, !title.trim() && { opacity: 0.3 }]}>Save</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        style={styles.content}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        {/* Title Input Section */}
                        <View style={styles.inputSection}>
                            <Text style={styles.label}>What are you planning?</Text>
                            <TextInput
                                style={styles.titleInput}
                                placeholder="Task title..."
                                placeholderTextColor={theme.colors.textMuted}
                                value={title}
                                onChangeText={setTitle}
                                autoFocus
                                multiline
                            />
                        </View>

                        {/* Description Section */}
                        <View style={styles.inputSection}>
                            <Text style={styles.label}>Notes</Text>
                            <View style={styles.descContainer}>
                                <TextInput
                                    style={styles.descInput}
                                    placeholder="Add more details about this task..."
                                    placeholderTextColor={theme.colors.textMuted}
                                    value={description}
                                    onChangeText={setDescription}
                                    multiline
                                    numberOfLines={4}
                                    textAlignVertical="top"
                                />
                            </View>
                        </View>

                        {/* Priority Section */}
                        <View style={styles.inputSection}>
                            <Text style={styles.label}>Priority Level</Text>
                            <View style={styles.priorityGrid}>
                                {priorities.map((p) => {
                                    const isSelected = priority === p.value;
                                    return (
                                        <TouchableOpacity
                                            key={p.value}
                                            activeOpacity={0.8}
                                            style={[
                                                styles.priorityCard,
                                                isSelected && { backgroundColor: p.color + '10', borderColor: p.color }
                                            ]}
                                            onPress={() => setPriority(p.value)}
                                        >
                                            <p.icon
                                                size={18}
                                                color={isSelected ? p.color : theme.colors.textMuted}
                                                fill={isSelected ? p.color : 'transparent'}
                                            />
                                            <Text style={[
                                                styles.priorityLabel,
                                                isSelected && { color: p.color, fontWeight: '800' }
                                            ]}>
                                                {p.label}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>

                        {/* Create Button */}
                        <TouchableOpacity
                            style={styles.createBtnWrapper}
                            onPress={handleCreate}
                            disabled={loading || !title.trim()}
                            activeOpacity={0.9}
                        >
                            <LinearGradient
                                colors={[theme.colors.primary, theme.colors.primaryDark]}
                                style={styles.createBtn}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <>
                                        <Text style={styles.createBtnText}>Create Task</Text>
                                        <Check color="#fff" size={20} strokeWidth={3} style={{ marginLeft: 8 }} />
                                    </>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    safeArea: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    closeBtn: {
        padding: 8,
        borderRadius: 12,
        backgroundColor: theme.colors.surface,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: theme.colors.text,
    },
    saveBtn: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    saveBtnText: {
        color: theme.colors.primary,
        fontSize: 16,
        fontWeight: '800',
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 40,
    },
    inputSection: {
        marginBottom: 32,
    },
    label: {
        fontSize: 14,
        fontWeight: '800',
        color: theme.colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 16,
    },
    titleInput: {
        fontSize: 28,
        fontWeight: '800',
        color: theme.colors.text,
        padding: 0,
        minHeight: 40,
    },
    descContainer: {
        backgroundColor: theme.colors.surface,
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    descInput: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.text,
        minHeight: 120,
        paddingTop: 0,
    },
    priorityGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    priorityCard: {
        flex: 1,
        height: 70,
        borderRadius: 18,
        borderWidth: 1.5,
        borderColor: theme.colors.border,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
        backgroundColor: theme.colors.white,
    },
    priorityLabel: {
        fontSize: 13,
        color: theme.colors.textSecondary,
        fontWeight: '700',
    },
    createBtnWrapper: {
        marginTop: 10,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    createBtn: {
        height: 64,
        borderRadius: 22,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    createBtnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '900',
    },
});
