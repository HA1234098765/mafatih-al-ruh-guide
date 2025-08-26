import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, ChevronLeft, ChevronRight, Globe, Loader2, FileText, Hash, X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import IslamHouseService, { IslamHouseBookPage, IslamHousePageContent } from '@/services/islamHouse.service';

interface BookReaderProps {
  bookId: number;
  bookTitle: string;
  initialPage?: number;
  isOpen: boolean;
  onClose: () => void;
}

export function BookReader({ bookId, bookTitle, initialPage = 1, isOpen, onClose }: BookReaderProps) {
  const [bookPage, setBookPage] = useState<IslamHouseBookPage | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('ar');
  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    if (isOpen && bookId) {
      loadPage(currentPage);
    }
  }, [isOpen, bookId, currentPage, selectedLanguage]);

  const loadPage = async (pageNumber: number) => {
    setIsLoading(true);
    setError(null);
    console.log(`📖 Loading page ${pageNumber} for book ${bookId} in language ${selectedLanguage}`);

    try {
      const page = await IslamHouseService.getBookPageData(bookId, pageNumber, [selectedLanguage, 'ar']);
      if (page) {
        setBookPage(page);
        console.log('✅ Page loaded successfully:', page);
      } else {
        setError(`لم يتم العثور على الصفحة ${pageNumber}`);
      }
    } catch (err) {
      console.error('❌ Error loading page:', err);
      setError('خطأ في تحميل الصفحة');
    } finally {
      setIsLoading(false);
    }
  };

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= (bookPage?.totalPages || 1)) {
      setCurrentPage(pageNumber);
    }
  };

  const nextPage = () => {
    if (currentPage < (bookPage?.totalPages || 1)) {
      goToPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 2, 24));
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 2, 12));
  };

  const resetFontSize = () => {
    setFontSize(16);
  };

  const renderContent = (content: IslamHousePageContent) => {
    const text = content.transes[selectedLanguage] || content.transes['ar'] || content.original_text;
    const isRTL = selectedLanguage === 'ar';

    const baseClasses = `leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`;
    
    switch (content.tag) {
      case 'h1':
        return (
          <h1 
            key={content.id} 
            className={`text-2xl font-bold mb-4 text-blue-900 dark:text-blue-200 ${baseClasses}`}
            style={{ fontSize: `${fontSize + 8}px` }}
          >
            {text}
          </h1>
        );
      case 'h2':
        return (
          <h2 
            key={content.id} 
            className={`text-xl font-semibold mb-3 text-blue-800 dark:text-blue-300 ${baseClasses}`}
            style={{ fontSize: `${fontSize + 4}px` }}
          >
            {text}
          </h2>
        );
      case 'h3':
        return (
          <h3 
            key={content.id} 
            className={`text-lg font-semibold mb-2 text-blue-700 dark:text-blue-400 ${baseClasses}`}
            style={{ fontSize: `${fontSize + 2}px` }}
          >
            {text}
          </h3>
        );
      case 'p':
        return (
          <p 
            key={content.id} 
            className={`mb-3 text-gray-800 dark:text-gray-200 ${baseClasses}`}
            style={{ fontSize: `${fontSize}px` }}
          >
            {text}
          </p>
        );
      default:
        return (
          <div 
            key={content.id} 
            className={`mb-2 ${baseClasses}`}
            style={{ fontSize: `${fontSize}px` }}
          >
            {text}
          </div>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white dark:bg-black border-2 border-black dark:border-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="border-0 h-full">
            {/* Header */}
            <CardHeader className="border-b border-black dark:border-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-6 w-6" />
                  <div>
                    <CardTitle className="text-xl">{bookTitle}</CardTitle>
                    <CardDescription>
                      الصفحة {currentPage} من {bookPage?.totalPages || '...'}
                    </CardDescription>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Font Controls */}
                  <div className="flex items-center gap-1 border border-gray-300 dark:border-gray-600 rounded-md p-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={decreaseFontSize}
                      className="h-8 w-8 p-0"
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetFontSize}
                      className="h-8 w-8 p-0"
                    >
                      <RotateCcw className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={increaseFontSize}
                      className="h-8 w-8 p-0"
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Language Selector */}
                  {bookPage && bookPage.availableLanguages.length > 1 && (
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                      <SelectTrigger className="w-32 border-black dark:border-white">
                        <Globe className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ar">العربية</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  )}

                  <Button variant="outline" onClick={onClose} className="border-black dark:border-white">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {bookPage && (
                <div className="flex gap-2 text-sm">
                  <Badge variant="outline" className="border-black dark:border-white">
                    {bookPage.content.filter(c => c.type === 'title').length} عنوان
                  </Badge>
                  <Badge variant="outline" className="border-black dark:border-white">
                    {bookPage.content.filter(c => c.type === 'paragraph').length} فقرة
                  </Badge>
                  <Badge variant="outline" className="border-green-500 text-green-700 dark:text-green-300">
                    حجم الخط: {fontSize}px
                  </Badge>
                </div>
              )}
            </CardHeader>

            {/* Content */}
            <CardContent className="p-0 overflow-y-auto max-h-[60vh]">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                    <p className="text-gray-600 dark:text-gray-400">جاري تحميل الصفحة...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="text-center py-12 space-y-4">
                  <FileText className="h-12 w-12 mx-auto text-red-400" />
                  <h3 className="text-lg font-semibold text-red-600">حدث خطأ</h3>
                  <p className="text-gray-600 dark:text-gray-400">{error}</p>
                  <Button onClick={() => loadPage(currentPage)} variant="outline">
                    إعادة المحاولة
                  </Button>
                </div>
              ) : bookPage && bookPage.content.length > 0 ? (
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`p-8 max-w-4xl mx-auto ${selectedLanguage === 'ar' ? 'text-right' : 'text-left'}`}
                  dir={selectedLanguage === 'ar' ? 'rtl' : 'ltr'}
                >
                  {bookPage.content.map(renderContent)}
                </motion.div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto text-gray-400" />
                  <p className="text-gray-600 dark:text-gray-400 mt-4">
                    لا يوجد محتوى في هذه الصفحة
                  </p>
                </div>
              )}
            </CardContent>

            {/* Footer Navigation */}
            <div className="border-t border-black dark:border-white p-4">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={previousPage}
                  disabled={currentPage <= 1 || isLoading}
                  className="border-black dark:border-white"
                >
                  <ChevronRight className="h-4 w-4 mr-2" />
                  الصفحة السابقة
                </Button>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      صفحة {currentPage} من {bookPage?.totalPages || '...'}
                    </span>
                  </div>
                  
                  {bookPage && (
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(currentPage / bookPage.totalPages) * 100}%` }}
                      />
                    </div>
                  )}
                </div>

                <Button
                  variant="outline"
                  onClick={nextPage}
                  disabled={currentPage >= (bookPage?.totalPages || 1) || isLoading}
                  className="border-black dark:border-white"
                >
                  الصفحة التالية
                  <ChevronLeft className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default BookReader;