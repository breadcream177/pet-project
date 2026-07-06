import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function readSignupPayload(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const body = (await request.json()) as {
      displayName?: string;
      email?: string;
      password?: string;
    };

    return {
      displayName: body.displayName?.trim() ?? "",
      email: body.email?.trim() ?? "",
      isFormPost: false,
      password: body.password ?? "",
    };
  }

  const formData = await request.formData();

  return {
    displayName: String(formData.get("displayName") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    isFormPost: true,
    password: String(formData.get("password") ?? ""),
  };
}

function redirectToSignup(
  request: Request,
  key: "error" | "success",
  message: string,
) {
  const url = createRedirectUrl(request, "/signup");
  url.searchParams.set(key, message);

  return NextResponse.redirect(url);
}

function createRedirectUrl(request: Request, path: string) {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const baseUrl = origin ?? (referer ? new URL(referer).origin : request.url);

  return new URL(path, baseUrl);
}

export async function POST(request: Request) {
  const { displayName, email, isFormPost, password } =
    await readSignupPayload(request);

  if (!displayName || !email || password.length < 8) {
    const message = "이름, 이메일, 8자 이상의 비밀번호를 입력해 주세요.";

    if (isFormPost) {
      return redirectToSignup(request, "error", message);
    }

    return NextResponse.json({ error: message }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
      },
    },
  });

  if (error) {
    if (isFormPost) {
      return redirectToSignup(request, "error", error.message);
    }

    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (isFormPost) {
    if (data.session) {
      return NextResponse.redirect(createRedirectUrl(request, "/"));
    }

    return redirectToSignup(
      request,
      "success",
      "회원가입을 완료했습니다. 이메일 확인이 필요할 수 있습니다.",
    );
  }

  return NextResponse.json({
    ok: true,
    requiresEmailConfirmation: !data.session,
  });
}
