'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import Navbar from '@/components/Navbar';
import TaskModal from '@/components/TaskModal';
import { Task, TasksResponse } from '@/types/task';
import {
    Plus,
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Calendar,
    Clock,
    Trash2,
    Edit2,
    CheckCircle,
    Circle
} from 'lucide-react';
import toast from 'react-hot-toast';
import styles from './dashboard.module.css';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();

    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1, total: 0 });

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    // Filters
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [priority, setPriority] = useState('');

    const fetchTasks = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const response = await api.get<TasksResponse>('/tasks', {
                params: {
                    page,
                    limit: 8,
                    search,
                    status: status || undefined,
                    priority: priority || undefined,
                }
            });
            setTasks(response.data.tasks);
            setPagination(response.data.pagination);
        } catch (error) {
            toast.error('Failed to fetch tasks');
        } finally {
            setLoading(false);
        }
    }, [search, status, priority]);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (user) {
            const delayDebounceFn = setTimeout(() => {
                fetchTasks(1);
            }, 500);
            return () => clearTimeout(delayDebounceFn);
        }
    }, [fetchTasks, user]);

    const toggleTaskStatus = async (task: Task) => {
        const nextStatus = task.status === 'DONE' ? 'TODO' : 'DONE';
        try {
            await api.patch(`/tasks/${task.id}`, { status: nextStatus });
            setTasks(tasks.map(t => t.id === task.id ? { ...t, status: nextStatus } : t));
            toast.success(`Task marked as ${nextStatus.toLowerCase()}`);
        } catch (error) {
            toast.error('Failed to update task');
        }
    };

    const deleteTask = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;
        try {
            await api.delete(`/tasks/${id}`);
            setTasks(tasks.filter(t => t.id !== id));
            toast.success('Task deleted successfully');
        } catch (error) {
            toast.error('Failed to delete task');
        }
    };

    if (authLoading || !user) {
        return (
            <div className={styles.loadingScreen}>
                <Loader2 className={styles.spinner} size={48} />
            </div>
        );
    }

    return (
        <div className={styles.main}>
            <Navbar />

            <main className={styles.container}>
                <header className={styles.header}>
                    <div className={styles.headerLeft}>
                        <h1>My Tasks</h1>
                        <p style={{ marginTop: '10px' }}>You have {pagination.total} tasks remaining</p>
                    </div>
                    <button className={styles.addBtn} onClick={() => { setSelectedTask(null); setIsModalOpen(true); }}>
                        <Plus size={20} />
                        <span>Add New Task</span>
                    </button>
                </header>

                <section className={styles.controls}>
                    <div className={`${styles.searchBox} glass`}>
                        <Search size={18} className={styles.icon} />
                        <input
                            type="text"
                            placeholder="Search tasks by title..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className={styles.filters}>
                        <div className={styles.selectWrapper}>
                            <Filter size={16} className={styles.selectIcon} />
                            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option value="">All Statuses</option>
                                <option value="TODO">To Do</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="DONE">Done</option>
                            </select>
                        </div>

                        <div className={styles.selectWrapper}>
                            <Filter size={16} className={styles.selectIcon} />
                            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                                <option value="">All Priorities</option>
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                            </select>
                        </div>
                    </div>
                </section>

                <div className={styles.taskList}>
                    {loading ? (
                        <div className={styles.listLoader}>
                            <Loader2 className={styles.spinner} size={32} />
                            <p>Loading tasks...</p>
                        </div>
                    ) : tasks.length > 0 ? (
                        <div className={styles.grid}>
                            <AnimatePresence mode='popLayout'>
                                {tasks.map((task) => (
                                    <motion.div
                                        key={task.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className={`${styles.taskCard} glass`}
                                    >
                                        <div className={styles.cardHeader}>
                                            <button
                                                className={`${styles.statusToggle} ${task.status === 'DONE' ? styles.done : ''}`}
                                                onClick={() => toggleTaskStatus(task)}
                                            >
                                                {task.status === 'DONE' ? <CheckCircle size={22} /> : <Circle size={22} />}
                                            </button>
                                            <div className={styles.cardActions}>
                                                <button className={styles.actionBtn} onClick={() => { setSelectedTask(task); setIsModalOpen(true); }}>
                                                    <Edit2 size={16} />
                                                </button>
                                                <button className={`${styles.actionBtn} ${styles.delete}`} onClick={() => deleteTask(task.id)}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className={styles.cardContent}>
                                            <h3 className={task.status === 'DONE' ? styles.strikethrough : ''}>{task.title}</h3>
                                            <p>{task.description || 'No description provided.'}</p>
                                        </div>

                                        <div className={styles.cardFooter}>
                                            <div className={`${styles.priorityBadge} ${styles[task.priority.toLowerCase()]}`}>
                                                {task.priority}
                                            </div>
                                            {task.dueDate && (
                                                <div className={styles.dueDate}>
                                                    <Calendar size={14} />
                                                    <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}>
                                <Clock size={48} />
                            </div>
                            <h3>No tasks found</h3>
                            <p>Try adjusting your search or filters to find what you're looking for.</p>
                        </div>
                    )}
                </div>

                {pagination.totalPages > 1 && (
                    <div className={styles.pagination}>
                        <button
                            disabled={pagination.page === 1}
                            onClick={() => fetchTasks(pagination.page - 1)}
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <span>Page {pagination.page} of {pagination.totalPages}</span>
                        <button
                            disabled={pagination.page === pagination.totalPages}
                            onClick={() => fetchTasks(pagination.page + 1)}
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </main>

            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => fetchTasks(pagination.page)}
                task={selectedTask}
            />
        </div>
    );
}
