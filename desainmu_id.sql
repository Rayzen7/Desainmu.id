-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Waktu pembuatan: 13 Bulan Mei 2025 pada 02.36
-- Versi server: 8.0.30
-- Versi PHP: 8.3.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `desainmu.id`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `adonis_schema`
--

CREATE TABLE `adonis_schema` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `batch` int NOT NULL,
  `migration_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `adonis_schema`
--

INSERT INTO `adonis_schema` (`id`, `name`, `batch`, `migration_time`) VALUES
(20, 'database/migrations/1745244227302_create_roles_table', 1, '2025-04-21 23:34:04'),
(21, 'database/migrations/1745244088925_create_users_table', 2, '2025-04-21 23:35:29'),
(22, 'database/migrations/1745244088930_create_access_tokens_table', 2, '2025-04-21 23:35:29'),
(23, 'database/migrations/1745244977287_create_categories_table', 3, '2025-04-21 23:35:39'),
(24, 'database/migrations/1745244992965_create_products_table', 3, '2025-04-21 23:35:40'),
(25, 'database/migrations/1745245181033_create_comments_table', 3, '2025-04-21 23:35:40'),
(26, 'database/migrations/1745247588511_create_transactions_table', 3, '2025-04-21 23:35:40'),
(27, 'database/migrations/1745247775644_create_chats_table', 3, '2025-04-21 23:35:40'),
(28, 'database/migrations/1745248040529_create_feedbacks_table', 3, '2025-04-21 23:35:40'),
(31, 'database/migrations/1746361506115_create_room_chats_table', 4, '2025-05-04 13:12:00'),
(32, 'database/migrations/1746364507062_create_chats_table', 5, '2025-05-04 13:15:27');

-- --------------------------------------------------------

--
-- Struktur dari tabel `adonis_schema_versions`
--

CREATE TABLE `adonis_schema_versions` (
  `version` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `adonis_schema_versions`
--

INSERT INTO `adonis_schema_versions` (`version`) VALUES
(2);

-- --------------------------------------------------------

--
-- Struktur dari tabel `auth_access_tokens`
--

CREATE TABLE `auth_access_tokens` (
  `id` int UNSIGNED NOT NULL,
  `tokenable_id` int UNSIGNED NOT NULL,
  `type` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `hash` varchar(255) NOT NULL,
  `abilities` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `categories`
--

CREATE TABLE `categories` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `categories`
--

INSERT INTO `categories` (`id`, `name`, `created_at`, `updated_at`) VALUES
(3, 'Casing', '2025-04-26 11:25:46', '2025-04-26 11:25:46'),
(4, 'Plaque', '2025-04-26 11:25:55', '2025-04-26 11:25:55'),
(5, 'Stickers', '2025-04-26 11:26:00', '2025-04-26 11:26:00'),
(6, 'Totebag', '2025-04-26 11:26:08', '2025-04-26 11:26:08'),
(7, 'Glass & Tumbler', '2025-04-26 11:26:13', '2025-04-26 11:26:13'),
(8, 'Keychain', '2025-04-26 11:26:19', '2025-04-26 11:26:19'),
(9, 'Book Cover', '2025-04-26 11:26:29', '2025-04-26 11:26:29'),
(10, 'Packaging', '2025-04-26 11:26:38', '2025-04-26 11:26:38'),
(11, 'Puzzle', '2025-04-26 11:26:46', '2025-04-26 11:26:46'),
(12, 'Shirt', '2025-04-27 16:13:19', '2025-04-27 16:13:22');

-- --------------------------------------------------------

--
-- Struktur dari tabel `chats`
--

CREATE TABLE `chats` (
  `id` int UNSIGNED NOT NULL,
  `sender` int UNSIGNED NOT NULL,
  `message` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `room_id` int UNSIGNED DEFAULT NULL,
  `receiver` int UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `chats`
--

INSERT INTO `chats` (`id`, `sender`, `message`, `image`, `room_id`, `receiver`, `created_at`, `updated_at`) VALUES
(2, 4, 'Halo ini admin2', NULL, 2, 11, '2025-05-04 14:11:10', '2025-05-04 14:11:10'),
(18, 4, 'Hai', NULL, 3, 2, '2025-05-04 10:05:51', '2025-05-04 10:05:51'),
(19, 2, 'Hai apa ada yang ingin saya bantu?', NULL, 3, 4, '2025-05-04 10:06:38', '2025-05-04 10:06:38'),
(20, 4, 'Bisa tolong buatin ini ga mas', NULL, 3, 2, '2025-05-04 10:08:28', '2025-05-04 10:08:28'),
(21, 2, 'Apa mas?', NULL, 3, 4, '2025-05-04 10:08:38', '2025-05-04 10:08:38'),
(23, 2, 'Tobat mas..', NULL, 3, 4, '2025-05-04 10:09:19', '2025-05-04 10:09:19'),
(24, 4, 'hehee', NULL, 3, 2, '2025-05-04 20:42:13', '2025-05-04 20:42:13'),
(39, 4, 'test lagi', 'chat/q7v86n0f6n7okw5sgjjwf6d3/Hutao-mywife (1) (1).jpg', 3, 2, '2025-05-05 23:46:27', '2025-05-05 23:46:27'),
(40, 4, 'woy min', NULL, 3, 2, '2025-05-06 21:31:17', '2025-05-06 21:31:17'),
(42, 2, 'hai', NULL, 3, 4, '2025-05-06 21:45:58', '2025-05-06 21:45:58'),
(45, 2, 'halo', NULL, 3, 4, '2025-05-10 08:53:44', '2025-05-10 08:53:44'),
(46, 11, 'Halo', NULL, 2, 4, '2025-05-10 19:20:16', '2025-05-10 19:20:16'),
(47, 11, 'Apa ada hal yang ingin saya bantu', NULL, 2, 4, '2025-05-10 19:20:28', '2025-05-10 19:20:28');

-- --------------------------------------------------------

--
-- Struktur dari tabel `comments`
--

CREATE TABLE `comments` (
  `id` int UNSIGNED NOT NULL,
  `user_id` int UNSIGNED NOT NULL,
  `message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `product_id` int UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `comments`
--

INSERT INTO `comments` (`id`, `user_id`, `message`, `product_id`, `created_at`, `updated_at`) VALUES
(3, 9, 'Case-nya lucu banget dan sesuai dengan ekspektasi! Kualitas cetaknya tajam, warnanya juga gak pudar. Recommended banget buat yang mau custom case unik dan awet!', 6, '2025-04-29 09:14:33', '2025-04-29 09:14:33'),
(4, 9, 'Totebag Black Cat ini benar-benar melebihi ekspektasi aku. Bahan tasnya tebal dan kuat, cocok banget dipakai buat bawa buku atau belanja ringan. Desainnya simpel tapi elegan, dengan gambar kucing hitam yang bikin kelihatan unik dan beda dari totebag biasa. Aku sering dapet pujian waktu bawa tas ini ke kampus atau nongkrong bareng teman. Buat pecinta kucing dan penggemar fashion minimalis, ini wajib banget punya!', 4, '2025-04-29 09:19:23', '2025-04-29 09:19:23'),
(8, 4, 'Totebag-nya keren banget, desain kucing hitamnya simpel tapi menarik! Bahannya juga tebal dan kuat, cocok buat dibawa kuliah atau jalan-jalan. Buat pecinta kucing, ini wajib punya!', 4, '2025-05-05 20:20:44', '2025-05-05 20:20:44');

-- --------------------------------------------------------

--
-- Struktur dari tabel `feedbacks`
--

CREATE TABLE `feedbacks` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `comment` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `feedbacks`
--

INSERT INTO `feedbacks` (`id`, `name`, `comment`, `created_at`, `updated_at`) VALUES
(2, 'Test Feedback', 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Fugiat deleniti debitis doloribus dolores, delectus dolor aut soluta beatae eaque eius nisi quis cupiditate, earum vel? Nisi ipsa doloribus tempore ratione.', '2025-04-27 05:01:57', '2025-04-27 05:01:57'),
(6, 'Test Feedback', 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Fugiat deleniti debitis doloribus dolores, delectus dolor aut soluta beatae eaque eius nisi quis cupiditate, earum vel? Nisi ipsa doloribus tempore ratione.', '2025-04-27 05:01:57', '2025-04-27 05:01:57'),
(7, 'Test Feedback', 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Fugiat deleniti debitis doloribus dolores, delectus dolor aut soluta beatae eaque eius nisi quis cupiditate, earum vel? Nisi ipsa doloribus tempore ratione.', '2025-04-27 05:01:57', '2025-04-27 05:01:57'),
(8, 'Test Feedback', 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Fugiat deleniti debitis doloribus dolores, delectus dolor aut soluta beatae eaque eius nisi quis cupiditate, earum vel? Nisi ipsa doloribus tempore ratione.', '2025-04-27 05:01:57', '2025-04-27 05:01:57');

-- --------------------------------------------------------

--
-- Struktur dari tabel `products`
--

CREATE TABLE `products` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `quantity` int NOT NULL,
  `price` int NOT NULL,
  `category_id` int UNSIGNED NOT NULL,
  `created_by` int UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `products`
--

INSERT INTO `products` (`id`, `name`, `image`, `description`, `quantity`, `price`, `category_id`, `created_by`, `created_at`, `updated_at`) VALUES
(3, 'Tumbler with Abstract', 'product/tumbler.png', 'Stay refreshed in style with our Abstract Design Tumbler.\r\nFeaturing a modern, eye-catching abstract pattern, this tumbler is the perfect companion for your coffee, tea, or favorite cold drinks.', 25, 125000, 7, 2, '2025-04-26 11:56:45', '2025-05-09 06:32:14'),
(4, 'Totebag black cat', 'product/totebag.png', 'Carry your essentials with style and a hint of mystery.\nOur Black Cat Totebag features a sleek, minimalist black design with an adorable cat motif — perfect for cat lovers and trendsetters alike.', 19, 80000, 6, 2, '2025-04-27 07:54:17', '2025-05-01 21:09:39'),
(6, 'Casing HP Cute', 'product/casing.png', 'Confused to find a unique and quality custom photo case? We provide custom photo softcase with HD printing, durable, and can be customized according to your wishes!', 25, 35000, 3, 2, '2025-04-28 18:32:03', '2025-05-02 00:08:07');

-- --------------------------------------------------------

--
-- Struktur dari tabel `roles`
--

CREATE TABLE `roles` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `roles`
--

INSERT INTO `roles` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'Super Admin', NULL, NULL),
(2, 'Admin', NULL, NULL),
(3, 'User', NULL, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `room_chats`
--

CREATE TABLE `room_chats` (
  `id` int UNSIGNED NOT NULL,
  `sender` int UNSIGNED NOT NULL,
  `receiver` int UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `room_chats`
--

INSERT INTO `room_chats` (`id`, `sender`, `receiver`, `created_at`, `updated_at`) VALUES
(2, 4, 11, '2025-05-04 14:10:16', '2025-05-04 14:10:16'),
(3, 4, 2, '2025-05-04 10:04:56', '2025-05-04 10:04:56');

-- --------------------------------------------------------

--
-- Struktur dari tabel `transactions`
--

CREATE TABLE `transactions` (
  `id` int UNSIGNED NOT NULL,
  `user_id` int UNSIGNED NOT NULL,
  `product_id` int UNSIGNED NOT NULL,
  `quantity` int NOT NULL,
  `total` int NOT NULL,
  `status` enum('packed','delivered','finished','canceled') DEFAULT 'packed',
  `delivered_status_1` text,
  `delivered_status_2` text,
  `delivered_status_3` text,
  `delivered_status_4` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `transactions`
--

INSERT INTO `transactions` (`id`, `user_id`, `product_id`, `quantity`, `total`, `status`, `delivered_status_1`, `delivered_status_2`, `delivered_status_3`, `delivered_status_4`, `created_at`, `updated_at`) VALUES
(2, 9, 4, 2, 160000, 'packed', 'package has been handed over at the nearest JNT', NULL, NULL, NULL, '2025-04-27 23:49:49', '2025-04-27 23:49:49'),
(28, 4, 4, 2, 160000, 'finished', 'package has been handed over at the nearest JNE', 'Packages being sorted at DC Cakung', 'The package is being delivered to your house', 'Your package has arrived at your house', '2025-04-28 19:53:34', '2025-04-28 19:53:34'),
(29, 9, 6, 1, 35000, 'packed', 'package has been handed over at the nearest JNE', NULL, NULL, NULL, '2025-04-28 20:48:35', '2025-04-28 20:48:35'),
(45, 4, 3, 2, 250000, 'delivered', 'Package has been handed over at the nearest JNE', 'Packages being sorted at DC Cakung', 'The package is being delivered to your house', NULL, '2025-05-01 04:42:29', '2025-05-01 04:42:29'),
(49, 4, 6, 3, 105000, 'packed', NULL, NULL, NULL, NULL, '2025-05-01 00:08:07', '2025-05-10 08:56:39'),
(50, 4, 3, 1, 125000, 'canceled', NULL, NULL, NULL, NULL, '2025-05-02 00:38:22', '2025-05-02 00:38:22');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int UNSIGNED NOT NULL,
  `username` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `email` varchar(254) NOT NULL,
  `password` varchar(255) NOT NULL,
  `no_hp` varchar(50) DEFAULT NULL,
  `date_of_birth` varchar(255) DEFAULT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `gender` enum('Male','Female') DEFAULT NULL,
  `role_id` int UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `username`, `image`, `email`, `password`, `no_hp`, `date_of_birth`, `address`, `gender`, `role_id`, `created_at`, `updated_at`) VALUES
(1, 'Owner', 'user/william.png', 'superadmin@gmail.com', '$scrypt$n=16384,r=8,p=1$F65zNnF8bqmjlI8bVWiD5w$EEitHmd5JHEEJqyeN66lts7TyVjxXOIL4ol2uAXYtdaO23raXR94Zu1HHjo59XzgYFMVgi2cTaXEQ7SPDebAYA', '81267826718221', '1990-06-13', 'Jl Kemenangan Jaya 78', 'Male', 1, '2025-04-21 17:05:27', '2025-05-12 01:23:54'),
(2, 'Admin', 'user/william.png', 'admin@gmail.com', '$scrypt$n=16384,r=8,p=1$0cytaTF14Bl9fSR/nT9TRg$l4kzVWZpcNjf4h+dRCCUEV8LynOSjNX6O2FBeI5zJfTAmUET93JUP+ZQmTcA5EzHOhLeMaNM6CJAjvXCB8t71g', '629872917218', '1996-01-10', 'JL Malik Sodikin', 'Male', 2, '2025-04-21 18:01:23', '2025-05-12 02:28:52'),
(3, 'User', NULL, 'user@gmail.com', '$scrypt$n=16384,r=8,p=1$b06LnOUyGuUuBBG0WSmWpQ$FBBxDSNILAeKvpAyiJa9QcmiWjSfhT8suWaO2KVkyeBfpNNeicHvqAScl1OhQM8Yk5JyRrvUKs6cJ0X/Sxrvyw', NULL, NULL, NULL, NULL, 3, '2025-04-21 18:43:50', '2025-04-21 18:43:50'),
(4, 'Keisha Maulidia', 'user/img1.png', 'user1@gmail.com', '$scrypt$n=16384,r=8,p=1$5DaYMHA3wElCv6HQBE072g$KTAjkWqkNKaksJstz7uTrg8mYwcGS2uC7od25lV/9zxEZBzwP6u/KaNnMNzAX0Rr5R/reGZ8I2ggkaT8BPcY3A', '6281287928792', '1998-02-02', 'Jl Kenangan Jaya Kusuma', 'Female', 3, '2025-04-22 00:35:15', '2025-05-05 16:28:50'),
(9, 'Gaisha Ramayani', NULL, 'user2@gmail.com', '$scrypt$n=16384,r=8,p=1$pm6+8lE62bbHif7K2YuuMw$TTkUbnIWU9vHECXRyzfKY1P3eIarpgC/hsyp/ziNp5brBxFglPVbShjXKe514i6S1ExohMKhhKueRsD1g4vxcg', '08127821712', '2001-10-01', 'Jl Jaya Kemenangan', 'Female', 3, '2025-04-24 23:29:25', '2025-04-24 23:29:25'),
(11, 'Admin2', 'user/img3.png', 'admin2@gmail.com', '$scrypt$n=16384,r=8,p=1$by/X8y+ka+v0BFCDnz5o5Q$TjwQPFuZylNrdu8dnpL+Wrvgq69CZuWIP1wl4Wr4fwfdE3rIq8Y5YOBDqS8xf4nFnigTEDne2L4GLXiO+DJ8aw', '6212791278212', '2004-01-19', 'Jl Kemana Aja', 'Female', 2, '2025-05-04 04:47:18', '2025-05-10 19:16:31');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `adonis_schema`
--
ALTER TABLE `adonis_schema`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `adonis_schema_versions`
--
ALTER TABLE `adonis_schema_versions`
  ADD PRIMARY KEY (`version`);

--
-- Indeks untuk tabel `auth_access_tokens`
--
ALTER TABLE `auth_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `auth_access_tokens_tokenable_id_foreign` (`tokenable_id`);

--
-- Indeks untuk tabel `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `chats`
--
ALTER TABLE `chats`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chats_sender_foreign` (`sender`),
  ADD KEY `chats_receiver_foreign` (`receiver`),
  ADD KEY `chats_room_id_foreign` (`room_id`);

--
-- Indeks untuk tabel `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `comments_product_id_foreign` (`product_id`),
  ADD KEY `comments_user_id_foreign` (`user_id`);

--
-- Indeks untuk tabel `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `products_category_id_foreign` (`category_id`),
  ADD KEY `products_created_by_foreign` (`created_by`);

--
-- Indeks untuk tabel `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `room_chats`
--
ALTER TABLE `room_chats`
  ADD PRIMARY KEY (`id`),
  ADD KEY `room_chats_sender_foreign` (`sender`),
  ADD KEY `room_chats_receiver_foreign` (`receiver`);

--
-- Indeks untuk tabel `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `transactions_product_id_foreign` (`product_id`),
  ADD KEY `transactions_user_id_foreign` (`user_id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `users_role_id_foreign` (`role_id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `adonis_schema`
--
ALTER TABLE `adonis_schema`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT untuk tabel `auth_access_tokens`
--
ALTER TABLE `auth_access_tokens`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=140;

--
-- AUTO_INCREMENT untuk tabel `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT untuk tabel `chats`
--
ALTER TABLE `chats`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT untuk tabel `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT untuk tabel `feedbacks`
--
ALTER TABLE `feedbacks`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT untuk tabel `products`
--
ALTER TABLE `products`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT untuk tabel `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `room_chats`
--
ALTER TABLE `room_chats`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT untuk tabel `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `auth_access_tokens`
--
ALTER TABLE `auth_access_tokens`
  ADD CONSTRAINT `auth_access_tokens_tokenable_id_foreign` FOREIGN KEY (`tokenable_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `chats`
--
ALTER TABLE `chats`
  ADD CONSTRAINT `chats_receiver_foreign` FOREIGN KEY (`receiver`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `chats_room_id_foreign` FOREIGN KEY (`room_id`) REFERENCES `room_chats` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `chats_sender_foreign` FOREIGN KEY (`sender`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  ADD CONSTRAINT `comments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

--
-- Ketidakleluasaan untuk tabel `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  ADD CONSTRAINT `products_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

--
-- Ketidakleluasaan untuk tabel `room_chats`
--
ALTER TABLE `room_chats`
  ADD CONSTRAINT `room_chats_receiver_foreign` FOREIGN KEY (`receiver`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `room_chats_sender_foreign` FOREIGN KEY (`sender`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  ADD CONSTRAINT `transactions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

--
-- Ketidakleluasaan untuk tabel `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
