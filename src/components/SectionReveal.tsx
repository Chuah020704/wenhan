import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface Props {
  id?: string;
  className?: string;
  children: ReactNode;
}

export default function SectionReveal({ id, className, children }: Props) {
  return (
    <motion.section
      id={id}
      className={className}
      initial={{ opacity: 0, y: 36, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{ maxWidth: 960, margin: '0 auto', padding: '80px 24px' }}
    >
      {children}
    </motion.section>
  );
}
