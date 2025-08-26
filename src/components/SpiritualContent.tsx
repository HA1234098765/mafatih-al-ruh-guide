import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Pause, Volume2, ExternalLink, Heart, BookOpen, Search, Loader2, RefreshCw, Globe, User, List, Eye } from 'lucide-react';
import { motion } from "framer-motion";
import IslamHouseService, { IslamHouseContent, IslamHouseCategory, IslamHouseAuthor, IslamHouseAuthorListItem, IslamHouseBookTypeListItem } from '@/services/islamHouse.service';
import BookTableOfContents from './BookTableOfContents';
import BookReader from './BookReader';

export function SpiritualContent() {
  // State management
  const [content, setContent] = useState<IslamHouseContent[]>([]);
  const [categories, setCategories] = useState<IslamHouseCategory[]>([]);
  const [authors, setAuthors] = useState<IslamHouseAuthor[]>([]);
  const [authorsList, setAuthorsList] = useState<IslamHouseAuthorListItem[]>([]);
  const [bookTypesList, setBookTypesList] = useState<IslamHouseBookTypeListItem[]>([]);
  const [filteredContent, setFilteredContent] = useState<IslamHouseContent[]>([]);
  
  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAuthor, setSelectedAuthor] = useState<string>('all');
  const [selectedContentType, setSelectedContentType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'title'>('latest');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Table of Contents modal
  const [tocModalOpen, setTocModalOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [selectedBookTitle, setSelectedBookTitle] = useState<string>('');
  
  // Book Reader modal
  const [readerModalOpen, setReaderModalOpen] = useState(false);
  
  // Statistics
  const [stats, setStats] = useState({
    totalContent: 0,
    categories: 0,
    authors: 0,
    audioCount: 0,
    videoCount: 0,
    articleCount: 0
  });

  // Load initial data on component mount
  useEffect(() => {
    loadInitialData();
  }, []);

  // Filter content when filters change
  useEffect(() => {
    filterContent();
  }, [content, searchQuery, selectedCategory, selectedAuthor, selectedContentType]);

  /**
   * Load initial data (categories, authors, and content)
   */
  const loadInitialData = async () => {
    setIsLoading(true);
    console.log('🔄 بدء تحميل البيانات الأولية...');
    
    try {
      console.log('📡 جاري الاتصال بخدمة Islam House...');
      
      console.log('🚀 جاري الاتصال بخدمة Islam House...');
      console.log('🌐 API Base URL:', 'http://newislamhouse-content.hdbc.co/Api');
      
      // Load categories, authors, book types, content, and authors list in parallel
      console.log('📦 بدء تحميل البيانات بالتوازي...');
      
      const [categoriesData, authorsData, authorsListData, bookTypesListData, contentData, statsData] = await Promise.all([
        IslamHouseService.getCategories('ar').then(data => {
          console.log('✅ تم تحميل التصنيفات:', data.length, 'تصنيف');
          console.log('📋 عينة من التصنيفات:', data.slice(0, 3));
          return data;
        }).catch(err => {
          console.error('❌ خطأ في تحميل التصنيفات:', err);
          console.error('🔍 تفاصيل خطأ التصنيفات:', { message: err.message, stack: err.stack });
          throw err;
        }),
        IslamHouseService.getAuthors(undefined, 'ar').then(data => {
          console.log('✅ تم تحميل المؤلفين:', data.length, 'مؤلف');
          console.log('👥 عينة من المؤلفين:', data.slice(0, 3));
          return data;
        }).catch(err => {
          console.error('❌ خطأ في تحميل المؤلفين:', err);
          console.error('🔍 تفاصيل خطأ المؤلفين:', { message: err.message, stack: err.stack });
          throw err;
        }),
        IslamHouseService.getAuthorsList('ar').then(data => {
          console.log('✅ تم تحميل قائمة المؤلفين الجديدة:', data.length, 'مؤلف');
          console.log('👥 عينة من القائمة الجديدة:', data.slice(0, 5));
          return data;
        }).catch(err => {
          console.error('❌ خطأ في تحميل قائمة المؤلفين:', err);
          return []; // Don't fail if this is unavailable
        }),
        IslamHouseService.getBookTypesList('ar').then(data => {
          console.log('✅ تم تحميل قائمة أنواع الكتب:', data.length, 'نوع');
          console.log('📚 أنواع الكتب:', data.map(bt => `${bt.id}: ${bt.name}`));
          return data;
        }).catch(err => {
          console.error('❌ خطأ في تحميل أنواع الكتب:', err);
          return []; // Don't fail if this is unavailable
        }),
        IslamHouseService.getContent({ lang: 'ar', sort_by: 'latest', limit: 20 }).then(data => {
          console.log('✅ تم تحميل المحتوى:', data.length, 'عنصر');
          console.log('📚 عينة من المحتوى:', data.slice(0, 2));
          
          // Check if this is real API data or fallback data
          const isRealData = data.some(item => 
            item.url && (item.url.includes('islamhouse.com') || item.url.startsWith('http'))
          );
          console.log('🎯 نوع البيانات:', isRealData ? 'بيانات حقيقية من API' : 'بيانات تجريبية احتياطية');
          
          return data;
        }).catch(err => {
          console.error('❌ خطأ في تحميل المحتوى:', err);
          console.error('🔍 تفاصيل خطأ المحتوى:', { message: err.message, stack: err.stack });
          throw err;
        }),
        IslamHouseService.getContentStats('ar').then(data => {
          console.log('✅ تم تحميل الإحصائيات:', data);
          return data;
        }).catch(err => {
          console.error('❌ خطأ في تحميل الإحصائيات:', err);
          console.error('🔍 تفاصيل خطأ الإحصائيات:', { message: err.message, stack: err.stack });
          throw err;
        })
      ]);

      console.log('📊 البيانات المحملة:');
      console.log('- التصنيفات:', categoriesData);
      console.log('- المؤلفين:', authorsData.slice(0, 3));
      console.log('- قائمة المؤلفين الجديدة:', authorsListData.slice(0, 5));
      console.log('- أنواع الكتب:', bookTypesListData);
      console.log('- المحتوى:', contentData.slice(0, 3));
      console.log('- الإحصائيات:', statsData);

      setCategories(categoriesData);
      setAuthors(authorsData.slice(0, 20)); // Limit authors for performance
      setAuthorsList(authorsListData); // Set the enhanced authors list
      setBookTypesList(bookTypesListData); // Set the book types list
      setContent(contentData);
      setStats(statsData);
      setHasMore(contentData.length === 20);
      
      console.log('✅ تم تحديث الحالة بنجاح!');
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('💥 خطأ في تحميل البيانات الأولية:', error);
      console.error('تفاصيل الخطأ:', {
        message: error instanceof Error ? error.message : 'خطأ غير معروف',
        stack: error instanceof Error ? error.stack : undefined,
        type: typeof error
      });
      
      const errorMessage = error instanceof Error ? error.message : 'خطأ في الاتصال بالخادم';
      setError(`فشل في تحميل المحتوى: ${errorMessage}`);
      
      // Set empty arrays as fallback
      setContent([]);
      setCategories([]);
      setAuthors([]);
      setAuthorsList([]);
      setBookTypesList([]);
      setStats({
        totalContent: 0,
        categories: 0,
        authors: 0,
        audioCount: 0,
        videoCount: 0,
        articleCount: 0
      });
    } finally {
      setIsLoading(false);
      console.log('🏁 انتهاء عملية التحميل');
    }
  };

  /**
   * Get book type name from book types list
   */
  const getBookTypeName = (bookTypeId: number | null | undefined): string => {
    if (!bookTypeId || bookTypesList.length === 0) return 'كتاب';
    
    const bookType = bookTypesList.find(bt => bt.id === bookTypeId);
    return bookType ? bookType.name : 'كتاب';
  };

  /**
   * Filter content based on search and filters
   */
  const filterContent = () => {
    let filtered = content;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        (item.title?.toLowerCase().includes(query)) ||
        (item.title_ar?.toLowerCase().includes(query)) ||
        (item.description?.toLowerCase().includes(query)) ||
        (item.description_ar?.toLowerCase().includes(query)) ||
        (item.author_name?.toLowerCase().includes(query)) ||
        (item.author_name_ar?.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => 
        item.category_id?.toString() === selectedCategory
      );
    }

    // Author filter
    if (selectedAuthor !== 'all') {
      filtered = filtered.filter(item => 
        item.author_id?.toString() === selectedAuthor
      );
    }

    // Content type filter
    if (selectedContentType !== 'all') {
      filtered = filtered.filter(item => 
        item.content_type === selectedContentType
      );
    }

    setFilteredContent(filtered);
  };

  /**
   * Refresh content
   */
  const refreshContent = async () => {
    setCurrentPage(1);
    setHasMore(true);
    await loadInitialData();
  };

  /**
   * Search content
   */
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      filterContent();
      return;
    }

    setIsLoading(true);
    try {
      const searchResults = await IslamHouseService.searchContent(query, 'ar', {
        sort_by: sortBy,
        limit: 50
      });
      setContent(searchResults);
    } catch (error) {
      console.error('Error searching content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle play/pause for media content
   */
  const handlePlay = (id: number) => {
    if (playingId === id) {
      setPlayingId(null);
    } else {
      setPlayingId(id);
    }
  };

  /**
   * Get appropriate icon for content type
   */
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'audio': return <Volume2 className="h-4 w-4" />;
      case 'video': return <Play className="h-4 w-4" />;
      case 'article': 
      case 'book':
      case 'fatwa': return <BookOpen className="h-4 w-4" />;
      default: return <Heart className="h-4 w-4" />;
    }
  };

  /**
   * Get color scheme for content type
   */
  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'audio': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'video': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'article': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'book': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'fatwa': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    };
    return colors[type] || colors['article'];
  };

  /**
   * Format content description
   */
  const getContentDescription = (content: IslamHouseContent): string => {
    return content.description_ar || content.description || 'محتوى إسلامي مفيد';
  };

  /**
   * Format content title
   */
  const getContentTitle = (content: IslamHouseContent): string => {
    return content.title_ar || content.title || 'عنوان غير متوفر';
  };

  /**
   * Format author name
   */
  const getAuthorName = (content: IslamHouseContent): string => {
    return content.author_name_ar || content.author_name || 'مؤلف غير معروف';
  };

  /**
   * Open table of contents for a book
   */
  const openTableOfContents = (item: IslamHouseContent) => {
    if (item.content_type === 'book') {
      setSelectedBookId(item.id);
      setSelectedBookTitle(getContentTitle(item));
      setTocModalOpen(true);
      console.log(`📚 Opening table of contents for book: ${item.title} (ID: ${item.id})`);
    }
  };

  /**
   * Open book reader directly
   */
  const openBookReader = (item: IslamHouseContent) => {
    if (item.content_type === 'book') {
      setSelectedBookId(item.id);
      setSelectedBookTitle(getContentTitle(item));
      setReaderModalOpen(true);
      console.log(`📖 Opening book reader for: ${item.title} (ID: ${item.id})`);
    }
  };

  /**
   * Open content in new tab
   */
  const openContent = (content: IslamHouseContent) => {
    const url = content.url || content.download_url;
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Enhanced Header with Statistics */}
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
            <Globe className="h-8 w-8 text-white dark:text-black" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-black via-gray-700 to-black dark:from-white dark:via-gray-300 dark:to-white bg-clip-text text-transparent">
          المحتوى الإسلامي العالمي
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          محتوى إسلامي موثوق من دار الإسلام للنشر والتوزيع
        </p>
        
        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          <div className="bg-white dark:bg-black border-2 border-black dark:border-white rounded-xl p-3">
            <div className="text-2xl font-bold">{stats.totalContent}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">إجمالي المحتوى</div>
          </div>
          <div className="bg-white dark:bg-black border-2 border-black dark:border-white rounded-xl p-3">
            <div className="text-2xl font-bold">{stats.audioCount}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">ملفات صوتية</div>
          </div>
          <div className="bg-white dark:bg-black border-2 border-black dark:border-white rounded-xl p-3">
            <div className="text-2xl font-bold">{stats.videoCount}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">ملفات مرئية</div>
          </div>
          <div className="bg-white dark:bg-black border-2 border-black dark:border-white rounded-xl p-3">
            <div className="text-2xl font-bold">{stats.articleCount}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">مقالات</div>
          </div>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <Card className="border-2 border-black dark:border-white shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            البحث والفلترة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="ابحث في المحتوى الإسلامي..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                className="pl-10 border-2 border-black dark:border-white"
              />
            </div>
            <Button 
              onClick={() => handleSearch(searchQuery)}
              className="bg-black text-white dark:bg-white dark:text-black border-2 border-black dark:border-white"
            >
              بحث
            </Button>
            <Button 
              variant="outline"
              onClick={refreshContent}
              className="border-2 border-black dark:border-white"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="border-2 border-black dark:border-white">
                <SelectValue placeholder="اختر التصنيف" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع التصنيفات</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name_ar || category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Author Filter */}
            <Select value={selectedAuthor} onValueChange={setSelectedAuthor}>
              <SelectTrigger className="border-2 border-black dark:border-white">
                <SelectValue placeholder="اختر المؤلف" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المؤلفين</SelectItem>
                {authors.map((author) => (
                  <SelectItem key={author.id} value={author.id.toString()}>
                    {author.name_ar || author.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Content Type Filter */}
            <Select value={selectedContentType} onValueChange={setSelectedContentType}>
              <SelectTrigger className="border-2 border-black dark:border-white">
                <SelectValue placeholder="نوع المحتوى" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="audio">صوتي</SelectItem>
                <SelectItem value="video">مرئي</SelectItem>
                <SelectItem value="article">مقال</SelectItem>
                <SelectItem value="book">كتاب</SelectItem>
                <SelectItem value="fatwa">فتوى</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort Filter */}
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
              <SelectTrigger className="border-2 border-black dark:border-white">
                <SelectValue placeholder="ترتيب حسب" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">الأحدث</SelectItem>
                <SelectItem value="popular">الأكثر شعبية</SelectItem>
                <SelectItem value="title">العنوان</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Content List */}
      <Card className="border-2 border-black dark:border-white shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              المحتوى المتاح ({filteredContent.length} عنصر)
            </CardTitle>
            {isLoading && (
              <Loader2 className="h-5 w-5 animate-spin" />
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                <p className="text-gray-600 dark:text-gray-400">جاري تحميل المحتوى الإسلامي...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12 space-y-6">
              <Heart className="h-16 w-16 mx-auto text-red-400" />
              <div className="max-w-2xl mx-auto space-y-4">
                <h3 className="text-xl font-bold text-red-600">🚫 مشكلة في الاتصال بخدمة دار الإسلام</h3>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-right">
                  <p className="text-red-700 dark:text-red-300 mb-3 font-semibold">
                    📝 تفاصيل الخطأ:
                  </p>
                  <p className="text-red-600 dark:text-red-400 text-sm bg-white dark:bg-red-900/30 p-3 rounded border-right-4 border-red-400">
                    {error}
                  </p>
                </div>
                
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-right">
                  <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                    🔍 الأسباب المحتملة:
                  </h4>
                  <ul className="text-yellow-700 dark:text-yellow-300 text-sm space-y-1 list-disc list-inside">
                    <li>🌐 مشاكل في اتصال الإنترنت</li>
                    <li>🚫 قيود CORS في خادم دار الإسلام</li>
                    <li>🔧 تغيير في عناوين API أو عدم توفرها</li>
                    <li>⚙️ صيانة مؤقتة للخادم</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-right">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                    📝 ما يمكن فعله:
                  </h4>
                  <ul className="text-blue-700 dark:text-blue-300 text-sm space-y-2 list-disc list-inside">
                    <li>♾️ تحقق من اتصال الإنترنت</li>
                    <li>🔄 اضغط على "إعادة تحميل" للمحاولة مرة أخرى</li>
                    <li>🔍 استخدم زر "اختبار API شامل" للتشخيص</li>
                    <li>📚 استمتع بالمحتوى الإسلامي الاحتياطي أدناه</li>
                  </ul>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                  <Button onClick={refreshContent} className="bg-red-600 hover:bg-red-700 text-white">
                    🔄 إعادة محاولة الاتصال
                  </Button>
                  <Button 
                    onClick={async () => {
                      try {
                        const testResult = await IslamHouseService.testAPIConnection();
                        if (testResult.success) {
                          await loadInitialData();
                        }
                      } catch (err) {
                        console.error('خطأ في الاختبار:', err);
                      }
                    }}
                    variant="outline" 
                    className="border-blue-500 text-blue-600 hover:bg-blue-50"
                  >
                    🔍 اختبار الاتصال
                  </Button>
                </div>
              </div>
            </div>
          ) : filteredContent.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <Heart className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="text-lg font-semibold">لا يوجد محتوى متاح</h3>
              <p className="text-gray-600 dark:text-gray-400">
                لم نجد محتوى مطابق لمعايير البحث. جرب تغيير الفلاتر أو البحث عن شيء آخر.
              </p>
              <Button onClick={refreshContent} className="mt-4">
                إعادة تحميل المحتوى
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredContent.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="border border-black dark:border-white hover:shadow-lg transition-all duration-300 group">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {/* Media Controls */}
                        <div className="flex-shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePlay(item.id)}
                            className="border-black dark:border-white group-hover:scale-105 transition-transform"
                          >
                            {playingId === item.id ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              getTypeIcon(item.content_type)
                            )}
                          </Button>
                        </div>
                        
                        {/* Content Information */}
                        <div className="flex-1 space-y-3">
                          {/* Header */}
                          <div className="flex items-center justify-between gap-4">
                            <h3 className="font-bold text-lg leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {getContentTitle(item)}
                            </h3>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <Badge className={getTypeColor(item.content_type)}>
                                {item.content_type === 'audio' ? 'صوتي' : 
                                 item.content_type === 'video' ? 'مرئي' : 
                                 item.content_type === 'article' ? 'مقال' : 
                                 item.content_type === 'book' ? 'كتاب' : 'فتوى'}
                              </Badge>
                              {item.content_type === 'book' && item.book_type && (
                                <Badge variant="outline" className="border-purple-400 bg-purple-50 text-purple-700 dark:bg-purple-900 dark:text-purple-200">
                                  {getBookTypeName(item.book_type)}
                                </Badge>
                              )}
                              {item.duration && (
                                <Badge variant="outline" className="border-black dark:border-white">
                                  {item.duration}
                                </Badge>
                              )}
                              {item.file_size && (
                                <Badge variant="outline" className="border-black dark:border-white bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-200">
                                  {item.file_size}
                                </Badge>
                              )}
                              {item.priority_level && item.priority_level >= 9 && (
                                <Badge variant="outline" className="border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-900 dark:text-amber-200">
                                  ⭐ مميز
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          {/* Description */}
                          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            {getContentDescription(item)}
                          </p>
                          
                          {/* Author and Category */}
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <User className="h-4 w-4" />
                            <span>{getAuthorName(item)}</span>
                            {item.category_name && (
                              <>
                                <span>•</span>
                                <span>{item.category_name}</span>
                              </>
                            )}
                          </div>
                          
                          {/* Actions */}
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openContent(item)}
                                className="border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                فتح المحتوى
                              </Button>
                              {item.content_type === 'book' && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openTableOfContents(item)}
                                    className="border-blue-400 text-blue-600 hover:bg-blue-600 hover:text-white dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-600 dark:hover:text-white"
                                  >
                                    <List className="h-4 w-4 mr-2" />
                                    فهرس المحتويات
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openBookReader(item)}
                                    className="border-green-500 text-green-600 hover:bg-green-600 hover:text-white dark:border-green-400 dark:text-green-400 dark:hover:bg-green-600 dark:hover:text-white"
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    قراءة الكتاب
                                  </Button>
                                </>
                              )}
                            </div>
                            
                            {playingId === item.id && (
                              <div className="flex items-center gap-2 text-sm text-green-600">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                جاري التشغيل...
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Debug Panel - for development only */}
      {process.env.NODE_ENV === 'development' && (
        <Card className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
          <CardContent className="p-4">
            <h4 className="font-semibold mb-3 text-yellow-800 dark:text-yellow-200">
              🔧 لوحة التطوير - معلومات التشخيص
            </h4>
            <div className="space-y-2 text-sm text-yellow-700 dark:text-yellow-300">
              <div>• حالة التحميل: {isLoading ? 'جاري التحميل...' : 'مكتمل'}</div>
              <div>• عدد العناصر: {content.length}</div>
              <div>• عدد العناصر المفلترة: {filteredContent.length}</div>
              <div>• عدد التصنيفات: {categories.length}</div>
              <div>• عدد المؤلفين: {authors.length}</div>
              <div>• عدد قائمة المؤلفين الجديدة: {authorsList.length}</div>
              <div>• عدد أنواع الكتب: {bookTypesList.length}</div>
              <div>• البيئة: {process.env.NODE_ENV === 'development' ? 'تطوير (Proxy مفعّل)' : 'إنتاج'}</div>
              {bookTypesList.length > 0 && (
                <div>• أنواع الكتب: {bookTypesList.map(bt => bt.name).join(', ')}</div>
              )}
              <div>• رسالة الخطأ: {error || 'لا يوجد'}</div>
              <div>• الإحصائيات: إجمالي {stats.totalContent}, صوتي {stats.audioCount}, مرئي {stats.videoCount}, مقالات {stats.articleCount}</div>
              <div>• الفلاتر: تصنيف={selectedCategory}, مؤلف={selectedAuthor}, نوع={selectedContentType}</div>
              <div>• البحث: "{searchQuery}"</div>
              <div className="font-semibold">• نوع البيانات: {
                content.length > 0 && content.some(item => item.url?.includes('islamhouse.com') || (item.url && item.url.startsWith('http'))) 
                  ? '🎯 بيانات حقيقية من API' 
                  : '🔄 بيانات تجريبية احتياطية'
              }</div>
              {content.length > 0 && (
                <div>• عينة من المحتوى: {content.slice(0, 2).map(c => c.title_ar || c.title).join(', ')}</div>
              )}
              {content.length > 0 && (
                <div>• عينة URLs: {content.slice(0, 2).map(c => c.url || 'No URL').join(', ')}</div>
              )}
            </div>
            <div className="flex gap-2 mt-3">
              <Button 
                onClick={() => {
                  console.log('📋 حالة التطبيق:');
                  console.log('Content:', content);
                  console.log('Categories:', categories);
                  console.log('Authors:', authors);
                  console.log('Stats:', stats);
                  console.log('Error:', error);
                }}
                size="sm"
              >
                طباعة الحالة
              </Button>
              <Button 
                onClick={async () => {
                  console.log('🧪 بدء اختبار شامل للخدمة...');
                  try {
                    const testResult = await IslamHouseService.testAPIConnection();
                    console.log('📊 نتائج الاختبار:', testResult);
                    
                    if (testResult.success) {
                      console.log('✅ نجح الاختبار!', testResult.data);
                      alert(`✅ نجح الاختبار الشامل! \
📡 API يعمل بصورة صحيحة\
📊 البيانات متوفرة من الخادم`);
                      // Force reload data if test successful
                      await loadInitialData();
                    } else {
                      console.error('❌ فشل الاختبار:', testResult.error);
                      console.log('🔍 تشخيص مفصل:', testResult.diagnostics);
                      
                      let diagnosticMessage = '🔍 تشخيص متقدم:\n';
                      if (testResult.diagnostics) {
                        const d = testResult.diagnostics;
                        diagnosticMessage += `• البيئة: ${d.environment}\n`;
                        diagnosticMessage += `• استخدام Proxy: ${d.usingProxy ? '✅ نعم' : '❌ لا'}\n`;
                        diagnosticMessage += `• إمكانية الوصول للخادم: ${d.baseUrlAccessible ? '✅' : '❌'}\n`;
                        diagnosticMessage += `• نقطة نهاية التصنيفات: ${d.categoriesEndpoint ? '✅' : '❌'}\n`;
                        diagnosticMessage += `• نقطة نهاية الكتب: ${d.booksEndpoint ? '✅' : '❌'}\n`;
                        diagnosticMessage += `• مشاكل CORS: ${d.corsIssue ? '❗' : '✅'}\n`;
                        diagnosticMessage += `• مشاكل الشبكة: ${d.networkIssue ? '❗' : '✅'}\n`;
                        if (d.usingProxy) {
                          diagnosticMessage += `• مشاكل Proxy: ${d.proxyIssue ? '❗' : '✅'}\n`;
                        }
                        
                        if (d.detectedIssues.length > 0) {
                          diagnosticMessage += '\n📝 المشاكل المكتشفة:\n';
                          d.detectedIssues.forEach((issue, index) => {
                            diagnosticMessage += `${index + 1}. ${issue}\n`;
                          });
                        }
                      }
                      
                      alert(`❌ فشل الاختبار الشامل\n\n${testResult.error}\n\n${diagnosticMessage}\n\n📌 استخدام البيانات الاحتياطية`);
                    }
                  } catch (err) {
                    console.error('❌ خطأ في الاختبار:', err);
                    alert('❌ خطأ في الاختبار: ' + (err instanceof Error ? err.message : 'خطأ غير معروف'));
                  }
                }}
                size="sm" 
                variant="outline"
                className="bg-red-50 border-red-300 text-red-700 hover:bg-red-100"
              >
                🔍 اختبار API شامل
              </Button>
              <Button 
                onClick={async () => {
                  console.log('🧪 اختبار Book Types List API...');
                  try {
                    const testResult = await IslamHouseService.testBookTypesListAPI();
                    if (testResult.success) {
                      console.log('✅ نجح اختبار Book Types!', testResult.data);
                      alert(`نجح اختبار Book Types API! تم جلب ${testResult.data?.data?.length || 0} نوع من أنواع الكتب`);
                    } else {
                      console.error('❌ فشل اختبار Book Types:', testResult.error);
                      alert(`فشل اختبار Book Types API: ${testResult.error}`);
                    }
                  } catch (err) {
                    console.error('❌ خطأ في اختبار Book Types:', err);
                    alert('خطأ في اختبار Book Types: ' + (err instanceof Error ? err.message : 'خطأ غير معروف'));
                  }
                }}
                size="sm" 
                variant="secondary"
              >
                اختبار Book Types
              </Button>
              <Button 
                onClick={async () => {
                  console.log('🧪 اختبار Authors List API...');
                  try {
                    const testResult = await IslamHouseService.testAuthorsListAPI();
                    if (testResult.success) {
                      console.log('✅ نجح اختبار Authors List!', testResult.data);
                      alert(`نجح اختبار Authors List API! تم جلب ${testResult.data?.data?.length || 0} مؤلف بنجاح`);
                    } else {
                      console.error('❌ فشل اختبار Authors List:', testResult.error);
                      alert(`فشل اختبار Authors List API: ${testResult.error}`);
                    }
                  } catch (err) {
                    console.error('❌ خطأ في اختبار Authors List:', err);
                    alert('خطأ في اختبار Authors List: ' + (err instanceof Error ? err.message : 'خطأ غير معروف'));
                  }
                }}
                size="sm" 
                variant="secondary"
              >
                اختبار Authors List
              </Button>
              <Button 
                onClick={async () => {
                  console.log('🧪 اختبار Book Titles API...');
                  try {
                    const testResult = await IslamHouseService.testBookTitlesAPI();
                    if (testResult.success) {
                      console.log('✅ نجح اختبار Book Titles!', testResult.data);
                      alert(`نجح اختبار Book Titles API! تم جلب فهرس الكتاب بنجاح`);
                    } else {
                      console.error('❌ فشل اختبار Book Titles:', testResult.error);
                      alert(`فشل اختبار Book Titles API: ${testResult.error}`);
                    }
                  } catch (err) {
                    console.error('❌ خطأ في اختبار Book Titles:', err);
                    alert('خطأ في اختبار Book Titles: ' + (err instanceof Error ? err.message : 'خطأ غير معروف'));
                  }
                }}
                size="sm" 
                variant="secondary"
              >
                اختبار Book Titles
              </Button>
              <Button 
                onClick={async () => {
                  console.log('🧪 اختبار Page Data API...');
                  try {
                    const testResult = await IslamHouseService.testPageDataAPI();
                    if (testResult.success) {
                      console.log('✅ نجح اختبار Page Data!', testResult.data);
                      alert(`نجح اختبار Page Data API! تم جلب محتوى الصفحة بنجاح`);
                    } else {
                      console.error('❌ فشل اختبار Page Data:', testResult.error);
                      alert(`فشل اختبار Page Data API: ${testResult.error}`);
                    }
                  } catch (err) {
                    console.error('❌ خطأ في اختبار Page Data:', err);
                    alert('خطأ في اختبار Page Data: ' + (err instanceof Error ? err.message : 'خطأ غير معروف'));
                  }
                }}
                size="sm" 
                variant="secondary"
              >
                اختبار Page Data
              </Button>
              <Button 
                onClick={async () => {
                  console.log('🚀 اختبار API v3 الشامل...');
                  try {
                    const testResult = await IslamHouseService.testAPIv3Integration();
                    if (testResult.success) {
                      console.log('✅ نجح اختبار API v3 الشامل!', testResult);
                      
                      let successMessage = `🎯 نجح اختبار API v3 الشامل!\n\n`;
                      if (testResult.stats) {
                        const stats = testResult.stats;
                        successMessage += `📊 الإحصائيات:\n`;
                        successMessage += `• إجمالي العناصر: ${stats.totalItems}\n`;
                        successMessage += `• أنواع المحتوى: ${stats.contentTypes.join(', ')}\n`;
                        successMessage += `• اللغات: ${stats.languages.join(', ')}\n`;
                        successMessage += `• عدد المؤلفين: ${stats.authors}\n`;
                        successMessage += `• عدد التصنيفات: ${stats.categories}\n`;
                        successMessage += `• متوسط الأولوية: ${stats.avgPriority.toFixed(1)}\n`;
                        successMessage += `• زمن الاستجابة: ${stats.fetchDuration}\n\n`;
                      }
                      successMessage += `✨ API v3 يعمل بشكل مثالي مع التكامل الذكي!`;
                      
                      alert(successMessage);
                      
                      // Refresh content using API v3
                      console.log('🔄 تحديث المحتوى باستخدام API v3...');
                      await loadInitialData();
                    } else {
                      console.error('❌ فشل اختبار API v3 الشامل:', testResult.error);
                      alert(`❌ فشل اختبار API v3 الشامل:\n\n${testResult.error}\n\n💡 سيتم استخدام البيانات الاحتياطية`);
                    }
                  } catch (err) {
                    console.error('❌ خطأ في اختبار API v3 الشامل:', err);
                    alert('❌ خطأ في اختبار API v3 الشامل: ' + (err instanceof Error ? err.message : 'خطأ غير معروف'));
                  }
                }}
                size="sm" 
                variant="outline"
                className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-300 text-purple-700 hover:bg-gradient-to-r hover:from-purple-100 hover:to-blue-100"
              >
                🚀 اختبار API v3 الشامل
              </Button>
              <Button 
                onClick={async () => {
                  console.log('🔄 فرض إعادة تحميل البيانات الحقيقية...');
                  setError(null);
                  await loadInitialData();
                }}
                size="sm" 
                variant="secondary"
              >
                فرض إعادة التحميل
              </Button>
              <Button 
                onClick={async () => {
                  console.log('🔍 بدء استكشاف API...');
                  try {
                    const discovery = await IslamHouseService.discoverAPI();
                    console.log('🎯 نتائج الاستكشاف:', discovery);
                    
                    let message = `🔍 نتائج استكشاف API:\n\n`;
                    
                    if (discovery.workingEndpoints.length > 0) {
                      message += `✅ نقاط نهاية تعمل (${discovery.workingEndpoints.length}):\n`;
                      discovery.workingEndpoints.forEach(ep => {
                        message += `  • ${ep.method} ${ep.endpoint} (${ep.status})\n`;
                      });
                      message += '\n';
                    } else {
                      message += `❌ لم يتم العثور على نقاط نهاية تعمل\n\n`;
                    }
                    
                    message += `❌ نقاط نهاية فاشلة: ${discovery.failedEndpoints.length}\n`;
                    
                    // Show some failed endpoints as examples
                    const sampleFailures = discovery.failedEndpoints.slice(0, 5);
                    sampleFailures.forEach(ep => {
                      message += `  • ${ep.method} ${ep.endpoint} (${ep.status}: ${ep.error})\n`;
                    });
                    
                    if (discovery.workingEndpoints.length > 0) {
                      message += '\n🎉 تم العثور على نقاط نهاية تعمل! افحص وحدة التحكم للتفاصيل';
                    } else {
                      message += '\n📝 الخلاصة: لا توجد API متاحة حالياً في خادم دار الإسلام';
                    }
                    
                    alert(message);
                  } catch (err) {
                    console.error('❌ خطأ في استكشاف API:', err);
                    alert('❌ خطأ في استكشاف API: ' + (err instanceof Error ? err.message : 'خطأ غير معروف'));
                  }
                }}
                size="sm" 
                variant="secondary"
                className="bg-purple-50 border-purple-300 text-purple-700 hover:bg-purple-100"
              >
                🔍 استكشاف API
              </Button>
              <Button 
                onClick={async () => {
                  console.log('🧪 اختبار API v3 الجديد...');
                  try {
                    const testResult = await IslamHouseService.testAPIv3();
                    console.log('🎯 نتيجة اختبار API v3:', testResult);
                    
                    if (testResult.success) {
                      console.log('✅ نجح اختبار API v3!', testResult.data);
                      
                      let message = `✅ نجح اختبار API v3 الجديد!\n\n`;
                      
                      if (testResult.data && Array.isArray(testResult.data)) {
                        message += `📊 تم العثور على ${testResult.data.length} قسم محتوى:\n`;
                        testResult.data.slice(0, 5).forEach((section: any, index: number) => {
                          message += `${index + 1}. ${section.block_name || 'Unknown'} (${section.items_count || 0} عنصر)\n`;
                        });
                        message += '\n🎉 API v3 يعمل بصورة ممتازة!';
                      } else {
                        message += '📊 تم الحصول على استجابة صحيحة';
                      }
                      
                      alert(message);
                      
                      // Force reload data with new API
                      await loadInitialData();
                    } else {
                      console.error('❌ فشل اختبار API v3:', testResult.error);
                      alert(`❌ فشل اختبار API v3:\n\n${testResult.error}`);
                    }
                  } catch (err) {
                    console.error('❌ خطأ في اختبار API v3:', err);
                    alert('❌ خطأ في اختبار API v3: ' + (err instanceof Error ? err.message : 'خطأ غير معروف'));
                  }
                }}
                size="sm" 
                variant="secondary"
                className="bg-green-50 border-green-300 text-green-700 hover:bg-green-100"
              >
                🎆 اختبار API v3
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <h4 className="font-semibold mb-3 text-blue-800 dark:text-blue-200">
            💡 نصائح للاستفادة من المحتوى الإسلامي
          </h4>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• استخدم البحث للعثور على محتوى محدد</li>
            <li>• فلتر المحتوى حسب النوع أو المؤلف</li>
            <li>• استخدم زر "فهرس المحتويات" للكتب لرؤية الفصول والدروس</li>
            <li>• اضغط "قراءة الكتاب" لبدء قراءة محتوى الكتاب مباشرة</li>
            <li>• استخدم أزرار تعديل حجم الخط لقراءة مريحة</li>
            <li>• غيّر اللغة لقراءة المحتوى بلغات مختلفة</li>
            <li>• شارك المحتوى المفيد مع الآخرين</li>
            <li>• اجعل قلبك حاضراً ومتدبراً أثناء القراءة</li>
          </ul>
        </CardContent>
      </Card>

      {/* Table of Contents Modal */}
      {selectedBookId && (
        <BookTableOfContents
          bookId={selectedBookId}
          bookTitle={selectedBookTitle}
          isOpen={tocModalOpen}
          onClose={() => {
            setTocModalOpen(false);
            setSelectedBookId(null);
            setSelectedBookTitle('');
          }}
        />
      )}

      {/* Book Reader Modal */}
      {selectedBookId && (
        <BookReader
          bookId={selectedBookId}
          bookTitle={selectedBookTitle}
          isOpen={readerModalOpen}
          onClose={() => {
            setReaderModalOpen(false);
            setSelectedBookId(null);
            setSelectedBookTitle('');
          }}
        />
      )}
    </div>
  );
}