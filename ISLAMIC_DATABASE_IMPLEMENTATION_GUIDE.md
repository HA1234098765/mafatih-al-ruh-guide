# 🕌 دليل تنفيذ قاعدة البيانات الشرعية لمشروع مفاتيح

## 📋 نظرة عامة

هذا الدليل يوضح كيفية تنفيذ قاعدة بيانات شرعية موثقة ومجانية لمشروع "مفاتيح - مساعد المسلم الذكي الشامل" باستخدام مصادر شرعية معتمدة وحلول تقنية متقدمة.

## 🎯 الأهداف الرئيسية

1. **الموثوقية الشرعية**: استخدام مصادر معتمدة فقط
2. **المجانية**: حلول مفتوحة المصدر ومجانية
3. **الشرعية**: احترام حقوق الملكية الفكرية
4. **الدقة**: ضمان عدم التحريف في النصوص
5. **الأداء**: استجابة سريعة وفعالة

## 🏗️ البنية التقنية

### 1. **قاعدة البيانات الأساسية (Supabase)**

#### المميزات:
- **مجانية**: خطة مجانية سخية
- **PostgreSQL**: قاعدة بيانات قوية ومتقدمة
- **API تلقائي**: REST و GraphQL
- **أمان متقدم**: Row Level Security
- **بحث نصي**: دعم البحث بالعربية

#### الجداول الأساسية:
```sql
-- الأسئلة الشرعية
islamic_questions (
  id, question, answer, source, category, 
  scholar, reliability, tags, created_at
)

-- الأحاديث الشريفة
hadith_data (
  id, arabic_text, translation, narrator,
  source_book, grade, chapter, hadith_number
)

-- آيات القرآن الكريم
quran_verses (
  id, surah_number, surah_name, ayah_number,
  arabic_text, translation, tafseer, theme
)

-- الفتاوى
fatawa (
  id, question, answer, fatwa_number,
  source_website, scholar, category
)
```

### 2. **المصادر الشرعية المعتمدة**

#### أ) **موقع الدرر السنية (dorar.net)**
- **الترخيص**: مجاني للاستخدام التعليمي
- **المحتوى**: أحاديث، فتاوى، كتب شرعية
- **API**: متاح بصيغة JSON
- **الموثوقية**: عالية جداً

```javascript
// مثال على الاستخدام
const searchHadith = async (query) => {
  const response = await fetch(
    `https://dorar.net/dorar_api.json?skey=${query}`
  );
  return await response.json();
};
```

#### ب) **مصادر إضافية موثقة**:

1. **Quran.com API**
   - القرآن الكريم كاملاً
   - تفاسير متعددة
   - ترجمات معتمدة
   - مجاني بالكامل

2. **Sunnah.com API**
   - مجموعة ضخمة من الأحاديث
   - كتب الحديث الستة
   - تصنيف وتدرج الأحاديث

3. **IslamQA.info**
   - فتاوى موثقة
   - إجابات من علماء معتبرين
   - تصنيف حسب المواضيع

## 🔧 خطوات التنفيذ

### المرحلة 1: إعداد البيئة

1. **إنشاء مشروع Supabase**:
   ```bash
   # زيارة https://supabase.com
   # إنشاء مشروع جديد
   # الحصول على URL و API Key
   ```

2. **تكوين متغيرات البيئة**:
   ```bash
   cp .env.example .env
   # تحديث القيم في ملف .env
   ```

3. **تثبيت التبعيات**:
   ```bash
   npm install @supabase/supabase-js
   ```

### المرحلة 2: إنشاء قاعدة البيانات

1. **تشغيل SQL Schema**:
   - فتح Supabase SQL Editor
   - تشغيل محتوى `database/supabase-schema.sql`

2. **التحقق من الإعداد**:
   ```typescript
   import { checkSupabaseConnection } from '@/lib/supabase';
   
   const isConnected = await checkSupabaseConnection();
   console.log('الاتصال:', isConnected ? 'نجح' : 'فشل');
   ```

### المرحلة 3: جمع البيانات الشرعية

#### أ) **البيانات الأساسية (يدوياً)**:
```typescript
// إدراج بيانات أساسية موثقة
const basicData = [
  {
    question: "ما حكم الصلاة في البيت؟",
    answer: "الأصل في الصلاة أن تؤدى في المسجد...",
    source: "اللجنة الدائمة للبحوث العلمية",
    category: "عبادات",
    reliability: "صحيح"
  }
  // المزيد من البيانات...
];
```

#### ب) **البيانات من APIs خارجية**:
```typescript
// جلب من الدرر السنية
const fetchFromDorar = async () => {
  const topics = ['صلاة', 'زكاة', 'صيام', 'حج'];
  
  for (const topic of topics) {
    const data = await DorrarService.searchHadith(topic);
    // معالجة وحفظ البيانات
  }
};
```

### المرحلة 4: تطوير خدمة البحث الذكي

```typescript
// خدمة البحث المتقدم
export class SmartSearchService {
  static async search(query: string, type: 'all' | 'quran' | 'hadith' | 'fatwa') {
    // 1. تحليل الاستعلام
    const analyzedQuery = await this.analyzeQuery(query);
    
    // 2. البحث في قاعدة البيانات
    const results = await this.searchDatabase(analyzedQuery, type);
    
    // 3. ترتيب النتائج حسب الصلة
    return this.rankResults(results, query);
  }
}
```

## 🛡️ الاعتبارات الشرعية والقانونية

### 1. **حقوق الملكية الفكرية**
- ✅ استخدام مصادر مفتوحة أو مرخصة
- ✅ ذكر المصادر والمراجع
- ✅ عدم انتهاك حقوق النشر
- ✅ الحصول على إذن عند الحاجة

### 2. **الدقة الشرعية**
- ✅ التحقق من صحة النصوص
- ✅ ذكر درجة الحديث (صحيح/حسن/ضعيف)
- ✅ الإشارة إلى المصدر الأصلي
- ✅ تجنب التفسيرات الشخصية

### 3. **المسؤولية العلمية**
- ✅ إضافة تنبيه للمستخدمين
- ✅ توجيههم للرجوع إلى العلماء
- ✅ عدم الفتوى بدون علم
- ✅ التحديث المستمر للمحتوى

## 📊 مصادر البيانات المقترحة

### 1. **مصادر مجانية ومفتوحة**:

| المصدر | النوع | الترخيص | الجودة |
|---------|-------|----------|---------|
| Dorar.net | أحاديث + فتاوى | مجاني | عالية جداً |
| Quran.com | قرآن + تفسير | مفتوح | ممتازة |
| Sunnah.com | أحاديث | مفتوح | عالية |
| IslamQA.info | فتاوى | مجاني | عالية |
| Tanzil.net | قرآن | مفتوح | ممتازة |

### 2. **APIs موصى بها**:

```javascript
// مجموعة APIs مجانية
const ISLAMIC_APIS = {
  quran: 'https://api.quran.com/api/v4',
  hadith: 'https://dorar.net/dorar_api.json',
  prayer: 'http://api.aladhan.com/v1',
  qibla: 'http://api.aladhan.com/v1/qibla',
  hijri: 'http://api.aladhan.com/v1/gToH'
};
```

## 🚀 التنفيذ العملي

### 1. **إعداد المشروع**:
```bash
# استنساخ المشروع
git clone https://github.com/your-repo/mafatih.git
cd mafatih

# تثبيت التبعيات
npm install

# إعداد البيئة
cp .env.example .env
# تحديث متغيرات البيئة
```

### 2. **إعداد Supabase**:
```bash
# إنشاء مشروع في https://supabase.com
# نسخ URL و API Key إلى .env
# تشغيل SQL Schema في Supabase Dashboard
```

### 3. **تشغيل التطبيق**:
```bash
npm run dev
# زيارة http://localhost:5173
```

### 4. **اختبار الميزات**:
- اختبار البحث في الأسئلة الشرعية
- اختبار مساعد الآيات الذكي
- التحقق من دقة النتائج

## 📈 خطة التطوير المستقبلية

### المرحلة القادمة:
1. **توسيع قاعدة البيانات**
2. **إضافة مصادر جديدة**
3. **تحسين خوارزمية البحث**
4. **إضافة ميزة التحقق التلقائي**
5. **تطوير تطبيق جوال**

### الميزات المتقدمة:
- **AI محلي** للخصوصية
- **وضع عدم الاتصال**
- **مزامنة السحابة**
- **مجتمع المستخدمين**

## 🔍 مراجع ومصادر إضافية

### مواقع مفيدة:
- [Dorar.net API Documentation](https://dorar.net/api)
- [Quran.com API](https://quran.api-docs.io/)
- [Supabase Documentation](https://supabase.com/docs)
- [Islamic APIs Collection](https://github.com/islamic-network)

### كتب ومراجع:
- "فقه السنة" - سيد سابق
- "صحيح البخاري ومسلم"
- "فتاوى اللجنة الدائمة"
- "مجموع فتاوى ابن تيمية"

---

**المطور**: حذيفة الحذيفي  
**المشروع**: مفاتيح - مساعد المسلم الذكي الشامل  
**التاريخ**: ديسمبر 2024  
**الإصدار**: 3.0.0
