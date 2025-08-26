-- إعداد قاعدة البيانات الشرعية في Supabase
-- يجب تشغيل هذا الملف في Supabase SQL Editor

-- جدول الأسئلة الشرعية
CREATE TABLE IF NOT EXISTS islamic_questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    source VARCHAR(255) NOT NULL,
    category VARCHAR(50) CHECK (category IN ('فقه', 'عقيدة', 'أخلاق', 'عبادات', 'معاملات')),
    scholar VARCHAR(255),
    reliability VARCHAR(20) CHECK (reliability IN ('صحيح', 'حسن', 'ضعيف')) DEFAULT 'صحيح',
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول الأحاديث الشريفة
CREATE TABLE IF NOT EXISTS hadith_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    arabic_text TEXT NOT NULL,
    translation TEXT,
    narrator VARCHAR(255),
    source_book VARCHAR(255) NOT NULL,
    grade VARCHAR(20) CHECK (grade IN ('صحيح', 'حسن', 'ضعيف')) DEFAULT 'صحيح',
    chapter VARCHAR(255),
    hadith_number INTEGER,
    explanation TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول آيات القرآن الكريم
CREATE TABLE IF NOT EXISTS quran_verses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    surah_number INTEGER NOT NULL CHECK (surah_number BETWEEN 1 AND 114),
    surah_name VARCHAR(100) NOT NULL,
    ayah_number INTEGER NOT NULL,
    arabic_text TEXT NOT NULL,
    translation TEXT,
    tafseer TEXT,
    revelation_type VARCHAR(10) CHECK (revelation_type IN ('مكية', 'مدنية')),
    theme TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(surah_number, ayah_number)
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

-- جدول العلماء والمصادر
CREATE TABLE IF NOT EXISTS scholars_sources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    specialization TEXT[],
    birth_year INTEGER,
    death_year INTEGER,
    reliability_level VARCHAR(20) CHECK (reliability_level IN ('عالي', 'متوسط', 'منخفض')) DEFAULT 'عالي',
    biography TEXT,
    major_works TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء الفهارس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_islamic_questions_category ON islamic_questions(category);
CREATE INDEX IF NOT EXISTS idx_islamic_questions_reliability ON islamic_questions(reliability);
CREATE INDEX IF NOT EXISTS idx_islamic_questions_question_search ON islamic_questions USING gin(to_tsvector('arabic', question));

CREATE INDEX IF NOT EXISTS idx_hadith_grade ON hadith_data(grade);
CREATE INDEX IF NOT EXISTS idx_hadith_source ON hadith_data(source_book);
CREATE INDEX IF NOT EXISTS idx_hadith_text_search ON hadith_data USING gin(to_tsvector('arabic', arabic_text));

CREATE INDEX IF NOT EXISTS idx_quran_surah ON quran_verses(surah_number);
CREATE INDEX IF NOT EXISTS idx_quran_theme ON quran_verses USING gin(theme);
CREATE INDEX IF NOT EXISTS idx_quran_text_search ON quran_verses USING gin(to_tsvector('arabic', arabic_text));

CREATE INDEX IF NOT EXISTS idx_fatawa_category ON fatawa(category);
CREATE INDEX IF NOT EXISTS idx_fatawa_reliability ON fatawa(reliability);

-- إنشاء دالة للبحث النصي المتقدم
CREATE OR REPLACE FUNCTION search_islamic_content(
    search_query TEXT,
    content_type TEXT DEFAULT 'all'
)
RETURNS TABLE (
    id UUID,
    content_type TEXT,
    title TEXT,
    content TEXT,
    source TEXT,
    relevance REAL
) AS $$
BEGIN
    IF content_type = 'questions' OR content_type = 'all' THEN
        RETURN QUERY
        SELECT 
            iq.id,
            'question'::TEXT as content_type,
            iq.question as title,
            iq.answer as content,
            iq.source,
            ts_rank(to_tsvector('arabic', iq.question || ' ' || iq.answer), plainto_tsquery('arabic', search_query)) as relevance
        FROM islamic_questions iq
        WHERE to_tsvector('arabic', iq.question || ' ' || iq.answer) @@ plainto_tsquery('arabic', search_query)
        AND iq.reliability = 'صحيح';
    END IF;

    IF content_type = 'hadith' OR content_type = 'all' THEN
        RETURN QUERY
        SELECT 
            hd.id,
            'hadith'::TEXT as content_type,
            hd.arabic_text as title,
            COALESCE(hd.translation, '') as content,
            hd.source_book as source,
            ts_rank(to_tsvector('arabic', hd.arabic_text || ' ' || COALESCE(hd.translation, '')), plainto_tsquery('arabic', search_query)) as relevance
        FROM hadith_data hd
        WHERE to_tsvector('arabic', hd.arabic_text || ' ' || COALESCE(hd.translation, '')) @@ plainto_tsquery('arabic', search_query)
        AND hd.grade IN ('صحيح', 'حسن');
    END IF;

    IF content_type = 'quran' OR content_type = 'all' THEN
        RETURN QUERY
        SELECT 
            qv.id,
            'quran'::TEXT as content_type,
            qv.surah_name || ' - آية ' || qv.ayah_number::TEXT as title,
            qv.arabic_text as content,
            'القرآن الكريم' as source,
            ts_rank(to_tsvector('arabic', qv.arabic_text || ' ' || COALESCE(qv.translation, '')), plainto_tsquery('arabic', search_query)) as relevance
        FROM quran_verses qv
        WHERE to_tsvector('arabic', qv.arabic_text || ' ' || COALESCE(qv.translation, '')) @@ plainto_tsquery('arabic', search_query);
    END IF;
END;
$$ LANGUAGE plpgsql;

-- إدراج بيانات تجريبية للأسئلة الشرعية
INSERT INTO islamic_questions (question, answer, source, category, scholar, tags) VALUES
('ما حكم الصلاة في البيت؟', 'الأصل في الصلاة أن تؤدى في المسجد للرجال، وأما المرأة فالأفضل لها الصلاة في بيتها. ويجوز للرجل الصلاة في البيت عند العذر أو الحاجة.', 'اللجنة الدائمة للبحوث العلمية والإفتاء', 'عبادات', 'اللجنة الدائمة', ARRAY['صلاة', 'بيت', 'مسجد']),
('متى يجب الغسل؟', 'يجب الغسل من الجنابة، ومن الحيض والنفاس للمرأة، وعند الإسلام، وعند الموت للميت.', 'فقه السنة', 'فقه', 'سيد سابق', ARRAY['غسل', 'طهارة', 'جنابة']),
('ما آداب الطعام في الإسلام؟', 'من آداب الطعام: البسملة قبل الأكل، والحمد بعده، والأكل باليمين، وعدم الإسراف، ومشاركة الطعام مع الآخرين.', 'صحيح البخاري ومسلم', 'آداب', 'البخاري ومسلم', ARRAY['طعام', 'آداب', 'بسملة']);

-- إدراج بيانات تجريبية للأحاديث
INSERT INTO hadith_data (arabic_text, translation, narrator, source_book, grade, chapter, hadith_number) VALUES
('إنما الأعمال بالنيات وإنما لكل امرئ ما نوى', 'الأعمال تُقيَّم بالنيات، وكل شخص يُجازى حسب نيته', 'عمر بن الخطاب', 'صحيح البخاري', 'صحيح', 'كتاب بدء الوحي', 1),
('المسلم من سلم المسلمون من لسانه ويده', 'المسلم الحقيقي هو من أمِن الناس من أذى لسانه ويده', 'عبد الله بن عمرو', 'صحيح البخاري', 'صحيح', 'كتاب الإيمان', 10),
('لا يؤمن أحدكم حتى يحب لأخيه ما يحب لنفسه', 'الإيمان الكامل يتطلب أن تتمنى الخير للآخرين كما تتمناه لنفسك', 'أنس بن مالك', 'صحيح البخاري', 'صحيح', 'كتاب الإيمان', 13);

-- إدراج بيانات تجريبية لآيات القرآن
INSERT INTO quran_verses (surah_number, surah_name, ayah_number, arabic_text, translation, revelation_type, theme) VALUES
(2, 'البقرة', 155, 'وَلَنَبْلُوَنَّكُم بِشَيْءٍ مِّنَ الْخَوْفِ وَالْجُوعِ وَنَقْصٍ مِّنَ الْأَمْوَالِ وَالْأَنفُسِ وَالثَّمَرَاتِ ۗ وَبَشِّرِ الصَّابِرِينَ', 'ولنبلونكم بشيء من الخوف والجوع ونقص من الأموال والأنفس والثمرات وبشر الصابرين', 'مدنية', ARRAY['ابتلاء', 'صبر', 'تسلية']),
(13, 'الرعد', 28, 'الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ اللَّهِ ۗ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ', 'الذين آمنوا وتطمئن قلوبهم بذكر الله ألا بذكر الله تطمئن القلوب', 'مكية', ARRAY['طمأنينة', 'ذكر', 'سكينة']),
(14, 'إبراهيم', 7, 'وَإِذْ تَأَذَّنَ رَبُّكُمْ لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ ۖ وَلَئِن كَفَرْتُمْ إِنَّ عَذَابِي لَشَدِيدٌ', 'وإذ تأذن ربكم لئن شكرتم لأزيدنكم ولئن كفرتم إن عذابي لشديد', 'مكية', ARRAY['شكر', 'نعم', 'حمد']);

-- تفعيل Row Level Security
ALTER TABLE islamic_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE hadith_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE quran_verses ENABLE ROW LEVEL SECURITY;
ALTER TABLE fatawa ENABLE ROW LEVEL SECURITY;

-- إنشاء سياسات الأمان (السماح بالقراءة للجميع)
CREATE POLICY "Allow read access for all users" ON islamic_questions FOR SELECT USING (true);
CREATE POLICY "Allow read access for all users" ON hadith_data FOR SELECT USING (true);
CREATE POLICY "Allow read access for all users" ON quran_verses FOR SELECT USING (true);
CREATE POLICY "Allow read access for all users" ON fatawa FOR SELECT USING (true);
