import { redirect } from "next/navigation";
import { SignupForm } from "@/features/auth/SignupForm";
import { getCurrentUser } from "@/features/auth/server";

export default async function SignupPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/");
  }

  return <SignupForm />;
}
