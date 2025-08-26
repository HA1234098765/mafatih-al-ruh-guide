# 📊 دليل استيراد ملفات CSV لقاعدة بيانات مفاتيح

## 📁 الملفات المتوفرة

تم إنشاء ملفات CSV منفصلة لكل جدول يحتوي على بيانات أولية:

### ✅ **الملفات الجاهزة:**

1. **`allah_names.csv`** - أسماء الله الحسنى (21 اسم)
2. **`azkar_data.csv`** - الأذكار والأدعية (20 ذكر)
3. **`spiritual_plans.csv`** - الخطط الإيمانية (15 خطة)
4. **`inspirational_quotes.csv`** - الاقتباسات الإيمانية (25 اقتباس)
5. **`islamic_questions.csv`** - الأسئلة الشرعية (10 أسئلة)

## 🚀 طرق الاستيراد

### **الطريقة الأولى: استيراد مباشر في Supabase Dashboard**

#### **الخطوات:**

1. **إنشاء الجداول أولاً:**
   ```sql
   -- قم بتشغيل هذا السكريبت أولاً لإنشاء الجداول فقط
   -- (بدون البيانات الأولية)
   ```

2. **استيراد كل ملف CSV:**
   - اذهب إلى **Supabase Dashboard**
   - اختر **Table Editor**
   - اختر الجدول المطلوب
   - اضغط **Import data**
   - ارفع ملف CSV المقابل
   - تأكد من مطابقة الأعمدة

#### **ترتيب الاستيراد المطلوب:**
```
1. allah_names.csv → جدول allah_names
2. azkar_data.csv → جدول azkar_data  
3. spiritual_plans.csv → جدول spiritual_plans
4. inspirational_quotes.csv → جدول inspirational_quotes
5. islamic_questions.csv → جدول islamic_questions
```

### **الطريقة الثانية: استيراد باستخدام SQL**

#### **1. أسماء الله الحسنى:**
```sql
COPY allah_names (name_arabic, name_transliteration, meaning_arabic, meaning_english, order_number)
FROM '/path/to/allah_names.csv'
DELIMITER ','
CSV HEADER;
```

#### **2. الأذكار:**
```sql
COPY azkar_data (arabic_text, translation_ar, category, timing, count_recommended, reward, source, mood)
FROM '/path/to/azkar_data.csv'
DELIMITER ','
CSV HEADER;
```

#### **3. الخطط الإيمانية:**
```sql
COPY spiritual_plans (title, description, duration_weeks, difficulty_level, category)
FROM '/path/to/spiritual_plans.csv'
DELIMITER ','
CSV HEADER;
```

#### **4. الاقتباسات الإيمانية:**
```sql
COPY inspirational_quotes (text_arabic, author, source, category, mood)
FROM '/path/to/inspirational_quotes.csv'
DELIMITER ','
CSV HEADER;
```

#### **5. الأسئلة الشرعية:**
```sql
COPY islamic_questions (question, answer, source, category, scholar, reliability, tags, difficulty_level)
FROM '/path/to/islamic_questions.csv'
DELIMITER ','
CSV HEADER;
```

### **الطريقة الثالثة: استيراد باستخدام JavaScript/TypeScript**

```typescript
import { supabase } from '@/lib/supabase';
import Papa from 'papaparse';

// دالة لاستيراد ملف CSV
async function importCSV(tableName: string, csvFile: File) {
  return new Promise((resolve, reject) => {
    Papa.parse(csvFile, {
      header: true,
      complete: async (results) => {
        try {
          const { data, error } = await supabase
            .from(tableName)
            .insert(results.data);
          
          if (error) {
            reject(error);
          } else {
            resolve(data);
          }
        } catch (err) {
          reject(err);
        }
      },
      error: (error) => {
        reject(error);
      }
    });
  });
}

// استخدام الدالة
const csvFile = document.getElementById('csvInput').files[0];
await importCSV('allah_names', csvFile);
```

## 🔧 معالجة المصفوفات في CSV

### **مشكلة المصفوفات:**
بعض الحقول تحتوي على مصفوفات (مثل `mood` و `tags`) وهي مكتوبة في CSV كنص مفصول بفواصل.

### **الحل:**
```sql
-- بعد استيراد البيانات، قم بتحويل النصوص إلى مصفوفات
UPDATE azkar_data 
SET mood = string_to_array(mood, ',')
WHERE mood IS NOT NULL;

UPDATE inspirational_quotes 
SET mood = string_to_array(mood, ',')
WHERE mood IS NOT NULL;

UPDATE islamic_questions 
SET tags = string_to_array(tags, ',')
WHERE tags IS NOT NULL;
```

## 📋 التحقق من نجاح الاستيراد

### **استعلامات التحقق:**
```sql
-- التحقق من عدد السجلات
SELECT 'allah_names' as table_name, COUNT(*) as count FROM allah_names
UNION ALL
SELECT 'azkar_data', COUNT(*) FROM azkar_data
UNION ALL
SELECT 'spiritual_plans', COUNT(*) FROM spiritual_plans
UNION ALL
SELECT 'inspirational_quotes', COUNT(*) FROM inspirational_quotes
UNION ALL
SELECT 'islamic_questions', COUNT(*) FROM islamic_questions;

-- يجب أن تحصل على:
-- allah_names: 21
-- azkar_data: 20
-- spiritual_plans: 15
-- inspirational_quotes: 25
-- islamic_questions: 10
```

### **اختبار البيانات:**
```sql
-- اختبار أسماء الله الحسنى
SELECT name_arabic, meaning_arabic FROM allah_names LIMIT 5;

-- اختبار الأذكار
SELECT arabic_text, category, timing FROM azkar_data LIMIT 5;

-- اختبار الخطط
SELECT title, difficulty_level, category FROM spiritual_plans LIMIT 5;
```

## ⚠️ ملاحظات مهمة

### **1. ترميز الملفات:**
- تأكد من أن ملفات CSV محفوظة بترميز **UTF-8**
- هذا مهم للنصوص العربية

### **2. الفواصل:**
- استخدم الفاصلة `,` كفاصل
- النصوص التي تحتوي على فواصل محاطة بعلامات اقتباس

### **3. القيم الفارغة:**
- القيم الفارغة تظهر كخلايا فارغة في CSV
- سيتم تعيينها كـ `NULL` في قاعدة البيانات

### **4. المعرفات:**
- لا تحتاج لتضمين عمود `id` في CSV
- سيتم إنشاؤه تلقائياً بواسطة `gen_random_uuid()`

## 🎯 الخطوات الموصى بها

### **للاستيراد السريع:**

1. **إنشاء الجداول:**
   ```sql
   -- شغل سكريبت إنشاء الجداول فقط (بدون INSERT)
   ```

2. **استيراد البيانات:**
   - استخدم Supabase Dashboard لاستيراد كل ملف CSV
   - أو استخدم أوامر COPY SQL

3. **معالجة المصفوفات:**
   ```sql
   -- حول النصوص المفصولة بفواصل إلى مصفوفات
   UPDATE azkar_data SET mood = string_to_array(mood, ',');
   UPDATE inspirational_quotes SET mood = string_to_array(mood, ',');
   UPDATE islamic_questions SET tags = string_to_array(tags, ',');
   ```

4. **التحقق:**
   ```sql
   -- تأكد من صحة البيانات
   SELECT COUNT(*) FROM allah_names; -- 21
   SELECT COUNT(*) FROM azkar_data;  -- 20
   -- إلخ...
   ```

## 🎉 النتيجة

بعد الاستيراد الناجح، ستحصل على:

✅ **91 سجل** من البيانات الإسلامية الموثقة
✅ **محتوى متنوع** ومصنف بعناية  
✅ **قاعدة بيانات جاهزة** للاستخدام الفوري
✅ **بيانات منظمة** وقابلة للبحث

**قاعدة البيانات جاهزة للاستخدام! 🚀**
