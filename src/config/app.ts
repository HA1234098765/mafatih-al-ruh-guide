// تكوين التطبيق الأساسي
export const APP_CONFIG = {
  name: 'مفاتيح',
  fullName: 'مفاتيح - مساعد المسلم الذكي الشامل',
  version: '1.0.0',
  author: 'حذيفة الحذيفي',
  description: 'منصة ذكاء اصطناعي شخصية للمسلمين، تقدم تجربة إيمانية مخصصة يوميًا',
  
  // الألوان الأساسية (أسود وأبيض فقط)
  colors: {
    primary: '#000000',
    secondary: '#FFFFFF',
    accent: '#F5F5F5',
    muted: '#666666'
  },
  
  // إعدادات الثيم
  theme: {
    defaultTheme: 'light' as 'light' | 'dark',
    storageKey: 'mafatih-ui-theme'
  },
  
  // إعدادات التخزين المحلي
  storage: {
    userDataKey: 'mafatih-user-data',
    settingsKey: 'mafatih-settings',
    progressKey: 'mafatih-progress',
    achievementsKey: 'mafatih-achievements'
  },
  
  // أوقات الصلاة الافتراضية (يمكن تخصيصها لاحقاً)
  defaultPrayerTimes: {
    fajr: '05:30',
    dhuhr: '12:30',
    asr: '15:45',
    maghrib: '18:20',
    isha: '19:45'
  },
  
  // إعدادات الإشعارات
  notifications: {
    defaultEnabled: true,
    soundEnabled: true,
    displayDuration: 10000 // 10 ثوان
  },
  
  // أهداف افتراضية
  defaultGoals: {
    dailyPrayers: 5,
    weeklyQuranPages: 14,
    dailyDhikr: 100,
    weeklySpiritualTasks: 21
  },
  
  // مستويات المستخدم
  userLevels: [
    { name: 'مبتدئ', minPoints: 0, maxPoints: 499 },
    { name: 'متوسط', minPoints: 500, maxPoints: 1499 },
    { name: 'متقدم', minPoints: 1500, maxPoints: 2999 },
    { name: 'خبير', minPoints: 3000, maxPoints: 4999 },
    { name: 'عالم', minPoints: 5000, maxPoints: Infinity }
  ],
  
  // نقاط الأنشطة
  activityPoints: {
    prayer: 10,
    dhikr: 1,
    quranPage: 25,
    spiritualTask: 15,
    dailyStreak: 50,
    weeklyStreak: 200,
    monthlyStreak: 1000
  }
};

// دالة للحصول على مستوى المستخدم بناءً على النقاط
export const getUserLevel = (points: number) => {
  return APP_CONFIG.userLevels.find(level => 
    points >= level.minPoints && points <= level.maxPoints
  ) || APP_CONFIG.userLevels[0];
};

// دالة لحساب النقاط المطلوبة للمستوى التالي
export const getPointsToNextLevel = (currentPoints: number) => {
  const currentLevel = getUserLevel(currentPoints);
  const currentLevelIndex = APP_CONFIG.userLevels.indexOf(currentLevel);
  
  if (currentLevelIndex === APP_CONFIG.userLevels.length - 1) {
    return 0; // المستوى الأقصى
  }
  
  const nextLevel = APP_CONFIG.userLevels[currentLevelIndex + 1];
  return nextLevel.minPoints - currentPoints;
};

// دالة لتنسيق الوقت العربي
export const formatArabicTime = (date: Date) => {
  return date.toLocaleTimeString('ar-SA', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit'
  });
};

// دالة لتنسيق التاريخ العربي
export const formatArabicDate = (date: Date) => {
  return date.toLocaleDateString('ar-SA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// دالة للحصول على التحية المناسبة حسب الوقت
export const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return 'صباح الخير';
  } else if (hour >= 12 && hour < 17) {
    return 'مساء الخير';
  } else if (hour >= 17 && hour < 21) {
    return 'مساء الخير';
  } else {
    return 'ليلة مباركة';
  }
};

// دالة للحصول على الوقت المناسب للأنشطة
export const getCurrentTimeCategory = () => {
  const hour = new Date().getHours();
  
  if (hour >= 6 && hour < 12) {
    return 'morning';
  } else if (hour >= 12 && hour < 18) {
    return 'afternoon';
  } else if (hour >= 18 && hour < 24) {
    return 'evening';
  } else {
    return 'night';
  }
};

// رسائل تشجيعية
export const ENCOURAGEMENT_MESSAGES = [
  'بارك الله فيك! استمر في التقدم',
  'ماشاء الله! إنجاز رائع',
  'أحسنت! كل خطوة تقربك إلى الله',
  'ممتاز! واصل هذا المستوى',
  'جعل الله عملك في ميزان حسناتك',
  'استمر على هذا المنوال المبارك',
  'نسأل الله أن يتقبل منك',
  'بداية موفقة! الله يعينك'
];

// دالة للحصول على رسالة تشجيعية عشوائية
export const getRandomEncouragement = () => {
  return ENCOURAGEMENT_MESSAGES[Math.floor(Math.random() * ENCOURAGEMENT_MESSAGES.length)];
};
