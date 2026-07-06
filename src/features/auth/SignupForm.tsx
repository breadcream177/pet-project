import { AuthCard } from "./components/AuthCard";

type SignupFormProps = {
  errorMessage?: string;
  successMessage?: string;
};

export function SignupForm({
  errorMessage,
  successMessage,
}: SignupFormProps) {
  return (
    <AuthCard
      errorMessage={errorMessage}
      mode="signup"
      successMessage={successMessage}
    />
  );
}
