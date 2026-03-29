import { motion } from 'framer-motion';
import MIcon from '../MIcon';
import styles from './ComingSoon.module.css';

interface Feature {
    icon: string;
    text: string;
}

interface ComingSoonProps {
    icon: string;
    title: string;
    subtitle: string;
    description: string;
    features: Feature[];
    accentColor?: string;
    gradientFrom?: string;
    gradientTo?: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({
    icon,
    title,
    subtitle,
    description,
    features,
    accentColor = '#6366f1',
    gradientFrom = '#6366f1',
    gradientTo = '#8b5cf6',
}) => {
    return (
        <div className={styles.wrapper}>
            {/* Animated background orbs */}
            <div className={styles.orb1} style={{ background: `radial-gradient(circle, ${gradientFrom}22 0%, transparent 70%)` }} />
            <div className={styles.orb2} style={{ background: `radial-gradient(circle, ${gradientTo}18 0%, transparent 70%)` }} />
            <div className={styles.orb3} style={{ background: `radial-gradient(circle, ${gradientFrom}15 0%, transparent 70%)` }} />

            {/* Floating particles */}
            {[...Array(8)].map((_, i) => (
                <div
                    key={i}
                    className={styles.particle}
                    style={{
                        left: `${10 + i * 12}%`,
                        animationDelay: `${i * 0.7}s`,
                        animationDuration: `${4 + (i % 3)}s`,
                        background: i % 2 === 0 ? gradientFrom : gradientTo,
                    }}
                />
            ))}

            {/* Grid lines */}
            <div className={styles.grid} />

            {/* Main card */}
            <motion.div
                className={styles.card}
                initial={{ opacity: 0, y: 32, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
                {/* Premium badge */}
                <motion.div
                    className={styles.badge}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    style={{ borderColor: `${accentColor}40`, color: accentColor }}
                >
                    <span className={styles.badgeDot} style={{ background: accentColor }} />
                    PREMIUM ÖZELLİK
                </motion.div>

                {/* Icon */}
                <motion.div
                    className={styles.iconWrap}
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <div
                        className={styles.iconGlow}
                        style={{ background: `radial-gradient(circle, ${accentColor}35 0%, transparent 70%)` }}
                    />
                    <div
                        className={styles.iconRing}
                        style={{ borderColor: `${accentColor}30` }}
                    />
                    <div
                        className={styles.iconRing2}
                        style={{ borderColor: `${accentColor}18` }}
                    />
                    <div
                        className={styles.iconBox}
                        style={{ background: `linear-gradient(135deg, ${gradientFrom}22 0%, ${gradientTo}15 100%)`, borderColor: `${accentColor}40` }}
                    >
                        <MIcon name={icon} size={48} style={{ color: accentColor }} />
                    </div>
                </motion.div>

                {/* Title */}
                <motion.div
                    className={styles.titleWrap}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <div
                        className={styles.comingSoonLabel}
                        style={{ background: `linear-gradient(90deg, ${gradientFrom}, ${gradientTo}, ${gradientFrom})` }}
                    >
                        YAKINDA
                    </div>
                    <h1 className={styles.title}>{title}</h1>
                    <p className={styles.subtitle}>{subtitle}</p>
                </motion.div>

                {/* Divider */}
                <div
                    className={styles.divider}
                    style={{ background: `linear-gradient(90deg, transparent, ${accentColor}40, transparent)` }}
                />

                {/* Description */}
                <motion.p
                    className={styles.description}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35, duration: 0.5 }}
                >
                    {description}
                </motion.p>

                {/* Feature list */}
                <motion.div
                    className={styles.features}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45, duration: 0.5 }}
                >
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            className={styles.featureItem}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + i * 0.08 }}
                        >
                            <div className={styles.featureIcon} style={{ color: accentColor, background: `${accentColor}15` }}>
                                <MIcon name={f.icon} size={16} />
                            </div>
                            <span>{f.text}</span>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </div>
    );
};

export default ComingSoon;
