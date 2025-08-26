// خدمة الذكاء الاصطناعي باستخدام Groq API المجانية
// خدمة الذكاء الاصطناعي باستخدام Groq API المجانية
// Groq يوفر نماذج قوية مثل Llama-3.1 مجاناً

export interface GroqAIRequest {
  question: string;
  context?: string;
  language?: 'ar' | 'en';
  maxTokens?: number;
}

export interface GroqAIResponse {
  answer: string;
  confidence: number;
  sources: string[];
  category: string;
  relatedQuestions: string[];
  isFromAI: boolean;
}

class GroqAIService {
  private static readonly API_URL = 'https://api.groq.com/openai/v1/chat/completions';
  private static readonly MODEL = 'llama3-70b-8192';

  // الحصول على مفتاح API من متغيرات البيئة
  private static getApiKey(): string {
    const envKey = import.meta.env.VITE_GROQ_API_KEY;
    
    console.log('🔑 فحص مفتاح Groq API...');
    
    if (envKey && envKey !== 'your_groq_api_key_here' && envKey !== 'gsk_your_actual_groq_api_key_here' && envKey.startsWith('gsk_')) {
      console.log('✅ تم العثور على مفتاح API صحيح');
      return envKey;
    }
    
    console.warn('⚠️ مفتاح Groq API غير مُعَد أو غير صحيح');
    console.log('💡 للحصول على مفتاح مجاني: https://console.groq.com/keys');
    
    return 'gsk_demo_key_replace_with_real_key';
  }

  // إنشاء prompt متخصص للأسئلة الشرعية
  private static createIslamicPrompt(question: string, language: string = 'ar'): string {
    return `
أنت مساعد ذكي متخصص في الأسئلة الشرعية الإسلامية.

السؤال: ${question}

أجب بتنسيق JSON:
{
  "answer": "الإجابة التفصيلية",
  "category": "فئة السؤال",
  "sources": ["مصدر1"],
  "confidence": 0.85,
  "relatedQuestions": ["سؤال ذو صلة"],
  "practicalAdvice": ["نصيحة عملية"]
}
`;
  }

  // استدعاء Groq API مع معالجة محسنة للأخطاء
  private static async callGroqAPI(prompt: string, maxTokens: number = 1000): Promise<string> {
    const apiKey = this.getApiKey();
    
    if (!apiKey || apiKey === 'gsk_demo_key_replace_with_real_key') {
      console.error('❌ مفتاح Groq API غير مُعَد!');
      console.log('🔍 لإعداد مفتاح API:');
      console.log('1. اذهب إلى: https://console.groq.com/keys');
      console.log('2. أنشئ مفتاح جديد (مجاني تماماً)');
      console.log('3. أضفه في ملف .env: VITE_GROQ_API_KEY=gsk_your_key_here');
      console.log('4. أعد تشغيل التطبيق');
      throw new Error('API_KEY_NOT_CONFIGURED: يرجى إعداد مفتاح Groq API في ملف .env');
    }

    console.log('🚀 إرسال طلب إلى Groq API...');

    try {
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.MODEL,
          messages: [{
            role: 'system',
            content: 'أنت مرشد روحي إسلامي متخصص في اقتراح الآيات القرآنية المناسبة. أجب بتنسيق JSON فقط.'
          }, {
            role: 'user',
            content: prompt
          }],
          max_tokens: maxTokens,
          temperature: 0.3,
          response_format: { type: 'json_object' }
        })
      });

      console.log('📥 حالة الاستجابة:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Groq API خطأ:', errorText);
        
        if (response.status === 401) {
          throw new Error('API_ERROR_401: مفتاح API غير صحيح أو منتهي الصلاحية');
        } else if (response.status === 429) {
          throw new Error('API_ERROR_429: تم تجاوز حد الاستخدام المسموح');
        } else if (response.status >= 500) {
          throw new Error('API_ERROR_SERVER: خطأ في خادم Groq');
        } else {
          throw new Error(`API_ERROR_${response.status}: خطأ غير متوقع`);
        }
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('INVALID_RESPONSE: تنسيق الاستجابة غير صحيح');
      }

      const content = data.choices[0].message.content;
      console.log('✅ تم استلام استجابة AI بنجاح');
      
      return content;
    } catch (error) {
      console.error('❌ خطأ في استدعاء Groq API:', error);
      throw error;
    }
  }

  // إجابة احتياطية
  private static getFallbackResponse(question: string): string {
    const lowerQuestion = question.toLowerCase();
    let category = 'عام';
    let answer = 'عذراً، لا يمكنني الوصول إلى خدمة الذكاء الاصطناعي حالياً.';
    
    if (lowerQuestion.includes('حزن') || lowerQuestion.includes('مكتئب')) {
      category = 'دعم نفسي';
      answer = 'في أوقات الحزن، تذكر أن الله معك. اقرأ القرآن واذكر الله كثيراً.';
    } else if (lowerQuestion.includes('قلق') || lowerQuestion.includes('خوف')) {
      category = 'طمأنينة';
      answer = 'عند القلق، توكل على الله واعلم أنه لا يحدث شيء إلا بإذنه.';
    } else if (lowerQuestion.includes('شكر') || lowerQuestion.includes('ممتن')) {
      category = 'شكر وامتنان';
      answer = 'الحمد لله على هذه المشاعر الطيبة. الشكر يزيد النعم.';
    }
    
    return JSON.stringify({
      answer,
      category,
      sources: ['إرشادات عامة'],
      confidence: 0.4,
      relatedQuestions: ['كيف أتعلم ديني؟'],
      practicalAdvice: ['راجع المصادر الشرعية']
    });
  }

  // الدالة الرئيسية مع تحسينات في معالجة الأخطاء
  public static async getSmartAnswer(request: GroqAIRequest): Promise<GroqAIResponse> {
    console.log('🤖 بدء معالجة طلب Groq AI...');
    console.log('❓ طول السؤال:', request.question.length);
    
    try {
      const prompt = this.createIslamicPrompt(request.question, request.language || 'ar');
      const rawResponse = await this.callGroqAPI(prompt, request.maxTokens || 1500);
      
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(rawResponse);
        console.log('✅ تم تحليل استجابة JSON بنجاح');
      } catch (parseError) {
        console.error('❌ فشل في تحليل JSON:', parseError);
        console.log('📝 الاستجابة الخام:', rawResponse);
        throw new Error('INVALID_JSON_RESPONSE');
      }
      
      return {
        answer: parsedResponse.answer || 'لم يتم العثور على إجابة مناسبة',
        confidence: parsedResponse.confidence || 0.8,
        sources: parsedResponse.sources || ['Groq AI - ذكاء اصطناعي'],
        category: parsedResponse.category || 'عام',
        relatedQuestions: parsedResponse.relatedQuestions || [],
        isFromAI: true
      };
      
    } catch (error) {
      console.error('❌ خطأ في Groq AI Service:', error);
      
      // تحديد نوع الخطأ بدقة
      let errorType = 'UNKNOWN_ERROR';
      let userMessage = 'خطأ غير معروف في الذكاء الاصطناعي';
      
      if (error instanceof Error) {
        if (error.message.includes('API_KEY_NOT_CONFIGURED')) {
          errorType = 'NO_API_KEY';
          userMessage = 'مفتاح Groq API غير مُعَد. يرجى إعداده في ملف .env';
        } else if (error.message.includes('401')) {
          errorType = 'INVALID_KEY';
          userMessage = 'مفتاح API غير صحيح أو منتهي الصلاحية';
        } else if (error.message.includes('429')) {
          errorType = 'RATE_LIMIT';
          userMessage = 'تم تجاوز حد الاستخدام المسموح. حاول مرة أخرى بعد قليل';
        } else if (error.message.includes('SERVER')) {
          errorType = 'SERVER_ERROR';
          userMessage = 'خطأ في خادم Groq. حاول مرة أخرى لاحقاً';
        }
      }
      
      // إرجاع استجابة احتياطية مع توضيح المشكلة
      const fallbackResponse = JSON.parse(this.getFallbackResponse(request.question));
      
      return {
        answer: `${fallbackResponse.answer}\n\n⚠️ ملاحظة: ${userMessage}`,
        confidence: 0.3,
        sources: ['نظام احتياطي - لا يوجد AI'],
        category: fallbackResponse.category,
        relatedQuestions: ['كيف أحصل على مفتاح Groq مجاني؟'],
        isFromAI: false
      };
    }
  }

  // فحص حالة الخدمة
  public static async checkServiceHealth(): Promise<boolean> {
    try {
      const testRequest: GroqAIRequest = {
        question: 'ما هو الإسلام؟',
        maxTokens: 100
      };
      
      const response = await this.getSmartAnswer(testRequest);
      return response.confidence > 0.5;
    } catch {
      return false;
    }
  }
}

export default GroqAIService;
