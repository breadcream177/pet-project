export function maskEmail(email?: string | null) {
  if (!email) {
    return "로그인 사용자";
  }

  const [name, domain] = email.split("@");

  if (!name || !domain) {
    return "로그인 사용자";
  }

  const visibleName = name.length <= 2 ? name[0] : name.slice(0, 2);

  return `${visibleName}${"*".repeat(Math.max(name.length - visibleName.length, 3))}@${domain}`;
}
