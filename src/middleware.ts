import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SUBDOMAINS = {
  production: {
    app: "app",
    website: "",
  },
  staging: {
    app: "app-staging",
    website: "staging",
  },
};

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const host = req.headers.get('host') || '';
  const subdomain = host.split(".")[0];

  if (subdomain === SUBDOMAINS.production.app || subdomain === SUBDOMAINS.staging.app) {
    url.pathname = `/app${url.pathname}`;
    return NextResponse.rewrite(url);
  }

//   if (subdomain === SUBDOMAINS.production.website || subdomain === SUBDOMAINS.staging.website) {
//     return NextResponse.rewrite(url);
//   }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|static|favicon.ico).*)'],
};
