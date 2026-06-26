import { redirect } from "next/navigation";
import { LoginForm } from "@/features/auth/LoginForm";
import { getCurrentUser } from "@/features/auth/server";

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/");
  }

  return <LoginForm />;
}
