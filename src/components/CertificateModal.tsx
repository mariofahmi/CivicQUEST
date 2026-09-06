import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Printer, Award, ShieldCheck, Download, FileImage } from 'lucide-react';
import { toPng, toJpeg } from 'html-to-image';
import { PlayerStats, GameMode, PlayerInfo } from '../types/game';
import { soundEngine } from '../utils/soundEngine';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: PlayerStats;
  mode: GameMode | 'pystar';
  playerInfo?: PlayerInfo;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  stats,
  mode,
  playerInfo,
}) => {
  const [recipientName, setRecipientName] = useState(
    () => playerInfo?.name || 'Mahasiswa Berprestasi'
  );
  const [institution, setInstitution] = useState(
    () => playerInfo?.institution || 'Program Studi S1 Teknik Informatika'
  );
  const [isExporting, setIsExporting] = useState<'png' | 'jpeg' | null>(null);

  React.useEffect(() => {
    if (playerInfo?.name) setRecipientName(playerInfo.name);
    if (playerInfo?.institution) setInstitution(playerInfo.institution);
  }, [playerInfo]);

  if (!isOpen) return null;

  const accuracy = stats.totalAnswered > 0
    ? Math.round((stats.correctCount / stats.totalAnswered) * 100)
    : 100;

  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const getGrade = (score: number) => {
    if (mode === 'pystar') {
      if (score >= 100) return 'Grade A+ (Master Nested Loop)';
      if (score >= 80) return 'Grade A (Istimewa)';
      if (score >= 60) return 'Grade B (Baik)';
      return 'Grade C (Cukup)';
    }
    if (score >= 85) return 'Grade A (Istimewa)';
    if (score >= 75) return 'Grade B+ (Sangat Baik)';
    if (score >= 65) return 'Grade B (Baik)';
    if (score >= 55) return 'Grade C (Cukup)';
    return 'Grade D (Evaluasi)';
  };

  const handlePrint = () => {
    window.print();
  };

  const downloadImage = async (format: 'png' | 'jpeg') => {
    const certElement = document.getElementById('certificate-print-area');
    if (!certElement) return;

    try {
      setIsExporting(format);
      soundEngine.playPowerup();

      // High-resolution 2x rendering for ultra-sharp print quality
      const options = {
        pixelRatio: 2,
        backgroundColor: '#0b1120',
        cacheBust: true,
      };

      const dataUrl =
        format === 'png'
          ? await toPng(certElement, { ...options, quality: 1.0 })
          : await toJpeg(certElement, { ...options, quality: 0.95 });

      const safeName = recipientName.trim().replace(/[^a-zA-Z0-9_-]/g, '_') || 'Mahasiswa';
      const filename = `Sertifikat_${mode === 'pystar' ? 'PyStar' : 'PyDuel'}_${safeName}.${format === 'jpeg' ? 'jpg' : 'png'}`;

      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Gagal membuat gambar sertifikat:', err);
    } finally {
      setIsExporting(null);
    }
  };

  return createPortal(
    <div
      id="certificate-portal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        id="certificate-modal-card"
        className="relative w-full max-w-4xl max-h-[96vh] overflow-y-auto bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl p-4 sm:p-7 text-slate-100 space-y-4"
      >
        {/* Top Control Bar (Hidden on Print) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-extrabold text-white">
              {mode === 'pystar'
                ? 'Sertifikat Kelulusan & Penghargaan: Studi Kasus 5.4 Nested Loops'
                : 'Sertifikat Kelulusan & Penghargaan PyDuel (20 Soal • Nilai Maksimal 100)'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs transition shadow-md shadow-amber-500/20 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              title="Cetak via browser atau simpan PDF"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / PDF</span>
            </button>

            <button
              onClick={() => downloadImage('png')}
              disabled={isExporting !== null}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shadow-md shadow-indigo-600/20 cursor-pointer disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
              title="Unduh sertifikat gambar format PNG beresolusi tinggi"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting === 'png' ? 'Memproses...' : 'Unduh PNG'}</span>
            </button>

            <button
              onClick={() => downloadImage('jpeg')}
              disabled={isExporting !== null}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-md shadow-emerald-600/20 cursor-pointer disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
              title="Unduh sertifikat gambar format JPG"
            >
              <FileImage className="w-4 h-4" />
              <span>{isExporting === 'jpeg' ? 'Memproses...' : 'Unduh JPG'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* THE OFFICIAL PRINTABLE CERTIFICATE PAPER CANVAS */}
        {/* ========================================================================= */}
        <div
          id="certificate-print-area"
          className="relative w-full bg-gradient-to-b from-[#0b1120] via-[#0f172a] to-[#0b1120] border-4 border-amber-500/70 p-4 sm:p-6 print:p-5 rounded-2xl shadow-2xl text-center space-y-3 sm:space-y-4 print:space-y-2 overflow-hidden select-none"
        >
          {/* Decorative Corner Filigrees */}
          <div className="absolute top-2 left-2 w-10 h-10 border-t-2 border-l-2 border-amber-400/80 pointer-events-none" />
          <div className="absolute top-2 right-2 w-10 h-10 border-t-2 border-r-2 border-amber-400/80 pointer-events-none" />
          <div className="absolute bottom-2 left-2 w-10 h-10 border-b-2 border-l-2 border-amber-400/80 pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-10 h-10 border-b-2 border-r-2 border-amber-400/80 pointer-events-none" />

          {/* Background Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
            <Award className="w-80 h-80 text-amber-300" />
          </div>

          {/* Certificate Header */}
          <div className="space-y-1.5 print:space-y-1 relative z-10">

            <h1 className="text-xl sm:text-3xl print:text-2xl font-black text-transparent bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 bg-clip-text tracking-wide uppercase font-serif">
              SERTIFIKAT PENGHARGAAN
            </h1>

            <p className="text-[10px] sm:text-xs uppercase tracking-widest text-slate-400 font-semibold">
              Certificate of Academic Excellence
            </p>
          </div>

          {/* Recipient Statement */}
          <div className="space-y-1 print:space-y-0.5 relative z-10">
            <p className="text-[11px] sm:text-xs text-slate-300 italic font-serif">
              Dengan bangga diberikan secara resmi kepada:
            </p>

            <div className="py-1 print:py-0.5 border-b-2 border-amber-400/50 max-w-lg mx-auto">
              <h2 className="text-xl sm:text-2xl print:text-xl font-extrabold text-white tracking-tight font-serif uppercase">
                {recipientName}
              </h2>
              {institution && (
                <p className="text-[11px] sm:text-xs text-amber-300 font-semibold tracking-wider mt-0.5 uppercase font-mono">
                  {institution}
                </p>
              )}
            </div>

            {mode === 'pystar' ? (
              <p className="max-w-2xl mx-auto text-[11px] sm:text-xs text-slate-300 leading-relaxed font-sans pt-0.5">
                Atas ketuntasan dan keberhasilan menyelesaikan evaluasi analisis perulangan bersarang (<strong className="text-white font-bold">Nested Loops</strong>), 
                kalkulasi indeks matriks <strong className="text-amber-300 font-bold">(i, j)</strong>, serta simulasi pola karakter bintang pada mini-game edukasi{' '}
                <strong className="text-amber-300 font-bold">&ldquo;PyStar Pattern Simulator (Studi Kasus 5.4)&rdquo;</strong>, berbasis buku ajar resmi:
              </p>
            ) : (
              <p className="max-w-2xl mx-auto text-[11px] sm:text-xs text-slate-300 leading-relaxed font-sans pt-0.5">
                Atas keberhasilan menyelesaikan evaluasi kompetensi pemrograman dan pertempuran logika sebanyak{' '}
                <strong className="text-white font-bold">20 Soal</strong> pada game edukasi{' '}
                <strong className="text-white font-bold">&ldquo;PyDuel: Battle of Algorithms&rdquo;</strong>, berbasis kurikulum buku ajar resmi universitas:
              </p>
            )}

            <p className="text-xs sm:text-sm font-extrabold text-amber-300 tracking-wide font-serif">
              &ldquo;ALGORITMA dan Pemrograman dengan Python&rdquo;
            </p>
          </div>

          {/* Achievement Badges Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 print:gap-2 max-w-xl mx-auto relative z-10 text-xs">
            <div className="p-1.5 sm:p-2 print:p-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
              <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold block">Nilai Akhir</span>
              <span className="text-sm sm:text-base font-black text-amber-400">{stats.score} <span className="text-[10px] text-slate-400">/ 100</span></span>
            </div>
            <div className="p-1.5 sm:p-2 print:p-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
              <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold block">Predikat</span>
              <span className="text-[11px] sm:text-xs font-black text-emerald-400 block mt-0.5">{getGrade(stats.score)}</span>
            </div>
            <div className="p-1.5 sm:p-2 print:p-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
              <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold block">Soal Benar</span>
              <span className="text-sm sm:text-base font-black text-amber-300">{stats.correctCount} / {stats.totalAnswered || (mode === 'pystar' ? 10 : 20)}</span>
            </div>
            <div className="p-1.5 sm:p-2 print:p-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
              <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold block">Akurasi</span>
              <span className="text-sm sm:text-base font-black text-indigo-300">{accuracy}%</span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* OFFICIAL STAMP & TIM PYDUEL SIGNATURE (UNIFIED & OVERLAPPING) */}
          {/* ========================================================================= */}
          <div className="pt-2 sm:pt-3 print:pt-1.5 border-t border-slate-800/80 flex flex-col items-center justify-center relative z-10">
            {/* Unified Endorsement Block */}
            <div className="relative flex flex-col items-center text-center">
              {/* Layered Stamp and Signature Area */}
              <div className="relative h-16 sm:h-20 print:h-16 w-72 sm:w-88 flex items-center justify-center">
                {/* STEMPEL RESMI VERIFIED: Menempel & Menyatu dengan Tanda Tangan */}
                <div className="absolute left-6 sm:left-12 -top-1 w-20 sm:w-22 print:w-18 h-20 sm:h-22 print:h-18 rounded-full border-4 border-emerald-500/80 p-0.5 flex items-center justify-center shadow-2xl shadow-emerald-500/30 rotate-[-12deg] bg-emerald-950/40 backdrop-blur-[1px] select-none z-10 transition-transform hover:rotate-0">
                  {/* Inner Dashed Border */}
                  <div className="w-full h-full rounded-full border-2 border-dashed border-emerald-400/80 flex flex-col items-center justify-center text-center p-0.5 space-y-0.5">
                    <span className="text-[7px] sm:text-[8px] uppercase font-black tracking-widest text-emerald-300">
                      ★ PYDUEL ★
                    </span>
                    <div className="flex items-center justify-center">
                      <ShieldCheck className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-emerald-400" />
                    </div>
                    <span className="text-[8px] sm:text-[9px] uppercase font-black tracking-wider text-emerald-200 border-y border-emerald-400/60 px-1 py-0.5">
                      VERIFIED
                    </span>
                    <span className="text-[6px] sm:text-[7px] font-mono text-emerald-300/90">
                      {currentDate}
                    </span>
                  </div>
                </div>

                {/* Digital Calligraphy Signature SVG (Layered on top of Stamp) */}
                <div className="relative z-20 w-full flex items-center justify-center pointer-events-none">
                  <svg className="w-44 sm:w-52 print:w-40 h-12 sm:h-16 print:h-12 text-amber-400 stroke-current drop-shadow-[0_2px_10px_rgba(251,191,36,0.35)]" viewBox="0 0 200 60" fill="none">
                    <path
                      d="M 20 42 C 40 10, 60 22, 85 35 C 105 45, 120 12, 140 25 C 155 35, 170 28, 185 18 M 55 42 L 165 42"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="188" cy="18" r="3" fill="currentColor" />
                  </svg>
                </div>
              </div>

              {/* Garis & Nama Pengesahan TIM PENGEMBANG PY DUEL */}
              <div className="border-t-2 border-slate-700 w-60 sm:w-80 pt-1 relative z-20">
                <p className="text-sm sm:text-base print:text-sm font-black text-white uppercase tracking-widest font-serif">
                  TIM PENGEMBANG PY DUEL
                </p>
              </div>
            </div>
          </div>

          {/* Certificate Footer Stamp & Verification Details */}
          <div className="mt-auto pt-2 print:pt-1 pb-1 print:pb-0.5 px-3 sm:px-4 text-[10px] sm:text-xs print:text-[9.5px] font-mono text-slate-200 print:text-slate-100 font-bold relative z-20 flex flex-wrap justify-between items-center border-t border-slate-700/80 bg-slate-950/40 rounded-b-xl">
            <span className="tracking-wide">
              Mode: {mode === 'duel' ? 'Speed Duel AI' : mode === 'survival' ? 'Survival Run' : 'PyStar Pattern Simulator (Studi Kasus 5.4)'} &bull; Tim Pengembang Py Duel
            </span>
            <span className="tracking-wide">Tanggal Pengesahan: {currentDate}</span>
          </div>
        </div>

        {/* Bottom Actions (Hidden on Print) */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2 print:hidden">
          <p className="text-xs text-slate-400 text-center sm:text-left">
            Sertifikat sah kelulusan evaluasi PyDuel &bull; Format cetak/ekspor: <span className="text-amber-400 font-bold">PDF, PNG (HD), JPG</span>
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => downloadImage('png')}
              disabled={isExporting !== null}
              className="px-3.5 py-2 rounded-xl bg-indigo-600/90 hover:bg-indigo-500 text-white font-bold text-xs transition shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
              title="Unduh sertifikat format gambar PNG"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting === 'png' ? 'Menyiapkan...' : 'Simpan PNG'}</span>
            </button>

            <button
              onClick={() => downloadImage('jpeg')}
              disabled={isExporting !== null}
              className="px-3.5 py-2 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
              title="Unduh sertifikat format gambar JPG"
            >
              <FileImage className="w-4 h-4" />
              <span>{isExporting === 'jpeg' ? 'Menyiapkan...' : 'Simpan JPG'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition shadow-lg shadow-amber-500/25 flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              title="Cetak langsung ke kertas atau simpan ke PDF"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak PDF</span>
            </button>

            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

