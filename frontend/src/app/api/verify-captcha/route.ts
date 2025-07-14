import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const SECRET_KEY = process.env.SECRET_KEY || "";

export async function POST(req: NextRequest) {
  const data = await req.json();

  const { token } = data;

  if (!token) {
    return NextResponse.json({
      success: false,
      error: "Missing captcha token",      
    });
  }

  try {
    const url = `https://www.google.com/recaptcha/api/siteverify`;
    const response = await axios.post(url, null, {
      params: {
        secret: SECRET_KEY,
        response: token,
      },
    });

    if (response.data.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({
        success: false,
        error: "Captcha verification failed",
      });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: "Server error" });
  }
}
