export type KeyCategory = 'ai' | 'infra' | 'data' | 'lang' | 'tools';

export interface KeyDef {
  /** Short label printed on the keycap */
  label: string;
  /** Full skill name shown in the tooltip */
  title: string;
  category: KeyCategory;
  /** Width in key units (1u = standard key) */
  width?: number;
}

export const CATEGORY_COLORS: Record<KeyCategory, string> = {
  ai: '#a78bfa',
  infra: '#22d3ee',
  data: '#34d399',
  lang: '#f472b6',
  tools: '#fbbf24',
};

/**
 * A 60%-style layout. Each row is laid out left-to-right; the
 * optional `width` lets wider keys (Tab, Shift, Space…) hold the
 * headline skills.
 */
export const KEYBOARD_ROWS: KeyDef[][] = [
  [
    { label: 'LLM', title: 'LLM Applications', category: 'ai' },
    { label: 'RAG', title: 'Retrieval-Augmented Generation', category: 'ai' },
    { label: 'Agent', title: 'Agentic AI / ReAct', category: 'ai' },
    { label: 'MCP', title: 'Model Context Protocol', category: 'ai' },
    { label: 'Tools', title: 'LLM Tool Calling', category: 'ai' },
    { label: 'Eval', title: 'LLM Evaluation & Observability', category: 'ai' },
    { label: 'CV', title: 'Computer Vision', category: 'ai' },
    { label: 'YOLO', title: 'YOLOv8 Detection & Segmentation', category: 'ai' },
    { label: 'OCR', title: 'OCR & Document AI', category: 'ai' },
    { label: 'VLM', title: 'Vision-Language Models (Qwen2.5-VL)', category: 'ai' },
    { label: 'ColPali', title: 'ColPali Multimodal Retrieval', category: 'ai', width: 1.5 },
  ],
  [
    { label: 'PyTorch', title: 'PyTorch', category: 'ai', width: 1.5 },
    { label: 'Azure', title: 'Microsoft Azure', category: 'infra' },
    { label: 'Docker', title: 'Docker', category: 'infra' },
    { label: 'CI/CD', title: 'Git-based CI/CD', category: 'infra' },
    { label: 'Linux', title: 'Linux / SSH Automation', category: 'infra' },
    { label: 'FastAPI', title: 'FastAPI', category: 'infra' },
    { label: 'Flask', title: 'Flask', category: 'infra' },
    { label: 'OAuth', title: 'JWT / OAuth2 Security', category: 'infra' },
    { label: 'REST', title: 'REST API Design', category: 'infra' },
    { label: 'WS', title: 'Realtime / WebSockets', category: 'infra' },
    { label: 'MinIO', title: 'MinIO Object Storage', category: 'infra' },
  ],
  [
    { label: 'pgvector', title: 'PostgreSQL + pgvector', category: 'data', width: 1.75 },
    { label: 'Qdrant', title: 'Qdrant Vector DB', category: 'data' },
    { label: 'HNSW', title: 'HNSW Vector Indexing', category: 'data' },
    { label: 'Mongo', title: 'MongoDB', category: 'data' },
    { label: 'Redis', title: 'Redis', category: 'data' },
    { label: 'SQL', title: 'SQL', category: 'data' },
    { label: 'Hybrid', title: 'Hybrid Search & Reranking', category: 'data' },
    { label: 'ETL', title: 'Data Ingestion Pipelines', category: 'data' },
    { label: 'Embed', title: 'Embeddings', category: 'data' },
    { label: 'Enter', title: 'Ship to Production', category: 'tools', width: 2.25 },
  ],
  [
    { label: 'Python', title: 'Python', category: 'lang', width: 2.25 },
    { label: 'Java', title: 'Java', category: 'lang' },
    { label: 'C++', title: 'C++', category: 'lang' },
    { label: 'TS', title: 'TypeScript', category: 'lang' },
    { label: 'ASM', title: 'Assembly', category: 'lang' },
    { label: 'Bash', title: 'Shell Scripting', category: 'lang' },
    { label: 'Git', title: 'Git', category: 'tools' },
    { label: 'WinDbg', title: 'WinDbg / Kernel Debugging', category: 'tools' },
    { label: 'MATLAB', title: 'MATLAB', category: 'tools' },
    { label: 'Shift', title: 'Dean\u2019s List \u00b7 CGPA 3.90', category: 'tools', width: 2.75 },
  ],
  [
    { label: 'Ctrl', title: 'System Integration', category: 'tools', width: 1.25 },
    { label: 'Alt', title: 'Prompt Engineering', category: 'ai', width: 1.25 },
    {
      label: 'Agentic AI \u00b7 LLM Infra \u00b7 Cloud',
      title: 'End-to-end AI Systems',
      category: 'ai',
      width: 6.25,
    },
    { label: 'Alt', title: 'Human-in-the-loop Safety', category: 'ai', width: 1.25 },
    { label: 'Ctrl', title: 'Automation', category: 'tools', width: 1.25 },
    { label: 'Fn', title: 'Arduino / Embedded', category: 'tools', width: 1.25 },
  ],
];

export const ALL_KEYS: KeyDef[] = KEYBOARD_ROWS.flat();
