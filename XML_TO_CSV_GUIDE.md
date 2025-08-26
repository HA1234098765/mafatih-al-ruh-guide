# 🔄 دليل تحويل القرآن الكريم من XML إلى CSV

## 📋 نظرة عامة

تم إنشاء سكريبتين Python لتحويل ملف `quran-uthmani.xml` إلى ملف CSV متوافق مع جدول `quran_verses` في قاعدة البيانات.

## 📁 الملفات المتوفرة

### ✅ **السكريبتات:**
1. **`xml_to_csv_converter.py`** - محول متقدم مع بيانات السور كاملة
2. **`simple_xml_converter.py`** - محول بسيط يتعامل مع تنسيقات مختلفة

### ✅ **الملفات المطلوبة:**
- `quran-uthmani.xml` - ملف القرآن الكريم بصيغة XML

## 🚀 طريقة الاستخدام

### **الطريقة الأولى: السكريبت المتقدم**

#### **المتطلبات:**
```bash
# تأكد من وجود Python 3.6+
python --version

# لا حاجة لمكتبات إضافية (يستخدم المكتبات المدمجة)
```

#### **الخطوات:**
1. **ضع ملف XML في نفس المجلد:**
   ```
   project/
   ├── xml_to_csv_converter.py
   ├── quran-uthmani.xml
   └── csv_data/ (سيتم إنشاؤه تلقائياً)
   ```

2. **شغل السكريبت:**
   ```bash
   python xml_to_csv_converter.py
   ```

3. **النتيجة:**
   ```
   🕌 محول القرآن الكريم من XML إلى CSV
   ==================================================
   🔄 جاري تحليل ملف: quran-uthmani.xml
   ✅ تم استخراج 6236 آية من 114 سورة
   📝 جاري كتابة البيانات إلى: csv_data/quran_verses.csv
   ✅ تم حفظ 6236 آية في ملف CSV
   
   🎉 تم التحويل بنجاح!
   📁 ملف CSV: csv_data/quran_verses.csv
   📊 عدد الآيات: 6236
   📖 عدد السور: 114
   ```

### **الطريقة الثانية: السكريبت البسيط**

#### **الاستخدام:**
```bash
python simple_xml_converter.py
```

#### **المميزات:**
- يكتشف هيكل XML تلقائياً
- يتعامل مع تنسيقات مختلفة
- يعرض معلومات تشخيصية مفيدة

## 📊 هيكل ملف CSV الناتج

### **الأعمدة:**
```csv
surah_number,surah_name,surah_name_english,ayah_number,arabic_text,revelation_type,juz_number,hizb_number,page_number
1,الفاتحة,Al-Fatiha,1,بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ,مكية,,,
1,الفاتحة,Al-Fatiha,2,الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ,مكية,,,
2,البقرة,Al-Baqarah,1,الم,مدنية,,,
```

### **وصف الأعمدة:**
| العمود | الوصف | مثال |
|--------|-------|------|
| `surah_number` | رقم السورة (1-114) | 1 |
| `surah_name` | اسم السورة بالعربية | الفاتحة |
| `surah_name_english` | اسم السورة بالإنجليزية | Al-Fatiha |
| `ayah_number` | رقم الآية في السورة | 1 |
| `arabic_text` | النص العربي للآية | بِسْمِ اللَّهِ... |
| `revelation_type` | نوع الوحي (مكية/مدنية) | مكية |
| `juz_number` | رقم الجزء (فارغ حالياً) | |
| `hizb_number` | رقم الحزب (فارغ حالياً) | |
| `page_number` | رقم الصفحة (فارغ حالياً) | |

## 📥 استيراد البيانات إلى Supabase

### **الطريقة الأولى: Dashboard**

1. **اذهب إلى Supabase Dashboard**
2. **اختر Table Editor**
3. **اختر جدول `quran_verses`**
4. **اضغط "Import data"**
5. **ارفع ملف `csv_data/quran_verses.csv`**
6. **تأكد من مطابقة الأعمدة:**
   ```
   CSV Column → Database Column
   surah_number → surah_number
   surah_name → surah_name
   surah_name_english → surah_name_english
   ayah_number → ayah_number
   arabic_text → arabic_text
   revelation_type → revelation_type
   juz_number → juz_number (اختياري)
   hizb_number → hizb_number (اختياري)
   page_number → page_number (اختياري)
   ```
7. **اضغط "Import"**

### **الطريقة الثانية: SQL**

```sql
-- استيراد البيانات باستخدام COPY
COPY quran_verses (
    surah_number, 
    surah_name, 
    surah_name_english, 
    ayah_number, 
    arabic_text, 
    revelation_type,
    juz_number,
    hizb_number,
    page_number
)
FROM '/path/to/quran_verses.csv'
DELIMITER ','
CSV HEADER;
```

## 🔧 استكشاف الأخطاء

### **مشكلة: ملف XML غير موجود**
```
❌ لم يتم العثور على ملف: quran-uthmani.xml
💡 تأكد من وضع ملف quran-uthmani.xml في نفس مجلد السكريبت
```

**الحل:**
- تأكد من وجود ملف `quran-uthmani.xml` في نفس مجلد السكريبت
- تحقق من اسم الملف (حساس لحالة الأحرف)

### **مشكلة: لم يتم استخراج آيات**
```
❌ لم يتم استخراج أي آيات
```

**الحل:**
- استخدم السكريبت البسيط لاكتشاف هيكل XML
- تحقق من صحة ملف XML
- جرب فتح الملف في محرر نصوص للتأكد من المحتوى

### **مشكلة: ترميز النص**
```
❌ خطأ في كتابة ملف CSV: 'charmap' codec can't encode character
```

**الحل:**
```bash
# تأكد من تشغيل السكريبت مع ترميز UTF-8
export PYTHONIOENCODING=utf-8
python xml_to_csv_converter.py
```

### **مشكلة: استيراد Supabase**
```
❌ خطأ في الاستيراد: Invalid input syntax
```

**الحل:**
- تأكد من مطابقة أنواع البيانات
- تحقق من وجود قيم فارغة في الأعمدة المطلوبة
- استخدم النص التالي لتنظيف البيانات:

```sql
-- تنظيف البيانات بعد الاستيراد
UPDATE quran_verses 
SET juz_number = NULL 
WHERE juz_number = '';

UPDATE quran_verses 
SET hizb_number = NULL 
WHERE hizb_number = '';

UPDATE quran_verses 
SET page_number = NULL 
WHERE page_number = '';
```

## 📊 التحقق من نجاح الاستيراد

### **استعلامات التحقق:**
```sql
-- عدد الآيات الإجمالي
SELECT COUNT(*) as total_verses FROM quran_verses;
-- يجب أن يكون حوالي 6236

-- عدد السور
SELECT COUNT(DISTINCT surah_number) as total_surahs FROM quran_verses;
-- يجب أن يكون 114

-- أول 5 آيات
SELECT surah_number, surah_name, ayah_number, 
       LEFT(arabic_text, 50) as text_preview
FROM quran_verses 
ORDER BY surah_number, ayah_number 
LIMIT 5;

-- إحصائيات السور
SELECT surah_number, surah_name, COUNT(*) as ayah_count
FROM quran_verses 
GROUP BY surah_number, surah_name
ORDER BY surah_number
LIMIT 10;
```

## 🎯 نصائح مهمة

### **1. حجم الملف:**
- ملف CSV سيكون حوالي 2-5 MB
- يحتوي على 6000+ سجل
- قد يستغرق الاستيراد بضع دقائق

### **2. الذاكرة:**
- السكريبت يحمل جميع البيانات في الذاكرة
- تأكد من وجود ذاكرة كافية (512 MB على الأقل)

### **3. النسخ الاحتياطي:**
- احتفظ بنسخة من ملف XML الأصلي
- اعمل نسخة احتياطية من قاعدة البيانات قبل الاستيراد

## 🎉 النتيجة المتوقعة

بعد التحويل والاستيراد الناجح:

✅ **6,236 آية** من القرآن الكريم
✅ **114 سورة** كاملة
✅ **نصوص عربية صحيحة** مع الترميز السليم
✅ **بيانات منظمة** وجاهزة للبحث والاستعلام
✅ **تكامل مع قاعدة البيانات** الموجودة

**قاعدة البيانات ستصبح مكتملة مع النص الكامل للقرآن الكريم! 🕌**
