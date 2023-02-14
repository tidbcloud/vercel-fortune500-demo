import { NextResponse } from "next/server";

export const config = {
  matcher: ["/", "/(.*)"],
};

const user = process.env.BASIC_AUTH_USER ?? "";
const password = process.env.BASIC_AUTH_PASSPHRASE ?? "";

const getBasicAuthHeader = (user, password) =>
  `Basic ${btoa(`${user}:${password}`)}`;

export function middleware(request) {
  if (user && password) {
    const requestHeaders = new Headers(request.headers);
    if (
      requestHeaders.get("Authorization") !== getBasicAuthHeader(user, password)
    ) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "authentication failed" }),
        {
          status: 401,
          headers: {
            "content-type": "application/json",
            "WWW-Authenticate": "Basic",
          },
        }
      );
    }
  }

  return NextResponse.next();
}
