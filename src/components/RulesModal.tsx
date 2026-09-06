import React from 'react';
import { X, Swords, Heart, BookOpen, AlertCircle, Sparkles } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Panduan Bermain PyDuel</h2>
            <p className="text-xs text-slate-400">
              Berdasarkan kurikulum S1 & Buku Ajar Mario Fahmi Syahrial dkk.
            </p>
          </div>
        </div>

        {/* Modes Section */}
        <div className="space-y-6">
          {/* Mode A */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-indigo-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Swords className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-white text-base">Mode A: PyBot Speed Duel (1 vs 1)</h3>
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
              <li>
                Pemain dan rival AI (<strong className="text-indigo-300">PyBot S1</strong>) masing-masing memulai dengan <strong className="text-emerald-400">100 HP</strong>.
              </li>
              <li>
                Batas waktu berpikir: <strong className="text-amber-400">60 detik</strong> per soal.
              </li>
              <li>
                PyBot menyimulasikan waktu berpikir antara <span className="text-cyan-300">25–45 detik</span> dengan akurasi rata-rata ~75%.
              </li>
              <li>
                Jika Anda menjawab benar <span className="text-emerald-400 font-semibold">lebih cepat</span> dari bot: PyBot kehilangan <strong className="text-rose-400">25 HP</strong>!
              </li>
              <li>
                Jika Anda salah, waktu habis, atau bot menjawab benar lebih dahulu: Pemain terkena serangan balik (<strong className="text-rose-400">-25 HP</strong>).
              </li>
              <li>
                Pemenang adalah yang berhasil menghabiskan HP lawannya hingga 0.
              </li>
            </ul>
          </div>

          {/* Mode B */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-emerald-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-5 h-5 text-rose-400 fill-rose-400" />
              <h3 className="font-bold text-white text-base">Mode B: Survival Run (100 XP &amp; 10s Timer)</h3>
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
              <li>
                Pemain dibekali <strong className="text-emerald-400">100 XP Ketahanan</strong>. Setiap jawaban salah atau kehabisan waktu mengurangi <strong className="text-rose-400">5 XP</strong>.
              </li>
              <li>
                <strong className="text-rose-400">Aturan Berhenti:</strong> Jika XP habis (<strong className="text-rose-400">0 XP</strong>) sebelum menyelesaikan 20 soal, maka game <strong className="text-rose-400">langsung berhenti (Game Over)</strong>!
              </li>
              <li>
                Waktu menjawab kilat: <strong className="text-amber-400">10 detik</strong> per soal tanpa jeda pembahasan untuk aksi arcade seru &amp; menantang.
              </li>
              <li>
                <strong className="text-amber-400">Combo Streak:</strong> Menjawab benar berturut-turut meningkatkan streak. Combo &ge; 3x mengaktifkan bonus pemulihan <strong className="text-emerald-300">+5 XP</strong>!
              </li>
              <li>
                Dilengkapi 3 Power-Ups strategis:
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2 pt-1">
                  <div className="p-2 rounded bg-slate-900/60 border border-slate-700/50 text-[11px]">
                    <span className="font-bold text-amber-400 block mb-1">💡 50:50 Lifeline</span>
                    Menghilangkan 2 opsi salah (khusus soal pilihan ganda).
                  </div>
                  <div className="p-2 rounded bg-slate-900/60 border border-slate-700/50 text-[11px]">
                    <span className="font-bold text-cyan-400 block mb-1">⏱️ Freeze Time</span>
                    Menambah 5 detik dan menjeda waktu sementara.
                  </div>
                  <div className="p-2 rounded bg-slate-900/60 border border-slate-700/50 text-[11px]">
                    <span className="font-bold text-emerald-400 block mb-1">🛡️ Shield</span>
                    Menolak 1 penalti jawaban salah tanpa kehilangan XP.
                  </div>
                </div>
              </li>
            </ul>
          </div>

          {/* Game 3: PyStar Pattern Simulator */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-amber-500/30 space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-white text-base">Game 3: PyStar Pattern Simulator (Studi Kasus 5.4)</h3>
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
              <li>
                <strong className="text-amber-400">Live Pattern Laboratory:</strong> Eksplorasi 5 pola perulangan bersarang autentik Bab 5.4 (Segitiga Siku Menaik, Inverted Menurun, Segitiga Rata Kanan, Piramida Simetris Ganjil, &amp; Diamond).
              </li>
              <li>
                <strong className="text-amber-400">Dual-Screen Real-Time Renderer:</strong> Layar kiri menampilkan generator kode Python bersih, dan layar kanan menampilkan simulasi konsol output monospaced seketika.
              </li>
              <li>
                <strong className="text-amber-400">Step-by-Step Matrix Tracer:</strong> Dilengkapi animasi cetak kursor (i, j) interaktif untuk menelusuri jalannya eksekusi loop per karakter.
              </li>
              <li>
                <strong className="text-amber-400">Pattern Code Detective:</strong> Uji keahlian melalui 10 soal analisis teori &amp; trace table loop bersarang dengan bonus <strong className="text-emerald-300">+50 XP</strong> per jawaban tepat.
              </li>
            </ul>
          </div>

          {/* Format Soal & Proteksi 50:50 */}
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/70 space-y-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Aturan Khusus True / False & Lifeline
              </h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Soal True / False (Benar / Salah) hanya memiliki 2 opsi. Oleh karena itu, power-up 
              <strong className="text-amber-300"> 50:50 otomatis dinonaktifkan</strong> pada soal True/False untuk menjaga integritas logika berpikir akademis.
            </p>
          </div>

          {/* Buku Sumber & Tim Penulis */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-500/30 space-y-2.5">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                Buku Sumber &amp; Tim Penulis
              </h4>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-semibold block">Judul Buku:</span>
              <p className="text-sm font-bold text-white">
                ALGORITMA dan Pemrograman dengan Python
              </p>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-semibold block mb-1">Penulis:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-300 font-medium">
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Andy Haryoko</span>
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Moh. Muhyidin Agus Wibowo</span>
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Anggia Kalista</span>
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Krishna Tri Sanjaya</span>
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Mario Fahmi Syahrial</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-lg shadow-indigo-600/30"
          >
            Siap Bertanding!
          </button>
        </div>
      </div>
    </div>
  );
};
