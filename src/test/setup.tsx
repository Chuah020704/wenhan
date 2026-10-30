import '@testing-library/jest-dom';

// jsdom doesn't implement IntersectionObserver, which Framer Motion's
// `whileInView` relies on. Provide a minimal stub for the test environment.
class IntersectionObserverStub {
  readonly root = null;
  readonly rootMargin = '';
  readonly thresholds: ReadonlyArray<number> = [];
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

Object.defineProperty(globalThis, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserverStub,
});
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserverStub,
});

// jsdom doesn't implement window.matchMedia — provide a minimal stub.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  configurable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// jsdom doesn't implement ResizeObserver — provide a minimal stub.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: ResizeObserverStub,
});

// jsdom has no WebGL — stub the Three.js scenes and smooth-scroll hook.
vi.mock('../components/three/KeyboardScene', () => ({
  default: () => <div data-testid="keyboard-scene-mock" />,
}));
vi.mock('../components/three/Starfield', () => ({
  default: () => <div data-testid="starfield-mock" />,
}));
vi.mock('../hooks/useSmoothScroll', () => ({ default: () => {} }));

// Node ≥ 22 exposes an experimental global `localStorage` that is `undefined`
// unless --localstorage-file is passed, shadowing jsdom's implementation.
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map<string, string>();
  const memoryStorage: Storage = {
    get length() {
      return store.size;
    },
    clear: () => store.clear(),
    getItem: (k) => (store.has(k) ? store.get(k)! : null),
    key: (i) => Array.from(store.keys())[i] ?? null,
    removeItem: (k) => void store.delete(k),
    setItem: (k, v) => void store.set(k, String(v)),
  };
  Object.defineProperty(globalThis, 'localStorage', {
    value: memoryStorage,
    configurable: true,
    writable: true,
  });
}
