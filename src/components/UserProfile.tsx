import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { User, Settings } from "lucide-react"

interface UserData {
  name: string
  age: string
  gender: 'male' | 'female' | ''
  language: 'ar' | 'en'
  interests: string[]
  dailyMood: string
}

export function UserProfile() {
  const [userData, setUserData] = useState<UserData>({
    name: '',
    age: '',
    gender: '',
    language: 'ar',
    interests: [],
    dailyMood: ''
  })

  const [isEditing, setIsEditing] = useState(false)

  const handleSave = () => {
    // حفظ البيانات في localStorage أو قاعدة البيانات
    localStorage.setItem('mafatih-user-data', JSON.stringify(userData))
    setIsEditing(false)
  }

  const interests = [
    'تلاوة القرآن',
    'الأذكار والأدعية',
    'الفقه الإسلامي',
    'التزكية والتربية',
    'السيرة النبوية',
    'التفسير',
    'الحديث الشريف'
  ]

  return (
    <Card className="w-full max-w-2xl mx-auto border-2 border-black dark:border-white">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2">
          <User className="h-6 w-6" />
          <CardTitle className="text-2xl font-bold">الملف الشخصي</CardTitle>
        </div>
        <CardDescription>
          قم بتخصيص تجربتك الإيمانية الشخصية
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isEditing ? (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">
                {userData.name || 'أخي المسلم'}
              </h3>
              <p className="text-muted-foreground">
                مرحباً بك في رحلتك الإيمانية اليومية
              </p>
            </div>
            <Button 
              onClick={() => setIsEditing(true)}
              className="w-full bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              <Settings className="h-4 w-4 mr-2" />
              تحديث البيانات
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">الاسم (اختياري)</Label>
                <Input
                  id="name"
                  value={userData.name}
                  onChange={(e) => setUserData({...userData, name: e.target.value})}
                  placeholder="أدخل اسمك"
                  className="border-black dark:border-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">العمر</Label>
                <Input
                  id="age"
                  type="number"
                  value={userData.age}
                  onChange={(e) => setUserData({...userData, age: e.target.value})}
                  placeholder="أدخل عمرك"
                  className="border-black dark:border-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender">الجنس</Label>
                <Select value={userData.gender} onValueChange={(value: 'male' | 'female') => setUserData({...userData, gender: value})}>
                  <SelectTrigger className="border-black dark:border-white">
                    <SelectValue placeholder="اختر الجنس" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">ذكر</SelectItem>
                    <SelectItem value="female">أنثى</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">اللغة</Label>
                <Select value={userData.language} onValueChange={(value: 'ar' | 'en') => setUserData({...userData, language: value})}>
                  <SelectTrigger className="border-black dark:border-white">
                    <SelectValue placeholder="اختر اللغة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ar">العربية</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mood">حالتك اليوم</Label>
              <Textarea
                id="mood"
                value={userData.dailyMood}
                onChange={(e) => setUserData({...userData, dailyMood: e.target.value})}
                placeholder="كيف تشعر اليوم؟ ما هي حالتك النفسية والروحية؟"
                className="border-black dark:border-white min-h-[100px]"
              />
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleSave}
                className="flex-1 bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
              >
                حفظ
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(false)}
                className="flex-1 border-black dark:border-white"
              >
                إلغاء
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
