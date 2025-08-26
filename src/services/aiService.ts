// خدمة الذكاء الاصطناعي المتقدمة
const AI_API_KEY = 'A3rTgxpuMqlgK9xpPtNjMY8OzXNPjnPpfmWAfnxZ';
// استخدام خدمة محاكاة محلية للتطوير
const AI_BASE_URL = 'https://jsonplaceholder.typicode.com'; // خدمة محاكاة للاختبار
const USE_REAL_AI = false; // تغيير إلى true عند توفر خدمة AI حقيقية

// واجهات البيانات
export interface AIAnalysisRequest {
  text: string;
  task: 'sentiment' | 'classification' | 'intent' | 'summarization' | 'verse_recommendation';
  context?: string;
}

export interface AIAnalysisResponse {
  success: boolean;
  data: {
    sentiment?: 'positive' | 'negative' | 'neutral' | 'mixed';
    classification?: string;
    intent?: string;
    summary?: string;
    confidence: number;
    recommendations?: string[];
  };
  error?: string;
}

export interface VerseRecommendationRequest {
  userMood: string;
  context?: string;
  previousVerses?: string[];
}

export interface VerseRecommendationResponse {
  verse: {
    arabic: string;
    translation: string;
    surah: string;
    ayah: number;
    reference: string;
  };
  explanation: string;
  reflection: string;
  practicalAdvice: string;
  relatedTopics: string[];
  confidence: number;
}

// تحليل المشاعر والحالة النفسية
export const analyzeSentiment = async (text: string): Promise<AIAnalysisResponse> => {
  // محاكاة تأخير الشبكة للواقعية
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (USE_REAL_AI) {
    try {
      const response = await fetch(`${AI_BASE_URL}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AI_API_KEY}`,
        },
        body: JSON.stringify({
          text,
          task: 'sentiment',
          language: 'ar'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: {
          sentiment: data.sentiment || 'neutral',
          confidence: data.confidence || 0.5,
          recommendations: data.recommendations || []
        }
      };
    } catch (error) {
      console.error('خطأ في تحليل المشاعر:', error);
    }
  }

  // استخدام التحليل المحلي المحسن
  const localAnalysis = analyzeTextLocally(text);
  return {
    success: true,
    data: localAnalysis,
    error: undefined
  };
};

// تصنيف النص وتحديد النية
export const classifyText = async (text: string): Promise<AIAnalysisResponse> => {
  // محاكاة تأخير الشبكة
  await new Promise(resolve => setTimeout(resolve, 800));

  if (USE_REAL_AI) {
    try {
      const response = await fetch(`${AI_BASE_URL}/classify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AI_API_KEY}`,
        },
        body: JSON.stringify({
          text,
          task: 'classification',
          categories: ['spiritual', 'emotional', 'practical', 'religious', 'personal'],
          language: 'ar'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: {
          classification: data.category || 'general',
          intent: data.intent || 'seeking_guidance',
          confidence: data.confidence || 0.5
        }
      };
    } catch (error) {
      console.error('خطأ في تصنيف النص:', error);
    }
  }

  // استخدام التصنيف المحلي المحسن
  const localClassification = classifyTextLocally(text);
  return {
    success: true,
    data: localClassification,
    error: undefined
  };
};

// اقتراح آية ذكي باستخدام AI
export const getSmartVerseRecommendation = async (
  request: VerseRecommendationRequest
): Promise<VerseRecommendationResponse> => {
  // محاكاة تأخير المعالجة
  await new Promise(resolve => setTimeout(resolve, 1500));

  if (USE_REAL_AI) {
    try {
      // تحليل النص أولاً
      const [sentimentAnalysis, textClassification] = await Promise.all([
        analyzeSentiment(request.userMood),
        classifyText(request.userMood)
      ]);

      const response = await fetch(`${AI_BASE_URL}/recommend-verse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AI_API_KEY}`,
        },
        body: JSON.stringify({
          userMood: request.userMood,
          sentiment: sentimentAnalysis.data.sentiment,
          classification: textClassification.data.classification,
          intent: textClassification.data.intent,
          context: request.context,
          previousVerses: request.previousVerses,
          language: 'ar'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        verse: {
          arabic: data.verse.arabic,
          translation: data.verse.translation,
          surah: data.verse.surah,
          ayah: data.verse.ayah,
          reference: data.verse.reference
        },
        explanation: data.explanation,
        reflection: data.reflection,
        practicalAdvice: data.practicalAdvice,
        relatedTopics: data.relatedTopics || [],
        confidence: data.confidence || 0.7
      };
    } catch (error) {
      console.error('خطأ في اقتراح الآية الذكي:', error);
    }
  }

  // استخدام النظام المحلي المحسن
  return getLocalVerseRecommendation(request);
};

// تلخيص النص
export const summarizeText = async (text: string): Promise<string> => {
  try {
    const response = await fetch(`${AI_BASE_URL}/summarize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_API_KEY}`,
      },
      body: JSON.stringify({
        text,
        maxLength: 200,
        language: 'ar'
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.summary || text.substring(0, 200) + '...';
  } catch (error) {
    console.error('خطأ في تلخيص النص:', error);
    return text.substring(0, 200) + '...';
  }
};

// تحليل محلي محسن للنصوص العربية
const analyzeTextLocally = (text: string) => {
  const lowerText = text.toLowerCase();

  // كلمات إيجابية موسعة
  const positiveWords = [
    'سعيد', 'ممتن', 'شكر', 'فرح', 'راض', 'مطمئن', 'محب', 'مبسوط',
    'مرتاح', 'هادئ', 'متفائل', 'مسرور', 'بخير', 'الحمد', 'نعمة',
    'بركة', 'توفيق', 'نجاح', 'إنجاز', 'فوز', 'خير', 'جميل'
  ];

  // كلمات سلبية موسعة
  const negativeWords = [
    'حزين', 'مكتئب', 'قلق', 'خائف', 'غاضب', 'يائس', 'متوتر', 'زعلان',
    'مضايق', 'متعب', 'مرهق', 'محبط', 'مهموم', 'مشغول', 'ضايق',
    'صعب', 'مشكلة', 'أزمة', 'ضغط', 'ألم', 'وجع', 'مرض'
  ];

  // كلمات روحانية
  const spiritualWords = [
    'صلاة', 'دعاء', 'ذكر', 'قرآن', 'استغفار', 'تسبيح', 'حمد',
    'الله', 'ربي', 'إيمان', 'توبة', 'هداية', 'بركة', 'رحمة'
  ];

  const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
  const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
  const spiritualCount = spiritualWords.filter(word => lowerText.includes(word)).length;

  let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
  if (positiveCount > negativeCount) {
    sentiment = 'positive';
  } else if (negativeCount > positiveCount) {
    sentiment = 'negative';
  } else if (spiritualCount > 0) {
    sentiment = 'positive'; // المحتوى الروحاني يميل للإيجابية
  }

  // حساب الثقة بناءً على عدد الكلمات المطابقة
  const totalWords = text.split(' ').length;
  const matchedWords = positiveCount + negativeCount + spiritualCount;
  const confidence = Math.min(0.9, Math.max(0.3, matchedWords / totalWords * 2));

  const recommendations = sentiment === 'negative'
    ? ['آيات التسلية والصبر', 'أذكار الفرج', 'دعاء الكرب']
    : sentiment === 'positive'
    ? ['آيات الشكر والحمد', 'أذكار النعم', 'دعاء الحفظ']
    : ['آيات الهداية', 'أذكار عامة', 'دعاء الاستخارة'];

  return {
    sentiment,
    confidence,
    recommendations
  };
};

// تصنيف محلي محسن
const classifyTextLocally = (text: string) => {
  const lowerText = text.toLowerCase();

  // كلمات روحانية
  const spiritualKeywords = [
    'صلاة', 'دعاء', 'ذكر', 'قرآن', 'استغفار', 'تسبيح', 'حمد',
    'الله', 'ربي', 'إيمان', 'توبة', 'هداية', 'بركة', 'رحمة',
    'عبادة', 'طاعة', 'تقوى', 'خشوع', 'تدبر'
  ];

  // كلمات عاطفية
  const emotionalKeywords = [
    'حزن', 'قلق', 'خوف', 'فرح', 'سعادة', 'غضب', 'حب', 'كره',
    'أمل', 'يأس', 'راحة', 'ضيق', 'انشراح', 'كآبة', 'بهجة',
    'طمأنينة', 'توتر', 'استقرار', 'اضطراب'
  ];

  // كلمات عملية
  const practicalKeywords = [
    'عمل', 'دراسة', 'مشكلة', 'حل', 'قرار', 'اختيار', 'نصيحة',
    'مساعدة', 'إرشاد', 'توجيه', 'خطة', 'هدف', 'إنجاز', 'تحدي',
    'صعوبة', 'عقبة', 'فرصة', 'تطوير', 'تحسين'
  ];

  // كلمات شخصية
  const personalKeywords = [
    'أنا', 'نفسي', 'ذاتي', 'شخصيتي', 'حياتي', 'مستقبلي', 'ماضي',
    'علاقاتي', 'أسرتي', 'أصدقائي', 'زواج', 'أطفال', 'والدين',
    'صحتي', 'جسمي', 'عقلي', 'نفسيتي'
  ];

  const spiritualCount = spiritualKeywords.filter(word => lowerText.includes(word)).length;
  const emotionalCount = emotionalKeywords.filter(word => lowerText.includes(word)).length;
  const practicalCount = practicalKeywords.filter(word => lowerText.includes(word)).length;
  const personalCount = personalKeywords.filter(word => lowerText.includes(word)).length;

  // تحديد التصنيف الأعلى
  const scores = {
    spiritual: spiritualCount,
    emotional: emotionalCount,
    practical: practicalCount,
    personal: personalCount
  };

  const maxScore = Math.max(...Object.values(scores));
  const classification = Object.keys(scores).find(key => scores[key as keyof typeof scores] === maxScore) || 'general';

  // تحديد النية بناءً على التصنيف
  const intents = {
    spiritual: 'seeking_spiritual_guidance',
    emotional: 'seeking_comfort',
    practical: 'seeking_practical_advice',
    personal: 'seeking_personal_guidance',
    general: 'seeking_guidance'
  };

  const intent = intents[classification as keyof typeof intents];

  // حساب الثقة
  const totalWords = text.split(' ').length;
  const confidence = maxScore > 0
    ? Math.min(0.9, Math.max(0.4, maxScore / totalWords * 3))
    : 0.3;

  return {
    classification,
    intent,
    confidence
  };
};

// اقتراح آية محلي محسن
const getLocalVerseRecommendation = (request: VerseRecommendationRequest): VerseRecommendationResponse => {
  const lowerMood = request.userMood.toLowerCase();

  // قاعدة بيانات محلية موسعة للآيات
  const localVerses = {
    sad: [
      {
        verse: {
          arabic: 'وَبَشِّرِ الصَّابِرِينَ ۝ الَّذِينَ إِذَا أَصَابَتْهُم مُّصِيبَةٌ قَالُوا إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ',
          translation: 'وبشر الصابرين الذين إذا أصابتهم مصيبة قالوا إنا لله وإنا إليه راجعون',
          surah: 'البقرة',
          ayah: 156,
          reference: 'البقرة: 155-156'
        },
        explanation: 'هذه الآية تذكرنا بأن الصبر على البلاء من صفات المؤمنين الصادقين، وأن كل ما يصيبنا هو من قدر الله الحكيم',
        reflection: 'عندما تشعر بالحزن، تذكر أن هذا الابتلاء مؤقت وأن الله معك في كل لحظة. الصبر مفتاح الفرج',
        practicalAdvice: 'قل "إنا لله وإنا إليه راجعون" عند كل مصيبة، واستشعر أن هذا تذكير بأن كل شيء ملك لله وإليه المرجع',
        relatedTopics: ['الصبر على البلاء', 'الاسترجاع', 'التسليم لله', 'الثقة بالله']
      },
      {
        verse: {
          arabic: 'وَلَنَبْلُوَنَّكُم بِشَيْءٍ مِّنَ الْخَوْفِ وَالْجُوعِ وَنَقْصٍ مِّنَ الْأَمْوَالِ وَالْأَنفُسِ وَالثَّمَرَاتِ ۗ وَبَشِّرِ الصَّابِرِينَ',
          translation: 'ولنبلونكم بشيء من الخوف والجوع ونقص من الأموال والأنفس والثمرات وبشر الصابرين',
          surah: 'البقرة',
          ayah: 155,
          reference: 'البقرة: 155'
        },
        explanation: 'الابتلاء سنة الله في خلقه، وهو اختبار لإيماننا وصبرنا، والبشرى للصابرين',
        reflection: 'الابتلاء ليس عقاباً بل اختبار وتطهير، والله يبتلي من يحب ليرفع درجاته',
        practicalAdvice: 'اعلم أن كل ابتلاء يمر عليك هو امتحان من الله، فاصبر واحتسب الأجر عند الله',
        relatedTopics: ['الابتلاء والاختبار', 'الصبر', 'البشرى للصابرين', 'حكمة الله']
      }
    ],
    anxious: [
      {
        verse: {
          arabic: 'الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ اللَّهِ ۗ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
          translation: 'الذين آمنوا وتطمئن قلوبهم بذكر الله ألا بذكر الله تطمئن القلوب',
          surah: 'الرعد',
          ayah: 28,
          reference: 'الرعد: 28'
        },
        explanation: 'ذكر الله هو الدواء الشافي للقلوب القلقة والنفوس المضطربة، فبه تجد القلوب سكينتها وراحتها',
        reflection: 'اجعل لسانك رطباً بذكر الله في كل وقت، فهو السكينة الحقيقية والأمان الذي لا ينقطع',
        practicalAdvice: 'أكثر من الذكر والتسبيح، خاصة "لا إله إلا الله" و"سبحان الله وبحمده" و"استغفر الله العظيم"',
        relatedTopics: ['ذكر الله', 'الطمأنينة', 'السكينة', 'علاج القلق']
      },
      {
        verse: {
          arabic: 'وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ ۚ إِنَّ اللَّهَ بَالِغُ أَمْرِهِ ۚ قَدْ جَعَلَ اللَّهُ لِكُلِّ شَيْءٍ قَدْرًا',
          translation: 'ومن يتوكل على الله فهو حسبه إن الله بالغ أمره قد جعل الله لكل شيء قدراً',
          surah: 'الطلاق',
          ayah: 3,
          reference: 'الطلاق: 3'
        },
        explanation: 'التوكل على الله يجلب الطمأنينة ويزيل القلق، فمن اعتمد على الله كفاه الله كل همومه',
        reflection: 'ثق بأن الله سيدبر أمورك خير تدبير، وأن كل شيء بقدر وحكمة منه سبحانه',
        practicalAdvice: 'اعمل بالأسباب ثم توكل على الله، وقل "حسبي الله ونعم الوكيل" عند كل قلق',
        relatedTopics: ['التوكل على الله', 'الثقة بالله', 'تدبير الله', 'السكينة']
      }
    ],
    grateful: [
      {
        verse: {
          arabic: 'وَإِذْ تَأَذَّنَ رَبُّكُمْ لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ ۖ وَلَئِن كَفَرْتُمْ إِنَّ عَذَابِي لَشَدِيدٌ',
          translation: 'وإذ تأذن ربكم لئن شكرتم لأزيدنكم ولئن كفرتم إن عذابي لشديد',
          surah: 'إبراهيم',
          ayah: 7,
          reference: 'إبراهيم: 7'
        },
        explanation: 'الشكر يزيد النعم ويجلب البركة، وهو سبب في المزيد من فضل الله ورحمته',
        reflection: 'احمد الله على نعمه الظاهرة والباطنة، فالشكر يجلب البركة ويزيد النعم',
        practicalAdvice: 'اكتب 3 أشياء تشكر الله عليها كل يوم، وقل "الحمد لله رب العالمين" بصدق وتدبر',
        relatedTopics: ['الشكر والحمد', 'زيادة النعم', 'البركة', 'فضل الله']
      }
    ],
    hopeful: [
      {
        verse: {
          arabic: 'وَلَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ ۖ إِنَّهُ لَا يَيْأَسُ مِن رَّوْحِ اللَّهِ إِلَّا الْقَوْمُ الْكَافِرُونَ',
          translation: 'ولا تيأسوا من روح الله إنه لا ييأس من روح الله إلا القوم الكافرون',
          surah: 'يوسف',
          ayah: 87,
          reference: 'يوسف: 87'
        },
        explanation: 'هذه الآية تبث الأمل في القلوب وتذكر بأن رحمة الله واسعة وفرجه قريب',
        reflection: 'مهما اشتدت الظروف، فإن الله قادر على تغييرها في لحظة، فلا تفقد الأمل أبداً',
        practicalAdvice: 'ادع الله بيقين أنه سيجيبك، وتذكر أن بعد العسر يسراً، وأن الله لا يضيع من توكل عليه',
        relatedTopics: ['الأمل والرجاء', 'رحمة الله', 'الفرج بعد الضيق', 'عدم اليأس']
      }
    ],
    spiritual: [
      {
        verse: {
          arabic: 'وَاعْبُدْ رَبَّكَ حَتَّىٰ يَأْتِيَكَ الْيَقِينُ',
          translation: 'واعبد ربك حتى يأتيك اليقين',
          surah: 'الحجر',
          ayah: 99,
          reference: 'الحجر: 99'
        },
        explanation: 'العبادة هي الغاية من خلق الإنسان، والاستمرار عليها حتى الموت هو طريق الفلاح',
        reflection: 'اجعل عبادة الله هي محور حياتك، واستمر عليها في السراء والضراء',
        practicalAdvice: 'حافظ على الصلوات الخمس، وأكثر من قراءة القرآن والذكر والدعاء',
        relatedTopics: ['العبادة والطاعة', 'الثبات على الدين', 'اليقين', 'الاستقامة']
      }
    ]
  };

  // تحليل النص لتحديد الحالة
  const analysis = analyzeTextLocally(request.userMood);
  const classification = classifyTextLocally(request.userMood);

  // تحديد الآية المناسبة بناءً على التحليل
  let selectedCategory = 'grateful'; // افتراضي

  if (analysis.sentiment === 'negative') {
    if (lowerMood.includes('قلق') || lowerMood.includes('خوف') || lowerMood.includes('توتر')) {
      selectedCategory = 'anxious';
    } else if (lowerMood.includes('حزن') || lowerMood.includes('مكتئب') || lowerMood.includes('ضيق')) {
      selectedCategory = 'sad';
    } else {
      selectedCategory = 'hopeful';
    }
  } else if (analysis.sentiment === 'positive') {
    if (lowerMood.includes('شكر') || lowerMood.includes('ممتن') || lowerMood.includes('حمد')) {
      selectedCategory = 'grateful';
    } else {
      selectedCategory = 'hopeful';
    }
  } else if (classification.classification === 'spiritual') {
    selectedCategory = 'spiritual';
  }

  // اختيار آية عشوائية من الفئة المحددة
  const verses = localVerses[selectedCategory as keyof typeof localVerses] || localVerses.grateful;
  const selectedVerse = Array.isArray(verses)
    ? verses[Math.floor(Math.random() * verses.length)]
    : verses;

  return {
    ...selectedVerse,
    confidence: Math.max(0.7, analysis.confidence + classification.confidence) / 2
  };
};

// تحقق من حالة الخدمة
export const checkAIServiceStatus = async (): Promise<boolean> => {
  // محاكاة فحص الخدمة
  await new Promise(resolve => setTimeout(resolve, 500));

  if (USE_REAL_AI) {
    try {
      const response = await fetch(`${AI_BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${AI_API_KEY}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('خطأ في التحقق من حالة خدمة AI:', error);
      return false;
    }
  }

  // في الوضع المحلي، الخدمة متاحة دائماً
  return true;
};

export default {
  analyzeSentiment,
  classifyText,
  getSmartVerseRecommendation,
  summarizeText,
  checkAIServiceStatus
};
