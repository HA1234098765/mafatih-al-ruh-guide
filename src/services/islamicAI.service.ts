// خدمة الذكاء الاصطناعي المتخصصة في الأسئلة الشرعية
import { SmartIslamicQAService, IslamicDatabaseService, QuranService } from './islamicDatabase.simple';
import GroqAIService, { GroqAIRequest, GroqAIResponse } from './groqAI.service';

// واجهات البيانات المتخصصة
export interface IslamicAIRequest {
  question: string;
  context?: string;
  userProfile?: {
    madhab?: string;
    level?: 'beginner' | 'intermediate' | 'advanced';
    language?: 'ar' | 'en';
  };
}

export interface IslamicAIResponse {
  answer: string;
  sources: string[];
  confidence: number;
  category: string;
  relatedQuestions: string[];
  verses?: {
    arabic: string;
    translation: string;
    reference: string;
  }[];
  hadith?: {
    text: string;
    source: string;
    grade: string;
  }[];
  scholarOpinions?: {
    scholar: string;
    opinion: string;
    source: string;
  }[];
  practicalAdvice?: string[];
  warnings?: string[];
}

// قاعدة بيانات محسنة للأسئلة الشرعية مع الذكاء الاصطناعي
const enhancedIslamicDatabase = {
  // أسئلة العقيدة
  aqeedah: [
    {
      keywords: ['أركان الإسلام', 'أركان', 'إسلام', 'خمسة'],
      answer: 'أركان الإسلام خمسة: شهادة أن لا إله إلا الله وأن محمداً رسول الله، وإقام الصلاة، وإيتاء الزكاة، وصوم رمضان، وحج البيت لمن استطاع إليه سبيلاً.',
      sources: ['صحيح البخاري', 'صحيح مسلم'],
      category: 'عقيدة',
      verses: [{
        arabic: 'وَمَا أُمِرُوا إِلَّا لِيَعْبُدُوا اللَّهَ مُخْلِصِينَ لَهُ الدِّينَ حُنَفَاءَ وَيُقِيمُوا الصَّلَاةَ وَيُؤْتُوا الزَّكَاةَ ۚ وَذَٰلِكَ دِينُ الْقَيِّمَةِ',
        translation: 'وما أمروا إلا ليعبدوا الله مخلصين له الدين حنفاء ويقيموا الصلاة ويؤتوا الزكاة وذلك دين القيمة',
        reference: 'البينة: 5'
      }],
      relatedQuestions: ['ما هي أركان الإيمان؟', 'ما الفرق بين الإسلام والإيمان؟', 'كيف أنطق الشهادتين؟']
    },
    {
      keywords: ['أركان الإيمان', 'إيمان', 'ستة'],
      answer: 'أركان الإيمان ستة: الإيمان بالله، وملائكته، وكتبه، ورسله، واليوم الآخر، والقدر خيره وشره.',
      sources: ['صحيح مسلم', 'حديث جبريل'],
      category: 'عقيدة',
      verses: [{
        arabic: 'آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ وَالْمُؤْمِنُونَ ۚ كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ',
        translation: 'آمن الرسول بما أنزل إليه من ربه والمؤمنون كل آمن بالله وملائكته وكتبه ورسله',
        reference: 'البقرة: 285'
      }],
      relatedQuestions: ['ما هي أركان الإسلام؟', 'كيف أقوي إيماني؟', 'ما هو القدر؟']
    }
  ],

  // أسئلة العبادات
  worship: [
    {
      keywords: ['وضوء', 'طهارة', 'كيف أتوضأ'],
      answer: 'الوضوء يكون بالنية أولاً، ثم التسمية، ثم غسل الكفين ثلاثاً، ثم المضمضة والاستنشاق ثلاثاً، ثم غسل الوجه ثلاثاً، ثم غسل اليدين إلى المرفقين ثلاثاً بدءاً باليمين، ثم مسح الرأس مرة واحدة، ثم غسل الرجلين إلى الكعبين ثلاثاً بدءاً باليمين.',
      sources: ['صحيح البخاري', 'صحيح مسلم', 'سنن أبي داود'],
      category: 'عبادات',
      practicalAdvice: [
        'ابدأ بالنية قبل الوضوء',
        'قل "بسم الله" عند البداية',
        'ادع بعد الوضوء: "أشهد أن لا إله إلا الله وأن محمداً عبده ورسوله"'
      ],
      relatedQuestions: ['ما هي نواقض الوضوء؟', 'كيف أتيمم؟', 'هل يجوز الوضوء بالماء البارد؟']
    },
    {
      keywords: ['صلاة', 'أوقات الصلاة', 'مواقيت'],
      answer: 'أوقات الصلوات الخمس هي: الفجر من طلوع الفجر الصادق إلى طلوع الشمس، والظهر من زوال الشمس إلى أن يصير ظل كل شيء مثله، والعصر من انتهاء وقت الظهر إلى غروب الشمس، والمغرب من غروب الشمس إلى غياب الشفق الأحمر، والعشاء من غياب الشفق الأحمر إلى منتصف الليل.',
      sources: ['صحيح البخاري', 'صحيح مسلم'],
      category: 'عبادات',
      verses: [{
        arabic: 'إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا',
        translation: 'إن الصلاة كانت على المؤمنين كتاباً موقوتاً',
        reference: 'النساء: 103'
      }],
      relatedQuestions: ['كيف أصلي؟', 'ما حكم تأخير الصلاة؟', 'كيف أقضي الصلاة الفائتة؟']
    },
    {
      keywords: ['زكاة', 'حساب الزكاة', 'نصاب'],
      answer: 'زكاة المال تجب في النقود والذهب والفضة إذا بلغت النصاب وحال عليها الحول. النصاب هو ما يعادل 85 جراماً من الذهب الخالص أو 595 جراماً من الفضة. والمقدار الواجب هو ربع العشر أي 2.5% من المال.',
      sources: ['صحيح البخاري', 'صحيح مسلم', 'سنن الترمذي'],
      category: 'عبادات',
      practicalAdvice: [
        'احسب زكاتك سنوياً في نفس التاريخ',
        'أخرج الزكاة فور وجوبها',
        'تأكد من وصولها للمستحقين'
      ],
      relatedQuestions: ['من يستحق الزكاة؟', 'كيف أحسب زكاة الذهب؟', 'هل تجب الزكاة في البيت؟']
    }
  ],

  // أسئلة الأخلاق والسلوك
  ethics: [
    {
      keywords: ['بر الوالدين', 'والدين', 'أم', 'أب'],
      answer: 'بر الوالدين من أعظم الأعمال عند الله، وهو واجب شرعي. يشمل طاعتهما في المعروف، والإحسان إليهما، والدعاء لهما، وعدم عقوقهما بالقول أو الفعل.',
      sources: ['القرآن الكريم', 'صحيح البخاري'],
      category: 'أخلاق',
      verses: [{
        arabic: 'وَقَضَىٰ رَبُّكَ أَلَّا تَعْبُدُوا إِلَّا إِيَّاهُ وَبِالْوَالِدَيْنِ إِحْسَانًا',
        translation: 'وقضى ربك ألا تعبدوا إلا إياه وبالوالدين إحساناً',
        reference: 'الإسراء: 23'
      }],
      relatedQuestions: ['كيف أبر والدي المتوفى؟', 'ما حكم طاعة الوالدين في المعصية؟', 'كيف أتعامل مع والدي الغاضب؟']
    }
  ],

  // أسئلة المعاملات
  transactions: [
    {
      keywords: ['ربا', 'فوائد', 'بنك', 'قرض'],
      answer: 'الربا محرم في الإسلام تحريماً قطعياً، وهو من الكبائر. يشمل ربا الفضل وربا النسيئة. الفوائد البنكية من الربا المحرم.',
      sources: ['القرآن الكريم', 'صحيح البخاري', 'صحيح مسلم'],
      category: 'معاملات',
      verses: [{
        arabic: 'وَأَحَلَّ اللَّهُ الْبَيْعَ وَحَرَّمَ الرِّبَا',
        translation: 'وأحل الله البيع وحرم الربا',
        reference: 'البقرة: 275'
      }],
      warnings: ['تجنب جميع أنواع الربا', 'ابحث عن البدائل الشرعية'],
      relatedQuestions: ['ما هي البدائل الشرعية للربا؟', 'حكم شراء البيت بالتقسيط؟', 'ما هو البيع بالتقسيط؟']
    }
  ]
};

// خدمة الذكاء الاصطناعي المتخصصة
export class IslamicAIService {
  
  // تحليل السؤال وتصنيفه
  static analyzeQuestion(question: string): {
    category: string;
    keywords: string[];
    intent: string;
    complexity: 'simple' | 'moderate' | 'complex';
  } {
    const lowerQuestion = question.toLowerCase();
    
    // استخراج الكلمات المفتاحية
    const keywords = lowerQuestion.split(' ').filter(word => word.length > 2);
    
    // تحديد الفئة
    let category = 'عام';
    let complexity: 'simple' | 'moderate' | 'complex' = 'simple';
    
    // فئات العقيدة
    if (keywords.some(k => ['أركان', 'إيمان', 'إسلام', 'توحيد', 'شرك'].includes(k))) {
      category = 'عقيدة';
    }
    // فئات العبادات
    else if (keywords.some(k => ['صلاة', 'وضوء', 'زكاة', 'صوم', 'حج', 'عمرة'].includes(k))) {
      category = 'عبادات';
    }
    // فئات الأخلاق
    else if (keywords.some(k => ['أخلاق', 'والدين', 'صدق', 'أمانة', 'بر'].includes(k))) {
      category = 'أخلاق';
    }
    // فئات المعاملات
    else if (keywords.some(k => ['ربا', 'بيع', 'شراء', 'تجارة', 'مال'].includes(k))) {
      category = 'معاملات';
    }
    
    // تحديد مستوى التعقيد
    if (keywords.length > 10 || lowerQuestion.includes('تفصيل') || lowerQuestion.includes('شرح مفصل')) {
      complexity = 'complex';
    } else if (keywords.length > 5 || lowerQuestion.includes('كيف') || lowerQuestion.includes('لماذا')) {
      complexity = 'moderate';
    }
    
    // تحديد النية
    let intent = 'seeking_knowledge';
    if (lowerQuestion.includes('كيف')) intent = 'seeking_guidance';
    else if (lowerQuestion.includes('حكم')) intent = 'seeking_ruling';
    else if (lowerQuestion.includes('هل يجوز')) intent = 'seeking_permission';
    
    return { category, keywords, intent, complexity };
  }
  
  // البحث الذكي في قاعدة البيانات المحسنة
  static searchEnhancedDatabase(question: string, analysis: any): any | null {
    const categories = [
      enhancedIslamicDatabase.aqeedah,
      enhancedIslamicDatabase.worship,
      enhancedIslamicDatabase.ethics,
      enhancedIslamicDatabase.transactions
    ].flat();
    
    // البحث بالكلمات المفتاحية
    for (const entry of categories) {
      const matchScore = entry.keywords.filter(keyword => 
        analysis.keywords.some(qKeyword => 
          qKeyword.includes(keyword) || keyword.includes(qKeyword)
        )
      ).length;
      
      if (matchScore > 0) {
        return {
          ...entry,
          matchScore,
          confidence: Math.min(0.95, 0.6 + (matchScore * 0.1))
        };
      }
    }
    
    return null;
  }
  
  // الحصول على إجابة ذكية محسنة
  static async getEnhancedAnswer(request: IslamicAIRequest): Promise<IslamicAIResponse> {
    try {
      // 1. تحليل السؤال
      const analysis = this.analyzeQuestion(request.question);
      
      // 2. البحث في قاعدة البيانات المحسنة
      const enhancedResult = this.searchEnhancedDatabase(request.question, analysis);
      
      if (enhancedResult && enhancedResult.confidence > 0.8) {
        return {
          answer: enhancedResult.answer,
          sources: enhancedResult.sources || ['قاعدة البيانات الشرعية'],
          confidence: enhancedResult.confidence,
          category: enhancedResult.category,
          relatedQuestions: enhancedResult.relatedQuestions || [],
          verses: enhancedResult.verses || [],
          hadith: enhancedResult.hadith || [],
          practicalAdvice: enhancedResult.practicalAdvice || [],
          warnings: enhancedResult.warnings || []
        };
      }
      
      // 3. استخدام Groq AI للحصول على إجابة ذكية
      try {
        const groqRequest: GroqAIRequest = {
          question: request.question,
          context: request.context,
          language: request.userProfile?.language || 'ar',
          maxTokens: 1500
        };
        
        const groqResponse: GroqAIResponse = await GroqAIService.getSmartAnswer(groqRequest);
        
        if (groqResponse.confidence > 0.6) {
          // إثراء الإجابة بالآيات والأحاديث من قاعدة البيانات المحلية
          let relatedVerses: any[] = [];
          try {
            const verses = await QuranService.searchVerses(request.question);
            relatedVerses = verses.slice(0, 2).map(verse => ({
              arabic: verse.arabic_text,
              translation: verse.translation,
              reference: `${verse.surah_name}: ${verse.ayah_number}`
            }));
          } catch (verseError) {
            console.warn('فشل في جلب الآيات:', verseError);
          }
          
          return {
            answer: groqResponse.answer,
            sources: [...groqResponse.sources, 'الذكاء الاصطناعي المتخصص'],
            confidence: groqResponse.confidence,
            category: groqResponse.category,
            relatedQuestions: groqResponse.relatedQuestions,
            verses: relatedVerses,
            hadith: [],
            practicalAdvice: this.generatePracticalAdvice(groqResponse.category),
            warnings: this.generateWarnings(groqResponse.category)
          };
        }
      } catch (groqError) {
        console.warn('فشل في استخدام Groq AI، التبديل للخدمة الأساسية:', groqError);
      }
      
      // 4. البحث في الخدمة الذكية الأساسية كبديل
      const basicResult = await SmartIslamicQAService.getSmartAnswer(request.question);
      
      if (basicResult.confidence > 0.5) {
        // إثراء الإجابة بالآيات والأحاديث
        let relatedVerses: any[] = [];
        try {
          const verses = await QuranService.searchVerses(request.question);
          relatedVerses = verses.slice(0, 2).map(verse => ({
            arabic: verse.arabic_text,
            translation: verse.translation,
            reference: `${verse.surah_name}: ${verse.ayah_number}`
          }));
        } catch (verseError) {
          console.warn('فشل في جلب الآيات:', verseError);
        }
        
        const relatedQuestions = await this.generateRelatedQuestions(request.question, analysis);
        
        return {
          answer: basicResult.answer,
          sources: basicResult.sources,
          confidence: basicResult.confidence,
          category: basicResult.category,
          relatedQuestions,
          verses: relatedVerses,
          hadith: [],
          practicalAdvice: this.generatePracticalAdvice(analysis.category),
          warnings: this.generateWarnings(analysis.category)
        };
      }
      
      // 5. إجابة افتراضية محسنة
      return {
        answer: this.generateDefaultAnswer(analysis),
        sources: ['نصائح عامة'],
        confidence: 0.4,
        category: analysis.category,
        relatedQuestions: await this.generateRelatedQuestions(request.question, analysis),
        verses: [],
        hadith: [],
        practicalAdvice: this.generatePracticalAdvice(analysis.category),
        warnings: ['يُنصح بمراجعة عالم مختص للتأكد من الفتوى']
      };
      
    } catch (error) {
      console.error('خطأ في الحصول على إجابة محسنة:', error);
      
      return {
        answer: 'حدث خطأ في معالجة سؤالك. يرجى المحاولة مرة أخرى أو مراجعة عالم مختص.',
        sources: [],
        confidence: 0.0,
        category: 'خطأ',
        relatedQuestions: [],
        verses: [],
        hadith: [],
        practicalAdvice: [],
        warnings: ['حدث خطأ تقني']
      };
    }
  }
  
  // توليد أسئلة ذات صلة
  static async generateRelatedQuestions(question: string, analysis: any): Promise<string[]> {
    const relatedQuestions: Record<string, string[]> = {
      'عقيدة': [
        'ما هي أركان الإسلام؟',
        'ما هي أركان الإيمان؟',
        'كيف أقوي إيماني؟',
        'ما الفرق بين الإسلام والإيمان؟'
      ],
      'عبادات': [
        'كيف أصلي الصلاة الصحيحة؟',
        'ما هي أوقات الصلاة؟',
        'كيف أحسب الزكاة؟',
        'ما هي آداب الوضوء؟'
      ],
      'أخلاق': [
        'كيف أبر والدي؟',
        'ما هي آداب التعامل مع الناس؟',
        'كيف أكون صادقاً؟',
        'ما هي حقوق الجار؟'
      ],
      'معاملات': [
        'ما حكم الربا؟',
        'كيف أتاجر بطريقة حلال؟',
        'ما هي البدائل الشرعية للربا؟',
        'حكم البيع والشراء؟'
      ],
      'عام': [
        'كيف أتقرب إلى الله؟',
        'ما هي الأعمال المستحبة؟',
        'كيف أستغفر الله؟',
        'ما فضل قراءة القرآن؟'
      ]
    };

    return relatedQuestions[analysis.category] || relatedQuestions['عام'];
  }

  // توليد نصائح عملية
  static generatePracticalAdvice(category: string): string[] {
    const advice: Record<string, string[]> = {
      'عقيدة': [
        'اقرأ القرآن بتدبر يومياً',
        'أكثر من الذكر والتسبيح',
        'تعلم أسماء الله الحسنى',
        'ادع الله في كل وقت'
      ],
      'عبادات': [
        'حافظ على الصلوات الخمس في وقتها',
        'اقرأ القرآن يومياً',
        'أكثر من الاستغفار',
        'احرص على النوافل'
      ],
      'أخلاق': [
        'تعامل مع الناس بالحسنى',
        'اصدق في جميع أقوالك',
        'ساعد المحتاجين',
        'اعف عمن ظلمك'
      ],
      'معاملات': [
        'تجنب الربا والغش',
        'كن أميناً في التجارة',
        'أوف بالعقود والوعود',
        'ابحث عن الحلال دائماً'
      ],
      'عام': [
        'اتق الله في السر والعلن',
        'أكثر من الأعمال الصالحة',
        'تعلم دينك من مصادر موثوقة',
        'اصحب الصالحين'
      ]
    };

    return advice[category] || advice['عام'];
  }

  // توليد تحذيرات
  static generateWarnings(category: string): string[] {
    const warnings: Record<string, string[]> = {
      'عقيدة': [
        'احذر من الشرك بالله',
        'لا تتبع البدع في الدين',
        'تعلم العقيدة الصحيحة'
      ],
      'عبادات': [
        'لا تؤخر الصلاة عن وقتها',
        'تأكد من صحة وضوئك',
        'احرص على الطهارة'
      ],
      'أخلاق': [
        'لا تكذب أو تغش',
        'احذر من عقوق الوالدين',
        'تجنب الغيبة والنميمة'
      ],
      'معاملات': [
        'احذر من الربا والغش',
        'لا تأكل أموال الناس بالباطل',
        'تجنب المعاملات المشبوهة'
      ],
      'عام': [
        'يُنصح بمراجعة عالم مختص',
        'تأكد من صحة المعلومة',
        'لا تفت بغير علم'
      ]
    };

    return warnings[category] || warnings['عام'];
  }

  // توليد إجابة افتراضية
  static generateDefaultAnswer(analysis: any): string {
    const defaultAnswers: Record<string, string> = {
      'عقيدة': 'هذا سؤال مهم في العقيدة الإسلامية. أنصحك بمراجعة كتب العقيدة الصحيحة أو استشارة عالم مختص للحصول على إجابة دقيقة ومفصلة.',
      'عبادات': 'هذا سؤال يتعلق بالعبادات في الإسلام. للحصول على إجابة صحيحة ومفصلة، يُنصح بمراجعة كتب الفقه أو استشارة عالم مختص.',
      'أخلاق': 'هذا سؤال مهم في الأخلاق الإسلامية. الإسلام يحث على مكارم الأخلاق والتعامل الحسن. أنصحك بمراجعة المصادر الشرعية الموثوقة.',
      'معاملات': 'هذا سؤال يتعلق بالمعاملات المالية في الإسلام. للتأكد من الحكم الشرعي الصحيح، يُنصح بمراجعة عالم مختص في الفقه المالي.',
      'عام': 'هذا سؤال مهم في الدين الإسلامي. للحصول على إجابة دقيقة وموثوقة، أنصحك بمراجعة المصادر الشرعية المعتمدة أو استشارة عالم مختص.'
    };

    return defaultAnswers[analysis.category] || defaultAnswers['عام'];
  }

  // تقييم جودة الإجابة
  static evaluateAnswerQuality(answer: string, question: string): number {
    let score = 0.5; // نقطة البداية

    // طول الإجابة
    if (answer.length > 100) score += 0.1;
    if (answer.length > 300) score += 0.1;

    // وجود مراجع
    if (answer.includes('صحيح البخاري') || answer.includes('صحيح مسلم')) score += 0.2;
    if (answer.includes('القرآن الكريم')) score += 0.2;

    // تطابق الكلمات المفتاحية
    const questionWords = question.toLowerCase().split(' ');
    const answerWords = answer.toLowerCase().split(' ');
    const matchingWords = questionWords.filter(word => answerWords.includes(word));
    score += (matchingWords.length / questionWords.length) * 0.2;

    return Math.min(1.0, score);
  }
}

// تصدير الخدمة
export default IslamicAIService;
