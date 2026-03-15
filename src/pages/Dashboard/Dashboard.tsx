import React from 'react';
import { motion } from 'framer-motion';
import MIcon from '../../components/MIcon';
import styles from './Dashboard.module.css';

const Dashboard: React.FC = () => {
    return (
        <div className={styles.loadingContainer}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={styles.comingSoonBox}
            >
                <MIcon name="trending_up" className={styles.loaderIcon} size={64} />
                <h1 className={styles.comingSoonTitle}>YAKINDA</h1>
                <p className={styles.comingSoonText}>
                    İSG Pro+ Dashboard modülü çok yakında yayına girecektir.
                </p>
                <div className={styles.comingSoonBadge}>PREMIUM</div>
            </motion.div>
        </div>
    );
};

export default Dashboard;
