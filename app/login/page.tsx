import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AuthLayout from "@/components/auth-layout";
import LoginForm from "./login-form";

export const metadata = {
  title: "Log in",
};

export default async function LoginPage() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Enter your details to sign in."
      tagline="Taskly is where your day lives — capture fast, see what's actually due, close the loop."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-foreground hover:text-primary">
            Create account
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthLayout>
  );
}
