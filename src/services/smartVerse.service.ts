// خدمة الآيات الذكية المدعومة بـ Groq AI
// تحليل المشاعر واقتراح الآيات المناسبة بدقة عالية

import GroqAIService, { GroqAIRequest, GroqAIResponse } from './groqAI.service';

export interface SmartVerseRequest {
  userMood: string;
  context?: string;
  language?: 'ar' | 'en';
  includeAnalysis?: boolean;
}

export interface VerseRecommendation {
  arabic: string;
  translation: string;
  surah: string;
  ayah: number;
  reference: string;
}

export interface SmartVerseResponse {
  verse: VerseRecommendation;
  explanation: string;
  reflection: string;
  practicalAdvice: string;
  relatedTopics: string[];
  confidence: number;
  sentiment?: string;
  emotionalCategory?: string;
  spiritualGuidance?: string[];
}

export interface SentimentAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral';
  emotions: string[];
  intensity: number;
  keywords: string[];
  confidence: number;
}

class SmartVerseService {
  // تحليل المشاعر والحالة النفسية
  public static async analyzeSentiment(text: string): Promise<SentimentAnalysis> {
    try {
      const prompt = `
أنت محلل نفسي ومشاعر متخصص. حلل النص التالي وحدد:

النص: "${text}"

أجب بتنسيق JSON كالتالي:
{
  "sentiment": "positive/negative/neutral",
  "emotions": ["قائمة المشاعر المكتشفة"],
  "intensity": 0.8,
  "keywords": ["الكلمات المفتاحية"],
  "confidence": 0.9,
  "emotionalState": "وصف الحالة النفسية",
  "needsSupport": true/false,
  "recommendedApproach": "نوع الدعم المطلوب"
}
`;

      const aiRequest: GroqAIRequest = {
        question: prompt,
        maxTokens: 500,
        language: 'ar'
      };

      const response = await GroqAIService.getSmartAnswer(aiRequest);
      
      try {
        const parsed = JSON.parse(response.answer);
        return {
          sentiment: parsed.sentiment || 'neutral',
          emotions: parsed.emotions || [],
          intensity: parsed.intensity || 0.5,
          keywords: parsed.keywords || [],
          confidence: parsed.confidence || 0.7
        };
      } catch (parseError) {
        // تحليل احتياطي بسيط
        return this.fallbackSentimentAnalysis(text);
      }
    } catch (error) {
      console.error('خطأ في تحليل المشاعر:', error);
      return this.fallbackSentimentAnalysis(text);
    }
  }

  // تحليل احتياطي للمشاعر
  private static fallbackSentimentAnalysis(text: string): SentimentAnalysis {
    const lowerText = text.toLowerCase();
    
    const positiveWords = ['سعيد', 'ممتن', 'شكر', 'فرح', 'راض', 'مبسوط', 'متفائل'];
    const negativeWords = ['حزين', 'مكتئب', 'قلق', 'خائف', 'متوتر', 'يائس', 'غاضب'];
    
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
    
    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
    let emotions: string[] = [];
    
    if (positiveCount > negativeCount) {
      sentiment = 'positive';
      emotions = ['إيجابية', 'تفاؤل'];
    } else if (negativeCount > positiveCount) {
      sentiment = 'negative';
      emotions = ['حاجة للدعم', 'تحدي نفسي'];
    } else {
      emotions = ['متوازن', 'هادئ'];
    }
    
    return {
      sentiment,
      emotions,
      intensity: Math.max(positiveCount, negativeCount) * 0.3 + 0.4,
      keywords: [...positiveWords.filter(w => lowerText.includes(w)), ...negativeWords.filter(w => lowerText.includes(w))],
      confidence: 0.6
    };
  }

  // الحصول على توصية آية ذكية مع إعطاء أولوية للذكاء الاصطناعي
  public static async getSmartVerseRecommendation(request: SmartVerseRequest): Promise<SmartVerseResponse> {
    console.log('🤖 بدء معالجة طلب الآية الذكية مع أولوية AI...');
    console.log('💭 المشاعر المدخلة:', request.userMood.substring(0, 100) + '...');
    
    // تحليل المشاعر أولاً
    let sentimentAnalysis: SentimentAnalysis;
    
    try {
      sentimentAnalysis = await this.analyzeSentiment(request.userMood);
      console.log('✅ تم تحليل المشاعر بنجاح:', sentimentAnalysis);
    } catch (sentimentError) {
      console.warn('⚠️ فشل تحليل المشاعر بـ AI، استخدام التحليل المحلي...');
      sentimentAnalysis = this.fallbackSentimentAnalysis(request.userMood);
    }
    
    // محاولة الحصول على آية من Groq AI (الأولوية الأولى)
    console.log('🚀 محاولة الحصول على آية من Groq AI...');
    
    try {
      const versePrompt = this.createEnhancedVersePrompt(request.userMood, sentimentAnalysis);
      
      const aiRequest: GroqAIRequest = {
        question: versePrompt,
        maxTokens: 2000,
        language: request.language || 'ar'
      };

      const response = await GroqAIService.getSmartAnswer(aiRequest);
      console.log('📥 استلام رد من Groq AI:', response);
      
      // التحقق إذا كانت الاستجابة من AI فعلاً أم من النظام الاحتياطي
      if (response.isFromAI && response.confidence > 0.7) {
        console.log('✅ تم الحصول على استجابة AI صحيحة!');
        
        // محاولة تحليل الاستجابة كـ JSON للآية
        const parsed = this.parseAIResponse(response.answer);
        
        if (parsed && parsed.verse && parsed.verse.arabic) {
          console.log('✅ تم تحليل استجابة AI بنجاح - آية صحيحة');
          
          return {
            verse: {
              arabic: parsed.verse.arabic,
              translation: parsed.verse.translation || 'ترجمة الآية الكريمة',
              surah: parsed.verse.surah || 'القرآن الكريم',
              ayah: parsed.verse.ayah || 1,
              reference: parsed.verse.reference || `${parsed.verse.surah || 'القرآن الكريم'}: ${parsed.verse.ayah || 1}`
            },
            explanation: parsed.explanation || response.answer,
            reflection: parsed.reflection || 'تأمل في عظمة هذه الآية واجعلها نوراً في قلبك',
            practicalAdvice: parsed.practicalAdvice || 'اقرأ هذه الآية بتدبر واستشعر معانيها العميقة',
            relatedTopics: parsed.relatedTopics || ['تدبر القرآن', 'السكينة', 'الإيمان'],
            confidence: 0.95, // ثقة عالية لأنها من AI
            sentiment: sentimentAnalysis.sentiment,
            emotionalCategory: this.categorizeEmotion(sentimentAnalysis),
            spiritualGuidance: parsed.spiritualGuidance || [
              'اقرأ القرآن يومياً بتدبر',
              'أكثر من ذكر الله في جميع الأوقات',
              'ادع الله بصدق وانكسار'
            ]
          };
        } else {
          // إذا لم نحصل على آية صحيحة، نستخدم الاستجابة العامة من AI
          console.log('⚠️ AI لم يعطي آية محددة، لكن أعطى استجابة عامة');
          
          return {
            verse: this.getDefaultVerse(),
            explanation: response.answer,
            reflection: 'استفد من هذه النصيحة واجعلها دليلاً في حياتك',
            practicalAdvice: 'طبق ما ورد في النصيحة واجعلها جزءاً من حياتك اليومية',
            relatedTopics: ['إرشاد ديني', 'نصائح روحية', 'تطوير ذاتي'],
            confidence: response.confidence,
            sentiment: sentimentAnalysis.sentiment,
            emotionalCategory: this.categorizeEmotion(sentimentAnalysis),
            spiritualGuidance: [
              'اقرأ القرآن يومياً',
              'اذكر الله كثيراً',
              'اطلب العون من الله'
            ]
          };
        }
      } else {
        // إذا لم تكن الاستجابة من AI، نرمي خطأ لننتقل للحل البديل
        throw new Error('AI_NOT_AVAILABLE');
      }
      
    } catch (aiError) {
      console.error('❌ فشل في الحصول على استجابة AI:', aiError);
      
      // تحديد نوع الخطأ
      let errorMessage = 'خطأ غير معروف';
      let detailedError = '';
      
      if (aiError instanceof Error) {
        if (aiError.message.includes('API_KEY_NOT_CONFIGURED')) {
          errorMessage = 'مفتاح Groq AI غير مُعَد أو غير صحيح';
          detailedError = '🚫 لا يمكن استخدام الذكاء الاصطناعي بدون مفتاح API صحيح';
        } else if (aiError.message.includes('API_ERROR')) {
          errorMessage = 'خطأ في API - تحقق من صحة المفتاح أو حالة الخدمة';
          detailedError = '🔑 تأكد من صحة مفتاح API أو حاول مرة أخرى لاحقاً';
        } else {
          errorMessage = aiError.message;
          detailedError = '⚠️ حدث خطأ في خدمة الذكاء الاصطناعي';
        }
      }
      
      console.log('🚫 رفض استخدام النظام المحلي - المطلوب استخدام AI فقط');
      
      // رفض العمل بدون AI - إرجاع خطأ واضح
      throw new Error(`AI_REQUIRED: ${errorMessage}. ${detailedError}\n\n📋 خطوات الحل:\n1. اذهب إلى: https://console.groq.com/keys\n2. سجل حساباً مجانياً\n3. أنشئ مفتاح API جديد\n4. أضفه في ملف .env: VITE_GROQ_API_KEY=gsk_your_real_key\n5. أعد تشغيل التطبيق\n\n✨ الذكاء الاصطناعي متاح مجاناً تماماً من Groq!`);
    }
  }

  // إنشاء prompt محسن للآيات مع تحسينات جذرية
  private static createEnhancedVersePrompt(userMood: string, sentiment: SentimentAnalysis): string {
    // تحديد نوع الحالة النفسية بدقة أكبر
    const emotionalContext = this.getDetailedEmotionalContext(userMood, sentiment);
    
    return `
أنت مرشد روحي إسلامي خبير ومتخصص في اقتراح الآيات القرآنية المناسبة للحالات النفسية المختلفة. لديك معرفة عميقة بالقرآن الكريم وتفسيره.

📋 تحليل الحالة النفسية:
- النص الأصلي: "${userMood}"
- الحالة العاطفية: ${sentiment.sentiment} 
- شدة المشاعر: ${Math.round(sentiment.intensity * 100)}%
- المشاعر المكتشفة: ${sentiment.emotions.join(', ')}
- الكلمات المفتاحية: ${sentiment.keywords.join(', ')}
- السياق النفسي: ${emotionalContext}

🎯 مهمتك الأساسية:
1. اختر آية قرآنية واحدة مناسبة تماماً لهذه الحالة النفسية المحددة
2. تأكد من أن الآية تلامس قلب الشخص وتناسب مشاعره الحالية
3. قدم شرحاً عميقاً ومؤثراً يربط الآية بالحالة النفسية
4. اقترح تدبراً عملياً يمكن تطبيقه في الحياة اليومية
5. أضف إرشادات روحية محددة وقابلة للتنفيذ

⚠️ قواعد صارمة يجب اتباعها:
- استخدم آيات صحيحة من القرآن الكريم فقط (لا تخترع آيات)
- تأكد من دقة النص العربي بالتشكيل الصحيح
- تأكد من صحة اسم السورة ورقم الآية
- اجعل الشرح مناسباً تماماً للحالة النفسية المذكورة
- استخدم لغة مؤثرة ومطمئنة ومفهومة
- ركز على الجانب العملي والتطبيقي

🔍 أمثلة للحالات النفسية والآيات المناسبة:
- الحزن والاكتئاب: آيات الصبر والتعزية مثل "وبشر الصابرين"
- القلق والخوف: آيات الطمأنينة مثل "ألا بذكر الله تطمئن القلوب"
- الشكر والامتنان: آيات الشكر مثل "لئن شكرتم لأزيدنكم"
- الضعف والحاجة: آيات القوة والتوكل مثل "ومن يتوكل على الله فهو حسبه"

📝 أجب بتنسيق JSON صحيح ومكتمل:
{
  "verse": {
    "arabic": "النص العربي الكامل للآية مع التشكيل الصحيح",
    "translation": "ترجمة مبسطة وواضحة بالعربية",
    "surah": "اسم السورة الصحيح",
    "ayah": رقم_الآية_الصحيح,
    "reference": "اسم السورة: رقم الآية"
  },
  "explanation": "شرح عميق ومؤثر للآية يربطها بالحالة النفسية المحددة",
  "reflection": "تدبر عملي وروحي يمكن تطبيقه في الحياة اليومية",
  "practicalAdvice": "نصيحة عملية محددة للاستفادة من الآية",
  "relatedTopics": ["موضوع روحي 1", "موضوع روحي 2", "موضوع روحي 3"],
  "spiritualGuidance": ["إرشاد روحي عملي 1", "إرشاد روحي عملي 2", "إرشاد روحي عملي 3"],
  "emotionalSupport": "رسالة دعم نفسي مباشرة ومطمئنة",
  "dailyPractice": "ممارسة يومية مقترحة مرتبطة بالآية"
}

تذكر: الهدف هو تقديم آية تلامس القلب وتناسب الحالة النفسية تماماً مع شرح عميق وإرشاد عملي.
`;
  }

  // تحديد السياق العاطفي بتفصيل أكبر
  private static getDetailedEmotionalContext(userMood: string, sentiment: SentimentAnalysis): string {
    const lowerText = userMood.toLowerCase();
    
    // تحليل أكثر تفصيلاً للحالة النفسية
    if (sentiment.sentiment === 'negative') {
      if (lowerText.includes('حزين') || lowerText.includes('مكتئب') || lowerText.includes('حزن')) {
        return 'حالة حزن عميق تحتاج للتعزية والصبر';
      } else if (lowerText.includes('قلق') || lowerText.includes('خوف') || lowerText.includes('توتر')) {
        return 'حالة قلق وخوف تحتاج للطمأنينة والسكينة';
      } else if (lowerText.includes('غضب') || lowerText.includes('زعل') || lowerText.includes('عصبي')) {
        return 'حالة غضب تحتاج للهدوء والحكمة';
      } else if (lowerText.includes('يأس') || lowerText.includes('إحباط') || lowerText.includes('فشل')) {
        return 'حالة يأس وإحباط تحتاج للأمل والتفاؤل';
      } else {
        return 'حالة نفسية صعبة تحتاج للدعم الروحي';
      }
    } else if (sentiment.sentiment === 'positive') {
      if (lowerText.includes('شكر') || lowerText.includes('ممتن') || lowerText.includes('حمد')) {
        return 'حالة شكر وامتنان تحتاج لتعزيز الشكر';
      } else if (lowerText.includes('سعيد') || lowerText.includes('فرح') || lowerText.includes('مبسوط')) {
        return 'حالة فرح وسعادة تحتاج للحفاظ على النعمة';
      } else {
        return 'حالة إيجابية تحتاج للاستمرار والشكر';
      }
    } else {
      return 'حالة متوازنة تحتاج للإرشاد الروحي العام';
    }
  }

  // تحليل استجابة AI مع معالجة ذكية ومتقدمة
  private static parseAIResponse(response: string): any {
    console.log('🔍 محاولة تحليل استجابة AI...');
    console.log('📄 طول الاستجابة:', response.length);
    console.log('📄 الاستجابة الكاملة:', response);
    
    try {
      // تنظيف النص أولاً
      let cleanResponse = response.trim();
      
      // إزالة أي نص قبل أو بعد JSON
      const jsonStart = cleanResponse.indexOf('{');
      const jsonEnd = cleanResponse.lastIndexOf('}');
      
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        cleanResponse = cleanResponse.substring(jsonStart, jsonEnd + 1);
        console.log('✂️ تم استخراج JSON من النص');
        console.log('📄 JSON المستخرج:', cleanResponse);
      }
      
      // محاولة تحليل JSON
      const parsed = JSON.parse(cleanResponse);
      console.log('✅ تم تحليل JSON بنجاح');
      console.log('🔍 محتوى JSON المحلل:', JSON.stringify(parsed, null, 2));
      
      // التحقق من وجود البيانات المطلوبة بطرق متعددة
      if (parsed.verse && parsed.verse.arabic) {
        console.log('✅ البيانات المطلوبة موجودة - البنية الأساسية');
        return parsed;
      } else if (parsed.arabic || parsed.ayah || parsed.surah || parsed.verse_text) {
        console.log('✅ وجدت بنية بديلة، تحويلها...');
        return this.convertAlternativeStructure(parsed);
      } else {
        console.warn('⚠️ البيانات المطلوبة غير موجودة في JSON، استخراج من النص...');
        return this.extractDataFromText(response);
      }
      
    } catch (error) {
      console.warn('❌ فشل تحليل JSON، محاولة استخراج البيانات من النص...');
      console.log('❌ تفاصيل الخطأ:', error);
      console.log('📄 النص الأصلي للمعالجة:', response);
      return this.extractDataFromText(response);
    }
  }

  // تحويل البنية البديلة إلى البنية المطلوبة
  private static convertAlternativeStructure(parsed: any): any {
    console.log('🔄 تحويل البنية البديلة...');
    
    try {
      const result = {
        verse: {
          arabic: parsed.arabic || parsed.ayah || parsed.verse_text || '',
          translation: parsed.translation || parsed.meaning || 'ترجمة الآية الكريمة',
          surah: parsed.surah || parsed.surah_name || 'القرآن الكريم',
          ayah: parsed.ayah_number || parsed.verse_number || 1,
          reference: `${parsed.surah || 'القرآن الكريم'}: ${parsed.ayah_number || 1}`
        },
        explanation: parsed.explanation || parsed.tafsir || parsed.meaning || 'هذه آية كريمة من القرآن الكريم تناسب حالتك النفسية',
        reflection: parsed.reflection || parsed.tadabbur || parsed.contemplation || 'تأمل في عظمة هذه الآية واجعلها نوراً في قلبك',
        practicalAdvice: parsed.practicalAdvice || parsed.advice || parsed.guidance || 'اقرأ هذه الآية بتدبر واستشعر معانيها العميقة',
        relatedTopics: parsed.relatedTopics || parsed.topics || ['تدبر القرآن', 'السكينة', 'الإيمان'],
        spiritualGuidance: parsed.spiritualGuidance || parsed.guidance || [
          'اقرأ القرآن يومياً بتدبر',
          'أكثر من ذكر الله في جميع الأوقات',
          'ادع الله بصدق وانكسار'
        ]
      };
      
      console.log('✅ تم تحويل البنية البديلة بنجاح');
      return result;
    } catch (conversionError) {
      console.error('❌ فشل في تحويل البنية البديلة:', conversionError);
      return null;
    }
  }

  // استخراج البيانات من النص العادي
  private static extractDataFromText(response: string): any {
    console.log('🔍 استخراج البيانات من النص العادي...');
    
    try {
      // البحث عن الآية في النص
      const versePatterns = [
        /آية[:\s]*([^\.]+)/i,
        /القرآن[:\s]*([^\.]+)/i,
        /﴿([^﴾]+)﴾/,
        /"([^"]*وَ[^"]*)"/, // البحث عن نص يحتوي على "وَ" (علامة آية قرآنية)
        /'([^']*وَ[^']*)'/,
        /([^\.]*وَ[^\.]*الله[^\.]*)/i
      ];
      
      let verseText = '';
      for (const pattern of versePatterns) {
        const match = response.match(pattern);
        if (match && match[1] && match[1].length > 20) {
          verseText = match[1].trim();
          console.log('✅ تم العثور على نص الآية:', verseText.substring(0, 50) + '...');
          break;
        }
      }
      
      // البحث عن اسم السورة
      const surahPatterns = [
        /سورة\s+([^\s\d]+)/i,
        /([^\s]+):\s*\d+/,
        /(البقرة|آل عمران|النساء|المائدة|الأنعام|الأعراف|الأنفال|التوبة|يونس|هود|يوسف|الرعد|إبراهيم|الحجر|النحل|الإسراء|الكهف|مريم|طه|الأنبياء|الحج|المؤمنون|النور|الفرقان|الشعراء|النمل|القصص|العنكبوت|الروم|لقمان|السجدة|الأحزاب|سبأ|فاطر|يس|الصافات|ص|الزمر|غافر|فصلت|الشورى|الزخرف|الدخان|الجاثية|الأحقاف|محمد|الفتح|الحجرات|ق|الذاريات|الطور|النجم|القمر|الرحمن|الواقعة|الحديد|المجادلة|الحشر|الممتحنة|الصف|الجمعة|المنافقون|التغابن|الطلاق|التحريم|الملك|القلم|الحاقة|المعارج|نوح|الجن|المزمل|المدثر|القيامة|الإنسان|المرسلات|النبأ|النازعات|عبس|التكوير|الانفطار|المطففين|الانشقاق|البروج|الطارق|الأعلى|الغاشية|الفجر|البلد|الشمس|الليل|الضحى|الشرح|التين|العلق|القدر|البينة|الزلزلة|العاديات|القارعة|التكاثر|العصر|الهمزة|الفيل|قريش|الماعون|الكوثر|الكافرون|النصر|المسد|الإخلاص|الفلق|الناس)/i
      ];
      
      let surahName = 'القرآن الكريم';
      let ayahNumber = 1;
      
      for (const pattern of surahPatterns) {
        const match = response.match(pattern);
        if (match && match[1]) {
          surahName = match[1].trim();
          
          // البحث عن رقم الآية
          const ayahMatch = response.match(new RegExp(surahName + '[:\\s]*([\\d]+)', 'i'));
          if (ayahMatch && ayahMatch[1]) {
            ayahNumber = parseInt(ayahMatch[1]);
          }
          break;
        }
      }
      
      // البحث عن الشرح
      const explanationPatterns = [
        /شرح[:\s]*([^\.]+)/i,
        /تفسير[:\s]*([^\.]+)/i,
        /معنى[:\s]*([^\.]+)/i
      ];
      
      let explanation = 'هذه آية كريمة من القرآن الكريم تناسب حالتك النفسية';
      for (const pattern of explanationPatterns) {
        const match = response.match(pattern);
        if (match && match[1] && match[1].length > 10) {
          explanation = match[1].trim();
          break;
        }
      }
      
      // البحث عن التدبر
      const reflectionPatterns = [
        /تدبر[:\s]*([^\.]+)/i,
        /تأمل[:\s]*([^\.]+)/i,
        /تفكر[:\s]*([^\.]+)/i
      ];
      
      let reflection = 'تأمل في عظمة هذه الآية واجعلها نوراً في قلبك';
      for (const pattern of reflectionPatterns) {
        const match = response.match(pattern);
        if (match && match[1] && match[1].length > 10) {
          reflection = match[1].trim();
          break;
        }
      }
      
      // إذا لم نجد آية، استخدم آية افتراضية
      if (!verseText || verseText.length < 20) {
        console.warn('⚠️ لم يتم العثور على آية في النص، استخدام آية افتراضية');
        const defaultVerse = this.getDefaultVerse();
        verseText = defaultVerse.arabic;
        surahName = defaultVerse.surah;
        ayahNumber = defaultVerse.ayah;
      }
      
      const result = {
        verse: {
          arabic: verseText,
          translation: 'ترجمة مبسطة للآية الكريمة',
          surah: surahName,
          ayah: ayahNumber,
          reference: `${surahName}: ${ayahNumber}`
        },
        explanation: explanation,
        reflection: reflection,
        practicalAdvice: 'اقرأ هذه الآية بتدبر واستشعر معانيها العميقة',
        relatedTopics: ['تدبر القرآن', 'السكينة', 'الإيمان'],
        spiritualGuidance: [
          'اقرأ القرآن يومياً بتدبر',
          'أكثر من ذكر الله في جميع الأوقات',
          'ادع الله بصدق وانكسار'
        ]
      };
      
      console.log('✅ تم استخراج البيانات من النص بنجاح');
      return result;
      
    } catch (error) {
      console.error('❌ فشل في استخراج البيانات من النص:', error);
      return null;
    }
  }

  // الحصول على آية افتراضية
  private static getDefaultVerse() {
    return {
      arabic: 'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا ۝ وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ',
      translation: 'ومن يتق الله يجعل له مخرجاً ويرزقه من حيث لا يحتسب',
      surah: 'الطلاق',
      ayah: 2,
      reference: 'الطلاق: 2-3'
    };
  }

  // تحليل الاستجابة النصية عند فشل JSON
  private static parseTextResponse(response: string, sentiment: SentimentAnalysis): SmartVerseResponse {
    console.log('🔄 تحليل الاستجابة النصية...');
    
    // استخراج الآية من النص
    const verseMatch = response.match(/آية[:\s]*([^\.]+)/i);
    const explanationMatch = response.match(/شرح[:\s]*([^\.]+)/i);
    const reflectionMatch = response.match(/تدبر[:\s]*([^\.]+)/i);
    
    const defaultVerse = this.getDefaultVerse();
    
    return {
      verse: defaultVerse,
      explanation: explanationMatch?.[1]?.trim() || 'هذه آية كريمة من القرآن الكريم تناسب حالتك النفسية الحالية',
      reflection: reflectionMatch?.[1]?.trim() || 'تأمل في عظمة هذه الآية واجعلها نوراً ينير طريقك في الحياة',
      practicalAdvice: 'اقرأ هذه الآية بتدبر واستشعر معانيها العميقة، واجعلها جزءاً من أذكارك اليومية',
      relatedTopics: ['تقوى الله', 'التوكل', 'الرزق', 'الفرج'],
      confidence: 0.85,
      sentiment: sentiment.sentiment,
      emotionalCategory: this.categorizeEmotion(sentiment),
      spiritualGuidance: [
        'اقرأ القرآن يومياً بتدبر وتأمل',
        'أكثر من ذكر الله في جميع الأوقات',
        'ادع الله بصدق وانكسار واستغفر كثيراً'
      ]
    };
  }

  // إنشاء prompt متخصص للآيات (الدالة القديمة)
  private static createVersePrompt(userMood: string, sentiment: SentimentAnalysis): string {
    return `
أنت مرشد روحي إسلامي متخصص في اقتراح الآيات القرآنية المناسبة للحالات النفسية المختلفة.

الحالة النفسية للمستخدم: "${userMood}"
تحليل المشاعر: ${sentiment.sentiment} (شدة: ${sentiment.intensity})
المشاعر المكتشفة: ${sentiment.emotions.join(', ')}

مهمتك:
1. اختر آية قرآنية مناسبة تماماً لهذه الحالة النفسية
2. قدم شرحاً مبسطاً ومؤثراً
3. اقترح تدبراً عملياً يمكن تطبيقه
4. أضف نصائح روحية عملية

قواعد مهمة:
- اختر آيات صحيحة من القرآن الكريم فقط
- تأكد من دقة النص العربي والمرجع
- اجعل الشرح مناسباً للحالة النفسية
- قدم نصائح عملية قابلة للتطبيق
- استخدم لغة مؤثرة ومطمئنة

أجب بتنسيق JSON كالتالي:
{
  "verse": {
    "arabic": "النص العربي الكامل للآية",
    "translation": "ترجمة مبسطة بالعربية",
    "surah": "اسم السورة",
    "ayah": رقم_الآية,
    "reference": "اسم السورة: رقم الآية"
  },
  "explanation": "شرح مبسط ومؤثر للآية يناسب الحالة النفسية",
  "reflection": "تدبر عملي وروحي للآية",
  "practicalAdvice": "نصيحة عملية للاستفادة من الآية",
  "relatedTopics": ["موضوع1", "موضوع2", "موضوع3"],
  "spiritualGuidance": ["إرشاد روحي 1", "إرشاد روحي 2", "إرشاد روحي 3"],
  "emotionalSupport": "رسالة دعم نفسي مناسبة للحالة",
  "dailyPractice": "ممارسة يومية مقترحة"
}
`;
  }

  // تصنيف المشاعر
  private static categorizeEmotion(sentiment: SentimentAnalysis): string {
    if (sentiment.sentiment === 'positive') {
      return 'شكر وامتنان';
    } else if (sentiment.sentiment === 'negative') {
      if (sentiment.emotions.some(e => e.includes('حزن') || e.includes('اكتئاب'))) {
        return 'حزن وحاجة للتعزية';
      } else if (sentiment.emotions.some(e => e.includes('قلق') || e.includes('خوف'))) {
        return 'قلق وحاجة للطمأنينة';
      } else {
        return 'تحدي نفسي';
      }
    } else {
      return 'حالة متوازنة';
    }
  }

  // توصية احتياطية للآيات
  private static getFallbackVerseRecommendation(
    request: SmartVerseRequest, 
    sentiment?: SentimentAnalysis
  ): SmartVerseResponse {
    // قاعدة بيانات آيات احتياطية
    const fallbackVerses = {
      positive: {
        verse: {
          arabic: 'وَإِذْ تَأَذَّنَ رَبُّكُمْ لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ ۖ وَلَئِن كَفَرْتُمْ إِنَّ عَذَابِي لَشَدِيدٌ',
          translation: 'وإذ تأذن ربكم لئن شكرتم لأزيدنكم ولئن كفرتم إن عذابي لشديد',
          surah: 'إبراهيم',
          ayah: 7,
          reference: 'إبراهيم: 7'
        },
        explanation: 'الشكر يزيد النعم، وهو سبب في المزيد من فضل الله وكرمه',
        reflection: 'اشكر الله على كل نعمة صغيرة وكبيرة واستشعر البركة في حياتك'
      },
      negative: {
        verse: {
          arabic: 'وَبَشِّرِ الصَّابِرِينَ ۝ الَّذِينَ إِذَا أَصَابَتْهُم مُّصِيبَةٌ قَالُوا إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ',
          translation: 'وبشر الصابرين الذين إذا أصابتهم مصيبة قالوا إنا لله وإنا إليه راجعون',
          surah: 'البقرة',
          ayah: 156,
          reference: 'البقرة: 156'
        },
        explanation: 'الصبر على البلاء من صفات المؤمنين، وكل ما يصيبنا هو من قدر الله',
        reflection: 'عندما تشعر بالحزن، تذكر أن هذا الابتلاء مؤقت وأن الله معك'
      },
      neutral: {
        verse: {
          arabic: 'الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ اللَّهِ ۗ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
          translation: 'الذين آمنوا وتطمئن قلوبهم بذكر الله ألا بذكر الله تطمئن القلوب',
          surah: 'الرعد',
          ayah: 28,
          reference: 'الرعد: 28'
        },
        explanation: 'ذكر الله هو الدواء الشافي للقلوب المضطربة والنفوس القلقة',
        reflection: 'اجعل لسانك رطباً بذكر الله وستجد السكينة تملأ قلبك'
      }
    };

    const category = sentiment?.sentiment || 'neutral';
    const selectedVerse = fallbackVerses[category];

    return {
      verse: selectedVerse.verse,
      explanation: selectedVerse.explanation,
      reflection: selectedVerse.reflection,
      practicalAdvice: 'اقرأ هذه الآية بتدبر واجعلها نوراً في قلبك',
      relatedTopics: ['تدبر', 'سكينة', 'إيمان'],
      confidence: 0.7,
      sentiment: sentiment?.sentiment || 'neutral',
      emotionalCategory: sentiment ? this.categorizeEmotion(sentiment) : 'حالة عامة',
      spiritualGuidance: [
        'اقرأ القرآن يومياً',
        'أكثر من ذكر الله',
        'ادع الله بصدق'
      ]
    };
  }

  // فحص حالة الخدمة
  public static async checkServiceHealth(): Promise<boolean> {
    try {
      const testRequest: SmartVerseRequest = {
        userMood: 'أشعر بالحمد لله',
        includeAnalysis: false
      };
      
      const response = await this.getSmartVerseRecommendation(testRequest);
      return response.confidence > 0.5;
    } catch (error) {
      console.error('فشل فحص حالة خدمة الآيات الذكية:', error);
      return false;
    }
  }

  // إحصائيات الاستخدام
  public static getUsageStats(): {
    totalRequests: number;
    successfulRequests: number;
    averageConfidence: number;
    popularEmotions: string[];
  } {
    // يمكن تطوير هذا لاحقاً لتتبع الإحصائيات
    return {
      totalRequests: 0,
      successfulRequests: 0,
      averageConfidence: 0,
      popularEmotions: []
    };
  }
}

export default SmartVerseService;
