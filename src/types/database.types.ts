// 🗄️ أنواع قاعدة البيانات المتكاملة لمشروع مفاتيح
// تم إنشاؤها تلقائياً من سكريبت قاعدة البيانات

// ========================================
// 1. أنواع المستخدمين والملفات الشخصية
// ========================================

export interface User {
  id: string;
  email?: string;
  name?: string;
  age?: number;
  gender?: 'male' | 'female';
  language: 'ar' | 'en';
  location?: string;
  timezone: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
  is_active: boolean;
}

export interface UserSettings {
  id: string;
  user_id: string;
  theme: 'light' | 'dark';
  notifications_enabled: boolean;
  sound_enabled: boolean;
  prayer_notifications: boolean;
  dhikr_reminders: boolean;
  daily_verse_enabled: boolean;
  preferred_reciter: number;
  font_size: 'small' | 'medium' | 'large';
  created_at: string;
  updated_at: string;
}

export interface UserPrayerTimes {
  id: string;
  user_id: string;
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  calculation_method: string;
  created_at: string;
  updated_at: string;
}

export interface UserGoals {
  id: string;
  user_id: string;
  goal_type: string;
  target_value: number;
  current_value: number;
  period: 'daily' | 'weekly' | 'monthly';
  start_date: string;
  end_date?: string;
  is_active: boolean;
  created_at: string;
}

// ========================================
// 2. أنواع المحتوى الإسلامي
// ========================================

export interface QuranVerse {
  id: string;
  surah_number: number;
  surah_name: string;
  surah_name_english?: string;
  ayah_number: number;
  arabic_text: string;
  translation_ar?: string;
  translation_en?: string;
  tafseer?: string;
  revelation_type: 'مكية' | 'مدنية';
  theme: string[];
  juz_number?: number;
  hizb_number?: number;
  page_number?: number;
  created_at: string;
}

export interface HadithData {
  id: string;
  arabic_text: string;
  translation_ar?: string;
  translation_en?: string;
  narrator?: string;
  source_book: string;
  book_number?: number;
  hadith_number?: number;
  grade: 'صحيح' | 'حسن' | 'ضعيف' | 'موضوع';
  chapter?: string;
  explanation?: string;
  tags: string[];
  theme: string[];
  created_at: string;
}

export interface IslamicQuestion {
  id: string;
  question: string;
  answer: string;
  source: string;
  category: 'فقه' | 'عقيدة' | 'أخلاق' | 'عبادات' | 'معاملات' | 'سيرة' | 'تفسير';
  scholar?: string;
  reliability: 'صحيح' | 'حسن' | 'ضعيف';
  tags: string[];
  difficulty_level: 'مبتدئ' | 'متوسط' | 'متقدم';
  created_at: string;
  updated_at: string;
}

export interface Fatwa {
  id: string;
  question: string;
  answer: string;
  fatwa_number?: string;
  source_website?: string;
  scholar?: string;
  category?: string;
  date_issued?: string;
  reliability: 'موثق' | 'غير موثق';
  tags: string[];
  created_at: string;
}

export interface AzkarData {
  id: string;
  arabic_text: string;
  translation_ar?: string;
  translation_en?: string;
  category: string;
  timing?: string;
  count_recommended: number;
  reward?: string;
  source?: string;
  mood: string[];
  difficulty: 'سهل' | 'متوسط' | 'صعب';
  created_at: string;
}

export interface AllahName {
  id: string;
  name_arabic: string;
  name_transliteration?: string;
  meaning_arabic?: string;
  meaning_english?: string;
  explanation?: string;
  verse_reference?: string;
  order_number: number;
  created_at: string;
}

// ========================================
// 3. أنواع التتبع والإحصائيات
// ========================================

export interface PrayerTracking {
  id: string;
  user_id: string;
  prayer_name: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
  prayer_date: string;
  performed_at?: string;
  is_on_time: boolean;
  is_in_congregation: boolean;
  location?: string;
  notes?: string;
  created_at: string;
}

export interface QuranReadingTracking {
  id: string;
  user_id: string;
  surah_number: number;
  ayah_from: number;
  ayah_to: number;
  pages_read: number;
  reading_date: string;
  duration_minutes?: number;
  notes?: string;
  created_at: string;
}

export interface DhikrTracking {
  id: string;
  user_id: string;
  azkar_id: string;
  count_completed: number;
  target_count: number;
  session_date: string;
  timing?: string;
  mood?: string;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_type: string;
  achievement_name: string;
  description?: string;
  icon?: string;
  points_earned: number;
  achieved_at: string;
  level_achieved?: string;
}

export interface UserPoints {
  id: string;
  user_id: string;
  total_points: number;
  current_level: string;
  level_progress: number;
  last_updated: string;
}

// ========================================
// 4. أنواع المفضلات
// ========================================

export interface FavoriteVerse {
  id: string;
  user_id: string;
  verse_id: string;
  notes?: string;
  tags: string[];
  created_at: string;
}

export interface FavoriteHadith {
  id: string;
  user_id: string;
  hadith_id: string;
  notes?: string;
  tags: string[];
  created_at: string;
}

export interface FavoriteAzkar {
  id: string;
  user_id: string;
  azkar_id: string;
  custom_count?: number;
  notes?: string;
  created_at: string;
}



// ========================================
// 5. أنواع الإشعارات
// ========================================

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  priority: 'low' | 'medium' | 'high';
  is_read: boolean;
  scheduled_for?: string;
  sent_at?: string;
  created_at: string;
}

export interface CustomReminder {
  id: string;
  user_id: string;
  title: string;
  message?: string;
  reminder_type?: string;
  frequency: 'once' | 'daily' | 'weekly' | 'monthly';
  time_of_day?: string;
  days_of_week?: number[];
  is_active: boolean;
  created_at: string;
}

// ========================================
// 6. أنواع المحتوى التفاعلي
// ========================================

export interface InspirationalQuote {
  id: string;
  text_arabic: string;
  text_english?: string;
  author?: string;
  source?: string;
  category?: string;
  tags: string[];
  mood: string[];
  created_at: string;
}

export interface EducationalContent {
  id: string;
  title: string;
  content: string;
  summary?: string;
  author?: string;
  category?: string;
  difficulty_level: 'مبتدئ' | 'متوسط' | 'متقدم';
  reading_time_minutes?: number;
  tags: string[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContentRating {
  id: string;
  user_id: string;
  content_id: string;
  rating: number;
  review?: string;
  is_helpful?: boolean;
  created_at: string;
}

// ========================================
// 7. أنواع التحليلات
// ========================================

export interface DailyUsageStats {
  id: string;
  user_id: string;
  date: string;
  prayers_completed: number;
  quran_pages_read: number;
  dhikr_sessions: number;
  time_spent_minutes: number;
  features_used: string[];
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  activity_type: string;
  activity_details: Record<string, any>;
  points_earned: number;
  created_at: string;
}

// ========================================
// 8. أنواع مساعدة للواجهات
// ========================================

export interface DatabaseResponse<T> {
  data: T | null;
  error: Error | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface SearchFilters {
  category?: string;
  tags?: string[];
  difficulty?: string;
  date_from?: string;
  date_to?: string;
  limit?: number;
  offset?: number;
}

export interface UserStats {
  total_prayers: number;
  total_quran_pages: number;
  total_dhikr_count: number;
  current_streak: number;
  total_points: number;
  current_level: string;
  achievements_count: number;
  favorite_verses_count: number;
  favorite_hadith_count: number;
}

// ========================================
// 9. أنواع للتصدير
// ========================================

export type Tables = {
  users: User;
  user_settings: UserSettings;
  user_prayer_times: UserPrayerTimes;
  user_goals: UserGoals;
  quran_verses: QuranVerse;
  hadith_data: HadithData;
  islamic_questions: IslamicQuestion;
  fatawa: Fatwa;
  azkar_data: AzkarData;
  allah_names: AllahName;
  prayer_tracking: PrayerTracking;
  quran_reading_tracking: QuranReadingTracking;
  dhikr_tracking: DhikrTracking;
  user_achievements: UserAchievement;
  user_points: UserPoints;
  favorite_verses: FavoriteVerse;
  favorite_hadith: FavoriteHadith;
  favorite_azkar: FavoriteAzkar;
  notifications: Notification;
  custom_reminders: CustomReminder;
  inspirational_quotes: InspirationalQuote;
  educational_content: EducationalContent;
  content_ratings: ContentRating;
  daily_usage_stats: DailyUsageStats;
  activity_log: ActivityLog;
};

export type Database = {
  public: {
    Tables: Tables;
  };
};
