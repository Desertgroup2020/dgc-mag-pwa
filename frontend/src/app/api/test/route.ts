import { NextResponse } from "next/server";

export async function GET() {
  // console.log("it works");
  
  try {
    return NextResponse.json({
      hello: "world",
    });
  } catch (err) {
    throw err;
  }
}
