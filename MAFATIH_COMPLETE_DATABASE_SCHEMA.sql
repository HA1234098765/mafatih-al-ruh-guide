-- 🕌 قاعدة البيانات المتكاملة لمشروع مفاتيح - مساعد المسلم الذكي الشامل
-- يجب تشغيل هذا الملف في Supabase SQL Editor

-- ========================================
-- 1. جداول المستخدمين والملفات الشخصية
-- ========================================

-- جدول المستخدمين الأساسي
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    name VARCHAR(255),
    age INTEGER CHECK (age > 0 AND age < 150),
    gender VARCHAR(10) CHECK (gender IN ('male', 'female')),
    language VARCHAR(5) DEFAULT 'ar' CHECK (language IN ('ar', 'en')),
    location VARCHAR(255),
    timezone VARCHAR(50) DEFAULT 'Asia/Riyadh',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true
);

-- جدول إعدادات المستخدم
CREATE TABLE IF NOT EXISTS user_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    theme VARCHAR(10) DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
    notifications_enabled BOOLEAN DEFAULT true,
    sound_enabled BOOLEAN DEFAULT true,
    prayer_notifications BOOLEAN DEFAULT true,
    dhikr_reminders BOOLEAN DEFAULT true,
    daily_verse_enabled BOOLEAN DEFAULT true,
    preferred_reciter INTEGER DEFAULT 7,
    font_size VARCHAR(10) DEFAULT 'medium' CHECK (font_size IN ('small', 'medium', 'large')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول أوقات الصلاة المخصصة
CREATE TABLE IF NOT EXISTS user_prayer_times (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    fajr TIME NOT NULL DEFAULT '05:30',
    dhuhr TIME NOT NULL DEFAULT '12:30',
    asr TIME NOT NULL DEFAULT '15:45',
    maghrib TIME NOT NULL DEFAULT '18:20',
    isha TIME NOT NULL DEFAULT '19:45',
    calculation_method VARCHAR(50) DEFAULT 'umm_al_qura',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 2. جداول المحتوى الإسلامي
-- ========================================

-- جدول آيات القرآن الكريم
CREATE TABLE IF NOT EXISTS quran_verses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    surah_number INTEGER NOT NULL CHECK (surah_number BETWEEN 1 AND 114),
    surah_name VARCHAR(100) NOT NULL,
    surah_name_english VARCHAR(100),
    ayah_number INTEGER NOT NULL,
    arabic_text TEXT NOT NULL,
    translation_ar TEXT,
    translation_en TEXT,
    tafseer TEXT,
    revelation_type VARCHAR(10) CHECK (revelation_type IN ('مكية', 'مدنية')),
    theme TEXT[] DEFAULT '{}',
    juz_number INTEGER CHECK (juz_number BETWEEN 1 AND 30),
    hizb_number INTEGER CHECK (hizb_number BETWEEN 1 AND 60),
    page_number INTEGER CHECK (page_number BETWEEN 1 AND 604),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(surah_number, ayah_number)
);

-- جدول الأحاديث الشريفة
CREATE TABLE IF NOT EXISTS hadith_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    arabic_text TEXT NOT NULL,
    translation_ar TEXT,
    translation_en TEXT,
    narrator VARCHAR(255),
    source_book VARCHAR(255) NOT NULL,
    book_number INTEGER,
    hadith_number INTEGER,
    grade VARCHAR(20) CHECK (grade IN ('صحيح', 'حسن', 'ضعيف', 'موضوع')) DEFAULT 'صحيح',
    chapter VARCHAR(255),
    explanation TEXT,
    tags TEXT[] DEFAULT '{}',
    theme TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول الأسئلة الشرعية
CREATE TABLE IF NOT EXISTS islamic_questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    source VARCHAR(255) NOT NULL,
    category VARCHAR(50) CHECK (category IN ('فقه', 'عقيدة', 'أخلاق', 'عبادات', 'معاملات', 'سيرة', 'تفسير')),
    scholar VARCHAR(255),
    reliability VARCHAR(20) CHECK (reliability IN ('صحيح', 'حسن', 'ضعيف')) DEFAULT 'صحيح',
    tags TEXT[] DEFAULT '{}',
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('مبتدئ', 'متوسط', 'متقدم')) DEFAULT 'متوسط',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول الفتاوى
CREATE TABLE IF NOT EXISTS fatawa (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    fatwa_number VARCHAR(50),
    source_website VARCHAR(255),
    scholar VARCHAR(255),
    category VARCHAR(50),
    date_issued DATE,
    reliability VARCHAR(20) CHECK (reliability IN ('موثق', 'غير موثق')) DEFAULT 'موثق',
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول الأذكار والأدعية
CREATE TABLE IF NOT EXISTS azkar_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    arabic_text TEXT NOT NULL,
    translation_ar TEXT,
    translation_en TEXT,
    category VARCHAR(50) NOT NULL, -- تسبيح، حمد، تكبير، دعاء، استغفار
    timing VARCHAR(50), -- morning، evening، anytime، after_prayer
    count_recommended INTEGER DEFAULT 1,
    reward TEXT,
    source VARCHAR(255),
    mood TEXT[] DEFAULT '{}', -- حزن، فرح، قلق، شكر، عادي
    difficulty VARCHAR(20) CHECK (difficulty IN ('سهل', 'متوسط', 'صعب')) DEFAULT 'سهل',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول أسماء الله الحسنى
CREATE TABLE IF NOT EXISTS allah_names (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name_arabic VARCHAR(100) NOT NULL,
    name_transliteration VARCHAR(100),
    meaning_arabic TEXT,
    meaning_english TEXT,
    explanation TEXT,
    verse_reference TEXT,
    order_number INTEGER UNIQUE CHECK (order_number BETWEEN 1 AND 99),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 3. جداول التتبع والإحصائيات
-- ========================================

-- جدول تتبع الصلوات
CREATE TABLE IF NOT EXISTS prayer_tracking (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    prayer_name VARCHAR(20) NOT NULL CHECK (prayer_name IN ('fajr', 'dhuhr', 'asr', 'maghrib', 'isha')),
    prayer_date DATE NOT NULL,
    performed_at TIMESTAMP WITH TIME ZONE,
    is_on_time BOOLEAN DEFAULT true,
    is_in_congregation BOOLEAN DEFAULT false,
    location VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, prayer_name, prayer_date)
);

-- جدول تتبع قراءة القرآن
CREATE TABLE IF NOT EXISTS quran_reading_tracking (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    surah_number INTEGER NOT NULL,
    ayah_from INTEGER NOT NULL,
    ayah_to INTEGER NOT NULL,
    pages_read INTEGER DEFAULT 1,
    reading_date DATE NOT NULL,
    duration_minutes INTEGER,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول تتبع الأذكار
CREATE TABLE IF NOT EXISTS dhikr_tracking (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    azkar_id UUID REFERENCES azkar_data(id),
    count_completed INTEGER NOT NULL DEFAULT 0,
    target_count INTEGER NOT NULL,
    session_date DATE NOT NULL,
    timing VARCHAR(50),
    mood VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول الإنجازات والشارات
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    achievement_type VARCHAR(50) NOT NULL, -- prayer_streak، quran_completion، dhikr_master
    achievement_name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    points_earned INTEGER DEFAULT 0,
    achieved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    level_achieved VARCHAR(50) -- bronze، silver، gold، platinum
);

-- جدول النقاط والمستويات
CREATE TABLE IF NOT EXISTS user_points (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    total_points INTEGER DEFAULT 0,
    current_level VARCHAR(50) DEFAULT 'مبتدئ',
    level_progress INTEGER DEFAULT 0, -- نسبة مئوية للمستوى التالي
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 4. جداول المفضلات والتخصيص
-- ========================================

-- جدول الآيات المفضلة
CREATE TABLE IF NOT EXISTS favorite_verses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    verse_id UUID REFERENCES quran_verses(id),
    notes TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, verse_id)
);

-- جدول الأحاديث المفضلة
CREATE TABLE IF NOT EXISTS favorite_hadith (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    hadith_id UUID REFERENCES hadith_data(id),
    notes TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, hadith_id)
);

-- جدول الأذكار المفضلة
CREATE TABLE IF NOT EXISTS favorite_azkar (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    azkar_id UUID REFERENCES azkar_data(id),
    custom_count INTEGER,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, azkar_id)
);

-- ========================================
-- 5. جداول الخطط والأهداف
-- ========================================

-- جدول الخطط الإيمانية
CREATE TABLE IF NOT EXISTS spiritual_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration_weeks INTEGER DEFAULT 1,
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('سهل', 'متوسط', 'متقدم', 'صعب')) DEFAULT 'متوسط',
    category VARCHAR(50), -- عبادة، أخلاق، تزكية، علم
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول مهام الخطط الإيمانية
CREATE TABLE IF NOT EXISTS spiritual_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    plan_id UUID REFERENCES spiritual_plans(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    difficulty VARCHAR(20) CHECK (difficulty IN ('سهل', 'متوسط', 'متقدم', 'صعب')) DEFAULT 'متوسط',
    duration VARCHAR(100), -- "15 دقيقة"، "يومياً"، إلخ
    reward TEXT,
    day_number INTEGER DEFAULT 1,
    week_number INTEGER DEFAULT 1,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول تتبع تقدم المستخدم في الخطط
CREATE TABLE IF NOT EXISTS user_plan_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES spiritual_plans(id) ON DELETE CASCADE,
    task_id UUID REFERENCES spiritual_tasks(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5), -- تقييم المهمة
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, task_id)
);

-- جدول الأهداف الشخصية
CREATE TABLE IF NOT EXISTS user_goals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    goal_type VARCHAR(50) NOT NULL, -- daily_prayers، weekly_quran، daily_dhikr
    target_value INTEGER NOT NULL,
    current_value INTEGER DEFAULT 0,
    period VARCHAR(20) CHECK (period IN ('daily', 'weekly', 'monthly')) DEFAULT 'daily',
    start_date DATE NOT NULL,
    end_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 6. جداول الإشعارات والتذكيرات
-- ========================================

-- جدول الإشعارات
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- prayer، dhikr، verse، achievement، reminder
    priority VARCHAR(20) CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
    is_read BOOLEAN DEFAULT false,
    scheduled_for TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول التذكيرات المخصصة
CREATE TABLE IF NOT EXISTS custom_reminders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    reminder_type VARCHAR(50), -- prayer، dhikr، quran، custom
    frequency VARCHAR(20) CHECK (frequency IN ('once', 'daily', 'weekly', 'monthly')),
    time_of_day TIME,
    days_of_week INTEGER[], -- [1,2,3,4,5,6,7] للأيام
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 7. جداول المحتوى التفاعلي
-- ========================================

-- جدول الاقتباسات الإيمانية
CREATE TABLE IF NOT EXISTS inspirational_quotes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    text_arabic TEXT NOT NULL,
    text_english TEXT,
    author VARCHAR(255),
    source VARCHAR(255),
    category VARCHAR(50), -- حكمة، دعاء، تحفيز، تأمل
    tags TEXT[] DEFAULT '{}',
    mood TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول المقالات والمحتوى التعليمي
CREATE TABLE IF NOT EXISTS educational_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    summary TEXT,
    author VARCHAR(255),
    category VARCHAR(50), -- فقه، عقيدة، أخلاق، سيرة، تفسير
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('مبتدئ', 'متوسط', 'متقدم')) DEFAULT 'متوسط',
    reading_time_minutes INTEGER,
    tags TEXT[] DEFAULT '{}',
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول تقييمات المحتوى
CREATE TABLE IF NOT EXISTS content_ratings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content_id UUID REFERENCES educational_content(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    review TEXT,
    is_helpful BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, content_id)
);

-- ========================================
-- 8. جداول التحليلات والإحصائيات
-- ========================================

-- جدول إحصائيات الاستخدام اليومية
CREATE TABLE IF NOT EXISTS daily_usage_stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    prayers_completed INTEGER DEFAULT 0,
    quran_pages_read INTEGER DEFAULT 0,
    dhikr_sessions INTEGER DEFAULT 0,
    time_spent_minutes INTEGER DEFAULT 0,
    features_used TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- جدول سجل الأنشطة
CREATE TABLE IF NOT EXISTS activity_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL, -- login، prayer، quran_read، dhikr، achievement
    activity_details JSONB,
    points_earned INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 9. الفهارس لتحسين الأداء
-- ========================================

-- فهارس جدول المستخدمين
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- فهارس جدول آيات القرآن
CREATE INDEX IF NOT EXISTS idx_quran_surah_number ON quran_verses(surah_number);
CREATE INDEX IF NOT EXISTS idx_quran_ayah_number ON quran_verses(ayah_number);
CREATE INDEX IF NOT EXISTS idx_quran_theme ON quran_verses USING gin(theme);
CREATE INDEX IF NOT EXISTS idx_quran_text_search ON quran_verses USING gin(to_tsvector('arabic', arabic_text));
CREATE INDEX IF NOT EXISTS idx_quran_juz ON quran_verses(juz_number);
CREATE INDEX IF NOT EXISTS idx_quran_page ON quran_verses(page_number);

-- فهارس جدول الأحاديث
CREATE INDEX IF NOT EXISTS idx_hadith_grade ON hadith_data(grade);
CREATE INDEX IF NOT EXISTS idx_hadith_source ON hadith_data(source_book);
CREATE INDEX IF NOT EXISTS idx_hadith_text_search ON hadith_data USING gin(to_tsvector('arabic', arabic_text));
CREATE INDEX IF NOT EXISTS idx_hadith_theme ON hadith_data USING gin(theme);
CREATE INDEX IF NOT EXISTS idx_hadith_tags ON hadith_data USING gin(tags);

-- فهارس جدول الأسئلة الشرعية
CREATE INDEX IF NOT EXISTS idx_islamic_questions_category ON islamic_questions(category);
CREATE INDEX IF NOT EXISTS idx_islamic_questions_reliability ON islamic_questions(reliability);
CREATE INDEX IF NOT EXISTS idx_islamic_questions_search ON islamic_questions USING gin(to_tsvector('arabic', question));
CREATE INDEX IF NOT EXISTS idx_islamic_questions_tags ON islamic_questions USING gin(tags);

-- فهارس جدول الأذكار
CREATE INDEX IF NOT EXISTS idx_azkar_category ON azkar_data(category);
CREATE INDEX IF NOT EXISTS idx_azkar_timing ON azkar_data(timing);
CREATE INDEX IF NOT EXISTS idx_azkar_mood ON azkar_data USING gin(mood);

-- فهارس جداول التتبع
CREATE INDEX IF NOT EXISTS idx_prayer_tracking_user_date ON prayer_tracking(user_id, prayer_date);
CREATE INDEX IF NOT EXISTS idx_prayer_tracking_prayer_name ON prayer_tracking(prayer_name);
CREATE INDEX IF NOT EXISTS idx_quran_tracking_user_date ON quran_reading_tracking(user_id, reading_date);
CREATE INDEX IF NOT EXISTS idx_dhikr_tracking_user_date ON dhikr_tracking(user_id, session_date);

-- فهارس جدول المفضلات
CREATE INDEX IF NOT EXISTS idx_favorite_verses_user ON favorite_verses(user_id);
CREATE INDEX IF NOT EXISTS idx_favorite_hadith_user ON favorite_hadith(user_id);
CREATE INDEX IF NOT EXISTS idx_favorite_azkar_user ON favorite_azkar(user_id);

-- فهارس جدول الإشعارات
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_scheduled ON notifications(scheduled_for);

-- فهارس جدول الأنشطة
CREATE INDEX IF NOT EXISTS idx_activity_log_user ON activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_type ON activity_log(activity_type);
CREATE INDEX IF NOT EXISTS idx_activity_log_created ON activity_log(created_at);

-- ========================================
-- 10. البيانات الأولية الأساسية
-- ========================================

-- إدراج أسماء الله الحسنى (الأسماء الأكثر شهرة)
INSERT INTO allah_names (name_arabic, name_transliteration, meaning_arabic, meaning_english, order_number) VALUES
('الله', 'Allah', 'الاسم الأعظم الجامع لجميع الصفات', 'Allah - The Greatest Name', 0),
('الرحمن', 'Ar-Rahman', 'الرحيم بجميع خلقه في الدنيا', 'The Most Merciful', 1),
('الرحيم', 'Ar-Raheem', 'الرحيم بالمؤمنين خاصة في الآخرة', 'The Most Compassionate', 2),
('الملك', 'Al-Malik', 'المالك لكل شيء والمتصرف فيه', 'The King', 3),
('القدوس', 'Al-Quddus', 'المنزه عن كل نقص وعيب', 'The Holy One', 4),
('السلام', 'As-Salaam', 'السالم من كل آفة ونقص', 'The Source of Peace', 5),
('المؤمن', 'Al-Mu''min', 'المصدق لرسله بالمعجزات', 'The Guardian of Faith', 6),
('المهيمن', 'Al-Muhaymin', 'المسيطر على كل شيء الرقيب عليه', 'The Protector', 7),
('العزيز', 'Al-Aziz', 'الغالب الذي لا يُغلب', 'The Mighty', 8),
('الجبار', 'Al-Jabbar', 'الذي يجبر الخلق على ما يريد', 'The Compeller', 9),
('المتكبر', 'Al-Mutakabbir', 'المتعالي عن صفات الخلق', 'The Supreme', 10),
('الخالق', 'Al-Khaliq', 'الذي أوجد الأشياء من العدم', 'The Creator', 11),
('البارئ', 'Al-Bari', 'الذي برأ الخلق وصورهم', 'The Evolver', 12),
('المصور', 'Al-Musawwir', 'الذي صور المخلوقات كما شاء', 'The Fashioner', 13),
('الغفار', 'Al-Ghafar', 'الذي يغفر الذنوب مرة بعد مرة', 'The Repeatedly Forgiving', 14),
('القهار', 'Al-Qahhar', 'الذي قهر كل شيء وغلبه', 'The Subduer', 15),
('الوهاب', 'Al-Wahhab', 'الذي يهب العطايا بلا عوض', 'The Bestower', 16),
('الرزاق', 'Ar-Razzaq', 'الذي يرزق جميع المخلوقات', 'The Provider', 17),
('الفتاح', 'Al-Fattah', 'الذي يفتح أبواب الرحمة والرزق', 'The Opener', 18),
('العليم', 'Al-Aleem', 'الذي يعلم كل شيء', 'The All-Knowing', 19),
('القابض', 'Al-Qabid', 'الذي يقبض الأرزاق والأرواح', 'The Constrictor', 20)
ON CONFLICT (order_number) DO NOTHING;

-- إدراج مجموعة شاملة من الأذكار
INSERT INTO azkar_data (arabic_text, translation_ar, category, timing, count_recommended, reward, source, mood) VALUES
-- أذكار التسبيح والحمد والتكبير
('سبحان الله', 'تنزيه الله عن كل نقص', 'تسبيح', 'anytime', 33, 'تملأ الميزان', 'صحيح مسلم', ARRAY['عادي', 'شكر', 'سعادة']),
('الحمد لله', 'الثناء على الله بصفاته الحميدة', 'حمد', 'anytime', 33, 'تملأ ما بين السماء والأرض', 'صحيح مسلم', ARRAY['شكر', 'سعادة', 'راحة']),
('الله أكبر', 'الله أعظم من كل شيء', 'تكبير', 'anytime', 34, 'أحب إلى الله مما طلعت عليه الشمس', 'صحيح مسلم', ARRAY['قوة', 'عزيمة', 'تحدي']),

-- أذكار التوحيد
('لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير', 'توحيد الله وإفراده بالعبادة', 'توحيد', 'morning', 10, 'كعتق عشر رقاب', 'صحيح البخاري', ARRAY['عادي', 'تأمل', 'خشوع']),
('لا إله إلا الله', 'شهادة التوحيد', 'توحيد', 'anytime', 100, 'أفضل الذكر', 'صحيح الترمذي', ARRAY['إيمان', 'يقين', 'طمأنينة']),

-- أذكار الاستغفار
('أستغفر الله العظيم الذي لا إله إلا هو الحي القيوم وأتوب إليه', 'طلب المغفرة من الله', 'استغفار', 'anytime', 100, 'محو الذنوب', 'سنن أبي داود', ARRAY['ندم', 'توبة', 'رجاء']),
('أستغفر الله', 'طلب المغفرة البسيط', 'استغفار', 'anytime', 100, 'مغفرة الذنوب', 'صحيح البخاري', ARRAY['ندم', 'توبة', 'تطهير']),
('رب اغفر لي ذنبي وخطئي وجهلي', 'دعاء شامل للمغفرة', 'استغفار', 'anytime', 3, 'مغفرة شاملة', 'صحيح البخاري', ARRAY['ندم', 'توبة', 'تواضع']),

-- أذكار الصباح والمساء
('أصبحنا وأصبح الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له', 'ذكر بداية اليوم', 'صباح', 'morning', 1, 'حفظ طوال اليوم', 'صحيح مسلم', ARRAY['بداية', 'حماية', 'بركة']),
('أمسينا وأمسى الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له', 'ذكر بداية المساء', 'مساء', 'evening', 1, 'حفظ طوال الليل', 'صحيح مسلم', ARRAY['سكينة', 'حماية', 'راحة']),
('اللهم بك أصبحنا وبك أمسينا وبك نحيا وبك نموت وإليك النشور', 'تفويض الأمر لله', 'صباح', 'morning', 1, 'التوكل على الله', 'صحيح الترمذي', ARRAY['توكل', 'تسليم', 'راحة']),

-- أذكار النوم
('باسمك اللهم أموت وأحيا', 'ذكر عند النوم', 'نوم', 'before_sleep', 1, 'حفظ في النوم', 'صحيح البخاري', ARRAY['نوم', 'حماية', 'سكينة']),
('اللهم أسلمت نفسي إليك، ووجهت وجهي إليك، وفوضت أمري إليك', 'تفويض الأمر لله قبل النوم', 'نوم', 'before_sleep', 1, 'حسن الخاتمة', 'صحيح البخاري', ARRAY['تسليم', 'توكل', 'راحة']),

-- أذكار بعد الصلاة
('اللهم أعني على ذكرك وشكرك وحسن عبادتك', 'دعاء للإعانة على العبادة', 'بعد الصلاة', 'after_prayer', 1, 'الإعانة على العبادة', 'سنن أبي داود', ARRAY['عبادة', 'خشوع', 'إخلاص']),
('اللهم لا مانع لما أعطيت، ولا معطي لما منعت، ولا ينفع ذا الجد منك الجد', 'إقرار بقدرة الله المطلقة', 'بعد الصلاة', 'after_prayer', 1, 'زيادة في الإيمان', 'صحيح البخاري', ARRAY['يقين', 'تسليم', 'حكمة']),

-- أذكار الطعام
('بسم الله', 'البسملة قبل الطعام', 'طعام', 'before_eating', 1, 'بركة في الطعام', 'صحيح البخاري', ARRAY['بركة', 'شكر']),
('الحمد لله الذي أطعمنا وسقانا وجعلنا مسلمين', 'شكر الله بعد الطعام', 'طعام', 'after_eating', 1, 'شكر النعمة', 'صحيح الترمذي', ARRAY['شكر', 'امتنان', 'رضا']),

-- أدعية عامة
('اللهم إني أسألك من فضلك ورحمتك', 'دعاء طلب الفضل والرحمة', 'دعاء', 'anytime', 1, 'نيل فضل الله ورحمته', 'صحيح الترمذي', ARRAY['رجاء', 'أمل', 'تضرع']),
('ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة وقنا عذاب النار', 'دعاء جامع للخير', 'دعاء', 'anytime', 1, 'خير الدنيا والآخرة', 'صحيح البخاري', ARRAY['شمولية', 'توازن', 'حكمة']),
('اللهم اهدني فيمن هديت، وعافني فيمن عافيت', 'دعاء الهداية والعافية', 'دعاء', 'anytime', 1, 'الهداية والعافية', 'سنن الترمذي', ARRAY['هداية', 'عافية', 'رجاء'])
ON CONFLICT DO NOTHING;

-- إدراج خطط إيمانية متنوعة وشاملة
INSERT INTO spiritual_plans (title, description, duration_weeks, difficulty_level, category) VALUES
-- خطط العبادة الأساسية
('تقوية الصلة بالله', 'أسبوع مخصص لتحسين العبادات الأساسية وتقوية الصلة بالله تعالى', 1, 'متوسط', 'عبادة'),
('الأذكار اليومية', 'برنامج لتعويد النفس على الأذكار والأدعية المأثورة يومياً', 2, 'سهل', 'عبادة'),
('إتقان الصلاة', 'برنامج شامل لتحسين جودة الصلاة والخشوع فيها', 3, 'متوسط', 'عبادة'),
('قيام الليل التدريجي', 'خطة لتعويد النفس على قيام الليل بشكل تدريجي', 4, 'متقدم', 'عبادة'),

-- خطط القرآن والعلم
('حفظ القرآن التدريجي', 'خطة منهجية لحفظ القرآن الكريم بطريقة تدريجية ومنظمة', 52, 'صعب', 'علم'),
('تدبر القرآن اليومي', 'برنامج يومي لتدبر آيات القرآن الكريم وفهم معانيها', 4, 'متوسط', 'علم'),
('حفظ الأحاديث النبوية', 'خطة لحفظ الأحاديث النبوية الأساسية', 8, 'متوسط', 'علم'),
('تعلم السيرة النبوية', 'برنامج شامل لدراسة سيرة النبي محمد صلى الله عليه وسلم', 12, 'سهل', 'علم'),

-- خطط الأخلاق والتزكية
('تزكية النفس', 'برنامج لتطهير النفس من الأخلاق السيئة وتحليتها بالأخلاق الحسنة', 8, 'متقدم', 'أخلاق'),
('بر الوالدين', 'خطة عملية لتحسين العلاقة مع الوالدين وبرهما', 2, 'سهل', 'أخلاق'),
('الصدق والأمانة', 'برنامج لتعزيز خلق الصدق والأمانة في الحياة اليومية', 3, 'متوسط', 'أخلاق'),
('التواضع وخفض الجناح', 'خطة لتنمية خلق التواضع والتخلص من الكبر', 4, 'متقدم', 'أخلاق'),

-- خطط الدعوة والعمل الخيري
('الدعوة إلى الله', 'برنامج لتعلم أساليب الدعوة إلى الله بالحكمة والموعظة الحسنة', 6, 'متقدم', 'دعوة'),
('العمل التطوعي', 'خطة للمشاركة في الأعمال الخيرية وخدمة المجتمع', 4, 'سهل', 'خدمة'),
('صلة الرحم', 'برنامج لتقوية الروابط الأسرية وصلة الأرحام', 2, 'سهل', 'أخلاق')
ON CONFLICT DO NOTHING;

-- إدراج مهام متنوعة للخطط المختلفة
INSERT INTO spiritual_tasks (plan_id, title, description, category, difficulty, duration, reward, day_number, week_number) VALUES

-- مهام خطة "تقوية الصلة بالله"
((SELECT id FROM spiritual_plans WHERE title = 'تقوية الصلة بالله' LIMIT 1), 'صلاة الفجر في وقتها', 'احرص على أداء صلاة الفجر في وقتها لمدة 7 أيام متتالية', 'عبادة', 'متوسط', 'يومياً', 'تقوية الإيمان وبركة في اليوم', 1, 1),
((SELECT id FROM spiritual_plans WHERE title = 'تقوية الصلة بالله' LIMIT 1), 'قراءة صفحة من القرآن', 'اقرأ صفحة واحدة من القرآن الكريم يومياً مع التدبر', 'عبادة', 'سهل', '15 دقيقة', 'زيادة في الحسنات وطمأنينة القلب', 1, 1),
((SELECT id FROM spiritual_plans WHERE title = 'تقوية الصلة بالله' LIMIT 1), 'الأذكار بعد الصلاة', 'احرص على أذكار ما بعد الصلاة لكل صلاة', 'عبادة', 'سهل', '5 دقائق', 'مضاعفة الأجر وحفظ من الشيطان', 1, 1),
((SELECT id FROM spiritual_plans WHERE title = 'تقوية الصلة بالله' LIMIT 1), 'الدعاء قبل النوم', 'ادع الله بخير الدنيا والآخرة قبل النوم', 'عبادة', 'سهل', '10 دقائق', 'استجابة الدعاء وحفظ في النوم', 1, 1),
((SELECT id FROM spiritual_plans WHERE title = 'تقوية الصلة بالله' LIMIT 1), 'الاستغفار 100 مرة', 'استغفر الله 100 مرة يومياً', 'عبادة', 'سهل', '10 دقائق', 'محو الذنوب وزيادة الرزق', 2, 1),
((SELECT id FROM spiritual_plans WHERE title = 'تقوية الصلة بالله' LIMIT 1), 'صلة الرحم', 'اتصل بأحد الأقارب أو زرهم', 'أخلاق', 'سهل', '30 دقيقة', 'بركة في العمر والرزق', 3, 1),
((SELECT id FROM spiritual_plans WHERE title = 'تقوية الصلة بالله' LIMIT 1), 'التسبيح والتحميد', 'سبح الله واحمده 100 مرة', 'عبادة', 'سهل', '15 دقيقة', 'ثقل في الميزان', 4, 1),

-- مهام خطة "الأذكار اليومية"
((SELECT id FROM spiritual_plans WHERE title = 'الأذكار اليومية' LIMIT 1), 'أذكار الصباح', 'احرص على أذكار الصباح كاملة', 'عبادة', 'سهل', '15 دقيقة', 'حفظ وبركة طوال اليوم', 1, 1),
((SELECT id FROM spiritual_plans WHERE title = 'الأذكار اليومية' LIMIT 1), 'أذكار المساء', 'احرص على أذكار المساء كاملة', 'عبادة', 'سهل', '15 دقيقة', 'حفظ وسكينة طوال الليل', 1, 1),
((SELECT id FROM spiritual_plans WHERE title = 'الأذكار اليومية' LIMIT 1), 'أذكار النوم', 'اقرأ أذكار النوم قبل النوم', 'عبادة', 'سهل', '10 دقائق', 'نوم هادئ وحماية', 1, 1),
((SELECT id FROM spiritual_plans WHERE title = 'الأذكار اليومية' LIMIT 1), 'الذكر عند الطعام', 'احرص على البسملة قبل الطعام والحمد بعده', 'عبادة', 'سهل', '1 دقيقة', 'بركة في الطعام', 1, 1),

-- مهام خطة "تزكية النفس"
((SELECT id FROM spiritual_plans WHERE title = 'تزكية النفس' LIMIT 1), 'محاسبة النفس اليومية', 'اجلس مع نفسك 10 دقائق يومياً لمحاسبتها', 'أخلاق', 'متوسط', '10 دقائق', 'تطهير النفس وتقويمها', 1, 1),
((SELECT id FROM spiritual_plans WHERE title = 'تزكية النفس' LIMIT 1), 'التخلص من عادة سيئة', 'اختر عادة سيئة واعمل على التخلص منها', 'أخلاق', 'صعب', 'يومياً', 'تطهير النفس وتزكيتها', 1, 1),
((SELECT id FROM spiritual_plans WHERE title = 'تزكية النفس' LIMIT 1), 'اكتساب خلق حسن', 'اختر خلقاً حسناً واعمل على اكتسابه', 'أخلاق', 'متوسط', 'يومياً', 'تحلية النفس بالأخلاق الحسنة', 1, 1),
((SELECT id FROM spiritual_plans WHERE title = 'تزكية النفس' LIMIT 1), 'قراءة في كتب التزكية', 'اقرأ صفحات من كتب تزكية النفس', 'علم', 'سهل', '20 دقيقة', 'زيادة في العلم والحكمة', 1, 1),

-- مهام خطة "تدبر القرآن اليومي"
((SELECT id FROM spiritual_plans WHERE title = 'تدبر القرآن اليومي' LIMIT 1), 'تدبر آية واحدة', 'اختر آية واحدة وتدبر معناها وتطبيقها', 'علم', 'متوسط', '15 دقيقة', 'فهم أعمق للقرآن', 1, 1),
((SELECT id FROM spiritual_plans WHERE title = 'تدبر القرآن اليومي' LIMIT 1), 'قراءة التفسير', 'اقرأ تفسير الآيات التي تدبرتها', 'علم', 'متوسط', '20 دقيقة', 'زيادة في الفهم والعلم', 1, 1),
((SELECT id FROM spiritual_plans WHERE title = 'تدبر القرآن اليومي' LIMIT 1), 'تطبيق عملي', 'طبق ما تعلمته من الآية في حياتك', 'تطبيق', 'متوسط', 'يومياً', 'تحويل العلم إلى عمل', 1, 1),

-- مهام خطة "بر الوالدين"
((SELECT id FROM spiritual_plans WHERE title = 'بر الوالدين' LIMIT 1), 'الاتصال اليومي', 'اتصل بوالديك يومياً للاطمئنان عليهما', 'أخلاق', 'سهل', '10 دقائق', 'رضا الوالدين ورضا الله', 1, 1),
((SELECT id FROM spiritual_plans WHERE title = 'بر الوالدين' LIMIT 1), 'تقديم المساعدة', 'ساعد والديك في أعمال المنزل أو احتياجاتهما', 'أخلاق', 'سهل', '30 دقيقة', 'بركة في العمر والرزق', 1, 1),
((SELECT id FROM spiritual_plans WHERE title = 'بر الوالدين' LIMIT 1), 'الدعاء لهما', 'ادع لوالديك في كل صلاة', 'عبادة', 'سهل', '2 دقيقة', 'استجابة الدعاء وبر الوالدين', 1, 1),
((SELECT id FROM spiritual_plans WHERE title = 'بر الوالدين' LIMIT 1), 'إهداء هدية', 'أهد والديك هدية بسيطة تعبر عن حبك', 'أخلاق', 'سهل', 'مرة واحدة', 'إدخال السرور على قلبيهما', 7, 1)
ON CONFLICT DO NOTHING;

-- إدراج مجموعة شاملة من الاقتباسات الإيمانية
INSERT INTO inspirational_quotes (text_arabic, author, source, category, mood) VALUES
-- آيات التحفيز والأمل
('إن مع العسر يسراً', 'القرآن الكريم', 'سورة الشرح: 6', 'تحفيز', ARRAY['حزن', 'يأس', 'صبر', 'أمل']),
('لا تحزن إن الله معنا', 'القرآن الكريم', 'سورة التوبة: 40', 'تحفيز', ARRAY['حزن', 'خوف', 'قلق', 'طمأنينة']),
('وبشر الصابرين', 'القرآن الكريم', 'سورة البقرة: 155', 'تحفيز', ARRAY['صبر', 'ابتلاء', 'ثبات']),
('ومن يتق الله يجعل له مخرجاً', 'القرآن الكريم', 'سورة الطلاق: 2', 'تحفيز', ARRAY['ضيق', 'مشاكل', 'تقوى']),
('وما أصابكم من مصيبة فبما كسبت أيديكم ويعفو عن كثير', 'القرآن الكريم', 'سورة الشورى: 30', 'تأمل', ARRAY['ابتلاء', 'تفكر', 'محاسبة']),

-- آيات السكينة والطمأنينة
('ألا بذكر الله تطمئن القلوب', 'القرآن الكريم', 'سورة الرعد: 28', 'تأمل', ARRAY['قلق', 'اضطراب', 'سكينة', 'ذكر']),
('وهو معكم أين ما كنتم', 'القرآن الكريم', 'سورة الحديد: 4', 'تأمل', ARRAY['وحدة', 'غربة', 'معية', 'أنس']),
('فاذكروني أذكركم', 'القرآن الكريم', 'سورة البقرة: 152', 'عبادة', ARRAY['ذكر', 'قرب', 'محبة']),
('وما خلقت الجن والإنس إلا ليعبدون', 'القرآن الكريم', 'سورة الذاريات: 56', 'هدف', ARRAY['هدف', 'معنى', 'عبادة']),

-- آيات التوكل والثقة
('وعلى الله فليتوكل المؤمنون', 'القرآن الكريم', 'سورة آل عمران: 122', 'توكل', ARRAY['قلق', 'خوف', 'ثقة', 'تسليم']),
('حسبنا الله ونعم الوكيل', 'القرآن الكريم', 'سورة آل عمران: 173', 'توكل', ARRAY['توكل', 'ثقة', 'تفويض']),
('وما توفيقي إلا بالله عليه توكلت وإليه أنيب', 'القرآن الكريم', 'سورة هود: 88', 'توكل', ARRAY['توفيق', 'إنابة', 'تواضع']),

-- آيات الرحمة والمغفرة
('إن الله غفور رحيم', 'القرآن الكريم', 'متكررة في القرآن', 'رحمة', ARRAY['ذنب', 'توبة', 'رجاء', 'مغفرة']),
('ورحمتي وسعت كل شيء', 'القرآن الكريم', 'سورة الأعراف: 156', 'رحمة', ARRAY['رحمة', 'شمولية', 'أمل']),
('قل يا عبادي الذين أسرفوا على أنفسهم لا تقنطوا من رحمة الله', 'القرآن الكريم', 'سورة الزمر: 53', 'رحمة', ARRAY['يأس', 'ذنوب', 'رجاء', 'توبة']),

-- آيات العلم والحكمة
('وقل رب زدني علماً', 'القرآن الكريم', 'سورة طه: 114', 'علم', ARRAY['تعلم', 'نمو', 'حكمة']),
('إنما يخشى الله من عباده العلماء', 'القرآن الكريم', 'سورة فاطر: 28', 'علم', ARRAY['خشية', 'علم', 'تقوى']),
('وما أوتيتم من العلم إلا قليلاً', 'القرآن الكريم', 'سورة الإسراء: 85', 'تواضع', ARRAY['تواضع', 'علم', 'حكمة']),

-- أحاديث نبوية مؤثرة
('إنما الأعمال بالنيات', 'النبي محمد ﷺ', 'صحيح البخاري', 'إخلاص', ARRAY['نية', 'إخلاص', 'عمل']),
('المؤمن القوي خير وأحب إلى الله من المؤمن الضعيف', 'النبي محمد ﷺ', 'صحيح مسلم', 'قوة', ARRAY['قوة', 'عزيمة', 'إيجابية']),
('احرص على ما ينفعك واستعن بالله ولا تعجز', 'النبي محمد ﷺ', 'صحيح مسلم', 'عزيمة', ARRAY['عزيمة', 'استعانة', 'نفع']),
('لا يؤمن أحدكم حتى يحب لأخيه ما يحب لنفسه', 'النبي محمد ﷺ', 'صحيح البخاري', 'أخلاق', ARRAY['محبة', 'إيثار', 'أخوة']),

-- حكم وأقوال مأثورة
('من صبر ظفر', 'حكمة عربية', 'التراث العربي', 'صبر', ARRAY['صبر', 'نجاح', 'ثبات']),
('العلم نور والجهل ظلام', 'حكمة عربية', 'التراث العربي', 'علم', ARRAY['علم', 'جهل', 'نور']),
('الصدق منجاة والكذب مهلكة', 'حكمة عربية', 'التراث العربي', 'صدق', ARRAY['صدق', 'أمانة', 'نجاة'])
ON CONFLICT DO NOTHING;

-- إدراج بعض الأسئلة الشرعية الأساسية
INSERT INTO islamic_questions (question, answer, source, category, scholar, reliability, tags, difficulty_level) VALUES
-- أسئلة العقيدة
('ما هي أركان الإيمان؟', 'أركان الإيمان ستة: الإيمان بالله، وملائكته، وكتبه، ورسله، واليوم الآخر، والقدر خيره وشره.', 'حديث جبريل', 'عقيدة', 'النبي محمد ﷺ', 'صحيح', ARRAY['إيمان', 'أركان', 'عقيدة'], 'مبتدئ'),
('ما هي أركان الإسلام؟', 'أركان الإسلام خمسة: شهادة أن لا إله إلا الله وأن محمداً رسول الله، وإقام الصلاة، وإيتاء الزكاة، وصوم رمضان، وحج البيت لمن استطاع إليه سبيلاً.', 'حديث ابن عمر', 'عقيدة', 'النبي محمد ﷺ', 'صحيح', ARRAY['إسلام', 'أركان', 'عبادة'], 'مبتدئ'),
('ما معنى لا إله إلا الله؟', 'معناها: لا معبود بحق إلا الله، فهي تنفي الألوهية عن غير الله وتثبتها لله وحده.', 'كتب العقيدة', 'عقيدة', 'علماء الأمة', 'صحيح', ARRAY['توحيد', 'شهادة', 'معنى'], 'مبتدئ'),

-- أسئلة العبادات
('ما هي شروط الصلاة؟', 'شروط الصلاة تسعة: الإسلام، والعقل، والتمييز، ورفع الحدث، وإزالة النجاسة، وستر العورة، ودخول الوقت، واستقبال القبلة، والنية.', 'كتب الفقه', 'عبادات', 'الفقهاء', 'صحيح', ARRAY['صلاة', 'شروط', 'فقه'], 'متوسط'),
('متى يجب الوضوء؟', 'يجب الوضوء عند إرادة الصلاة، وعند مس المصحف، وعند الطواف، وينقض بالحدث الأصغر كالبول والغائط والريح.', 'كتب الفقه', 'عبادات', 'الفقهاء', 'صحيح', ARRAY['وضوء', 'طهارة', 'أحكام'], 'مبتدئ'),
('ما هي أركان الصلاة؟', 'أركان الصلاة أربعة عشر ركناً، منها: القيام مع القدرة، وتكبيرة الإحرام، وقراءة الفاتحة، والركوع، والسجود، والجلوس بين السجدتين، والتشهد الأخير، والسلام.', 'كتب الفقه', 'عبادات', 'الفقهاء', 'صحيح', ARRAY['صلاة', 'أركان', 'فقه'], 'متوسط'),

-- أسئلة الأخلاق
('ما هي حقوق الوالدين؟', 'حقوق الوالدين كثيرة منها: البر والإحسان إليهما، وطاعتهما في المعروف، والدعاء لهما، وعدم عقوقهما، وصلة أصدقائهما بعد موتهما.', 'القرآن والسنة', 'أخلاق', 'علماء الأمة', 'صحيح', ARRAY['والدين', 'بر', 'حقوق'], 'مبتدئ'),
('ما هي آداب الطعام في الإسلام؟', 'آداب الطعام تشمل: البسملة قبل الأكل، والأكل باليمين، والأكل مما يلي الآكل، وعدم الإسراف، والحمد بعد الانتهاء.', 'السنة النبوية', 'أخلاق', 'النبي محمد ﷺ', 'صحيح', ARRAY['طعام', 'آداب', 'سنة'], 'مبتدئ'),

-- أسئلة المعاملات
('ما حكم الربا في الإسلام؟', 'الربا محرم في الإسلام تحريماً قطعياً، وهو من كبائر الذنوب، وقد لعن الله آكل الربا وموكله وكاتبه وشاهديه.', 'القرآن والسنة', 'معاملات', 'علماء الأمة', 'صحيح', ARRAY['ربا', 'حرام', 'معاملات'], 'متوسط'),
('ما هي شروط البيع الصحيح؟', 'شروط البيع الصحيح تشمل: رضا الطرفين، وأن يكون المبيع مملوكاً للبائع، وأن يكون معلوماً، وأن يكون مقدوراً على تسليمه، وأن يكون حلالاً.', 'كتب الفقه', 'معاملات', 'الفقهاء', 'صحيح', ARRAY['بيع', 'شروط', 'فقه'], 'متوسط')
ON CONFLICT DO NOTHING;

-- ========================================
-- 11. الدوال المساعدة
-- ========================================

-- دالة لحساب النقاط بناءً على النشاط
CREATE OR REPLACE FUNCTION calculate_activity_points(activity_type VARCHAR, activity_details JSONB)
RETURNS INTEGER AS $$
BEGIN
    CASE activity_type
        WHEN 'prayer' THEN RETURN 10;
        WHEN 'quran_read' THEN RETURN (activity_details->>'pages_read')::INTEGER * 5;
        WHEN 'dhikr' THEN RETURN (activity_details->>'count_completed')::INTEGER / 10;
        WHEN 'achievement' THEN RETURN (activity_details->>'points')::INTEGER;
        ELSE RETURN 1;
    END CASE;
END;
$$ LANGUAGE plpgsql;

-- دالة لتحديث مستوى المستخدم
CREATE OR REPLACE FUNCTION update_user_level(user_uuid UUID)
RETURNS VOID AS $$
DECLARE
    total_points INTEGER;
    new_level VARCHAR(50);
BEGIN
    -- حساب إجمالي النقاط
    SELECT COALESCE(SUM(points_earned), 0) INTO total_points
    FROM activity_log WHERE user_id = user_uuid;

    -- تحديد المستوى الجديد
    IF total_points < 500 THEN
        new_level := 'مبتدئ';
    ELSIF total_points < 1500 THEN
        new_level := 'متوسط';
    ELSIF total_points < 3000 THEN
        new_level := 'متقدم';
    ELSIF total_points < 5000 THEN
        new_level := 'خبير';
    ELSE
        new_level := 'عالم';
    END IF;

    -- تحديث جدول النقاط
    INSERT INTO user_points (user_id, total_points, current_level, last_updated)
    VALUES (user_uuid, total_points, new_level, NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        total_points = EXCLUDED.total_points,
        current_level = EXCLUDED.current_level,
        last_updated = EXCLUDED.last_updated;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 12. المشغلات (Triggers)
-- ========================================

-- مشغل لتحديث النقاط عند إضافة نشاط جديد
CREATE OR REPLACE FUNCTION trigger_update_points()
RETURNS TRIGGER AS $$
BEGIN
    -- حساب النقاط للنشاط الجديد
    NEW.points_earned := calculate_activity_points(NEW.activity_type, NEW.activity_details);

    -- تحديث مستوى المستخدم
    PERFORM update_user_level(NEW.user_id);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER activity_points_trigger
    BEFORE INSERT ON activity_log
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_points();

-- مشغل لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_users
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_user_settings
    BEFORE UPDATE ON user_settings
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_islamic_questions
    BEFORE UPDATE ON islamic_questions
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();

-- ========================================
-- 13. سياسات الأمان (Row Level Security)
-- ========================================

-- تفعيل RLS على الجداول الحساسة
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE quran_reading_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE dhikr_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_verses ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_hadith ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_azkar ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- سياسات للمستخدمين المسجلين فقط
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own settings" ON user_settings
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own tracking" ON prayer_tracking
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own quran tracking" ON quran_reading_tracking
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own dhikr tracking" ON dhikr_tracking
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own favorites" ON favorite_verses
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own hadith favorites" ON favorite_hadith
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own azkar favorites" ON favorite_azkar
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own achievements" ON user_achievements
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own points" ON user_points
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own notifications" ON notifications
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own activity" ON activity_log
    FOR ALL USING (auth.uid() = user_id);

-- ========================================
-- 14. إعدادات البحث النصي العربي
-- ========================================

-- إنشاء تكوين البحث العربي
CREATE TEXT SEARCH CONFIGURATION arabic_config (COPY = arabic);

-- تحسين البحث في النصوص العربية
CREATE OR REPLACE FUNCTION arabic_search(text_column TEXT, search_term TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN to_tsvector('arabic', text_column) @@ plainto_tsquery('arabic', search_term);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ========================================
-- انتهاء السكريبت
-- ========================================

-- رسالة تأكيد
DO $$
BEGIN
    RAISE NOTICE '🎉 تم إنشاء قاعدة البيانات المتكاملة لمشروع مفاتيح بنجاح!';
    RAISE NOTICE '📊 تم إنشاء % جدول رئيسي', (
        SELECT COUNT(*) FROM information_schema.tables
        WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    );
    RAISE NOTICE '🔍 تم إنشاء الفهارس لتحسين الأداء';
    RAISE NOTICE '🔒 تم تفعيل سياسات الأمان';
    RAISE NOTICE '📝 تم إدراج البيانات الأولية الأساسية';
    RAISE NOTICE '✅ قاعدة البيانات جاهزة للاستخدام!';
END $$;
