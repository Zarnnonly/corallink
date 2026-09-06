# CoralLink ??

CoralLink adalah aplikasi web frontend yang dibangun menggunakan **React 19** dan **Vite**, dirancang sebagai platform untuk mendukung pelestarian ekosistem terumbu karang. Proyek ini menggunakan React Router DOM untuk navigasi antar halaman, Lucide React sebagai library ikon, serta integrasi Vercel Analytics dan Speed Insights untuk pemantauan performa secara real-time.

## Progres Pengembangan

Saat ini struktur halaman utama telah selesai dibangun, mencakup halaman beranda (`Home`), halaman ajakan bertindak (`TakeAction`), halaman sambutan setelah registrasi (`Welcome`), serta halaman autentikasi (`SignIn` dan `SignUp`). Setiap halaman memiliki file JSX dan CSS tersendiri untuk menjaga kerapian kode dan kemudahan pemeliharaan ke depannya.

Komponen-komponen reusable sudah dikembangkan secara modular di dalam folder `components/`, antara lain: `Navbar`, `Hero`, `About`, `VisionMission`, `Projects`, `Impact`, `FAQ`, dan `Footer`. Masing-masing komponen memiliki stylesheet-nya sendiri dan dirancang agar mudah di-*maintain* serta dapat digunakan ulang di berbagai halaman sesuai kebutuhan.

Dari sisi desain, tampilan antarmuka menggunakan pendekatan modern dengan skema warna yang konsisten, tipografi yang bersih, serta tata letak responsif yang ramah berbagai ukuran layar. Halaman autentikasi seperti `SignIn` dan `SignUp` telah memiliki form interaktif dengan styling yang selaras dengan identitas visual CoralLink secara keseluruhan.

Ke depan, pengembangan akan difokuskan pada penyempurnaan konten di setiap komponen, peningkatan animasi dan transisi antarmuka, serta integrasi dengan backend API untuk fungsionalitas autentikasi dan manajemen data pengguna yang sesungguhnya. Proyek ini sudah siap untuk di-*deploy* ke Vercel mengingat konfigurasi analytics dan speed insights sudah terpasang sejak awal.

## Tech Stack

| Teknologi | Versi |
|---|---|
| React | ^19.2.8 |
| Vite | ^8.2.2 |
| React Router DOM | ^7.18.3 |
| Lucide React | ^1.41.0 |
| Vercel Analytics | ^2.0.1 |

## Menjalankan Proyek

```bash
npm install
npm run dev
```
