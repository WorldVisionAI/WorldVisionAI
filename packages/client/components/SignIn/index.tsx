"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export const SignIn = () => {
	const { data: session } = useSession();
	if (session) {
		return (
			<>
				Signed in as {session?.user?.name?.slice(0, 10)} <br />
				<button onClick={() => signOut()} type="button">
					Sign out
				</button>
			</>
		);
	}
	return (
		<>
			Not signed in <br />
			<button onClick={() => signIn()} type="button">
				Sign in
			</button>
		</>
	);
};
