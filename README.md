# TUGAS BESAR STRATEGI ALGORITMA-PERBANDINGAN ALGORITMA GREEDY DAN BRUTE FORCE DALAM MASALAH PENJADWALAN
### Anggota Kelompok:
- Imelia Dhevita Sari 
- Haidar Sayyid Ramadhan
- Rafelisha Ananfadya

### Deskripsi Tugas
- Latar Belakang:
  Membandingkan efisiensi algoritma greedy dan brute force dalam menyelesaikan permasalahan penjadwalan potong rambut. Penelitian ini bertujuan untuk mengevaluasi kinerja dan akurasi kedua Algoritma dalam permasalahan penjadwalan.

- Data
  Data yang kami duganakan dalam pengerjaan ini mencangkup informasi mengenai nama pelanggan, jenis pelayanan, nama pegai, jam mulai, dan durasi pengerjaan. Jenis data utamanya adalah Data terstruktur, yang mempresentasinkan berbagai skenario penjadwalan yang mungkin terjadi dalam situasi dunia nyata.

- Metode
  Greedy: Membuat pilihan optimal pada setiap langkah dengan harapan langkah solusi tersebut merupakan solusi yang optimal, lalu menentukan durasi waktu yang paling minimum dari keseluruhan data. Hal ini di lakukan terus menerus sampai menemukan solusi yg optimal.
  Brute Force: Mencoba seluruh kombinasi yang kemungkinan menjadi solusi, lalu setelah mendapatkan hasil dari seluruh kemungkinan tersebut maka memilih solusi dengan total waktu yang paling minimum.

### Hasil Analisis
- Brute Force
  Kompleksitas waktu Algoritma Exhaustive Search untuk menyelesaikan permasalahan penjadwalan ini adalah O(n.n!) karena menghitung total waktu dalam sistem untuk setiap kemungkinan
- Greedy
  Memilih pelanggan dengan waktu pelayanan yang terpendek dari himpunan kandidat. Kompleksitas Algoritma Greedy adalah O(n) karena hanya menghitung total waktu dalam sistem.

### Kesimpulan
Dalam permasalah penjadwalan ini kami membandingkan dua algoritma, Greedy dan juga Brute Force. Dan dimana dalam permasalahan ini Algortima Greedy memiliki solusi yang optimal karena sangat efisien untuk permasalahan yang besar. Sedangkan Algoritma Brute Force memberikan solusi yang optimal, namun tidak untuk digunakan dalam masalah besar seperti penjadwalan, karena Brute Force mencoba semua kemungkinan sehingga memakan waktu yang lama.
