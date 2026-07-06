import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function readCredentials(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
    };

    return {
      email: body.email?.trim() ?? "",
      isFormPost: false,
      password: body.password ?? "",
    };
  }

  const formData = await request.formData();

  return {
    email: String(formData.get("email") ?? "").trim(),
    isFormPost: true,
    password: String(formData.get("password") ?? ""),
  };
}

function redirectToLogin(request: Request, message: string) {
  const url = createRedirectUrl(request, "/login");
  url.searchParams.set("error", message);

  return NextResponse.redirect(url);
}

function createRedirectUrl(request: Request, path: string) {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const baseUrl = origin ?? (referer ? new URL(referer).origin : request.url);

  return new URL(path, baseUrl);
}

export async function POST(request: Request) {
  const { email, isFormPost, password } = await readCredentials(request);

  if (!email || !password) {
    const message = "이메일과 비밀번호를 입력해 주세요.";

    if (isFormPost) {
      return redirectToLogin(request, message);
    }

    return NextResponse.json({ error: message }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (isFormPost) {
      return redirectToLogin(request, error.message);
    }

    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  if (isFormPost) {
    return NextResponse.redirect(createRedirectUrl(request, "/"));
  }

  return NextResponse.json({ ok: true });
}
