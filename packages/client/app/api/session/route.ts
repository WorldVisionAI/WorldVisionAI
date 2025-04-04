import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { walletAddress } = await request.json();

    // セッションクッキーを設定（24時間有効）
    cookies().set("wallet_session", walletAddress, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 24時間
        path: "/",
    });

    return NextResponse.json({ status: "success" });
}

export async function GET() {
    const walletSession = cookies().get("wallet_session");

    return NextResponse.json({
        walletAddress: walletSession?.value || null,
    });
}

export async function DELETE() {
    cookies().delete("wallet_session");

    return NextResponse.json({ status: "success" });
}
