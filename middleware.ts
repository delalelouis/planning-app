import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    "https://nrkfyzdjkrevfsoogyll.supabase.co",
    "sb_publishable_ghLhIev_7E4T9IwZsA1Qtw_2CKGqGCV",
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({ request });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // ⚡ IMPORTANT : utiliser getSession (pas getUser)
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = request.nextUrl.pathname;

  const isLoginPage = pathname === "/login";
  const isHtmlPage = pathname.endsWith(".html");
  const isPublicFile =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico");

  if (isPublicFile) {
    return response;
  }

  // ❌ pas connecté → login
  if (!session && !isLoginPage && !isHtmlPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ✅ connecté → éviter retour login
  if (session && isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};