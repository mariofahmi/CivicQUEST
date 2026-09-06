import React from 'react';
import { X, Users, GraduationCap } from 'lucide-react';

interface BookInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const authors = [
  'Andy Haryoko',
  'Moh. Muhyidin Agus Wibowo',
  'Anggia Kalista',
  'Krishna Tri Sanjaya',
  'Mario Fahmi Syahrial',
];

export const BookInfoModal: React.FC<BookInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-slate-100 overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 rounded-b-full blur-[1px]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3.5 mb-5 mt-1">
          <div className="w-12 h-12 p-1 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/40 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/10">
            <img src="./logo-unirow.png" alt="Logo Universitas PGRI Ronggolawe" className="w-9 h-9 object-contain drop-shadow" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Universitas PGRI Ronggolawe
            </span>
            <h2 className="text-xl font-extrabold text-white mt-1">
              Buku Ajar &amp; Referensi S1
            </h2>
          </div>
        </div>

        <div className="space-y-4">
          {/* Judul Buku Card */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Judul Buku:
            </span>
            <p className="text-lg font-black bg-gradient-to-r from-indigo-300 via-white to-emerald-300 bg-clip-text text-transparent leading-snug">
              ALGORITMA dan Pemrograman dengan Python
            </p>
          </div>

          {/* Penulis List */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Tim Penulis:
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {authors.map((author, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-semibold text-slate-200"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-black">
                    {index + 1}
                  </div>
                  <span>{author}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cakupan Kurikulum S1 */}
          <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-slate-300 space-y-1">
            <div className="flex items-center gap-1.5 text-indigo-300 font-bold">
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              <span>Cakupan Kurikulum Buku:</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Mencakup Bab 1 (Konsep Algoritma & Flowchart), Bab 2 (Tipe Data & Variabel), Bab 3 (Searching & Sorting), Bab 4 (Kontrol Alur & Penanganan Error), hingga Bab 5 (Studi Kasus Praktis).
            </p>
          </div>
        </div>

        {/* Footer Close */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shadow-lg shadow-indigo-600/30"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
