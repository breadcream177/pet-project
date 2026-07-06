import { redirect } from "next/navigation";
import { SignupForm } from "@/features/auth/SignupForm";
import { getCurrentUser } from "@/features/auth/server";

type SignupPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const user = await getCurrentUser();
  const params = await searchParams;

  if (user) {
    redirect("/");
  }

  return (
    <SignupForm
      errorMessage={params.error}
      successMessage={params.success}
    />
  );
}
