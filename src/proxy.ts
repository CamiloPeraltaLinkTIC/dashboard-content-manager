import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  console.log('--- PROXY EXECUTING ---');
  console.log('Path:', request.nextUrl.pathname);

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch (e) {
    // Supabase inalcanzable (DNS/red transitoria): no tumbar toda la app.
    // Fail-open: se deja pasar la petición; la sesión se revalida en el próximo request.
    console.warn('Proxy: no se pudo verificar la sesión (Supabase inalcanzable):', (e as Error)?.message)
    return response
  }

  console.log('User found:', user ? user.email : 'None');

  // Protección: Si no hay usuario y no está en la página de login, redirigir a login
  if (!user && !request.nextUrl.pathname.startsWith('/login')) {
    console.log('Redirecting to /login');
    const url = new URL('/login', request.url)
    return NextResponse.redirect(url)
  }

  // Protección adicional: Si está logueado y va a login, redirigir al dashboard (ej. mapa)
  if (user && request.nextUrl.pathname.startsWith('/login')) {
    console.log('Redirecting to /mapa (already logged in)');
    const url = new URL('/mapa', request.url)
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
