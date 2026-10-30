import { lazy, Suspense } from 'react';
import ThemeProvider from './theme/ThemeProvider';
import Nav from './components/Nav';
import Hero from './components/Hero';
import About from './components/About';
import Expertise from './components/Expertise';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import useSmoothScroll from './hooks/useSmoothScroll';

const Starfield = lazy(() => import('./components/three/Starfield'));

export default function App() {
  useSmoothScroll();
  return (
    <ThemeProvider>
      <Suspense fallback={null}>
        <Starfield />
      </Suspense>
      <Nav />
      <main>
        <Hero />
        <About />
        <Expertise />
        <Experience />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </ThemeProvider>
  );
}
