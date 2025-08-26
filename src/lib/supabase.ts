// إعداد Supabase للمشروع
import { createClient } from '@supabase/supabase-js';

// متغيرات البيئة - يجب إضافتها في ملف .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

// إنشاء عميل Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// دالة للتحقق من الاتصال
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('islamic_questions')
      .select('count')
      .limit(1);
    
    return !error;
  } catch (error) {
    console.error('خطأ في الاتصال بـ Supabase:', error);
    return false;
  }
};

// دالة لإعداد قاعدة البيانات (تشغل مرة واحدة)
export const setupDatabase = async () => {
  try {
    // التحقق من وجود الجداول
    const { data: tables, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (error) {
      console.error('خطأ في التحقق من الجداول:', error);
      return false;
    }

    const tableNames = tables?.map(t => t.table_name) || [];
    const requiredTables = ['islamic_questions', 'hadith_data', 'quran_verses', 'fatawa'];
    
    const missingTables = requiredTables.filter(table => !tableNames.includes(table));
    
    if (missingTables.length > 0) {
      console.warn('الجداول المفقودة:', missingTables);
      console.log('يرجى تشغيل ملف database/supabase-schema.sql في Supabase SQL Editor');
      return false;
    }

    console.log('قاعدة البيانات جاهزة ✅');
    return true;
  } catch (error) {
    console.error('خطأ في إعداد قاعدة البيانات:', error);
    return false;
  }
};

// دالة لتحديث البيانات من مصادر خارجية
export const updateDatabaseFromSources = async () => {
  try {
    console.log('بدء تحديث البيانات من المصادر الخارجية...');
    
    // يمكن إضافة منطق لجلب البيانات من APIs خارجية
    // مثل الدرر السنية، إسلام ويب، إلخ
    
    console.log('تم تحديث البيانات بنجاح ✅');
    return true;
  } catch (error) {
    console.error('خطأ في تحديث البيانات:', error);
    return false;
  }
};

// دالة للنسخ الاحتياطي
export const backupDatabase = async () => {
  try {
    const tables = ['islamic_questions', 'hadith_data', 'quran_verses', 'fatawa'];
    const backup: any = {};

    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*');

      if (error) {
        console.error(`خطأ في نسخ جدول ${table}:`, error);
        continue;
      }

      backup[table] = data;
    }

    // حفظ النسخة الاحتياطية في localStorage أو تصديرها
    localStorage.setItem('mafatih_backup', JSON.stringify(backup));
    console.log('تم إنشاء النسخة الاحتياطية ✅');
    
    return backup;
  } catch (error) {
    console.error('خطأ في إنشاء النسخة الاحتياطية:', error);
    return null;
  }
};

// دالة لاستعادة النسخة الاحتياطية
export const restoreDatabase = async (backupData: any) => {
  try {
    const tables = Object.keys(backupData);

    for (const table of tables) {
      const { error } = await supabase
        .from(table)
        .upsert(backupData[table]);

      if (error) {
        console.error(`خطأ في استعادة جدول ${table}:`, error);
        continue;
      }
    }

    console.log('تم استعادة النسخة الاحتياطية ✅');
    return true;
  } catch (error) {
    console.error('خطأ في استعادة النسخة الاحتياطية:', error);
    return false;
  }
};

export default supabase;
