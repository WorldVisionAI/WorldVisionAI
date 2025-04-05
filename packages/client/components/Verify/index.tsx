"use client";
import { useCoolMode } from "@/hooks/useCoolRoundMode";
import {
  MiniKit,
  VerificationLevel,
  ISuccessResult,
  MiniAppVerifyActionErrorPayload,
  IVerifyResponse,
} from "@worldcoin/minikit-js";
import { useCallback, useState } from "react";

export type VerifyCommandInput = {
  action: string;
  signal?: string;
  verification_level?: VerificationLevel; // Default: Orb
};

const verifyPayload: VerifyCommandInput = {
  action: "verify", // This is your action ID from the Developer Portal
  signal: "",
  verification_level: VerificationLevel.Orb, // Orb | Device
};

export type VerifyBlockProps = {
  onVerificationSuccess?: () => void;
};

export const VerifyBlock = ({ onVerificationSuccess }: VerifyBlockProps) => {
  const [handleVerifyResponse, setHandleVerifyResponse] = useState<
    MiniAppVerifyActionErrorPayload | IVerifyResponse | null
  >(null);
  const buttonRef = useCoolMode("/coin.png");

  const handleVerify = useCallback(async () => {
    if (!MiniKit.isInstalled()) {
      console.warn("Tried to invoke 'verify', but MiniKit is not installed.");
      return null;
    }

    const { finalPayload } = await MiniKit.commandsAsync.verify(verifyPayload);

    // no need to verify if command errored
    if (finalPayload.status === "error") {
      console.log("Command error");
      console.log(finalPayload);

      setHandleVerifyResponse(finalPayload);
      return finalPayload;
    }

    // Verify the proof in the backend
    const verifyResponse = await fetch(`/api/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        payload: finalPayload as ISuccessResult, // Parses only the fields we need to verify
        action: verifyPayload.action,
        signal: verifyPayload.signal, // Optional
      }),
    });

    // TODO: Handle Success!
    const verifyResponseJson = await verifyResponse.json();

    if (verifyResponseJson.status === 200) {
      console.log("Verification success!");
      console.log(finalPayload);
      onVerificationSuccess?.();
    }

    setHandleVerifyResponse(verifyResponseJson);
    return verifyResponseJson;
  }, [onVerificationSuccess]);

  return (
    <div>
      {/* <h1>Verify Block</h1> */}
      <button
        className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transition-all duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
        onClick={handleVerify}
        ref={buttonRef}
      >
        <svg
          className="w-5 h-5 mr-2"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Verify with World ID
      </button>
      {/* <span>{JSON.stringify(handleVerifyResponse, null, 2)}</span> */}
    </div>
  );
};
