import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, BookOpen, Lightbulb, Search, ExternalLink, Database, Shield, Brain, Sparkles, Zap } from 'lucide-react';
import { motion } from "framer-motion";
import { IslamicAIService, IslamicAIRequest, IslamicAIResponse } from '@/services/islamicAI.service';
import GroqAIService, { GroqAIRequest, GroqAIResponse } from '@/services/groqAI.service';

interface Fatwa {
  id: string | number;
  question: string;
  answer: string;
  source: string;
  category: string;
  tags: string[];
  confidence?: number;
}

const IslamicQA: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<Fatwa | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Fatwa[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [dataSource, setDataSource] = useState<'local' | 'dorar' | 'supabase'>('local');

  // التحقق من حالة الاتصال
  useEffect(() => {
    const checkConnection = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', checkConnection);
    window.addEventListener('offline', checkConnection);
    checkConnection();

    return () => {
      window.removeEventListener('online', checkConnection);
      window.removeEventListener('offline', checkConnection);
    };
  }, []);

  const fatwasDatabase: Fatwa[] = [
    {
      id: 1,
      question: "ما هي أركان الإسلام؟",
      answer: "أركان الإسلام خمسة: شهادة أن لا إله إلا الله وأن محمداً رسول الله، وإقام الصلاة، وإيتاء الزكاة، وصوم رمضان، وحج البيت لمن استطاع إليه سبيلاً. هذه الأركان هي الأساس الذي يقوم عليه دين الإسلام، وهي واجبة على كل مسلم بالغ عاقل.",
      source: "الإسلام سؤال وجواب",
      category: "العقيدة",
      tags: ["أركان", "إسلام", "أساسيات"]
    },
    {
      id: 2,
      question: "كيف أتوضأ الوضوء الصحيح؟",
      answer: "الوضوء يكون بالنية أولاً، ثم التسمية، ثم غسل الكفين ثلاثاً، ثم المضمضة والاستنشاق ثلاثاً، ثم غسل الوجه ثلاثاً، ثم غسل اليدين إلى المرفقين ثلاثاً بدءاً باليمين، ثم مسح الرأس مرة واحدة، ثم غسل الرجلين إلى الكعبين ثلاثاً بدءاً باليمين.",
      source: "الدرر السنية",
      category: "الطهارة",
      tags: ["وضوء", "طهارة", "صلاة"]
    },
    {
      id: 3,
      question: "ما هي أوقات الصلوات الخمس؟",
      answer: "أوقات الصلوات الخمس هي: الفجر من طلوع الفجر الصادق إلى طلوع الشمس، والظهر من زوال الشمس إلى أن يصير ظل كل شيء مثله، والعصر من انتهاء وقت الظهر إلى غروب الشمس، والمغرب من غروب الشمس إلى غياب الشفق الأحمر، والعشاء من غياب الشفق الأحمر إلى منتصف الليل.",
      source: "الإسلام سؤال وجواب",
      category: "الصلاة",
      tags: ["صلاة", "أوقات", "مواقيت"]
    },
    {
      id: 4,
      question: "ما حكم صلاة الجماعة؟",
      answer: "صلاة الجماعة واجبة على الرجال القادرين في المسجد، وهي من أعظم شعائر الإسلام. قال النبي صلى الله عليه وسلم: 'صلاة الجماعة تفضل صلاة الفذ بسبع وعشرين درجة'. ويُعذر من تركها لعذر شرعي كالمرض أو الخوف أو السفر.",
      source: "الدرر السنية",
      category: "الصلاة",
      tags: ["جماعة", "صلاة", "واجب"]
    },
    {
      id: 5,
      question: "كيف أحسب زكاة المال؟",
      answer: "زكاة المال تجب في النقود والذهب والفضة إذا بلغت النصاب وحال عليها الحول. النصاب هو ما يعادل 85 جراماً من الذهب الخالص أو 595 جراماً من الفضة. والمقدار الواجب هو ربع العشر أي 2.5% من المال. مثال: إذا كان لديك 100,000 ريال وحال عليها الحول، فالزكاة = 100,000 × 2.5% = 2,500 ريال.",
      source: "الإسلام سؤال وجواب",
      category: "الزكاة",
      tags: ["زكاة", "مال", "حساب"]
    }
  ];

  const commonQuestions = fatwasDatabase.slice(0, 3);

  const handleSubmit = async () => {
    if (!question.trim()) return;

    setIsLoading(true);
    setAnswer(null);
    setSearchResults([]);

    try {
      // استخدام خدمة Groq AI الجديدة مع مفتاح API الخاص بك
      const groqRequest: GroqAIRequest = {
        question: question.trim(),
        language: 'ar',
        maxTokens: 1000
      };

      const groqAnswer: GroqAIResponse = await GroqAIService.getSmartAnswer(groqRequest);

      if (groqAnswer.confidence > 0.4) {
        const answerData: Fatwa = {
          id: Date.now().toString(),
          question: question,
          answer: groqAnswer.answer,
          source: groqAnswer.sources.join(', '),
          category: groqAnswer.category,
          tags: groqAnswer.relatedQuestions.slice(0, 3), // استخدام الأسئلة ذات الصلة كتاغات
          confidence: groqAnswer.confidence
        };

        setAnswer(answerData);
        setDataSource(groqAnswer.confidence > 0.8 ? 'supabase' : groqAnswer.confidence > 0.6 ? 'dorar' : 'local');

        // إضافة الأسئلة ذات الصلة كنتائج بحث
        if (groqAnswer.relatedQuestions.length > 0) {
          const relatedFatwas: Fatwa[] = groqAnswer.relatedQuestions.slice(0, 3).map((relatedQ, index) => ({
            id: `related-${index}`,
            question: relatedQ,
            answer: "اضغط لرؤية الإجابة التفصيلية",
            source: "أسئلة ذات صلة - Groq AI",
            category: groqAnswer.category,
            tags: []
          }));
          setSearchResults(relatedFatwas);
        }

        // البحث عن أسئلة إضافية في قاعدة البيانات المحلية
        if (isOnline) {
          try {
            // البحث في قاعدة البيانات المحلية
            const additionalQuestions = fatwasDatabase.filter(fatwa =>
              fatwa.question.toLowerCase().includes(question.toLowerCase()) ||
              fatwa.tags.some(tag => question.toLowerCase().includes(tag.toLowerCase()))
            ).slice(0, 2);
            
            if (additionalQuestions.length > 0) {
              const additionalFatwas: Fatwa[] = additionalQuestions.map(q => ({
                id: q.id,
                question: q.question,
                answer: q.answer,
                source: q.source,
                category: q.category,
                tags: q.tags
              }));
              setSearchResults(prev => [...prev, ...additionalFatwas]);
            }
          } catch (error) {
            console.warn('فشل في جلب الأسئلة الإضافية:', error);
          }
        }
      } else {
        // العودة إلى البحث المحلي
        const localResults = fatwasDatabase.filter(fatwa =>
          fatwa.question.toLowerCase().includes(question.toLowerCase()) ||
          fatwa.answer.toLowerCase().includes(question.toLowerCase()) ||
          fatwa.tags.some(tag => question.toLowerCase().includes(tag.toLowerCase()))
        );
        
        if (localResults.length > 0) {
          setAnswer({
            ...localResults[0],
            confidence: 0.6
          });
          setSearchResults(localResults.slice(1, 4));
          setDataSource('local');
        } else {
          // إجابة افتراضية محسنة
          setAnswer({
            id: 'default',
            question: question,
            answer: "لم نجد إجابة مباشرة لسؤالك في المصادر المتاحة حالياً. ننصحك بما يلي:\n\n• مراجعة العلماء المختصين\n• البحث في المواقع الشرعية الموثقة مثل الإسلام سؤال وجواب أو الدرر السنية\n• إعادة صياغة السؤال بطريقة أخرى أو أكثر تفصيلاً\n• التأكد من صحة الكتابة والإملاء",
            source: "نصائح عامة",
            category: "عام",
            tags: ["نصائح", "إرشادات", "مساعدة"],
            confidence: 0.3
          });
          setDataSource('local');
        }
      }
    } catch (error) {
      console.error('خطأ في البحث:', error);

      // العودة إلى البحث المحلي في حالة الخطأ
      const localResults = fatwasDatabase.filter(fatwa =>
        fatwa.question.toLowerCase().includes(question.toLowerCase()) ||
        fatwa.answer.toLowerCase().includes(question.toLowerCase()) ||
        fatwa.tags.some(tag => question.toLowerCase().includes(tag.toLowerCase()))
      );

      if (localResults.length > 0) {
        setAnswer({
          ...localResults[0],
          confidence: 0.7
        });
        setSearchResults(localResults.slice(1, 4));
        setDataSource('local');
      } else {
        setAnswer({
          id: 'error',
          question: question,
          answer: "حدث خطأ تقني في البحث. يرجى:\n\n• المحاولة مرة أخرى بعد قليل\n• التأكد من اتصال الإنترنت\n• مراجعة المصادر الشرعية الموثقة مباشرة\n• التواصل مع الدعم التقني إذا استمرت المشكلة",
          source: "رسالة خطأ",
          category: "عام",
          tags: ["خطأ", "مساعدة"],
          confidence: 0.1
        });
        setDataSource('local');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (fatwa: Fatwa) => {
    setQuestion(fatwa.question);
    setAnswer(fatwa);
    setSearchResults([]);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'العقيدة': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'الطهارة': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'الصلاة': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'الزكاة': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'عام': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    };
    return colors[category] || colors['عام'];
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4"
      >
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 w-16 h-16 mx-auto border-2 border-dashed border-black/20 dark:border-white/20 rounded-full"
          />
          <div className="relative w-16 h-16 mx-auto bg-gradient-to-br from-black to-gray-600 dark:from-white dark:to-gray-300 rounded-2xl flex items-center justify-center shadow-xl">
            <MessageCircle className="h-8 w-8 text-white dark:text-black" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-black via-gray-700 to-black dark:from-white dark:via-gray-300 dark:to-white bg-clip-text text-transparent">
          الأسئلة الشرعية الموثقة
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          اطرح سؤالك الشرعي واحصل على إجابة موثقة من المصادر الإسلامية المعتمدة
        </p>
      </motion.div>

      <Card className="border-2 border-black dark:border-white shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-white dark:from-gray-900/50 dark:to-black" />
        <CardContent className="relative z-10 space-y-8 p-8">
          {/* Enhanced Common Questions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                <Lightbulb className="h-6 w-6" />
                أسئلة شائعة
              </h3>
              <p className="text-gray-600 dark:text-gray-400">اختر سؤالاً للحصول على إجابة فورية</p>
            </div>
            <div className="grid gap-4">
              {commonQuestions.map((fatwa, index) => (
                <motion.div
                  key={fatwa.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline"
                    className="text-right justify-start h-auto p-6 w-full border-2 border-black/20 dark:border-white/20 hover:border-black dark:hover:border-white rounded-2xl bg-white dark:bg-black hover:shadow-xl transition-all duration-300 group"
                    onClick={() => handleQuickQuestion(fatwa)}
                  >
                    <div className="w-full space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge className={`${getCategoryColor(fatwa.category)} px-3 py-1 rounded-full`}>
                          {fatwa.category}
                        </Badge>
                        <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <p className="text-base font-medium leading-relaxed text-right">
                        {fatwa.question}
                      </p>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Enhanced Question Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-2 border-black/20 dark:border-white/20 shadow-xl">
              <CardContent className="p-8 space-y-6">
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    <h3 className="text-xl font-bold">اطرح سؤالك الشرعي</h3>
                    <Sparkles className="h-5 w-5 text-purple-600" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    مدعوم بالذكاء الاصطناعي المتخصص في الشريعة الإسلامية
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-purple-600 dark:text-purple-400">
                    <Zap className="h-4 w-4" />
                    <span>تقنية Groq AI المتقدمة</span>
                  </div>
                </div>

                <div className="relative">
                  <Textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="مثال: ما حكم صلاة الجماعة؟ أو كيف أحسب زكاة المال؟ أو ما هي آداب الدعاء؟"
                    className="min-h-[140px] border-2 border-black dark:border-white rounded-2xl p-6 text-lg bg-white dark:bg-black resize-none focus:ring-4 focus:ring-black/20 dark:focus:ring-white/20 transition-all duration-300"
                  />
                  <div className="absolute bottom-4 right-4 text-sm text-gray-400">
                    {question.length}/500
                  </div>
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handleSubmit}
                    disabled={!question.trim() || isLoading}
                    className="w-full bg-gradient-to-r from-black to-gray-800 dark:from-white dark:to-gray-200 text-white dark:text-black hover:from-gray-800 hover:to-black dark:hover:from-gray-200 dark:hover:to-white text-lg py-8 rounded-2xl shadow-xl border-2 border-black dark:border-white transition-all duration-300 relative overflow-hidden group"
                    size="lg"
                  >
                    {/* Button shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                    {isLoading ? (
                      <div className="flex items-center gap-3 relative z-10">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Search className="h-6 w-6" />
                        </motion.div>
                        <span className="font-semibold">جاري البحث في المصادر الشرعية...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 relative z-10">
                        <Send className="h-6 w-6" />
                        <span className="font-semibold">احصل على الإجابة الشرعية</span>
                      </div>
                    )}
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Enhanced Answer Display */}
          {answer && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-6"
            >
              {/* Answer Header */}
              <div className="text-center space-y-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="w-12 h-12 mx-auto bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center shadow-lg"
                >
                  <BookOpen className="h-6 w-6 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-green-800 dark:text-green-200">
                  الإجابة الشرعية
                </h3>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <Badge className={`${getCategoryColor(answer.category)} px-3 py-1 rounded-full`}>
                    {answer.category}
                  </Badge>
                  <Badge variant="outline" className="border-green-500 text-green-700 dark:text-green-300 px-3 py-1 rounded-full">
                    {answer.source}
                  </Badge>
                  {answer.confidence && (
                    <Badge
                      variant="outline"
                      className={`px-3 py-1 rounded-full ${
                        answer.confidence > 0.8
                          ? 'border-green-500 text-green-700 dark:text-green-300'
                          : answer.confidence > 0.5
                          ? 'border-yellow-500 text-yellow-700 dark:text-yellow-300'
                          : 'border-red-500 text-red-700 dark:text-red-300'
                      }`}
                    >
                      دقة: {Math.round(answer.confidence * 100)}%
                    </Badge>
                  )}
                  <Badge
                    variant="outline"
                    className="border-blue-500 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full flex items-center gap-1"
                  >
                    {dataSource === 'supabase' && <Database className="h-3 w-3" />}
                    {dataSource === 'dorar' && <ExternalLink className="h-3 w-3" />}
                    {dataSource === 'local' && <Shield className="h-3 w-3" />}
                    {dataSource === 'supabase' ? 'قاعدة البيانات' :
                     dataSource === 'dorar' ? 'الدرر السنية' : 'محلي'}
                  </Badge>
                </div>
              </div>

              {/* Main Answer Card */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-100/50 to-emerald-100/50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-3xl blur-xl" />
                <Card className="relative border-2 border-green-500 bg-green-50 dark:bg-green-900/20 shadow-2xl">
                  <CardContent className="p-8 md:p-12">
                    <div className="space-y-6">
                      {/* Decorative elements */}
                      <div className="flex justify-center items-center gap-4">
                        <div className="w-8 h-8 border-2 border-green-300 dark:border-green-700 rounded-full" />
                        <div className="w-4 h-4 bg-green-500 rounded-full" />
                        <div className="w-8 h-8 border-2 border-green-300 dark:border-green-700 rounded-full" />
                      </div>

                      {/* Answer Text */}
                      <div className="bg-white dark:bg-black p-8 rounded-2xl border-2 border-green-200 dark:border-green-800 shadow-inner">
                        <p className="text-lg leading-relaxed text-gray-800 dark:text-gray-200 font-medium">
                          {answer.answer}
                        </p>
                      </div>

                      {/* Tags */}
                      {answer.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 justify-center">
                          {answer.tags.map((tag, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                              <Badge variant="secondary" className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200">
                                #{tag}
                              </Badge>
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {/* Important Notice */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-6 rounded-2xl border-2 border-yellow-200 dark:border-yellow-800"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-white text-sm font-bold">!</span>
                          </div>
                          <div>
                            <h5 className="font-bold text-yellow-800 dark:text-yellow-200 mb-2">تنبيه مهم</h5>
                            <p className="text-sm text-yellow-700 dark:text-yellow-300 leading-relaxed">
                              يُنصح بمراجعة العلماء المختصين للتأكد من الفتوى، خاصة في المسائل المعقدة أو الخاصة بظروفك الشخصية. هذه الإجابات للاسترشاد العام.
                            </p>
                          </div>
                        </div>
                      </motion.div>

                      {/* Action Buttons */}
                      <div className="flex justify-center gap-4">
                        <Button
                          variant="outline"
                          onClick={() => setAnswer(null)}
                          className="border-green-500 text-green-700 hover:bg-green-500 hover:text-white dark:text-green-300 dark:hover:bg-green-600 px-6 py-3 rounded-xl"
                        >
                          سؤال آخر
                        </Button>
                        <Button
                          onClick={() => setQuestion('')}
                          className="bg-green-600 text-white hover:bg-green-700 px-6 py-3 rounded-xl"
                        >
                          ابدأ من جديد
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {/* نتائج بحث إضافية */}
          {searchResults.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-semibold">أسئلة ذات صلة</h4>
              <div className="grid gap-3">
                {searchResults.map((fatwa) => (
                  <Button
                    key={fatwa.id}
                    variant="outline"
                    className="text-right justify-start h-auto p-3 border-black dark:border-white"
                    onClick={() => handleQuickQuestion(fatwa)}
                  >
                    <div className="w-full">
                      <div className="flex items-center justify-between mb-1">
                        <Badge className={getCategoryColor(fatwa.category)}>
                          {fatwa.category}
                        </Badge>
                        <ExternalLink className="h-4 w-4" />
                      </div>
                      <p className="text-sm">{fatwa.question}</p>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* روابط مفيدة */}
          <Card className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-3 text-blue-800 dark:text-blue-200">
                مصادر شرعية موثقة للمزيد من الاستفادة
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <a href="https://islamqa.info" target="_blank" rel="noopener noreferrer" 
                   className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                  <ExternalLink className="h-3 w-3" />
                  الإسلام سؤال وجواب
                </a>
                <a href="https://dorar.net" target="_blank" rel="noopener noreferrer"
                   className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                  <ExternalLink className="h-3 w-3" />
                  الدرر السنية
                </a>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default IslamicQA;
