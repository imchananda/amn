import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FaInstagram, FaFacebook, FaYoutube, FaWeibo, FaTiktok, FaSearch, FaPlus, FaTimes, FaSpinner, FaCheckCircle, FaStar } from 'react-icons/fa';
import { FaXTwitter, FaThreads } from 'react-icons/fa6';
import { SiXiaohongshu } from 'react-icons/si';

// ─── Types ────────────────────────────────────────────────────────────────────
interface SheetTask {
    id: string;
    mark: boolean;
    platform: string;
    media: string;
    url: string;
    hashtag: string;
    source: 'sheet' | 'local';
}

// ─── Sheet Config ─────────────────────────────────────────────────────────────
const DEFAULT_HASHTAG = "NAMTAN BRAND AM ARMANI \n#NamtanXNewPOY";

const SHEETS_CONFIG = [
    { phase: 'all', label: 'ข้อมูลทั้งหมด (All)', gid: '0' },
];

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
    instagram: <FaInstagram className="text-pink-500" />,
    x: <FaXTwitter className="text-gray-200" />,
    tiktok: <FaTiktok className="text-teal-400" />,
    facebook: <FaFacebook className="text-blue-500" />,
    youtube: <FaYoutube className="text-red-500" />,
    threads: <FaThreads className="text-zinc-400" />,
    weibo: <FaWeibo className="text-yellow-500" />,
    red: <SiXiaohongshu className="text-rose-500" />,
};

// ─── Formatting Helpers ───────────────────────────────────────────────────────
const fmt = (n: number) => n.toLocaleString('en-US');

// ─── CSV Parser ───────────────────────────────────────────────────────────────
function parseCSV(csvText: string): string[][] {
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentCell = '';
    let inQuotes = false;
    for (let i = 0; i < csvText.length; i++) {
        const char = csvText[i];
        const nextChar = csvText[i + 1];
        if (char === '"') {
            if (inQuotes && nextChar === '"') { currentCell += '"'; i++; }
            else inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            currentRow.push(currentCell.trim());
            currentCell = '';
        } else if ((char === '\n' || (char === '\r' && nextChar === '\n')) && !inQuotes) {
            currentRow.push(currentCell.trim());
            if (currentRow.some(c => c !== '')) rows.push(currentRow);
            currentRow = []; currentCell = '';
            if (char === '\r') i++;
        } else if (char === '\r' && !inQuotes) {
            currentRow.push(currentCell.trim());
            if (currentRow.some(c => c !== '')) rows.push(currentRow);
            currentRow = []; currentCell = '';
        } else {
            currentCell += char;
        }
    }
    currentRow.push(currentCell.trim());
    if (currentRow.some(c => c !== '')) rows.push(currentRow);
    return rows;
}

function parseTasksFromCSV(csvText: string): SheetTask[] {
    csvText = csvText.replace(/^\uFEFF/, '');
    const rows = parseCSV(csvText);
    if (rows.length === 0) return [];
    const headers = rows[0].map(h => h.toLowerCase().trim());
    const getVal = (r: string[], header: string) => {
        const idx = headers.indexOf(header.toLowerCase().trim());
        return idx !== -1 ? (r[idx] || '') : '';
    };

    const tasks: SheetTask[] = [];
    for (let i = 1; i < rows.length; i++) {
        const r = rows[i];
        const url = getVal(r, 'url');
        if (!url) continue;
        let rawPlatform = (getVal(r, 'platform') || 'x').toLowerCase().trim();
        if (['ig', 'instagram', 'insta'].includes(rawPlatform)) rawPlatform = 'instagram';
        else if (['fb', 'facebook'].includes(rawPlatform)) rawPlatform = 'facebook';
        else if (['tt', 'tiktok'].includes(rawPlatform)) rawPlatform = 'tiktok';
        else if (['yt', 'youtube'].includes(rawPlatform)) rawPlatform = 'youtube';
        else if (['threads', 'thread', 'th'].includes(rawPlatform)) rawPlatform = 'threads';
        
        const markVal = getVal(r, 'mark').toLowerCase().trim();
        const isMarked = markVal === '1' || markVal === 'true' || markVal === 'yes' || markVal === 'สำคัญ' || markVal === 'x';

        tasks.push({
            id: getVal(r, 'id') || url || String(i),
            mark: isMarked,
            platform: rawPlatform,
            media: getVal(r, 'media') || getVal(r, 'ชื่อสื่อ') || getVal(r, 'title') || '',
            url,
            hashtag: getVal(r, 'hashtag') || getVal(r, 'hashtags') || '',
            source: 'sheet'
        });
    }
    return tasks;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminDataManagement() {
    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState<SheetTask[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterPlatform, setFilterPlatform] = useState<string>('all');
    
    // UI states
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    
    // App Script Config — ดึงจาก env variable (global สำหรับทุก admin)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gasUrl: string = (import.meta as any).env?.VITE_GAS_URL || '';

    // Add Form State
    const [formData, setFormData] = useState({
        mark: false,
        platform: 'instagram',
        media: '',
        url: '',
        hashtag: DEFAULT_HASHTAG
    });
    // Media Autosuggest State
    const uniqueMediaNames = useMemo(() => Array.from(new Set(tasks.map(t => t.media).filter(Boolean))), [tasks]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const mediaSuggestions = useMemo(() => {
        if (!formData.media) return uniqueMediaNames.slice(0, 5); // Show top 5 recent if empty
        return uniqueMediaNames.filter(name => name.toLowerCase().includes(formData.media.toLowerCase()) && name !== formData.media).slice(0, 5);
    }, [formData.media, uniqueMediaNames]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const handleEditClick = (task: SheetTask) => {
        setEditingTaskId(task.id);
        setFormData({
            mark: task.mark,
            platform: task.platform,
            media: task.media,
            url: task.url,
            hashtag: task.hashtag
        });
        setShowAddModal(true);
    };

    const handleDeleteClick = async (taskId: string) => {
        if (!window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?')) return;
        
        if (!gasUrl) {
            alert('กรุณาตั้งค่า Google Apps Script Web App URL ในปุ่มตั้งค่า (ฟันเฟือง) มุมขวาบนก่อนครับ');
            return;
        }

        // Optimistically update UI
        setTasks(prev => prev.filter(t => t.id !== taskId));

        const payload = {
            action: 'deleteRow',
            sheetGID: SHEETS_CONFIG[0].gid,
            data: { id: taskId }
        };

        try {
            await fetch(gasUrl, {
                method: 'POST',
                body: JSON.stringify(payload),
                mode: 'no-cors'
            });
        } catch (err) {
            console.error('Delete error', err);
            alert('เกิดข้อผิดพลาดในการลบข้อมูล');
        }
    };

    // ─── Fetch Data ─────────────────────────────────────────────────────────
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const allFetched: SheetTask[] = [];
            // Assuming we just fetch gid 0
            const sheet = SHEETS_CONFIG[0];
            const res = await fetch(`/api/sheet?gid=${sheet.gid}`);
            if (res.ok) {
                const csv = await res.text();
                const sheetTasks = parseTasksFromCSV(csv);
                allFetched.push(...sheetTasks);
            }
            
            // Reverse to put newest on top usually
            setTasks(allFetched.reverse());
        } catch (e) {
            console.error('Fetch error:', e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // ─── Filter & Sort ──────────────────────────────────────────────────────
    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            const matchSearch = task.media.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                task.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                task.hashtag.toLowerCase().includes(searchTerm.toLowerCase());
            const matchPlatform = filterPlatform === 'all' || task.platform === filterPlatform;
            return matchSearch && matchPlatform;
        });
    }, [tasks, searchTerm, filterPlatform]);


    // ─── Form Submission ────────────────────────────────────────────────────
    const handleAddSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!gasUrl) {
            alert('ไม่พบการตั้งค่า Google Apps Script URL — กรุณาติดต่อผู้ดูแลระบบเพื่อตั้งค่า VITE_GAS_URL ใน environment ครับ');
            return;
        }

        setIsSubmitting(true);
        
        const payload = {
            action: editingTaskId ? 'updateRow' : 'addRow',
            sheetGID: SHEETS_CONFIG[0].gid,
            data: {
                id: editingTaskId,
                mark: formData.mark ? 1 : 0,
                platform: formData.platform,
                media: formData.media,
                url: formData.url,
                hashtag: formData.hashtag
            }
        };

        try {
            await fetch(gasUrl, {
                method: 'POST',
                body: JSON.stringify(payload),
                mode: 'no-cors'
            });

            setSubmitSuccess(true);
            
            if (editingTaskId) {
                setTasks(prev => prev.map(t => t.id === editingTaskId ? { ...t, ...formData } : t));
            } else {
                setTasks(prev => [{
                    id: `temp_${Date.now()}`,
                    ...formData,
                    source: 'local'
                }, ...prev]);
            }

            setTimeout(() => {
                setSubmitSuccess(false);
                setShowAddModal(false);
                setFormData({
                    mark: false,
                    platform: 'instagram',
                    media: '',
                    url: '',
                    hashtag: DEFAULT_HASHTAG
                });
            }, 2000);

        } catch (err) {
            console.error(err);
            alert('เกิดข้อผิดพลาดในการส่งข้อมูลเข้า Google Sheets โปรดตรวจสอบ Web App URL');
        } finally {
            setIsSubmitting(false);
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <div className="w-16 h-16 mx-auto relative">
                    <div className="absolute inset-0 rounded-full border-4 border-gray-800" />
                    <div className="absolute inset-0 rounded-full border-4 border-t-emerald-500 animate-spin" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-gray-100 font-sans pb-20">
            {/* ── Top Nav ────────────────────────────────────────── */}
            <div className="bg-gray-900/95 backdrop-blur border-b border-gray-800 sticky top-0 z-40">
                <div className="h-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => { window.location.hash = ''; window.location.reload(); }}
                                className="text-gray-500 hover:text-white transition-colors text-xs flex items-center gap-1.5"
                            >
                                ← <span>กลับหน้าหลัก</span>
                            </button>
                            <div className="w-px h-4 bg-gray-700" />
                            <h1 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
                                🗄️ Database Management
                            </h1>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 pl-[90px]">จัดการภาพรวมและเพิ่มข้อมูลสื่อเข้าแคมเปญ</p>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                        <button
                            onClick={() => {
                                setEditingTaskId(null);
                                setFormData({ mark: false, platform: 'instagram', media: '', url: '', hashtag: DEFAULT_HASHTAG });
                                setShowAddModal(true);
                            }}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-500/20"
                        >
                            <FaPlus className="text-xs" />
                            เพิ่มรายชื่อสื่อ
                        </button>

                    </div>
                </div>
            </div>

            {/* ── Overview Metrics ───────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 border-b border-gray-800/50">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
                        <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Total Records</div>
                        <div className="text-2xl font-black text-white">{fmt(tasks.length)}</div>
                    </div>
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
                        <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Important Media (Marked)</div>
                        <div className="text-2xl font-black focus:text-emerald-400 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                            {fmt(tasks.filter(t=>t.mark).length)}
                        </div>
                    </div>
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 col-span-2 md:col-span-1">
                        <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Platforms Count</div>
                        <div className="text-2xl font-black text-cyan-400">
                            {new Set(tasks.map(t=>t.platform)).size} <span className="text-sm font-medium text-gray-500">แพลตฟอร์ม</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Filters & Search ───────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                        <input 
                            type="text" 
                            placeholder="ค้นหาชื่อสื่อ หรือ URL หรือ แฮชแท็ก..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-900/50 border border-gray-700/80 rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                    </div>

                    {/* Filter Platform */}
                    <div className="flex items-center gap-2 overflow-x-auto shrink-0 pb-1 md:pb-0 scrollbar-hide">
                        <div className="bg-gray-900 border border-gray-700/80 rounded-xl p-1 flex items-center min-w-max">
                            <button onClick={()=>setFilterPlatform('all')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${filterPlatform==='all' ? 'bg-gray-700 text-white' : 'text-gray-500'}`}>All</button>
                            {Object.keys(PLATFORM_ICONS).map(p => (
                                <button key={p} onClick={()=>setFilterPlatform(p)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${filterPlatform===p ? 'bg-gray-700 text-white' : 'text-gray-500'}`}>
                                    {PLATFORM_ICONS[p]}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Table ─────────────────────────────────────── */}
                <div className="bg-gray-900/40 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-800/60 border-b border-gray-700 text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                                    <th className="px-4 py-3 text-center w-12">No.</th>
                                    <th className="px-4 py-3 text-center">Important</th>
                                    <th className="px-4 py-3">Platform</th>
                                    <th className="px-4 py-3">Media Name</th>
                                    <th className="px-4 py-3 min-w-[300px]">Link (URL)</th>
                                    <th className="px-4 py-3">Hashtags</th>
                                    <th className="px-4 py-3 text-center">Manage</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800/60 font-medium text-sm">
                                {filteredTasks.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-gray-500">
                                            <div className="text-3xl mb-2">📄</div>
                                            ไม่มีข้อมูลสื่อที่ตรงกับการค้นหา
                                        </td>
                                    </tr>
                                ) : (
                                    filteredTasks.map((task, idx) => (
                                        <tr key={task.id + idx} className={`hover:bg-gray-800/40 transition-colors ${task.source === 'local' ? 'bg-emerald-900/10' : ''}`}>
                                            <td className="px-4 py-3 text-center text-xs text-gray-500 tabular-nums">
                                                {idx + 1}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {task.mark ? (
                                                    <FaStar className="text-amber-400 mx-auto drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                                                ) : (
                                                    <span className="text-gray-700">-</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-lg bg-gray-800 flex items-center justify-center border border-gray-700 shrink-0">
                                                        {PLATFORM_ICONS[task.platform] || <span className="text-gray-500 text-xs">{task.platform}</span>}
                                                    </div>
                                                    <span className="text-xs uppercase text-gray-400 hidden sm:block">{task.platform}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="text-gray-200 line-clamp-1 min-w-[120px]" title={task.media}>{task.media || '-'}</div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <a href={task.url} target="_blank" rel="noreferrer" className="text-[11px] text-emerald-500 hover:text-emerald-400 hover:underline truncate max-w-[350px] block py-1">
                                                    {task.url}
                                                </a>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="text-cyan-400/80 text-[11px] line-clamp-2 min-w-[150px] leading-relaxed break-words whitespace-pre-wrap">{task.hashtag || '-'}</div>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button 
                                                        onClick={() => handleEditClick(task)}
                                                        className="w-8 h-8 inline-flex items-center justify-center rounded-lg bg-gray-800 border border-gray-700 hover:bg-emerald-600 hover:border-emerald-500 hover:text-white text-gray-400 transition-all cursor-pointer"
                                                        title="แก้ไขข้อมูล"
                                                    >
                                                        <span className="text-xs">✏️</span>
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteClick(task.id)}
                                                        className="w-8 h-8 inline-flex items-center justify-center rounded-lg bg-gray-800 border border-gray-700 hover:bg-rose-600 hover:border-rose-500 hover:text-white text-gray-400 transition-all cursor-pointer"
                                                        title="ลบข้อมูล"
                                                    >
                                                        <span className="text-xs">🗑️</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ── Add Data Modal ─────────────────────────────────────── */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isSubmitting && setShowAddModal(false)} />
                    <div className="relative bg-[#0f1115] border border-gray-700 rounded-3xl w-full max-w-md shadow-2xl p-6 overflow-hidden">
                        
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <span className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">{editingTaskId ? '✏️' : '➕'}</span>
                                {editingTaskId ? 'แก้ไขข้อมูลสื่อ' : 'เพิ่มรายชื่อสื่อ'}
                            </h2>
                            <button onClick={()=>setShowAddModal(false)} className="text-gray-500 hover:text-white"><FaTimes /></button>
                        </div>

                        {submitSuccess ? (
                            <div className="text-center py-12 animate-in zoom-in fade-in">
                                <FaCheckCircle className="text-5xl text-emerald-500 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">ส่งข้อมูลสำเร็จ!</h3>
                                <p className="text-gray-500 text-sm">รายชื่อสื่อถูกบันทึกเข้า Google Sheets แล้ว</p>
                            </div>
                        ) : (
                            <form onSubmit={handleAddSubmit} className="space-y-4">
                                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-between">
                                    <div>
                                        <label className="block text-sm font-bold text-amber-500/90 mb-0.5">สื่อสำคัญ (Important Mark)</label>
                                        <p className="text-[10px] text-gray-500">ติดดาวเพื่อตั้งให้สื่อนี้เป็นเป้าหมายสำคัญ</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" checked={formData.mark} onChange={(e) => setFormData({...formData, mark: e.target.checked})} className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                                    </label>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wide">Platform</label>
                                    <select 
                                        value={formData.platform} onChange={e=>setFormData({...formData, platform: e.target.value})}
                                        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:border-emerald-500 outline-none"
                                    >
                                        <option value="instagram">Instagram</option>
                                        <option value="x">X / Twitter</option>
                                        <option value="tiktok">TikTok</option>
                                        <option value="facebook">Facebook</option>
                                        <option value="youtube">YouTube</option>
                                        <option value="threads">Threads</option>
                                        <option value="weibo">Weibo</option>
                                        <option value="red">RED</option>
                                    </select>
                                </div>

                                <div className="relative">
                                    <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wide">ชื่อสื่อ (Media Name)</label>
                                    <input 
                                        type="text" required value={formData.media} 
                                        onChange={e => {
                                            setFormData({...formData, media: e.target.value});
                                            setShowSuggestions(true);
                                        }}
                                        onFocus={() => setShowSuggestions(true)}
                                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:border-emerald-500 outline-none relative z-20" placeholder="เช่น Vogue Thailand"
                                    />
                                    {showSuggestions && mediaSuggestions.length > 0 && (
                                        <div className="absolute z-30 w-full mt-1 bg-gray-800 border border-gray-700 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                                            {mediaSuggestions.map((name, i) => (
                                                <div 
                                                    key={i} 
                                                    className="px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer transition-colors border-b border-gray-700/50 last:border-0"
                                                    onClick={() => {
                                                        setFormData({...formData, media: name});
                                                        setShowSuggestions(false);
                                                    }}
                                                >
                                                    {name}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wide">URL แหล่งที่มา</label>
                                    <input 
                                        type="url" required value={formData.url} onChange={e=>setFormData({...formData, url:e.target.value})}
                                        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:border-emerald-500 outline-none" placeholder="https://..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wide">Hashtags ที่กำหนด</label>
                                    <textarea 
                                        rows={3}
                                        value={formData.hashtag} onChange={e=>setFormData({...formData, hashtag:e.target.value})}
                                        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:border-emerald-500 outline-none resize-none" placeholder="#ArmaniBeauty #BrandAmbassador"
                                    />
                                </div>

                                <button 
                                    type="submit" disabled={isSubmitting}
                                    className={`w-full py-3 rounded-xl font-bold text-sm tracking-wide mt-4 flex items-center justify-center gap-2 transition ${isSubmitting ? 'bg-gray-700 text-gray-400' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-500/20'}`}
                                >
                                    {isSubmitting ? <><FaSpinner className="animate-spin" /> กำลังส่งข้อมูล...</> : 'บันทึกรายชื่อสื่อ'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}



        </div>
    );
}
