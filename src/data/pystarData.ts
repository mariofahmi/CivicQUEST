import { PatternDefinition, PatternDetectiveQuestion, PatternCharType } from '../types/game';

const resolveChar = (charType: PatternCharType, i: number, j: number): string => {
  if (charType === 'j') return j.toString();
  if (charType === 'i') return i.toString();
  return charType;
};

export const PATTERN_LIST: PatternDefinition[] = [
  {
    id: 'pola1_ascending',
    codeRef: 'Dasar 5.4.1',
    title: 'Segitiga Siku Kiri Menaik',
    subtitle: 'Right-Angled Triangle Ascending',
    description: 'Pola dasar bersarang di mana jumlah karakter bertambah seiring pertambahan indeks baris i (dari 1 hingga N).',
    generateCode: (n: number, char: PatternCharType) => {
      const charPrint = char === 'j' ? 'j' : char === 'i' ? 'i' : `'${char}'`;
      return `# Studi Kasus 5.4.1: Segitiga Siku-Siku Kiri Menaik
# Rujukan: Buku Algoritma & Pemrograman dengan Python (Mario Fahmi Syahrial dkk.)

n = ${n}

# Outer Loop (i): Mengontrol perpindahan baris (1 s.d. n)
for i in range(1, n + 1):
    # Inner Loop (j): Mencetak sebanyak i karakter pada baris aktif
    for j in range(1, i + 1):
        print(${charPrint}, end=' ')
    print()  # Pindah ke baris baru`;
    },
    generateOutput: (n: number, char: PatternCharType) => {
      const lines: string[] = [];
      let totalChars = 0;
      let totalLoopIterations = 0;

      for (let i = 1; i <= n; i++) {
        const parts: string[] = [];
        for (let j = 1; j <= i; j++) {
          parts.push(resolveChar(char, i, j));
          totalChars++;
          totalLoopIterations++;
        }
        lines.push(parts.join(' '));
      }

      return {
        lines,
        totalChars,
        totalLines: n,
        totalLoopIterations,
      };
    },
  },
  {
    id: 'pola2_descending',
    codeRef: 'Latihan 5.4.2',
    title: 'Segitiga Siku Terbalik Menurun',
    subtitle: 'Inverted Descending Triangle',
    description: 'Pola bersarang menggunakan step negatif (-1) pada loop luar untuk mencetak deret menurun dari N hingga 1.',
    generateCode: (n: number, char: PatternCharType) => {
      const charPrint = char === 'j' ? 'j' : char === 'i' ? 'i' : `'${char}'`;
      return `# Studi Kasus 5.4.2: Segitiga Siku Terbalik Menurun
# Rujukan: Buku Algoritma & Pemrograman dengan Python (Mario Fahmi Syahrial dkk.)

n = ${n}

# Outer Loop (i): Bergerak mundur dari n ke 1 (step = -1)
for i in range(n, 0, -1):
    # Inner Loop (j): Mencetak sebanyak i karakter
    for j in range(1, i + 1):
        print(${charPrint}, end=' ')
    print()  # Pindah ke baris baru`;
    },
    generateOutput: (n: number, char: PatternCharType) => {
      const lines: string[] = [];
      let totalChars = 0;
      let totalLoopIterations = 0;

      for (let i = n; i >= 1; i--) {
        const parts: string[] = [];
        for (let j = 1; j <= i; j++) {
          parts.push(resolveChar(char, i, j));
          totalChars++;
          totalLoopIterations++;
        }
        lines.push(parts.join(' '));
      }

      return {
        lines,
        totalChars,
        totalLines: n,
        totalLoopIterations,
      };
    },
  },
  {
    id: 'pola3_right_aligned',
    codeRef: 'Lanjutan 5.4.3',
    title: 'Segitiga Rata Kanan (Padding Spasi)',
    subtitle: 'Right-Aligned Triangle with Space Padding',
    description: 'Pola dua inner loop berurutan: loop pertama mencetak spasi perataan (n - i), dan loop kedua mencetak karakter.',
    generateCode: (n: number, char: PatternCharType) => {
      const charPrint = char === 'j' ? 'j' : char === 'i' ? 'i' : `'${char}'`;
      return `# Studi Kasus 5.4.3: Segitiga Rata Kanan (Padding Spasi)
# Rujukan: Buku Algoritma & Pemrograman dengan Python (Mario Fahmi Syahrial dkk.)

n = ${n}

for i in range(1, n + 1):
    # 1. Loop Dalam Pertama: Cetak spasi perataan ke kanan
    for s in range(n - i):
        print('  ', end='')
    
    # 2. Loop Dalam Kedua: Cetak karakter bintang
    for j in range(1, i + 1):
        print(${charPrint}, end=' ')
    
    print()  # Pindah baris`;
    },
    generateOutput: (n: number, char: PatternCharType) => {
      const lines: string[] = [];
      let totalChars = 0;
      let totalLoopIterations = 0;

      for (let i = 1; i <= n; i++) {
        const spaces = '  '.repeat(n - i);
        const charParts: string[] = [];
        totalLoopIterations += (n - i); // Spasi iterations

        for (let j = 1; j <= i; j++) {
          charParts.push(resolveChar(char, i, j));
          totalChars++;
          totalLoopIterations++;
        }
        lines.push(spaces + charParts.join(' '));
      }

      return {
        lines,
        totalChars,
        totalLines: n,
        totalLoopIterations,
      };
    },
  },
  {
    id: 'pola4_pyramid',
    codeRef: 'Studi Kasus Utama 5.4.4',
    title: 'Piramida Simetris Penuh (Bintang Ganjil)',
    subtitle: 'Full Symmetric Pyramid with Odd Stars (2i - 1)',
    description: 'Piramida simetris sempurna di mana spasi dicetak sebanyak (n - i) dan karakter bintang ganjil sebanyak (2i - 1).',
    generateCode: (n: number, char: PatternCharType) => {
      const charPrint = char === 'j' ? 'j' : char === 'i' ? 'i' : `'${char}'`;
      return `# Studi Kasus 5.4.4: Piramida Simetris Penuh
# Rujukan: Buku Algoritma & Pemrograman dengan Python (Mario Fahmi Syahrial dkk.)

n = ${n}

for i in range(1, n + 1):
    # 1. Spasi Perataan Tengah: (n - i) spasi
    for s in range(n - i):
        print(' ', end='')
    
    # 2. Karakter Bintang Ganjil: (2 * i - 1) karakter
    for j in range(1, 2 * i):
        print(${charPrint}, end='')
    
    print()  # Pindah baris`;
    },
    generateOutput: (n: number, char: PatternCharType) => {
      const lines: string[] = [];
      let totalChars = 0;
      let totalLoopIterations = 0;

      for (let i = 1; i <= n; i++) {
        const spaces = ' '.repeat(n - i);
        let charPart = '';
        totalLoopIterations += (n - i);

        for (let j = 1; j <= 2 * i - 1; j++) {
          charPart += resolveChar(char, i, j);
          totalChars++;
          totalLoopIterations++;
        }
        lines.push(spaces + charPart);
      }

      return {
        lines,
        totalChars,
        totalLines: n,
        totalLoopIterations,
      };
    },
  },
  {
    id: 'pola5_diamond',
    codeRef: 'Tantangan Mahasiswa 5.4.5',
    title: 'Belah Ketupat (Diamond Pattern)',
    subtitle: 'Diamond Pattern with Symmetric Upper & Inverted Lower Loops',
    description: 'Tantangan tingkat lanjut gabungan piramida atas dan piramida terbalik bawah menggunakan struktur perulangan bertingkat ganda.',
    generateCode: (n: number, char: PatternCharType) => {
      const charPrint = char === 'j' ? 'j' : char === 'i' ? 'i' : `'${char}'`;
      return `# Studi Kasus 5.4.5A: Belah Ketupat (Diamond Pattern)
# Rujukan: Buku Algoritma & Pemrograman dengan Python (Mario Fahmi Syahrial dkk.)

n = ${n}

# Bagian Atas (Piramida Normal)
for i in range(1, n + 1):
    for s in range(n - i):
        print(' ', end='')
    for j in range(1, 2 * i):
        print(${charPrint}, end='')
    print()

# Bagian Bawah (Piramida Terbalik)
for i in range(n - 1, 0, -1):
    for s in range(n - i):
        print(' ', end='')
    for j in range(1, 2 * i):
        print(${charPrint}, end='')
    print()`;
    },
    generateOutput: (n: number, char: PatternCharType) => {
      const lines: string[] = [];
      let totalChars = 0;
      let totalLoopIterations = 0;

      // Bagian Atas (1 .. n)
      for (let i = 1; i <= n; i++) {
        const spaces = ' '.repeat(n - i);
        let charPart = '';
        totalLoopIterations += (n - i);
        for (let j = 1; j <= 2 * i - 1; j++) {
          charPart += resolveChar(char, i, j);
          totalChars++;
          totalLoopIterations++;
        }
        lines.push(spaces + charPart);
      }

      // Bagian Bawah (n - 1 .. 1)
      for (let i = n - 1; i >= 1; i--) {
        const spaces = ' '.repeat(n - i);
        let charPart = '';
        totalLoopIterations += (n - i);
        for (let j = 1; j <= 2 * i - 1; j++) {
          charPart += resolveChar(char, i, j);
          totalChars++;
          totalLoopIterations++;
        }
        lines.push(spaces + charPart);
      }

      return {
        lines,
        totalChars,
        totalLines: 2 * n - 1,
        totalLoopIterations,
      };
    },
  },
  {
    id: 'pola5_number_triangle',
    codeRef: 'Latihan Matriks 5.4.5B',
    title: 'Segitiga Angka Bertingkat',
    subtitle: 'Dynamic Iteration Matrix Number Triangle',
    description: 'Menampilkan nilai koordinat kolom j secara berurutan (1, 1 2, 1 2 3) untuk membuktikan cara kerja perulangan dalam.',
    generateCode: (n: number) => {
      return `# Studi Kasus 5.4.5B: Segitiga Angka Bertingkat
# Rujukan: Buku Algoritma & Pemrograman dengan Python (Mario Fahmi Syahrial dkk.)

n = ${n}

for i in range(1, n + 1):
    for j in range(1, i + 1):
        print(j, end=' ')
    print()  # Ganti baris`;
    },
    generateOutput: (n: number) => {
      const lines: string[] = [];
      let totalChars = 0;
      let totalLoopIterations = 0;

      for (let i = 1; i <= n; i++) {
        const parts: string[] = [];
        for (let j = 1; j <= i; j++) {
          parts.push(j.toString());
          totalChars++;
          totalLoopIterations++;
        }
        lines.push(parts.join(' '));
      }

      return {
        lines,
        totalChars,
        totalLines: n,
        totalLoopIterations,
      };
    },
  },
];

export const PATTERN_DETECTIVE_QUESTIONS: PatternDetectiveQuestion[] = [
  {
    id: 1,
    badge: 'Soal 1 • Rentang Loop Bersarang',
    title: 'Tantangan 1: Rentang Inner Loop Segitiga Bintang',
    question: 'Untuk mencetak segitiga siku menaik dengan N baris di mana baris ke-1 berisi 1 bintang dan baris ke-5 berisi 5 bintang, bagaimana penulisan inner loop range yang tepat jika outer loop adalah `for i in range(1, n + 1):`?',
    codeSnippet: `n = 5
for i in range(1, n + 1):
    # Baris ke-i harus mencetak tepat i bintang
    for j in ???:
        print('*', end=' ')
    print()`,
    options: [
      'range(1, i + 1)',
      'range(i)',
      'range(n - i)',
      'range(1, n)',
    ],
    correctAnswer: 0,
    explanation: 'Pada baris ke-i, kita ingin mencetak sebanyak i bintang. Karena fungsi range(start, stop) di Python berhenti tepat satu angka sebelum batas stop, maka range(1, i + 1) menghasilkan deret 1, 2, ..., i (tepat sebanyak i iterasi per baris).',
    formulaNote: 'Formula Deret: Deret 1 s.d. i menggunakan range(1, i + 1) atau range(i).',
  },
  {
    id: 2,
    badge: 'Soal 2 • Fungsi Parameter print',
    title: 'Tantangan 2: Kontrol Alur Argumen print(..., end=" ")',
    question: 'Pada baris `print(\'*\', end=\' \')` di Studi Kasus 5.4, apa fungsi utama dari parameter `end=\' \'`?',
    codeSnippet: `for j in range(1, i + 1):
    print('*', end=' ')  # Perhatikan parameter end=' '
print()  # Mencetak baris baru`,
    options: [
      'Mencegah perpindahan baris baru dan menambahkan spasi antar bintang',
      'Memaksa program membuat baris baru setelah setiap bintang tercetak',
      'Menutup koneksi stream file output terminal secara paksa',
      'Menghapus karakter bintang terakhir dalam buffer memori',
    ],
    correctAnswer: 0,
    explanation: 'Secara bawaan (default), fungsi print() di Python bernilai end=\'\\n\' yang langsung memindahkan kursor ke baris baru. Dengan mengubahnya menjadi end=\' \', karakter selanjutnya tetap dicetak berdampingan di baris yang sama dengan pemisah spasi.',
    formulaNote: 'Sintaks Python: print(*objects, sep=" ", end="\\n").',
  },
  {
    id: 3,
    badge: 'Soal 3 • Rumus Piramida Ganjil',
    title: 'Tantangan 3: Formula Deret Bintang Piramida Simetris',
    question: 'Pada pembuatan pola Piramida Simetris Bab 5.4, rumus matematika apa yang digunakan pada inner loop untuk menghasilkan jumlah karakter bintang ganjil (1, 3, 5, 7, ... pada baris i)?',
    codeSnippet: `# Target Jumlah Bintang per Baris i:
# Baris 1 -> 1 bintang
# Baris 2 -> 3 bintang
# Baris 3 -> 5 bintang
# Baris 4 -> 7 bintang
for j in range(1, 2 * i):  # Jumlah bintang = ???
    print('*', end='')`,
    options: [
      '2 * i - 1',
      'i * 2',
      'i + 2',
      '(n - i) // 2',
    ],
    correctAnswer: 0,
    explanation: 'Deret bilangan ganjil ke-i secara matematis didefinisikan dengan formula 2i - 1. Pada baris i = 1: 2(1) - 1 = 1; baris i = 2: 2(2) - 1 = 3; baris i = 3: 2(3) - 1 = 5, dan seterusnya. Dalam kode Python, loop range(1, 2 * i) mengeksekusi tepat sebanyak 2i - 1 kali.',
    formulaNote: 'Deret Bilangan Ganjil: Un = 2n - 1.',
  },
  {
    id: 4,
    badge: 'Soal 4 • Spasi Perataan Piramida',
    title: 'Tantangan 4: Padding Spasi Simetris Piramida',
    question: 'Berapa jumlah karakter spasi kosong di depan bintang yang harus dicetak pada baris ke-i (1-indexed) dari total tinggi N agar piramida berbentuk simetris tepat di tengah?',
    codeSnippet: `# Contoh N = 5
# Baris 1 (i=1): 4 spasi, 1 bintang
# Baris 2 (i=2): 3 spasi, 3 bintang
# Baris 5 (i=5): 0 spasi, 9 bintang
for s in range(???):
    print(' ', end='')`,
    options: [
      'n - i',
      'n + i',
      '2 * (n - i)',
      'i - 1',
    ],
    correctAnswer: 0,
    explanation: 'Agar piramida simetris sempurna di tengah, baris pertama memerlukan (N - 1) spasi, baris kedua (N - 2) spasi, hingga baris puncak ke-N memerlukan 0 spasi (N - N). Formula yang tepat untuk menghitung jumlah spasi tiap baris i adalah n - i.',
    formulaNote: 'Formula Padding: Spasi = N - i.',
  },
  {
    id: 5,
    badge: 'Soal 5 • Trace Table Loop Bersarang',
    title: 'Tantangan 5: Trace Table & Kompleksitas Iterasi',
    question: 'Jika N = 4 dieksekusi dengan kode segitiga siku-siku bertingkat, berapa kali total operasi perintah cetak bintang `print(\'*\', end=\'\')` dijalankan secara keseluruhan?',
    codeSnippet: `n = 4
for i in range(1, n + 1):
    for j in range(1, i + 1):
        print('*', end='')
    print()`,
    options: [
      '10 kali (1 + 2 + 3 + 4)',
      '16 kali (4 x 4)',
      '8 kali',
      '12 kali',
    ],
    correctAnswer: 0,
    explanation: 'Total eksekusi perintah cetak bintang merupakan penjumlahan dari seluruh iterasi loop dalam: saat i=1 dieksekusi 1 kali, saat i=2 dieksekusi 2 kali, saat i=3 dieksekusi 3 kali, dan saat i=4 dieksekusi 4 kali. Total = 1 + 2 + 3 + 4 = 10 kali. Berdasarkan rumus deret aritmatika Gauss: N(N + 1) / 2 = 4(5) / 2 = 10.',
    formulaNote: 'Rumus Deret Aritmatika Gauss: Σ i = N(N + 1) / 2.',
  },
  {
    id: 6,
    badge: 'Soal 6 • Perulangan Terbalik (Step Negatif)',
    title: 'Tantangan 6: Pola Segitiga Terbalik Menurun (Descending)',
    question: 'Untuk mencetak pola Segitiga Terbalik Menurun (baris 1 mencetak N bintang, baris ke-2 mencetak N-1 bintang, hingga baris ke-N mencetak 1 bintang), bagaimana konfigurasi outer loop `range()` dengan step negatif yang tepat di Python?',
    codeSnippet: `n = 5
# Mencetak baris dari n menurun hingga 1
for i in ???:
    for j in range(1, i + 1):
        print('*', end=' ')
    print()`,
    options: [
      'range(n, 1, -1)',
      'range(n, 0, -1)',
      'range(n, -1, 0)',
      'range(0, n, -1)',
    ],
    correctAnswer: 1,
    explanation: 'Fungsi range(start, stop, step) dengan step negatif (-1) akan menghitung mundur dari start (yaitu n) hingga stop + 1. Agar nilai 1 tetap termasuk dalam perulangan, nilai batas henti (stop) harus diset ke 0. Sehingga deret yang dihasilkan adalah n, n-1, ..., 2, 1.',
    formulaNote: 'Loop Mundur Python: range(start, stop, -1) berhenti di stop + 1.',
  },
  {
    id: 7,
    badge: 'Soal 7 • Total Baris Pola Diamond',
    title: 'Tantangan 7: Total Baris Belah Ketupat (Diamond Pattern)',
    question: 'Pada algoritma Belah Ketupat (Diamond Pattern) Studi Kasus 5.4, pola tersusun atas piramida atas setinggi N baris dan piramida terbalik bawah setinggi N - 1 baris. Jika parameter tinggi N = 6, berapakah total jumlah baris bintang yang akan tercetak?',
    codeSnippet: `n = 6
# Piramida Atas: n baris
for i in range(1, n + 1): ...

# Piramida Terbalik Bawah: n - 1 baris
for i in range(n - 1, 0, -1): ...`,
    options: [
      '12 baris (2 * n)',
      '10 baris (2 * n - 2)',
      '11 baris (2 * n - 1)',
      '13 baris (2 * n + 1)',
    ],
    correctAnswer: 2,
    explanation: 'Pola belah ketupat menggabungkan piramida atas sebanyak N baris dan piramida terbalik bawah sebanyak N - 1 baris tanpa menduplikasi baris tengah terpanjang. Total baris = N + (N - 1) = 2N - 1. Untuk N = 6, total baris adalah 2(6) - 1 = 11 baris.',
    formulaNote: 'Formula Total Baris Diamond: Baris_Total = 2N - 1.',
  },
  {
    id: 8,
    badge: 'Soal 8 • Output Koordinat Baris vs Kolom',
    title: 'Tantangan 8: Efek Variabel Baris (i) vs Kolom (j)',
    question: 'Perhatikan kode segitiga berikut. Jika perintah cetak di dalam inner loop diubah dari mencetak `j` menjadi mencetak `i`, apakah isi deret output yang tercetak pada baris ke-4?',
    codeSnippet: `n = 5
for i in range(1, n + 1):
    for j in range(1, i + 1):
        print(i, end=' ')  # Perhatikan: mencetak variabel i!
    print()`,
    options: [
      '4 4 4 4',
      '1 2 3 4',
      '4 3 2 1',
      '1 1 1 1',
    ],
    correctAnswer: 0,
    explanation: 'Variabel i merupakan variabel loop luar yang merepresentasikan nomor baris aktif dan nilainya tetap konstan selama satu baris dieksekusi oleh loop dalam j. Pada baris ke-4, nilai i = 4. Loop dalam berjalan 4 kali sehingga mencetak nilai i berulang kali: "4 4 4 4". (Jika mencetak j, deret yang muncul adalah "1 2 3 4").',
    formulaNote: 'Sifat Loop Bersarang: Variabel outer loop (i) bernilai konstan di sepanjang satu baris inner loop.',
  },
  {
    id: 9,
    badge: 'Soal 9 • Alur Eksekusi Print Newline',
    title: 'Tantangan 9: Fungsi Perintah print() di Akhir Outer Loop',
    question: 'Mengapa perintah `print()` tanpa argumen diletakkan sejajar di dalam outer loop `for i ...` namun tepat di luar inner loop `for j ...`?',
    codeSnippet: `for i in range(1, n + 1):
    for j in range(1, i + 1):
        print('*', end=' ')
    print()  # <-- Mengapa harus berada di sini?`,
    options: [
      'Untuk mereset nilai variabel counter i kembali ke angka 0',
      'Untuk menghapus karakter spasi berlebih pada memory cache terminal',
      'Untuk menghentikan eksekusi perulangan secara dini (break)',
      'Untuk memindahkan kursor ke baris baru setelah seluruh karakter pada baris ke-i selesai dicetak',
    ],
    correctAnswer: 3,
    explanation: 'Karena inner loop mencetak karakter secara horizontal di baris yang sama menggunakan end=" ", kita membutuhkan satu perintah print() default (yang memiliki karakter tersembunyi newline \\n) tepat setelah inner loop selesai agar karakter baris berikutnya berpindah ke baris di bawahnya.',
    formulaNote: 'Prinsip Format Teks: Inner loop menangani sumbu horizontal (kolom), outer loop menangani sumbu vertikal (baris).',
  },
  {
    id: 10,
    badge: 'Soal 10 • Analisis Kompleksitas Waktu Big-O',
    title: 'Tantangan 10: Kompleksitas Waktu Algoritma Loop Bersarang',
    question: 'Berdasarkan teori analisis algoritma di Buku Ajar Bab 5, berapakah notasi kompleksitas waktu Big-O dari algoritma pola matriks bersarang berukuran N x N (seperti persegi bintang atau segitiga siku)?',
    codeSnippet: `# Pola Persegi Matriks N x N:
for i in range(n):        # Dieksekusi N kali
    for j in range(n):    # Dieksekusi N kali untuk setiap i
        print('*', end=' ')
    print()`,
    options: [
      'O(N) — Linear Time',
      'O(N²) — Quadratic Time',
      'O(log N) — Logarithmic Time',
      'O(2ᴺ) — Exponential Time',
    ],
    correctAnswer: 1,
    explanation: 'Perulangan bersarang ganda di mana loop luar berjalan sebanyak N kali dan loop dalam berjalan sebanding dengan N kali menghasilkan total iterasi sebanding dengan N * N = N². Dalam notasi Big-O, ini dikategorikan sebagai efisiensi kuadratik O(N²). Untuk segitiga siku: N(N+1)/2 = 1/2 N² + 1/2 N, yang tetap disederhanakan menjadi O(N²).',
    formulaNote: 'Notasi Asimtotik Big-O: Dua tingkat nested loop berskala proporsional terhadap input N memiliki kompleksitas waktu O(N²).',
  },
];
