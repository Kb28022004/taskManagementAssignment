'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { LogOut, User, CheckCircle2 } from 'lucide-react';
import styles from './navbar.module.css';

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className={`${styles.navbar} glass`}>
            <div className={styles.container}>
                <div className={styles.logo}>
                    <CheckCircle2 color="var(--primary)" size={28} />
                    <span>TaskFlow</span>
                </div>

                <div className={styles.userSection}>
                    <div className={styles.userInfo}>
                        <div className={styles.avatar}>
                            <User size={18} />
                        </div>
                        <span className={styles.userName}>{user?.name}</span>
                    </div>

                    <button onClick={logout} className={styles.logoutBtn} title="Logout">
                        <LogOut size={20} />
                    </button>
                </div>
            </div>
        </nav>
    );
}
