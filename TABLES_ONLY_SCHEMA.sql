-- 🗄️ سكريبت إنشاء الجداول فقط لمشروع مفاتيح
-- استخدم هذا السكريبت قبل استيراد ملفات CSV

-- تفعيل الإضافات المطلوبة
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- 1. جدول المستخدمين الأساسي
-- ========================================
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

-- ========================================
-- 2. جدول إعدادات المستخدم
-- ========================================
CREATE TABLE IF NOT EXISTS user_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    theme VARCHAR(10) DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
    notifications_enabled BOOLEAN DEFAULT true,
    sound_enabled BOOLEAN DEFAULT true,
    prayer_notifications BOOLEAN DEFAULT true,
    dhikr_reminders BOOLEAN DEFAULT true,
    daily_verse_enabled BOOLEAN DEFAULT true,
    preferred_reciter INTEGER DEFAULT 1,
    font_size VARCHAR(10) DEFAULT 'medium' CHECK (font_size IN ('small', 'medium', 'large')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- ========================================
-- 3. جدول أوقات الصلاة المخصصة
-- ========================================
CREATE TABLE IF NOT EXISTS user_prayer_times (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    fajr TIME NOT NULL,
    dhuhr TIME NOT NULL,
    asr TIME NOT NULL,
    maghrib TIME NOT NULL,
    isha TIME NOT NULL,
    calculation_method VARCHAR(50) DEFAULT 'UmmAlQura',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- ========================================
-- 4. جدول أهداف المستخدم
-- ========================================
CREATE TABLE IF NOT EXISTS user_goals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    goal_type VARCHAR(50) NOT NULL, -- prayer_streak، quran_pages، dhikr_count
    target_value INTEGER NOT NULL,
    current_value INTEGER DEFAULT 0,
    period VARCHAR(20) DEFAULT 'daily' CHECK (period IN ('daily', 'weekly', 'monthly')),
    start_date DATE DEFAULT CURRENT_DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 5. جدول آيات القرآن الكريم
-- ========================================
CREATE TABLE IF NOT EXISTS quran_verses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    surah_number INTEGER NOT NULL CHECK (surah_number BETWEEN 1 AND 114),
    surah_name VARCHAR(255) NOT NULL,
    surah_name_english VARCHAR(255),
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

-- ========================================
-- 6. جدول الأحاديث الشريفة
-- ========================================
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

-- ========================================
-- 7. جدول الأسئلة الشرعية
-- ========================================
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

-- ========================================
-- 8. جدول الفتاوى
-- ========================================
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

-- ========================================
-- 9. جدول الأذكار والأدعية
-- ========================================
CREATE TABLE IF NOT EXISTS azkar_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    arabic_text TEXT NOT NULL,
    translation_ar TEXT,
    translation_en TEXT,
    category VARCHAR(50) NOT NULL, -- تسبيح، استغفار، دعاء، صباح، مساء
    timing VARCHAR(50), -- morning، evening، after_prayer، before_sleep، anytime
    count_recommended INTEGER DEFAULT 1,
    reward TEXT,
    source VARCHAR(255),
    mood TEXT[] DEFAULT '{}', -- سعادة، حزن، قلق، راحة
    difficulty VARCHAR(20) CHECK (difficulty IN ('سهل', 'متوسط', 'صعب')) DEFAULT 'سهل',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 10. جدول أسماء الله الحسنى
-- ========================================
CREATE TABLE IF NOT EXISTS allah_names (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name_arabic VARCHAR(100) NOT NULL,
    name_transliteration VARCHAR(100),
    meaning_arabic TEXT,
    meaning_english TEXT,
    explanation TEXT,
    verse_reference VARCHAR(255),
    order_number INTEGER UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 11. جدول تتبع الصلوات
-- ========================================
CREATE TABLE IF NOT EXISTS prayer_tracking (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    prayer_name VARCHAR(20) NOT NULL CHECK (prayer_name IN ('fajr', 'dhuhr', 'asr', 'maghrib', 'isha')),
    prayer_date DATE NOT NULL,
    performed_at TIMESTAMP WITH TIME ZONE,
    is_on_time BOOLEAN DEFAULT false,
    is_in_congregation BOOLEAN DEFAULT false,
    location VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, prayer_name, prayer_date)
);

-- ========================================
-- 12. جدول تتبع قراءة القرآن
-- ========================================
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

-- ========================================
-- 13. جدول تتبع الأذكار
-- ========================================
CREATE TABLE IF NOT EXISTS dhikr_tracking (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    azkar_id UUID REFERENCES azkar_data(id),
    count_completed INTEGER NOT NULL,
    target_count INTEGER NOT NULL,
    session_date DATE NOT NULL,
    timing VARCHAR(50),
    mood VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 14. جدول الآيات المفضلة
-- ========================================
CREATE TABLE IF NOT EXISTS favorite_verses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    verse_id UUID REFERENCES quran_verses(id),
    notes TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, verse_id)
);

-- ========================================
-- 15. جدول الأحاديث المفضلة
-- ========================================
CREATE TABLE IF NOT EXISTS favorite_hadith (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    hadith_id UUID REFERENCES hadith_data(id),
    notes TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, hadith_id)
);

-- ========================================
-- 16. جدول الأذكار المفضلة
-- ========================================
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
-- 17. جدول الخطط الإيمانية
-- ========================================
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

-- ========================================
-- 18. جدول مهام الخطط الإيمانية
-- ========================================
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

-- ========================================
-- 19. جدول الاقتباسات الإيمانية
-- ========================================
CREATE TABLE IF NOT EXISTS inspirational_quotes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    text_arabic TEXT NOT NULL,
    text_english TEXT,
    author VARCHAR(255),
    source VARCHAR(255),
    category VARCHAR(50),
    tags TEXT[] DEFAULT '{}',
    mood TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- رسالة تأكيد
DO $$
BEGIN
    RAISE NOTICE '✅ تم إنشاء جميع الجداول بنجاح!';
    RAISE NOTICE '📊 يمكنك الآن استيراد ملفات CSV';
    RAISE NOTICE '🚀 قاعدة البيانات جاهزة!';
END $$;
