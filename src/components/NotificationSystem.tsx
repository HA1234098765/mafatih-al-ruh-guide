import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Bell, Clock, Moon, Sun, Heart, BookOpen, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'prayer' | 'dhikr' | 'verse' | 'reminder';
  time: string;
  enabled: boolean;
  icon: React.ReactNode;
}

interface NotificationSettings {
  prayerReminders: boolean;
  dhikrReminders: boolean;
  verseOfDay: boolean;
  spiritualReminders: boolean;
  soundEnabled: boolean;
}

export function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    prayerReminders: true,
    dhikrReminders: true,
    verseOfDay: true,
    spiritualReminders: true,
    soundEnabled: true
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeNotification, setActiveNotification] = useState<Notification | null>(null);

  // تحديث الوقت كل ثانية
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // إعداد الإشعارات الافتراضية
  useEffect(() => {
    const defaultNotifications: Notification[] = [
      {
        id: 1,
        title: "وقت صلاة الفجر",
        message: "حان وقت صلاة الفجر. بارك الله فيك",
        type: 'prayer',
        time: "05:30",
        enabled: settings.prayerReminders,
        icon: <Sun className="h-5 w-5" />
      },
      {
        id: 2,
        title: "وقت صلاة الظهر",
        message: "حان وقت صلاة الظهر. لا تنس الصلاة",
        type: 'prayer',
        time: "12:30",
        enabled: settings.prayerReminders,
        icon: <Sun className="h-5 w-5" />
      },
      {
        id: 3,
        title: "وقت صلاة العصر",
        message: "حان وقت صلاة العصر. استعد للصلاة",
        type: 'prayer',
        time: "15:45",
        enabled: settings.prayerReminders,
        icon: <Sun className="h-5 w-5" />
      },
      {
        id: 4,
        title: "وقت صلاة المغرب",
        message: "حان وقت صلاة المغرب. اللهم بلغنا ليلة القدر",
        type: 'prayer',
        time: "18:20",
        enabled: settings.prayerReminders,
        icon: <Moon className="h-5 w-5" />
      },
      {
        id: 5,
        title: "وقت صلاة العشاء",
        message: "حان وقت صلاة العشاء. ختام يوم مبارك",
        type: 'prayer',
        time: "19:45",
        enabled: settings.prayerReminders,
        icon: <Moon className="h-5 w-5" />
      },
      {
        id: 6,
        title: "أذكار الصباح",
        message: "ابدأ يومك بأذكار الصباح المباركة",
        type: 'dhikr',
        time: "07:00",
        enabled: settings.dhikrReminders,
        icon: <Heart className="h-5 w-5" />
      },
      {
        id: 7,
        title: "أذكار المساء",
        message: "اختتم يومك بأذكار المساء",
        type: 'dhikr',
        time: "19:00",
        enabled: settings.dhikrReminders,
        icon: <Heart className="h-5 w-5" />
      },
      {
        id: 8,
        title: "آية اليوم",
        message: "تدبر آية اليوم واستفد من معانيها",
        type: 'verse',
        time: "09:00",
        enabled: settings.verseOfDay,
        icon: <BookOpen className="h-5 w-5" />
      },
      {
        id: 9,
        title: "تذكير روحاني",
        message: "خذ لحظة للتفكر في نعم الله عليك",
        type: 'reminder',
        time: "14:00",
        enabled: settings.spiritualReminders,
        icon: <AlertCircle className="h-5 w-5" />
      }
    ];

    setNotifications(defaultNotifications);
  }, [settings]);

  // فحص الإشعارات المستحقة
  useEffect(() => {
    const checkNotifications = () => {
      const currentTimeString = currentTime.toTimeString().slice(0, 5);
      const currentSeconds = currentTime.getSeconds();

      // فحص الإشعارات فقط عند بداية الدقيقة
      if (currentSeconds === 0) {
        const dueNotification = notifications.find(
          notification => notification.time === currentTimeString && notification.enabled
        );

        if (dueNotification && !activeNotification) {
          setActiveNotification(dueNotification);
          
          // إخفاء الإشعار بعد 10 ثوان
          setTimeout(() => {
            setActiveNotification(null);
          }, 10000);

          // تشغيل الصوت إذا كان مفعلاً
          if (settings.soundEnabled) {
            // يمكن إضافة ملف صوتي هنا
            console.log('Playing notification sound...');
          }
        }
      }
    };

    checkNotifications();
  }, [currentTime, notifications, activeNotification, settings.soundEnabled]);

  const updateSettings = (key: keyof NotificationSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const toggleNotification = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, enabled: !notification.enabled }
          : notification
      )
    );
  };

  const dismissNotification = () => {
    setActiveNotification(null);
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'prayer': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'dhikr': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'verse': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'reminder': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    };
    return colors[type] || colors['reminder'];
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'prayer': 'صلاة',
      'dhikr': 'ذكر',
      'verse': 'آية',
      'reminder': 'تذكير'
    };
    return labels[type] || 'تذكير';
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* الإشعار النشط */}
      <AnimatePresence>
        {activeNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-4 left-4 right-4 z-50"
          >
            <Card className="border-2 border-green-500 bg-green-50 dark:bg-green-900/20 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {activeNotification.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-green-800 dark:text-green-200">
                      {activeNotification.title}
                    </h4>
                    <p className="text-green-700 dark:text-green-300">
                      {activeNotification.message}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={dismissNotification}
                    className="text-green-600 hover:text-green-800"
                  >
                    ✕
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Card className="border-2 border-black dark:border-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <Bell className="h-6 w-6" />
            نظام الإشعارات والتذكيرات
          </CardTitle>
          <CardDescription>
            إعدادات التذكيرات الإيمانية والإشعارات الذكية
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* الوقت الحالي */}
          <Card className="bg-gray-50 dark:bg-gray-900 border border-black dark:border-white">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="h-5 w-5" />
                <span className="font-semibold">الوقت الحالي</span>
              </div>
              <div className="text-3xl font-bold font-mono">
                {currentTime.toLocaleTimeString('ar-SA', { 
                  hour12: false,
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </div>
              <div className="text-sm text-muted-foreground">
                {currentTime.toLocaleDateString('ar-SA', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </CardContent>
          </Card>

          {/* إعدادات عامة */}
          <div className="space-y-4">
            <h4 className="font-semibold">الإعدادات العامة</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 border border-black dark:border-white rounded-lg">
                <span>تذكيرات الصلاة</span>
                <Switch
                  checked={settings.prayerReminders}
                  onCheckedChange={(checked) => updateSettings('prayerReminders', checked)}
                />
              </div>
              <div className="flex items-center justify-between p-3 border border-black dark:border-white rounded-lg">
                <span>تذكيرات الأذكار</span>
                <Switch
                  checked={settings.dhikrReminders}
                  onCheckedChange={(checked) => updateSettings('dhikrReminders', checked)}
                />
              </div>
              <div className="flex items-center justify-between p-3 border border-black dark:border-white rounded-lg">
                <span>آية اليوم</span>
                <Switch
                  checked={settings.verseOfDay}
                  onCheckedChange={(checked) => updateSettings('verseOfDay', checked)}
                />
              </div>
              <div className="flex items-center justify-between p-3 border border-black dark:border-white rounded-lg">
                <span>التذكيرات الروحانية</span>
                <Switch
                  checked={settings.spiritualReminders}
                  onCheckedChange={(checked) => updateSettings('spiritualReminders', checked)}
                />
              </div>
            </div>
          </div>

          {/* قائمة الإشعارات */}
          <div className="space-y-4">
            <h4 className="font-semibold">جدول التذكيرات</h4>
            <div className="grid gap-3">
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 border rounded-lg transition-all duration-300 ${
                    notification.enabled 
                      ? 'border-black dark:border-white bg-white dark:bg-black' 
                      : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {notification.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-semibold">{notification.title}</h5>
                        <Badge className={getTypeColor(notification.type)}>
                          {getTypeLabel(notification.type)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm font-mono">{notification.time}</span>
                      </div>
                    </div>
                    <Switch
                      checked={notification.enabled}
                      onCheckedChange={() => toggleNotification(notification.id)}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* معلومات إضافية */}
          <Card className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-3 text-blue-800 dark:text-blue-200">
                ملاحظات مهمة
              </h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• يجب السماح للمتصفح بإرسال الإشعارات لتعمل التذكيرات</li>
                <li>• أوقات الصلاة تقريبية ويُنصح بالتحقق من التوقيت المحلي</li>
                <li>• يمكنك تخصيص الإعدادات حسب احتياجاتك الشخصية</li>
                <li>• التذكيرات تعمل فقط عندما يكون التطبيق مفتوحاً</li>
              </ul>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
