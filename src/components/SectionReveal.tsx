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
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{ maxWidth: 960, margin: '0 auto', padding: '80px 24px' }}
    >
      {children}
    </motion.section>
  );
}
