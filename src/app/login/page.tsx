"use client";

import { useWixClient } from "@/hooks/useWixClient";
import { LoginState } from "@wix/sdk";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import Cookies from "js-cookie";

enum Mode {
    LOGIN = "LOGIN",
    REGISTER = "REGISTER",
    RESET_PASSWORD = "RESET_PASSWORD",
    EMAIL_VERIFICATION = "EMAIL_VERIFICATION",
}

const LoginPage = () => {
    const wixClient = useWixClient();
    const pathName = usePathname();
    const router = useRouter();

    const isLoggedIn = wixClient.auth.loggedIn();

    if (isLoggedIn) {
        router.push("/");
    }

    const [mode, setMode] = useState(Mode.LOGIN);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [emailCode, setEmailCode] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const formTitle =
        mode === Mode.LOGIN
            ? "Log in"
            : mode === Mode.REGISTER
            ? "Register"
            : mode === Mode.RESET_PASSWORD
            ? "Reset Your Password"
            : "Verify Your Email";
    const buttonTitle =
        mode === Mode.LOGIN
            ? "Login"
            : mode === Mode.REGISTER
            ? "Register"
            : mode === Mode.RESET_PASSWORD
            ? "Reset"
            : "Verify";
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            let response;

            switch (mode) {
                case Mode.LOGIN:
                    response = await wixClient.auth.login({
                        email,
                        password,
                    });
                    break;
                case Mode.REGISTER:
                    response = await wixClient.auth.register({
                        email,
                        password,
                        profile: { nickname: username },
                    });
                    break;
                case Mode.RESET_PASSWORD:
                    response = await wixClient.auth.sendPasswordResetEmail(email, pathName);
                    setMessage("Password reset email sent. Please check your e-mail.");
                    break;
                case Mode.LOGIN:
                    response = await wixClient.auth.processVerification({
                        verificationCode: emailCode,
                    });
                    break;
                default:
                    break;
            }

            switch (response?.loginState) {
                case LoginState.SUCCESS:
                    setMessage("Successful! You are being redirected.");
                    const tokens = await wixClient.auth.getMemberTokensForDirectLogin(
                        response.data.sessionToken!
                    );
                    Cookies.set("refreshToken", JSON.stringify(tokens.refreshToken), {
                        expires: 2,
                    });
                    wixClient.auth.setTokens(tokens);
                    router.push("/");
                    break;
                case LoginState.FAILURE:
                    if (
                        response.errorCode === "invalidEmail" ||
                        response.errorCode === "invalidPassword"
                    ) {
                        setError("Invalid email or password!");
                    } else if (response.errorCode === "emailAlreadyExists") {
                        setError("Email already exsists!");
                    } else if (response.errorCode === "resetPassword") {
                        setError("You need to reset your password!");
                    } else {
                        setError("Something went wrong!");
                    }
                case LoginState.EMAIL_VERIFICATION_REQUIRED:
                    setMode(Mode.EMAIL_VERIFICATION);
                case LoginState.OWNER_APPROVAL_REQUIRED:
                    setMessage("Your account is pending approval");
                default:
                    break;
            }
        } catch (err) {
            console.log(err);
            setError("Something went wrong!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-[calc(100vh-80px)] px-4 md:px-16 xl:px-32 2xl:px-64 flex items-center justify-center">
            <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
                <h1 className="text-2xl font-semibold">{formTitle}</h1>
                {mode === Mode.REGISTER ? (
                    <div className="flex flex-col gap-2">
                        <label>Username</label>
                        <input
                            type="text"
                            name="username"
                            placeholder="vexer69"
                            className="ring-2 ring-gray-300 rounded-md p-4"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                ) : null}
                {mode !== Mode.EMAIL_VERIFICATION ? (
                    <div className="flex flex-col gap-2">
                        <label>E-mail</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="vexer69@mail.to"
                            className="ring-2 ring-gray-300 rounded-md p-4"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        <label>Verification Code</label>
                        <input
                            type="text"
                            name="emailCode"
                            placeholder="Code"
                            className="ring-2 ring-gray-300 rounded-md p-4"
                            onChange={(e) => setEmailCode(e.target.value)}
                        />
                    </div>
                )}
                {mode === Mode.LOGIN || mode === Mode.REGISTER ? (
                    <div className="flex flex-col gap-2">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            className="ring-2 ring-gray-300 rounded-md p-4"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                ) : null}
                {mode === Mode.LOGIN && (
                    <div
                        className="text-sm underline cursor-pointer"
                        onClick={() => setMode(Mode.RESET_PASSWORD)}
                    >
                        Forgot Password?
                    </div>
                )}
                <button className="bg-notification text-white p-2 rounded-md disabled:bg-pink-200 disabled:cursor-not-allowed">
                    {isLoading ? "Loading..." : buttonTitle}
                </button>
                {error && <div className="text-red-600">{error}</div>}
                {mode === Mode.LOGIN && (
                    <div
                        className="text-sm underline cursor-pointer"
                        onClick={() => setMode(Mode.REGISTER)}
                    >
                        {"Don't"} have an account?
                    </div>
                )}
                {mode === Mode.REGISTER && (
                    <div
                        className="text-sm underline cursor-pointer"
                        onClick={() => setMode(Mode.LOGIN)}
                    >
                        Have an account?
                    </div>
                )}
                {mode === Mode.RESET_PASSWORD && (
                    <div
                        className="text-sm underline cursor-pointer"
                        onClick={() => setMode(Mode.LOGIN)}
                    >
                        Go back to Login
                    </div>
                )}
                {message && <div className="text-green-600 text-sm">{message}</div>}
            </form>
        </div>
    );
};
export default LoginPage;
