import {
	type MiniAppWalletAuthSuccessPayload,
	verifySiweMessage,
} from "@worldcoin/minikit-js";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

interface IRequestPayload {
	payload: MiniAppWalletAuthSuccessPayload;
	nonce: string;
}

export const POST = async (req: NextRequest) => {
	const { payload, nonce } = (await req.json()) as IRequestPayload;
	if (nonce !== cookies().get("siwe")?.value) {
		return NextResponse.json({
			status: "error",
			isValid: false,
			message: "Invalid nonce",
		});
	}
	try {
		const validMessage = await verifySiweMessage(payload, nonce);
		return NextResponse.json({
			status: "success",
			isValid: validMessage.isValid,
		});
	} catch (error: unknown) {
		// Handle errors in validation or processing
		return NextResponse.json({
			status: "error",
			isValid: false,
			message:
				error instanceof Error ? error.message : "Unknown error occurred",
		});
	}
};
