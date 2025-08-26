# 🔧 دليل المطور - مفاتيح

## 📋 نظرة عامة

هذا الدليل مخصص للمطورين الذين يريدون فهم بنية مشروع "مفاتيح" والمساهمة في تطويره.

## 🏗️ بنية المشروع

```
src/
├── components/          # المكونات الأساسية
│   ├── ui/             # مكونات الواجهة الأساسية
│   ├── ThemeProvider.tsx
│   ├── ThemeToggle.tsx
│   ├── IslamicQA.tsx
│   ├── DreamInterpretation.tsx
│   ├── NotificationSystem.tsx
│   ├── SpiritualContent.tsx
│   ├── UserProfile.tsx
│   └── Navigation.tsx
├── config/             # ملفات التكوين
│   └── app.ts
├── data/               # البيانات الإسلامية
│   └── islamicData.ts
├── utils/              # الوظائف المساعدة
│   └── helpers.ts
├── pages/              # الصفحات الرئيسية
│   └── Index.tsx
└── styles/             # ملفات التصميم
    └── index.css
```

## 🎨 نظام التصميم

### الألوان
- **الأساسي**: #000000 (أسود)
- **الثانوي**: #FFFFFF (أبيض)
- **المساعد**: #F5F5F5 (رمادي فاتح)
- **النص المكتوم**: #666666 (رمادي متوسط)

### الخطوط
- **العربية**: Cairo (للنصوص العادية)
- **القرآن والأحاديث**: Amiri (للنصوص الدينية)

### المكونات الأساسية
- جميع المكونات تستخدم نظام الألوان الأسود والأبيض فقط
- دعم كامل للثيم الداكن والفاتح
- حدود سوداء/بيضاء بسماكة 2px للتمييز
- انتقالات سلسة مع Framer Motion

## 🔧 إعداد البيئة التطويرية

### المتطلبات
- Node.js 18+ 
- npm أو yarn
- Git

### خطوات التثبيت
```bash
# استنساخ المشروع
git clone <repository-url>
cd mafatih-al-ruh-guide

# تثبيت التبعيات
npm install

# نسخ ملف البيئة
cp .env.example .env

# تشغيل الخادم المحلي
npm run dev
```

## 📦 التبعيات الأساسية

### الإنتاج
- **React 18** - مكتبة الواجهة
- **TypeScript** - لغة البرمجة
- **Tailwind CSS** - إطار التصميم
- **Framer Motion** - الحركات والانتقالات
- **Lucide React** - الأيقونات
- **Radix UI** - مكونات الواجهة الأساسية

### التطوير المستقبلي
- **Supabase** - قاعدة البيانات
- **OpenAI API** - الذكاء الاصطناعي
- **Firebase** - الإشعارات
- **React i18next** - دعم اللغات

## 🧩 إضافة مكونات جديدة

### قواعد التصميم
1. استخدم الألوان الأسود والأبيض فقط
2. أضف دعم الثيم الداكن/الفاتح
3. استخدم حدود بسماكة 2px
4. أضف حركات سلسة مع Framer Motion
5. تأكد من دعم اللغة العربية

### مثال على مكون جديد
```tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

export function NewComponent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-2 border-black dark:border-white">
        <CardHeader>
          <CardTitle>عنوان المكون</CardTitle>
        </CardHeader>
        <CardContent>
          <p>محتوى المكون</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
```

## 💾 إدارة البيانات

### التخزين المحلي
```typescript
import { saveToLocalStorage, getFromLocalStorage } from '@/utils/helpers';

// حفظ البيانات
saveToLocalStorage('user-settings', userSettings);

// استرجاع البيانات
const settings = getFromLocalStorage('user-settings', defaultSettings);
```

### البيانات الإسلامية
```typescript
import { getVerseByMood, getAzkarByMoodAndTime } from '@/data/islamicData';

// الحصول على آية حسب الحالة
const verse = getVerseByMood('حزن');

// الحصول على أذكار حسب الحالة والوقت
const azkar = getAzkarByMoodAndTime('شكر', 'morning');
```

## 🔔 نظام الإشعارات

### إضافة إشعار جديد
```typescript
const newNotification = {
  id: generateUniqueId(),
  title: 'عنوان الإشعار',
  message: 'رسالة الإشعار',
  type: 'prayer', // prayer, dhikr, verse, reminder
  time: '12:00',
  enabled: true,
  icon: <Icon className="h-5 w-5" />
};
```

## 🎯 نظام النقاط والإنجازات

### إضافة نقاط
```typescript
import { addPointsToUser } from '@/utils/helpers';

// إضافة نقاط للصلاة
addPointsToUser('prayer', 1);

// إضافة نقاط للأذكار
addPointsToUser('dhikr', 100);
```

### إضافة إنجاز جديد
```typescript
const newAchievement = {
  id: generateUniqueId(),
  title: 'اسم الإنجاز',
  description: 'وصف الإنجاز',
  icon: <Icon className="h-6 w-6" />,
  unlocked: false,
  progress: 0,
  target: 100
};
```

## 🌐 دعم اللغات

### إضافة نص جديد
```typescript
// في ملف البيانات
export const TEXTS = {
  ar: {
    welcome: 'مرحباً بك',
    // ...
  },
  en: {
    welcome: 'Welcome',
    // ...
  }
};
```

## 🧪 الاختبار

### اختبار المكونات
```bash
# تشغيل الاختبارات
npm run test

# اختبار التغطية
npm run test:coverage
```

## 📱 التجاوب والأجهزة المحمولة

### نقاط التوقف
- `sm`: 640px+
- `md`: 768px+
- `lg`: 1024px+
- `xl`: 1280px+

### مثال على التصميم المتجاوب
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* المحتوى */}
</div>
```

## 🚀 النشر والإنتاج

### بناء المشروع
```bash
npm run build
```

### معاينة الإنتاج
```bash
npm run preview
```

## 🐛 تصحيح الأخطاء

### أدوات التطوير
- React Developer Tools
- Redux DevTools (إذا تم استخدام Redux)
- Browser DevTools

### سجلات الأخطاء
```typescript
console.error('خطأ في المكون:', error);
```

## 📚 مصادر إضافية

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion)
- [Radix UI](https://www.radix-ui.com)

## 🤝 المساهمة

1. Fork المشروع
2. إنشاء فرع جديد (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push للفرع (`git push origin feature/amazing-feature`)
5. فتح Pull Request

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT - راجع ملف LICENSE للتفاصيل.

---

**المطور:** حذيفة الحذيفي  
**المشروع:** مفاتيح - مساعد المسلم الذكي الشامل
