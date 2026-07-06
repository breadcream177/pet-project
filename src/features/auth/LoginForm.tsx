import { AuthCard } from "./components/AuthCard";

type LoginFormProps = {
  errorMessage?: string;
};

export function LoginForm({ errorMessage }: LoginFormProps) {
  return <AuthCard errorMessage={errorMessage} mode="login" />;
}
