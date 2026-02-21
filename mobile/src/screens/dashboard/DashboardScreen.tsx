import React, { useState, useCallback, useMemo } from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    TextInput,
    RefreshControl,
    StatusBar,
    Alert,
    ActivityIndicator,
    Dimensions,
    Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import {
    Plus,
    Search,
    LogOut,
    CheckCircle,
    Circle,
    Trash2,
    Clock,
    Filter,
    Calendar,
    Layers,
    Layout,
    Star,
    Zap,
    ChevronRight
} from 'lucide-react-native';
import { theme } from '../../theme/theme';

const { width, height } = Dimensions.get('window');

export default function DashboardScreen({ navigation }: any) {
    const { user, logout } = useAuth();
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState('');

    const fetchTasks = async () => {
        try {
            const response = await api.get('/tasks', {
                params: { search }
            });
            setTasks(response.data.tasks || []);
        } catch (error) {
            console.error('Fetch tasks error', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchTasks();
        }, [search])
    );

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchTasks();
    }, [search]);

    const toggleTaskStatus = async (task: any) => {
        const nextStatus = task.status === 'DONE' ? 'TODO' : 'DONE';
        try {
            await api.patch(`/tasks/${task.id}`, { status: nextStatus });
            setTasks(tasks.map(t => t.id === task.id ? { ...t, status: nextStatus } : t));
        } catch (error) {
            Alert.alert('Error', 'Failed to update task');
        }
    };

    const deleteTask = async (id: number) => {
        Alert.alert(
            'Delete Task',
            'This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await api.delete(`/tasks/${id}`);
                            setTasks(tasks.filter(t => t.id !== id));
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete task');
                        }
                    }
                }
            ]
        );
    };

    const completedCount = useMemo(() => tasks.filter(t => t.status === 'DONE').length, [tasks]);
    const totalCount = tasks.length;
    const progress = totalCount > 0 ? (completedCount / totalCount) : 0;

    const renderItem = ({ item }: { item: any }) => {
        const isDone = item.status === 'DONE';
        const priorityInfo = item.priority === 'HIGH' ? { color: theme.colors.error, label: 'High' } :
            item.priority === 'MEDIUM' ? { color: theme.colors.warning, label: 'Medium' } :
                { color: theme.colors.primary, label: 'Low' };

        return (
            <TouchableOpacity
                style={styles.taskCard}
                activeOpacity={0.9}
                onPress={() => toggleTaskStatus(item)}
            >
                <View style={[styles.taskPriorityBar, { backgroundColor: priorityInfo.color }]} />
                <View style={styles.taskInner}>
                    <TouchableOpacity
                        style={styles.checker}
                        onPress={() => toggleTaskStatus(item)}
                    >
                        {isDone ? (
                            <View style={[styles.checkedBox, { backgroundColor: theme.colors.secondary }]}>
                                <CheckCircle color="#fff" size={18} />
                            </View>
                        ) : (
                            <View style={styles.unCheckedBox} />
                        )}
                    </TouchableOpacity>

                    <View style={styles.taskTextContent}>
                        <Text style={[styles.taskTitle, isDone && styles.taskTitleDone]} numberOfLines={1}>
                            {item.title}
                        </Text>
                        <View style={styles.taskMetaRow}>
                            <View style={styles.badge}>
                                <Zap size={10} color={priorityInfo.color} fill={priorityInfo.color} />
                                <Text style={[styles.badgeText, { color: priorityInfo.color }]}>{priorityInfo.label}</Text>
                            </View>
                            {item.description ? (
                                <Text style={styles.taskSubtitle} numberOfLines={1}>
                                    • {item.description}
                                </Text>
                            ) : null}
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.itemDeleteBtn}
                        onPress={() => deleteTask(item.id)}
                    >
                        <Trash2 color={theme.colors.textMuted} size={18} />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Background Decorative Elements */}
            <View style={styles.bgCircle1} />
            <View style={styles.bgCircle2} />

            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.greeting}>Daily Focus</Text>
                            <Text style={styles.subGreeting}>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                            <TouchableOpacity style={styles.addIconBtn} onPress={() => navigation.navigate('AddTask')}>
                                <Plus color={theme.colors.primary} size={24} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.profileBtn} onPress={logout}>
                                <View style={styles.profilePlaceholder}>
                                    <Text style={styles.profileInitial}>{user?.name?.charAt(0)}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Hero Progress Card */}
                    <View style={styles.heroContainer}>
                        <LinearGradient
                            colors={[theme.colors.primaryDark, theme.colors.primary]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.heroCard}
                        >
                            <View style={styles.heroContent}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.heroTitle}>Your productivity is on fire! 🔥</Text>
                                    <Text style={styles.heroSub}>You've completed {completedCount}/{totalCount} tasks today.</Text>

                                    <View style={styles.progressBarContainer}>
                                        <View style={styles.progressBarBg}>
                                            <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
                                        </View>
                                        <Text style={styles.progressLabel}>{Math.round(progress * 100)}%</Text>
                                    </View>
                                </View>
                                <View style={styles.heroIconContainer}>
                                    <Star color="#fff" size={40} fill="#fff" opacity={0.3} />
                                </View>
                            </View>
                        </LinearGradient>
                    </View>

                    {/* Search & Filter */}
                    <View style={styles.actionRow}>
                        <View style={styles.searchBar}>
                            <Search color={theme.colors.textMuted} size={20} />
                            <TextInput
                                placeholder="Search tasks..."
                                placeholderTextColor={theme.colors.textMuted}
                                style={styles.searchInput}
                                value={search}
                                onChangeText={setSearch}
                            />
                        </View>
                        <TouchableOpacity style={styles.filterBtn}>
                            <Filter color={theme.colors.text} size={20} />
                        </TouchableOpacity>
                    </View>

                    {/* Task List Section */}
                    <View style={styles.listHeader}>
                        <Text style={styles.sectionTitle}>Tasks</Text>
                        <Text style={styles.sectionCount}>{tasks.length} remaining</Text>
                    </View>

                    {loading && !refreshing ? (
                        <View style={styles.loader}>
                            <ActivityIndicator size="large" color={theme.colors.primary} />
                        </View>
                    ) : (
                        <FlatList
                            data={tasks}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id.toString()}
                            contentContainerStyle={styles.listContent}
                            showsVerticalScrollIndicator={false}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}
                                    tintColor={theme.colors.primary}
                                />
                            }
                            ListEmptyComponent={
                                <View style={styles.emptyContainer}>
                                    <Image
                                        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/6194/6194029.png' }}
                                        style={styles.emptyImg}
                                    />
                                    <Text style={styles.emptyTitle}>Nothing to do?</Text>
                                    <Text style={styles.emptySub}>Add a new task to stay productive!</Text>
                                </View>
                            }
                        />
                    )}
                    {/* Bottom Navigation / Floating Action Button */}
                    <TouchableOpacity
                        style={styles.fab}
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate('AddTask')}
                    >
                        <LinearGradient
                            colors={[theme.colors.accent, '#fb7185']}
                            style={styles.fabGradient}
                        >
                            <Plus color="#fff" size={32} />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
    },
    bgCircle1: {
        position: 'absolute',
        top: -100,
        right: -100,
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: theme.colors.primary + '08',
    },
    bgCircle2: {
        position: 'absolute',
        bottom: 50,
        left: -150,
        width: 400,
        height: 400,
        borderRadius: 200,
        backgroundColor: theme.colors.violet + '05',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 10,
        marginBottom: 20,
    },
    greeting: {
        fontSize: 28,
        fontWeight: '900',
        color: theme.colors.text,
        letterSpacing: -1,
    },
    subGreeting: {
        fontSize: 14,
        fontWeight: '700',
        color: theme.colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    profileBtn: {
        shadowColor: theme.colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    addIconBtn: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: theme.colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    profilePlaceholder: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: theme.colors.surfaceDark,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    profileInitial: {
        fontSize: 18,
        fontWeight: '800',
        color: theme.colors.primary,
    },
    heroContainer: {
        paddingHorizontal: 24,
        marginBottom: 24,
    },
    heroCard: {
        borderRadius: 32,
        padding: 24,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.2,
        shadowRadius: 25,
        elevation: 15,
    },
    heroContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    heroTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#fff',
        marginBottom: 4,
    },
    heroSub: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        fontWeight: '600',
        marginBottom: 20,
    },
    progressBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    progressBarBg: {
        flex: 1,
        height: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#fff',
        borderRadius: 4,
    },
    progressLabel: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 14,
    },
    heroIconContainer: {
        marginLeft: 10,
    },
    actionRow: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        gap: 12,
        marginBottom: 28,
    },
    searchBar: {
        flex: 1,
        height: 56,
        backgroundColor: theme.colors.surface,
        borderRadius: 18,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        gap: 12,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.text,
    },
    filterBtn: {
        width: 56,
        height: 56,
        backgroundColor: theme.colors.surface,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        paddingHorizontal: 24,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: theme.colors.text,
        letterSpacing: -0.5,
    },
    sectionCount: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.textSecondary,
    },
    listContent: {
        paddingHorizontal: 24,
        paddingBottom: 110,
    },
    taskCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        marginBottom: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: theme.colors.border,
        shadowColor: theme.colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    taskPriorityBar: {
        height: 4,
        width: '100%',
    },
    taskInner: {
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    checker: {
        width: 28,
        height: 28,
    },
    checkedBox: {
        width: 28,
        height: 28,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    unCheckedBox: {
        width: 28,
        height: 28,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: theme.colors.border,
    },
    taskTextContent: {
        flex: 1,
    },
    taskTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: theme.colors.text,
        marginBottom: 4,
    },
    taskTitleDone: {
        textDecorationLine: 'line-through',
        color: theme.colors.textMuted,
    },
    taskMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    taskSubtitle: {
        fontSize: 13,
        color: theme.colors.textSecondary,
        fontWeight: '500',
        flex: 1,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        backgroundColor: theme.colors.surfaceDark,
        gap: 4,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    itemDeleteBtn: {
        padding: 8,
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        alignSelf: 'center',
        shadowColor: theme.colors.accent,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    fabGradient: {
        width: 72,
        height: 72,
        borderRadius: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyImg: {
        width: 120,
        height: 120,
        marginBottom: 20,
        opacity: 0.8,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: theme.colors.text,
    },
    emptySub: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        marginTop: 4,
    },
});
