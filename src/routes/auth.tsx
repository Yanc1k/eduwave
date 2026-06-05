import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({
    meta: [
      { title: "Вход и регистрация — EduWave" },
      { name: "description", content: "Войдите или создайте аккаунт EduWave, чтобы начать обучение." },
    ],
  }),
});

const schema = z.object({
  email: z.string().trim().email("Неверный email").max(255),
  password: z.string().min(6, "Минимум 6 символов").max(72),
  fullName: z.string().trim().min(1, "Введите имя").max(80).optional(),
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOAuthConfigGuide, setShowOAuthConfigGuide] = useState(false);
  const [showEmailConfigGuide, setShowEmailConfigGuide] = useState(false);

  useEffect(() => {
    // Check for auth errors in the query parameters (e.g., from Supabase OAuth redirect)
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const error = params.get("error");
      const errorDesc = params.get("error_description");
      if (
        error === "unsupported_provider" || 
        (errorDesc && errorDesc.toLowerCase().includes("missing oauth secret")) ||
        (errorDesc && errorDesc.toLowerCase().includes("oauth secret"))
      ) {
        setShowOAuthConfigGuide(true);
        toast.error("Не настроен Google OAuth провайдер в Supabase", {
          duration: 8000,
        });
      }
    }

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/courses" });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) navigate({ to: "/courses" });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({
      email,
      password,
      fullName: mode === "signup" ? fullName : undefined,
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Проверьте поля");
      return;
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: {
            emailRedirectTo: `${window.location.origin}/courses`,
            data: { full_name: parsed.data.fullName ?? "" },
          },
        });
        if (error) throw error;

        // If auto-confirm is enabled in Supabase, data.session will be present
        if (data?.session) {
          toast.success("Регистрация успешна! Добро пожаловать!");
          navigate({ to: "/courses" });
        } else {
          // Attempt automatic login using the password entered during signup
          const signInRes = await supabase.auth.signInWithPassword({
            email: parsed.data.email,
            password: parsed.data.password,
          });

          if (signInRes.error) {
            // If email confirmation is still strictly required by Supabase configurations
            if (
              signInRes.error.message.toLowerCase().includes("email not confirmed") || 
              signInRes.error.message.toLowerCase().includes("confirm")
            ) {
              setShowEmailConfigGuide(true);
              toast.error("Вход заблокирован: требуется подтверждение почты. См. инструкцию выше!");
            } else {
              throw signInRes.error;
            }
          } else {
            toast.success("Регистрация успешна! Добро пожаловать!");
            navigate({ to: "/courses" });
          }
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (error) throw error;
        toast.success("Добро пожаловать!");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Ошибка";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      // Direct standard Supabase Google OAuth flow
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin + "/courses",
        },
      });
      if (error) throw error;
    } catch (err: unknown) {
      console.error("Google auth failed:", err);
      const msg = err instanceof Error ? err.message : "Ошибка";
      
      if (msg.toLowerCase().includes("missing oauth secret") || msg.toLowerCase().includes("unsupported provider")) {
        setShowOAuthConfigGuide(true);
      }
      
      toast.error("Не удалось войти через Google: " + msg);
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      const mockEmail = "demo.user@eduwave.ru";
      const mockPassword = "eduwaveDemoPassword123";
      const mockName = "Демонстрационный Пользователь";

      // Try signing in
      let signInRes = await supabase.auth.signInWithPassword({
        email: mockEmail,
        password: mockPassword,
      });

      // If user doesn't exist, sign up first
      if (signInRes.error && (signInRes.error.message.includes("Invalid login credentials") || signInRes.error.status === 400)) {
        const signUpResult = await supabase.auth.signUp({
          email: mockEmail,
          password: mockPassword,
          options: {
            data: { full_name: mockName },
          },
        });
        if (signUpResult.error) throw signUpResult.error;
        
        // Sign in after sign up
        const secondSignIn = await supabase.auth.signInWithPassword({
          email: mockEmail,
          password: mockPassword,
        });
        if (secondSignIn.error) throw secondSignIn.error;
      } else if (signInRes.error) {
        throw signInRes.error;
      }

      toast.success("Вход под демо-аккаунтом выполнен!");
      navigate({ to: "/courses" });
    } catch (err: unknown) {
      console.error("Demo auth failed:", err);
      const msg = err instanceof Error ? err.message : "Ошибка";
      toast.error("Не удалось войти под демо-аккаунтом: " + msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--gradient-soft)] font-sans flex items-center justify-center px-4 py-16">
      <Toaster richColors position="top-center" />
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 justify-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-[var(--gradient-hero)] flex items-center justify-center text-white font-display font-bold">
            E
          </div>
          <span className="font-display font-bold text-2xl">EduWave</span>
        </Link>

        {showEmailConfigGuide && (
          <div className="mb-6 p-5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-3xl text-sm text-amber-900 dark:text-amber-300 shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="font-bold text-base">Как отключить подтверждение почты</span>
            </div>
            <p className="mb-3 leading-relaxed">
              Ваш Supabase проект требует подтверждения email перед входом. Чтобы вы могли <b>сразу входить после регистрации</b> без писем:
            </p>
            <ol className="list-decimal list-inside space-y-2 mb-4 leading-relaxed">
              <li>Откройте <b>Supabase Dashboard</b> для проекта <code className="bg-amber-100 dark:bg-amber-900/50 px-1.5 py-0.5 rounded text-xs font-mono">qtajuxzsuwtvlrxdyfrq</code>.</li>
              <li>Перейдите в раздел <b>Authentication ➜ Providers ➜ Email</b>.</li>
              <li>Найдите и отключите переключатель <b>Confirm email</b>.</li>
              <li>Нажмите кнопку <b>Save</b> снизу.</li>
            </ol>
            <p className="mb-4 leading-relaxed font-semibold text-xs">
              💡 Мы также добавили SQL-миграцию в проект, которая автоматически подтверждает всех новых пользователей.
            </p>
            <div className="flex gap-2 justify-end">
              <button 
                onClick={() => setShowEmailConfigGuide(false)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-full font-bold text-xs transition shadow-sm"
              >
                Я понял
              </button>
              <button 
                onClick={handleDemoLogin}
                className="px-4 py-2 bg-white dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-amber-200 dark:border-amber-900 rounded-full font-bold text-xs text-foreground transition shadow-sm"
              >
                Демо-вход
              </button>
            </div>
          </div>
        )}

        {showOAuthConfigGuide && (
          <div className="mb-6 p-5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-3xl text-sm text-amber-900 dark:text-amber-300 shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="font-bold text-base">Настройка Google OAuth в Supabase</span>
            </div>
            <p className="mb-3 leading-relaxed">
              Google OAuth не настроен в вашей панели управления Supabase. Чтобы реальный вход через Google заработал:
            </p>
            <ol className="list-decimal list-inside space-y-2 mb-4 leading-relaxed">
              <li>Перейдите в <b>Supabase Dashboard</b> для проекта <code className="bg-amber-100 dark:bg-amber-900/50 px-1.5 py-0.5 rounded text-xs font-mono">qtajuxzsuwtvlrxdyfrq</code>.</li>
              <li>Перейдите в раздел <b>Authentication ➜ Providers ➜ Google</b>.</li>
              <li>Включите его и заполните поля <b>Client ID</b> и <b>Client Secret</b> (их нужно получить в <a href="https://console.cloud.google.com/" target="_blank" rel="noreferrer" className="underline font-semibold hover:text-amber-700 dark:hover:text-amber-500">Google Cloud Console</a>).</li>
              <li>В настройках Google Cloud добавьте следующий Redirect URI: <code className="bg-amber-100 dark:bg-amber-900/50 px-1 py-0.5 rounded text-xs font-mono break-all block mt-1">https://qtajuxzsuwtvlrxdyfrq.supabase.co/auth/v1/callback</code></li>
            </ol>
            <div className="flex gap-2 justify-end">
              <button 
                onClick={() => setShowOAuthConfigGuide(false)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-full font-bold text-xs transition shadow-sm"
              >
                Я понял
              </button>
              <button 
                onClick={handleDemoLogin}
                className="px-4 py-2 bg-white dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-amber-200 dark:border-amber-900 rounded-full font-bold text-xs text-foreground transition shadow-sm"
              >
                Демо-вход
              </button>
            </div>
          </div>
        )}

        <div className="bg-card rounded-3xl p-8 shadow-[var(--shadow-card)] border border-border">
          <div className="flex gap-1 p-1 bg-muted rounded-full mb-6">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-2.5 rounded-full text-sm font-bold transition ${
                mode === "login" ? "bg-background text-foreground shadow" : "text-muted-foreground"
              }`}
            >
              Вход
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 py-2.5 rounded-full text-sm font-bold transition ${
                mode === "signup" ? "bg-background text-foreground shadow" : "text-muted-foreground"
              }`}
            >
              Регистрация
            </button>
          </div>

          <h1 className="font-display font-bold text-2xl text-center">
            {mode === "login" ? "С возвращением!" : "Создай аккаунт"}
          </h1>
          <p className="text-center text-muted-foreground text-sm mt-2">
            {mode === "login" ? "Войди, чтобы продолжить учёбу" : "Начни обучение бесплатно"}
          </p>

          <button
            onClick={handleGoogle}
            disabled={loading}
            className="mt-6 w-full py-3 rounded-full border-2 border-border bg-white text-zinc-900 font-bold text-sm hover:border-brand-blue transition flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Продолжить с Google
          </button>

          <button
            onClick={handleDemoLogin}
            disabled={loading}
            className="mt-3 w-full py-3 rounded-full border-2 border-dashed border-brand-orange/40 bg-orange-50/50 dark:bg-orange-950/10 text-brand-orange font-bold text-sm hover:bg-orange-50 dark:hover:bg-orange-950/20 hover:border-brand-orange transition flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles text-brand-orange"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z"/><path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5Z"/><path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1Z"/></svg>
            Быстрый демо-вход (без Google)
          </button>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground font-semibold">или</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="text-sm font-bold block mb-1.5">Имя</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-brand-blue focus:outline-none transition"
                  placeholder="Иван Петров"
                />
              </div>
            )}
            <div>
              <label className="text-sm font-bold block mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-brand-blue focus:outline-none transition"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="text-sm font-bold block mb-1.5">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-brand-blue focus:outline-none transition"
                placeholder="Минимум 6 символов"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-brand-orange text-brand-orange-foreground font-bold shadow-[var(--shadow-glow)] hover:scale-[1.02] transition disabled:opacity-50"
            >
              {loading ? "Загрузка..." : mode === "login" ? "Войти" : "Создать аккаунт"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          <Link to="/" className="hover:text-foreground transition">← На главную</Link>
        </p>
      </div>
    </div>
  );
}
