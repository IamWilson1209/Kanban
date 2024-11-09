import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)'])

export default clerkMiddleware(async (auth, req) => {

  const { userId, orgId, redirectToSignIn } = await auth()

  if (userId && isPublicRoute(req)) {

    // await auth.protect()
    let path = "/select-org";

    if (orgId) {
      path = `/organization/${orgId}`;
    }

    const orgSelection = new URL(path, req.url);
    return NextResponse.redirect(orgSelection)
  }


  // 如果使用者不存在且使用者想訪問私有資源
  if (!userId && !isPublicRoute(req)) {
    return redirectToSignIn() // { returnBackUrl: req.url }
  }


  // 當使用者存在，但是不屬於organization，且使用者沒有在選擇organization時
  if (userId && !orgId && req.nextUrl.pathname !== "/select-org") {
    const orgSelection = new URL(`/select-org`, req.url)
    return NextResponse.redirect(orgSelection)
  }

  console.log("Redirect to")
}
);

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};