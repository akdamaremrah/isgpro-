import React, { useState, useEffect } from 'react';
import MIcon from '../../components/MIcon';
import styles from './UsersConfig.module.css';
import { API_BASE } from '../../config/api';
import { apiFetch } from '../../api/client';

interface UserData {
    id: number;
    full_name: string;
    email: string;
    role: string;
    is_active: boolean;
}

const UsersConfig: React.FC = () => {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
        role: 'İş Güvenliği Uzmanı (A)'
    });

    const fetchUsers = async () => {
        try {
            const res = await apiFetch(`${API_BASE}/api/users`);
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error("Kullanıcılar getirilirken hata:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await apiFetch(`${API_BASE}/api/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                alert('Kullanıcı başarıyla eklendi!');
                setShowModal(false);
                setFormData({ full_name: '', email: '', password: '', role: 'İş Güvenliği Uzmanı (A)' });
                fetchUsers();
            } else {
                alert('Kaydetme hatası!');
            }
        } catch (error) {
            console.error(error);
            alert('Sunucu hatası!');
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Kullanıcıyı silmek istediğinize emin misiniz?')) return;

        try {
            const res = await apiFetch(`${API_BASE}/api/users/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                alert('Kullanıcı silindi.');
                fetchUsers();
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Kullanıcı Yönetimi</h1>
                    <p className={styles.subtitle}>Sisteme erişimi olan İSG personellerini ve yöneticileri yapılandırın.</p>
                </div>
                <button className={styles.addBtn} onClick={() => setShowModal(true)}>
                    <MIcon name="add" size={18} /> Yeni Kullanıcı
                </button>
            </div>

            {loading ? (
                <div className={styles.loading}>Yükleniyor...</div>
            ) : (
                <div className={styles.grid}>
                    {users.map(user => (
                        <div key={user.id} className={styles.userCard}>
                            <div className={styles.cardHeader}>
                                <div className={styles.avatar}>
                                    {user.full_name.charAt(0)}{user.full_name.split(' ')[1]?.[0] || ''}
                                </div>
                                <div className={styles.userInfo}>
                                    <h3>{user.full_name}</h3>
                                    <span className={styles.roleBadge}>
                                        <MIcon name="verified_user" size={14} /> {user.role}
                                    </span>
                                </div>
                                <button className={styles.deleteBtn} onClick={() => handleDelete(user.id)} title="Sil">
                                    <MIcon name="delete" size={18} />
                                </button>
                            </div>
                            <div className={styles.cardBody}>
                                <div className={styles.infoRow}>
                                    <MIcon name="email" size={16} /> <span>{user.email}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h2>Yeni Kullanıcı Ekle</h2>
                            <button className={styles.closeBtn} onClick={() => setShowModal(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit} className={styles.formContainer}>
                            <div className={styles.formGroup}>
                                <label>Ad Soyad *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.full_name}
                                    onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                    placeholder="Örn: Yunus Emre"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>E-Posta Adresi *</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="ornek@firma.com"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Şifre *</label>
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="Sisteme giriş şifresi"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Rol / Yetki *</label>
                                <select
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="İş Güvenliği Uzmanı (A)">İş Güvenliği Uzmanı (A)</option>
                                    <option value="İş Güvenliği Uzmanı (B)">İş Güvenliği Uzmanı (B)</option>
                                    <option value="İş Güvenliği Uzmanı (C)">İş Güvenliği Uzmanı (C)</option>
                                    <option value="İşyeri Hekimi">İşyeri Hekimi</option>
                                    <option value="Sistem Yöneticisi">Sistem Yöneticisi</option>
                                </select>
                            </div>
                            <div className={styles.modalFooter}>
                                <button type="button" onClick={() => setShowModal(false)} className={styles.cancelBtn}>İptal</button>
                                <button type="submit" className={styles.saveBtn}>Kullanıcıyı Ekle</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersConfig;
