# CoralLink — Backend Requirements Specification

Dokumen ini disusun sebagai panduan teknis bagi Backend Developer. Frontend CoralLink saat ini berjalan menggunakan sistem **Mock Data** (`localStorage` dan `React Context`) yang dirancang semirip mungkin dengan struktur REST API. 

Tugas backend developer adalah mengganti logika lokal tersebut dengan Database nyata dan RESTful API.

---

##  1. Arsitektur & Autentikasi (RBAC)

Aplikasi ini menggunakan **Role-Based Access Control (RBAC)** dengan dua peran (role) utama:
1. `user` (Investor): Dapat melihat proyek, berinvestasi, dan melihat riwayat profil.
2. `admin`: Dapat menggunakan fitur AI untuk mengunggah proyek baru dan mengupdate milestone proyek.

**Sistem Auth yang dibutuhkan:**
* Menggunakan **JSON Web Tokens (JWT)**.
* Endpoint API harus diamankan dengan *Middleware* verifikasi token dan pengecekan role.

---

## 2. Database Schema (Rekomendasi)

Berikut adalah struktur koleksi (MongoDB) atau tabel (PostgreSQL/MySQL) yang dibutuhkan berdasarkan struktur state di frontend:

### A. Tabel/Koleksi `Users`
| Field | Tipe Data | Keterangan |
|---|---|---|
| `id` | UUID/ObjectId | Primary Key |
| `name` | String | Nama lengkap |
| `email` | String | Unik |
| `password_hash` | String | Bcrypt hash |
| `phone` | String | Opsional |
| `role` | Enum | `['user', 'admin']` (Default: `user`) |
| `created_at` | Timestamp | - |

### B. Tabel/Koleksi `Projects`
*Menyimpan data katalog proyek restorasi.*
| Field | Tipe Data | Keterangan |
|---|---|---|
| `id` | String | Slug unik (misal: `acropora-cervicornis`) |
| `name` | String | Judul Proyek |
| `subtitle` | String | Subjudul |
| `description` | Text | Penjelasan detail proyek |
| `location` | String | Lokasi laut/pantai |
| `species` | String | Spesies karang |
| `image_url` | String | Link gambar (Cloudinary/S3) |
| `goal` | Object / JSON | `{ fragments: String, area: String, duration: String }` |
| `fundingTarget` | String/Number | Target dana (Rupiah) |
| `fundingPercent` | Number | Persentase terkumpul (0-100) |
| `milestones` | Array of JSON | Daftar milestone (Phase 1, 2, dll). Masing-masing memiliki properti `done` (boolean). |
| `ai_analysis` | Object / JSON | Menyimpan hasil deteksi: `{ condition: String, confidenceScore: String, analysisStatus: String }` |

### C. Tabel/Koleksi `Transactions`
*Menyimpan riwayat investasi pengguna.*
| Field | Tipe Data | Keterangan |
|---|---|---|
| `id` | UUID/ObjectId | Primary Key |
| `user_id` | UUID/ObjectId | Foreign Key ke `Users` |
| `project_id` | String | Foreign Key ke `Projects` |
| `amount` | Number/String | Nominal investasi |
| `type` | String | Misal: `"One-Time Contribution"` |
| `status` | Enum | `['Pending', 'Completed', 'Failed']` |
| `proof_url` | String | Link gambar bukti transfer (Cloudinary/S3) |
| `created_at` | Timestamp | Tanggal transaksi |

---

##  3. Daftar Endpoint REST API yang Dibutuhkan

Berikut adalah daftar endpoint yang perlu dibuat oleh Backend. Di frontend, panggilan `fetch` atau `axios` akan diarahkan ke endpoint ini.

###  Autentikasi
* `POST /api/auth/register` : Menerima `name, email, password, phone`. Mengembalikan token JWT.
* `POST /api/auth/login` : Menerima `email, password`. Mengembalikan token JWT dan data user (termasuk `role`).
* `GET /api/auth/me` : Memvalidasi token JWT dan mengembalikan profil user yang sedang aktif.

###  Manajemen Proyek (Projects)
* `GET /api/projects` : **(Public)** Mengambil semua daftar proyek (untuk Beranda dan katalog Invest).
* `GET /api/projects/:id` : **(Public)** Mengambil detail satu proyek berdasarkan ID/slug.
* `POST /api/projects` : **(Admin Only)** Menerima payload JSON lengkap beserta gambar cover proyek baru. Backend perlu mengunggah gambar ke cloud storage sebelum menyimpan ke DB.
* `PUT /api/projects/:id/milestones` : **(Admin Only)** Menerima update array milestones untuk mengubah status dari "Not Started" menjadi "Complete".

###  Investasi & Transaksi
* `POST /api/transactions` : **(User Only)** Menerima data investasi (ID proyek, nominal) beserta *file gambar bukti transfer*. Backend menyimpannya dengan status default `Pending`.
* `GET /api/transactions/me` : **(User Only)** Mengambil riwayat investasi khusus milik user yang sedang login (untuk dirender di halaman `UserProfile.jsx`).
* `GET /api/transactions` : **(Admin Only - Opsional)** Untuk dashboard admin jika ke depannya ada fitur verifikasi pembayaran manual.

---

## 4. Integrasi Layanan Pihak Ketiga (Third-Party Services)

1. **AI Model API (Sudah Ada)**
   * Saat mengupload proyek, frontend saat ini menembak API AI eksternal `https://api.corallink.web.id/predict` untuk memverifikasi karang mati. 
   * **Catatan untuk Backend:** Backend tidak perlu memproses AI ini, karena frontend sudah menanganinya secara independen. Backend hanya bertugas menerima payload text hasil AI tersebut saat `POST /api/projects`.
2. **File Storage (Multer / Cloudinary / AWS S3)**
   * Dibutuhkan sistem penyimpanan *Multipart/Form-Data* untuk menangani:
     1. Gambar unggahan bukti pembayaran (dari user).
     2. Gambar cover proyek baru (dari admin).

---

## 5. Catatan Transisi untuk Frontend Developer (Bila Backend Sudah Siap)

Jika API sudah siap dan dideploy (misal di Railway/Render), Frontend Developer hanya perlu:
1. Menghapus folder `src/data/projects.js`.
2. Mengubah `ProjectContext.jsx` agar menggunakan `fetch/axios` ke `/api/projects` (bukan dari array lokal).
3. Mengubah `AuthContext.jsx` agar menyimpan JWT di cookies/localStorage dan mengirimnya via header `Authorization: Bearer <token>`.
4. Mengganti semua fungsi sinkron di form menjadi *asynchronous* (`await axios.post()`).