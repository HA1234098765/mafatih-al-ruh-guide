import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, ChevronRight, Globe, Loader2, FileText, Hash, Eye } from 'lucide-react';
import { motion } from "framer-motion";
import IslamHouseService, { IslamHouseBookTableOfContents } from '@/services/islamHouse.service';
import BookReader from './BookReader';

interface BookTableOfContentsProps {
  bookId: number;
  bookTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export function BookTableOfContents({ bookId, bookTitle, isOpen, onClose }: BookTableOfContentsProps) {
  const [tableOfContents, setTableOfContents] = useState<IslamHouseBookTableOfContents | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('ar');
  
  // Book reader state
  const [readerOpen, setReaderOpen] = useState(false);
  const [readerPage, setReaderPage] = useState(1);

  useEffect(() => {
    if (isOpen && bookId) {
      loadTableOfContents();
    }
  }, [isOpen, bookId, selectedLanguage]);

  const loadTableOfContents = async () => {
    setIsLoading(true);
    setError(null);
    console.log(`📚 Loading table of contents for book ${bookId} in language ${selectedLanguage}`);

    try {
      const toc = await IslamHouseService.getBookTableOfContents(bookId, selectedLanguage);
      if (toc) {
        setTableOfContents(toc);
        console.log('✅ Table of contents loaded successfully:', toc);
      } else {
        setError('لم يتم العثور على فهرس للكتاب');
      }
    } catch (err) {
      console.error('❌ Error loading table of contents:', err);
      setError('خطأ في تحميل فهرس الكتاب');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChapterClick = (pageNumber: number) => {
    console.log(`🔗 Opening reader for page ${pageNumber}`);
    setReaderPage(pageNumber);
    setReaderOpen(true);
  };

  const handleLessonClick = (lessonId: number, pageNumber: number) => {
    console.log(`🔗 Opening reader for lesson ${lessonId} on page ${pageNumber}`);
    setReaderPage(pageNumber);
    setReaderOpen(true);
  };

  const openFullReader = () => {
    console.log(`📖 Opening full book reader from page 1`);
    setReaderPage(1);
    setReaderOpen(true);
  };

  if (!isOpen) return null;

  return (
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
        className="bg-white dark:bg-black border-2 border-black dark:border-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="border-0 h-full">
          <CardHeader className="border-b border-black dark:border-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BookOpen className="h-6 w-6" />
                <div>
                  <CardTitle className="text-xl">{bookTitle}</CardTitle>
                  <CardDescription>فهرس المحتويات</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {tableOfContents && tableOfContents.languages.length > 1 && (
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
                <Button 
                  onClick={openFullReader}
                  className="bg-green-600 text-white hover:bg-green-700 border-green-600"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  قراءة الكتاب
                </Button>
                <Button variant="outline" onClick={onClose} className="border-black dark:border-white">
                  إغلاق
                </Button>
              </div>
            </div>
            
            {tableOfContents && (
              <div className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Badge variant="outline" className="border-black dark:border-white">
                  {tableOfContents.chapters.length} فصل
                </Badge>
                <Badge variant="outline" className="border-black dark:border-white">
                  {tableOfContents.totalPages} صفحة
                </Badge>
                <Badge variant="outline" className="border-black dark:border-white">
                  {tableOfContents.titles.length} عنوان
                </Badge>
              </div>
            )}
          </CardHeader>

          <CardContent className="p-0 overflow-y-auto max-h-[60vh]">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                  <p className="text-gray-600 dark:text-gray-400">جاري تحميل فهرس الكتاب...</p>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-12 space-y-4">
                <FileText className="h-12 w-12 mx-auto text-red-400" />
                <h3 className="text-lg font-semibold text-red-600">حدث خطأ</h3>
                <p className="text-gray-600 dark:text-gray-400">{error}</p>
                <Button onClick={loadTableOfContents} variant="outline">
                  إعادة المحاولة
                </Button>
              </div>
            ) : tableOfContents ? (
              <div className="p-6 space-y-6">
                {tableOfContents.chapters.map((chapter, chapterIndex) => (
                  <motion.div
                    key={chapterIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: chapterIndex * 0.1 }}
                    className="space-y-3"
                  >
                    {/* Chapter Title */}
                    <div
                      className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                      onClick={() => handleChapterClick(chapter.pageNumber)}
                    >
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {chapterIndex + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-blue-900 dark:text-blue-200">
                          {chapter.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                        <Hash className="h-4 w-4" />
                        <span className="text-sm font-medium">صفحة {chapter.pageNumber}</span>
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </div>

                    {/* Lessons */}
                    {chapter.lessons.length > 0 && (
                      <div className="mr-6 space-y-2">
                        {chapter.lessons.map((lesson, lessonIndex) => (
                          <motion.div
                            key={lesson.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: (chapterIndex * 0.1) + (lessonIndex * 0.05) }}
                            className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg cursor-pointer transition-colors"
                            onClick={() => handleLessonClick(lesson.id, lesson.pageNumber)}
                          >
                            <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full flex items-center justify-center text-xs">
                              {lessonIndex + 1}
                            </div>
                            <div className="flex-1">
                              <p className="text-gray-800 dark:text-gray-200">{lesson.title}</p>
                            </div>
                            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                              <Hash className="h-3 w-3" />
                              <span className="text-xs">صفحة {lesson.pageNumber}</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-gray-400" />
                <p className="text-gray-600 dark:text-gray-400 mt-4">
                  لا يوجد فهرس متاح لهذا الكتاب
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Book Reader Modal */}
      <BookReader
        bookId={bookId}
        bookTitle={bookTitle}
        initialPage={readerPage}
        isOpen={readerOpen}
        onClose={() => setReaderOpen(false)}
      />
    </motion.div>
  );
}

export default BookTableOfContents;