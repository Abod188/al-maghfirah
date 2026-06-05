-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: sql111.infinityfree.com
-- Generation Time: 03 يونيو 2026 الساعة 17:39
-- إصدار الخادم: 11.4.12-MariaDB
-- PHP Version: 7.2.22

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `if0_42082343_al_maghfirah`
--

-- --------------------------------------------------------

--
-- بنية الجدول `activities`
--

DROP TABLE IF EXISTS `activities`;
CREATE TABLE `activities` (
  `id` int(10) UNSIGNED NOT NULL,
  `title_ar` varchar(255) NOT NULL,
  `title_en` varchar(255) NOT NULL,
  `desc_ar` text DEFAULT NULL,
  `desc_en` text DEFAULT NULL,
  `image_path` varchar(500) DEFAULT '',
  `is_visible` tinyint(1) UNSIGNED DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `activities`
--

INSERT INTO `activities` (`id`, `title_ar`, `title_en`, `desc_ar`, `desc_en`, `image_path`, `is_visible`, `created_at`) VALUES
(1, 'اليوم القراني', 'Quranic Day', 'اقام مركز المغفرة في تاريخ 2025/5/10 يوم قراني للطلاب المركز الفتية وتخلل البرنامج محاضرة للشيخ محمد الحبيشي وانشطة ترفيهية وتربوية', 'On May 10, 2025, Al-Maghfirah Center held a Quranic Day for the center&#039;s young students. The program included a lecture by Sheikh Muhammad Al-Habishi and recreational and educational activities.', 'uploads/activity_6a1d9615c0cb0.png', 1, '2026-06-01 14:24:21'),
(2, 'يوم عرفة', 'Day of Arafah', 'اقامة حلقة ابو عبيدة بن الجراح وحلقة الشهيد عزالدين القسام برنامج لاستغلال يوم عرفة من سنة 2026 وكان برنامج ايماني وروحاني', 'The Abu Ubaidah ibn al-Jarrah and Martyr Izz ad-Din al-Qassam circles were established as a program to utilize the Day of Arafah in the year 2026, and it was a faith-based and spiritual program.', 'uploads/activity_6a1d96a3dc677.png', 1, '2026-06-01 14:26:43');

-- --------------------------------------------------------

--
-- بنية الجدول `bank_accounts`
--

DROP TABLE IF EXISTS `bank_accounts`;
CREATE TABLE `bank_accounts` (
  `id` int(10) UNSIGNED NOT NULL,
  `bank_name_ar` varchar(150) NOT NULL,
  `bank_name_en` varchar(150) NOT NULL,
  `account_number` varchar(80) NOT NULL,
  `account_holder_ar` varchar(200) NOT NULL,
  `account_holder_en` varchar(200) NOT NULL,
  `is_visible` tinyint(1) UNSIGNED DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `bank_accounts`
--

INSERT INTO `bank_accounts` (`id`, `bank_name_ar`, `bank_name_en`, `account_number`, `account_holder_ar`, `account_holder_en`, `is_visible`, `created_at`) VALUES
(1, 'بنك التضامن الإسلامي الدولي', 'Tadhamon International Islamic Bank', '100-202030-001', 'مركز المغفرة النموذجي لتعليم القرآن', 'Al-Maghfirah Model Quran Center', 1, '2026-06-01 14:12:11'),
(2, 'بنك الكريمي الإسلامي', 'Kuraimi Islamic Bank', '302910392', 'حساب مركز المغفرة الرئيسي', 'Al-Maghfirah Main Account', 1, '2026-06-01 14:12:11');

-- --------------------------------------------------------

--
-- بنية الجدول `books`
--

DROP TABLE IF EXISTS `books`;
CREATE TABLE `books` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `author` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `size` varchar(50) DEFAULT '10.5 MB',
  `downloads` int(11) DEFAULT 0,
  `file_path` varchar(500) DEFAULT '',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `cover_image` varchar(500) DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- إرجاع أو استيراد بيانات الجدول `books`
--

INSERT INTO `books` (`id`, `title`, `author`, `description`, `size`, `downloads`, `file_path`, `created_at`, `cover_image`) VALUES
(1, 'التجويد المصور (المجلد الأول)', 'د. أيمن رشدي سويد', 'أهم منهج مرئي معاصر يفسر مخارج الحروف والصفات بالاعتماد على الرسوم واللوحات التوضيحية المجسمة لمخارج الأصوات.', '24.5 MB', 1420, '', '2026-05-31 23:40:36', ''),
(2, 'غاية المريد في علم التجويد', 'الشيخ عطية قابل نصر', 'شرح منهجي متوسط وشامل لكافة أحكام التلاوة والتجويد برواية حفص عن عاصم، مناسب لطلاب الحلقات.', '12.8 MB', 890, '', '2026-05-31 23:40:36', '');

-- --------------------------------------------------------

--
-- بنية الجدول `donation_requests`
--

DROP TABLE IF EXISTS `donation_requests`;
CREATE TABLE `donation_requests` (
  `id` int(11) NOT NULL,
  `donor_name` varchar(150) NOT NULL,
  `donor_phone` varchar(50) DEFAULT '',
  `amount` int(11) NOT NULL,
  `ring_id` varchar(50) DEFAULT 'all',
  `status` enum('new','approved','declined') DEFAULT 'new',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_read` tinyint(1) UNSIGNED DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- إرجاع أو استيراد بيانات الجدول `donation_requests`
--

INSERT INTO `donation_requests` (`id`, `donor_name`, `donor_phone`, `amount`, `ring_id`, `status`, `created_at`, `is_read`) VALUES
(1, 'فاعل خير', '780331184', 100, '1', 'new', '2026-05-31 23:47:18', 1),
(2, 'لابتب', '456431231', 100, 'all', 'new', '2026-06-01 12:34:28', 1),
(3, 'فاعل خير', '7774851221', 100, 'حلقة الشهيد عزالدين القسام', 'new', '2026-06-01 14:07:32', 1),
(4, 'فاعل خير', '74542214', 100, 'حلقة الشهيد عزالدين القسام', 'new', '2026-06-01 14:42:03', 1),
(5, 'فاعل خير', '7774851221', 100, 'حلقة الشهيد عزالدين القسام', 'new', '2026-06-01 15:06:41', 0),
(6, 'فاعل خير', '780998523', 100, 'حلقة الشهيد عزالدين القسام', 'new', '2026-06-02 22:26:29', 0),
(7, 'فاعل خير', '7802154536', 1000, 'حلقة الشهيد عزالدين القسام', 'new', '2026-06-02 22:29:26', 0);

-- --------------------------------------------------------

--
-- بنية الجدول `showcases`
--

DROP TABLE IF EXISTS `showcases`;
CREATE TABLE `showcases` (
  `id` int(10) UNSIGNED NOT NULL,
  `title_ar` varchar(255) NOT NULL,
  `title_en` varchar(255) NOT NULL,
  `cat_ar` varchar(100) NOT NULL,
  `cat_en` varchar(100) NOT NULL,
  `desc_ar` text DEFAULT NULL,
  `desc_en` text DEFAULT NULL,
  `media_type` enum('image','video') DEFAULT 'image',
  `media_path` varchar(500) DEFAULT '',
  `video_cover` varchar(500) DEFAULT '',
  `is_visible` tinyint(1) UNSIGNED DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `video_width` varchar(50) DEFAULT '100%',
  `video_height` varchar(50) DEFAULT 'auto',
  `video_position` varchar(50) DEFAULT 'center'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `showcases`
--

INSERT INTO `showcases` (`id`, `title_ar`, `title_en`, `cat_ar`, `cat_en`, `desc_ar`, `desc_en`, `media_type`, `media_path`, `video_cover`, `is_visible`, `created_at`, `video_width`, `video_height`, `video_position`) VALUES
(1, 'عبد الرحمن', 'ABDO AL-RAHMAN', 'اجمل صوت', 'The most beautiful voice', 'تميز  الطالب عبد الرحمن بصوته الجميل في المركز  وقد شارك في مسابقات عديدة وفاز بالمرتبه الاولى في اجمل صوت', 'Student Abdul Rahman distinguished himself with his beautiful voice at the center and participated in many competitions, winning first place for the most beautiful voice.', 'video', 'uploads/showcase_6a1d9741bf463.mp4', 'uploads/cover_6a1d9e7e4d606.png', 1, '2026-06-01 14:29:21', '50%', 'auto', 'top'),
(2, 'عبد الرحمن', 'ABDO AL-RAHMAN', 'اجمل صوت', 'The most beautiful voice', 'نتنيبتنمننننن', 'lkjdlkjlsdkjflsdkjf', 'video', 'uploads/showcase_6a1da2c57a9b9.mp4', 'uploads/cover_6a1da2c57aff0.png', 1, '2026-06-01 15:18:29', '50%', 'auto', 'center');

-- --------------------------------------------------------

--
-- بنية الجدول `site_settings`
--

DROP TABLE IF EXISTS `site_settings`;
CREATE TABLE `site_settings` (
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- إرجاع أو استيراد بيانات الجدول `site_settings`
--

INSERT INTO `site_settings` (`setting_key`, `setting_value`, `updated_at`) VALUES
('aboutDesc', 'نصنع أثراً دائماً في قلوب الحفظة من خلال دمج الأساليب الأكاديمية بالتربية السلوكية القرآنية الأصيلة.', '2026-06-01 00:12:26'),
('centerName', 'مَرْكَزُ المَغْفِرَةِ', '2026-05-31 23:40:36'),
('contactAddress', 'الجمهورية اليمنية، تعز، مركز المغفرة النموذجي', '2026-05-31 23:40:36'),
('contactEmail', 'support@al-maghfirah.org', '2026-05-31 23:40:36'),
('contactPhone', '780331184', '2026-05-31 23:45:04'),
('designerName', 'عبد الرحمن الشميري', '2026-05-31 23:45:04'),
('donation_thanks_msg_ar', 'لقد تلقينا طلب الدعم الافتراضي الخاص بك بنجاح. سيقوم قسم العلاقات العامة بالمركز بالتواصل معك عبر الواتساب أو الهاتف المسجل لتنسيق الدعم والمساهمة. كتب الله لكم الأجر العظيم.', '2026-06-01 14:12:11'),
('donation_thanks_msg_en', 'We have successfully received your support request. Our public relations team will contact you via WhatsApp or your registered phone to coordinate the contribution. May Allah reward you greatly.', '2026-06-01 14:12:11'),
('donation_thanks_title_ar', 'شكر الله عطاءكم!', '2026-06-01 14:12:11'),
('donation_thanks_title_en', 'May Allah Reward Your Generosity!', '2026-06-01 14:12:11'),
('facebookLink', '#', '2026-06-01 00:51:26'),
('feature1', 'تحفيظ كتاب الله بجودة وإتقان عاليين.', '2026-06-01 00:12:26'),
('feature2', 'تعليم أحكام التجويد علمياً وتطبيقياً.', '2026-06-01 00:12:26'),
('feature3', 'تنشئة الجيل على قيم القرآن ومحاسن الأخلاق.', '2026-06-01 00:12:26'),
('feature4', 'ربط العائلة بالحلقات لمتابعة متكاملة.', '2026-06-01 00:12:26'),
('heroDesc', 'نسعى في مركز المغفرة لبناء جيل قرآني واعد، متمسك بكتاب الله وحافظ له تلاوة وتجويداً وأخلاقاً، من خلال بيئة تعليمية محفزة وإدارة تقنية متكاملة تربط الطالب بالمعلم وولي الأمر.', '2026-05-31 23:40:36'),
('heroTag', 'منارة قرآنية متكاملة بأساليب تقنية حديثة', '2026-06-01 00:11:13'),
('heroTitle', 'ارتقِ بقرآنك في مركز المغفرة النموذجي', '2026-05-31 23:42:58'),
('logoSubtitle', 'لتعليم القرآن الكريم', '2026-06-01 00:11:13'),
('page_about_visible', '1', '2026-06-01 17:42:25'),
('page_activities_visible', '1', '2026-06-01 17:42:25'),
('page_home_visible', '1', '2026-06-01 17:55:54'),
('page_library_visible', '1', '2026-06-01 17:42:25'),
('page_showcases_visible', '1', '2026-06-01 17:42:25'),
('page_sponsor_visible', '1', '2026-06-01 17:42:25'),
('pillar1Desc', 'يمكن لأولياء الأمور الإشراف والاطلاع المباشر على خطط أبنائهم اليومية، الحفظ والمراجعة وملاحظات المعلم عبر تطبيقنا الخاص.', '2026-06-01 00:12:26'),
('pillar1Title', 'الترابط الأسري والمتابعة', '2026-06-01 00:12:26'),
('pillar1Visible', '1', '2026-06-01 00:14:25'),
('pillar2Desc', 'نظام تخطيط ذكي يبني خطط الحفظ التلقائية والمخصصة لكل طالب حسب طاقته وقدرته لضمان الاستمرارية والنجاح التراكمي.', '2026-06-01 00:12:26'),
('pillar2Title', 'خطط وجداول مخصصة', '2026-06-01 00:12:26'),
('pillar2Visible', '1', '2026-06-01 00:12:26'),
('pillar3Desc', 'نحافظ على خصوصية بيانات الطلاب وهويتهم، مع توفير نظام صلاحيات محكم ودخول برمجي بـ رموز دخول فريدة.', '2026-06-01 00:12:26'),
('pillar3Title', 'الأمان والسرية الرقمية', '2026-06-01 00:12:26'),
('pillar3Visible', '1', '2026-06-01 00:12:26'),
('pillar4Desc', 'لوحات شرف شهرية وربعية لإبراز المتفوقين دراسياً ومنجزيهم، وتقديم تكريمات دورية تشحذ الهمم وتوقد العزائم.', '2026-06-01 00:12:26'),
('pillar4Title', 'التميز والتحفيز', '2026-06-01 00:12:26'),
('pillar4Visible', '1', '2026-06-01 00:13:02'),
('primaryColor', '#0a9c4b', '2026-06-01 18:15:16'),
('secondaryColor', '#d4af37', '2026-06-01 18:15:16'),
('sponsorDesc', 'قال رسول الله ﷺ: «خيركم من تعلم القرآن وعلمه». تمنحك كفالة حلقة قرآنية فرصة المشاركة في الأجر الجاري لكل حرف يتلوه ويحفظه أبناؤنا في مركز المغفرة.', '2026-06-01 00:13:13'),
('sponsorImpactDesc', 'تغطية تكاليف طباعة الأوراق والمصاحف والمناهج، وتأمين حوافز عينية ومادية للطلاب المتميزين تشجيعاً لهم، ودعم المعلمين الفضلاء المتطوعين للإشراف اليومي على حفظ القرآن.', '2026-06-01 00:13:13'),
('sponsorImpactPoint1', 'طباعة المصاحف والمناهج', '2026-06-01 12:32:02'),
('sponsorImpactPoint2', 'حوافز للطلاب المتميزين', '2026-06-01 12:32:02'),
('sponsorImpactPoint3', 'دعم المعلمين المتطوعين', '2026-06-01 12:32:02'),
('sponsorImpactTitle', 'كيف تؤثر مساهمتك؟', '2026-06-01 00:13:13'),
('statMemorizers', '124', '2026-06-01 00:13:13'),
('statMemorizersLabel', 'خاتم ومتميز مجاز', '2026-06-01 00:59:12'),
('statRings', '18', '2026-06-01 00:13:13'),
('statRingsLabel', 'حلقة تعليمية قائمة', '2026-06-01 00:59:12'),
('statStudents', '364', '2026-06-01 00:13:13'),
('statStudentsLabel', 'طالب نشط ومستفيد', '2026-06-01 00:59:12'),
('statTeachers', '0', '2026-06-01 00:16:04'),
('statTeachersLabel', 'معلم ومحفظ متطوع', '2026-06-01 00:59:12'),
('supportAmounts', '100, 300, 1000', '2026-05-31 23:40:36'),
('supportPhone', '780331184', '2026-05-31 23:45:04'),
('supportRings', 'حلقة الشهيد عزالدين القسام', '2026-06-01 13:13:47'),
('themeMode', 'custom', '2026-06-01 13:17:43'),
('verseRef', 'سورة الإسراء - الآية 9', '2026-06-01 00:15:37'),
('verseText', '«إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ»', '2026-06-01 00:11:13'),
('visionDesc', 'أن نكون مركزاً ريادياً متميزاً على مستوى الوطن في تحفيظ القرآن الكريم وتدريس علومه، مستخدمين أفضل الوسائل التربوية والتقنية الحديثة لبناء طلاب فاعلين ومؤثرين في المجتمع.', '2026-05-31 23:40:36'),
('visionTitle', 'رؤيتنا وأهدافنا', '2026-05-31 23:40:36'),
('visionVisible', '1', '2026-06-01 14:24:46'),
('visitor_count', '26', '2026-06-03 21:26:37'),
('whatsappLink', '#', '2026-06-01 00:51:26');

-- --------------------------------------------------------

--
-- بنية الجدول `site_stats`
--

DROP TABLE IF EXISTS `site_stats`;
CREATE TABLE `site_stats` (
  `id` int(10) UNSIGNED NOT NULL,
  `stat_num` varchar(50) NOT NULL DEFAULT '0',
  `label_ar` varchar(150) NOT NULL,
  `label_en` varchar(150) NOT NULL,
  `icon_class` varchar(80) NOT NULL DEFAULT 'fa-star',
  `is_visible` tinyint(1) UNSIGNED DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `site_stats`
--

INSERT INTO `site_stats` (`id`, `stat_num`, `label_ar`, `label_en`, `icon_class`, `is_visible`, `created_at`) VALUES
(1, '364', 'طالب نشط ومستفيد', 'Active Students', 'fa-users', 1, '2026-06-01 14:12:11'),
(2, '18', 'حلقة تعليمية قائمة', 'Learning Circles', 'fa-graduation-cap', 1, '2026-06-01 14:12:11'),
(3, '124', 'خاتم ومتميز مجاز', 'Certified Memorizers', 'fa-ribbon', 1, '2026-06-01 14:12:11'),
(4, '15', 'معلم ومحفظ متطوع', 'Volunteer Teachers', 'fa-chalkboard-user', 1, '2026-06-01 14:12:11');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activities`
--
ALTER TABLE `activities`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `bank_accounts`
--
ALTER TABLE `bank_accounts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `donation_requests`
--
ALTER TABLE `donation_requests`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `showcases`
--
ALTER TABLE `showcases`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `site_settings`
--
ALTER TABLE `site_settings`
  ADD PRIMARY KEY (`setting_key`);

--
-- Indexes for table `site_stats`
--
ALTER TABLE `site_stats`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activities`
--
ALTER TABLE `activities`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `bank_accounts`
--
ALTER TABLE `bank_accounts`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `books`
--
ALTER TABLE `books`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `donation_requests`
--
ALTER TABLE `donation_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `showcases`
--
ALTER TABLE `showcases`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `site_stats`
--
ALTER TABLE `site_stats`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
