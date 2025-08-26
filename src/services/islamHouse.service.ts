/**
 * Islam House API Service
 * Service for fetching Islamic content from the Islam House API
 * Based on the provided Postman collection
 */

// Base URL configuration with new API v3 endpoint
const isDevelopment = import.meta.env.DEV;
const API_KEY = 'paV29H2gm56kvLPy';
const BASE_URL = isDevelopment 
  ? '/api/islamhouse-v3'  // Use Vite proxy in development
  : `https://api3.islamhouse.com/v3/${API_KEY}`;  // New API v3 endpoint

// Alternative API endpoints to try if primary fails
const ALTERNATIVE_ENDPOINTS = [
  'https://api.islamhouse.com/v1',
  'https://islamhouse.com/api/v1',
  'https://content.islamhouse.com/api/v1'
];

// Types for Islam House API responses
export interface IslamHouseCategory {
  id: number;
  title: string;
  name?: string;
  name_ar?: string;
  description?: string;
  parent_id?: number;
  subcategories?: IslamHouseCategory[];
}

export interface IslamHouseAuthor {
  id: number;
  name: string;
  title?: string;
  name_ar?: string;
  biography?: string;
  image?: string;
  content_count?: number;
}

// Authors list API response structure (simplified)
export interface IslamHouseAuthorListItem {
  id: number;
  name: string;
}

export interface IslamHouseAuthorsListResponse {
  data: IslamHouseAuthorListItem[];
}

export interface IslamHouseBook {
  id: number;
  title: string;
  title_ar?: string;
  description?: string;
  description_ar?: string;
  priority_level: number;
  languages: string[];
  authors: number[];
  categories: number[];
  book_type: number | null;
  author_names?: string[];
  category_names?: string[];
  book_type_name?: string;
  total_pages?: number;
}

export interface IslamHouseBookInfo {
  id: number;
  title: string;
  description: string;
  priority_level: number;
  languages: string[];
  authors: number[];
  categories: number[];
  book_type: number;
  total_pages?: number;
  author_names?: string[];
  category_names?: string[];
  book_type_name?: string;
}

export interface IslamHouseBookInfoResponse {
  data: IslamHouseBookInfo;
  meta?: {
    total_pages?: number;
  };
}

export interface IslamHouseBookTitle {
  id: number;
  tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  type: 'title';
  splitted: number;
  split_group: number;
  original_text: string;
  page_number: number;
  transes: {
    [language: string]: string;
  };
}

export interface IslamHouseBookTitlesResponse {
  data: IslamHouseBookTitle[];
}

export interface IslamHouseBookTableOfContents {
  bookId: number;
  titles: IslamHouseBookTitle[];
  languages: string[];
  totalPages: number;
  chapters: {
    title: string;
    pageNumber: number;
    lessons: {
      title: string;
      pageNumber: number;
      id: number;
    }[];
  }[];
}

export interface IslamHousePageContent {
  id: number;
  tag: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  type: 'paragraph' | 'title';
  splitted: number;
  split_group: number;
  original_text: string;
  page_number: number;
  transes: {
    [language: string]: string;
  };
}

export interface IslamHousePageDataResponse {
  data: IslamHousePageContent[];
  meta: {
    total_pages: number;
  };
}

export interface IslamHouseBookPage {
  pageNumber: number;
  content: IslamHousePageContent[];
  totalPages: number;
  bookId: number;
  availableLanguages: string[];
}

export interface IslamHouseBookType {
  id: number;
  title?: string;
  name?: string;
}

// Book types list API response structure
export interface IslamHouseBookTypeListItem {
  id: number;
  name: string;
}

export interface IslamHouseBookTypesListResponse {
  data: IslamHouseBookTypeListItem[];
}

export interface IslamHouseApiMeta {
  authors: IslamHouseAuthor[];
  categories: IslamHouseCategory[];
  book_types: IslamHouseBookType[];
  section_name: string;
}

export interface IslamHouseContent {
  id: number;
  title: string;
  title_ar?: string;
  description?: string;
  description_ar?: string;
  content_type: 'article' | 'audio' | 'video' | 'book' | 'fatwa';
  category_id?: number;
  category_name?: string;
  author_id?: number;
  author_name?: string;
  author_name_ar?: string;
  url?: string;
  download_url?: string;
  image?: string;
  duration?: string;
  file_size?: string;
  language: string;
  languages?: string[];
  authors?: number[];
  categories?: number[];
  book_type?: number;
  publication_date?: string;
  views_count?: number;
  tags?: string[];
  source?: string;
  is_featured?: boolean;
  created_at?: string;
  updated_at?: string;
  priority_level?: number;
  total_pages?: number;
}

export interface IslamHouseLanguage {
  code: string;
  name: string;
  name_ar?: string;
  direction: 'ltr' | 'rtl';
}

// ===== API v3 Official Types (Based on Documentation) =====

/**
 * Response from /main/sitecontent endpoint - provides all available content types
 */
export interface IslamHouseAPIv3SiteContentResponse {
  block_name: string;
  type: string;
  items_count: number;
  api_url: string;
}

/**
 * Individual content item from API v3
 */
export interface IslamHouseAPIv3Item {
  id: number;
  title: string;
  description?: string;
  type: string; // book, article, audio, video etc
  slang: string; // source language (original language)
  flang: string[]; // interface languages (localizations)
  authors?: number[];
  categories?: number[];
  sources?: number[]; // publishers
  url?: string;
  publication_date?: string;
  priority_level?: number;
  file_size?: string;
  duration?: string;
}

/**
 * Author information from API v3
 */
export interface IslamHouseAPIv3Author {
  id: number;
  name: string;
  kind: string; // writer, translator, reviewer etc
  items_count?: number;
}

/**
 * Category information from API v3
 */
export interface IslamHouseAPIv3Category {
  id: number;
  name: string;
  items_count?: number;
}

/**
 * API v3 Request Parameters
 */
export interface APIv3Params {
  key?: string; // API key
  flang?: string; // interface language (ISO 639-1 or 'showall')
  slang?: string; // source language (ISO 639-1 or 'showall')
  type?: string; // item type (book, article, audio, video, or 'showall')
  kind?: string; // author kind (writer, translator, reviewer, or 'showall')
  id?: number;
  categoryId?: number;
  authorId?: number;
  sorttype?: 'countdesc' | 'countasc';
  period?: 'all' | 'year' | 'month' | 'week' | 'day';
  pageNum?: number; // pagination page number
  limit?: number; // max 50 records
  format?: 'json'; // only json supported
}

/**
 * Unified content interface for both legacy and API v3
 */
export interface UnifiedIslamHouseContent extends IslamHouseContent {
  api_version?: 'v1' | 'v3';
  original_data?: any; // Store original API response for debugging
}

// =============================================================================
// ISLAM HOUSE API V3 INTERFACES - COMPREHENSIVE TYPE DEFINITIONS
// =============================================================================

/**
 * API v3 Site Content Item - Core data structure for all content types
 * Based on the official Islam House API v3 documentation
 */
export interface APIv3SiteContentItem {
  // Core identification
  id: number;
  type?: string; // Content type indicator
  
  // Title information (multi-language support)
  title?: string;
  title_ar?: string;
  title_en?: string;
  
  // Description information (multi-language support)
  description?: string;
  description_ar?: string;
  description_en?: string;
  brief?: string;
  brief_ar?: string;
  
  // Author information
  author_id?: number;
  author_name?: string;
  author_name_ar?: string;
  authors?: {
    id: number;
    name: string;
    name_ar?: string;
  }[];
  
  // Category information
  category_id?: number;
  category_name?: string;
  categories?: {
    id: number;
    name: string;
    name_ar?: string;
  }[];
  
  // Content URLs and links
  url?: string;
  download_url?: string;
  read_url?: string;
  listen_url?: string;
  watch_url?: string;
  
  // Media information
  image_url?: string;
  thumbnail_url?: string;
  cover_image?: string;
  
  // File metadata
  file_size?: string;
  file_format?: string;
  duration?: string;
  
  // Content metadata
  language?: string;
  languages?: string[];
  publication_date?: string;
  created_at?: string;
  updated_at?: string;
  
  // Book-specific fields
  book_type?: number;
  book_type_name?: string;
  total_pages?: number;
  pages_count?: number;
  
  // Engagement metrics
  views?: number;
  downloads?: number;
  rating?: number;
  
  // Content flags
  featured?: boolean;
  is_featured?: boolean;
  is_premium?: boolean;
  is_free?: boolean;
  
  // Priority and ordering
  priority_level?: number;
  sort_order?: number;
  
  // Tags and classification
  tags?: string[];
  keywords?: string[];
  subjects?: string[];
  
  // Additional metadata
  source?: string;
  source_url?: string;
  license?: string;
  copyright?: string;
  
  // Technical fields
  format?: string;
  encoding?: string;
  quality?: string;
  
  // Series information (for multi-part content)
  series_id?: number;
  series_title?: string;
  part_number?: number;
  total_parts?: number;
  
  // Relationships
  related_content?: number[];
  translations?: {
    language: string;
    url: string;
    title?: string;
  }[];
}

/**
 * API v3 Site Content Response - Root response structure
 */
export interface APIv3SiteContentResponse {
  data?: APIv3SiteContentItem[];
  meta?: {
    total?: number;
    per_page?: number;
    current_page?: number;
    last_page?: number;
    from?: number;
    to?: number;
  };
  links?: {
    first?: string;
    last?: string;
    prev?: string;
    next?: string;
  };
  message?: string;
  status?: string;
}

/**
 * API v3 Content Types - Enumeration of supported content types
 */
export type APIv3ContentType = 
  | 'book' 
  | 'article' 
  | 'audio' 
  | 'video' 
  | 'fatwa' 
  | 'lecture' 
  | 'sermon' 
  | 'lesson' 
  | 'course';

/**
 * API v3 Language Codes - Supported interface and content languages
 */
export type APIv3LanguageCode = 
  | 'ar'  // Arabic
  | 'en'  // English
  | 'fr'  // French
  | 'es'  // Spanish
  | 'de'  // German
  | 'tr'  // Turkish
  | 'ur'  // Urdu
  | 'fa'  // Persian
  | 'id'  // Indonesian
  | 'ms'  // Malay
  | 'bn'  // Bengali
  | 'hi'  // Hindi
  | 'ru'  // Russian
  | 'zh'  // Chinese
  | 'other'; // For unsupported languages

/**
 * API v3 Response Format - Supported response formats
 */
export type APIv3ResponseFormat = 'json' | 'xml';

/**
 * API v3 Fetch Options - Configuration for API v3 requests
 */
export interface APIv3FetchOptions {
  /** Interface language (language of labels, UI elements) */
  flang?: APIv3LanguageCode;
  
  /** Source content language (language of the actual content) */
  slang?: APIv3LanguageCode;
  
  /** Response format */
  format?: APIv3ResponseFormat;
  
  /** Maximum number of records to return (API limit: 50) */
  limit?: number;
  
  /** Number of records to skip for pagination */
  offset?: number;
  
  /** Filter by specific content type */
  contentType?: APIv3ContentType;
  
  /** Filter by category ID */
  categoryId?: number;
  
  /** Filter by author ID */
  authorId?: number;
  
  /** Search query string */
  query?: string;
  
  /** Sort field and direction */
  sort?: string;
  
  /** Filter by featured content only */
  featured?: boolean;
  
  /** Filter by free content only */
  freeOnly?: boolean;
  
  /** Minimum priority level */
  minPriority?: number;
  
  /** Date range filter - start date */
  dateFrom?: string;
  
  /** Date range filter - end date */
  dateTo?: string;
}

/**
 * API v3 Error Response - Structure for error responses
 */
export interface APIv3ErrorResponse {
  error: {
    code: number;
    message: string;
    details?: string;
    timestamp?: string;
  };
  status: 'error';
}

/**
 * API v3 Service Response - Generic response wrapper
 */
export interface APIv3ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    total?: number;
    fetched?: number;
    cached?: boolean;
    responseTime?: number;
    apiVersion?: string;
  };
}

// =============================================================================
// END OF API V3 INTERFACES
// =============================================================================

export interface IslamHouseApiResponse<T> {
  success?: boolean;
  data: T;
  meta?: IslamHouseApiMeta;
  message?: string;
  total_count?: number;
  current_page?: number;
  per_page?: number;
  total_pages?: number;
}

// Search and filter parameters
export interface ContentFilters {
  lang?: string;
  name?: string;
  subject_category?: string;
  author?: string;
  sort_by?: 'latest' | 'popular' | 'oldest' | 'title';
  content_type?: string;
  page?: number;
  limit?: number;
}

class IslamHouseService {
  private static instance: IslamHouseService;
  private apiStatus: { isWorking: boolean; lastChecked: Date; errorMessage: string | null } = {
    isWorking: false,
    lastChecked: new Date(),
    errorMessage: null
  };

  private constructor() {}

  public static getInstance(): IslamHouseService {
    if (!IslamHouseService.instance) {
      IslamHouseService.instance = new IslamHouseService();
    }
    return IslamHouseService.instance;
  }

  /**
   * Check API connectivity status
   */
  public async checkAPIConnectivity(): Promise<{ isWorking: boolean; errorMessage: string | null }> {
    console.log('🔍 Checking Islam House API connectivity...');
    
    // Try the main endpoint first
    try {
      const response = await fetch(`${BASE_URL}/categories?lang=ar`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        this.apiStatus = { isWorking: true, lastChecked: new Date(), errorMessage: null };
        console.log('✅ API connectivity check successful');
        return { isWorking: true, errorMessage: null };
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ API connectivity check failed:', errorMessage);
      
      // Try alternative endpoints
      for (const endpoint of ALTERNATIVE_ENDPOINTS) {
        try {
          console.log(`🔄 Trying alternative endpoint: ${endpoint}`);
          const response = await fetch(`${endpoint}/categories?lang=ar`, {
            method: 'GET',
            mode: 'cors',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          });
          
          if (response.ok) {
            console.log(`✅ Alternative endpoint working: ${endpoint}`);
            this.apiStatus = { isWorking: true, lastChecked: new Date(), errorMessage: null };
            return { isWorking: true, errorMessage: null };
          }
        } catch (altError) {
          console.log(`❌ Alternative endpoint failed: ${endpoint}`);
        }
      }
      
      // All endpoints failed
      let detailedError = 'API connectivity failed: ';
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
        detailedError += 'Network connection issue - please check your internet connection';
      } else if (errorMessage.includes('CORS')) {
        detailedError += 'CORS policy blocking the request - API server configuration issue';
      } else if (errorMessage.includes('404')) {
        detailedError += 'API endpoints not found - the Islam House API may have changed or been discontinued';
      } else {
        detailedError += errorMessage;
      }
      
      this.apiStatus = { isWorking: false, lastChecked: new Date(), errorMessage: detailedError };
      return { isWorking: false, errorMessage: detailedError };
    }
  }

  /**
   * API Discovery - Test various endpoints and methods to find working routes
   */
  public async discoverAPI(): Promise<{
    workingEndpoints: { endpoint: string; method: string; status: number; response?: any }[];
    failedEndpoints: { endpoint: string; method: string; status: number; error: string }[];
  }> {
    console.log('🔍 Starting API discovery...');
    
    const baseUrl = 'https://cnt.islamhouse.com';
    const endpoints = [
      // Common API patterns
      '/api/v1',
      '/api/v1/',
      '/api/v2',
      '/api/v2/',
      '/api',
      '/api/',
      // Specific endpoints
      '/api/v1/books',
      '/api/v1/categories',
      '/api/v1/authors',
      '/api/v1/content',
      '/api/books',
      '/api/categories', 
      '/api/authors',
      '/api/content',
      // Alternative patterns
      '/books',
      '/categories',
      '/authors',
      '/content',
      // Documentation endpoints
      '/docs',
      '/documentation',
      '/swagger',
      '/openapi',
      // Health check
      '/health',
      '/status',
      '/ping'
    ];
    
    const methods = ['GET', 'POST', 'OPTIONS'];
    const workingEndpoints: { endpoint: string; method: string; status: number; response?: any }[] = [];
    const failedEndpoints: { endpoint: string; method: string; status: number; error: string }[] = [];
    
    for (const endpoint of endpoints) {
      for (const method of methods) {
        try {
          console.log(`🧪 Testing ${method} ${baseUrl}${endpoint}`);
          
          const response = await fetch(`${baseUrl}${endpoint}`, {
            method: method,
            mode: 'cors',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            // Add timeout
            signal: AbortSignal.timeout(5000)
          });
          
          console.log(`📊 ${method} ${endpoint}: ${response.status}`);
          
          if (response.ok) {
            try {
              const data = await response.json();
              workingEndpoints.push({
                endpoint,
                method,
                status: response.status,
                response: data
              });
              console.log(`✅ Working endpoint found: ${method} ${endpoint}`);
            } catch (jsonError) {
              // Response is OK but not JSON
              workingEndpoints.push({
                endpoint,
                method,
                status: response.status
              });
            }
          } else {
            failedEndpoints.push({
              endpoint,
              method,
              status: response.status,
              error: response.statusText
            });
          }
          
          // Small delay to avoid overwhelming the server
          await new Promise(resolve => setTimeout(resolve, 100));
          
        } catch (error) {
          failedEndpoints.push({
            endpoint,
            method,
            status: 0,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
          console.log(`❌ ${method} ${endpoint}: ${error instanceof Error ? error.message : 'Error'}`);
        }
      }
    }
    
    console.log('🎯 API Discovery Results:');
    console.log('✅ Working endpoints:', workingEndpoints);
    console.log('❌ Failed endpoints:', failedEndpoints.slice(0, 10)); // Show first 10 failures
    
    return { workingEndpoints, failedEndpoints };
  }

  /**
   * Test the new API v3 endpoint structure
   */
  public async testAPIv3(): Promise<{ success: boolean; data?: any; error?: string }> {
    console.log('🧪 Testing new API v3 endpoint...');
    
    try {
      const endpoint = '/main/sitecontent/ar/ar/json';
      const url = `${BASE_URL}${endpoint}`;
      
      console.log('🌐 Testing API v3 URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      console.log('📡 API v3 Response status:', response.status);
      console.log('📡 API v3 Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ API v3 test successful! Data:', data);
        
        // Update API status
        this.apiStatus = {
          isWorking: true,
          lastChecked: new Date(),
          errorMessage: null
        };
        
        return { success: true, data };
      } else {
        const errorText = await response.text();
        console.error('❌ API v3 test failed:', response.status, errorText);
        return { success: false, error: `HTTP ${response.status}: ${errorText}` };
      }
    } catch (error) {
      console.error('❌ API v3 test failed with error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Comprehensive API connection test with detailed diagnostics and proxy support
   */
  public async testAPIConnection(): Promise<{
    success: boolean;
    data?: any;
    error?: string;
    diagnostics: {
      environment: string;
      usingProxy: boolean;
      baseUrlAccessible: boolean;
      categoriesEndpoint: boolean;
      booksEndpoint: boolean;
      corsIssue: boolean;
      networkIssue: boolean;
      proxyIssue: boolean;
      detectedIssues: string[];
    };
  }> {
    console.log('🧪 Starting comprehensive API diagnostics with proxy support...');
    
    const diagnostics = {
      environment: isDevelopment ? 'Development' : 'Production',
      usingProxy: isDevelopment,
      baseUrlAccessible: false,
      categoriesEndpoint: false,
      booksEndpoint: false,
      corsIssue: false,
      networkIssue: false,
      proxyIssue: false,
      detectedIssues: [] as string[]
    };

    console.log(`🌐 Environment: ${diagnostics.environment}`);
    console.log(`🔗 Using proxy: ${diagnostics.usingProxy}`);
    console.log(`📋 Base URL: ${BASE_URL}`);

    try {
      // Test 1: Check proxy functionality in development
      if (isDevelopment) {
        console.log('🔍 Test 1: Checking Vite proxy functionality...');
        try {
          const proxyTestResponse = await fetch('/api/islamhouse/categories?lang=ar', {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          });
          
          console.log('📡 Proxy test response status:', proxyTestResponse.status);
          
          if (proxyTestResponse.ok) {
            console.log('✅ Vite proxy is working');
            const data = await proxyTestResponse.json();
            return {
              success: true,
              data: data,
              diagnostics
            };
          } else {
            diagnostics.proxyIssue = true;
            diagnostics.detectedIssues.push(`Vite proxy returned ${proxyTestResponse.status}: ${proxyTestResponse.statusText}`);
            console.log(`❌ Vite proxy failed: ${proxyTestResponse.status}`);
          }
        } catch (error) {
          diagnostics.proxyIssue = true;
          if (error instanceof Error && error.message.includes('CORS')) {
            diagnostics.corsIssue = true;
            diagnostics.detectedIssues.push('CORS policy still blocking requests despite proxy');
          } else if (error instanceof Error && error.message.includes('fetch')) {
            diagnostics.networkIssue = true;
            diagnostics.detectedIssues.push('Network connectivity issue with proxy');
          } else {
            diagnostics.detectedIssues.push('Vite proxy configuration issue');
          }
          console.log('❌ Vite proxy test failed:', error);
        }
      }

      // Test 2: Check if base URL is accessible (for production or proxy fallback)
      console.log('🔍 Test 2: Checking base URL accessibility...');
      try {
        const baseUrl = isDevelopment ? 'https://cnt.islamhouse.com' : BASE_URL.replace('/api/v1', '');
        const baseResponse = await fetch(baseUrl, {
          method: 'GET',
          mode: 'no-cors' // This will at least tell us if the domain is reachable
        });
        diagnostics.baseUrlAccessible = true;
        console.log('✅ Base URL is accessible');
      } catch (error) {
        diagnostics.networkIssue = true;
        diagnostics.detectedIssues.push('Base domain not accessible - network or DNS issue');
        console.log('❌ Base URL not accessible');
      }

      // Test 3: Check categories endpoint
      console.log('🔍 Test 3: Testing categories endpoint...');
      try {
        const categoriesUrl = `${BASE_URL}/categories?lang=ar`;
        const categoriesResponse = await fetch(categoriesUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });
        
        if (categoriesResponse.ok) {
          diagnostics.categoriesEndpoint = true;
          const data = await categoriesResponse.json();
          console.log('✅ Categories endpoint working');
          return {
            success: true,
            data: data,
            diagnostics
          };
        } else {
          diagnostics.detectedIssues.push(`Categories endpoint returned ${categoriesResponse.status}: ${categoriesResponse.statusText}`);
          console.log(`❌ Categories endpoint failed: ${categoriesResponse.status}`);
        }
      } catch (error) {
        if (error instanceof Error && error.message.includes('CORS')) {
          diagnostics.corsIssue = true;
          diagnostics.detectedIssues.push('CORS policy blocking API requests');
        } else if (error instanceof Error && error.message.includes('fetch')) {
          diagnostics.networkIssue = true;
          diagnostics.detectedIssues.push('Network connectivity issue');
        }
        console.log('❌ Categories endpoint failed:', error);
      }

      // Test 4: Check books endpoint
      console.log('🔍 Test 4: Testing books endpoint...');
      try {
        const booksUrl = `${BASE_URL}/books/list-books`;
        const booksResponse = await fetch(booksUrl, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });
        
        if (booksResponse.ok) {
          diagnostics.booksEndpoint = true;
          console.log('✅ Books endpoint working');
        } else {
          diagnostics.detectedIssues.push(`Books endpoint returned ${booksResponse.status}: ${booksResponse.statusText}`);
          console.log(`❌ Books endpoint failed: ${booksResponse.status}`);
        }
      } catch (error) {
        console.log('❌ Books endpoint failed:', error);
      }

      // Generate summary
      let errorMessage = 'API connectivity tests failed. Issues detected:\n';
      
      if (isDevelopment && diagnostics.proxyIssue) {
        errorMessage += '\n🔗 PROXY ISSUES:\n';
        errorMessage += '- Vite proxy may not be configured correctly\n';
        errorMessage += '- Restart the development server\n';
        errorMessage += '- Check vite.config.ts proxy settings\n';
      }
      
      diagnostics.detectedIssues.forEach((issue, index) => {
        errorMessage += `${index + 1}. ${issue}\n`;
      });
      
      if (diagnostics.detectedIssues.length === 0) {
        errorMessage = 'Unknown API issue - endpoints are not responding as expected';
      }

      console.log('📊 Diagnostics summary:', diagnostics);
      
      return {
        success: false,
        error: errorMessage,
        diagnostics
      };
      
    } catch (error) {
      console.error('❌ API diagnostics failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error during API testing',
        diagnostics
      };
    }
  }

  /**
   * Generic API request method with improved error handling and proxy support
   */
  private async makeRequest<T>(endpoint: string, params: Record<string, string> = {}, method: 'GET' | 'POST' = 'GET'): Promise<T> {
    try {
      let url: string;
      let requestOptions: RequestInit;

      // Log environment and URL configuration
      console.log('🌐 Environment:', isDevelopment ? 'Development (using proxy)' : 'Production (direct API)');
      console.log('🔗 Base URL:', BASE_URL);

      if (method === 'GET') {
        const urlObj = new URL(`${BASE_URL}${endpoint}`, window.location.origin);
        // Add query parameters for GET requests
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            urlObj.searchParams.append(key, value);
          }
        });
        url = urlObj.toString();
        requestOptions = {
          method: 'GET',
          mode: isDevelopment ? 'cors' : 'cors',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        };
      } else {
        // POST request with data in body
        url = `${BASE_URL}${endpoint}`;
        requestOptions = {
          method: 'POST',
          mode: isDevelopment ? 'cors' : 'cors',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: Object.keys(params).length > 0 ? JSON.stringify(params) : '',
        };
      }

      console.log('🌐 Making request to:', url);
      console.log('📡 Request method:', method);
      console.log('📦 Request options:', requestOptions);

      const response = await fetch(url, requestOptions);

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ HTTP Error Response:', errorText);
        
        // Provide specific error messages based on status code
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        if (response.status === 404) {
          errorMessage = isDevelopment 
            ? 'API endpoint not found (404) - Check if the proxy is configured correctly'
            : 'API endpoint not found (404) - The Islam House API may have changed or been discontinued';
        } else if (response.status === 403) {
          errorMessage = 'Access forbidden (403) - API access denied or authentication required';
        } else if (response.status >= 500) {
          errorMessage = 'Server error - The Islam House API server is experiencing issues';
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('✅ Response data:', data);
      return data;
    } catch (error) {
      console.error(`❌ Error fetching ${endpoint}:`, error);
      
      // Provide detailed error information based on error type
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('🚫 Network error - possibly CORS or connection issue');
        console.error('🔍 Detailed diagnosis:');
        
        if (isDevelopment) {
          console.error('   - Check if Vite dev server proxy is working');
          console.error('   - Restart dev server if proxy config changed');
          console.error('   - Check browser console for proxy errors');
        } else {
          console.error('   - Check internet connection');
          console.error('   - Islam House API may be down or changed');
          console.error('   - CORS policy may be blocking the request');
        }
        
        // Update API status
        this.apiStatus = {
          isWorking: false,
          lastChecked: new Date(),
          errorMessage: isDevelopment 
            ? 'Proxy/Network error - Check Vite proxy configuration'
            : 'Network/CORS error - Islam House API is not accessible'
        };
        
        // Only try alternative proxy approach in development if direct proxy fails
        if (isDevelopment) {
          console.error('🔧 Proxy request failed, falling back to sample data...');
          throw new Error('Development proxy failed. Using fallback content.');
        } else {
          console.error('🔧 Trying alternative approach...');
          
          // Try with a different approach for CORS
          try {
            return await this.makeRequestWithProxy<T>(endpoint, params, method);
          } catch (proxyError) {
            console.error('❌ Proxy request also failed:', proxyError);
            throw new Error('Islam House API is currently unavailable. Using fallback content.');
          }
        }
      }
      
      throw error;
    }
  }

  /**
   * Alternative request method using a different approach for CORS issues
   */
  private async makeRequestWithProxy<T>(endpoint: string, params: Record<string, string> = {}, method: 'GET' | 'POST' = 'GET'): Promise<T> {
    // For development, we can try using a public CORS proxy
    const proxyUrl = 'https://api.allorigins.win/raw?url=';
    const url = new URL(`${BASE_URL}${endpoint}`);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, value);
      }
    });

    const proxiedUrl = proxyUrl + encodeURIComponent(url.toString());
    console.log('🔄 Trying proxy request to:', proxiedUrl);

    const response = await fetch(proxiedUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Proxy request failed! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Proxy response data:', data);
    return data;
  }

  /**
   * Get all available categories
   */
  public async getCategories(lang: string = 'ar'): Promise<IslamHouseCategory[]> {
    console.log('📂 Fetching categories for language:', lang);
    
    try {
      const response = await this.makeRequest<IslamHouseApiResponse<IslamHouseCategory[]>>('/categories', {
        lang
      });
      
      console.log('✅ Categories response:', response);
      
      if (response && response.data && Array.isArray(response.data)) {
        console.log(`📊 Successfully fetched ${response.data.length} categories`);
        return response.data;
      } else if (response && Array.isArray(response)) {
        console.log(`📊 Successfully fetched ${response.length} categories (direct array)`);
        return response as IslamHouseCategory[];
      } else {
        console.warn('⚠️ Categories response format unexpected, using fallback');
        return this.getFallbackCategories();
      }
    } catch (error) {
      console.error('❌ Error fetching categories:', error);
      console.log('🔄 Using fallback categories...');
      return this.getFallbackCategories();
    }
  }

  /**
   * Get book titles/table of contents with multilingual support
   */
  public async getBookTitles(bookId: number, languages: string[] = ['ar', 'en']): Promise<IslamHouseBookTitle[]> {
    console.log(`📑 Fetching book titles for book ID: ${bookId} with languages: ${languages.join(', ')}`);
    
    try {
      const langParam = languages.join(',');
      const response = await this.makeRequest<IslamHouseBookTitlesResponse>(`/books/book-titles/${bookId}/?transes=${langParam}`, {}, 'POST');
      
      console.log('✅ Book titles response:', response);
      
      if (response && response.data && Array.isArray(response.data)) {
        const titles = response.data;
        console.log(`📊 Successfully fetched ${titles.length} titles/chapters for book ${bookId}`);
        console.log('📝 Sample titles:', titles.slice(0, 3));
        return titles;
      } else {
        console.warn('⚠️ Book titles response format unexpected');
        return [];
      }
    } catch (error) {
      console.error(`❌ Error fetching book titles for ID ${bookId}:`, error);
      return [];
    }
  }

  /**
   * Get page content/data for a specific book page
   */
  public async getBookPageData(bookId: number, pageNumber: number, languages: string[] = ['ar', 'en']): Promise<IslamHouseBookPage | null> {
    console.log(`📝 Fetching page ${pageNumber} data for book ID: ${bookId} with languages: ${languages.join(', ')}`);
    
    try {
      const langParam = languages.join(',');
      const response = await this.makeRequest<IslamHousePageDataResponse>(`/books/page-data/${bookId}?page_number=${pageNumber}&transes=${langParam}`, {}, 'POST');
      
      console.log('✅ Page data response:', response);
      
      if (response && response.data && Array.isArray(response.data)) {
        const pageContent = response.data;
        const availableLanguages = Array.from(new Set(pageContent.flatMap(item => Object.keys(item.transes))));
        
        const bookPage: IslamHouseBookPage = {
          pageNumber,
          content: pageContent,
          totalPages: response.meta?.total_pages || 1,
          bookId,
          availableLanguages
        };
        
        console.log(`📊 Successfully fetched page ${pageNumber} with ${pageContent.length} content items`);
        console.log('📝 Sample content:', pageContent.slice(0, 2));
        return bookPage;
      } else {
        console.warn('⚠️ Page data response format unexpected');
        return null;
      }
    } catch (error) {
      console.error(`❌ Error fetching page data for book ${bookId}, page ${pageNumber}:`, error);
      return null;
    }
  }

  /**
   * Get formatted page content in a specific language
   */
  public getFormattedPageContent(bookPage: IslamHouseBookPage, language: string = 'ar'): string {
    if (!bookPage || !bookPage.content) {
      return '';
    }

    return bookPage.content
      .map(item => {
        const text = item.transes[language] || item.transes['ar'] || item.original_text;
        
        // Format based on tag type
        switch (item.tag) {
          case 'h1':
            return `# ${text}\n\n`;
          case 'h2':
            return `## ${text}\n\n`;
          case 'h3':
            return `### ${text}\n\n`;
          case 'p':
            return `${text}\n\n`;
          default:
            return `${text}\n\n`;
        }
      })
      .join('')
      .trim();
  }
  public async getBookTableOfContents(bookId: number, language: string = 'ar'): Promise<IslamHouseBookTableOfContents | null> {
    console.log(`📚 Building table of contents for book ID: ${bookId} in language: ${language}`);
    
    try {
      const titles = await this.getBookTitles(bookId, [language, 'ar']);
      
      if (titles.length === 0) {
        console.warn('⚠️ No titles found for table of contents');
        return null;
      }
      
      // Organize titles into chapters and lessons
      const chapters: IslamHouseBookTableOfContents['chapters'] = [];
      let currentChapter: any = null;
      
      titles.forEach(title => {
        const titleText = title.transes[language] || title.transes['ar'] || title.original_text;
        
        if (title.tag === 'h1') {
          // This is a chapter
          currentChapter = {
            title: titleText,
            pageNumber: title.page_number,
            lessons: []
          };
          chapters.push(currentChapter);
        } else if (title.tag === 'h2' && currentChapter) {
          // This is a lesson
          currentChapter.lessons.push({
            title: titleText,
            pageNumber: title.page_number,
            id: title.id
          });
        }
      });
      
      const tableOfContents: IslamHouseBookTableOfContents = {
        bookId,
        titles,
        languages: Array.from(new Set(titles.flatMap(t => Object.keys(t.transes)))),
        totalPages: Math.max(...titles.map(t => t.page_number)),
        chapters
      };
      
      console.log(`📊 Built table of contents with ${chapters.length} chapters and ${titles.length} total titles`);
      return tableOfContents;
    } catch (error) {
      console.error(`❌ Error building table of contents for book ${bookId}:`, error);
      return null;
    }
  }
  public async getBookInfo(bookId: number, locale: string = 'ar'): Promise<IslamHouseBookInfo | null> {
    console.log(`📖 Fetching detailed info for book ID: ${bookId} with locale: ${locale}`);
    
    try {
      const response = await this.makeRequest<IslamHouseBookInfoResponse>(`/books/book-info/${bookId}?locale=${locale}`, {}, 'POST');
      
      console.log('✅ Book info response:', response);
      
      if (response && response.data) {
        const bookInfo = response.data;
        
        // Add total pages from meta
        if (response.meta && response.meta.total_pages) {
          bookInfo.total_pages = response.meta.total_pages;
        }
        
        console.log(`📊 Successfully fetched book info for "${bookInfo.title}" with ${bookInfo.total_pages || 'unknown'} pages`);
        return bookInfo;
      } else {
        console.warn('⚠️ Book info response format unexpected');
        return null;
      }
    } catch (error) {
      console.error(`❌ Error fetching book info for ID ${bookId}:`, error);
      return null;
    }
  }

  /**
   * Get enhanced books with detailed information
   */
  public async getBooksWithDetails(): Promise<IslamHouseBook[]> {
    console.log('📚 Fetching books with enhanced details...');
    
    try {
      // First get the basic books list
      const books = await this.getBooks();
      
      // Enhance first 10 books with detailed info (to avoid too many API calls)
      const enhancedBooks = await Promise.all(
        books.slice(0, 10).map(async (book) => {
          const bookInfo = await this.getBookInfo(book.id);
          if (bookInfo) {
            return {
              ...book,
              description: bookInfo.description || book.description,
              title_ar: bookInfo.title || book.title,
              total_pages: bookInfo.total_pages
            };
          }
          return book;
        })
      );
      
      // Combine enhanced books with remaining books
      const allBooks = [...enhancedBooks, ...books.slice(10)];
      
      console.log(`📊 Enhanced ${enhancedBooks.length} books with detailed information`);
      return allBooks;
    } catch (error) {
      console.error('❌ Error fetching books with details:', error);
      // Fallback to basic books list
      return await this.getBooks();
    }
  }
  public async getBooks(): Promise<IslamHouseBook[]> {
    console.log('📚 Fetching books from Islam House API...');
    
    try {
      const response = await this.makeRequest<IslamHouseApiResponse<IslamHouseBook[]>>('/books/list-books', {}, 'POST');
      
      console.log('✅ Books response:', response);
      
      if (response && response.data && Array.isArray(response.data)) {
        const books = response.data;
        
        // Enrich books with author and category names from meta
        if (response.meta) {
          books.forEach(book => {
            // Add author names
            if (book.authors && response.meta!.authors) {
              book.author_names = book.authors.map(authorId => {
                const author = response.meta!.authors.find(a => a.id === authorId);
                return author ? author.title : `Author ${authorId}`;
              });
            }
            
            // Add category names
            if (book.categories && response.meta!.categories) {
              book.category_names = book.categories.map(catId => {
                const category = response.meta!.categories.find(c => c.id === catId);
                return category ? category.title : `Category ${catId}`;
              });
            }
            
            // Add book type name
            if (book.book_type && response.meta!.book_types) {
              const bookType = response.meta!.book_types.find(bt => bt.id === book.book_type);
              book.book_type_name = bookType ? bookType.title : 'كتاب';
            }
          });
        }
        
        console.log(`📊 Successfully fetched ${books.length} books`);
        console.log('📝 Sample book:', books[0]);
        return books;
      } else {
        console.warn('⚠️ Books response format unexpected, using fallback data');
        return this.getFallbackBooksAsContent();
      }
    } catch (error) {
      console.error('❌ Error fetching books:', error);
      console.log('🔄 Falling back to sample data...');
      return this.getFallbackBooksAsContent();
    }
  }

  /**
   * Convert IslamHouseBook to IslamHouseContent format with enhanced book type support
   */
  private convertBookToContent(book: IslamHouseBook): IslamHouseContent {
    const pageInfo = book.total_pages ? ` (عدد الصفحات: ${book.total_pages})` : '';
    const description = book.description || `كتاب إسلامي: ${book.title}${pageInfo}`;
    
    return {
      id: book.id,
      title: book.title,
      title_ar: book.title_ar || book.title,
      description: description,
      description_ar: book.description_ar || description,
      content_type: 'book' as const,
      category_id: book.categories?.[0],
      category_name: book.category_names?.[0] || 'كتب إسلامية',
      author_id: book.authors?.[0],
      author_name: book.author_names?.[0] || 'مؤلف غير معروف',
      author_name_ar: book.author_names?.[0] || 'مؤلف غير معروف',
      url: `https://islamhouse.com/ar/books/${book.id}`,
      language: book.languages?.[0] || 'ar',
      priority_level: book.priority_level,
      languages: book.languages,
      authors: book.authors,
      categories: book.categories,
      book_type: book.book_type,
      file_size: book.total_pages ? `${book.total_pages} صفحة` : undefined,
      tags: [
        ...(book.category_names || []),
        ...(book.author_names || []),
        book.book_type_name || 'كتاب',
        book.total_pages ? `${book.total_pages} صفحة` : ''
      ].filter(Boolean)
    };
  }
  public async getContent(filters: ContentFilters = {}): Promise<IslamHouseContent[]> {
    console.log('📁 Fetching content with filters:', filters);
    
    try {
      // Get books with enhanced details from the new API
      const books = await this.getBooksWithDetails();
      
      // Convert books to content format
      let content = books.map(book => this.convertBookToContent(book));
      
      // Apply filters
      if (filters.limit && filters.limit > 0) {
        content = content.slice(0, filters.limit);
      }
      
      // Sort by priority level (higher priority first) or by title
      if (filters.sort_by === 'popular') {
        content.sort((a, b) => (b.priority_level || 0) - (a.priority_level || 0));
      } else if (filters.sort_by === 'title') {
        content.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
      } else {
        // Default: latest (sort by ID descending)
        content.sort((a, b) => b.id - a.id);
      }
      
      console.log(`📊 Successfully converted ${content.length} books to content format with enhanced details`);
      return content;
    } catch (error) {
      console.error('❌ Error fetching content:', error);
      console.log('🔄 Falling back to sample data...');
      return this.getFallbackContent();
    }
  }

  /**
   * Get recent content
   */
  public async getRecentContent(lang: string = 'ar', limit: number = 20): Promise<IslamHouseContent[]> {
    try {
      return await this.getContent({
        lang,
        sort_by: 'latest',
        limit
      });
    } catch (error) {
      console.error('Error fetching recent content:', error);
      return [];
    }
  }

  /**
   * Get featured content
   */
  public async getFeaturedContent(lang: string = 'ar', limit: number = 10): Promise<IslamHouseContent[]> {
    try {
      const allContent = await this.getContent({
        lang,
        sort_by: 'popular',
        limit: limit * 2 // Get more to filter for featured
      });
      
      // Filter for featured content or return popular content
      return allContent.filter(content => content.is_featured).slice(0, limit) || 
             allContent.slice(0, limit);
    } catch (error) {
      console.error('Error fetching featured content:', error);
      return [];
    }
  }

  /**
   * Get content by category
   */
  public async getContentByCategory(categoryId: string | number, lang: string = 'ar', limit: number = 20): Promise<IslamHouseContent[]> {
    try {
      return await this.getContent({
        lang,
        subject_category: categoryId.toString(),
        limit
      });
    } catch (error) {
      console.error('Error fetching content by category:', error);
      return [];
    }
  }

  /**
   * Get content by author
   */
  public async getContentByAuthor(authorId: string | number, lang: string = 'ar', limit: number = 20): Promise<IslamHouseContent[]> {
    try {
      return await this.getContent({
        lang,
        author: authorId.toString(),
        limit
      });
    } catch (error) {
      console.error('Error fetching content by author:', error);
      return [];
    }
  }

  /**
   * Get book types list from Islam House API
   */
  public async getBookTypesList(locale: string = 'ar'): Promise<IslamHouseBookTypeListItem[]> {
    console.log(`📚 Fetching book types list from Islam House API with locale: ${locale}`);
    
    try {
      const response = await this.makeRequest<IslamHouseBookTypesListResponse>(`/book-types/list?locale=${locale}`, {}, 'POST');
      
      console.log('✅ Book types list response:', response);
      
      if (response && response.data && Array.isArray(response.data)) {
        const bookTypes = response.data;
        console.log(`📊 Successfully fetched ${bookTypes.length} book types from API`);
        console.log('📋 Book types:', bookTypes.map(bt => `${bt.id}: ${bt.name}`));
        return bookTypes;
      } else {
        console.warn('⚠️ Book types response format unexpected');
        return [];
      }
    } catch (error) {
      console.error('❌ Error fetching book types list:', error);
      return [];
    }
  }

  /**
   * Get authors list from Islam House API
   */
  public async getAuthorsList(locale: string = 'ar'): Promise<IslamHouseAuthorListItem[]> {
    console.log(`👥 Fetching authors list from Islam House API with locale: ${locale}`);
    
    try {
      const response = await this.makeRequest<IslamHouseAuthorsListResponse>(`/authors/list?locale=${locale}`, {}, 'POST');
      
      console.log('✅ Authors list response:', response);
      
      if (response && response.data && Array.isArray(response.data)) {
        const authors = response.data;
        console.log(`📊 Successfully fetched ${authors.length} authors from API`);
        console.log('📝 Sample authors:', authors.slice(0, 5));
        return authors;
      } else {
        console.warn('⚠️ Authors response format unexpected');
        return [];
      }
    } catch (error) {
      console.error('❌ Error fetching authors list:', error);
      return [];
    }
  }

  /**
   * Search for authors (enhanced with new API)
   */
  public async getAuthors(name?: string, lang: string = 'ar'): Promise<IslamHouseAuthor[]> {
    try {
      // First try to get from the authors list API
      const authorsList = await this.getAuthorsList(lang);
      
      if (authorsList.length > 0) {
        // Convert IslamHouseAuthorListItem to IslamHouseAuthor format
        let authors: IslamHouseAuthor[] = authorsList.map(author => ({
          id: author.id,
          name: author.name,
          title: author.name,
          name_ar: author.name
        }));
        
        // Filter by name if provided
        if (name) {
          authors = authors.filter(author => 
            author.name.toLowerCase().includes(name.toLowerCase()) ||
            (author.name_ar && author.name_ar.toLowerCase().includes(name.toLowerCase()))
          );
        }
        
        console.log(`📊 Returning ${authors.length} authors from enhanced API`);
        return authors;
      } else {
        // Fallback to original method
        const params: Record<string, string> = {
          lang
        };
        
        if (name) params.name = name;

        const response = await this.makeRequest<IslamHouseApiResponse<IslamHouseAuthor[]>>('/authors', params);
        
        return response.data || [];
      }
    } catch (error) {
      console.error('Error fetching authors:', error);
      // Return fallback authors if API fails
      return this.getFallbackAuthors();
    }
  }

  /**
   * Get single content item by ID
   */
  public async getSingleContent(id: string | number): Promise<IslamHouseContent | null> {
    try {
      const response = await this.makeRequest<IslamHouseApiResponse<IslamHouseContent>>('/single-content', {
        id: id.toString()
      });
      
      return response.data || null;
    } catch (error) {
      console.error('Error fetching single content:', error);
      return null;
    }
  }

  /**
   * Get available languages
   */
  public async getLanguages(): Promise<IslamHouseLanguage[]> {
    try {
      const response = await this.makeRequest<IslamHouseApiResponse<IslamHouseLanguage[]>>('/languages');
      
      return response.data || [];
    } catch (error) {
      console.error('Error fetching languages:', error);
      return [];
    }
  }

  /**
   * Search content by keyword
   */
  public async searchContent(query: string, lang: string = 'ar', filters: Partial<ContentFilters> = {}): Promise<IslamHouseContent[]> {
    try {
      return await this.getContent({
        name: query,
        lang,
        ...filters
      });
    } catch (error) {
      console.error('Error searching content:', error);
      return [];
    }
  }

  /**
   * Get content by type (audio, video, article, etc.)
   */
  public async getContentByType(contentType: string, lang: string = 'ar', limit: number = 20): Promise<IslamHouseContent[]> {
    try {
      return await this.getContent({
        lang,
        content_type: contentType,
        limit,
        sort_by: 'latest'
      });
    } catch (error) {
      console.error('Error fetching content by type:', error);
      return [];
    }
  }

  /**
   * Test method to check book types list API connectivity
   */
  public async testBookTypesListAPI(): Promise<{ success: boolean; data?: any; error?: string }> {
    console.log('🧪 Testing Islam House Book Types List API...');
    
    try {
      // Test book types list API with Arabic locale
      console.log('🔍 Testing book types list API with locale=ar...');
      const testUrl = `${BASE_URL}/book-types/list?locale=ar`;
      console.log('🌐 Test URL:', testUrl);
      
      const response = await fetch(testUrl, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: '',
      });
      
      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Book Types List API test successful! Data:', {
          totalBookTypes: data.data?.length || 0,
          bookTypes: data.data?.map((bt: any) => `${bt.id}: ${bt.name}`) || []
        });
        return { success: true, data };
      } else {
        const errorText = await response.text();
        console.error('❌ Book Types List API test failed with status:', response.status, errorText);
        return { success: false, error: `HTTP ${response.status}: ${errorText}` };
      }
    } catch (error) {
      console.error('❌ Book Types List API test failed with error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Test method to check authors list API connectivity
   */
  public async testAuthorsListAPI(): Promise<{ success: boolean; data?: any; error?: string }> {
    console.log('🧪 Testing Islam House Authors List API...');
    
    try {
      // Test authors list API with Arabic locale
      console.log('🔍 Testing authors list API with locale=ar...');
      const testUrl = `${BASE_URL}/authors/list?locale=ar`;
      console.log('🌐 Test URL:', testUrl);
      
      const response = await fetch(testUrl, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: '',
      });
      
      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Authors List API test successful! Data:', {
          totalAuthors: data.data?.length || 0,
          firstAuthor: data.data?.[0]?.name,
          sampleAuthors: data.data?.slice(0, 5).map((a: any) => `${a.id}: ${a.name}`) || []
        });
        return { success: true, data };
      } else {
        const errorText = await response.text();
        console.error('❌ Authors List API test failed with status:', response.status, errorText);
        return { success: false, error: `HTTP ${response.status}: ${errorText}` };
      }
    } catch (error) {
      console.error('❌ Authors List API test failed with error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Test method to check page-data API connectivity
   */
  public async testPageDataAPI(): Promise<{ success: boolean; data?: any; error?: string }> {
    console.log('🧪 Testing Islam House Page Data API...');
    
    try {
      // Test page-data API with a known book ID (225) and page 1
      console.log('🔍 Testing page-data API with book ID 225, page 1...');
      const testUrl = `${BASE_URL}/books/page-data/225?page_number=1&transes=ar,en,fr`;
      console.log('🌐 Test URL:', testUrl);
      
      const response = await fetch(testUrl, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: '',
      });
      
      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Page Data API test successful! Data:', {
          totalContent: data.data?.length || 0,
          totalPages: data.meta?.total_pages || 0,
          firstContent: data.data?.[0]?.original_text,
          contentTypes: data.data ? [...new Set(data.data.map((c: any) => c.type))] : [],
          languages: data.data?.[0] ? Object.keys(data.data[0].transes || {}) : []
        });
        return { success: true, data };
      } else {
        const errorText = await response.text();
        console.error('❌ Page Data API test failed with status:', response.status, errorText);
        return { success: false, error: `HTTP ${response.status}: ${errorText}` };
      }
    } catch (error) {
      console.error('❌ Page Data API test failed with error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  public async testBookTitlesAPI(): Promise<{ success: boolean; data?: any; error?: string }> {
    console.log('🧪 Testing Islam House Book Titles API...');
    
    try {
      // Test book-titles API with a known book ID (225) and multiple languages
      console.log('🔍 Testing book-titles API with book ID 225...');
      const testUrl = `${BASE_URL}/books/book-titles/225/?transes=ar,en,fr`;
      console.log('🌐 Test URL:', testUrl);
      
      const response = await fetch(testUrl, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: '',
      });
      
      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Book Titles API test successful! Data:', {
          totalTitles: data.data?.length || 0,
          firstTitle: data.data?.[0]?.original_text,
          languages: data.data?.[0] ? Object.keys(data.data[0].transes) : [],
          lastPage: data.data ? Math.max(...data.data.map((t: any) => t.page_number)) : 0
        });
        return { success: true, data };
      } else {
        const errorText = await response.text();
        console.error('❌ Book Titles API test failed with status:', response.status, errorText);
        return { success: false, error: `HTTP ${response.status}: ${errorText}` };
      }
    } catch (error) {
      console.error('❌ Book Titles API test failed with error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  public async testBookInfoAPI(): Promise<{ success: boolean; data?: any; error?: string }> {
    console.log('🧪 Testing Islam House Book Info API...');
    
    try {
      // Test book-info API with a known book ID (225)
      console.log('🔍 Testing book-info API with book ID 225...');
      const testUrl = `${BASE_URL}/books/book-info/225?locale=ar`;
      console.log('🌐 Test URL:', testUrl);
      
      const response = await fetch(testUrl, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: '',
      });
      
      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Book Info API test successful! Data:', {
          bookId: data.data?.id,
          title: data.data?.title,
          description: data.data?.description,
          totalPages: data.meta?.total_pages,
          languages: data.data?.languages?.length || 0
        });
        return { success: true, data };
      } else {
        const errorText = await response.text();
        console.error('❌ Book Info API test failed with status:', response.status, errorText);
        return { success: false, error: `HTTP ${response.status}: ${errorText}` };
      }
    } catch (error) {
      console.error('❌ Book Info API test failed with error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  public async getRandomContent(lang: string = 'ar', limit: number = 5): Promise<IslamHouseContent[]> {
    try {
      const allContent = await this.getContent({
        lang,
        limit: limit * 4 // Get more content to randomly select from
      });
      
      // Shuffle and return random selection
      const shuffled = allContent.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, limit);
    } catch (error) {
      console.error('Error fetching random content:', error);
      return [];
    }
  }

  /**
   * Get content statistics
   */
  public async getContentStats(lang: string = 'ar'): Promise<{
    totalContent: number;
    categories: number;
    authors: number;
    audioCount: number;
    videoCount: number;
    articleCount: number;
  }> {
    try {
      const [categories, allContent] = await Promise.all([
        this.getCategories(lang),
        this.getContent({ lang, limit: 1000 }) // Large limit to get all
      ]);

      const audioCount = allContent.filter(c => c.content_type === 'audio').length;
      const videoCount = allContent.filter(c => c.content_type === 'video').length;
      const articleCount = allContent.filter(c => c.content_type === 'article').length;

      return {
        totalContent: allContent.length,
        categories: categories.length,
        authors: new Set(allContent.map(c => c.author_id).filter(Boolean)).size,
        audioCount,
        videoCount,
        articleCount
      };
    } catch (error) {
      console.error('Error fetching content stats:', error);
      // Return fallback stats
      const fallbackContent = this.getFallbackContent();
      return {
        totalContent: fallbackContent.length,
        categories: 5,
        authors: 8,
        audioCount: fallbackContent.filter(c => c.content_type === 'audio').length,
        videoCount: fallbackContent.filter(c => c.content_type === 'video').length,
        articleCount: fallbackContent.filter(c => c.content_type === 'article').length
      };
    }
  }

  // =============================================================================
  // ISLAM HOUSE API V3 INTEGRATION - EXPERT IMPLEMENTATION
  // =============================================================================

  /**
   * Comprehensive API v3 Integration with intelligent content fetching
   * Fetches all available Islamic content from the new API v3 endpoint
   * 
   * @param options Fetching options including pagination and filtering
   * @returns Promise<IslamHouseContent[]> Transformed content array
   */
  public async getAPIv3SiteContent(options: {
    flang?: string;  // Interface language
    slang?: string;  // Source content language
    format?: string; // Response format
    limit?: number;  // Max records per request (API limit: 50)
    offset?: number; // Pagination offset
    contentType?: 'book' | 'article' | 'audio' | 'video'; // Filter by content type
  } = {}): Promise<IslamHouseContent[]> {
    console.log('🚀 [API v3] Starting comprehensive content fetch...');
    
    const {
      flang = 'ar',    // Interface language (Arabic)
      slang = 'ar',    // Source content language (Arabic)
      format = 'json', // Response format
      limit = 50,      // API maximum
      offset = 0,      // Pagination start
      contentType      // Optional content type filter
    } = options;

    try {
      // Step 1: Fetch content from API v3
      console.log(`📡 [API v3] Fetching content: flang=${flang}, slang=${slang}, limit=${limit}`);
      
      const apiResponse = await this.fetchAPIv3Content({
        flang,
        slang,
        format,
        limit,
        offset
      });

      if (!apiResponse.success || !apiResponse.data) {
        console.warn('⚠️ [API v3] Failed to fetch from API, using fallback content');
        return this.getFallbackContent();
      }

      // Step 2: Transform API v3 data to our content structure
      console.log(`🔄 [API v3] Transforming ${apiResponse.data.length} items...`);
      
      const transformedContent: IslamHouseContent[] = [];
      
      for (const item of apiResponse.data) {
        try {
          const transformedItem = this.transformAPIv3ItemToContent(item);
          
          // Apply content type filter if specified
          if (contentType && transformedItem.content_type !== contentType) {
            continue;
          }
          
          transformedContent.push(transformedItem);
        } catch (transformError) {
          console.warn('⚠️ [API v3] Failed to transform item:', item.id, transformError);
          continue; // Skip problematic items
        }
      }

      console.log(`✅ [API v3] Successfully transformed ${transformedContent.length} items`);
      
      // Step 3: Enhance with additional metadata if needed
      const enhancedContent = await this.enhanceContentMetadata(transformedContent);
      
      // Step 4: Apply intelligent sorting and prioritization
      const prioritizedContent = this.applyContentPrioritization(enhancedContent);
      
      return prioritizedContent;
      
    } catch (error) {
      console.error('❌ [API v3] Comprehensive content fetch failed:', error);
      
      // Graceful degradation to fallback content
      console.log('🔄 [API v3] Falling back to offline content...');
      return this.getFallbackContent();
    }
  }

  /**
   * Fetch content from Islam House API v3 endpoint
   * Handles the low-level API communication with proper error handling
   */
  private async fetchAPIv3Content(params: {
    flang: string;
    slang: string;
    format: string;
    limit: number;
    offset: number;
  }): Promise<{ success: boolean; data?: APIv3SiteContentItem[]; error?: string }> {
    const { flang, slang, format, limit, offset } = params;
    
    try {
      // Construct API v3 URL following the documented pattern
      const endpoint = `/main/sitecontent/${flang}/${slang}/${format}`;
      const url = `${BASE_URL}${endpoint}`;
      
      // Add pagination parameters
      const urlWithParams = new URL(url, window.location.origin);
      if (limit) urlWithParams.searchParams.append('limit', limit.toString());
      if (offset) urlWithParams.searchParams.append('offset', offset.toString());
      
      console.log(`🌐 [API v3] Fetching from: ${urlWithParams.toString()}`);
      
      const response = await fetch(urlWithParams.toString(), {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'Mafatih-Al-Ruh-Guide/1.0',
        },
        // Add timeout for production resilience
        signal: AbortSignal.timeout(15000) // 15 seconds timeout
      });
      
      console.log(`📊 [API v3] Response status: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ [API v3] HTTP Error ${response.status}:`, errorText);
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText} - ${errorText}`
        };
      }
      
      const responseData = await response.json();
      console.log(`✅ [API v3] Successfully fetched ${responseData?.length || 0} items`);
      
      // Validate response structure
      if (!Array.isArray(responseData)) {
        console.error('❌ [API v3] Invalid response structure - expected array');
        return {
          success: false,
          error: 'Invalid API response structure'
        };
      }
      
      return {
        success: true,
        data: responseData as APIv3SiteContentItem[]
      };
      
    } catch (error) {
      console.error('❌ [API v3] Fetch failed:', error);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return { success: false, error: 'Request timeout - API took too long to respond' };
        }
        if (error.message.includes('CORS')) {
          return { success: false, error: 'CORS policy blocking request - check proxy configuration' };
        }
        if (error.message.includes('fetch')) {
          return { success: false, error: 'Network connectivity issue' };
        }
        return { success: false, error: error.message };
      }
      
      return { success: false, error: 'Unknown error during API fetch' };
    }
  }

  /**
   * Transform API v3 item to our internal content structure
   * Handles the data mapping between API v3 format and our application format
   */
  private transformAPIv3ItemToContent(item: APIv3SiteContentItem): IslamHouseContent {
    try {
      // Extract content type from API v3 data
      const contentType = this.detectContentType(item);
      
      // Map API v3 fields to our content structure
      const transformedContent: IslamHouseContent = {
        id: item.id || Math.floor(Math.random() * 1000000),
        title: item.title || item.title_en || 'عنوان غير متوفر',
        title_ar: item.title_ar || item.title || 'عنوان غير متوفر',
        description: item.description || item.description_en || item.brief || 'وصف غير متوفر',
        description_ar: item.description_ar || item.description || item.brief_ar || 'وصف غير متوفر',
        content_type: contentType as 'article' | 'audio' | 'video' | 'book' | 'fatwa',
        
        // Author information
        author_id: item.author_id || item.authors?.[0]?.id,
        author_name: item.author_name || item.authors?.[0]?.name || 'مؤلف غير معروف',
        author_name_ar: item.author_name_ar || item.authors?.[0]?.name_ar || item.author_name || 'مؤلف غير معروف',
        
        // Category information
        category_id: item.category_id || item.categories?.[0]?.id,
        category_name: item.category_name || item.categories?.[0]?.name || 'تصنيف غير محدد',
        
        // URLs and links
        url: item.url || item.download_url || item.read_url,
        download_url: item.download_url || item.url,
        
        // Metadata
        language: item.language || 'ar',
        publication_date: item.publication_date || item.created_at || new Date().toISOString().split('T')[0],
        
        // Additional fields
        tags: item.tags || [],
        priority_level: item.priority_level || this.calculatePriority(item),
        file_size: item.file_size || this.estimateFileSize(item),
        duration: item.duration,
        
        // Book-specific fields
        book_type: item.book_type || (contentType === 'book' ? 1 : undefined),
        total_pages: item.total_pages || item.pages_count
      };
      
      return transformedContent;
      
    } catch (error) {
      console.error('❌ [API v3] Transform failed for item:', item.id, error);
      throw new Error(`Failed to transform API v3 item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Detect content type from API v3 item data
   */
  private detectContentType(item: APIv3SiteContentItem): string {
    // Check explicit type field first
    if (item.type) {
      const normalizedType = item.type.toLowerCase();
      if (['book', 'article', 'audio', 'video', 'fatwa'].includes(normalizedType)) {
        return normalizedType;
      }
    }
    
    // Detect from URL patterns
    const url = item.url || item.download_url || '';
    if (url.includes('/books/') || url.includes('.pdf')) return 'book';
    if (url.includes('/audio/') || url.includes('.mp3') || url.includes('.wav')) return 'audio';
    if (url.includes('/video/') || url.includes('.mp4') || url.includes('.avi')) return 'video';
    if (url.includes('/fatwa/') || url.includes('/fatwas/')) return 'fatwa';
    
    // Detect from title/description keywords
    const titleAndDesc = `${item.title || ''} ${item.description || ''}`.toLowerCase();
    if (titleAndDesc.includes('كتاب') || titleAndDesc.includes('book')) return 'book';
    if (titleAndDesc.includes('صوت') || titleAndDesc.includes('audio') || titleAndDesc.includes('محاضرة')) return 'audio';
    if (titleAndDesc.includes('فيديو') || titleAndDesc.includes('video') || titleAndDesc.includes('مرئي')) return 'video';
    if (titleAndDesc.includes('فتوى') || titleAndDesc.includes('fatwa')) return 'fatwa';
    
    // Default to article
    return 'article';
  }

  /**
   * Calculate priority level based on content characteristics
   */
  private calculatePriority(item: APIv3SiteContentItem): number {
    let priority = 5; // Base priority
    
    // Boost priority for certain keywords
    const keywords = `${item.title || ''} ${item.description || ''}`.toLowerCase();
    if (keywords.includes('قرآن') || keywords.includes('quran')) priority += 3;
    if (keywords.includes('حديث') || keywords.includes('hadith')) priority += 2;
    if (keywords.includes('فقه') || keywords.includes('fiqh')) priority += 2;
    if (keywords.includes('عقيدة') || keywords.includes('aqeedah')) priority += 2;
    
    // Boost for featured content
    if (item.featured || item.is_featured) priority += 2;
    
    // Boost for popular content
    if (item.views && item.views > 1000) priority += 1;
    if (item.downloads && item.downloads > 500) priority += 1;
    
    return Math.min(priority, 10); // Cap at 10
  }

  /**
   * Estimate file size if not provided
   */
  private estimateFileSize(item: APIv3SiteContentItem): string {
    const type = this.detectContentType(item);
    const titleLength = (item.title || '').length;
    const descLength = (item.description || '').length;
    
    switch (type) {
      case 'book':
        return titleLength > 50 ? '200-500 صفحة' : '50-200 صفحة';
      case 'audio':
        return descLength > 100 ? '45-90 دقيقة' : '15-45 دقيقة';
      case 'video':
        return descLength > 100 ? '30-60 دقيقة' : '10-30 دقيقة';
      default:
        return '5-15 صفحات';
    }
  }

  /**
   * Enhance content with additional metadata
   */
  private async enhanceContentMetadata(content: IslamHouseContent[]): Promise<IslamHouseContent[]> {
    try {
      // This could be expanded to add more metadata from other APIs
      // For now, just ensure all required fields are present
      return content.map(item => ({
        ...item,
        // Ensure all items have proper Islamic tags
        tags: item.tags?.length ? item.tags : this.generateDefaultTags(item)
      }));
    } catch (error) {
      console.warn('⚠️ [API v3] Metadata enhancement failed:', error);
      return content; // Return content without enhancement
    }
  }

  /**
   * Generate default tags based on content
   */
  private generateDefaultTags(item: IslamHouseContent): string[] {
    const tags: string[] = [];
    
    // Add content type tag
    switch (item.content_type) {
      case 'book': tags.push('كتاب', 'قراءة'); break;
      case 'audio': tags.push('صوت', 'استماع'); break;
      case 'video': tags.push('مرئي', 'مشاهدة'); break;
      case 'article': tags.push('مقال', 'قراءة'); break;
      case 'fatwa': tags.push('فتوى', 'أحكام'); break;
    }
    
    // Add language tag
    if (item.language === 'ar') tags.push('عربي');
    if (item.language === 'en') tags.push('إنجليزي');
    
    // Add Islamic subject tags based on keywords
    const content = `${item.title_ar || ''} ${item.description_ar || ''}`.toLowerCase();
    if (content.includes('قرآن')) tags.push('قرآن كريم');
    if (content.includes('حديث')) tags.push('سنة نبوية');
    if (content.includes('فقه')) tags.push('فقه إسلامي');
    if (content.includes('عقيدة')) tags.push('عقيدة');
    if (content.includes('سيرة')) tags.push('سيرة نبوية');
    if (content.includes('تفسير')) tags.push('تفسير');
    
    return tags.slice(0, 5); // Limit to 5 tags
  }

  /**
   * Apply intelligent content prioritization
   */
  private applyContentPrioritization(content: IslamHouseContent[]): IslamHouseContent[] {
    return content.sort((a, b) => {
      // Primary sort: Priority level (descending)
      if (a.priority_level !== b.priority_level) {
        return (b.priority_level || 0) - (a.priority_level || 0);
      }
      
      // Secondary sort: Content type preference (Quran > Hadith > Books > Articles > Others)
      const typeOrder = { 'quran': 5, 'hadith': 4, 'book': 3, 'article': 2, 'audio': 1, 'video': 1 };
      const aTypeScore = typeOrder[a.content_type as keyof typeof typeOrder] || 0;
      const bTypeScore = typeOrder[b.content_type as keyof typeof typeOrder] || 0;
      
      if (aTypeScore !== bTypeScore) {
        return bTypeScore - aTypeScore;
      }
      
      // Tertiary sort: Publication date (newer first)
      const aDate = new Date(a.publication_date || '1900-01-01');
      const bDate = new Date(b.publication_date || '1900-01-01');
      return bDate.getTime() - aDate.getTime();
    });
  }

  /**
   * Get content using intelligent API v3 integration with fallback
   * This replaces the existing getContent method for production use
   */
  public async getContentViaAPIv3(options: {
    lang?: string;
    limit?: number;
    offset?: number;
    contentType?: 'book' | 'article' | 'audio' | 'video';
    sort_by?: string;
  } = {}): Promise<IslamHouseContent[]> {
    console.log('🎯 [API v3] Starting intelligent content fetch...');
    
    const {
      lang = 'ar',
      limit = 50,
      offset = 0,
      contentType,
      sort_by = 'latest'
    } = options;
    
    try {
      // Attempt API v3 fetch with rate limiting
      const apiContent = await this.getAPIv3SiteContent({
        flang: lang,
        slang: lang,
        limit: Math.min(limit, 50), // API v3 limit
        offset,
        contentType
      });
      
      if (apiContent.length > 0) {
        console.log(`✅ [API v3] Successfully fetched ${apiContent.length} items from API v3`);
        
        // Apply additional sorting if requested
        return this.applySorting(apiContent, sort_by);
      }
      
      // Fallback to existing API methods if API v3 fails
      console.log('🔄 [API v3] API v3 returned no content, trying fallback APIs...');
      
      const fallbackContent = await this.getContent({ lang, limit, sort_by: sort_by as 'latest' | 'popular' | 'title' | 'oldest' });
      if (fallbackContent.length > 0) {
        console.log(`✅ [API v3] Fallback APIs returned ${fallbackContent.length} items`);
        return fallbackContent;
      }
      
      // Final fallback to offline content
      console.log('📦 [API v3] Using offline fallback content');
      return this.getFallbackContent();
      
    } catch (error) {
      console.error('❌ [API v3] Intelligent content fetch failed:', error);
      
      // Graceful degradation
      console.log('🔄 [API v3] Graceful degradation to offline content...');
      return this.getFallbackContent();
    }
  }

  /**
   * Apply sorting to content array
   */
  private applySorting(content: IslamHouseContent[], sortBy: string): IslamHouseContent[] {
    switch (sortBy) {
      case 'latest':
        return content.sort((a, b) => 
          new Date(b.publication_date || '1900-01-01').getTime() - 
          new Date(a.publication_date || '1900-01-01').getTime()
        );
      case 'popular':
        return content.sort((a, b) => (b.priority_level || 0) - (a.priority_level || 0));
      case 'title':
        return content.sort((a, b) => 
          (a.title_ar || a.title || '').localeCompare(b.title_ar || b.title || '', 'ar')
        );
      default:
        return content;
    }
  }

  /**
   * Test the comprehensive API v3 integration
   */
  public async testAPIv3Integration(): Promise<{ success: boolean; data?: any; error?: string; stats?: any }> {
    console.log('🧪 [API v3] Testing comprehensive integration...');
    
    try {
      const startTime = Date.now();
      
      // Test content fetching
      const content = await this.getAPIv3SiteContent({ limit: 10 });
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      if (content.length > 0) {
        const stats = {
          totalItems: content.length,
          contentTypes: [...new Set(content.map(c => c.content_type))],
          languages: [...new Set(content.map(c => c.language))],
          authors: [...new Set(content.map(c => c.author_name_ar).filter(Boolean))].length,
          categories: [...new Set(content.map(c => c.category_name).filter(Boolean))].length,
          avgPriority: content.reduce((sum, c) => sum + (c.priority_level || 0), 0) / content.length,
          fetchDuration: `${duration}ms`
        };
        
        console.log('✅ [API v3] Integration test successful!', stats);
        
        return {
          success: true,
          data: content.slice(0, 3), // Return sample
          stats
        };
      } else {
        return {
          success: false,
          error: 'API v3 integration returned no content'
        };
      }
      
    } catch (error) {
      console.error('❌ [API v3] Integration test failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // =============================================================================
  // END OF ISLAM HOUSE API V3 INTEGRATION
  // =============================================================================

  /**
   * Get fallback content when API is not available
   * Enhanced with proper metadata and Islamic content
   */
  private getFallbackContent(): IslamHouseContent[] {
    return [
      {
        id: 1,
        title: "تفسير سورة الفاتحة",
        title_ar: "تفسير سورة الفاتحة",
        description: "شرح مفصل لسورة الفاتحة وأحكامها من كتاب تيسير الكريم الرحمن",
        description_ar: "شرح مفصل لسورة الفاتحة وأحكامها من كتاب تيسير الكريم الرحمن",
        content_type: 'book',
        category_id: 1,
        category_name: "تفسير القرآن",
        author_id: 1,
        author_name: "الشيخ عبد الرحمن السعدي",
        author_name_ar: "الشيخ عبد الرحمن السعدي",
        url: "https://islamhouse.com/ar/books/12345",
        language: 'ar',
        publication_date: "2024-01-01",
        tags: ["تفسير", "قرآن", "فاتحة"],
        priority_level: 10,
        file_size: "45 صفحة",
        book_type: 1
      },
      {
        id: 2,
        title: "أحكام الوضوء والطهارة",
        title_ar: "أحكام الوضوء والطهارة",
        description: "شرح شامل لأحكام الوضوء وآدابه من فقه العبادات",
        description_ar: "شرح شامل لأحكام الوضوء وآدابه من فقه العبادات",
        content_type: 'book',
        category_id: 2,
        category_name: "الفقه",
        author_id: 2,
        author_name: "الشيخ محمد بن عثيمين",
        author_name_ar: "الشيخ محمد بن عثيمين",
        url: "https://islamhouse.com/ar/books/67890",
        language: 'ar',
        publication_date: "2024-01-02",
        tags: ["فقه", "طهارة", "وضوء"],
        priority_level: 9,
        file_size: "78 صفحة",
        book_type: 2
      },
      {
        id: 3,
        title: "حصن المسلم - أذكار الصباح والمساء",
        title_ar: "حصن المسلم - أذكار الصباح والمساء",
        description: "مجموعة من الأذكار المأثورة للصباح والمساء من الكتاب والسنة",
        description_ar: "مجموعة من الأذكار المأثورة للصباح والمساء من الكتاب والسنة",
        content_type: 'book',
        category_id: 3,
        category_name: "الأذكار والأدعية",
        author_id: 3,
        author_name: "الشيخ سعيد بن وهف القحطاني",
        author_name_ar: "الشيخ سعيد بن وهف القحطاني",
        url: "https://islamhouse.com/ar/books/11111",
        language: 'ar',
        publication_date: "2024-01-03",
        tags: ["أذكار", "دعاء", "صباح", "مساء"],
        priority_level: 10,
        file_size: "156 صفحة",
        book_type: 3
      },
      {
        id: 4,
        title: "آداب الدعاء في الإسلام",
        title_ar: "آداب الدعاء في الإسلام",
        description: "شرح آداب الدعاء وأوقاته المستجابة والأدعية المأثورة",
        description_ar: "شرح آداب الدعاء وأوقاته المستجابة والأدعية المأثورة",
        content_type: 'book',
        category_id: 4,
        category_name: "الأخلاق والآداب",
        author_id: 4,
        author_name: "الشيخ صالح الفوزان",
        author_name_ar: "الشيخ صالح الفوزان",
        url: "https://islamhouse.com/ar/books/22222",
        language: 'ar',
        publication_date: "2024-01-04",
        tags: ["دعاء", "آداب", "أخلاق"],
        priority_level: 8,
        file_size: "92 صفحة",
        book_type: 2
      },
      {
        id: 5,
        title: "قصص الأنبياء للأطفال",
        title_ar: "قصص الأنبياء للأطفال",
        description: "سلسلة عن قصص الأنبياء والعبر المستفادة مع الرسوم التوضيحية",
        description_ar: "سلسلة عن قصص الأنبياء والعبر المستفادة مع الرسوم التوضيحية",
        content_type: 'book',
        category_id: 5,
        category_name: "السيرة والتاريخ",
        author_id: 5,
        author_name: "أحمد بهجت",
        author_name_ar: "أحمد بهجت",
        url: "https://islamhouse.com/ar/books/33333",
        language: 'ar',
        publication_date: "2024-01-05",
        tags: ["قصص", "أنبياء", "سيرة", "أطفال"],
        priority_level: 9,
        file_size: "234 صفحة",
        book_type: 4
      },
      {
        id: 6,
        title: "فضائل الصلاة وأحكامها",
        title_ar: "فضائل الصلاة وأحكامها",
        description: "كتاب شامل عن فضائل الصلاة وأهميتها وأحكامها الفقهية",
        description_ar: "كتاب شامل عن فضائل الصلاة وأهميتها وأحكامها الفقهية",
        content_type: 'book',
        category_id: 6,
        category_name: "العبادات",
        author_id: 6,
        author_name: "الشيخ عبد العزيز بن باز",
        author_name_ar: "الشيخ عبد العزيز بن باز",
        url: "https://islamhouse.com/ar/books/44444",
        language: 'ar',
        publication_date: "2024-01-06",
        tags: ["صلاة", "عبادة", "فضائل"],
        priority_level: 10,
        file_size: "187 صفحة",
        book_type: 2
      },
      {
        id: 7,
        title: "زاد المعاد في هدي خير العباد",
        title_ar: "زاد المعاد في هدي خير العباد",
        description: "كتاب موسوعي في السيرة النبوية والفقه والأخلاق",
        description_ar: "كتاب موسوعي في السيرة النبوية والفقه والأخلاق",
        content_type: 'book',
        category_id: 2,
        category_name: "الفقه",
        author_id: 7,
        author_name: "ابن قيم الجوزية",
        author_name_ar: "ابن قيم الجوزية",
        url: "https://islamhouse.com/ar/books/55555",
        language: 'ar',
        publication_date: "2024-01-07",
        tags: ["سيرة", "فقه", "أحكام"],
        priority_level: 10,
        file_size: "956 صفحة",
        book_type: 1
      },
      {
        id: 8,
        title: "شرح الأسماء الحسنى",
        title_ar: "شرح الأسماء الحسنى",
        description: "شرح مفصل لأسماء الله الحسنى ومعانيها وأثرها في حياة المسلم",
        description_ar: "شرح مفصل لأسماء الله الحسنى ومعانيها وأثرها في حياة المسلم",
        content_type: 'book',
        category_id: 7,
        category_name: "العقيدة",
        author_id: 8,
        author_name: "الشيخ عبد الرزاق البدر",
        author_name_ar: "الشيخ عبد الرزاق البدر",
        url: "https://islamhouse.com/ar/books/66666",
        language: 'ar',
        publication_date: "2024-01-08",
        tags: ["أسماء", "عقيدة", "توحيد"],
        priority_level: 9,
        file_size: "312 صفحة",
        book_type: 1
      },
      {
        id: 9,
        title: "الرحيق المختوم",
        title_ar: "الرحيق المختوم",
        description: "السيرة النبوية الشريفة - بحث في السيرة النبوية على صاحبها أفضل الصلاة والسلام",
        description_ar: "السيرة النبوية الشريفة - بحث في السيرة النبوية على صاحبها أفضل الصلاة والسلام",
        content_type: 'book',
        category_id: 16,
        category_name: "السيرة النبوية",
        author_id: 9,
        author_name: "صفي الرحمن المباركفوري",
        author_name_ar: "صفي الرحمن المباركفوري",
        url: "https://islamhouse.com/ar/books/77777",
        language: 'ar',
        publication_date: "2024-01-09",
        tags: ["سيرة", "نبوية", "محمد"],
        priority_level: 10,
        file_size: "412 صفحة",
        book_type: 1
      },
      {
        id: 10,
        title: "كتاب التوحيد",
        title_ar: "كتاب التوحيد",
        description: "كتاب التوحيد الذي هو حق الله على العبيد",
        description_ar: "كتاب التوحيد الذي هو حق الله على العبيد",
        content_type: 'book',
        category_id: 7,
        category_name: "العقيدة",
        author_id: 10,
        author_name: "محمد بن عبد الوهاب",
        author_name_ar: "محمد بن عبد الوهاب",
        url: "https://islamhouse.com/ar/books/88888",
        language: 'ar',
        publication_date: "2024-01-10",
        tags: ["توحيد", "عقيدة", "إيمان"],
        priority_level: 10,
        file_size: "125 صفحة",
        book_type: 1
      }
    ];
  }

  /**
   * Get fallback categories
   */
  private getFallbackCategories(): IslamHouseCategory[] {
    return [
      { id: 1, name: "علوم القرآن", name_ar: "علوم القرآن", title: "علوم القرآن" },
      { id: 2, name: "الفقه وأصوله", name_ar: "الفقه وأصوله", title: "الفقه وأصوله" },
      { id: 6, name: "التفسير", name_ar: "التفسير", title: "التفسير" },
      { id: 7, name: "العقيدة", name_ar: "العقيدة", title: "العقيدة" },
      { id: 11, name: "الآداب", name_ar: "الآداب", title: "الآداب" },
      { id: 15, name: "الدعوة إلى الله", name_ar: "الدعوة إلى الله", title: "الدعوة إلى الله" },
      { id: 16, name: "السيرة النبوية", name_ar: "السيرة النبوية", title: "السيرة النبوية" }
    ];
  }

  /**
   * Get fallback books converted to content format
   */
  private getFallbackBooksAsContent(): IslamHouseBook[] {
    return [
      {
        id: 225,
        title: "المنهج الوجيز",
        description: "كتاب في المنهج الإسلامي الصحيح",
        priority_level: 10,
        languages: ["ar", "en", "fr"],
        authors: [1],
        categories: [2],
        book_type: 5,
        author_names: ["الشيخ عبد الرحمن السعدي"],
        category_names: ["الفقه وأصوله"],
        book_type_name: "كتاب",
        total_pages: 37
      },
      {
        id: 226,
        title: "الإسلام والإلحاد وجها لوجه",
        description: "رد على الشبهات الإلحادية بالأدلة العقلية والنقلية",
        priority_level: 10,
        languages: ["ar", "en"],
        authors: [72],
        categories: [2],
        book_type: 5,
        author_names: ["هيثم طلعت"],
        category_names: ["الفقه وأصوله"],
        book_type_name: "كتاب",
        total_pages: 95
      },
      {
        id: 227,
        title: "مجالس تدارس القرآن للمبتدئين",
        description: "دليل لتدارس سورة الفاتحة وقصار المفصل",
        priority_level: 10,
        languages: ["ar"],
        authors: [3],
        categories: [1, 2],
        book_type: 5,
        author_names: ["محمد بن عبد الوهاب"],
        category_names: ["علوم القرآن", "الفقه وأصوله"],
        book_type_name: "كتاب",
        total_pages: 128
      },
      {
        id: 141,
        title: "الإسلام - نبذة موجزة عن الإسلام",
        description: "شرح مبسط للإسلام كما جاء في القرآن والسنة",
        priority_level: 9,
        languages: ["ar", "en", "fr"],
        authors: [9],
        categories: [7, 11, 15],
        book_type: 1,
        author_names: ["محمد بن عبدالله السحيم"],
        category_names: ["العقيدة", "الآداب", "الدعوة إلى الله"],
        book_type_name: "متن",
        total_pages: 64
      },
      {
        id: 8,
        title: "رياض الصالحين مع فوائد وهدايات",
        description: "مجموعة من الأحاديث النبوية مع الشرح والفوائد",
        priority_level: 9,
        languages: ["ar", "en"],
        authors: [24, 25],
        categories: [6, 7, 16],
        book_type: 5,
        author_names: ["عبد الهادي البستاني", "زياد محمد"],
        category_names: ["التفسير", "العقيدة", "السيرة النبوية"],
        book_type_name: "كتاب",
        total_pages: 456
      }
    ];
  }

  /**
   * Get fallback authors
   */
  private getFallbackAuthors(): IslamHouseAuthor[] {
    return [
      { id: 1, name: "محمد بن صالح العثيمين", title: "محمد بن صالح العثيمين", name_ar: "محمد بن صالح العثيمين" },
      { id: 2, name: "عبد العزيز بن عبد الله بن باز", title: "عبد العزيز بن عبد الله بن باز", name_ar: "عبد العزيز بن عبد الله بن باز" },
      { id: 3, name: "محمد بن عبد الوهاب", title: "محمد بن عبد الوهاب", name_ar: "محمد بن عبد الوهاب" },
      { id: 9, name: "محمد بن عبدالله السحيم", title: "محمد بن عبدالله السحيم", name_ar: "محمد بن عبدالله السحيم" },
      { id: 24, name: "عبد الهادي البستاني", title: "عبد الهادي البستاني", name_ar: "عبد الهادي البستاني" },
      { id: 25, name: "زياد محمد", title: "زياد محمد", name_ar: "زياد محمد" },
      { id: 72, name: "هيثم طلعت", title: "هيثم طلعت", name_ar: "هيثم طلعت" }
    ];
  }
}

// Export singleton instance
export default IslamHouseService.getInstance();