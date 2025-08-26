# 🗄️ دليل تطبيق قاعدة البيانات المتكاملة لمشروع مفاتيح

## 📋 نظرة عامة

تم إنشاء قاعدة بيانات شاملة ومتكاملة لمشروع **مفاتيح - مساعد المسلم الذكي الشامل** تحتوي على جميع الجداول والبيانات المطلوبة لدعم جميع واجهات ومكونات التطبيق.

## 🎯 المميزات الرئيسية

### ✅ **شمولية كاملة**
- **25+ جدول** يغطي جميع احتياجات التطبيق
- **بيانات إسلامية موثقة** (قرآن، أحاديث، فتاوى، أذكار)
- **تتبع شامل** للأنشطة والتقدم
- **نظام نقاط ومستويات** متقدم

### ✅ **أداء محسن**
- **فهارس متقدمة** لجميع الاستعلامات
- **بحث نصي عربي** محسن
- **تخزين مؤقت** ذكي
- **استعلامات محسنة**

### ✅ **أمان متقدم**
- **Row Level Security** لحماية البيانات
- **سياسات أمان** مخصصة
- **تشفير البيانات الحساسة**
- **تحكم في الصلاحيات**

## 🚀 خطوات التطبيق

### 1. **إنشاء مشروع Supabase جديد**

```bash
# انتقل إلى https://supabase.com
# أنشئ حساب جديد أو سجل دخول
# اضغط على "New Project"
# اختر اسم المشروع: "mafatih-islamic-assistant"
# اختر كلمة مرور قوية لقاعدة البيانات
# اختر المنطقة الأقرب لك
```

### 2. **تشغيل سكريبت قاعدة البيانات**

```sql
-- انسخ محتوى ملف MAFATIH_COMPLETE_DATABASE_SCHEMA.sql
-- انتقل إلى Supabase Dashboard > SQL Editor
-- الصق السكريبت كاملاً
-- اضغط على "Run" لتنفيذ السكريبت
```

### 3. **التحقق من إنشاء الجداول**

```sql
-- تحقق من الجداول المنشأة
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- يجب أن ترى 25+ جدول
```

### 4. **تكوين متغيرات البيئة**

```env
# أضف هذه المتغيرات إلى ملف .env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 📊 هيكل قاعدة البيانات

### 🔹 **جداول المستخدمين (4 جداول)**
```sql
users                    -- المستخدمين الأساسي
user_settings           -- إعدادات المستخدم
user_prayer_times       -- أوقات الصلاة المخصصة
user_goals              -- الأهداف الشخصية
```

### 🔹 **جداول المحتوى الإسلامي (6 جداول)**
```sql
quran_verses            -- آيات القرآن الكريم
hadith_data             -- الأحاديث الشريفة
islamic_questions       -- الأسئلة الشرعية
fatawa                  -- الفتاوى
azkar_data              -- الأذكار والأدعية
allah_names             -- أسماء الله الحسنى
```

### 🔹 **جداول التتبع والإحصائيات (5 جداول)**
```sql
prayer_tracking         -- تتبع الصلوات
quran_reading_tracking  -- تتبع قراءة القرآن
dhikr_tracking          -- تتبع الأذكار
user_achievements       -- الإنجازات والشارات
user_points             -- النقاط والمستويات
```

### 🔹 **جداول المفضلات (3 جداول)**
```sql
favorite_verses         -- الآيات المفضلة
favorite_hadith         -- الأحاديث المفضلة
favorite_azkar          -- الأذكار المفضلة
```

### 🔹 **جداول الخطط والأهداف (3 جداول)**
```sql
spiritual_plans         -- الخطط الإيمانية
spiritual_tasks         -- مهام الخطط
user_plan_progress      -- تقدم المستخدم في الخطط
```

### 🔹 **جداول الإشعارات (2 جداول)**
```sql
notifications           -- الإشعارات
custom_reminders        -- التذكيرات المخصصة
```

### 🔹 **جداول المحتوى التفاعلي (3 جداول)**
```sql
inspirational_quotes    -- الاقتباسات الإيمانية
educational_content     -- المحتوى التعليمي
content_ratings         -- تقييمات المحتوى
```

### 🔹 **جداول التحليلات (2 جداول)**
```sql
daily_usage_stats       -- إحصائيات الاستخدام اليومية
activity_log            -- سجل الأنشطة
```

## 🔧 الدوال والمشغلات

### **الدوال المساعدة:**
- `calculate_activity_points()` - حساب النقاط
- `update_user_level()` - تحديث مستوى المستخدم
- `arabic_search()` - البحث العربي المحسن

### **المشغلات التلقائية:**
- `activity_points_trigger` - تحديث النقاط تلقائياً
- `set_timestamp_*` - تحديث التواريخ تلقائياً

## 📝 أمثلة الاستخدام

### **1. إضافة مستخدم جديد:**
```sql
INSERT INTO users (email, name, age, gender, language) 
VALUES ('user@example.com', 'أحمد محمد', 25, 'male', 'ar');
```

### **2. تتبع صلاة:**
```sql
INSERT INTO prayer_tracking (user_id, prayer_name, prayer_date, performed_at, is_on_time) 
VALUES ('user-uuid', 'fajr', CURRENT_DATE, NOW(), true);
```

### **3. إضافة آية مفضلة:**
```sql
INSERT INTO favorite_verses (user_id, verse_id, notes) 
VALUES ('user-uuid', 'verse-uuid', 'آية مؤثرة جداً');
```

### **4. البحث في القرآن:**
```sql
SELECT * FROM quran_verses 
WHERE arabic_search(arabic_text, 'الرحمن الرحيم');
```

### **5. إحصائيات المستخدم:**
```sql
SELECT 
    current_level,
    total_points,
    (SELECT COUNT(*) FROM prayer_tracking WHERE user_id = $1) as total_prayers,
    (SELECT SUM(pages_read) FROM quran_reading_tracking WHERE user_id = $1) as total_pages
FROM user_points 
WHERE user_id = $1;
```

## 🔒 الأمان والصلاحيات

### **Row Level Security:**
- كل مستخدم يرى بياناته فقط
- حماية من الوصول غير المصرح
- سياسات أمان مخصصة

### **أنواع المستخدمين:**
- **مستخدم عادي**: قراءة وكتابة بياناته فقط
- **مدير**: وصول للمحتوى العام
- **مطور**: وصول كامل للتطوير

## 📈 التحسينات والأداء

### **الفهارس المنشأة:**
- فهارس البحث النصي العربي
- فهارس التواريخ والمعرفات
- فهارس المصفوفات والعلامات
- فهارس الاستعلامات المتكررة

### **تحسينات الأداء:**
- استعلامات محسنة
- تخزين مؤقت ذكي
- ضغط البيانات
- تحسين الشبكة

## 🎯 الخطوات التالية

### **1. ربط التطبيق:**
```typescript
// تحديث ملف src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
```

### **2. إنشاء خدمات البيانات:**
```typescript
// خدمة المستخدمين
export class UserService {
  static async createUser(userData: UserData) {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
    return { data, error }
  }
}
```

### **3. تطبيق المكونات:**
- تحديث مكونات التطبيق لاستخدام قاعدة البيانات
- إضافة وظائف الحفظ والاسترجاع
- تطبيق نظام النقاط والمستويات

### **4. اختبار شامل:**
- اختبار جميع العمليات
- اختبار الأداء
- اختبار الأمان
- اختبار التوافق

## 🎉 الخلاصة

تم إنشاء قاعدة بيانات متكاملة وشاملة تدعم جميع احتياجات مشروع مفاتيح:

✅ **25+ جدول** متخصص
✅ **بيانات إسلامية موثقة**
✅ **نظام تتبع شامل**
✅ **أمان متقدم**
✅ **أداء محسن**
✅ **سهولة الاستخدام**

**قاعدة البيانات جاهزة للاستخدام الفوري! 🚀**
