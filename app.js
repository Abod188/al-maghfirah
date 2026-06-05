/* ==========================================================================
   JavaScript Controller & CMS Engine - Al-Maghfirah Quran Center Website
   ========================================================================== */

// Environment and Routing Detection (Dynamic support for both PHP & HTML structures)
const isPhpEnv = !window.location.pathname.includes('_html') && 
                 (window.location.pathname.includes('.php') || 
                  (!window.location.pathname.includes('.html') && !window.location.pathname.includes('.htm')));
const fileExt = isPhpEnv ? '.php' : '.html';
const defaultIndex = isPhpEnv ? 'index.php' : 'index.html';

let activeSponsorAmount = 100;
let webSettings = {};
let webBooks = [];
let webActivities = [];
let webShowcases = [];
let webStats = [];
let webBanks = [];

function getApiUrl(endpoint) {
  if (!endpoint) return '';
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://') || endpoint.startsWith('data:')) {
    return endpoint;
  }
  if (window.location.protocol === 'file:') {
    return 'http://localhost/Al-Maghfirah%20Center_html/' + endpoint;
  }
  return endpoint;
}

function injectCenterControls() {
  const wheelOuter = document.querySelector('.wheel-outer');
  if (wheelOuter && !document.querySelector('.wheel-center-controls')) {
    const controls = document.createElement('div');
    controls.className = 'wheel-center-controls';
    controls.innerHTML = `
      <button class="theme-toggle" id="wheelThemeToggle" title="تبديل المظهر">
        <i class="fa-solid fa-moon"></i>
      </button>
      <button class="lang-toggle" id="wheelLangToggle" title="تبديل اللغة">
        <i class="fa-solid fa-globe"></i>
        <span id="wheelLangLabel">EN</span>
      </button>
    `;
    wheelOuter.appendChild(controls);
  }
}

function injectPageTransition() {
  // Direct page load — no overlay transition needed
}

function triggerExitTransitionAndNavigate(targetUrl) {
  // Navigate directly without blend overlay
  window.location.href = targetUrl;
}

function initLinkInterceptor() {
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a');
    if (!anchor) return;
    
    const href = anchor.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('http') || anchor.getAttribute('target') === '_blank') {
      return;
    }
    
    const localPages = [
      'index.html', 'about.html', 'activities.html', 'showcases.html', 'library.html', 'sponsor.html',
      'index.php', 'about.php', 'activities.php', 'showcases.php', 'library.php', 'sponsor.php'
    ];
    const isLocalPage = localPages.some(page => href.includes(page));
    if (!isLocalPage) return;

    e.preventDefault();
    
    if (anchor.classList.contains('active')) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    triggerExitTransitionAndNavigate(href);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  injectPageTransition();
  injectCenterControls();
  initLanguage();  // Must be first – sets currentLang so t() works in renderBookCards / renderDonationCards
  initCmsData();
  initTheme();
  initMobileMenu();
  initStatsCounter();
  initDonationForm();
  initHeaderScrollShrink();
  initRevealOnScroll();
  initNavWheel();  // Initialize the astrolabe wheel and bottom nav sync
  initLinkInterceptor();
});

/* ==========================================================================
   🌐 Bilingual Language System (Arabic / English)
   نظام الترجمة الثنائي العربي / الإنجليزي
   ========================================================================== */
const TRANSLATIONS = {
  ar: {
    // Page title
    page_title: 'مركز المغفرة لتعليم القرآن الكريم | المنصة التعريفية',
    lang_label: 'EN',
    // Navbar
    nav_home: 'الرئيسية',
    nav_index: 'الرئيسية',
    nav_about: 'عن المركز',
    nav_summer: 'المركز الصيفي',
    nav_library: 'المناهج',
    nav_sponsor: 'دعم المركز',
    // Logo
    logo_title: 'مركز المغفرة',
    logo_sub: 'لتعليم القرآن الكريم',
    // Hero
    hero_tag: 'منارة قرآنية متكاملة بأساليب تقنية حديثة',
    hero_title: 'ارتقِ بقرآنك في <br><span>مركز المغفرة المبارك</span>',
    hero_desc: 'نسعى في مركز المغفرة لبناء جيل قرآني واعد، متمسك بكتاب الله وحافظ له تلاوة وتجويداً وأخلاقاً، من خلال بيئة تعليمية محفزة وإدارة تقنية متكاملة تربط الطالب بالمعلم وولي الأمر.',
    hero_btn1: 'ادعم حلقات المركز',
    hero_btn2: 'تصفح مناهج التجويد',
    hero_verse: '"إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ"',
    hero_verse_ref: 'سورة الإسراء - الآية 9',
    // Stats
    stat_students: 'طالب نشط ومستفيد',
    stat_rings: 'حلقة تعليمية قائمة',
    stat_memorizers: 'خاتم ومتميز مجاز',
    stat_teachers: 'معلم ومحفظ متطوع',
    // About
    about_tag: 'مسيرتنا الإيمانية',
    about_title: 'تعرف على <span>رسالة المغفرة</span>',
    about_desc: 'نصنع أثراً دائماً في قلوب الحفظة من خلال دمج الأساليب الأكاديمية بالتربية السلوكية القرآنية الأصيلة.',
    vision_title: 'رؤيتنا وأهدافنا',
    vision_desc: 'أن نكون مركزاً ريادياً متميزاً على مستوى الوطن في تحفيظ القرآن الكريم وتدريس علومه، مستخدمين أفضل الوسائل التربوية والتقنية الحديثة لبناء طلاب فاعلين ومؤثرين في المجتمع.',
    feature1: 'تحفيظ كتاب الله بجودة وإتقان عاليين.',
    feature2: 'تعليم أحكام التجويد علمياً وتطبيقياً.',
    feature3: 'تنشئة الجيل على قيم القرآن ومحاسن الأخلاق.',
    feature4: 'ربط العائلة بالحلقات لمتابعة متكاملة.',
    pillar1_title: 'الترابط الأسري والمتابعة',
    pillar1_desc: 'يمكن لأولياء الأمور الإشراف والاطلاع المباشر على خطط أبنائهم اليومية، الحفظ والمراجعة وملاحظات المعلم عبر تطبيقنا الخاص.',
    pillar2_title: 'خطط وجداول مخصصة',
    pillar2_desc: 'نظام تخطيط ذكي يبني خطط الحفظ التلقائية والمخصصة لكل طالب حسب طاقته وقدرته لضمان الاستمرارية والنجاح التراكمي.',
    pillar3_title: 'الأمان والسرية الرقمية',
    pillar3_desc: 'نحافظ على خصوصية بيانات الطلاب وهويتهم، مع توفير نظام صلاحيات محكم ودخول برمجي بـ رموز دخول فريدة.',
    pillar4_title: 'التميز والتحفيز',
    pillar4_desc: 'لوحات شرف شهرية وربعية لإبراز المتفوقين دراسياً ومنجزيهم، وتقديم تكريمات دورية تشحذ الهمم وتوقد العزائم.',
    // Library
    lib_tag: 'حقيبة طالب العلم',
    lib_title: 'مستودع <span>المناهج والمقررات</span>',
    lib_desc: 'بوابتك للوصول لأفضل كتب التجويد المقررة ودروس المخارج والصفات المعتمدة في المركز للتحميل والمراجعة المباشرة.',
    book_download: 'تحميل مجاني',
    book_read: 'قراءة',
    book_downloads_label: 'تحميل',
    // Sponsor
    sponsor_tag: 'صدقة جارية ونبل عطاء',
    sponsor_title: 'ساهم في <span>كفالة الحلقات</span>',
    sponsor_desc: 'قال رسول الله ﷺ: "خيركم من تعلم القرآن وعلمه". تمنحك كفالة حلقة قرآنية فرصة المشاركة في الأجر الجاري لكل حرف يتلوه ويحفظه أبناؤنا في مركز المغفرة. ساهم الآن وكن شريكاً في هذا المجد القرآني العظيم.',
    sponsor_impact_title: 'كيف تؤثر مساهمتك؟',
    sponsor_impact_desc: 'تغطية تكاليف طباعة الأوراق والمصاحف والمناهج، وتأمين حوافز عينية ومادية للطلاب المتميزين تشجيعاً لهم، ودعم المعلمين الفضلاء المتطوعين للإشراف اليومي على حفظ القرآن.',
    sponsor_form_title: 'نموذج دعم الحلقات السريع',
    label_name: 'الاسم الكريم / الداعم',
    ph_name: 'مثال: فاعل خير',
    label_phone: 'رقم التواصل (هاتف أو واتساب)',
    ph_phone: 'مثال: +966500000000',
    label_ring: 'تخصيص الدعم لحلقة معينة (اختياري)',
    ring_all: 'كافة حلقات المركز (عام)',
    ring_1: 'حلقة الفاتح (للمبتدئين)',
    ring_2: 'حلقة الأنفال (للمتوسطين)',
    ring_3: 'حلقة الترتيل (مجازين)',
    btn_donate: 'إرسال طلب الدعم الافتراضي',
    // Sponsor amounts labels
    amt_label1: 'كفالة طالب لشهر',
    amt_label2: 'دعم مصاحف ومناهج',
    amt_label3: 'كفالة حلقة كاملة',
    // Footer
    footer_links_title: 'روابط سريعة',
    footer_books_title: 'مناهجنا الأساسية',
    footer_contact_title: 'تواصل معنا',
    footer_link_home: 'الرئيسية',
    footer_link_about: 'عن المركز',
    footer_link_library: 'المناهج الرقمية',
    footer_link_sponsor: 'دعم الحلقات',
    footer_desc: 'مركز ريادي يسعى لإحياء الأمة بكتاب الله حفظاً وسلوكاً، وتوظيف الأدوات البرمجية الذكية لدمج الآباء والمعلمين لبناء جيل الحفظ الفاضل.',
    footer_copy: '© 2026 مركز المغفرة لتعليم القرآن الكريم. جميع الحقوق محفوظة.',
    footer_credits: 'برمجة وتصميم: Antigravity',
    footer_privacy: 'سياسة الخصوصية',
    footer_terms: 'شروط الاستخدام',
    // Modal
    modal_thanks_title: 'شكر الله عطاءكم!',
    modal_thanks_body: 'لقد تلقينا طلب الدعم الافتراضي الخاص بك بنجاح. سيقوم قسم العلاقات العامة بالمركز بالتواصل معك عبر الواتساب أو الهاتف المسجل لتنسيق الدعم والمساهمة. كتب الله لكم الأجر العظيم.',
    modal_close_btn: 'إغلاق النافذة',
    modal_close_ok: 'موافق، إغلاق',
    modal_donate_success: 'تم إرسال طلبكم بنجاح',
    // Toast
    toast_theme_light: 'تم التفعيل للوضع المضيء المريح',
    toast_theme_dark: 'تم التفعيل للوضع الليلي المهدئ للعين',
    toast_sponsor_selected: 'تم اختيار قيمة الدعم',
    toast_download: 'جارٍ تحضير التحميل',
    toast_download_body: 'سيبدأ تحميل الكتاب خلال لحظات',
    toast_download_counter: 'تحميلاً',
    about_heading: 'عن المركز',
    summer_heading: 'المركز الصيفي',
    lib_heading: 'المناهج والمقررات',
    sponsor_heading: 'دعم المركز',
    impact1: 'طباعة المصاحف والمناهج',
    impact2: 'حوافز للطلاب المتميزين',
    impact3: 'دعم المعلمين المتطوعين',
    modal_whatsapp_btn: 'متابعة الدعم عبر واتساب للمدير',
    nav_activities: 'البرامج والأنشطة',
    nav_showcases: 'نماذج المركز',
    activities_heading: 'البرامج والأنشطة',
    activities_desc: 'استكشف أهم ما يقيمه المركز من فعاليات، أمسيات، دروس، أنشطة لا صفية، ومراكز صيفية متكاملة.',
    showcases_heading: 'نماذج المركز',
    showcases_desc: 'نماذج عطرة وإبداعات متميزة لطلابنا في التلاوة والأصوات الندية والخط العربي الفخيم.',
    bank_accounts_title: 'الحسابات البنكية المعتمدة للدعم المباشر',
    bank_name_label: 'البنك:',
    bank_number_label: 'رقم الحساب:',
    bank_holder_label: 'المستفيد:',
  },
  en: {
    // Page title
    page_title: 'Al-Maghfirah Quran Center | Official Website',
    lang_label: 'عربي',
    // Navbar
    nav_home: 'Home',
    nav_index: 'Home',
    nav_about: 'About',
    nav_summer: 'Summer Center',
    nav_library: 'Curricula',
    nav_sponsor: 'Support Us',
    // Logo
    logo_title: 'Al-Maghfirah',
    logo_sub: 'Quran Learning Center',
    // Hero
    hero_tag: 'A comprehensive Quranic beacon with modern technology',
    hero_title: 'Elevate Your Quran Journey at <br><span>Al-Maghfirah Center</span>',
    hero_desc: 'At Al-Maghfirah Center, we strive to raise a promising Quranic generation, devoted to the Book of Allah — memorizing, reciting with Tajweed, and upholding noble character — through an inspiring educational environment and integrated digital management.',
    hero_btn1: 'Support Our Circles',
    hero_btn2: 'Browse Tajweed Curricula',
    hero_verse: '"إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ"',
    hero_verse_ref: 'سورة الإسراء - الآية 9',
    // Stats
    stat_students: 'Active Students',
    stat_rings: 'Learning Circles',
    stat_memorizers: 'Certified Memorizers',
    stat_teachers: 'Volunteer Teachers',
    // About
    about_tag: 'Our Faith Journey',
    about_title: 'Discover <span>Al-Maghfirah\'s Mission</span>',
    about_desc: 'We create a lasting impact in the hearts of memorizers by blending academic methods with authentic Quranic character education.',
    vision_title: 'Our Vision & Goals',
    vision_desc: 'To be a leading center nationwide in Quran memorization and teaching, utilizing the best educational and technological tools to build active, impactful students in society.',
    feature1: 'Quran memorization with the highest quality and mastery.',
    feature2: 'Teaching Tajweed rules both theoretically and practically.',
    feature3: 'Raising generations on Quranic values and noble morals.',
    feature4: 'Connecting families to circles for comprehensive follow-up.',
    pillar1_title: 'Family Engagement & Tracking',
    pillar1_desc: 'Parents can directly oversee their children\'s daily memorization plans, revision schedules, and teacher notes through our dedicated app.',
    pillar2_title: 'Customized Plans & Schedules',
    pillar2_desc: 'A smart planning system that auto-builds personalized memorization plans for each student based on their capacity, ensuring continuity and cumulative success.',
    pillar3_title: 'Digital Security & Privacy',
    pillar3_desc: 'We protect the privacy and identity of our students with a strict permission system and unique access codes for each user.',
    pillar4_title: 'Excellence & Motivation',
    pillar4_desc: 'Monthly and quarterly honor boards to highlight top students, with periodic recognition ceremonies that inspire ambition and dedication.',
    // Library
    lib_tag: 'Student\'s Learning Kit',
    lib_title: 'Curricula & <span>Course Repository</span>',
    lib_desc: 'Your gateway to the finest Tajweed books, articulation lessons, and approved materials at the center — available for download and direct review.',
    book_download: 'Free Download',
    book_read: 'Read',
    book_downloads_label: 'downloads',
    // Sponsor
    sponsor_tag: 'Ongoing Charity & Noble Giving',
    sponsor_title: 'Contribute to <span>Sponsoring Circles</span>',
    sponsor_desc: 'The Prophet ﷺ said: "The best of you are those who learn the Quran and teach it." Sponsoring a Quran circle gives you a share of the ongoing reward for every letter our students recite and memorize. Contribute now and be a partner in this great Quranic legacy.',
    sponsor_impact_title: 'How Does Your Contribution Help?',
    sponsor_impact_desc: 'Covering printing costs for materials and Qurans, providing incentives for outstanding students, and supporting dedicated volunteer teachers who oversee daily memorization.',
    sponsor_form_title: 'Quick Circle Support Form',
    label_name: 'Donor Name',
    ph_name: 'e.g. Anonymous Benefactor',
    label_phone: 'Contact Number (Phone or WhatsApp)',
    ph_phone: 'e.g. +966500000000',
    label_ring: 'Allocate Support to a Specific Circle (Optional)',
    ring_all: 'All Center Circles (General)',
    ring_1: 'Al-Fatih Circle (Beginners)',
    ring_2: 'Al-Anfal Circle (Intermediate)',
    ring_3: 'Tarteel Circle (Certified)',
    btn_donate: 'Submit Support Request',
    // Sponsor amounts labels
    amt_label1: 'Sponsor a Student for a Month',
    amt_label2: 'Support Qurans & Curricula',
    amt_label3: 'Sponsor a Full Circle',
    // Footer
    footer_links_title: 'Quick Links',
    footer_books_title: 'Our Core Curricula',
    footer_contact_title: 'Contact Us',
    footer_link_home: 'Home',
    footer_link_about: 'About',
    footer_link_library: 'Digital Curricula',
    footer_link_sponsor: 'Support Circles',
    footer_desc: 'A pioneering center dedicated to reviving the Ummah through the Book of Allah — combining parental involvement and teacher oversight to raise a generation of noble memorizers.',
    footer_copy: '© 2026 Al-Maghfirah Quran Center. All Rights Reserved.',
    footer_credits: 'Designed & Developed by: Antigravity',
    footer_privacy: 'Privacy Policy',
    footer_terms: 'Terms of Use',
    // Modal
    modal_thanks_title: 'May Allah Reward Your Generosity!',
    modal_thanks_body: 'We have successfully received your support request. Our public relations team will contact you via WhatsApp or your registered phone to coordinate the contribution. May Allah reward you greatly.',
    modal_close_btn: 'Close Window',
    modal_close_ok: 'OK, Close',
    modal_donate_success: 'Request Submitted Successfully',
    // Toast
    toast_theme_light: 'Light mode activated',
    toast_theme_dark: 'Dark mode activated',
    toast_sponsor_selected: 'Support amount selected',
    toast_download: 'Preparing download',
    toast_download_body: 'The book will start downloading shortly',
    toast_download_counter: 'downloads',
    about_heading: 'About the Center',
    summer_heading: 'Summer Center',
    lib_heading: 'Curricula & Courses',
    sponsor_heading: 'Support the Center',
    impact1: 'Printing Qurans and Curricula',
    impact2: 'Incentives for Outstanding Students',
    impact3: 'Supporting Volunteer Teachers',
    modal_whatsapp_btn: 'Follow up support on WhatsApp with Director',
    nav_activities: 'Activities',
    nav_showcases: 'Showcases',
    activities_heading: 'Programs & Activities',
    activities_desc: 'Explore our latest summer centers, evenings, lessons, and activities.',
    showcases_heading: 'Student Showcases',
    showcases_desc: 'Highlighting beautiful recitations, handwriting highlights, and student achievements.',
    bank_accounts_title: 'Approved Bank Accounts for Direct Transfer',
    bank_name_label: 'Bank:',
    bank_number_label: 'Account Number:',
    bank_holder_label: 'Holder:',
  }
};

let currentLang = 'ar';

function initLanguage() {
  const savedLang = localStorage.getItem('web-lang') || 'ar';
  currentLang = savedLang;

  const updateLangLabels = (lang) => {
    document.querySelectorAll('#langLabel, #wheelLangLabel').forEach(label => {
      label.textContent = TRANSLATIONS[lang].lang_label;
    });
  };

  // Update the lang button label immediately
  updateLangLabels(savedLang);

  // Update html dir/lang right away (doesn't depend on data)
  const html = document.getElementById('htmlRoot');
  if (html) {
    html.setAttribute('lang', savedLang);
    html.setAttribute('dir', savedLang === 'en' ? 'ltr' : 'rtl');
  }

  // If English was saved, apply full translation AFTER all init functions complete
  if (savedLang === 'en') {
    requestAnimationFrame(() => requestAnimationFrame(() => applyLanguage('en', false)));
  }

  const btns = document.querySelectorAll('#langToggle, #wheelLangToggle, .lang-toggle');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const newLang = currentLang === 'ar' ? 'en' : 'ar';
      currentLang = newLang;
      localStorage.setItem('web-lang', newLang);
      updateLangLabels(newLang);
      applyLanguage(newLang, true);
    });
  });
}

function t(key) {
  return (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key]) || TRANSLATIONS['ar'][key] || key;
}

function applyLanguage(lang, animate) {
  const html = document.getElementById('htmlRoot');
  const body = document.body;

  if (animate) {
    body.style.opacity = '0';
    body.style.transition = 'opacity 0.3s ease';
  }

  const apply = () => {
    // HTML direction & lang attribute
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'en' ? 'ltr' : 'rtl');

    // Page title
    document.title = t('page_title');

    // Lang button label
    document.querySelectorAll('#langLabel, #wheelLangLabel').forEach(label => {
      label.textContent = t('lang_label');
    });

    // Logo
    const logoTitle = document.getElementById('logoTitle');
    const logoSubtitle = document.getElementById('logoSubtitle');
    const footerLogoTitle = document.getElementById('footerLogoTitle');
    const footerLogoSubtitle = document.getElementById('footerLogoSubtitle');
    if (logoTitle) logoTitle.textContent = t('logo_title');
    if (logoSubtitle) logoSubtitle.textContent = t('logo_sub');
    if (footerLogoTitle) footerLogoTitle.textContent = t('logo_title');
    if (footerLogoSubtitle) footerLogoSubtitle.textContent = t('logo_sub');

    // Nav links (data-i18n)
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key === 'footer_credits') return;
      const icon = el.querySelector('i');
      const iconHtml = icon ? icon.outerHTML + ' ' : '';
      el.innerHTML = iconHtml + t(key);
    });

    // Hero section
    const heroTag = document.querySelector('.hero-tag');
    if (heroTag) {
      const icon = heroTag.querySelector('i');
      heroTag.innerHTML = (icon ? icon.outerHTML + ' ' : '') + t('hero_tag');
    }
    const heroTitle = document.getElementById('heroTitle');
    if (heroTitle) heroTitle.innerHTML = t('hero_title');
    const heroDesc = document.getElementById('heroDesc');
    if (heroDesc) heroDesc.textContent = t('hero_desc');

    // Hero buttons
    const heroBtns = document.querySelectorAll('.hero-btns a');
    if (heroBtns[0]) {
      const icon = heroBtns[0].querySelector('i');
      heroBtns[0].innerHTML = (icon ? icon.outerHTML + ' ' : '') + t('hero_btn1');
    }
    if (heroBtns[1]) {
      const icon = heroBtns[1].querySelector('i');
      heroBtns[1].innerHTML = (icon ? icon.outerHTML + ' ' : '') + t('hero_btn2');
    }

    // Hero verse
    const verseEl = document.querySelector('.verse-text');
    const refEl = document.querySelector('.verse-ref');
    if (verseEl) verseEl.textContent = t('hero_verse');
    if (refEl) refEl.textContent = t('hero_verse_ref');

    // Stats labels
    const statLabels = document.querySelectorAll('.stat-label');
    const statKeys = ['stat_students', 'stat_rings', 'stat_memorizers', 'stat_teachers'];
    statLabels.forEach((el, i) => { if (statKeys[i]) el.textContent = t(statKeys[i]); });

    // About section header
    const aboutTag = document.querySelector('.about .section-tag');
    if (aboutTag) aboutTag.textContent = t('about_tag');
    const aboutSectionTitle = document.querySelector('.about .section-title');
    if (aboutSectionTitle) aboutSectionTitle.innerHTML = t('about_title');
    const aboutDesc = document.querySelector('.about .section-desc');
    if (aboutDesc) aboutDesc.textContent = t('about_desc');

    // Vision card
    const visionTitle = document.getElementById('visionTitle');
    if (visionTitle) {
      const icon = visionTitle.querySelector('i');
      visionTitle.innerHTML = (icon ? icon.outerHTML + ' ' : '') + t('vision_title');
    }
    const visionDesc = document.getElementById('visionDesc');
    if (visionDesc) visionDesc.textContent = t('vision_desc');

    // Features list
    const features = document.querySelectorAll('.about-card-features li');
    const featKeys = ['feature1', 'feature2', 'feature3', 'feature4'];
    features.forEach((li, i) => {
      if (featKeys[i]) {
        const icon = li.querySelector('i');
        li.innerHTML = (icon ? icon.outerHTML + ' ' : '') + t(featKeys[i]);
      }
    });

    // Pillar cards
    const pillars = document.querySelectorAll('.pillar-card');
    const pillarTitles = ['pillar1_title', 'pillar2_title', 'pillar3_title', 'pillar4_title'];
    const pillarDescs = ['pillar1_desc', 'pillar2_desc', 'pillar3_desc', 'pillar4_desc'];
    pillars.forEach((card, i) => {
      const title = card.querySelector('.pillar-title');
      const desc = card.querySelector('.pillar-desc');
      if (title && pillarTitles[i]) title.textContent = t(pillarTitles[i]);
      if (desc && pillarDescs[i]) desc.textContent = t(pillarDescs[i]);
    });

    // Library section header
    const libTag = document.querySelector('.library .section-tag');
    if (libTag) libTag.textContent = t('lib_tag');
    const libTitle = document.querySelector('.library .section-title');
    if (libTitle) libTitle.innerHTML = t('lib_title');
    const libDesc = document.querySelector('.library .section-desc');
    if (libDesc) libDesc.textContent = t('lib_desc');

    // Activities section header
    const actHeading = document.querySelector('[data-i18n="activities_heading"]');
    if (actHeading) actHeading.textContent = t('activities_heading');
    const actDesc = document.querySelector('[data-i18n="activities_desc"]');
    if (actDesc) actDesc.textContent = t('activities_desc');

    // Showcases section header
    const showHeading = document.querySelector('[data-i18n="showcases_heading"]');
    if (showHeading) showHeading.textContent = t('showcases_heading');
    const showDesc = document.querySelector('[data-i18n="showcases_desc"]');
    if (showDesc) showDesc.textContent = t('showcases_desc');

    // Re-render dynamic components with new language
    renderBookCards();
    renderActivities();
    renderShowcases();

    // Sponsor section
    const sponsorTag = document.querySelector('.sponsor .section-tag');
    if (sponsorTag) sponsorTag.textContent = t('sponsor_tag');
    const sponsorTitle = document.querySelector('.sponsor .section-title');
    if (sponsorTitle) {
      const centerName = lang === 'en' ? 'Sponsoring Circles' : 'كفالة الحلقات';
      sponsorTitle.innerHTML = t('sponsor_title');
    }
    const sponsorDesc = document.querySelector('.sponsor-info .section-desc');
    if (sponsorDesc) sponsorDesc.textContent = t('sponsor_desc');

    // Sponsor impact card (first pillar in sponsor section)
    const sponsorPillar = document.querySelector('.sponsor .pillar-card');
    if (sponsorPillar) {
      const title = sponsorPillar.querySelector('.pillar-title');
      const desc = sponsorPillar.querySelector('.pillar-desc');
      if (title) {
        const icon = title.querySelector('i');
        title.innerHTML = (icon ? icon.outerHTML + ' ' : '') + t('sponsor_impact_title');
      }
      if (desc) desc.textContent = t('sponsor_impact_desc');
    }

    // Sponsor form
    const sponsorFormTitle = document.querySelector('.sponsor-card-title');
    if (sponsorFormTitle) {
      const icon = sponsorFormTitle.querySelector('i');
      sponsorFormTitle.innerHTML = (icon ? icon.outerHTML + ' ' : '') + t('sponsor_form_title');
    }
    const nameLabel = document.querySelector('label[for="donorName"]');
    if (nameLabel) nameLabel.textContent = t('label_name');
    const nameInput = document.getElementById('donorName');
    if (nameInput) nameInput.placeholder = t('ph_name');
    const phoneLabel = document.querySelector('label[for="donorPhone"]');
    if (phoneLabel) phoneLabel.textContent = t('label_phone');
    const phoneInput = document.getElementById('donorPhone');
    if (phoneInput) phoneInput.placeholder = t('ph_phone');
    const ringLabel = document.querySelector('label[for="selectedRing"]');
    if (ringLabel) ringLabel.textContent = t('label_ring');
    const ringSelect = document.getElementById('selectedRing');
    if (ringSelect) {
      const opts = ringSelect.querySelectorAll('option');
      if (opts[0]) opts[0].textContent = t('ring_all');
    }
    const donateBtn = document.querySelector('.sponsor-form [type="submit"]');
    if (donateBtn) {
      const icon = donateBtn.querySelector('i');
      donateBtn.innerHTML = (icon ? icon.outerHTML + ' ' : '') + t('btn_donate');
    }

    // Re-render donation cards with translated labels
    renderDonationCards();

    // Footer
    const footerDesc = document.getElementById('footerCenterDesc');
    if (footerDesc) footerDesc.textContent = t('footer_desc');
    const footerCopy = document.getElementById('footerCopy');
    if (footerCopy) footerCopy.innerHTML = t('footer_copy');
    const footerCredits = document.getElementById('footerCredits');
    if (footerCredits) footerCredits.innerHTML = t('footer_credits');

    const footerTitles = document.querySelectorAll('.footer-title');
    const footerTitleKeys = ['footer_links_title', 'footer_books_title', 'footer_contact_title'];
    footerTitles.forEach((el, i) => { if (footerTitleKeys[i]) el.textContent = t(footerTitleKeys[i]); });

    const footerNavLinks = document.querySelectorAll('.footer-links:first-of-type li a');
    const footerLinkKeys = ['footer_link_home', 'footer_link_about', 'footer_link_library', 'footer_link_sponsor'];
    footerNavLinks.forEach((a, i) => { if (footerLinkKeys[i]) a.textContent = t(footerLinkKeys[i]); });

    const privacyLinks = document.querySelectorAll('.footer-bottom-links a');
    if (privacyLinks[0]) privacyLinks[0].textContent = t('footer_privacy');
    if (privacyLinks[1]) privacyLinks[1].textContent = t('footer_terms');

    // Modal texts
    const modalThanksTitle = document.getElementById('modalThanksTitle');
    if (modalThanksTitle) modalThanksTitle.textContent = t('modal_thanks_title');
    const modalThanksBody = document.getElementById('modalThanksBody');
    if (modalThanksBody) modalThanksBody.textContent = t('modal_thanks_body');
    const modalCloseBtns = document.querySelectorAll('[onclick="closeModal(\'successModal\')"]');
    modalCloseBtns.forEach(btn => { if (!btn.classList.contains('modal-close')) btn.textContent = t('modal_close_btn'); });
    const readModalCloseBtns = document.querySelectorAll('[onclick="closeModal(\'readModal\')"]');
    readModalCloseBtns.forEach(btn => { if (!btn.classList.contains('modal-close')) btn.textContent = t('modal_close_ok'); });

    // Translate Astrolabe Wheel nodes titles and text dynamically
    const wheelNodes = document.querySelectorAll('.wheel-node');
    wheelNodes.forEach(node => {
      const pageKey = node.getAttribute('data-page');
      const key = `nav_${pageKey}`;
      node.setAttribute('title', t(key));
      const textEl = node.querySelector('.node-text');
      if (textEl) textEl.textContent = t(key);
    });

    // Translate Mobile Bottom Navigation Bar items dynamically
    const bottomNavItems = document.querySelectorAll('.mobile-bottom-nav .nav-item');
    bottomNavItems.forEach(item => {
      const pageKey = item.getAttribute('data-page');
      const key = `nav_${pageKey}`;
      const textEl = item.querySelector('.nav-item-text');
      if (textEl) textEl.textContent = t(key);
    });

    // Re-align wheel positions based on language change
    if (window.rotateWheelToPage && window.activePageKey) {
      window.rotateWheelToPage(window.activePageKey);
    }

    // Fade back in
    if (animate) {
      body.style.opacity = '1';
    }
  };

  if (animate) {
    setTimeout(apply, 300);
  } else {
    apply();
  }
}

/* ==========================================================================
   CMS Engine: Load & Sync SharedPreferences / LocalStorage Data
   ========================================================================== */
function initCmsData() {
  // 1. Core Web Settings Fallback Defaults
  const defaultSettings = {
    'centerName': 'مَرْكَزُ المَغْفِرَةِ',
    'logoSubtitle': 'لتعليم القرآن الكريم',
    'heroTag': 'منارة قرآنية متكاملة بأساليب تقنية حديثة',
    'heroTitle': 'ارتقِ بقرآنك في مركز المغفرة المبارك',
    'heroDesc': 'نسعى في مركز المغفرة لبناء جيل قرآني واعد، متمسك بكتاب الله وحافظ له تلاوة وتجويداً وأخلاقاً، من خلال بيئة تعليمية محفزة وإدارة تقنية متكاملة تربط الطالب بالمعلم وولي الأمر.',
    'verseText': '«إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ»',
    'verseRef': 'سورة الإسراء — الآية 9',
    'statStudents': '364',
    'statRings': '18',
    'statMemorizers': '124',
    'statTeachers': '15',
    'aboutDesc': 'نصنع أثراً دائماً في قلوب الحفظة من خلال دمج الأساليب الأكاديمية بالتربية السلوكية القرآنية الأصيلة.',
    'visionTitle': 'رؤيتنا وأهدافنا',
    'visionDesc': 'أن نكون مركزاً ريادياً متميزاً على مستوى الوطن في تحفيظ القرآن الكريم وتدريس علومه، مستخدمين أفضل الوسائل التربوية والتقنية الحديثة لبناء طلاب فاعلين ومؤثرين في المجتمع.',
    'feature1': 'تحفيظ كتاب الله بجودة وإتقان عاليين.',
    'feature2': 'تعليم أحكام التجويد علمياً وتطبيقياً.',
    'feature3': 'تنشئة الجيل على قيم القرآن ومحاسن الأخلاق.',
    'feature4': 'ربط العائلة بالحلقات لمتابعة متكاملة.',
    'pillar1Title': 'الترابط الأسري والمتابعة',
    'pillar1Desc': 'يمكن لأولياء الأمور الإشراف والاطلاع المباشر على خطط أبنائهم اليومية، الحفظ والمراجعة وملاحظات المعلم عبر تطبيقنا الخاص.',
    'pillar1Visible': '1',
    'pillar2Title': 'خطط وجداول مخصصة',
    'pillar2Desc': 'نظام تخطيط ذكي يبني خطط الحفظ التلقائية والمخصصة لكل طالب حسب طاقته وقدرته لضمان الاستمرارية والنجاح التراكمي.',
    'pillar2Visible': '1',
    'pillar3Title': 'الأمان والسرية الرقمية',
    'pillar3Desc': 'نحافظ على خصوصية بيانات الطلاب وهويتهم، مع توفير نظام صلاحيات محكم ودخول برمجي بـ رموز دخول فريدة.',
    'pillar3Visible': '1',
    'pillar4Title': 'التميز والتحفيز',
    'pillar4Desc': 'لوحات شرف شهرية وربعية لإبراز المتفوقين دراسياً ومنجزيهم، وتقديم تكريمات دورية تشحذ الهمم وتوقد العزائم.',
    'pillar4Visible': '1',
    'sponsorDesc': 'قال رسول الله ﷺ: «خيركم من تعلم القرآن وعلمه». تمنحك كفالة حلقة قرآنية فرصة المشاركة في الأجر الجاري لكل حرف يتلوه ويحفظه أبناؤنا في مركز المغفرة.',
    'sponsorImpactTitle': 'كيف تؤثر مساهمتك؟',
    'sponsorImpactDesc': 'تغطية تكاليف طباعة الأوراق والمصاحف والمناهج، وتأمين حوافز عينية ومادية للطلاب المتميزين تشجيعاً لهم، ودعم المعلمين الفضلاء المتطوعين للإشراف اليومي على حفظ القرآن.',
    'contactPhone': '+967 770 000 000',
    'contactEmail': 'support@al-maghfirah.org',
    'contactAddress': 'الجمهورية اليمنية، تعز، مركز المغفرة النموذجي',
    'supportPhone': '+967 770 000 000',
    'supportAmounts': '100, 300, 1000',
    'primaryColor': '#0f5132',
    'secondaryColor': '#D4AF37',
    'themeMode': 'emerald',
    'designerName': 'Antigravity',
    'summer_center_visible': '1',
    'summer_center_btn_text': 'المركز الصيفي',
    'page_home_visible': '1',
    'page_about_visible': '1',
    'page_summer_visible': '1',
    'page_activities_visible': '1',
    'page_showcases_visible': '1',
    'page_library_visible': '1',
    'page_sponsor_visible': '1'
  };

  // 2. Core Web Books Fallback Defaults
  const defaultBooks = [
    {
      'id': '1',
      'title': 'التجويد المصور (المجلد الأول)',
      'author': 'د. أيمن رشدي سويد',
      'description': 'أهم منهج مرئي معاصر يفسر مخارج الحروف والصفات بالاعتماد على الرسوم واللوحات التوضيحية المجسمة لمخارج الأصوات.',
      'size': '24.5 MB',
      'downloads': 1420
    },
    {
      'id': '2',
      'title': 'غاية المريد في علم التجويد',
      'author': 'الشيخ عطية قابل نصر',
      'description': 'شرح منهجي متوسط وشامل لكافة أحكام التلاوة والتجويد برواية حفص عن عاصم، مناسب لطلاب الحلقات.',
      'size': '12.8 MB',
      'downloads': 890
    },
    {
      'id': '3',
      'title': 'متن تحفة الأطفال والغلمان',
      'author': 'سليمان الجمزوري',
      'description': 'المنظومة السهلة الميسرة لتهجية أحكام النون الساكنة والتنوين والمدود، مقررة للحفظ في حلقة الأحكام.',
      'size': '3.4 MB',
      'downloads': 2130
    }
  ];

  const mergeSettings = (source) => ({
    ...defaultSettings,
    ...(source && typeof source === 'object' && !Array.isArray(source) ? source : {})
  });

  // 3. Load from shared browser localStorage (fallback cache)
  try {
    const savedSettings = localStorage.getItem('db_web_settings');
    const savedBooks    = localStorage.getItem('db_web_books');
    const savedActivities = localStorage.getItem('db_web_activities');
    const savedShowcases  = localStorage.getItem('db_web_showcases');
    const savedStats      = localStorage.getItem('db_web_stats');
    const savedBanks      = localStorage.getItem('db_web_banks');
    webSettings = savedSettings ? mergeSettings(JSON.parse(savedSettings)) : defaultSettings;
    webBooks    = savedBooks    ? JSON.parse(savedBooks)    : defaultBooks;
    webActivities = savedActivities ? JSON.parse(savedActivities) : [];
    webShowcases  = savedShowcases  ? JSON.parse(savedShowcases)  : [];
    webStats      = savedStats      ? JSON.parse(savedStats)      : [];
    webBanks      = savedBanks      ? JSON.parse(savedBanks)      : [];
  } catch (e) {
    webSettings = defaultSettings;
    webBooks    = defaultBooks;
    webActivities = [];
    webShowcases  = [];
    webStats      = [];
    webBanks      = [];
  }

  // 4. Render immediately from cache
  renderCmsContent();

  // 5. Fetch FRESH data from PHP/MySQL — always bypass cache
  fetch(getApiUrl('api/get_site_data.php?_t=' + Date.now()), {
    cache: 'no-store',
    headers: { 'Cache-Control': 'no-cache' }
  })
    .then(res => {
      if (!res.ok) throw new Error('API unavailable');
      return res.json();
    })
    .then(data => {
      if (data.success) {
        webSettings = mergeSettings(data.settings);
        webBooks    = data.books;
        webActivities = data.activities || [];
        webShowcases  = data.showcases || [];
        webStats      = data.stats || [];
        webBanks      = data.banks || [];

        // Normalise books: database returns 'description', unify field name
        webBooks = webBooks.map(b => ({
          ...b,
          desc: b.description || b.desc || ''
        }));

        // Persist fresh data to localStorage
        localStorage.setItem('db_web_settings', JSON.stringify(webSettings));
        localStorage.setItem('db_web_books',    JSON.stringify(webBooks));
        localStorage.setItem('db_web_activities', JSON.stringify(webActivities));
        localStorage.setItem('db_web_showcases',  JSON.stringify(webShowcases));
        localStorage.setItem('db_web_stats',      JSON.stringify(webStats));
        localStorage.setItem('db_web_banks',      JSON.stringify(webBanks));

        // Re-render with live data
        renderCmsContent();
        applyLanguage(currentLang, false);
      }
    })
    .catch(err => {
      console.log('Offline / Static mode:', err);
    });
}

function renderCmsContent() {
  const setText = (selector, text, byId = true) => {
    const el = byId ? document.getElementById(selector) : document.querySelector(selector);
    if (el && text !== undefined && text !== null) el.textContent = text;
  };
  const setHtml = (id, html) => {
    const el = document.getElementById(id);
    if (el && html !== undefined) el.innerHTML = html;
  };
  const show = (selector, visible) => {
    const el = document.querySelector(selector);
    if (el) el.style.display = visible ? '' : 'none';
  };

  const S = webSettings;
  const center = S.centerName || 'مَرْكَزُ المَغْفِرَةِ';

  // ── Center Name & Logo ──────────────────────────────────────
  if (document.getElementById('webPageTitle')) {
    document.getElementById('webPageTitle').textContent = `${center} لتعليم القرآن الكريم | المنصة التعريفية`;
  }
  setText('logoTitle', center);
  setText('footerLogoTitle', center);
  setText('emblemTitle', center);
  setText('menuBrandTitle', center);
  if (S.logoSubtitle) {
    setText('logoSubtitle', S.logoSubtitle);
    setText('footerLogoSubtitle', S.logoSubtitle);
    setText('emblemSubtitle', S.logoSubtitle);
    setText('menuBrandSubtitle', S.logoSubtitle);
  }

  // ── Hero Badge Tag ───────────────────────────────────────────
  if (S.heroTag) {
    const heroTagEl = document.getElementById('heroTag') || document.querySelector('.hero-badge') || document.querySelector('[data-i18n="hero_tag"]');
    if (heroTagEl) {
      const icon = heroTagEl.querySelector('i');
      heroTagEl.innerHTML = (icon ? icon.outerHTML + ' ' : '') + S.heroTag;
    }
    TRANSLATIONS.ar.hero_tag = S.heroTag;
  }

  // ── Hero Title & Description ──────────────────────────────────
  if (S.heroTitle) {
    const safeTitle = S.heroTitle
      .replace(center, `<span>${center}</span>`)
      .replace('مركز المغفرة', '<span>مركز المغفرة</span>');
    setHtml('heroTitle', safeTitle);
    TRANSLATIONS.ar.hero_title = safeTitle;
  }
  if (S.heroDesc) {
    setText('heroDesc', S.heroDesc);
    TRANSLATIONS.ar.hero_desc = S.heroDesc;
  }

  // ── Quran Verse (always Arabic — never translated) ───────────
  if (S.verseText) {
    const verseEl = document.querySelector('.verse-text');
    if (verseEl) verseEl.textContent = S.verseText;
    // Keep both translations identical to preserve Arabic always
    TRANSLATIONS.ar.hero_verse = S.verseText;
    TRANSLATIONS.en.hero_verse = S.verseText;
  }
  if (S.verseRef) {
    const refEl = document.querySelector('.verse-ref');
    if (refEl) refEl.textContent = S.verseRef;
    TRANSLATIONS.ar.hero_verse_ref = S.verseRef;
    TRANSLATIONS.en.hero_verse_ref = S.verseRef;
  }

  // ── Statistics Numbers + Labels ──────────────────────────────
  const statsGrid = document.querySelector('.stats-grid');
  if (statsGrid && webStats && webStats.length > 0) {
    statsGrid.innerHTML = '';
    webStats.forEach(st => {
      if (st.is_visible !== 0) {
        const label = currentLang === 'en' ? st.label_en : st.label_ar;
        const card = document.createElement('div');
        card.className = 'card stat-card';
        card.innerHTML = `
          <div class="icon-wrapper"><i class="fa-solid ${st.icon_class || 'fa-star'}"></i></div>
          <div class="stat-num" id="statDynamic_${st.id}" data-target="${st.stat_num}">0</div>
          <div class="stat-label">${label}</div>
        `;
        statsGrid.appendChild(card);
      }
    });
  } else {
    // Fallback to static/cached settings if dynamic array not loaded yet
    const statsMap = [
      { id: 'statStudents',  key: 'statStudents',  labelKey: 'statStudentsLabel',  defaultLabel: 'طالب نشط ومستفيد'  },
      { id: 'statRings',     key: 'statRings',     labelKey: 'statRingsLabel',     defaultLabel: 'حلقة تعليمية قائمة' },
      { id: 'statMemorizers',key: 'statMemorizers',labelKey: 'statMemorizersLabel',defaultLabel: 'خاتم ومتميز مجاز' },
      { id: 'statTeachers',  key: 'statTeachers',  labelKey: 'statTeachersLabel',  defaultLabel: 'معلم ومحفظ متطوع' },
    ];
    statsMap.forEach(({ id, key, labelKey, defaultLabel }) => {
      const el = document.getElementById(id);
      if (el && S[key] !== undefined) {
        const val = parseInt(S[key]) || 0;
        el.setAttribute('data-target', val);
        const card = el.closest('.stat-card');
        if (card) card.style.display = val > 0 ? '' : 'none';
      }
      const labelText = S[labelKey] || defaultLabel;
      const card = document.getElementById(id)?.closest('.stat-card');
      if (card) {
        const labelEl = card.querySelector('.stat-label');
        if (labelEl) labelEl.textContent = labelText;
      }
    });
  }

  // ── About Section Description ─────────────────────────────────
  if (S.aboutDesc) {
    const aboutDescEl = document.querySelector('#about .section-desc') || document.querySelector('.about .section-desc');
    if (aboutDescEl) aboutDescEl.textContent = S.aboutDesc;
    TRANSLATIONS.ar.about_desc = S.aboutDesc;
  }

  // ── Vision ───────────────────────────────────────────────────
  const isVisionVisible = (S.visionVisible ?? '1') !== '0';
  const visionCard = document.getElementById('visionCard');
  if (visionCard) {
    visionCard.style.display = isVisionVisible ? '' : 'none';
  }

  if (S.visionTitle) {
    setHtml('visionTitle', `<i class="fa-solid fa-gem"></i> ${S.visionTitle}`);
    TRANSLATIONS.ar.vision_title = S.visionTitle;
  }
  if (S.visionDesc) {
    setText('visionDesc', S.visionDesc);
    TRANSLATIONS.ar.vision_desc = S.visionDesc;
  }

  // ── Features ─────────────────────────────────────────────────
  ['feature1','feature2','feature3','feature4'].forEach((key, i) => {
    if (S[key]) TRANSLATIONS.ar[key] = S[key];
  });
  const featureSpans = document.querySelectorAll('.about-features [data-i18n]');
  featureSpans.forEach(span => {
    const key = span.getAttribute('data-i18n');
    if (S[key]) span.textContent = S[key];
  });

  // ── Pillar Cards — with visibility toggle ─────────────────────
  const pillarCards = document.querySelectorAll('#about .pillar-card, .pillar-card');
  const pillarKeys = [
    { title: 'pillar1Title', desc: 'pillar1Desc', vis: 'pillar1Visible' },
    { title: 'pillar2Title', desc: 'pillar2Desc', vis: 'pillar2Visible' },
    { title: 'pillar3Title', desc: 'pillar3Desc', vis: 'pillar3Visible' },
    { title: 'pillar4Title', desc: 'pillar4Desc', vis: 'pillar4Visible' },
  ];
  pillarCards.forEach((card, i) => {
    if (!pillarKeys[i]) return;
    const { title, desc, vis } = pillarKeys[i];

    // Visibility
    const isVisible = (S[vis] ?? '1') !== '0';
    card.style.display = isVisible ? '' : 'none';

    // Update text
    const titleEl = card.querySelector('.pillar-title, h3');
    const descEl  = card.querySelector('.pillar-desc, p');
    if (titleEl && S[title]) {
      titleEl.textContent = S[title];
      TRANSLATIONS.ar[`pillar${i+1}_title`] = S[title];
    }
    if (descEl && S[desc]) {
      descEl.textContent = S[desc];
      TRANSLATIONS.ar[`pillar${i+1}_desc`] = S[desc];
    }
  });

  // ── Sponsor Section Description ───────────────────────────────
  if (S.sponsorDesc) {
    const sponsorDescEl = document.querySelector('#sponsor .section-sub') || document.querySelector('[data-i18n="sponsor_desc"]');
    if (sponsorDescEl) sponsorDescEl.textContent = S.sponsorDesc;
    TRANSLATIONS.ar.sponsor_desc = S.sponsorDesc;
  }

  // ── Sponsor Impact Card ───────────────────────────────────────
  if (S.sponsorImpactTitle) {
    const impactTitleEl = document.querySelector('.impact-card h3') || document.querySelector('[data-i18n="sponsor_impact_title"]');
    if (impactTitleEl) impactTitleEl.textContent = S.sponsorImpactTitle;
    TRANSLATIONS.ar.sponsor_impact_title = S.sponsorImpactTitle;
  }
  if (S.sponsorImpactDesc) {
    const impactDescEl = document.querySelector('.impact-card > p') || document.querySelector('[data-i18n="sponsor_impact_desc"]');
    if (impactDescEl) impactDescEl.textContent = S.sponsorImpactDesc;
    TRANSLATIONS.ar.sponsor_impact_desc = S.sponsorImpactDesc;
  }

  // ── Sponsor Impact Bullet Points ──────────────────────────────
  if (S.sponsorImpactPoint1) {
    const pt1 = document.querySelector('[data-i18n="impact1"]');
    if (pt1) pt1.textContent = S.sponsorImpactPoint1;
    TRANSLATIONS.ar.impact1 = S.sponsorImpactPoint1;
  }
  if (S.sponsorImpactPoint2) {
    const pt2 = document.querySelector('[data-i18n="impact2"]');
    if (pt2) pt2.textContent = S.sponsorImpactPoint2;
    TRANSLATIONS.ar.impact2 = S.sponsorImpactPoint2;
  }
  if (S.sponsorImpactPoint3) {
    const pt3 = document.querySelector('[data-i18n="impact3"]');
    if (pt3) pt3.textContent = S.sponsorImpactPoint3;
    TRANSLATIONS.ar.impact3 = S.sponsorImpactPoint3;
  }

  // ── Contact Details ───────────────────────────────────────────
  setText('footerPhone',   S.contactPhone);
  setText('footerEmail',   S.contactEmail);
  setText('footerAddress', S.contactAddress);

  // ── Footer ────────────────────────────────────────────────────
  setText('footerCenterDesc', `مركز ريادي يسعى لإحياء الأمة بكتاب الله حفظاً وسلوكاً، وتوظيف الأدوات البرمجية الذكية لدمج الآباء والمعلمين لبناء جيل الحفظ الفاضل في ${center}.`);
  setHtml('footerCopy', `&copy; 2026 ${center} لتعليم القرآن الكريم. جميع الحقوق محفوظة.`);
  
  TRANSLATIONS.ar.footer_copy = `© 2026 ${center} لتعليم القرآن الكريم. جميع الحقوق محفوظة.`;
  TRANSLATIONS.en.footer_copy = `© 2026 ${center} Quran Center. All Rights Reserved.`;

  if (S.designerName) {
    const designerWithPhone = `${S.designerName} (780331184)`;
    TRANSLATIONS.ar.footer_credits = `برمجة وتصميم: <a href="https://wa.me/967780331184" target="_blank" style="color: var(--secondary); text-decoration: none; border-bottom: 1px dashed var(--secondary); font-weight: bold;">${designerWithPhone}</a>`;
    TRANSLATIONS.en.footer_credits = `Designed & Developed by: <a href="https://wa.me/967780331184" target="_blank" style="color: var(--secondary); text-decoration: none; border-bottom: 1px dashed var(--secondary); font-weight: bold;">${designerWithPhone}</a>`;
  } else {
    TRANSLATIONS.ar.footer_credits = `برمجة وتصميم: <a href="https://wa.me/967780331184" target="_blank" style="color: var(--secondary); text-decoration: none; border-bottom: 1px dashed var(--secondary); font-weight: bold;">Antigravity (780331184)</a>`;
    TRANSLATIONS.en.footer_credits = `Designed & Developed by: <a href="https://wa.me/967780331184" target="_blank" style="color: var(--secondary); text-decoration: none; border-bottom: 1px dashed var(--secondary); font-weight: bold;">Antigravity (780331184)</a>`;
  }
  setHtml('footerCredits', t('footer_credits'));

  // ── Footer Social Links ───────────────────────────────────────
  const fbLink = document.getElementById('footerFacebookLink');
  if (fbLink) {
    let link = S.facebookLink || '#';
    if (link.startsWith('#http')) {
      link = link.substring(1);
    }
    fbLink.href = link;
  }
  const waLink = document.getElementById('footerWhatsAppLink');
  if (waLink) {
    let link = S.whatsappLink || '#';
    if (link.startsWith('#http')) {
      link = link.substring(1);
    }
    if (link === '#' || link === '') {
      const phone = S.contactPhone || S.supportPhone || '';
      let cleanPhone = phone.replace(/\D/g, '');
      if (cleanPhone.length === 9 && cleanPhone.startsWith('7')) {
        cleanPhone = '967' + cleanPhone;
      }
      if (cleanPhone) {
        link = 'https://wa.me/' + cleanPhone;
      }
    }
    waLink.href = link;
  }

  // ── Dynamic Colors ────────────────────────────────────────────
  if (S.primaryColor && S.secondaryColor) {
    applyDynamicColors(S.primaryColor, S.secondaryColor);
  }

  // ── Dynamic Support Rings ─────────────────────────────────────
  if (S.supportRings) {
    const ringSelectEl = document.getElementById('selectedRing');
    if (ringSelectEl) {
      // Split by newline, filter empty lines
      const rings = S.supportRings.split('\n').map(r => r.trim()).filter(r => r.length > 0);
      // Keep first option (general / كافة الحلقات)
      const firstOpt = ringSelectEl.options[0];
      ringSelectEl.innerHTML = '';
      if (firstOpt) ringSelectEl.appendChild(firstOpt);
      rings.forEach(ring => {
        const opt = document.createElement('option');
        opt.value = ring;
        opt.textContent = ring;
        ringSelectEl.appendChild(opt);
      });
    }
  }

  // ── Render Donation Cards & Books ─────────────────────────────
  renderDonationCards();
  renderBookCards();
  renderActivities();
  renderShowcases();

  // ── Summer Center Button Control ──────────────────────────────
  const isSummerVisible = (S.summer_center_visible ?? '1') !== '0';
  const summerBtn = document.getElementById('heroSummerBtn');
  if (summerBtn) {
    summerBtn.style.display = isSummerVisible ? 'inline-flex' : 'none';
    const summerBtnText = document.getElementById('heroSummerBtnText');
    if (summerBtnText && S.summer_center_btn_text) {
      summerBtnText.textContent = S.summer_center_btn_text;
    }
  }

  // ── Page Visibility Controls ──────────────────────────────────
  const isPageVisible = (key) => {
    return S[key] !== '0'; // default to visible (true) if undefined or '1'
  };

  const pageFiles = {
    page_home_visible: 'index' + fileExt,
    page_about_visible: 'about' + fileExt,
    page_summer_visible: 'summer' + fileExt,
    page_activities_visible: 'activities' + fileExt,
    page_showcases_visible: 'showcases' + fileExt,
    page_library_visible: 'library' + fileExt,
    page_sponsor_visible: 'sponsor' + fileExt
  };

  Object.entries(pageFiles).forEach(([key, filename]) => {
    const visible = isPageVisible(key);
    const navLinks = document.querySelectorAll(`a[href="${filename}"], a[href="./${filename}"]`);
    navLinks.forEach(link => {
      const li = link.closest('li');
      if (li && !li.classList.contains('menu-brand-wrapper')) {
        li.style.setProperty('display', visible ? '' : 'none', 'important');
      }
    });
  });

  const currentPath = window.location.pathname;
  const currentFile = currentPath.substring(currentPath.lastIndexOf('/') + 1) || defaultIndex;

  Object.entries(pageFiles).forEach(([key, filename]) => {
    if (currentFile === filename && !isPageVisible(key)) {
      document.body.style.overflow = 'hidden';
      const isEn = (typeof currentLang !== 'undefined' && currentLang === 'en') || (localStorage.getItem('web-lang') === 'en');
      
      const title = isEn ? "Page Not Available" : "عذراً، هذه الصفحة غير متوفرة حالياً";
      const desc = isEn 
        ? "Thank you for your interest in Al-Maghfirah Quran Center. This page has been temporarily hidden." 
        : "نشكر اهتمامك بمركز المغفرة لتعليم القرآن الكريم. تم إخفاء هذه الصفحة مؤقتاً لأعمال الصيانة والتحديث.";
      const btnText = isEn ? "Return to Home Page" : "العودة للصفحة الرئيسية";

      document.body.innerHTML = `
        <div style="min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: radial-gradient(circle at center, #111e16 0%, #070c09 100%); color: #fff; font-family: 'Tajawal', 'Inter', sans-serif; text-align: center; padding: 2rem; direction: ${isEn ? 'ltr' : 'rtl'}; z-index: 999999; position: relative;">
          <div style="background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; padding: 3rem 2rem; max-width: 500px; box-shadow: 0 20px 50px rgba(0,0,0,0.3); box-sizing: border-box;">
            <div style="font-size: 5rem; margin-bottom: 1.5rem; filter: drop-shadow(0 0 10px rgba(212,175,55,0.4));">🕌</div>
            <h2 style="font-size: 1.8rem; font-weight: 700; color: #D4AF37; margin-top: 0; margin-bottom: 1rem; letter-spacing: 0.5px;">${title}</h2>
            <p style="font-size: 1rem; color: #a0aab2; line-height: 1.8; margin-bottom: 2rem;">${desc}</p>
            <a href="${defaultIndex}" style="display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: linear-gradient(135deg, #0f5132, #1b7348); color: #fff; text-decoration: none; padding: 0.9rem 2.2rem; border-radius: 50px; font-weight: 700; font-size: 0.95rem; box-shadow: 0 8px 20px rgba(15,81,50,0.3); transition: transform 0.3s ease;">
              <i class="fa-solid fa-house"></i> ${btnText}
            </a>
          </div>
        </div>
      `;
    }
  });

  // ── Hide Summer Center Navigation on Home Page to keep it on a separate page ──
  let baseName = currentFile;
  const dotIndex = currentFile.lastIndexOf('.');
  if (dotIndex !== -1) {
    baseName = currentFile.substring(0, dotIndex);
  }
  baseName = (baseName || 'index').toLowerCase();
  if (baseName === 'index' || baseName === '') {
    baseName = 'index';
  }

  if (baseName === 'index') {
    // Hide header nav link for summer
    document.querySelectorAll('a[href*="summer.php"], a[href*="summer.html"]').forEach(link => {
      const li = link.closest('li');
      if (li && !li.classList.contains('menu-brand-wrapper')) {
        li.style.setProperty('display', 'none', 'important');
      }
    });
    // Hide wheel navigation node for summer
    document.querySelectorAll('.wheel-node[data-page="summer"]').forEach(node => {
      node.style.setProperty('display', 'none', 'important');
    });
    // Hide mobile bottom nav item for summer
    document.querySelectorAll('.mobile-bottom-nav a[data-page="summer"]').forEach(item => {
      item.style.setProperty('display', 'none', 'important');
    });
  }
}

function applyDynamicColors(primary, secondary) {
  if (!primary || !secondary) return;
  const root = document.documentElement;
  
  // Set direct colors
  root.style.setProperty('--primary', primary);
  root.style.setProperty('--secondary', secondary);

  // Helper to convert hex to RGB values
  const hexToRgb = (hex) => {
    hex = hex.replace('#', '');
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  };

  try {
    const pRgb = hexToRgb(primary);
    const sRgb = hexToRgb(secondary);

    // Apply color variants to root styles
    root.style.setProperty('--primary-ultra', `rgba(${pRgb.r}, ${pRgb.g}, ${pRgb.b}, 0.08)`);
    root.style.setProperty('--primary-light', `rgba(${pRgb.r}, ${pRgb.g}, ${pRgb.b}, 0.8)`);
    root.style.setProperty('--blob-1', `rgba(${pRgb.r}, ${pRgb.g}, ${pRgb.b}, 0.14)`);
    root.style.setProperty('--blob-2', `rgba(${sRgb.r}, ${sRgb.g}, ${sRgb.b}, 0.13)`);
    
    // For visual consistency, let secondary variants use sRgb
    root.style.setProperty('--secondary-dark', `rgba(${sRgb.r}, ${sRgb.g}, ${sRgb.b}, 0.85)`);
    root.style.setProperty('--secondary-light', `rgba(${sRgb.r}, ${sRgb.g}, ${sRgb.b}, 1)`);
  } catch (e) {
    console.error('Error applying dynamic colors:', e);
  }
}

function renderDonationCards() {
  const container = document.getElementById('sponsorOptions');
  if (!container) return;

  const amounts = (webSettings.supportAmounts || '100, 300, 1000').split(',').map(s => s.trim());
  const labels = [t('amt_label1'), t('amt_label2'), t('amt_label3')];
  
  container.innerHTML = '';
  amounts.forEach((amt, index) => {
    const label = labels[index] || t('amt_label1');
    const activeClass = index === 0 ? 'active' : '';
    if (index === 0) activeSponsorAmount = parseInt(amt) || 100;

    const card = document.createElement('div');
    card.className = `sponsor-opt ${activeClass}`;
    card.setAttribute('data-amount', amt);
    card.innerHTML = `
      <span class="sponsor-opt-price">${amt} $</span>
      <span class="sponsor-opt-lbl">${label}</span>
    `;

    card.addEventListener('click', () => {
      document.querySelectorAll('.sponsor-opt').forEach(o => o.classList.remove('active'));
      card.classList.add('active');
      activeSponsorAmount = parseInt(amt) || 100;
      showToast(`${t('toast_sponsor_selected')}: ${activeSponsorAmount} $`, 'fa-circle-dollar-to-slot');
    });

    container.appendChild(card);
  });
}

function renderBookCards() {
  const container  = document.getElementById('booksGrid');
  const footerBooks = document.getElementById('footerBooksList');
  if (!container) return;

  container.innerHTML = '';
  if (footerBooks) footerBooks.innerHTML = '';

  webBooks.forEach((book, index) => {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.setAttribute('data-book-id', book.id);

    const coverIcons = ['fa-book-open-reader', 'fa-book-quran', 'fa-feather-pointed'];
    const selectedIcon = coverIcons[index % coverIcons.length];

    // Normalise: DB returns 'description', fallback defaults use 'desc'
    const bookDesc = book.description || book.desc || (currentLang === 'en'
      ? 'An approved curriculum at Al-Maghfirah Center for teaching Quran recitation and Tajweed rules.'
      : 'منهج دراسي معتمد بمركز المغفرة لتدريس الطلاب أحكام تلاوة وتجويد كتاب الله تعالى.');

    const titleShort = book.title.replace(' (المجلد الأول)', '').replace(' (Volume One)', '');

    let coverHtml = '';
    if (book.cover_image) {
      coverHtml = `<div class="book-cover" style="background-image: url('${resolveMediaUrl(book.cover_image)}'); background-size: cover; background-position: center; border-radius: 12px 12px 0 0; cursor: pointer;" onclick="handleBookRead('${book.title}', '${book.file_path || ''}')"></div>`;
    } else {
      const coverIcons = ['fa-book-open-reader', 'fa-book-quran', 'fa-feather-pointed'];
      const selectedIcon = coverIcons[index % coverIcons.length];
      coverHtml = `
        <div class="book-cover" style="cursor: pointer;" onclick="handleBookRead('${book.title}', '${book.file_path || ''}')">
          <span class="book-cover-title">${titleShort}</span>
          <i class="fa-solid ${selectedIcon} book-cover-art"></i>
        </div>
      `;
    }

    card.innerHTML = `
      ${coverHtml}
      <div class="book-body">
        <h3 class="book-title">${book.title}</h3>
        <div class="book-author"><i class="fa-solid fa-pen-nib"></i> ${book.author}</div>
        <p class="book-desc">${bookDesc}</p>
        <div class="book-meta">
          <span class="book-size"><i class="fa-solid fa-file-pdf text-emerald"></i> ${book.size || '10.5 MB'}</span>
          <span class="book-downloads" id="dlCount${book.id}"><i class="fa-solid fa-download"></i> ${book.downloads || 0} ${t('book_downloads_label')}</span>
        </div>
        <div class="book-actions">
          <button class="btn btn-primary book-btn-dl" onclick="handleBookDownload('${book.id}', '${book.title}', '${book.file_path || ''}')">
            <i class="fa-solid fa-circle-down"></i> ${t('book_download')}
          </button>
          <button class="btn btn-outline book-btn-read" onclick="handleBookRead('${book.title}', '${book.file_path || ''}')">
            <i class="fa-solid fa-eye"></i> ${t('book_read')}
          </button>
        </div>
      </div>
    `;
    container.appendChild(card);

    if (footerBooks && index < 4) {
      const li = document.createElement('li');
      li.innerHTML = `<a href="#library">${book.title.split(' (')[0]}</a>`;
      footerBooks.appendChild(li);
    }
  });
}

/* ==========================================================================
   Theme Management (Light / Dark)
   ========================================================================== */
function initTheme() {
  const themeToggles = document.querySelectorAll('.theme-toggle');
  const body = document.body;

  const savedTheme = localStorage.getItem('web-theme') || 'light';
  body.setAttribute('data-theme', savedTheme);
  
  // Initialize all theme toggle icons in sync
  themeToggles.forEach(toggle => {
    const icon = toggle.querySelector('i');
    if (icon) updateThemeIcon(savedTheme, icon);
  });

  themeToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const currentTheme = body.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      body.setAttribute('data-theme', newTheme);
      localStorage.setItem('web-theme', newTheme);
      
      // Update all toggle icons to the new state
      themeToggles.forEach(otherToggle => {
        const icon = otherToggle.querySelector('i');
        if (icon) updateThemeIcon(newTheme, icon);
      });
      
      showToast(
        newTheme === 'light' ? 'تم التفعيل للوضع المضيء المريح' : 'تم التفعيل للوضع الليلي المهدئ للعين',
        'fa-circle-half-stroke'
      );
    });
  });
}

function updateThemeIcon(theme, icon) {
  if (theme === 'dark') {
    icon.className = 'fa-solid fa-sun';
    icon.style.color = '#D4AF37';
  } else {
    icon.className = 'fa-solid fa-moon';
    icon.style.color = '';
  }
}

/* ==========================================================================
   Mobile Menu Navigation Toggle (للنافبار الأفقية الجديدة)
   ========================================================================== */
function initMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  const navLinksItems = document.querySelectorAll('.nav-link');

  if (!mobileMenuBtn || !navLinks) return;

  mobileMenuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    navLinks.classList.toggle('active');
    const icon = mobileMenuBtn.querySelector('i');
    if (navLinks.classList.contains('active')) {
      icon.className = 'fa-solid fa-xmark';
    } else {
      icon.className = 'fa-solid fa-bars';
    }
  });

  navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      const icon = mobileMenuBtn.querySelector('i');
      if (icon) icon.className = 'fa-solid fa-bars';
    });
  });

  document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
      navLinks.classList.remove('active');
      const icon = mobileMenuBtn.querySelector('i');
      if (icon) icon.className = 'fa-solid fa-bars';
    }
  });
}

/* ==========================================================================
   Header Scroll Shrink + Active Nav Link (مثل موقع التشييد الأنيق)
   ========================================================================== */
function initHeaderScrollShrink() {
  const header = document.getElementById('main-header');
  const navLinks = document.querySelectorAll('.nav-link');

  const onScroll = () => {
    // Shrink header on scroll
    if (header) {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  };

  const highlightActive = () => {
    const path = window.location.pathname.toLowerCase();
    let activePage = 'index';

    if (path.includes('about')) {
      activePage = 'about';
    } else if (path.includes('activities')) {
      activePage = 'activities';
    } else if (path.includes('showcases')) {
      activePage = 'showcases';
    } else if (path.includes('library')) {
      activePage = 'library';
    } else if (path.includes('sponsor')) {
      activePage = 'sponsor';
    }

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href) {
        const hrefLower = href.toLowerCase();
        const isMatch = hrefLower.includes(activePage) || 
                        (activePage === 'index' && (href === '#' || href === './' || hrefLower.includes('index')));
        if (isMatch) {
          link.classList.add('active');
        }
      }
    });
  };

  window.addEventListener('scroll', onScroll);
  onScroll(); // trigger on load
  highlightActive(); // highlight nav link on load
}

/* ==========================================================================
   Animated Statistics Counter
   ========================================================================== */
function initStatsCounter() {
  const statsSection = document.getElementById('stats');
  if (!statsSection) return;

  let animated = false;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        animateNumbers();
        obs.unobserve(entry.target);
      }
    });
  }, { root: null, threshold: 0.1 });

  observer.observe(statsSection);

  function animateNumbers() {
    // Dynamically find all stat-num elements inside stats section!
    const statNums = statsSection.querySelectorAll('.stat-num');
    statNums.forEach(el => {
      const targetVal = el.getAttribute('data-target');
      const target = parseInt(targetVal) || 0;
      if (target <= 0) {
        el.textContent = '0';
        return;
      }
      let start = 0;
      const duration = 1800;
      const steps = Math.max(target, 1);
      const stepTime = Math.max(1, Math.floor(duration / steps));

      const timer = setInterval(() => {
        start += Math.ceil(steps / 60);
        el.textContent = Math.min(start, target);
        if (start >= target) {
          el.textContent = target + '+';
          clearInterval(timer);
        }
      }, stepTime);
    });
  }
}

/* ==========================================================================
   Interactive Forms & Modals
   ========================================================================== */
function initDonationForm() {
  const donationForm = document.getElementById('donationForm');
  if (!donationForm) return;

  donationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const donorName = document.getElementById('donorName').value;
    const donorPhone = document.getElementById('donorPhone').value;
    const selectedRingEl = document.getElementById('selectedRing');
    const selectedRingVal = selectedRingEl.value;
    const selectedRingName = selectedRingEl.options[selectedRingEl.selectedIndex].text;

    // Post donation to API
    const formData = new FormData();
    formData.append('donor_name', donorName);
    formData.append('donor_phone', donorPhone);
    formData.append('amount', activeSponsorAmount);
    formData.append('ring_id', selectedRingVal);

    fetch(getApiUrl('api/send_donation.php'), {
      method: 'POST',
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      console.log('Donation database response:', data);
    })
    .catch(err => {
      console.log('Donation saved in offline cache:', err);
    });

    // Dynamic Custom Thank-You Message
    const thanksTitle = currentLang === 'en' 
      ? (webSettings.donation_thanks_title_en || 'May Allah Reward Your Generosity!')
      : (webSettings.donation_thanks_title_ar || 'شكر الله عطاءكم!');
      
    let thanksBody = currentLang === 'en'
      ? (webSettings.donation_thanks_msg_en || 'We have successfully received your support request. Our public relations team will contact you to coordinate the contribution.')
      : (webSettings.donation_thanks_msg_ar || 'لقد تلقينا طلب الدعم الافتراضي الخاص بك بنجاح. سيقوم قسم العلاقات العامة بالتواصل معك لتنسيق المساهمة.');

    // Append donation summary in a premium block
    thanksBody += `
      <div style="margin: 20px 0; padding: 15px; background: rgba(15,81,50,0.05); border: 1px solid var(--primary-ultra); border-radius: 12px; text-align: right; direction: rtl; box-shadow: 0 4px 15px rgba(0,0,0,0.02);">
        <div style="font-weight: 700; color: var(--primary); margin-bottom: 8px; font-size: 1rem;"><i class="fa-solid fa-file-invoice-dollar" style="color: var(--secondary);"></i> تفاصيل طلب الدعم:</div>
        <div style="font-size: 0.9rem; margin-bottom: 4px; color: var(--text-color);">👤 الاسم: <strong>${donorName}</strong></div>
        <div style="font-size: 0.9rem; margin-bottom: 4px; color: var(--text-color);">💰 المبلغ: <strong style="color: var(--secondary); font-size: 1.1rem;">${activeSponsorAmount} $</strong></div>
        <div style="font-size: 0.9rem; margin-bottom: 4px; color: var(--text-color);">🕌 التخصيص: <strong>${selectedRingName}</strong></div>
        <div style="font-size: 0.9rem; color: var(--text-color);">📞 الهاتف: <strong>${donorPhone}</strong></div>
      </div>
    `;

    // Render Dynamic Bank Accounts in Modal
    if (webBanks && webBanks.length > 0) {
      let bankAccountsHtml = `
        <div class="bank-accounts-modal-box" style="margin-top: 25px; border-top: 1px solid rgba(0,0,0,0.08); padding-top: 20px;">
          <h4 style="font-weight: 700; color: var(--primary); margin-bottom: 15px; font-size: 1.05rem; text-align: right;"><i class="fa-solid fa-building-columns" style="color: var(--secondary);"></i> ${t('bank_accounts_title')}</h4>
          <div style="display: flex; flex-direction: column; gap: 12px; max-height: 220px; overflow-y: auto; padding-left: 5px;">
      `;

      webBanks.forEach(bk => {
        if (bk.is_visible !== 0) {
          const bankName = currentLang === 'en' ? bk.bank_name_en : bk.bank_name_ar;
          const holderName = currentLang === 'en' ? bk.account_holder_en : bk.account_holder_ar;
          bankAccountsHtml += `
            <div style="background: rgba(255,255,255,0.4); border: 1px solid var(--card-border); border-radius: 10px; padding: 12px 16px; text-align: right; direction: rtl; box-shadow: 0 2px 8px rgba(0,0,0,0.03);">
              <div style="font-weight: 700; color: var(--text-color); font-size: 0.92rem; display: flex; align-items: center; gap: 6px;">
                <i class="fa-solid fa-money-check-dollar" style="color: var(--primary);"></i> ${bankName}
              </div>
              <div style="font-size: 0.85rem; color: var(--text-sub); margin-top: 6px;">
                ${t('bank_number_label')} <strong style="font-family: monospace; font-size: 1.05rem; letter-spacing: 0.5px; color: var(--primary);">${bk.account_number}</strong>
              </div>
              <div style="font-size: 0.82rem; color: var(--text-sub); margin-top: 2px;">
                ${t('bank_holder_label')} <strong>${holderName}</strong>
              </div>
            </div>
          `;
        }
      });

      bankAccountsHtml += `
          </div>
        </div>
      `;
      thanksBody += bankAccountsHtml;
    }

    document.getElementById('modalThanksTitle').innerHTML = thanksTitle;
    document.getElementById('modalThanksBody').innerHTML = thanksBody;

    // Configure WhatsApp follow-up button
    const whatsappBtn = document.getElementById('modalWhatsAppBtn');
    if (whatsappBtn) {
      const rawPhone = webSettings.supportPhone || '+967770000000';
      const cleanPhone = rawPhone.replace(/\D/g, ''); // Keep only digits
      
      const messageText = `السلام عليكم ورحمة الله وبركاته، أود المساهمة في دعم حلقات مركز المغفرة.

👤 الاسم الكريـم: ${donorName}
📞 رقم الهاتف: ${donorPhone}
💰 قيمة الدعم: ${activeSponsorAmount} $
🕌 تخصيص الدعم: ${selectedRingName}
      `;
      
      whatsappBtn.href = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`;
    }

    openModal('successModal');
    donationForm.reset();
  });
}

/* Modal Helpers */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      closeModal(backdrop.id);
    }
  });
});

/* ==========================================================================
   Book Handling (Read / Download Simulation)
   ========================================================================== */
window.handleBookDownload = function(bookId, bookName, filePath) {
  const dlCountEl = document.getElementById(`dlCount${bookId}`);
  if (dlCountEl) {
    const currentText = dlCountEl.textContent;
    const currentNum = parseInt(currentText.replace(/\D/g, '')) || 0;
    dlCountEl.innerHTML = `<i class="fa-solid fa-download"></i> ${currentNum + 1} ${t('book_downloads_label')}`;
    
    // Sync back download increment to local storage!
    const idx = webBooks.findIndex(b => b.id.toString() === bookId);
    if (idx !== -1) {
      webBooks[idx].downloads = (webBooks[idx].downloads || 0) + 1;
      localStorage.setItem('db_web_books', JSON.stringify(webBooks));
    }
  }
  
  showToast(`بدأ تحميل مقرر "${bookName}" بصيغة PDF...`, 'fa-file-pdf');

  if (filePath) {
    const link = document.createElement('a');
    link.href = resolveMediaUrl(filePath);
    link.download = bookName + '.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

window.handleBookRead = function(bookTitle, filePath) {
  if (!filePath) {
    showToast(currentLang === 'en' ? 'No PDF file linked to this book.' : 'لا يوجد ملف PDF مرتبط بهذا المنهج.', 'fa-circle-exclamation');
    return;
  }
  showMediaPreview(bookTitle, currentLang === 'en' ? 'Curriculum' : 'منهج', '', 'pdf', filePath);
};

/* ==========================================================================
   Visual Toast Notification Helper
   ========================================================================== */
function showToast(message, iconClass = 'fa-info-circle') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <i class="fa-solid ${iconClass}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideInUp 0.3s reverse forwards';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3500);
}



/* ==========================================================================
   💎 Scroll Reveal Animation Engine (محرك الظهور التدريجي للأقسام عند التمرير)
   ========================================================================== */
function initRevealOnScroll() {
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length === 0) return;

  const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    observer.observe(el);
  });
}

/* ==========================================================================
   البرامج والأنشطة (Activities & Programs) - Dynamic Rendering
   ========================================================================== */
function resolveMediaUrl(path) {
  if (!path) return '';
  path = path.trim();
  
  if (!path.startsWith('http://') && !path.startsWith('https://')) {
    return getApiUrl(path);
  }
  
  // Google Drive Link Conversion
  if (path.includes('drive.google.com')) {
    let fileId = '';
    let match = path.match(/\/file\/d\/([^\/]+)/);
    if (match && match[1]) {
      fileId = match[1];
    } else {
      match = path.match(/[?&]id=([^&]+)/);
      if (match && match[1]) {
        fileId = match[1];
      }
    }
    if (fileId) {
      return `https://docs.google.com/uc?export=view&id=${fileId}`;
    }
  }
  return path;
}

function renderMediaPreview(container, mediaPath, title, cat = '') {
  container.innerHTML = '';
  if (!mediaPath) return;
  mediaPath = mediaPath.trim();

  // 1. YouTube Video
  if (mediaPath.includes('youtube.com') || mediaPath.includes('youtu.be')) {
    let videoId = '';
    let match = mediaPath.match(/[?&]v=([^&]+)/);
    if (match && match[1]) {
      videoId = match[1];
    } else {
      match = mediaPath.match(/youtu\.be\/([^\/\?]+)/);
      if (match && match[1]) {
        videoId = match[1];
      }
    }
    if (videoId) {
      container.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" width="100%" height="380" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen style="border-radius: 12px; display: block; border: none;"></iframe>`;
      return;
    }
  }

  // 2. Google Drive Link
  if (mediaPath.includes('drive.google.com')) {
    let fileId = '';
    let match = mediaPath.match(/\/file\/d\/([^\/]+)/);
    if (match && match[1]) {
      fileId = match[1];
    } else {
      match = mediaPath.match(/[?&]id=([^&]+)/);
      if (match && match[1]) {
        fileId = match[1];
      }
    }
    if (fileId) {
      const isVideoOrAudioOrPdf = cat.includes('فيديو') || cat.includes('Video') || cat.includes('صوت') || cat.includes('Voice') || cat.includes('منهج') || cat.includes('Curriculum') || mediaPath.match(/\.(mp4|webm|ogg|mp3|wav|pdf)$/i);
      if (isVideoOrAudioOrPdf) {
        container.innerHTML = `<iframe src="https://drive.google.com/file/d/${fileId}/preview" width="100%" height="450" frameborder="0" allowfullscreen style="border-radius: 12px; background: #000; display: block; border: none;"></iframe>`;
        return;
      } else {
        container.innerHTML = `<img src="https://docs.google.com/uc?export=view&id=${fileId}" alt="${title}" style="max-height: 420px; max-width: 100%; object-fit: contain; border-radius: 12px; display: block; margin: 0 auto;">`;
        return;
      }
    }
  }

  // 3. Facebook Video
  if (mediaPath.includes('facebook.com')) {
    container.innerHTML = `<iframe src="https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(mediaPath)}&show_text=0" width="100%" height="380" style="border:none;overflow:hidden;border-radius: 12px; display: block;" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>`;
    return;
  }

  // 4. Default Standard Files
  const isVideo = mediaPath.match(/\.(mp4|webm|ogg)$/i) || cat.includes('فيديو') || cat.includes('Video');
  const isAudio = mediaPath.match(/\.(mp3|wav|ogg)$/i) || cat.includes('صوت') || cat.includes('Voice');
  const isPdf = mediaPath.match(/\.pdf$/i) || cat.includes('منهج') || cat.includes('Curriculum');
  const resolved = resolveMediaUrl(mediaPath);

  if (isVideo) {
    container.innerHTML = `<video src="${resolved}" controls autoplay playsinline style="max-height: 420px; max-width: 100%; border-radius: 12px; outline: none; background: #000; width: 100%; display: block;"></video>`;
  } else if (isAudio) {
    container.innerHTML = `<audio src="${resolved}" controls autoplay style="width: 100%; margin: 20px 0; display: block;"></audio>`;
  } else if (isPdf) {
    container.innerHTML = `<iframe src="${resolved}" width="100%" height="450" frameborder="0" allowfullscreen style="border-radius: 12px; background: #fff; display: block; border: none;"></iframe>`;
  } else {
    container.innerHTML = `<img src="${resolved}" alt="${title}" style="max-height: 420px; max-width: 100%; object-fit: contain; border-radius: 12px; display: block; margin: 0 auto;">`;
  }
}

function ensureMediaPreviewModal() {
  if (document.getElementById('mediaPreviewModal')) return;
  const modalHtml = `
    <div class="modal-backdrop" id="mediaPreviewModal" style="z-index: 1100000;">
      <div class="modal-card" style="max-width: 720px; width: 95%;">
        <div class="modal-header">
          <h3 class="modal-title" id="mediaPreviewTitle"><i class="fa-solid fa-circle-play"></i> استعراض</h3>
          <button class="modal-close" onclick="closeModal('mediaPreviewModal')">&times;</button>
        </div>
        <div class="modal-body" style="padding: 15px; text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center;">
          <div id="mediaPreviewContainer" style="width: 100%; display: flex; justify-content: center; align-items: center; min-height: 200px;"></div>
          <p id="mediaPreviewDesc" style="margin-top: 15px; font-size: 0.95rem; color: var(--text-sub); line-height: 1.6; text-align: right; width: 100%; padding: 0 10px;"></p>
        </div>
      </div>
    </div>
  `;
  const div = document.createElement('div');
  div.innerHTML = modalHtml.trim();
  document.body.appendChild(div.firstChild);
}

window.showMediaPreview = function(title, cat, desc, mediaType, mediaPath) {
  ensureMediaPreviewModal();
  
  const container = document.getElementById('mediaPreviewContainer');
  const descEl = document.getElementById('mediaPreviewDesc');
  const titleEl = document.getElementById('mediaPreviewTitle');
  if (!container || !descEl) return;

  titleEl.innerHTML = `<i class="fa-solid fa-star-and-crescent" style="color: var(--secondary);"></i> ${cat ? cat + ' — ' : ''}${title}`;
  descEl.textContent = desc || '';
  
  renderMediaPreview(container, mediaPath, title, cat);
  openModal('mediaPreviewModal');

  const backdrop = document.getElementById('mediaPreviewModal');
  const closeBtn = backdrop ? backdrop.querySelector('.modal-close') : null;
  
  const cleanupFn = () => {
    const video = container.querySelector('video');
    if (video) {
      video.pause();
      video.src = '';
      video.load();
    }
    const audio = container.querySelector('audio');
    if (audio) {
      audio.pause();
      audio.src = '';
      audio.load();
    }
    const iframe = container.querySelector('iframe');
    if (iframe) {
      iframe.src = '';
    }
    closeModal('mediaPreviewModal');
  };

  if (backdrop) {
    backdrop.onclick = (e) => {
      if (e.target === backdrop) cleanupFn();
    };
  }
  if (closeBtn) {
    closeBtn.onclick = cleanupFn;
  }
};

function renderActivities() {
  const container = document.getElementById('activitiesGrid');
  if (!container) return;

  container.innerHTML = '';
  
  if (!webActivities || webActivities.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-sub); font-weight: 700;">
        <i class="fa-regular fa-folder-open" style="font-size: 3rem; opacity: 0.5; margin-bottom: 1rem; display: block;"></i>
        لا توجد برامج أو أنشطة مضافة حالياً.
      </div>
    `;
    return;
  }

  webActivities.forEach((act, index) => {
    if (act.is_visible === 0) return;

    const card = document.createElement('div');
    card.className = 'book-card activity-card';
    card.style.cursor = 'pointer';
    
    const title = currentLang === 'en' ? act.title_en : act.title_ar;
    const desc = currentLang === 'en' ? act.desc_en : act.desc_ar;

    let coverHtml = '';
    const resolvedImg = resolveMediaUrl(act.image_path);
    if (act.image_path) {
      coverHtml = `
        <div class="book-cover activity-cover" style="background-image: url('${resolvedImg}'); background-size: cover; background-position: center; border-radius: 12px 12px 0 0; height: 200px; position: relative;">
          <div style="position: absolute; inset: 0; background: rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s;" class="showcase-hover-overlay">
            <i class="fa-solid fa-magnifying-glass-plus" style="font-size: 3rem; color: white;"></i>
          </div>
        </div>`;
    } else {
      coverHtml = `
        <div class="book-cover activity-cover" style="height: 200px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: linear-gradient(135deg, var(--primary), var(--secondary)); color: white; position: relative;">
          <span style="font-weight: 900; font-size: 1.2rem; color: white; text-shadow: 0 2px 4px rgba(0,0,0,0.2); z-index: 2; padding: 0 10px; text-align: center;">${title}</span>
          <i class="fa-solid fa-mosque" style="font-size: 3.5rem; opacity: 0.25; position: absolute; bottom: 15px; left: 15px; color: white; z-index: 1;"></i>
          <div style="position: absolute; inset: 0; background: rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s;" class="showcase-hover-overlay">
            <i class="fa-solid fa-magnifying-glass-plus" style="font-size: 3rem; color: white;"></i>
          </div>
        </div>
      `;
    }

    card.innerHTML = `
      ${coverHtml}
      <div class="book-body" style="padding: 1.25rem;">
        <h3 class="book-title" style="font-size: 1.15rem; font-weight: 700; margin-bottom: 0.75rem;">${title}</h3>
        <p class="book-desc" style="font-size: 0.88rem; color: var(--text-sub); line-height: 1.6; min-height: 4.8em;">${desc || ''}</p>
      </div>
    `;

    card.addEventListener('mouseenter', () => {
      const overlay = card.querySelector('.showcase-hover-overlay');
      if (overlay) overlay.style.opacity = '1';
    });
    card.addEventListener('mouseleave', () => {
      const overlay = card.querySelector('.showcase-hover-overlay');
      if (overlay) overlay.style.opacity = '0';
    });

    card.addEventListener('click', () => {
      showMediaPreview(title, currentLang === 'en' ? 'Activity' : 'نشاط', desc, 'image', act.image_path);
    });

    container.appendChild(card);
  });
}

/* ==========================================================================
   نماذج المركز (Student Showcases) - Dynamic Rendering
   ========================================================================== */
function renderShowcases() {
  const container = document.getElementById('showcasesGrid');
  if (!container) return;

  container.innerHTML = '';

  if (!webShowcases || webShowcases.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-sub); font-weight: 700;">
        <i class="fa-regular fa-folder-open" style="font-size: 3rem; opacity: 0.5; margin-bottom: 1rem; display: block;"></i>
        لا توجد نماذج طلاب مضافة حالياً.
      </div>
    `;
    return;
  }

  webShowcases.forEach(show => {
    if (show.is_visible === 0) return;

    const card = document.createElement('div');
    card.className = 'book-card showcase-card';
    card.style.cursor = 'pointer';

    const title = currentLang === 'en' ? show.title_en : show.title_ar;
    const cat = currentLang === 'en' ? show.cat_en : show.cat_ar;
    const desc = currentLang === 'en' ? show.desc_en : show.desc_ar;

    let mediaBadge = '';
    let coverHtml = '';
    
    if (show.media_type === 'video') {
      mediaBadge = `<span style="position: absolute; top: 12px; right: 12px; background: rgba(220,53,69,0.9); color: white; padding: 4px 10px; border-radius: 50px; font-size: 0.75rem; font-weight: 700; z-index: 3; display: flex; align-items: center; gap: 4px;"><i class="fa-solid fa-video"></i> فيديو</span>`;
    } else {
      mediaBadge = `<span style="position: absolute; top: 12px; right: 12px; background: rgba(15,81,50,0.9); color: white; padding: 4px 10px; border-radius: 50px; font-size: 0.75rem; font-weight: 700; z-index: 3; display: flex; align-items: center; gap: 4px;"><i class="fa-solid fa-image"></i> صورة</span>`;
    }

    if (show.media_type === 'video') {
      const posterSrc = show.video_cover ? resolveMediaUrl(show.video_cover) : '';
      if (posterSrc) {
        coverHtml = `
          <div class="book-cover showcase-cover" style="background-image: url('${posterSrc}'); background-size: cover; background-position: center; border-radius: 12px 12px 0 0; height: 180px; position: relative;">
            ${mediaBadge}
            <div style="position: absolute; inset: 0; background: rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; transition: background 0.3s;" class="showcase-hover-overlay">
              <i class="fa-solid fa-circle-play" style="font-size: 3.5rem; color: #ff3333; filter: drop-shadow(0 4px 10px rgba(0,0,0,0.3));"></i>
            </div>
          </div>
        `;
      } else {
        coverHtml = `
          <div class="book-cover showcase-cover" style="height: 180px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: linear-gradient(135deg, #12161a, var(--primary)); color: white; position: relative;">
            ${mediaBadge}
            <i class="fa-solid fa-circle-play" style="font-size: 3.5rem; color: #ff3333; filter: drop-shadow(0 4px 10px rgba(0,0,0,0.3)); margin-bottom: 8px;"></i>
            <span style="font-weight: 700; font-size: 0.95rem; opacity: 0.85;">${cat}</span>
            <div style="position: absolute; inset: 0; background: rgba(0,0,0,0.15); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s;" class="showcase-hover-overlay"></div>
          </div>
        `;
      }
    } else if (show.media_path) {
      const resolvedImg = resolveMediaUrl(show.media_path);
      coverHtml = `
        <div class="book-cover showcase-cover" style="background-image: url('${resolvedImg}'); background-size: cover; background-position: center; border-radius: 12px 12px 0 0; height: 180px; position: relative;">
          ${mediaBadge}
          <div style="position: absolute; inset: 0; background: rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s;" class="showcase-hover-overlay">
            <i class="fa-solid fa-magnifying-glass-plus" style="font-size: 3rem; color: white;"></i>
          </div>
        </div>
      `;
    } else {
      const isVoice = cat.includes('صوت') || cat.includes('Voice');
      const icon = isVoice ? 'fa-microphone-lines' : 'fa-pen-fancy';
      coverHtml = `
        <div class="book-cover showcase-cover" style="height: 180px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: linear-gradient(135deg, #12161a, var(--primary)); color: white; position: relative;">
          ${mediaBadge}
          <i class="fa-solid ${icon}" style="font-size: 3.5rem; color: var(--secondary); margin-bottom: 8px;"></i>
          <span style="font-weight: 700; font-size: 0.95rem; opacity: 0.85;">${cat}</span>
          <div style="position: absolute; inset: 0; background: rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s;" class="showcase-hover-overlay">
            <i class="fa-solid fa-magnifying-glass-plus" style="font-size: 3rem; color: white;"></i>
          </div>
        </div>
      `;
    }

    card.innerHTML = `
      ${coverHtml}
      <div class="book-body" style="padding: 1.25rem;">
        <span style="font-size: 0.75rem; font-weight: 700; color: var(--secondary); text-transform: uppercase; letter-spacing: 0.5px;">${cat}</span>
        <h3 class="book-title" style="font-size: 1.1rem; font-weight: 700; margin: 4px 0 8px;">${title}</h3>
        <p class="book-desc" style="font-size: 0.85rem; color: var(--text-sub); line-height: 1.5; min-height: 3em; margin-bottom: 0;">${desc || ''}</p>
      </div>
    `;

    card.addEventListener('mouseenter', () => {
      const overlay = card.querySelector('.showcase-hover-overlay');
      if (overlay) overlay.style.opacity = '1';
    });
    card.addEventListener('mouseleave', () => {
      const overlay = card.querySelector('.showcase-hover-overlay');
      if (overlay) overlay.style.opacity = '0';
    });

    card.addEventListener('click', () => {
      showMediaPreview(title, cat, desc, show.media_type, show.media_path);
    });

    container.appendChild(card);
  });
}

/* ==========================================================================
   💎 Astrolabe Navigation Wheel Controller (متحكم العجلة الملاحية التفاعلية)
   ========================================================================== */
function initNavWheel() {
  const wheelInner = document.getElementById('wheelInner');
  const wheelNodes = document.querySelectorAll('.wheel-node');
  const sidebarThemeToggle = document.getElementById('sidebarThemeToggle');
  
  if (!wheelInner || wheelNodes.length === 0) return;
  
  // Spacing the 6 pages by 60deg
  const pageAngles = {
    'index': -120,
    'about': -70,
    'summer': -20,
    'activities': 30,
    'showcases': 80,
    'library': 130,
    'sponsor': 180
  };

  // Detect current page file name and extension dynamically
  const currentPath = window.location.pathname;
  let currentFile = currentPath.substring(currentPath.lastIndexOf('/') + 1) || defaultIndex;
  if (currentFile.includes('?')) currentFile = currentFile.split('?')[0];
  if (currentFile.includes('#')) currentFile = currentFile.split('#')[0];
  
  // Extract base name dynamically
  let baseName = currentFile;
  const dotIndex = currentFile.lastIndexOf('.');
  if (dotIndex !== -1) {
    baseName = currentFile.substring(0, dotIndex);
  } else {
    // If extensionless (e.g. running under custom router or live server)
    baseName = currentFile || 'index';
  }

  // Fallback for directory root (empty string) and convert to lowercase
  baseName = (baseName || 'index').toLowerCase();
  
  let activePageKey = 'index';
  if (baseName === 'about') activePageKey = 'about';
  else if (baseName === 'summer') activePageKey = 'summer';
  else if (baseName === 'activities') activePageKey = 'activities';
  else if (baseName === 'showcases') activePageKey = 'showcases';
  else if (baseName === 'library') activePageKey = 'library';
  else if (baseName === 'sponsor') activePageKey = 'sponsor';

  let currentRotation = 0;
  let isFirstLoad = true;

  // Function to rotate wheel to specific page
  function rotateWheelToPage(pageKey, immediate = false) {
    if (pageAngles[pageKey] === undefined) return;
    
    const angle = pageAngles[pageKey];
    const isEn = currentLang === 'en';
    const targetAngle = isEn ? (180 - angle) : -angle;
    
    if (immediate || isFirstLoad) {
      currentRotation = targetAngle;
      wheelInner.style.transition = 'none';
      isFirstLoad = false;
    } else {
      // Shortest-path calculation
      let diff = (targetAngle - currentRotation) % 360;
      if (diff > 180) {
        diff -= 360;
      } else if (diff < -180) {
        diff += 360;
      }
      currentRotation = currentRotation + diff;
      wheelInner.style.transition = 'transform 1.2s cubic-bezier(0.1, 0.9, 0.2, 1)';
    }
    
    wheelInner.style.transform = `rotate(${currentRotation}deg)`;
    wheelInner.style.setProperty('--wheel-rotation', `${currentRotation}deg`);
    
    // Highlight correct active node
    wheelNodes.forEach(node => {
      const nodePage = node.getAttribute('data-page');
      if (nodePage === pageKey) {
        node.classList.add('active');
      } else {
        node.classList.remove('active');
      }
    });

    // Also sync the Mobile Bottom Nav items!
    const bottomNavItems = document.querySelectorAll('.mobile-bottom-nav .nav-item');
    bottomNavItems.forEach(item => {
      const itemPage = item.getAttribute('data-page');
      if (itemPage === pageKey) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  // Expose to global window scope so applyLanguage can trigger re-alignment
  window.rotateWheelToPage = rotateWheelToPage;
  window.activePageKey = activePageKey;

  // Bind click event listeners to wheel nodes
  wheelNodes.forEach(node => {
    node.addEventListener('click', (e) => {
      e.preventDefault();
      const targetPage = node.getAttribute('data-page');
      
      if (targetPage === activePageKey) {
        // Already on this page, scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      
      // Perform dynamic visual rotation first
      rotateWheelToPage(targetPage);
      
      // Allow rotation animation to play visually, then navigate directly
      setTimeout(() => {
        triggerExitTransitionAndNavigate(targetPage + fileExt);
      }, 600);
    });
  });

  // Sync sidebar theme toggle click with general toggles
  if (sidebarThemeToggle) {
    sidebarThemeToggle.addEventListener('click', () => {
      const body = document.body;
      const currentTheme = body.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      body.setAttribute('data-theme', newTheme);
      localStorage.setItem('web-theme', newTheme);
      
      // Update all toggle icons on the page
      const allToggles = document.querySelectorAll('.theme-toggle');
      allToggles.forEach(toggle => {
        const icon = toggle.querySelector('i');
        if (icon) {
          if (newTheme === 'dark') {
            icon.className = 'fa-solid fa-sun';
            icon.style.color = '#D4AF37';
          } else {
            icon.className = 'fa-solid fa-moon';
            icon.style.color = '';
          }
        }
      });
      
      // Fallback translations if showToast is used
      const msg = newTheme === 'light' 
        ? (TRANSLATIONS[currentLang]?.toast_theme_light || 'تم التفعيل للوضع المضيء المريح')
        : (TRANSLATIONS[currentLang]?.toast_theme_dark || 'تم التفعيل للوضع الليلي المهدئ للعين');
      showToast(msg, 'fa-circle-half-stroke');
    });
  }

  // Initial startup rotation animation
  rotateWheelToPage(activePageKey, true); // set initial angle instantly to prevent jumpiness
  setTimeout(() => {
    // Beautiful startup rotation entrance transition
    rotateWheelToPage(activePageKey);
  }, 100);
}
