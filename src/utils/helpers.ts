// مساعدات ووظائف مفيدة للتطبيق

import { APP_CONFIG } from '@/config/app';

// دالة لحفظ البيانات في التخزين المحلي
export const saveToLocalStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

// دالة لاسترجاع البيانات من التخزين المحلي
export const getFromLocalStorage = (key: string, defaultValue: any = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

// دالة لحذف البيانات من التخزين المحلي
export const removeFromLocalStorage = (key: string) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing from localStorage:', error);
    return false;
  }
};

// دالة لتنسيق الأرقام العربية
export const formatArabicNumber = (number: number) => {
  return number.toLocaleString('ar-SA');
};

// دالة لتحويل الأرقام الإنجليزية إلى عربية
export const toArabicNumerals = (str: string) => {
  const arabicNumerals = '٠١٢٣٤٥٦٧٨٩';
  const englishNumerals = '0123456789';
  
  return str.replace(/[0-9]/g, (match) => {
    return arabicNumerals[englishNumerals.indexOf(match)];
  });
};

// دالة لحساب الفرق بين تاريخين بالأيام
export const getDaysDifference = (date1: Date, date2: Date) => {
  const timeDifference = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(timeDifference / (1000 * 3600 * 24));
};

// دالة للتحقق من صحة البريد الإلكتروني
export const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// دالة لتقصير النص مع إضافة نقاط
export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// دالة لتحديد وقت اليوم
export const getTimeOfDay = () => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) return 'صباح';
  if (hour >= 12 && hour < 17) return 'ظهر';
  if (hour >= 17 && hour < 20) return 'مساء';
  return 'ليل';
};

// دالة لتحديد التحية المناسبة
export const getGreeting = () => {
  const timeOfDay = getTimeOfDay();
  const greetings = {
    'صباح': 'صباح الخير',
    'ظهر': 'نهارك مبارك',
    'مساء': 'مساء الخير',
    'ليل': 'ليلة مباركة'
  };
  
  return greetings[timeOfDay as keyof typeof greetings];
};

// دالة لحساب النسبة المئوية
export const calculatePercentage = (current: number, total: number) => {
  if (total === 0) return 0;
  return Math.round((current / total) * 100);
};

// دالة لتوليد معرف فريد
export const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// دالة لتحديد لون التقدم حسب النسبة
export const getProgressColor = (percentage: number) => {
  if (percentage >= 90) return 'text-green-600';
  if (percentage >= 70) return 'text-blue-600';
  if (percentage >= 50) return 'text-yellow-600';
  if (percentage >= 30) return 'text-orange-600';
  return 'text-red-600';
};

// دالة لتحديد رسالة التشجيع حسب النسبة
export const getEncouragementByProgress = (percentage: number) => {
  if (percentage >= 90) return 'ممتاز! أداء رائع';
  if (percentage >= 70) return 'أحسنت! تقدم جيد';
  if (percentage >= 50) return 'جيد! واصل التقدم';
  if (percentage >= 30) return 'بداية جيدة! استمر';
  return 'ابدأ رحلتك اليوم';
};

// دالة لتحويل الثواني إلى تنسيق وقت قابل للقراءة
export const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// دالة لتحديد ما إذا كان الوقت الحالي ضمن نطاق معين
export const isTimeInRange = (startTime: string, endTime: string) => {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  const start = startHour * 60 + startMinute;
  const end = endHour * 60 + endMinute;
  
  return currentTime >= start && currentTime <= end;
};

// دالة لحساب عدد الأيام المتبقية حتى تاريخ معين
export const getDaysUntil = (targetDate: Date) => {
  const today = new Date();
  const timeDifference = targetDate.getTime() - today.getTime();
  return Math.ceil(timeDifference / (1000 * 3600 * 24));
};

// دالة لتحديد ما إذا كان اليوم هو يوم جمعة
export const isJummah = () => {
  return new Date().getDay() === 5; // الجمعة هو اليوم الخامس (0 = الأحد)
};

// دالة لتحديد ما إذا كان الشهر الحالي هو رمضان (تقريبي)
export const isRamadan = () => {
  // هذه دالة تقريبية - في التطبيق الحقيقي يجب استخدام التقويم الهجري
  const month = new Date().getMonth();
  // افتراض أن رمضان في الشهر الرابع (أبريل) - يجب تحديثها سنوياً
  return month === 3;
};

// دالة لحفظ إعدادات المستخدم
export const saveUserSettings = (settings: any) => {
  return saveToLocalStorage(APP_CONFIG.storage.settingsKey, settings);
};

// دالة لاسترجاع إعدادات المستخدم
export const getUserSettings = () => {
  return getFromLocalStorage(APP_CONFIG.storage.settingsKey, {
    notifications: true,
    sound: true,
    theme: 'light',
    language: 'ar'
  });
};

// دالة لحفظ تقدم المستخدم
export const saveUserProgress = (progress: any) => {
  return saveToLocalStorage(APP_CONFIG.storage.progressKey, progress);
};

// دالة لاسترجاع تقدم المستخدم
export const getUserProgress = () => {
  return getFromLocalStorage(APP_CONFIG.storage.progressKey, {
    totalPoints: 0,
    currentStreak: 0,
    completedTasks: [],
    achievements: []
  });
};

// دالة لحساب النقاط بناءً على النشاط
export const calculateActivityPoints = (activityType: string, count: number = 1) => {
  const points = APP_CONFIG.activityPoints[activityType as keyof typeof APP_CONFIG.activityPoints];
  return points ? points * count : 0;
};

// دالة لإضافة نقاط للمستخدم
export const addPointsToUser = (activityType: string, count: number = 1) => {
  const progress = getUserProgress();
  const points = calculateActivityPoints(activityType, count);
  
  progress.totalPoints += points;
  saveUserProgress(progress);
  
  return points;
};

// دالة للتحقق من إنجاز جديد
export const checkForNewAchievements = (userProgress: any) => {
  // منطق فحص الإنجازات الجديدة
  const newAchievements = [];
  
  // مثال: إنجاز المصلي المواظب
  if (userProgress.currentStreak >= 7 && !userProgress.achievements.includes('consistent_prayer')) {
    newAchievements.push('consistent_prayer');
  }
  
  // مثال: إنجاز قارئ القرآن
  if (userProgress.totalQuranPages >= 10 && !userProgress.achievements.includes('quran_reader')) {
    newAchievements.push('quran_reader');
  }
  
  return newAchievements;
};
