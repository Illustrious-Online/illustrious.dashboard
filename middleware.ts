// /src/lib/supabase/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Define paths that should be excluded from authentication checks
const PUBLIC_PATHS = [
  // Auth routes
  '/login',
  '/register',
  '/api/auth',
  
  // Static files and resources
  '/_next',
  '/static',
  '/fonts',
  '/assets',
  
  // Public images
  '/images',
  '/img',
  '/public',
  
  // Favicon and other browser files
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
  '/manifest.json',
]

// Define file extensions that should be excluded
const PUBLIC_FILE_EXTENSIONS = [
  '.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp',
  '.css', '.js', '.woff', '.woff2', '.ttf', '.eot',
  '.ico', '.json', '.xml', '.txt'
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if the path should be excluded from authentication
  const isPublicPath = PUBLIC_PATHS.some(path => pathname.startsWith(path))
  const hasPublicFileExtension = PUBLIC_FILE_EXTENSIONS.some(ext => pathname.endsWith(ext))

  // Skip middleware for public paths and file extensions
  if (isPublicPath || hasPublicFileExtension) {
    return NextResponse.next()
  }
  
  // For all other paths, verify authentication
  return authenticateRequest(request)
}

async function authenticateRequest(request: NextRequest) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    // Extract the URL to redirect back to after authentication
    const returnUrl = encodeURIComponent(request.nextUrl.pathname + request.nextUrl.search)
    
    // Redirect to auth page with return URL
    return NextResponse.redirect(new URL(`/login?returnUrl=${returnUrl}`, request.url))
  }
  
  return NextResponse.next()
}

// Configure the middleware to run on all routes except those specified
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}