import { NextRequest, NextResponse } from "next/server";

export default async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.query) return new NextResponse(null, { status: 401 });

  const results = await fetch(
    `https://api.npms.io/v2/search?q=${encodeURIComponent(body.query)}&size=3`
  );

  return NextResponse.json(results);
}
