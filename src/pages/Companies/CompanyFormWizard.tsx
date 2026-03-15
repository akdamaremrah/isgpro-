import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MIcon from '../../components/MIcon';
import { IMaskInput } from 'react-imask';
import styles from './CompanyFormWizard.module.css';
import { queryClient } from '../../api/queryClient';
import { API_BASE } from '../../config/api';

import turkeyLocations from '../../data/turkeyLocations.json';
import naceCodes from '../../data/naceCodes.json';

const CompanyFormWizard: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEditMode = Boolean(id);
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 3;

    const [formData, setFormData] = useState({
        official_title: '',
        tehlikeSinifi: 'Tehlikeli',
        sgk_no: '',
        nace_code_id: 1,
        city_id: 34,
        district_id: 1,
        address: '',
        employer_name: '',
        employer_role: '',
        employer_phone: '',
        employer_email: '',
        authorized_person: '',
        authorized_role: '',
        authorized_phone: '',
        authorized_email: '',
    });

    const [filteredNace, setFilteredNace] = useState(naceCodes.slice(0, 5));
    const [naceSearchQuery, setNaceSearchQuery] = useState('');
    const [selectedNace, setSelectedNace] = useState(naceCodes[0]);
    const [showNaceDropdown, setShowNaceDropdown] = useState(false);

    const handleNaceSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value;
        // Sadece rakam ve nokta içeriyorsa otomatik maskele (örn: 412002 -> 41.20.02)
        if (/^[\d.]+$/.test(val)) {
            let nums = val.replace(/\./g, '');
            let formatted = '';
            if (nums.length > 0) formatted += nums.slice(0, 2);
            if (nums.length > 2) formatted += '.' + nums.slice(2, 4);
            if (nums.length > 4) formatted += '.' + nums.slice(4, 6);
            val = formatted;
        }
        setNaceSearchQuery(val);
        setShowNaceDropdown(true);
    };

    // Filter NACE on query change
    useEffect(() => {
        if (!naceSearchQuery.trim()) {
            setFilteredNace(naceCodes.slice(0, 5));
        } else {
            const query = naceSearchQuery.toLowerCase();
            const filtered = naceCodes.filter(n => n.code.includes(query) || n.description.toLowerCase().includes(query));
            setFilteredNace(filtered.slice(0, 50));
        }
    }, [naceSearchQuery]);

    const activeCity = turkeyLocations.find(c => c.id === formData.city_id);
    const availableDistricts = activeCity ? activeCity.districts : [];

    useEffect(() => {
        if (isEditMode && id) {
            const fetchCompany = async () => {
                try {
                    const res = await fetch(`${API_BASE}/api/companies/${id}`);
                    if (res.ok) {
                        const data = await res.json();
                        setFormData({
                            official_title: data.official_title || '',
                            tehlikeSinifi: data.tehlikeSinifi || 'Tehlikeli',
                            sgk_no: data.sgk_no || '',
                            nace_code_id: data.nace_code_id || 1,
                            city_id: data.city_id || 34,
                            district_id: data.district_id || 1,
                            address: data.address || '',
                            employer_name: data.employer_name || '',
                            employer_role: data.employer_role || '',
                            employer_phone: data.employer_phone || '',
                            employer_email: data.employer_email || '',
                            authorized_person: data.authorized_person || '',
                            authorized_role: data.authorized_role || '',
                            authorized_phone: data.authorized_phone || '',
                            authorized_email: data.authorized_email || '',
                        });
                        const found = naceCodes.find(n => n.id === (data.nace_code_id || 1));
                        if (found) setSelectedNace(found);
                    }
                } catch (error) {
                    console.error('Error fetching company for edit', error);
                }
            };
            fetchCompany();
        }
    }, [id, isEditMode]);

    const nextStep = () => {
        if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = isEditMode ? `${API_BASE}/api/companies/${id}` : `${API_BASE}/api/companies`;
            const method = isEditMode ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                queryClient.invalidateQueries({ queryKey: ['companies'] });
                if (isEditMode && id) {
                    queryClient.invalidateQueries({ queryKey: ['companies', id] });
                }
                alert(isEditMode ? 'Firma başarıyla güncellendi!' : 'Firma başarıyla eklendi!');
                navigate('/companies');
            } else {
                alert('Kaydetme sırasında bir hata oluştu.');
            }
        } catch (error) {
            console.error('Save error', error);
            alert('Sunucu hatası. Lütfen konsolu kontrol edin.');
        }
    };

    return (
        <div className={styles.container}>
            <button className={styles.backBtn} onClick={() => navigate('/companies')}>
                <MIcon name="arrow_back" size={16} /> Geri Dön
            </button>

            <div className={styles.formCard}>
                <div className={styles.wizardHeader}>
                    <h2 className={styles.title}>{isEditMode ? 'Firmayı Düzenle' : 'Yeni Firma Ekle'}</h2>
                    <p className={styles.subtitle}>Firmanın temel bilgilerini, lokasyonunu ve iletişim bilgilerini girin.</p>
                </div>

                <div className={styles.stepperContainer}>
                    {[
                        { step: 1, label: 'Temel Bilgiler', icon: <MIcon name="apartment" size={18} /> },
                        { step: 2, label: 'Lokasyon', icon: <MIcon name="location_on" size={18} /> },
                        { step: 3, label: 'İletişim', icon: <MIcon name="call" size={18} /> }
                    ].map((s, index) => (
                        <React.Fragment key={s.step}>
                            <div className={`${styles.stepIndicator} ${currentStep >= s.step ? styles.stepActive : ''}`}>
                                <div className={styles.stepCircle}>{s.icon}</div>
                                <span className={styles.stepLabel}>{s.label}</span>
                            </div>
                            {index < 2 && <div className={`${styles.stepLine} ${currentStep > s.step ? styles.lineActive : ''}`} />}
                        </React.Fragment>
                    ))}
                </div>

                <form className={styles.formBody} onSubmit={(e) => e.preventDefault()}>
                    {currentStep === 1 && (
                        <div className={styles.stepContent}>
                            <div className={styles.formGroup}>
                                <label>Firma Unvanı *</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    placeholder="Örn: Akdağ İnşaat A.Ş."
                                    value={formData.official_title}
                                    onChange={(e) => setFormData({ ...formData, official_title: e.target.value })}
                                    required
                                />
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>SGK Sicil No *</label>
                                    <IMaskInput
                                        mask="0.0000.00.00.0000000.000.00.00.000"
                                        radix="."
                                        value={formData.sgk_no}
                                        unmask={false} // true returns string without mask
                                        onAccept={(value) => setFormData({ ...formData, sgk_no: value })}
                                        placeholder="_.____.__.__._______.+__.__.__.___"
                                        className={styles.input}
                                        required
                                    />
                                    <small className={styles.helpText}>SGK formatında tam 26 rakam</small>
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Tehlike Sınıfı</label>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        value={formData.tehlikeSinifi}
                                        readOnly
                                        style={{ backgroundColor: 'var(--bg-main)', cursor: 'default' }}
                                    />
                                    <small className={styles.helpText}>NACE koduna göre otomatik belirlenir</small>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label>NACE Kodu / Tanımı</label>
                                <div className={styles.searchWrapper} style={{ position: 'relative' }}>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        placeholder="Örn: 41.20.02 veya 'İnşaat' yazarak arayın"
                                        value={naceSearchQuery}
                                        onChange={handleNaceSearchChange}
                                        onFocus={() => setShowNaceDropdown(true)}
                                    />
                                    {showNaceDropdown && (
                                        <div className={styles.searchDropdown} style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--bg-surface)', border: '1px solid var(--border-light)', zIndex: 10, maxHeight: '200px', overflowY: 'auto' }}>
                                            {filteredNace.map(nace => (
                                                <div
                                                    key={nace.id}
                                                    style={{ padding: '0.5rem', cursor: 'pointer', borderBottom: '1px solid var(--border-light)' }}
                                                    onClick={() => {
                                                        setSelectedNace(nace);
                                                        setFormData({ ...formData, nace_code_id: nace.id, tehlikeSinifi: (nace as any).danger_class || 'Tehlikeli' });
                                                        setShowNaceDropdown(false);
                                                        setNaceSearchQuery('');
                                                    }}
                                                >
                                                    <strong>{nace.code}</strong> - {nace.description}
                                                    <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: (nace as any).danger_class === 'Çok Tehlikeli' ? '#dc2626' : (nace as any).danger_class === 'Az Tehlikeli' ? '#16a34a' : '#f59e0b', fontWeight: 600 }}>
                                                        ({(nace as any).danger_class})
                                                    </span>
                                                </div>
                                            ))}
                                            {filteredNace.length === 0 && <div style={{ padding: '0.5rem', color: 'var(--text-muted)' }}>Bulunamadı.</div>}
                                        </div>
                                    )}
                                </div>

                                {selectedNace && (
                                    <div className={styles.naceSelectedBox} style={{ marginTop: '0.5rem', padding: '0.75rem', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }}>
                                        <strong>{selectedNace.code}</strong> - {selectedNace.description}
                                        <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: (selectedNace as any).danger_class === 'Çok Tehlikeli' ? '#dc2626' : (selectedNace as any).danger_class === 'Az Tehlikeli' ? '#16a34a' : '#f59e0b', fontWeight: 600 }}>
                                            ({(selectedNace as any).danger_class})
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className={styles.stepContent}>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>İl *</label>
                                    <select
                                        className={styles.select}
                                        value={formData.city_id}
                                        onChange={(e) => setFormData({ ...formData, city_id: parseInt(e.target.value), district_id: 0 })}
                                        required
                                    >
                                        <option value="">İl Seçiniz</option>
                                        {turkeyLocations.map(city => (
                                            <option key={city.id} value={city.id}>{city.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label>İlçe *</label>
                                    <select
                                        className={styles.select}
                                        value={formData.district_id}
                                        onChange={(e) => setFormData({ ...formData, district_id: parseInt(e.target.value) })}
                                        required
                                        disabled={!formData.city_id}
                                    >
                                        <option value="0">İlçe Seçiniz</option>
                                        {availableDistricts.map(dist => (
                                            <option key={dist.id} value={dist.id}>{dist.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Açık Adres</label>
                                <textarea
                                    className={styles.textarea}
                                    rows={4}
                                    placeholder="Mahalle, Sokak, No, Daire..."
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                ></textarea>
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className={styles.stepContent}>
                            <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)', fontSize: '1.1rem' }}>İşveren / İşveren Vekili Bilgileri</h3>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Adı Soyadı</label>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        value={formData.employer_name}
                                        onChange={(e) => setFormData({ ...formData, employer_name: e.target.value })}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Firmadaki Görevi</label>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        value={formData.employer_role}
                                        onChange={(e) => setFormData({ ...formData, employer_role: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>GSM No</label>
                                    <IMaskInput
                                        mask="0(000) 000 00 00"
                                        placeholder="0(5XX) XXX XX XX"
                                        className={styles.input}
                                        value={formData.employer_phone}
                                        unmask={false}
                                        onAccept={(value) => setFormData({ ...formData, employer_phone: value })}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>E-Posta</label>
                                    <input
                                        type="email"
                                        className={styles.input}
                                        placeholder="isveren@firma.com"
                                        value={formData.employer_email}
                                        onChange={(e) => setFormData({ ...formData, employer_email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <hr style={{ margin: '1.5rem 0', borderColor: 'var(--border-light)' }} />

                            <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)', fontSize: '1.1rem' }}>Yetkili Personel Bilgileri</h3>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Adı Soyadı</label>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        value={formData.authorized_person}
                                        onChange={(e) => setFormData({ ...formData, authorized_person: e.target.value })}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Firmadaki Görevi</label>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        value={formData.authorized_role}
                                        onChange={(e) => setFormData({ ...formData, authorized_role: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>GSM No</label>
                                    <IMaskInput
                                        mask="0(000) 000 00 00"
                                        placeholder="0(5XX) XXX XX XX"
                                        className={styles.input}
                                        value={formData.authorized_phone}
                                        unmask={false}
                                        onAccept={(value) => setFormData({ ...formData, authorized_phone: value })}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>E-Posta</label>
                                    <input
                                        type="email"
                                        className={styles.input}
                                        placeholder="yetkili@firma.com"
                                        value={formData.authorized_email}
                                        onChange={(e) => setFormData({ ...formData, authorized_email: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className={styles.formActions}>
                        <button
                            type="button"
                            className={styles.btnSecondary}
                            onClick={prevStep}
                            disabled={currentStep === 1}
                        >
                            Önceki
                        </button>

                        {currentStep < totalSteps ? (
                            <button type="button" className={styles.btnPrimary} onClick={nextStep}>
                                Sonraki Adım <MIcon name="chevron_right" size={16} />
                            </button>
                        ) : (
                            <button type="button" className={styles.btnSuccess} onClick={handleSubmit}>
                                <MIcon name="save" size={16} /> {isEditMode ? 'Değişiklikleri Kaydet' : 'Tamam (Kaydet)'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CompanyFormWizard;
