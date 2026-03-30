import { useState, useEffect, useMemo, useCallback, useRef, Fragment } from 'react';
import { useLanguage } from './i18n/LanguageContext';
import NameSubmitModal, { hasSubmittedCredits } from './components/NameSubmitModal';
import EndCreditsModal from './components/EndCreditsModal';


// Types
interface Task {
  id: string;
  phase: string;
  platform: 'x' | 'instagram' | 'facebook' | 'tiktok' | 'youtube' | 'threads' | 'weibo' | 'red';
  url: string;
  hashtags: string;
  media: string;
  mark: boolean;
}

interface CompletedState {
  [taskId: string]: {
    completedAt: string;
  };
}

// SVG Icons for social platforms
const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644-.07-4.85-.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
  </svg>
);

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const ThreadsIcon = () => (
  <svg viewBox="0 0 192 192" fill="currentColor" className="w-5 h-5">
    <path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.305C133.506 125.625 136.685 117.133 137.997 106.507C143.4 109.607 147.128 113.932 148.697 119.498C151.194 128.404 151.032 141.101 141.208 150.601C132.605 158.926 122.244 162.646 106.064 162.765C88.3396 162.632 74.5494 157.308 65.0463 146.951C56.0809 137.181 51.4292 122.671 51.2403 103.873C51.4292 85.0754 56.0809 70.5653 65.0463 60.7954C74.5494 50.4384 88.3396 45.1138 106.064 44.981C123.925 45.1146 137.936 50.4558 147.5 60.9508L159.19 50.2968C146.856 36.9943 129.815 30.1666 106.112 30.001C88.0218 30.1334 72.336 35.5658 60.5347 46.1069C49.6617 55.7681 43.5026 69.8135 42.7867 86.8346C42.7644 87.3604 42.7534 87.8871 42.7534 88.4142C42.7534 88.9429 42.7644 89.4696 42.7867 89.9953C43.5026 107.016 49.6617 121.062 60.5347 130.723C72.336 141.264 88.0218 146.696 106.112 146.829C106.205 146.829 106.298 146.83 106.391 146.83C124.214 146.83 138.932 141.708 149.157 132.012C161.688 120.088 161.537 104.407 157.76 95.3652C155.231 89.3717 149.459 83.8547 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z" />
  </svg>
);

// Platform configs — muted luxury tones
const platformConfig = {
  x: {
    name: 'X',
    icon: <XIcon />,
    color: 'from-slate-700 to-agtic-charcoal',
    hoverColor: 'hover:from-slate-600 hover:to-agtic-charcoal',
  },
  instagram: {
    name: 'IG',
    icon: <InstagramIcon />,
    color: 'from-rose-400 to-purple-500',
    hoverColor: 'hover:from-rose-300 hover:to-purple-400',
  },
  facebook: {
    name: 'FB',
    icon: <FacebookIcon />,
    color: 'from-blue-500 to-blue-600',
    hoverColor: 'hover:from-blue-400 hover:to-blue-500',
  },
  tiktok: {
    name: 'TT',
    icon: <TikTokIcon />,
    color: 'from-agtic-charcoal to-slate-700',
    hoverColor: 'hover:from-slate-700 hover:to-agtic-charcoal',
  },
  youtube: {
    name: 'YT',
    icon: <YouTubeIcon />,
    color: 'from-red-600 to-red-700',
    hoverColor: 'hover:from-red-500 hover:to-red-600',
  },
  threads: {
    name: 'Threads',
    icon: <ThreadsIcon />,
    color: 'from-zinc-800 to-black',
    hoverColor: 'hover:from-zinc-700 hover:to-zinc-900',
  },
};

// ===========================================
// ⚙️ SETTINGS - แก้ไขตรงนี้
// ===========================================
const SHEETS_CONFIG = [
  { phase: 'all', label: 'All Tasks', gid: '0' },
];
const MSG_SHEETS = {
  COMPOUND: '', // Not using compound logic anymore
  COMPLETE: '264913748'  // Sheet 2: Logic picking a complete sentence
};
// ===========================================

function App() {
  const { language, setLanguage, t } = useLanguage();
  const [allTasks, setAllTasks] = useState<Record<string, Task[]>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [generatedMessage, setGeneratedMessage] = useState<string>('');
  const [copiedType, setCopiedType] = useState<'message' | 'hashtags' | 'both' | null>(null);

  // Positive messages state — organized by language
  const [msgPools, setMsgPools] = useState<Record<string, { p1: string[], p2: string[], complete: string[] }>>({
    en: { p1: [], p2: [], complete: [] },
    th: { p1: [], p2: [], complete: [] }
  });
  const [emojiPool, setEmojiPool] = useState<string[]>([]);
  const [completed, setCompleted] = useState<Record<string, CompletedState>>(() => {
    try {
      const saved = localStorage.getItem('social-tracker-completed-v3');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load saved data:', e);
    }
    return {};
  });

  const [taskFilterPlatform, setTaskFilterPlatform] = useState<string | null>(null);

  // Ref for the main scrollable container
  const mainRef = useRef<HTMLElement>(null);
  
  const [visibleCount, setVisibleCount] = useState(30);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Achievement popup states (Global)
  const [showNameSubmit, setShowNameSubmit] = useState(false);
  const [showEndCredits, setShowEndCredits] = useState(false);
  const [creditsSubmitted, setCreditsSubmitted] = useState(() => hasSubmittedCredits());
  const [showMarkDone, setShowMarkDone] = useState(true);
  const [achievementUnlocked, setAchievementUnlocked] = useState(() => {
    try {
      const saved = localStorage.getItem('social-tracker-achievement-unlocked-v3');
      if (saved) return saved === 'true';
    } catch {
      return false;
    }
    return false;
  });

  const tasks = useMemo(() => {
    return allTasks['all'] || [];
  }, [allTasks]);

  const isTaskCompleted = useCallback((task?: Task) => {
    if (!task) return false;
    return !!(completed[task.phase] && completed[task.phase][task.id]);
  }, [completed]);

  // Create a flat list of all tasks for global calculations
  const totalTasksList = useMemo(() => Object.values(allTasks).flat(), [allTasks]);
  const totalCompletedCount = useMemo(() => {
    let count = 0;
    Object.entries(completed).forEach(([phase, sheetCompleted]) => {
      const sheetTasks = allTasks[phase] || [];
      sheetTasks.forEach(task => {
        if (sheetCompleted[task.id]) count++;
      });
    });
    return count;
  }, [completed, allTasks]);

  // Focus tasks = tasks with mark === true
  const allFocusTasks = useMemo(() => totalTasksList.filter(t => t.mark), [totalTasksList]);
  const allFocusTasksDone = useMemo(() => {
    if (allFocusTasks.length === 0) return false;
    return allFocusTasks.every(task => !!(completed[task.phase] && completed[task.phase][task.id]));
  }, [allFocusTasks, completed]);

  // Auto-show Credits popup when all focus/hot tasks are completed
  useEffect(() => {
    if (loading) return;
    if (allFocusTasks.length === 0) return;
    if (!allFocusTasksDone) return;
    if (creditsSubmitted) return;
    // Small delay so the completion mark animation plays first
    const timer = setTimeout(() => setShowNameSubmit(true), 800);
    return () => clearTimeout(timer);
  }, [allFocusTasksDone, allFocusTasks.length, creditsSubmitted, loading]);

  // Auto-close NameSubmitModal if user unchecks a focus task
  useEffect(() => {
    if (showNameSubmit && !allFocusTasksDone) {
      setShowNameSubmit(false);
    }
  }, [allFocusTasksDone, showNameSubmit]);


  // (Stats logic removed)

  // Mark as loaded after first render
  useEffect(() => {
    setHasLoaded(true);
  }, []);

  // Save completed state to localStorage
  useEffect(() => {
    if (!hasLoaded) return;
    localStorage.setItem('social-tracker-completed-v3', JSON.stringify(completed));
  }, [completed, hasLoaded]);

  // Check for 100% global achievement
  useEffect(() => {
    // Only check if we have loaded all sheets defined in config
    const loadedSheetCount = Object.keys(allTasks).length;
    if (!hasLoaded || loading || loadedSheetCount < SHEETS_CONFIG.length || totalTasksList.length === 0) return;

    // Strict logic: Check every task in every sheet specifically
    const allCompleted = SHEETS_CONFIG.every(sheet => {
      const sheetTasks = allTasks[sheet.phase] || [];
      if (sheetTasks.length === 0) return false;
      const sheetCompleted = completed[sheet.phase] || {};
      return sheetTasks.every(task => !!sheetCompleted[task.id]);
    });

    if (allCompleted && !achievementUnlocked) {
      setAchievementUnlocked(true);
      localStorage.setItem('social-tracker-achievement-unlocked-v3', 'true');
    } else if (!allCompleted && achievementUnlocked) {
      setAchievementUnlocked(false);
      localStorage.setItem('social-tracker-achievement-unlocked-v3', 'false');
    }
  }, [allTasks, totalTasksList, completed, hasLoaded, loading, achievementUnlocked]);

  // Parse entire CSV text handling quoted strings with newlines
  const parseCSV = useCallback((csvText: string): string[][] => {
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentCell = '';
    let inQuotes = false;

    for (let i = 0; i < csvText.length; i++) {
      const char = csvText[i];
      const nextChar = csvText[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Escaped quote ("") - add single quote to cell
          currentCell += '"';
          i++; // Skip next quote
        } else {
          // Toggle quote mode
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        // End of cell
        currentRow.push(currentCell.trim());
        currentCell = '';
      } else if ((char === '\n' || (char === '\r' && nextChar === '\n')) && !inQuotes) {
        // End of row (handle both \n and \r\n)
        currentRow.push(currentCell.trim());
        if (currentRow.some(cell => cell !== '')) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentCell = '';
        if (char === '\r') i++; // Skip \n in \r\n
      } else if (char === '\r' && !inQuotes) {
        // Handle standalone \r as newline
        currentRow.push(currentCell.trim());
        if (currentRow.some(cell => cell !== '')) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentCell = '';
      } else {
        // Regular character (including newlines inside quotes)
        currentCell += char;
      }
    }

    // Don't forget the last cell and row
    currentRow.push(currentCell.trim());
    if (currentRow.some(cell => cell !== '')) {
      rows.push(currentRow);
    }

    return rows;
  }, []);

  // Fetch data from Google Sheets (Fetch all on mount)
  const fetchAllData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const results: Record<string, Task[]> = {};

      await Promise.all(SHEETS_CONFIG.map(async (sheet) => {
        try {
          const url = `/api/sheet?gid=${sheet.gid}`;
          const response = await fetch(url);
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          let csvText = await response.text();

          // Safeguard: Google Sheets might return a 200 OK with HTML for rate limits/errors.
          // This would cause the parser to fail silently and wipe the task list.
          if (csvText.trim().toLowerCase().startsWith('<!doctype html') || csvText.toLowerCase().includes('<html')) {
            throw new Error("Google Sheets returned HTML (Likely Rate Limit/Error Page)");
          }

          csvText = csvText.replace(/^\uFEFF/, '');
          const rows = parseCSV(csvText);

          if (rows.length > 0) {
            const headers = rows[0].map(h => h.toLowerCase().trim());
            const parsedTasks: Task[] = [];
            for (let i = 1; i < rows.length; i++) {
              const values = rows[i];
              const getVal = (headerName: string) => {
                const idx = headers.indexOf(headerName.toLowerCase().trim());
                return idx !== -1 ? (values[idx] || '') : '';
              };

              let rawPlatform = (getVal('platform') || 'x').toLowerCase().trim();
              if (['ig', 'instagram', 'insta'].includes(rawPlatform)) rawPlatform = 'instagram';
              else if (['fb', 'facebook'].includes(rawPlatform)) rawPlatform = 'facebook';
              else if (['tt', 'tiktok'].includes(rawPlatform)) rawPlatform = 'tiktok';
              else if (['yt', 'youtube'].includes(rawPlatform)) rawPlatform = 'youtube';
              else if (['threads', 'thread', 'th'].includes(rawPlatform)) rawPlatform = 'threads';
              else if (['red', 'xiaohongshu'].includes(rawPlatform)) rawPlatform = 'red';
              else if (['wb', 'weibo'].includes(rawPlatform)) rawPlatform = 'weibo';
              else if (!['x', 'instagram', 'facebook', 'tiktok', 'youtube', 'threads', 'red', 'weibo'].includes(rawPlatform)) rawPlatform = 'x';

              const rawMark = getVal('mark').toLowerCase().trim();
              const isMarked = rawMark === '1' || rawMark === 'true' || rawMark === 'yes' || rawMark === 'x' || rawMark === 'สำคัญ';

              const task: Task = {
                id: getVal('id') || getVal('url') || String(i),
                phase: sheet.phase,
                platform: rawPlatform as Task['platform'],
                url: getVal('url') || '',
                hashtags: getVal('hashtags') || getVal('hashtag') || '',
                media: getVal('media') || getVal('title') || getVal('note') || getVal('ชื่อสื่อ') || '',
                mark: isMarked,
              };
              if (task.url) parsedTasks.push(task);
            }
            results[sheet.phase] = parsedTasks.reverse();
          }
        } catch (sheetErr) {
          console.error(`Failed to fetch sheet ${sheet.phase}:`, sheetErr);
        }
      }));

      setAllTasks(results);
      setError(null);
      // Save to localStorage for offline support
      try {
        localStorage.setItem('social-tracker-tasks-cache-v3', JSON.stringify(results));
      } catch { /* quota exceeded, ignore */ }
    } catch (err) {
      // Try loading from offline cache
      try {
        const cached = localStorage.getItem('social-tracker-tasks-cache-v3');
        if (cached) {
          setAllTasks(JSON.parse(cached));
          setError(null);
          console.log('Loaded from offline cache');
        } else {
          setError(t('error'));
        }
      } catch {
        setError(t('error'));
      }
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [parseCSV]);

  // Fetch positive messages from Google Sheets — parse 3 columns independently
  const fetchPositiveMessages = useCallback(async () => {
    try {
      const pools = {
        en: { p1: [] as string[], p2: [] as string[], complete: [] as string[] },
        th: { p1: [] as string[], p2: [] as string[], complete: [] as string[] }
      };
      const poolE: string[] = [];

      // Fetch from both sheets
      await Promise.all([
        // Sheet 1: Compound
        (async () => {
          try {
            const url = `/api/sheet?gid=${MSG_SHEETS.COMPOUND}`;
            const response = await fetch(url);
            if (!response.ok) return;
            let csvText = await response.text();
            csvText = csvText.replace(/^\uFEFF/, '');
            const rows = parseCSV(csvText);
            if (rows.length > 0) {
              const headers = rows[0].map(h => h.toLowerCase().trim());
              const idx1_en = headers.indexOf('message_en_1');
              const idx2_en = headers.indexOf('message_en_2');
              const idx1_th = headers.indexOf('message_th_1');
              const idx2_th = headers.indexOf('message_th_2');
              const idxE = headers.indexOf('emoji');

              for (let i = 1; i < rows.length; i++) {
                if (idx1_en !== -1 && rows[i][idx1_en]) pools.en.p1.push(rows[i][idx1_en].trim());
                if (idx2_en !== -1 && rows[i][idx2_en]) pools.en.p2.push(rows[i][idx2_en].trim());
                if (idx1_th !== -1 && rows[i][idx1_th]) pools.th.p1.push(rows[i][idx1_th].trim());
                if (idx2_th !== -1 && rows[i][idx2_th]) pools.th.p2.push(rows[i][idx2_th].trim());
                if (idxE !== -1 && rows[i][idxE]) poolE.push(rows[i][idxE].trim());
              }
            }
          } catch (e) { console.error('Error fetching Compound messages:', e); }
        })(),
        // Sheet 2: Complete
        (async () => {
          try {
            const url = `/api/sheet?gid=${MSG_SHEETS.COMPLETE}`;
            const response = await fetch(url);
            if (!response.ok) return;
            let csvText = await response.text();
            csvText = csvText.replace(/^\uFEFF/, '');
            const rows = parseCSV(csvText);
            if (rows.length > 0) {
              const headers = rows[0].map(h => h.toLowerCase().trim());
              const idx_en = headers.indexOf('message_en');
              const idx_th = headers.indexOf('message_th');

              for (let i = 1; i < rows.length; i++) {
                if (idx_en !== -1 && rows[i][idx_en]) pools.en.complete.push(rows[i][idx_en].trim());
                if (idx_th !== -1 && rows[i][idx_th]) pools.th.complete.push(rows[i][idx_th].trim());
              }
            }
          } catch (e) { console.error('Error fetching Complete messages:', e); }
        })()
      ]);

      setMsgPools(pools);
      setEmojiPool(poolE);

      try {
        localStorage.setItem('social-tracker-messages-cache-v3', JSON.stringify({ pools, poolE }));
      } catch { /* ignore */ }
    } catch (err) {
      console.error('Failed to fetch positive messages API, attempting to load from cache...', err);
      try {
        const cached = localStorage.getItem('social-tracker-messages-cache-v3');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.pools) setMsgPools(parsed.pools);
          if (parsed.poolE) setEmojiPool(parsed.poolE);
        }
      } catch (cacheErr) {
        console.error('Failed to parse message cache.', cacheErr);
      }
    }
  }, [parseCSV]);

  // Upgrade any old-format cached msgPools (missing 'complete' field) to prevent crashes
  useEffect(() => {
    try {
      const cached = localStorage.getItem('social-tracker-messages-cache-v3');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.pools) {
          const hasOldFormat =
            parsed.pools.en?.complete === undefined ||
            parsed.pools.th?.complete === undefined;
          if (hasOldFormat) {
            // Clear stale cache so fresh fetch runs
            localStorage.removeItem('social-tracker-messages-cache-v3');
          }
        }
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    fetchAllData();
    fetchPositiveMessages();
  }, [fetchAllData, fetchPositiveMessages]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchAllData(true);
        fetchPositiveMessages();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [fetchAllData, fetchPositiveMessages]);

  // Handle automatic scrolling top when Phase changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Filter and sort tasks (Focus first, then maintain original newest-to-oldest order)
  const filteredTasks = useMemo(() => {
    let result = tasks;
    if (taskFilterPlatform) {
      result = result.filter(t => t.platform === taskFilterPlatform);
    }
    const pending = result.filter(t => !isTaskCompleted(t));
    const done = result.filter(t => isTaskCompleted(t));

    // Sort: Marked tasks first
    const sortTasks = (a: Task, b: Task) => {
      if (b.mark !== a.mark) return b.mark ? 1 : -1;
      return 0;
    };

    const sortedPending = [...pending].sort(sortTasks);
    const sortedDone = [...done].sort(sortTasks);
    return [...sortedPending, ...sortedDone];
  }, [tasks, isTaskCompleted, taskFilterPlatform]);

  // Lazy load
  const visibleTasks = useMemo(() => {
    return filteredTasks.slice(0, visibleCount);
  }, [filteredTasks, visibleCount]);

  const pendingCount = tasks.filter(t => !isTaskCompleted(t)).length;


  // Get hashtags for platform
  const getCaption = (task: Task): string => {
    return task.hashtags || '';
  };

  // Generate random positive message — 2-step: pick from each pool, then pick 1 of 4 patterns
  const generateRandomMessage = useCallback(() => {
    const activePool = (msgPools[language]?.p1?.length || msgPools[language]?.complete?.length) ? msgPools[language] : msgPools.en;
    if (!activePool) return;

    const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

    // Decide strategy (50/50 if both available)
    const canCompound = (activePool.p1?.length ?? 0) > 0 && (activePool.p2?.length ?? 0) > 0 && emojiPool.length > 0;
    const canComplete = (activePool.complete?.length ?? 0) > 0;

    let strategy: 'compound' | 'complete' = 'compound';
    if (canCompound && canComplete) {
      strategy = Math.random() > 0.5 ? 'compound' : 'complete';
    } else if (canComplete) {
      strategy = 'complete';
    } else if (!canCompound) {
      return; // Nothing to pick
    }

    if (strategy === 'complete') {
      const sentence = pick(activePool.complete);
      setGeneratedMessage(sentence);
    } else {
      const m1 = pick(activePool.p1);
      const m2 = pick(activePool.p2);
      const em = pick(emojiPool);
      const pattern = Math.floor(Math.random() * 6);
      let sentence = '';
      if (pattern === 0) sentence = `${m1} ${m2} ${em}`;
      else if (pattern === 1) sentence = `${m2} ${m1} ${em}`;
      else if (pattern === 2) sentence = `${m2} ${em} ${m1}`;
      else if (pattern === 3) sentence = `${m1} ${em} ${m2}`;
      else if (pattern === 4) sentence = `${em} ${m1} ${m2}`;
      else sentence = `${em} ${m2} ${m1}`;
      setGeneratedMessage(sentence);
    }
    setCopiedType(null);
  }, [msgPools, emojiPool, language]);

  // Copy functions for 3 different options
  const handleCopyMessage = async () => {
    if (!generatedMessage) return;
    try {
      await navigator.clipboard.writeText(generatedMessage);
      setCopiedType('message');
      setTimeout(() => setCopiedType(null), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const handleCopyHashtags = async (task: Task) => {
    const text = getCaption(task);
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType('hashtags');
      setTimeout(() => setCopiedType(null), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const handleCopyBoth = async (task: Task) => {
    const hashtags = getCaption(task);
    const text = generatedMessage
      ? `${generatedMessage}\n\n${hashtags}`
      : hashtags;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType('both');
      setTimeout(() => setCopiedType(null), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  // Open the actual post URL
  const handleGoToPost = (task: Task) => {
    window.open(task.url, '_blank');
  };

  // Mark task as complete
  const handleMarkComplete = (task: Task) => {
    setCompleted(prev => ({
      ...prev,
      [task.phase]: {
        ...(prev[task.phase] || {}),
        [task.id]: { completedAt: new Date().toISOString() },
      },
    }));
    setSelectedTask(null);
  };

  // Unmark task
  const handleUnmarkComplete = (task: Task) => {
    setCompleted(prev => {
      const next = { ...prev };
      if (next[task.phase]) {
        const nextPhase = { ...next[task.phase] };
        delete nextPhase[task.id];
        next[task.phase] = nextPhase;
      }
      return next;
    });
    setSelectedTask(null);
    setGeneratedMessage(''); // Clear any caption message on uncheck
  };

  // Quick complete without modal
  const handleQuickComplete = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    handleMarkComplete(task);
  };

  const touchStartY = useRef<number>(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollTimeoutRef = useRef<number | null>(null);
  
  const handleWheelContainer = (e: React.WheelEvent) => {
    if (e.deltaY > 10 && !isScrolled) {
      setIsScrolled(true);
    } else if (e.deltaY < -10 && mainRef.current && mainRef.current.scrollTop <= 0) {
      setIsScrolled(false);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const deltaY = touchStartY.current - e.touches[0].clientY;
    if (deltaY > 30 && !isScrolled) {
      setIsScrolled(true);
    } else if (deltaY < -30 && mainRef.current && mainRef.current.scrollTop <= 0) {
      setIsScrolled(false);
    }
  };

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    
    // Header transition logic - Prevent duplicate state updates (reduces scroll lag)
    const shouldBeScrolled = scrollTop > 20;
    setIsScrolled(prev => prev !== shouldBeScrolled ? shouldBeScrolled : prev);

    // Infinite scroll load more
    if (scrollTimeoutRef.current) return;
    if (scrollHeight - scrollTop - clientHeight < 400) {
      setVisibleCount(prev => Math.min(prev + 30, filteredTasks.length));
      scrollTimeoutRef.current = window.setTimeout(() => {
        scrollTimeoutRef.current = null;
      }, 100);
    }
  }, [filteredTasks.length]);

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center relative overflow-hidden">
        {/* Subtle background decorative element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-agtic-cream opacity-20 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="relative z-10 text-center flex flex-col items-center">
          <div className="w-32 h-40 mb-6 relative group animate-in fade-in zoom-in duration-700">
            <div className="absolute inset-0 bg-white/30 rounded-2xl blur-xl group-hover:bg-white/40 transition-all duration-500 animate-pulse"></div>
            <img
              src="/nt-amn-2.png"
              alt="Namtan Tipnaree"
              className="w-full h-full object-contain relative z-10 drop-shadow-2xl animate-bounce [animation-duration:3s]"
            />
          </div>

          <div className="relative">
            <div className="w-10 h-1 border-t-2 border-agtic-warm/40 mx-auto mb-4 scale-x-150 rounded-full animate-pulse"></div>
            <p className="text-agtic-charcoal font-bold text-lg tracking-[0.2em] uppercase animate-pulse">
              {t('loading')}
            </p>
            <div className="w-10 h-1 border-b-2 border-agtic-warm/40 mx-auto mt-4 scale-x-150 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 flex flex-col bg-transparent overflow-hidden"
      onWheel={handleWheelContainer}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      {/* Subtle paper texture overlay */}
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23000000' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E")`
      }} />



      {/* Header Container (Fixed at top) */}
      <div className="relative z-40 flex-shrink-0 bg-transparent">
        {/* Header */}
        <header className="transition-all duration-700 relative z-50 bg-transparent border-b border-transparent">
          {/* Language toggle moved to bottom footer stats bar */}

          <div className={`max-w-3xl mx-auto px-4 pb-0 transition-all duration-700 ${isScrolled ? 'pt-2 pb-2' : 'pt-10 sm:pt-14'}`}>
            
            {/* Armani Logo shown only on un-scrolled */}
            <div className={`overflow-hidden transition-all duration-700 flex flex-col items-center justify-center w-full ${isScrolled ? 'h-0 opacity-0 mb-0 scale-95 origin-top' : 'h-20 sm:h-28 opacity-100 mb-6 sm:mb-8 scale-100 origin-center'}`}>
              <img src="/armani.png" alt="Armani" className="h-full w-auto object-contain opacity-90" style={{ filter: 'brightness(0) invert(1) drop-shadow(0px 4px 6px rgba(0,0,0,0.5))' }} />
            </div>

            {/* Hero: Image + Title */}
            <div className={`flex transition-all duration-700 w-full ${isScrolled ? 'items-center flex-row gap-3 sm:gap-4 justify-center' : 'flex-col items-center justify-center text-center gap-0'}`}>
              
              {/* Avatar Image */}
              <div className={`flex-shrink-0 transition-all duration-700 ease-out ${isScrolled ? 'w-16 h-20 sm:w-20 sm:h-24' : 'w-40 h-56 sm:w-56 sm:h-[300px] relative'}`}>
                <div className={`absolute inset-0 bg-white/20 rounded-full blur-2xl transition-all duration-700 ${isScrolled ? 'opacity-0' : 'opacity-100'}`}></div>
                <img
                  src="/nt-amn-2.png"
                  alt="Namtan Tipnaree"
                  className="w-full h-full object-contain drop-shadow-2xl relative z-10 scale-110"
                />
              </div>

              {/* Texts */}
              <div className={`transition-all duration-700 flex flex-col ${isScrolled ? 'text-left mt-0 justify-center' : 'text-center mt-3 sm:mt-5 mb-4 sm:mb-6 items-center'}`}>
                
                <div className={`transition-all duration-700 ${isScrolled ? 'mb-2 sm:mb-3' : 'mb-3 sm:mb-5'}`}>
                  <span className={`text-white leading-none whitespace-nowrap transition-all duration-700 ${isScrolled ? 'text-4xl sm:text-[40px] tracking-tight block' : 'text-[56px] sm:text-[72px] block'}`} style={{ fontFamily: '"MonteCarlo", cursive', fontWeight: 400 }}>
                    Namtan Tipnaree
                  </span>
                </div>

                <h1 className={`font-bold tracking-wide transition-all duration-700 ${isScrolled ? 'text-white/70 text-xs sm:text-sm leading-none whitespace-nowrap block' : 'text-white/90 text-sm sm:text-base leading-snug uppercase tracking-[0.2em] sm:tracking-[0.25em] block'}`} style={{ fontFamily: '"Bodoni Moda", serif', fontWeight: 600 }}>
                  {t('appTitle')}
                </h1>

              </div>
            </div>

            {/* Platform Filters (Sticky on Header) */}
            <div className={`transition-all duration-700 w-full flex items-center justify-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide snap-x px-1 ${isScrolled ? 'pt-2 pb-2' : 'pt-4 pb-1'}`}>
              <button
                onClick={() => setTaskFilterPlatform(null)}
                className={`px-3.5 sm:px-4 h-7 sm:h-8 rounded-full shrink-0 text-[10px] sm:text-[11px] font-bold border transition-all flex items-center justify-center gap-1.5 shadow-sm snap-start backdrop-blur-md ${!taskFilterPlatform
                  ? 'bg-gradient-to-r from-pink-500/90 via-rose-500/90 to-red-600/90 border-pink-400/50 text-white shadow-lg shadow-rose-900/40 scale-[1.03]'
                  : 'bg-black/40 border-white/10 text-white/60 hover:text-white hover:bg-white/10 hover:border-white/30'
                  }`}
              >
                <span className="uppercase tracking-widest leading-none pt-px">All</span>
                <span className={`text-[10px] sm:text-[11px] font-semibold leading-none ${!taskFilterPlatform ? 'text-white/95' : 'text-white/50'}`}>{totalTasksList.length}</span>
              </button>
              {(['instagram', 'tiktok', 'x', 'facebook', 'youtube'] as const).map(p => {
                const isActive = taskFilterPlatform === p;
                const count = totalTasksList.filter(t => t.platform === p).length;
                
                return (
                  <button
                    key={p}
                    onClick={() => setTaskFilterPlatform(isActive ? null : p)}
                    className={`h-7 sm:h-8 px-3 sm:px-3.5 rounded-full shrink-0 border transition-all flex items-center justify-center gap-1.5 shadow-sm snap-start backdrop-blur-md ${isActive
                      ? 'bg-gradient-to-r from-pink-500/90 via-rose-500/90 to-red-600/90 border-pink-400/50 text-white shadow-lg shadow-rose-900/40 scale-[1.03]'
                      : 'bg-black/40 border-white/10 text-white/50 hover:text-white hover:bg-white/10 hover:border-white/30'
                      }`}
                  >
                    <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-current flex items-center justify-center">
                      {platformConfig[p].icon}
                    </div>
                    <span className={`text-[10px] sm:text-[11px] font-semibold leading-none ${isActive ? 'text-white/95' : 'text-white/50'}`}>{count}</span>
                  </button>
                );
              })}
            </div>

          </div>
        </header>
      </div>

      {/* Scrollable Middle Area */}
      <main
        ref={mainRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto min-h-0"
      >
        <div className="max-w-3xl mx-auto flex flex-col gap-1 px-3 pt-4 pb-2">

          {/* Error state */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 my-2">
              {t('error')}
            </div>
          )}

          {/* Tasks List Header & Wrap */}
          {totalTasksList.length > 0 && !loading && !error && (
            <div className="mb-4 mt-4 animate-in fade-in zoom-in-95 duration-500 px-1 sm:px-0">
              {/* Header with Minimize button */}
              {/* Filters moved to header */}
              {/* Task List mapping */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1.5 sm:gap-y-2 animate-in fade-in slide-in-from-top-4 duration-500" key={`task-list-${taskFilterPlatform || 'all'}`}>
                {visibleTasks.map((task, index) => {
                  const config = platformConfig[task.platform as keyof typeof platformConfig] || { color: 'from-slate-400 to-slate-500', icon: null, name: 'Unknown' };
                  const isNewSection = index === 0 || isTaskCompleted(task) !== isTaskCompleted(visibleTasks[index - 1]);
                  
                  return (
                    <Fragment key={`${task.id}-${index}`}>
                      {isNewSection && (
                        <div className="col-span-1 sm:col-span-2 flex items-center justify-center gap-4 mb-2 mt-6 first:mt-2 px-2">
                          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/30" />
                          <h3 className="text-xs sm:text-sm font-bold text-white/80 uppercase tracking-widest whitespace-nowrap">
                            {isTaskCompleted(task) ? t('done') : t('pending')}
                          </h3>
                          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/30" />
                        </div>
                      )}

                      <div
                        onClick={() => { setSelectedTask(task); setShowMarkDone(true); setGeneratedMessage(''); }}
                        className={`col-span-1 flex items-center shrink-0 gap-2 rounded-2xl py-2.5 px-3 border cursor-pointer transition-all group animate-in fade-in slide-in-from-bottom-4 duration-300 ${isTaskCompleted(task)
                          ? 'bg-black/20 backdrop-blur-sm border-white/5 opacity-60 grayscale-[0.3]'
                          : task.mark
                              ? 'bg-black/60 backdrop-blur-md border border-amber-400/50 shadow-sm hover:shadow-md hover:bg-black/80 relative overflow-hidden'
                              : 'bg-black/40 backdrop-blur-md border border-white/10 shadow-sm hover:shadow-md hover:bg-black/50'
                          }`}
                        style={{ animationDelay: `${(index % 10) * 50}ms` }}
                      >
                        {/* Platform badge */}
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${config.color} flex items-center justify-center text-sm flex-shrink-0 shadow-sm text-white`}>
                          {isTaskCompleted(task) ? '✓' : config.icon}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[13px] font-medium text-white/95 truncate">
                              {task.media || t('noTitle')}
                            </span>
                            {task.mark && !isTaskCompleted(task) && (
                              <span className="px-1.5 py-0.5 text-[9px] font-bold bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full flex-shrink-0">
                                {t('focusBadge')}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        {isTaskCompleted(task) ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUnmarkComplete(task);
                            }}
                            className="text-white/40 text-[11px] hover:text-white/80 px-2 py-1 transition-colors"
                          >
                            ↩
                          </button>
                        ) : (
                          <button
                            onClick={(e) => handleQuickComplete(task, e)}
                            className="bg-white/10 border border-white/20 text-white text-xs px-2 py-1 rounded-md font-semibold hover:bg-white/20 transition-colors"
                          >
                            ✓
                          </button>
                        )}
                      </div>
                    </Fragment>
                  );
                })}

                {/* Load more indicator */}
                {visibleCount < filteredTasks.length && (
                  <div className="text-center py-4 text-agtic-taupe text-xs">
                    {t('scrollToLoad')} ({visibleCount}/{filteredTasks.length})
                  </div>
                )}

              </div>
            </div>
          )}

          {tasks.length === 0 && !error && !loading && (
            <div className="text-center py-12 text-agtic-taupe">
              <p className="text-4xl mb-4">📭</p>
              <p>{t('noTasks')}</p>
            </div>
          )}

          {filteredTasks.length === 0 && tasks.length > 0 && (
            <div className="text-center py-12 text-agtic-taupe animate-in fade-in zoom-in duration-700">
              <p className="text-4xl mb-4 grayscale opacity-40">🎉</p>
              <p className="font-bold tracking-widest uppercase text-xs opacity-60">{t('allDone')}</p>
            </div>
          )}
        </div>
      </main >

      {/* Bottom Bar Container (Fixed at bottom, transparent) */}
      <footer className="relative z-40 flex-shrink-0 bg-transparent pt-2 pb-4 sm:pb-6" >
        <div className="max-w-3xl mx-auto relative px-4">
          {/* Stats Bar */}
          <div className="bg-black/60 backdrop-blur-xl rounded-[28px] px-3 sm:px-5 py-2.5 flex items-center justify-between shadow-2xl border border-white/15 w-full gap-1">
            
            {/* Language Toggle */}
            <div className="flex bg-black/80 rounded-full border border-white/10 p-0.5 flex-shrink-0">
              <button
                onClick={() => setLanguage('th')}
                className={`px-2 py-1 text-[9px] sm:text-[10px] tracking-wider font-bold rounded-full transition-all ${language === 'th' ? 'bg-white text-black' : 'text-white/60 hover:text-white'}`}
              >
                TH
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 text-[9px] sm:text-[10px] tracking-wider font-bold rounded-full transition-all ${language === 'en' ? 'bg-white text-black' : 'text-white/60 hover:text-white'}`}
              >
                EN
              </button>
            </div>

            <div className="w-px h-6 bg-white/20 shrink-0 mx-1 sm:mx-2" />

            {/* Pending Tasks */}
            <div className="flex flex-col items-center flex-1">
              <div className="text-[12px] sm:text-[13px] font-bold text-white flex items-baseline leading-none mb-1 whitespace-nowrap">
                {pendingCount} <span className="text-[9px] sm:text-[10px] font-normal text-white/60 ml-[2px]">/ {totalTasksList.length}</span>
              </div>
              <div className="text-[7px] sm:text-[8px] text-white/80 uppercase tracking-widest whitespace-nowrap leading-none">{t('pending')}</div>
            </div>

            <div className="w-px h-6 bg-white/20 shrink-0" />

            {/* Total Completion */}
            <div className="flex flex-col items-center flex-1">
              <div className="text-[13px] sm:text-[14px] font-bold text-pink-400 leading-none mb-1">
                {totalTasksList.length
                  ? (totalCompletedCount === totalTasksList.length
                    ? 100
                    : Math.floor((totalCompletedCount / totalTasksList.length) * 100))
                  : 0}%
              </div>
              <div className="text-[7px] sm:text-[8px] text-white/80 uppercase tracking-widest leading-none">{t('totalLabel')}</div>
            </div>

            <div className="w-px h-6 bg-white/20 shrink-0 ml-1 mr-2 hidden sm:block" />

            {/* Refresh Button */}
            <button
              onClick={() => fetchAllData(true)}
              disabled={refreshing}
              className={`flex-shrink-0 p-2 sm:p-1.5 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 transition-all ${refreshing ? 'animate-spin opacity-50' : ''}`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-[14px] h-[14px] sm:w-[15px] sm:h-[15px] text-white">
                <path d="M4 4v5h5M20 20v-5h-5M20 9A9 9 0 0 0 5.64 5.64L4 9M4 15a9 9 0 0 0 14.36 3.36L20 15" />
              </svg>
            </button>
          </div>
        </div>
      </footer >

      {/* Platform-Specific Task Modal */}
      {
        selectedTask && (() => {
          const platform = selectedTask.platform;
          const config = platformConfig[platform as keyof typeof platformConfig] || { color: 'from-slate-400 to-slate-500', icon: null, name: 'Unknown' };
          const isFacebook = platform === 'facebook';
          const hasHashtags = !!selectedTask.hashtags && !isFacebook;
          const activePool = msgPools[language]?.p1?.length ? msgPools[language] : msgPools.en;
          const msgReady =
            ((activePool.p1?.length ?? 0) > 0 && (activePool.p2?.length ?? 0) > 0 && emojiPool.length > 0) ||
            (activePool.complete?.length ?? 0) > 0;

          // Per-platform usage tips
          const tips: string[] = (() => {
            if (platform === 'instagram') return [t('igTip1'), t('igTip2'), t('igTip3')];
            if (platform === 'x') return [t('xTip1')];
            if (platform === 'tiktok') return [t('ttTip1'), t('ttTip2')];
            if (platform === 'youtube') return [t('ytTip1'), t('ytTip2')];
            if (platform === 'facebook') return [t('fbTip1')];
            return [];
          })();

          return (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedTask(null)}
            >
              <div className="absolute inset-0 bg-agtic-charcoal/40 backdrop-blur-sm animate-in fade-in duration-200" />

              <div
                className="relative w-full max-w-[380px] bg-zinc-900 rounded-[28px] shadow-[0_0_50px_rgba(0,0,0,0.9)] border border-white/10 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
              >

                {/* Header */}
                <div className="px-4 py-3.5 pb-2.5 flex items-center justify-between border-b border-white/10 bg-black/20">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center text-white shrink-0 shadow-sm`}>
                      {config.icon}
                    </div>
                    <p className="text-[14px] font-bold text-white truncate">{selectedTask.media || t('noTitle')}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {/* Close Button */}
                    <button
                      onClick={() => setSelectedTask(null)}
                      className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 space-y-3.5 bg-zinc-900 flex-1 overflow-y-auto max-h-[75vh]">

                  {/* 1. Hashtags */}
                  {hasHashtags && (
                    <div className="relative bg-black/40 border border-white/10 rounded-[16px] p-3 pt-2.5 shadow-sm">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">{t('sectionHashtags')}</span>
                        {/* Copy Button */}
                        <button
                          onClick={() => handleCopyHashtags(selectedTask)}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all border shadow-sm ${copiedType === 'hashtags'
                            ? 'text-black bg-white border-white'
                            : 'text-white/70 bg-white/5 border-white/10 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                          {copiedType === 'hashtags' ? (
                            t('copiedBtn')
                          ) : (
                            <>
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                              {t('copyTagsBtn')}
                            </>
                          )}
                        </button>
                      </div>
                      <div className="max-h-32 overflow-y-auto pr-1">
                        <p className="text-[12.5px] text-white/90 leading-relaxed font-medium whitespace-pre-wrap">{selectedTask.hashtags}</p>
                      </div>
                    </div>
                  )}

                  {/* 2. Generated Message */}
                  <div className="relative bg-black/40 border border-white/10 rounded-[16px] p-3 pt-2.5 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">{t('sectionMessage')}</span>
                      <div className="flex items-center gap-1.5">
                        {/* Regenerate Button */}
                        {generatedMessage && msgReady && (
                          <button
                            onClick={generateRandomMessage}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-white/70 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-all shadow-sm"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
                            {t('regenerate')}
                          </button>
                        )}
                        {/* Copy Button */}
                        {generatedMessage && (
                          <button
                            onClick={handleCopyMessage}
                            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all border shadow-sm ${copiedType === 'message'
                              ? 'text-black bg-white border-white'
                              : 'text-white/70 bg-white/5 border-white/10 hover:bg-white/10 hover:text-white'
                              }`}
                          >
                            {copiedType === 'message' ? (
                              t('copiedBtn')
                            ) : (
                              <>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                {t('copyMsgBtn')}
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {!generatedMessage ? (
                      <button
                        onClick={generateRandomMessage}
                        disabled={!msgReady}
                        className={`w-full py-4 rounded-xl text-[13px] font-bold transition-all shadow-sm flex items-center justify-center gap-2 ${msgReady
                          ? 'bg-zinc-800 hover:bg-zinc-700 text-white border border-white/10'
                          : 'bg-zinc-900/50 text-white/20 border border-white/5 cursor-not-allowed'
                          }`}
                      >
                        {msgReady ? (
                          <>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-amber-500"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /><path d="m5 3 1 1" /><path d="m5 21 1-1" /><path d="m21 3-1 1" /><path d="m21 21-1-1" /></svg>
                            {t('generateCaption')}
                          </>
                        ) : t('noPositiveMessages')}
                      </button>
                    ) : (
                      <p className="text-[13px] text-white/90 leading-relaxed">{generatedMessage}</p>
                    )}
                  </div>

                  {/* 3. Primary Actions */}
                  <div className="flex flex-col gap-2.5 pt-1">
                    {!isFacebook && generatedMessage && hasHashtags && (
                      <button
                        onClick={() => handleCopyBoth(selectedTask)}
                        className={`w-full py-3 rounded-[14px] text-[12.5px] font-bold transition-all shadow-sm border flex items-center justify-center gap-1.5 ${copiedType === 'both'
                          ? 'bg-white text-black border-white'
                          : 'bg-zinc-800 hover:bg-zinc-700 text-white border-white/10 hover:border-white/20'
                          }`}
                      >
                        {copiedType === 'both' ? (
                          t('copiedBtn')
                        ) : (
                          <>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                            {t('copyAllBtn')}
                          </>
                        )}
                      </button>
                    )}

                    {showMarkDone ? (
                      <div className="flex gap-2.5">
                        <button
                          onClick={() => handleGoToPost(selectedTask)}
                          className={`flex-1 py-3.5 rounded-[14px] bg-gradient-to-r ${config.color} hover:opacity-90 text-[12.5px] font-bold text-white transition-all shadow-sm flex items-center justify-center gap-1.5`}
                        >
                          {t('goPost')}
                        </button>

                        {isTaskCompleted(selectedTask) ? (
                          <button
                            onClick={() => handleUnmarkComplete(selectedTask)}
                            className="flex-1 py-3.5 rounded-[14px] bg-white/10 hover:bg-white/20 text-white border border-white/20 text-[12.5px] font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                          >
                            {t('done')}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleMarkComplete(selectedTask)}
                            className="flex-1 py-3.5 rounded-[14px] bg-white hover:bg-zinc-200 text-black text-[12.5px] font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 border border-transparent"
                          >
                            {t('markDoneBtn')}
                          </button>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => handleGoToPost(selectedTask)}
                        className={`w-full py-3.5 rounded-[14px] bg-gradient-to-r ${config.color} hover:opacity-90 text-[12.5px] font-bold text-white transition-all shadow-sm flex items-center justify-center gap-1.5`}
                      >
                        {t('goPost')}
                      </button>
                    )}
                  </div>

                  {/* 4. Subtle Tips */}
                  {tips.length > 0 && (
                    <div className="text-center pt-2 space-y-1">
                      {tips.map((tip, i) => (
                        <p key={i} className="text-[10px] text-white/40 italic leading-snug">{tip}</p>
                      ))}
                    </div>
                  )}

                </div>
              </div>
            </div>
          );
        })()
      }


      {/* 🎬 Credits Floating Button — visible only when all focus+hot tasks are done */}
      {allFocusTasks.length > 0 && allFocusTasksDone && (
        <div className="fixed bottom-24 right-5 z-50">
          <div className="relative">
            {/* Glowing Ping Effect */}
            <div className="absolute inset-0 rounded-full bg-agtic-taupe animate-ping opacity-60 duration-1000"></div>

            <button
              onClick={() => creditsSubmitted ? setShowEndCredits(true) : setShowNameSubmit(true)}
              className="relative w-16 h-16 rounded-full bg-gradient-to-br from-agtic-taupe to-agtic-charcoal border-[3px] border-white/50 shadow-xl shadow-agtic-charcoal/50 flex flex-col items-center justify-center gap-0.5 hover:scale-110 active:scale-95 transition-all group overflow-hidden"
              title={creditsSubmitted ? 'ดู End Credits' : 'ลงชื่อใน Credits'}
            >
              {/* Shine sweep effect on hover */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>

              <span className="text-2xl leading-none drop-shadow-md group-hover:scale-110 group-hover:-translate-y-0.5 transition-transform duration-300">
                {creditsSubmitted ? '✨' : '🎟️'}
              </span>
              <span className="text-white text-[8px] font-black tracking-[0.15em] uppercase leading-none mt-1 drop-shadow-sm">
                {language === 'th' ? 'เครดิต' : 'Credits'}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* 🏅 Name Submit Modal (100% Complete — combined achievement + credits) */}
      <NameSubmitModal
        isOpen={showNameSubmit}
        onClose={() => setShowNameSubmit(false)}
        onSubmitted={() => {
          setCreditsSubmitted(true);
          setShowNameSubmit(false);
          setTimeout(() => setShowEndCredits(true), 500);
        }}
        onViewCredits={() => {
          setShowNameSubmit(false);
          setShowEndCredits(true);
        }}
        completedCount={totalCompletedCount}
        totalCount={totalTasksList.length}
      />

      {/* 🎬 End Credits Modal */}
      <EndCreditsModal
        isOpen={showEndCredits}
        onClose={() => setShowEndCredits(false)}
      />

    </div >
  );
}

export default App;
