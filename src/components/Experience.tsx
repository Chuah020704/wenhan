import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SectionReveal from './SectionReveal';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface Job {
  role: string;
  company: string;
  period: string;
  description: string;
  highlights?: string[];
}

export default function Experience() {
  const { t } = useTranslation();
  const jobs = t('experience.jobs', { returnObjects: true }) as Job[];
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const scope = root.current;
      if (!scope) return;
      gsap.fromTo(
        scope.querySelector('.timeline-progress'),
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: scope, start: 'top 70%', end: 'bottom 60%', scrub: 0.6 },
        },
      );
      gsap.utils.toArray<HTMLElement>('.timeline-item').forEach((item) => {
        gsap.fromTo(
          item,
          { opacity: 0, x: -24 },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: { trigger: item, start: 'top 82%', once: true },
          },
        );
        gsap.fromTo(
          item.querySelector('.timeline-dot'),
          { scale: 0 },
          {
            scale: 1,
            duration: 0.5,
            ease: 'back.out(2.5)',
            scrollTrigger: { trigger: item, start: 'top 82%', once: true },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <SectionReveal id="experience">
      <p className="mono section-eyebrow">// experience</p>
      <h2 className="section-title">{t('experience.title')}</h2>
      <div ref={root} className="timeline">
        <div className="timeline-track" aria-hidden="true">
          <div className="timeline-progress" />
        </div>
        {jobs.map((job, i) => (
          <article key={i} className="timeline-item">
            <span className="timeline-dot" aria-hidden="true" />
            <div className="glass-card timeline-card">
              <div className="timeline-head">
                <strong>{job.role}</strong>
                <span className="mono timeline-period">{job.period}</span>
              </div>
              <div className="timeline-company">{job.company}</div>
              <p className="timeline-desc">{job.description}</p>
              {job.highlights && (
                <ul className="timeline-highlights">
                  {job.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              )}
            </div>
          </article>
        ))}
      </div>
    </SectionReveal>
  );
}
