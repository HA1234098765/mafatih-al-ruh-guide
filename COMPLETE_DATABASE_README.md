# 🗄️ قاعدة البيانات المتكاملة لمشروع مفاتيح

## 📋 الملفات المطلوبة

### 🎯 **الملفات الجاهزة للنسخ:**

1. **`MAFATIH_COMPLETE_DATABASE_SCHEMA.sql`** - سكريبت قاعدة البيانات الكامل
2. **`src/types/database.types.ts`** - أنواع TypeScript للبيانات
3. **`src/services/database.service.ts`** - خدمات قاعدة البيانات
4. **`DATABASE_IMPLEMENTATION_GUIDE.md`** - دليل التطبيق التفصيلي

## 🚀 خطوات التطبيق السريع

### 1. **إنشاء مشروع Supabase**
```bash
# اذهب إلى https://supabase.com
# أنشئ مشروع جديد باسم "mafatih-islamic-assistant"
# احفظ URL و API Keys
```

### 2. **تشغيل سكريبت قاعدة البيانات**
```sql
-- انسخ محتوى ملف MAFATIH_COMPLETE_DATABASE_SCHEMA.sql
-- الصقه في Supabase SQL Editor
-- اضغط "Run" لتنفيذ السكريبت
```

### 3. **تكوين متغيرات البيئة**
```env
# أضف إلى ملف .env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. **تحديث ملف Supabase**
```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)
```

## 📊 هيكل قاعدة البيانات

### **25+ جدول متخصص:**

#### 🔹 **المستخدمين (4 جداول)**
- `users` - بيانات المستخدمين الأساسية
- `user_settings` - إعدادات التطبيق
- `user_prayer_times` - أوقات الصلاة المخصصة
- `user_goals` - الأهداف الشخصية

#### 🔹 **المحتوى الإسلامي (6 جداول)**
- `quran_verses` - آيات القرآن الكريم
- `hadith_data` - الأحاديث الشريفة
- `islamic_questions` - الأسئلة الشرعية
- `fatawa` - الفتاوى
- `azkar_data` - الأذكار والأدعية
- `allah_names` - أسماء الله الحسنى

#### 🔹 **التتبع والإحصائيات (5 جداول)**
- `prayer_tracking` - تتبع الصلوات
- `quran_reading_tracking` - تتبع قراءة القرآن
- `dhikr_tracking` - تتبع الأذكار
- `user_achievements` - الإنجازات
- `user_points` - النقاط والمستويات

#### 🔹 **المفضلات (3 جداول)**
- `favorite_verses` - الآيات المفضلة
- `favorite_hadith` - الأحاديث المفضلة
- `favorite_azkar` - الأذكار المفضلة

#### 🔹 **الخطط والأهداف (3 جداول)**
- `spiritual_plans` - الخطط الإيمانية
- `spiritual_tasks` - مهام الخطط
- `user_plan_progress` - تقدم المستخدم

#### 🔹 **الإشعارات (2 جداول)**
- `notifications` - الإشعارات
- `custom_reminders` - التذكيرات المخصصة

#### 🔹 **المحتوى التفاعلي (3 جداول)**
- `inspirational_quotes` - الاقتباسات الإيمانية
- `educational_content` - المحتوى التعليمي
- `content_ratings` - تقييمات المحتوى

#### 🔹 **التحليلات (2 جداول)**
- `daily_usage_stats` - إحصائيات الاستخدام
- `activity_log` - سجل الأنشطة

## 💻 أمثلة الاستخدام

### **1. إنشاء مستخدم جديد:**
```typescript
import { UserService } from '@/services/database.service';

const createUser = async () => {
  const { data, error } = await UserService.createUser({
    email: 'user@example.com',
    name: 'أحمد محمد',
    age: 25,
    gender: 'male',
    language: 'ar'
  });
  
  if (error) {
    console.error('خطأ في إنشاء المستخدم:', error);
    return;
  }
  
  console.log('تم إنشاء المستخدم:', data);
};
```

### **2. تسجيل صلاة:**
```typescript
import { TrackingService } from '@/services/database.service';

const recordPrayer = async (userId: string) => {
  const { data, error } = await TrackingService.recordPrayer({
    user_id: userId,
    prayer_name: 'fajr',
    prayer_date: new Date().toISOString().split('T')[0],
    performed_at: new Date().toISOString(),
    is_on_time: true,
    is_in_congregation: false
  });
  
  if (error) {
    console.error('خطأ في تسجيل الصلاة:', error);
    return;
  }
  
  console.log('تم تسجيل الصلاة:', data);
};
```

### **3. البحث في القرآن:**
```typescript
import { IslamicContentService } from '@/services/database.service';

const searchQuran = async (query: string) => {
  const result = await IslamicContentService.searchQuranVerses(query, {
    limit: 10,
    offset: 0
  });
  
  console.log('نتائج البحث:', result.data);
  console.log('عدد النتائج:', result.count);
};
```

### **4. إضافة آية للمفضلة:**
```typescript
import { FavoritesService } from '@/services/database.service';

const addToFavorites = async (userId: string, verseId: string) => {
  const { data, error } = await FavoritesService.addFavoriteVerse(
    userId, 
    verseId, 
    'آية مؤثرة جداً'
  );
  
  if (error) {
    console.error('خطأ في إضافة المفضلة:', error);
    return;
  }
  
  console.log('تم إضافة الآية للمفضلة:', data);
};
```

### **5. الحصول على إحصائيات المستخدم:**
```typescript
import { TrackingService } from '@/services/database.service';

const getUserStats = async (userId: string) => {
  const { data, error } = await TrackingService.getUserStats(userId);
  
  if (error) {
    console.error('خطأ في جلب الإحصائيات:', error);
    return;
  }
  
  console.log('إحصائيات المستخدم:', data);
  // {
  //   total_prayers: 150,
  //   total_quran_pages: 45,
  //   total_dhikr_count: 2500,
  //   current_level: 'متوسط',
  //   total_points: 1250
  // }
};
```

## 🔧 الميزات المتقدمة

### **1. البحث النصي العربي:**
```sql
-- البحث في آيات القرآن
SELECT * FROM quran_verses 
WHERE arabic_search(arabic_text, 'الرحمن الرحيم');
```

### **2. نظام النقاط التلقائي:**
```sql
-- يتم حساب النقاط تلقائياً عند إضافة نشاط
INSERT INTO activity_log (user_id, activity_type, activity_details)
VALUES ('user-id', 'prayer', '{"prayer_name": "fajr", "on_time": true}');
-- النقاط تُحسب تلقائياً بواسطة المشغل
```

### **3. الأمان المتقدم:**
```sql
-- Row Level Security - كل مستخدم يرى بياناته فقط
-- تم تفعيله تلقائياً على جميع الجداول الحساسة
```

## 📈 الأداء والتحسين

### **الفهارس المنشأة:**
- فهارس البحث النصي العربي
- فهارس التواريخ والمعرفات
- فهارس المصفوفات والعلامات
- فهارس الاستعلامات المتكررة

### **التحسينات:**
- استعلامات محسنة
- تخزين مؤقت ذكي
- ضغط البيانات
- تحسين الشبكة

## 🔒 الأمان

### **سياسات الأمان:**
- Row Level Security مفعل
- كل مستخدم يرى بياناته فقط
- حماية من SQL Injection
- تشفير البيانات الحساسة

### **الصلاحيات:**
- مستخدم عادي: قراءة وكتابة بياناته
- مدير: وصول للمحتوى العام
- مطور: وصول كامل للتطوير

## 🎯 البيانات الأولية

### **تم إدراج:**
- ✅ أسماء الله الحسنى (10 أسماء)
- ✅ أذكار أساسية (8 أذكار)
- ✅ خطط إيمانية (4 خطط)
- ✅ مهام روحانية (4 مهام)
- ✅ اقتباسات إيمانية (4 اقتباسات)

### **يمكن إضافة:**
- آيات القرآن الكريم كاملة
- مجموعة شاملة من الأحاديث
- أسئلة شرعية متنوعة
- فتاوى من مصادر موثقة

## ✅ التحقق من النجاح

### **بعد تشغيل السكريبت:**
```sql
-- تحقق من الجداول
SELECT COUNT(*) as total_tables 
FROM information_schema.tables 
WHERE table_schema = 'public';
-- يجب أن يكون العدد 25+

-- تحقق من البيانات الأولية
SELECT COUNT(*) FROM allah_names; -- 10
SELECT COUNT(*) FROM azkar_data; -- 8
SELECT COUNT(*) FROM spiritual_plans; -- 4
```

## 🎉 الخلاصة

تم إنشاء قاعدة بيانات متكاملة وشاملة تدعم جميع احتياجات مشروع مفاتيح:

✅ **25+ جدول متخصص**
✅ **بيانات إسلامية موثقة**
✅ **نظام تتبع شامل**
✅ **أمان متقدم**
✅ **أداء محسن**
✅ **سهولة الاستخدام**

**قاعدة البيانات جاهزة للاستخدام الفوري! 🚀**

---

## 📞 الدعم

إذا واجهت أي مشاكل:
1. تأكد من تشغيل السكريبت كاملاً
2. تحقق من متغيرات البيئة
3. راجع سجلات الأخطاء في Supabase
4. تأكد من الصلاحيات والأمان
