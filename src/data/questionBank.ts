import { Question } from '../types/game';

export const questionBank: Question[] = [
  // =========================================================================
  // BAB 1: PENGENALAN ALGORITMA & FLOWCHART
  // =========================================================================
  {
    id: 'b1-mc-1',
    bab: 1,
    babTitle: 'Bab 1: Konsep Algoritma & Flowchart',
    type: 'multiple_choice',
    difficulty: 'easy',
    question: 'Dalam diagram alir (flowchart) standar, manakah pasangan simbol dan fungsinya yang tepat untuk operasi Input/Output dan Titik Keputusan (Decision)?',
    options: [
      'Persegi panjang untuk I/O dan Oval untuk Decision',
      'Jajar genjang untuk I/O dan Belah ketupat (Diamond) untuk Decision',
      'Oval untuk I/O dan Jajar genjang untuk Decision',
      'Belah ketupat (Diamond) untuk I/O dan Persegi panjang untuk Decision'
    ],
    correctAnswer: 1,
    explanation: 'Berdasarkan buku ajar: Simbol Jajar Genjang digunakan untuk operasi Input/Output data, Persegi Panjang untuk Pemrosesan/Kalkulasi, Belah Ketupat (Diamond) untuk Keputusan (Decision), dan Oval (Terminator) untuk Awal/Akhir alur.'
  },
  {
    id: 'b1-mc-2',
    bab: 1,
    babTitle: 'Bab 1: Konsep Algoritma & Flowchart',
    type: 'multiple_choice',
    difficulty: 'medium',
    question: 'Perhatikan *trace table* algoritma penukaran nilai variabel berikut:\n\n1. temp = a\n2. a = b\n3. b = temp\n\nJika nilai awal `a = 15` dan `b = 40`, berapakah nilai akhir `a` dan `b`?',
    codeSnippet: 'a = 15\nb = 40\ntemp = a\na = b\nb = temp\nprint(f"a={a}, b={b}")',
    options: [
      'a = 15, b = 15',
      'a = 40, b = 40',
      'a = 40, b = 15',
      'a = 15, b = 40'
    ],
    correctAnswer: 2,
    explanation: 'Variabel penampung sementara (`temp`) menyimpan nilai lama `a` (15). Kemudian `a` diisi nilai `b` (40), dan terakhir `b` diisi nilai dari `temp` (15). Hasilnya nilai berhasil ditukar menjadi a = 40 dan b = 15.'
  },
  {
    id: 'b1-mc-3',
    bab: 1,
    babTitle: 'Bab 1: Konsep Algoritma & Flowchart',
    type: 'multiple_choice',
    difficulty: 'hard',
    question: 'Karakteristik algoritma efektif yang menjamin bahwa setiap instruksi harus jelas, tidak ambigu, dan hanya memiliki satu penafsiran tunggal disebut...',
    options: [
      'Finiteness (Keterbatasan)',
      'Definiteness (Kepastian)',
      'Efficiency (Efisiensi)',
      'Generality (Keumuman)'
    ],
    correctAnswer: 1,
    explanation: 'Definiteness (Kepastian) menuntut setiap langkah didefinisikan secara presisi tanpa ada interpretasi ganda. Finiteness menjamin algoritma harus berhenti setelah sejumlah langkah terbatas.'
  },
  {
    id: 'b1-tf-1',
    bab: 1,
    babTitle: 'Bab 1: Konsep Algoritma & Flowchart',
    type: 'true_false',
    difficulty: 'easy',
    statement: 'Karakteristik Finiteness menyatakan bahwa suatu algoritma yang valid harus selalu berakhir (berhenti) setelah mengeksekusi sejumlah langkah yang terhingga.',
    correctAnswer: true,
    explanation: 'Benar. Suatu rangkaian instruksi yang terjebak dalam infinite loop tanpa kondisi berhenti tidak memenuhi syarat Finiteness, sehingga tidak dapat dikategorikan sebagai algoritma yang valid.'
  },
  {
    id: 'b1-tf-2',
    bab: 1,
    babTitle: 'Bab 1: Konsep Algoritma & Flowchart',
    type: 'true_false',
    difficulty: 'medium',
    statement: 'Pseudocode adalah bahasa pemrograman formal yang dapat langsung dikompilasi dan dieksekusi oleh mesin komputer tanpa perantara interpreter.',
    correctAnswer: false,
    explanation: 'Salah. Pseudocode adalah notasi informal yang dirancang untuk dibaca dan dipahami oleh manusia, bukan bahasa yang bisa langsung dieksekusi oleh mesin atau compiler komputer.'
  },
  {
    id: 'b1-tf-3',
    bab: 1,
    babTitle: 'Bab 1: Konsep Algoritma & Flowchart',
    type: 'true_false',
    difficulty: 'medium',
    statement: 'Algoritma Euclidean kuno yang dirumuskan sekitar 300 SM dirancang khusus untuk mencari Kelipatan Persekutuan Terkecil (KPK) dari dua buah bilangan bulat.',
    correctAnswer: false,
    explanation: 'Salah. Algoritma Euclidean dirancang untuk mencari Pembagi Persekutuan Terbesar / FPB (Greatest Common Divisor / GCD), bukan KPK (Least Common Multiple).'
  },

  // =========================================================================
  // BAB 2: TIPE DATA & VARIABEL
  // =========================================================================
  {
    id: 'b2-mc-1',
    bab: 2,
    babTitle: 'Bab 2: Tipe Data & Variabel',
    type: 'multiple_choice',
    difficulty: 'easy',
    question: 'Berapakah output dari evaluasi ekspresi Python berikut?',
    codeSnippet: 'hasil = "3" * 4\nprint(hasil, type(hasil))',
    options: [
      '12 <class \'int\'>',
      '3333 <class \'str\'>',
      'SyntaxError',
      '["3", "3", "3", "3"] <class \'list\'>'
    ],
    correctAnswer: 1,
    explanation: 'Operator perkalian `*` antara string dan integer di Python melakukan operasi string repetition (pengulangan string). String `"3"` diulang sebanyak 4 kali menghasilkan `"3333"` bertipe str.'
  },
  {
    id: 'b2-mc-2',
    bab: 2,
    babTitle: 'Bab 2: Tipe Data & Variabel',
    type: 'multiple_choice',
    difficulty: 'medium',
    question: 'Perhatikan perbandingan operator kesamaan nilai `==` dan identitas memori `is` berikut:\n\nManakah hasil cetak yang benar?',
    codeSnippet: 'x = [1, 2, 3]\ny = [1, 2, 3]\nprint(x == y, x is y)',
    options: [
      'True True',
      'True False',
      'False True',
      'False False'
    ],
    correctAnswer: 1,
    explanation: 'Operator `==` memeriksa kesamaan nilai (value equality), sehingga `[1, 2, 3] == [1, 2, 3]` adalah True. Namun operator `is` memeriksa identitas referensi memori (`id(x) == id(y)`). Karena x dan y adalah dua objek list independen di memori yang berbeda, `x is y` menghasilkan False.'
  },
  {
    id: 'b2-mc-3',
    bab: 2,
    babTitle: 'Bab 2: Tipe Data & Variabel',
    type: 'multiple_choice',
    difficulty: 'hard',
    question: 'Manakah dari nilai-nilai berikut yang dievaluasi sebagai `True` ketika dikonversi dengan fungsi `bool()` di Python?',
    options: [
      'bool(0)',
      'bool("")',
      'bool("False")',
      'bool([])'
    ],
    correctAnswer: 2,
    explanation: 'Di Python, falsy values mencakup bilangan 0, string kosong `""`, list kosong `[]`, None, dan dict kosong `{}`. Sedangkan string `"False"` adalah string tak kosong (berisi 5 karakter), sehingga `bool("False")` menghasilkan `True`.'
  },
  {
    id: 'b2-tf-1',
    bab: 2,
    babTitle: 'Bab 2: Tipe Data & Variabel',
    type: 'true_false',
    difficulty: 'easy',
    statement: 'Menurut konvensi PEP 8, konstanta (nilai yang tidak boleh diubah) dalam Python dianjurkan ditulis menggunakan huruf kapital penuh dengan garis bawah (contoh: `MAX_BUFFER_SIZE = 1024`).',
    correctAnswer: true,
    explanation: 'Benar. Panduan PEP 8 merekomendasikan penulisan konstanta dalam huruf kapital penuh (UPPER_CASE_WITH_UNDERSCORES) sebagai konvensi bagi programmer lain, meskipun Python tidak memiliki keyword pembatas mutasi seperti `const`.'
  },
  {
    id: 'b2-tf-2',
    bab: 2,
    babTitle: 'Bab 2: Tipe Data & Variabel',
    type: 'true_false',
    difficulty: 'medium',
    statement: 'Struktur data List bersifat mutable (dapat dimodifikasi elemennya), sedangkan Tuple bersifat immutable (elemennya tidak dapat diubah setelah didefinisikan).',
    correctAnswer: true,
    explanation: 'Benar. List `[1, 2, 3]` mendukung operasi manipulasi elemen in-place seperti `.append()`, `.pop()`, atau penugasan indeks `list[0] = 9`. Sedangkan Tuple `(1, 2, 3)` bersifat immutable dan akan melempar TypeError jika elemennya diubah.'
  },
  {
    id: 'b2-tf-3',
    bab: 2,
    babTitle: 'Bab 2: Tipe Data & Variabel',
    type: 'true_false',
    difficulty: 'hard',
    statement: 'Nama variabel Python boleh diawali dengan angka selama tidak mengandung simbol matematika khusus (misalnya `1st_score = 95`).',
    correctAnswer: false,
    explanation: 'Salah. Aturan sintaks identifikasi Python melarang keras variabel diawali dengan angka. Variabel harus diawali dengan huruf (a-z, A-Z) atau garis bawah (underscore `_`).'
  },

  // =========================================================================
  // BAB 3: SEARCHING & SORTING
  // =========================================================================
  {
    id: 'b3-mc-1',
    bab: 3,
    babTitle: 'Bab 3: Searching & Sorting',
    type: 'multiple_choice',
    difficulty: 'easy',
    question: 'Apa prasyarat mutlak yang wajib dipenuhi agar algoritma Binary Search (Pencarian Biner) dapat berjalan dengan benar?',
    options: [
      'Data harus bertipe string alfabetik',
      'Data harus memiliki jumlah elemen genap',
      'Koleksi data harus sudah terurut (sorted)',
      'Data tidak boleh mengandung angka negatif'
    ],
    correctAnswer: 2,
    explanation: 'Binary Search menerapkan paradigma divide-and-conquer dengan membandingkan target terhadap elemen tengah. Jika data tidak terurut, eliminasi separuh wilayah pencarian tidak dapat dilakukan dan algoritma akan gagal.'
  },
  {
    id: 'b3-mc-2',
    bab: 3,
    babTitle: 'Bab 3: Searching & Sorting',
    type: 'multiple_choice',
    difficulty: 'medium',
    question: 'Pada implementasi standar Binary Search dengan pointer `low` dan `high`, rumus integer division yang tepat untuk menghitung indeks tengah (`mid`) di Python adalah...',
    options: [
      'mid = (low + high) / 2',
      'mid = (low + high) // 2',
      'mid = (high - low) // 2',
      'mid = len(data) // 2'
    ],
    correctAnswer: 1,
    explanation: 'Di Python, operator integer division `//` digunakan untuk menghasilkan indeks bilangan bulat `(low + high) // 2`. Jika menggunakan `/`, hasilnya bertipe float yang akan memicu TypeError saat mengakses indeks array.'
  },
  {
    id: 'b3-mc-3',
    bab: 3,
    babTitle: 'Bab 3: Searching & Sorting',
    type: 'multiple_choice',
    difficulty: 'hard',
    question: 'Diberikan array `[5, 1, 4, 2, 8]`. Bagaimanakah susunan array setelah **pass pertama (iterasi luar ke-1)** pada algoritma Bubble Sort selesai dieksekusi?',
    codeSnippet: '# Array awal: [5, 1, 4, 2, 8]\n# Bubble Sort membandingkan pasangan berdekatan\n# dan menggeser elemen terbesar ke kanan...',
    options: [
      '[1, 4, 2, 5, 8]',
      '[1, 2, 4, 5, 8]',
      '[5, 4, 2, 1, 8]',
      '[1, 5, 4, 2, 8]'
    ],
    correctAnswer: 0,
    explanation: 'Pass ke-1 membandingkan:\n- 5 & 1 -> tukar -> [1, 5, 4, 2, 8]\n- 5 & 4 -> tukar -> [1, 4, 5, 2, 8]\n- 5 & 2 -> tukar -> [1, 4, 2, 5, 8]\n- 5 & 8 -> tidak tukar -> [1, 4, 2, 5, 8]\nElemen terbesar (8) telah mencapai posisi akhir.'
  },
  {
    id: 'b3-tf-1',
    bab: 3,
    babTitle: 'Bab 3: Searching & Sorting',
    type: 'true_false',
    difficulty: 'easy',
    statement: 'Kompleksitas waktu kasus terburuk (worst case) dari pencarian biner (Binary Search) adalah O(log n), sedangkan pencarian linear (Linear Search) adalah O(n).',
    correctAnswer: true,
    explanation: 'Benar. Karena Binary Search membagi ruang pencarian menjadi dua pada setiap langkah, kompleksitas terburuknya adalah O(log n). Linear Search harus memeriksa elemen satu per satu hingga akhir sehingga O(n).'
  },
  {
    id: 'b3-tf-2',
    bab: 3,
    babTitle: 'Bab 3: Searching & Sorting',
    type: 'true_false',
    difficulty: 'medium',
    statement: 'Pada kasus terbaik (best case) di mana data input sudah terurut sempurna, kompleksitas waktu Insertion Sort adalah O(n).',
    correctAnswer: true,
    explanation: 'Benar. Ketika array sudah terurut, inner loop Insertion Sort langsung berhenti pada perbandingan pertama untuk setiap elemen, sehingga hanya melakukan n-1 perbandingan linear atau O(n).'
  },
  {
    id: 'b3-tf-3',
    bab: 3,
    babTitle: 'Bab 3: Searching & Sorting',
    type: 'true_false',
    difficulty: 'hard',
    statement: 'Algoritma Bubble Sort bekerja dengan strategi Divide and Conquer (Bagi dan Taklukkan), persis seperti Binary Search.',
    correctAnswer: false,
    explanation: 'Salah. Bubble Sort bekerja secara iteratif berbasis perbandingan bertetangga dan penukaran (Brute Force / Comparison-based), bukan memecah masalah menjadi sub-masalah independen (Divide and Conquer).'
  },

  // =========================================================================
  // BAB 4: KONTROL ALUR & PENANGANAN ERROR
  // =========================================================================
  {
    id: 'b4-mc-1',
    bab: 4,
    babTitle: 'Bab 4: Kontrol Alur & Error',
    type: 'multiple_choice',
    difficulty: 'easy',
    question: 'Manakah urutan prioritas evaluasi (precedence) yang benar untuk operator logika di Python dari yang tertinggi hingga terendah?',
    options: [
      'or -> and -> not',
      'and -> or -> not',
      'not -> and -> or',
      'not -> or -> and'
    ],
    correctAnswer: 2,
    explanation: 'Dalam hierarki operator logika Python, `not` dievaluasi paling awal (tertinggi), diikuti oleh operator perkalian logika `and`, dan terakhir operator penjumlahan logika `or`.'
  },
  {
    id: 'b4-mc-2',
    bab: 4,
    babTitle: 'Bab 4: Kontrol Alur & Error',
    type: 'multiple_choice',
    difficulty: 'medium',
    question: 'Perhatikan kode penanganan exception berikut. Apakah yang akan dicetak di konsol saat kode dieksekusi?',
    codeSnippet: 'try:\n    angka = 10 / 0\nexcept ZeroDivisionError:\n    print("Error terdeteksi!", end=" ")\nfinally:\n    print("Pembersihan selesai!")',
    options: [
      'Pembersihan selesai!',
      'Error terdeteksi! Pembersihan selesai!',
      'ZeroDivisionError (Program Crash)',
      'Error terdeteksi!'
    ],
    correctAnswer: 1,
    explanation: 'Pembagian `10 / 0` memicu `ZeroDivisionError`, sehingga blok `except` dieksekusi dan mencetak "Error terdeteksi! ". Selanjutnya, blok `finally` dijamin SELALU dieksekusi apapun yang terjadi, sehingga mencetak "Pembersihan selesai!".'
  },
  {
    id: 'b4-mc-3',
    bab: 4,
    babTitle: 'Bab 4: Kontrol Alur & Error',
    type: 'multiple_choice',
    difficulty: 'hard',
    question: 'Berapakah output dari List Comprehension berkondisi berikut ini?',
    codeSnippet: 'hasil = [x ** 2 for x in range(6) if x % 2 == 1]\nprint(hasil)',
    options: [
      '[0, 4, 16]',
      '[1, 9, 25]',
      '[1, 3, 5]',
      '[0, 1, 4, 9, 16, 25]'
    ],
    correctAnswer: 1,
    explanation: '`range(6)` menghasilkan angka 0, 1, 2, 3, 4, 5. Kondisi `if x % 2 == 1` hanya menyaring angka ganjil: 1, 3, dan 5. Kemudian masing-masing dikuadratkan: 1**2=1, 3**2=9, 5**2=25. Hasil akhirnya adalah [1, 9, 25].'
  },
  {
    id: 'b4-tf-1',
    bab: 4,
    babTitle: 'Bab 4: Kontrol Alur & Error',
    type: 'true_false',
    difficulty: 'easy',
    statement: 'Pernyataan `continue` berfungsi menghentikan seluruh perulangan seketika, sedangkan `break` hanya melewati sisa kode iterasi saat ini dan melompat ke iterasi berikutnya.',
    correctAnswer: false,
    explanation: 'Salah. Definisi tersebut terbalik! `break` yang menghentikan loop sepenuhnya, sedangkan `continue` yang melewati sisa kode iterasi saat ini untuk melanjutkan ke iterasi berikutnya.'
  },
  {
    id: 'b4-tf-2',
    bab: 4,
    babTitle: 'Bab 4: Kontrol Alur & Error',
    type: 'true_false',
    difficulty: 'medium',
    statement: 'Blok `finally` dalam konstruksi `try-except-finally` dijamin akan selalu dieksekusi, baik ketika tidak terjadi exception, maupun ketika terjadi exception yang tertangkap.',
    correctAnswer: true,
    explanation: 'Benar. Blok `finally` dirancang khusus untuk rutinitas pembersihan (cleanup actions seperti menutup file atau koneksi database) dan dipastikan selalu dieksekusi sebelum meninggalkan blok try.'
  },
  {
    id: 'b4-tf-3',
    bab: 4,
    babTitle: 'Bab 4: Kontrol Alur & Error',
    type: 'true_false',
    difficulty: 'hard',
    statement: 'Ekspresi Python `True or False and False` akan bernilai `False` karena evaluasi dibaca dari kiri ke kanan secara berurutan.',
    correctAnswer: false,
    explanation: 'Salah. Operator `and` memiliki prioritas lebih tinggi daripada `or`. Sehingga `False and False` dihitung lebih dulu menghasilkan `False`. Kemudian `True or False` dievaluasi menghasilkan `True`!'
  },

  // =========================================================================
  // BAB 5: STUDI KASUS PRAKTIS
  // =========================================================================
  {
    id: 'b5-mc-1',
    bab: 5,
    babTitle: 'Bab 5: Studi Kasus Praktis',
    type: 'multiple_choice',
    difficulty: 'medium',
    question: 'Berdasarkan algoritma Kalender Gregorian pada studi kasus Bab 5, manakah kondisi logika Python yang benar untuk menentukan apakah variabel `tahun` merupakan tahun kabisat?',
    options: [
      '(tahun % 4 == 0)',
      '(tahun % 4 == 0 and tahun % 100 != 0) or (tahun % 400 == 0)',
      '(tahun % 4 == 0 and tahun % 400 == 0) or (tahun % 100 == 0)',
      '(tahun % 400 == 0) and (tahun % 100 != 0)'
    ],
    correctAnswer: 1,
    explanation: 'Aturan kalender Gregorian: Suatu tahun adalah kabisat jika habis dibagi 4 KECUALI tahun abad (kelipatan 100) yang bukan kelipatan 400. Contohnya 2000 kabisat, namun 1900 bukan kabisat.'
  },
  {
    id: 'b5-mc-2',
    bab: 5,
    babTitle: 'Bab 5: Studi Kasus Praktis',
    type: 'multiple_choice',
    difficulty: 'easy',
    question: 'Perhatikan teknik slicing string Python berikut:\n\nApakah hasil cetak dari variabel `dibalik`?',
    codeSnippet: 'teks = "ALGORITMA"\ndibalik = teks[::-1]\nprint(dibalik)',
    options: [
      'ALGORITMA',
      'AMTIROGLA',
      'AMTROGLA',
      'None'
    ],
    correctAnswer: 1,
    explanation: 'Sintaks slice `[start:stop:step]` dengan `step = -1` tanpa menentukan start dan stop akan melintasi seluruh string secara terbalik dari indeks terakhir ke awal, menghasilkan "AMTIROGLA".'
  },
  {
    id: 'b5-mc-3',
    bab: 5,
    babTitle: 'Bab 5: Studi Kasus Praktis',
    type: 'multiple_choice',
    difficulty: 'hard',
    question: 'Perhatikan manipulasi list dengan method `.append()` dan `.extend()` berikut:\n\nBerapakah panjang `len(a)` dan `len(b)` setelah eksekusi?',
    codeSnippet: 'a = [1, 2]\na.append([3, 4])\n\nb = [1, 2]\nb.extend([3, 4])\n\nprint(len(a), len(b))',
    options: [
      '4 4',
      '3 4',
      '4 3',
      '3 3'
    ],
    correctAnswer: 1,
    explanation: 'Method `.append([3, 4])` memasukkan seluruh list `[3, 4]` sebagai 1 elemen tunggal bersarang sehingga `a` menjadi `[1, 2, [3, 4]]` (panjang 3). Sedangkan `.extend([3, 4])` membongkar dan menambahkan masing-masing elemen sehingga `b` menjadi `[1, 2, 3, 4]` (panjang 4).'
  },
  {
    id: 'b5-tf-1',
    bab: 5,
    babTitle: 'Bab 5: Studi Kasus Praktis',
    type: 'true_false',
    difficulty: 'easy',
    statement: 'Pada studi kasus Game Batu-Gunting-Kertas, fungsi bawaan `random.choice(pilihan_list)` digunakan untuk memilih satu elemen secara acak dari sebuah list pilihan.',
    correctAnswer: true,
    explanation: 'Benar. Modul `random` menyediakan fungsi `choice()` yang menerima urutan (sequence seperti list/tuple) dan mengembalikan satu elemen acak dari koleksi tersebut.'
  },
  {
    id: 'b5-tf-2',
    bab: 5,
    babTitle: 'Bab 5: Studi Kasus Praktis',
    type: 'true_false',
    difficulty: 'medium',
    statement: 'Fungsi `hitung_faktorial(5)` yang menggunakan perulangan `for i in range(1, n + 1): faktorial *= i` akan menghasilkan nilai keluaran 120.',
    correctAnswer: true,
    explanation: 'Benar. Faktorial dari 5 ($5!$) adalah perkalian $1 \\times 2 \\times 3 \\times 4 \\times 5 = 120$.'
  },
  {
    id: 'b5-tf-3',
    bab: 5,
    babTitle: 'Bab 5: Studi Kasus Praktis',
    type: 'true_false',
    difficulty: 'hard',
    statement: 'Dalam penanganan input pada studi kasus aplikasi berbasis terminal, pola `while True` yang dipadukan dengan `try-except` dan `break` digunakan untuk memaksa pengulangan hingga pengguna memasukkan data yang valid.',
    correctAnswer: true,
    explanation: 'Benar. Ini adalah idiom pemrograman Python standar untuk sanitasi input: loop terus berjalan hingga input berhasil dikonversi di dalam blok `try`, yang kemudian mengeksekusi `break` untuk keluar.'
  },

  // =========================================================================
  // SOAL TAMBAHAN PENGAYAAN S1 TINGKAT LANJUT
  // =========================================================================
  {
    id: 'bonus-mc-1',
    bab: 2,
    babTitle: 'Bab 2: Tipe Data & Variabel',
    type: 'multiple_choice',
    difficulty: 'medium',
    question: 'Di Python, apakah tipe data dari variabel `x` jika dideklarasikan sebagai `x = (42)` dibandingkan dengan `y = (42,)`?',
    options: [
      'x adalah tuple, y adalah tuple',
      'x adalah integer, y adalah tuple',
      'x adalah tuple, y adalah integer',
      'x adalah syntax error'
    ],
    correctAnswer: 1,
    explanation: 'Tanda kurung tunggal tanpa koma `(42)` hanya dianggap sebagai pengelompokan ekspresi matematis biasa bertipe `int`. Untuk membuat tuple 1 elemen (singleton tuple), wajib menyertakan tanda koma di akhir: `(42,)`.'
  },
  {
    id: 'bonus-tf-1',
    bab: 4,
    babTitle: 'Bab 4: Kontrol Alur & Error',
    type: 'true_false',
    difficulty: 'medium',
    statement: 'Di Python, klausa `else` pada perulangan `while` atau `for` akan dieksekusi jika perulangan dihentikan secara paksa oleh pernyataan `break`.',
    correctAnswer: false,
    explanation: 'Salah. Klausa `else` pada perulangan Python HANYA dieksekusi jika perulangan selesai secara normal sampai batas akhir, dan TIDAK AKAN dieksekusi jika perulangan terinterupsi oleh `break`.'
  },
  {
    id: 'bonus-mc-2',
    bab: 3,
    babTitle: 'Bab 3: Searching & Sorting',
    type: 'multiple_choice',
    difficulty: 'hard',
    question: 'Berapakah jumlah perbandingan maksimal yang dilakukan oleh Binary Search untuk mencari elemen dalam array terurut dengan 1024 elemen pada kasus terburuk?',
    options: [
      '1024 kali',
      '512 kali',
      '10 atau 11 kali (O(log₂ 1024))',
      '1 kali'
    ],
    correctAnswer: 2,
    explanation: 'Binary Search memiliki kompleksitas waktu O(log₂ n). Untuk n = 1024, log₂ 1024 = 10. Artinya dalam kasus terburuk hanya diperlukan maksimal 10 hingga 11 perbandingan!'
  }
];
