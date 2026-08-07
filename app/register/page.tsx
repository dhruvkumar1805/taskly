import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AuthLayout from "@/components/auth-layout";
import RegisterForm from "./register-form";

export const metadata = {
  title: "Create account",
};

export default async function RegisterPage() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start organizing your tasks in seconds."
      tagline="Free to start, no credit card. Capture fast, see what's actually due, close the loop."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-foreground hover:text-primary">
            Sign in instead
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthLayout>
  );
}
