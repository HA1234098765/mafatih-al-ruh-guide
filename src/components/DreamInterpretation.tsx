import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Moon, Send, BookOpen, Star, Eye, Lightbulb, Sparkles, Brain, AlertTriangle, Info } from 'lucide-react';
import { motion } from "framer-motion";
import GroqAIService, { GroqAIRequest, GroqAIResponse } from '@/services/groqAI.service';

interface DreamInterpretation {
  id: string;
  dream: string;
  interpretation: string;
  islamicMeaning: string;
  guidanceAndActions: string;
  sources: string[];
  category: string;
  symbolism: string[];
  confidence: number;
  warnings?: string;
}

const DreamInterpretation: React.FC = () => {
  const [dreamText, setDreamText] = useState('');
  const [interpretation, setInterpretation] = useState<DreamInterpretation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Common dream categories in Islamic interpretation
  const dreamCategories = [
    { id: 'all', name: 'جميع الأحلام', icon: '🌙' },
    { id: 'prophetic', name: 'رؤى نبوية', icon: '✨' },
    { id: 'good_news', name: 'بشارات', icon: '🌟' },
    { id: 'warnings', name: 'تحذيرات', icon: '⚠️' },
    { id: 'guidance', name: 'هداية وإرشاد', icon: '🧭' },
    { id: 'symbolic', name: 'رموز ومعاني', icon: '🔮' }
  ];

  // Sample interpretations for quick access
  const commonDreams = [
    {
      dream: "رأيت في المنام أنني أصلي في المسجد الحرام",
      category: "بشارات",
      brief: "رؤية إيجابية تدل على قبول الأعمال والتوفيق"
    },
    {
      dream: "حلمت أنني أقرأ القرآن الكريم",
      category: "هداية",
      brief: "دلالة على الهداية والنور في الحياة"
    },
    {
      dream: "رأيت الماء الصافي في المنام",
      category: "رموز",
      brief: "يرمز للطهارة والرزق الحلال"
    }
  ];

  const handleSubmit = async () => {
    if (!dreamText.trim()) return;

    setIsLoading(true);
    setInterpretation(null);

    try {
      // Create specialized request for dream interpretation
      const dreamRequest: GroqAIRequest = {
        question: `أريد تفسير هذا الحلم وفقاً للكتب الإسلامية الموثوقة في تفسير الأحلام: "${dreamText}"
        
        يرجى تقديم تفسير شامل يتضمن:
        1. التفسير الإسلامي المعتمد من كتب ابن سيرين وابن شاهين والنابلسي
        2. المعنى الروحي والرمزي للرؤية
        3. الإرشادات والأعمال المستحبة
        4. التحذيرات إن وجدت
        5. مصادر التفسير المعتمدة`,
        language: 'ar',
        maxTokens: 1500
      };

      const aiResponse: GroqAIResponse = await GroqAIService.getSmartAnswer(dreamRequest);

      if (aiResponse.confidence > 0.3) {
        // Parse the AI response and structure it
        const dreamInterpretation: DreamInterpretation = {
          id: Date.now().toString(),
          dream: dreamText,
          interpretation: aiResponse.answer,
          islamicMeaning: extractSection(aiResponse.answer, "المعنى الإسلامي") || "تفسير عام حسب الكتب الإسلامية",
          guidanceAndActions: extractSection(aiResponse.answer, "الإرشادات") || "الاستمرار في العبادة والدعاء",
          sources: aiResponse.sources.length > 0 ? aiResponse.sources : ["ابن سيرين", "ابن شاهين", "النابلسي"],
          category: categorizeInterpretation(aiResponse.answer),
          symbolism: extractSymbols(aiResponse.answer),
          confidence: aiResponse.confidence,
          warnings: extractSection(aiResponse.answer, "تحذير") || extractSection(aiResponse.answer, "تحذيرات")
        };

        setInterpretation(dreamInterpretation);
      } else {
        // Fallback interpretation
        setInterpretation({
          id: 'fallback',
          dream: dreamText,
          interpretation: "لم نتمكن من تقديم تفسير مفصل لهذا الحلم. ننصح بما يلي:\n\n• استشارة عالم متخصص في تفسير الأحلام\n• قراءة كتب التفسير المعتمدة مثل تفسير الأحلام لابن سيرين\n• الدعاء والاستخارة للحصول على الهداية\n• تذكر أن الأحلام قد تكون من النفس أو الشيطان وليست كلها رؤى صادقة",
          islamicMeaning: "الأحلام في الإسلام ثلاثة أنواع: رؤيا من الله، وحديث النفس، ووسوسة من الشيطان",
          guidanceAndActions: "• قراءة سورة الإخلاص والمعوذتين\n• الاستعاذة من الشيطان\n• عدم إخبار الحلم لمن لا يحبك",
          sources: ["القرآن الكريم", "السنة النبوية"],
          category: "عام",
          symbolism: [],
          confidence: 0.2
        });
      }
    } catch (error) {
      console.error('خطأ في تفسير الحلم:', error);
      
      // Error fallback
      setInterpretation({
        id: 'error',
        dream: dreamText,
        interpretation: "حدث خطأ تقني في تفسير الحلم. يرجى:\n\n• المحاولة مرة أخرى\n• التأكد من اتصال الإنترنت\n• مراجعة كتب تفسير الأحلام الإسلامية مباشرة",
        islamicMeaning: "في حالة عدم توفر التفسير، اللجوء إلى الله بالدعاء",
        guidanceAndActions: "• الصبر والدعاء\n• قراءة القرآن\n• الاستعاذة من الشيطان",
        sources: ["مصادر عامة"],
        category: "عام",
        symbolism: [],
        confidence: 0.1
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions
  const extractSection = (text: string, sectionName: string): string | null => {
    const regex = new RegExp(`${sectionName}[:\\s]*([^\\n]+(?:\\n[^\\n]*)*?)(?=\\n\\n|\\n[\\d\\.]|$)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : null;
  };

  const categorizeInterpretation = (text: string): string => {
    if (text.includes('بشارة') || text.includes('خير') || text.includes('رزق')) return 'بشارات';
    if (text.includes('تحذير') || text.includes('احذر') || text.includes('خطر')) return 'تحذيرات';
    if (text.includes('هداية') || text.includes('إرشاد') || text.includes('دعوة')) return 'هداية';
    if (text.includes('رمز') || text.includes('يدل على') || text.includes('معنى')) return 'رموز';
    return 'عام';
  };

  const extractSymbols = (text: string): string[] => {
    const symbols: string[] = [];
    const commonSymbols = ['الماء', 'النار', 'الطير', 'الشجر', 'البيت', 'الطريق', 'النور', 'الكتاب'];
    
    commonSymbols.forEach(symbol => {
      if (text.includes(symbol)) {
        symbols.push(symbol);
      }
    });
    
    return symbols;
  };

  const handleQuickDream = (dream: typeof commonDreams[0]) => {
    setDreamText(dream.dream);
    setSelectedCategory(dream.category);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'بشارات': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'تحذيرات': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'هداية': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'رموز': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
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
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 w-16 h-16 mx-auto border-2 border-dashed border-black/20 dark:border-white/20 rounded-full"
          />
          <div className="relative w-16 h-16 mx-auto bg-gradient-to-br from-black to-gray-600 dark:from-white dark:to-gray-300 rounded-2xl flex items-center justify-center shadow-xl">
            <Moon className="h-8 w-8 text-white dark:text-black" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-black via-gray-700 to-black dark:from-white dark:via-gray-300 dark:to-white bg-clip-text text-transparent">
          تفسير الأحلام الإسلامي
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          فسر أحلامك وفقاً للكتب الإسلامية الموثوقة مع الذكاء الاصطناعي المتخصص
        </p>
        
        {/* Islamic Guidelines */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-4 max-w-2xl mx-auto"
        >
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-semibold mb-1">آداب تفسير الأحلام في الإسلام:</p>
              <p>الرؤيا الصالحة من الله، وحديث النفس من الهوى، ووسوسة الشيطان. لا تحدث بالحلم السيء ولا تفسره، واستعذ بالله من الشيطان.</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <Card className="border-2 border-black dark:border-white shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-white dark:from-gray-900/50 dark:to-black" />
        <CardContent className="relative z-10 space-y-8 p-8">
          
          {/* Quick Dream Examples */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                <Star className="h-6 w-6" />
                أمثلة على الأحلام الشائعة
              </h3>
              <p className="text-gray-600 dark:text-gray-400">اختر مثالاً لرؤية التفسير أو اكتب حلمك الخاص</p>
            </div>
            <div className="grid gap-4">
              {commonDreams.map((dream, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline"
                    className="text-right justify-start h-auto p-6 w-full border-2 border-black/20 dark:border-white/20 hover:border-black dark:hover:border-white rounded-2xl bg-white dark:bg-black hover:shadow-xl transition-all duration-300 group"
                    onClick={() => handleQuickDream(dream)}
                  >
                    <div className="w-full space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge className={`${getCategoryColor(dream.category)} px-3 py-1 rounded-full`}>
                          {dream.category}
                        </Badge>
                        <Eye className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <p className="text-base font-medium leading-relaxed text-right">
                        {dream.dream}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 text-right">
                        {dream.brief}
                      </p>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Dream Input */}
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
                    <h3 className="text-xl font-bold">اكتب حلمك للتفسير</h3>
                    <Sparkles className="h-5 w-5 text-purple-600" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    مدعوم بالذكاء الاصطناعي المتخصص في التفسير الإسلامي
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-purple-600 dark:text-purple-400">
                    <BookOpen className="h-4 w-4" />
                    <span>مرجعية: ابن سيرين، ابن شاهين، النابلسي</span>
                  </div>
                </div>

                <div className="relative">
                  <Textarea
                    value={dreamText}
                    onChange={(e) => setDreamText(e.target.value)}
                    placeholder="اكتب تفاصيل حلمك هنا... مثال: رأيت في المنام أنني أطير في السماء، أو حلمت بالماء الصافي..."
                    className="min-h-[140px] border-2 border-black dark:border-white rounded-2xl p-6 text-lg bg-white dark:bg-black resize-none focus:ring-4 focus:ring-black/20 dark:focus:ring-white/20 transition-all duration-300"
                  />
                  <div className="absolute bottom-4 right-4 text-sm text-gray-400">
                    {dreamText.length}/1000
                  </div>
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handleSubmit}
                    disabled={!dreamText.trim() || isLoading}
                    className="w-full bg-gradient-to-r from-black to-gray-800 dark:from-white dark:to-gray-200 text-white dark:text-black hover:from-gray-800 hover:to-black dark:hover:from-gray-200 dark:hover:to-white text-lg py-8 rounded-2xl shadow-xl border-2 border-black dark:border-white transition-all duration-300 relative overflow-hidden group"
                    size="lg"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                    {isLoading ? (
                      <div className="flex items-center gap-3 relative z-10">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Moon className="h-6 w-6" />
                        </motion.div>
                        <span className="font-semibold">جاري تفسير الحلم...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 relative z-10">
                        <Send className="h-6 w-6" />
                        <span className="font-semibold">فسر الحلم</span>
                      </div>
                    )}
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Interpretation Results */}
          {interpretation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <Card className="border-2 border-black dark:border-white shadow-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-6 w-6" />
                      تفسير الحلم
                    </CardTitle>
                    <Badge className={`${getCategoryColor(interpretation.category)} px-4 py-2`}>
                      {interpretation.category}
                    </Badge>
                  </div>
                  <CardDescription className="text-lg font-medium">
                    "{interpretation.dream}"
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Main Interpretation */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500">
                    <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      التفسير الإسلامي
                    </h4>
                    <p className="leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-line">
                      {interpretation.interpretation}
                    </p>
                  </div>

                  {/* Islamic Meaning */}
                  <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border-l-4 border-green-500">
                    <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      المعنى الروحي
                    </h4>
                    <p className="leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-line">
                      {interpretation.islamicMeaning}
                    </p>
                  </div>

                  {/* Guidance and Actions */}
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-xl border-l-4 border-yellow-500">
                    <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                      <Lightbulb className="h-5 w-5" />
                      الإرشادات والأعمال المستحبة
                    </h4>
                    <p className="leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-line">
                      {interpretation.guidanceAndActions}
                    </p>
                  </div>

                  {/* Warnings if any */}
                  {interpretation.warnings && (
                    <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl border-l-4 border-red-500">
                      <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        تحذيرات مهمة
                      </h4>
                      <p className="leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-line">
                        {interpretation.warnings}
                      </p>
                    </div>
                  )}

                  {/* Symbolism */}
                  {interpretation.symbolism.length > 0 && (
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl border-l-4 border-purple-500">
                      <h4 className="font-bold text-lg mb-3">الرموز في الحلم</h4>
                      <div className="flex flex-wrap gap-2">
                        {interpretation.symbolism.map((symbol, index) => (
                          <Badge key={index} variant="outline" className="text-sm px-3 py-1">
                            {symbol}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sources */}
                  <div className="bg-gray-50 dark:bg-gray-900/20 p-6 rounded-xl border-l-4 border-gray-500">
                    <h4 className="font-bold text-lg mb-3">المصادر المرجعية</h4>
                    <div className="flex flex-wrap gap-2">
                      {interpretation.sources.map((source, index) => (
                        <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
                          {source}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      مستوى الثقة: {Math.round(interpretation.confidence * 100)}%
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DreamInterpretation;