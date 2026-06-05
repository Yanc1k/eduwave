import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/courses")({
  component: CoursesPage,
  head: () => ({
    meta: [
      { title: "Курсы и цены — EduWave" },
      { name: "description", content: "Каталог онлайн-курсов EduWave с ценами для школьников и студентов." },
    ],
  }),
});

interface CourseItem {
  emoji: string;
  name: string;
  tag: string;
  price: number;
  old: number | null;
  badge: string | null;
}

interface PlanItem {
  name: string;
  price: string;
  price_numeric: number;
  desc: string;
  features: string[];
  cta: string;
  highlight: boolean;
}


function CoursesPage() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
  const [paidCourses, setPaidCourses] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [coursesList, setCoursesList] = useState<CourseItem[]>([]);
  const [plansList, setPlansList] = useState<PlanItem[]>([]);
  const [lessonsCount, setLessonsCount] = useState<Record<string, number>>({});

  useEffect(() => {
    async function loadData() {
      try {
        const { data: cData, error: cErr } = await supabase
          .from("courses")
          .select("emoji, name, tag, price, old_price, badge")
          .order("created_at", { ascending: true });

        if (!cErr && cData && cData.length > 0) {
          const mapped = cData.map((item) => ({
            emoji: item.emoji,
            name: item.name,
            tag: item.tag,
            price: item.price,
            old: item.old_price,
            badge: item.badge,
          }));
          setCoursesList(mapped);
        }

        const { data: pData, error: pErr } = await supabase
          .from("plans")
          .select("name, price_text, price_numeric, description, features, cta, highlight")
          .order("price_numeric", { ascending: true });

        if (!pErr && pData && pData.length > 0) {
          const mappedPlans = pData.map((item) => ({
            name: item.name,
            price: item.price_text,
            price_numeric: item.price_numeric,
            desc: item.description,
            features: item.features,
            cta: item.cta,
            highlight: item.highlight,
          }));
          setPlansList(mappedPlans);
        }

        const { data: lData, error: lErr } = await supabase
          .from("lessons")
          .select("course_name");

        if (!lErr && lData) {
          const counts: Record<string, number> = {};
          lData.forEach((l) => {
            counts[l.course_name] = (counts[l.course_name] || 0) + 1;
          });
          setLessonsCount(counts);
        }
      } catch (err) {
        console.warn("Error loading courses/lessons from Supabase:", err);
      }
    }
    loadData();
  }, []);

  const loadUserAvatar = async (uid: string) => {
    const localAvatar = localStorage.getItem(`eduwave_profile_avatar_${uid}`);
    if (localAvatar) {
      setAvatarUrl(localAvatar);
    }
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", uid)
        .maybeSingle();
      if (profile && (profile as any).avatar_url) {
        const av = (profile as any).avatar_url;
        setAvatarUrl(av);
        localStorage.setItem(`eduwave_profile_avatar_${uid}`, av);
      }
    } catch (err) {
      console.warn("Error loading avatar from db in courses:", err);
    }
  };

  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Subscription payment states
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: number } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "kaspi">("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [kaspiPhone, setKaspiPhone] = useState("");
  const [isPaying, setIsPaying] = useState(false);

  const handlePlanSelect = (planName: string) => {
    if (!userId) {
      toast.info("Сначала зарегистрируйтесь, чтобы оформить подписку");
      navigate({ to: "/auth" });
      return;
    }

    if (enrolledCourses.includes(planName)) {
      toast.info(`У вас уже оформлен тариф «${planName}»`);
      return;
    }

    if (planName === "Старт") {
      // Free plan
      enroll(planName);
      return;
    }

    const plan = plansList.find((p) => p.name === planName);
    const price = plan ? plan.price_numeric : (planName === "Стандарт" ? 14990 : 29990);
    setSelectedPlan({ name: planName, price });
    setIsPaymentOpen(true);
    setCardNumber("");
    setCardExpiry("");
    setCardCvv("");
    setCardName("");
    setKaspiPhone("");
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !selectedPlan) return;

    setIsPaying(true);

    setTimeout(async () => {
      try {
        const { error: subErr } = await supabase
          .from("subscriptions")
          .insert({
            user_id: userId,
            plan_name: selectedPlan.name,
            payment_method: paymentMethod,
            amount_paid: selectedPlan.price,
            status: "active"
          });

        if (subErr) throw subErr;

        const { error } = await supabase
          .from("enrollments")
          .insert({ user_id: userId, course_name: selectedPlan.name, is_paid: true });

        if (error) throw error;

        const newEnrollments = [...enrolledCourses, selectedPlan.name];
        const newPaid = [...paidCourses, selectedPlan.name];
        setEnrolledCourses(newEnrollments);
        setPaidCourses(newPaid);
        localStorage.setItem(`eduwave_enrollments_${userId}`, JSON.stringify(newEnrollments));
        localStorage.setItem(`eduwave_paid_courses_${userId}`, JSON.stringify(newPaid));

        setIsPaymentOpen(false);
        setIsPaying(false);
        toast.success(`Оплата тарифа «${selectedPlan.name}» успешно завершена! Подписка активна. 🚀`, {
          duration: 5000,
        });
      } catch (err: any) {
        console.warn("Supabase plan enroll failed, using local storage fallback:", err);
        const newEnrollments = [...enrolledCourses, selectedPlan.name];
        const newPaid = [...paidCourses, selectedPlan.name];
        setEnrolledCourses(newEnrollments);
        setPaidCourses(newPaid);
        localStorage.setItem(`eduwave_enrollments_${userId}`, JSON.stringify(newEnrollments));
        localStorage.setItem(`eduwave_paid_courses_${userId}`, JSON.stringify(newPaid));

        setIsPaymentOpen(false);
        setIsPaying(false);
        toast.success(`Оплата тарифа «${selectedPlan.name}» успешно завершена! Подписка активна. 🚀`, {
          duration: 5000,
        });
      }
    }, 2000);
  };

  const fetchEnrollments = async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from("enrollments")
        .select("course_name, is_paid")
        .eq("user_id", uid);
      if (error) throw error;
      if (data) {
        const enrolled = data.map((item) => item.course_name);
        const paid = data.filter((item) => (item as any).is_paid).map((item) => item.course_name);
        setEnrolledCourses(enrolled);
        setPaidCourses(paid);
        // Sync to local storage
        localStorage.setItem(`eduwave_enrollments_${uid}`, JSON.stringify(enrolled));
        localStorage.setItem(`eduwave_paid_courses_${uid}`, JSON.stringify(paid));
      }
    } catch (err) {
      console.warn("Supabase enrollments fetch failed, using localStorage fallback:", err);
      const local = localStorage.getItem(`eduwave_enrollments_${uid}`);
      if (local) {
        setEnrolledCourses(JSON.parse(local));
      }
      const localPaid = localStorage.getItem(`eduwave_paid_courses_${uid}`);
      if (localPaid) {
        setPaidCourses(JSON.parse(localPaid));
      }
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const email = data.session?.user.email ?? null;
      const uid = data.session?.user.id ?? null;
      setUserEmail(email);
      setUserId(uid);
      if (uid) {
        fetchEnrollments(uid);
        loadUserAvatar(uid);
        const localPaid = localStorage.getItem(`eduwave_paid_courses_${uid}`);
        if (localPaid) {
          setPaidCourses(JSON.parse(localPaid));
        }
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      const email = s?.user.email ?? null;
      const uid = s?.user.id ?? null;
      setUserEmail(email);
      setUserId(uid);
      if (uid) {
        fetchEnrollments(uid);
        loadUserAvatar(uid);
        const localPaid = localStorage.getItem(`eduwave_paid_courses_${uid}`);
        if (localPaid) {
          setPaidCourses(JSON.parse(localPaid));
        }
      } else {
        setEnrolledCourses([]);
        setPaidCourses([]);
        setAvatarUrl(null);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const startTrial = async (courseName: string) => {
    if (!userId) {
      toast.info("Сначала зарегистрируйтесь, чтобы начать пробное обучение");
      navigate({ to: "/auth" });
      return;
    }

    if (!enrolledCourses.includes(courseName)) {
      setLoading(true);
      try {
        const { error } = await supabase
          .from("enrollments")
          .insert({ user_id: userId, course_name: courseName });

        if (error) throw error;

        const newEnrollments = [...enrolledCourses, courseName];
        setEnrolledCourses(newEnrollments);
        localStorage.setItem(`eduwave_enrollments_${userId}`, JSON.stringify(newEnrollments));
      } catch (err: any) {
        console.warn("Supabase enroll failed in trial, using local storage:", err);
        const newEnrollments = [...enrolledCourses, courseName];
        setEnrolledCourses(newEnrollments);
        localStorage.setItem(`eduwave_enrollments_${userId}`, JSON.stringify(newEnrollments));
      } finally {
        setLoading(false);
      }
    }

    toast.success(`Вы начали пробное обучение по курсу «${courseName}»! 🚀`);
    navigate({ to: "/learning", search: { course: courseName } });
  };

  const enroll = async (name: string) => {
    if (!userId) {
      toast.info("Сначала зарегистрируйтесь, чтобы записаться");
      navigate({ to: "/auth" });
      return;
    }

    if (enrolledCourses.includes(name)) {
      toast.info(`Вы уже записаны на курс «${name}»`);
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("enrollments")
        .insert({ user_id: userId, course_name: name });

      if (error) throw error;

      setEnrolledCourses((prev) => [...prev, name]);
      // Sync local storage
      localStorage.setItem(`eduwave_enrollments_${userId}`, JSON.stringify([...enrolledCourses, name]));
      toast.success(`Вы успешно записались на курс «${name}»!`);
    } catch (err: any) {
      console.warn("Supabase enroll failed, using localStorage fallback:", err);

      const newEnrollments = [...enrolledCourses, name];
      setEnrolledCourses(newEnrollments);
      localStorage.setItem(`eduwave_enrollments_${userId}`, JSON.stringify(newEnrollments));

      toast.success(`Вы успешно записались на курс «${name}»!`);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    toast.success("Вы вышли из аккаунта");
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <Toaster richColors position="top-center" />
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[var(--gradient-hero)] flex items-center justify-center text-white font-display font-bold">
              E
            </div>
            <span className="font-display font-bold text-xl">EduWave</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition">Главная</Link>
            <Link to="/courses" className="text-foreground">Курсы и цены</Link>
          </nav>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-2.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition cursor-pointer flex items-center justify-center font-bold border-none bg-transparent"
              title="Переключить тему"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            {userEmail ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                  className="w-10 h-10 rounded-full border-2 border-brand-blue/30 overflow-hidden hover:border-brand-blue transition flex items-center justify-center bg-brand-blue/10 shadow-sm"
                  title="Личный кабинет"
                >
                  <img
                    src={avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${userEmail || "eduwave"}`}
                    alt="Личный кабинет"
                    className="w-full h-full object-cover"
                  />
                </Link>
                <button onClick={logout} className="px-4 py-2 rounded-full bg-muted text-sm font-bold hover:bg-border transition cursor-pointer">
                  Выйти
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="px-5 py-2.5 rounded-full bg-brand-blue text-brand-blue-foreground text-sm font-bold hover:opacity-90 transition"
              >
                Войти
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-[var(--gradient-soft)]">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-brand-orange/20 blur-3xl" aria-hidden />
        <div className="relative max-w-7xl mx-auto px-6 py-20 text-center">
          <span className="inline-flex px-4 py-1.5 rounded-full bg-brand-orange/15 text-brand-orange font-bold text-xs uppercase tracking-wider">
            🎓 Каталог курсов
          </span>
          <h1 className="mt-6 font-display font-extrabold text-5xl md:text-6xl leading-tight">
            Курсы и <span className="text-brand-orange">цены</span>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground font-semibold max-w-2xl mx-auto">
            Выбирай курс по своей цели — от школьной программы до современных профессий
          </p>
        </div>
      </section>

      {/* My Active Enrollments Dashboard */}
      {userId && enrolledCourses.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pt-10">
          <div className="p-8 rounded-[2rem] bg-gradient-to-r from-brand-blue/15 to-brand-orange/10 border border-border shadow-[var(--shadow-card)]">
            <h2 className="font-display font-bold text-2xl mb-6 flex items-center gap-3">
              <span>📚 Моё обучение</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-blue text-white font-bold">
                {enrolledCourses.length}
              </span>
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {coursesList
                .filter((c) => enrolledCourses.includes(c.name))
                .map((c) => (
                  <div
                    key={c.name}
                    className="p-5 rounded-2xl bg-card border border-border shadow-sm flex items-center gap-4 hover:border-brand-blue transition-all"
                  >
                    <div className="text-4xl">{c.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-bold text-sm truncate">{c.name}</h3>
                      <p className="text-xs text-emerald-500 font-semibold mt-0.5">Доступ открыт</p>
                    </div>
                    <div className="text-emerald-500 font-bold text-lg">✓</div>
                  </div>
                ))}
              {/* Also display plans in enrolled list if selected */}
              {plansList
                .filter((p) => enrolledCourses.includes(p.name))
                .map((p) => (
                  <div
                    key={p.name}
                    className="p-5 rounded-2xl bg-gradient-to-br from-brand-orange/20 to-brand-orange/5 border border-brand-orange/20 shadow-sm flex items-center gap-4 hover:border-brand-orange transition-all"
                  >
                    <div className="text-4xl">💎</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-bold text-sm truncate">Тариф: {p.name}</h3>
                      <p className="text-xs text-brand-orange font-semibold mt-0.5">Активен</p>
                    </div>
                    <div className="text-brand-orange font-bold text-lg">✓</div>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Courses grid */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {coursesList.map((c) => (
            <div
              key={c.name}
              className="relative p-6 rounded-3xl bg-card border border-border hover:border-brand-orange hover:shadow-[var(--shadow-card)] transition-all flex flex-col"
            >
              {c.badge && (
                <span className="absolute -top-3 right-4 px-3 py-1 rounded-full bg-brand-orange text-brand-orange-foreground text-xs font-bold uppercase tracking-wider">
                  {c.badge}
                </span>
              )}
              <div className="text-5xl">{c.emoji}</div>
              <h3 className="mt-5 font-display font-bold text-lg">{c.name}</h3>
              <div className="mt-1 text-xs font-bold text-muted-foreground uppercase tracking-wider">{c.tag}</div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-display font-extrabold text-2xl text-brand-blue">{c.price.toLocaleString("ru")} ₸</span>
                {c.old && (
                  <span className="text-sm text-muted-foreground line-through">{c.old.toLocaleString("ru")} ₸</span>
                )}
              </div>
              <div className="text-xs text-muted-foreground">в месяц</div>
              {enrolledCourses.includes(c.name) ? (
                <div className="mt-5 space-y-2.5">
                  {(() => {
                    const lessonsLength = lessonsCount[c.name] || 4;
                    const localProgress = userId ? localStorage.getItem(`eduwave_progress_${userId}_${c.name}`) : null;
                    const completedLessons = localProgress ? (JSON.parse(localProgress) as number[]) : [];
                    const progressPercent = Math.round((completedLessons.length / lessonsLength) * 100);
                    const isCompleted = progressPercent === 100;

                    return (
                      <>
                        <div className="p-3 rounded-2xl bg-muted/30 border border-border/30">
                          <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground mb-1">
                            <span>Прогресс: {progressPercent}%</span>
                            <span>{completedLessons.length}/{lessonsLength} уроков</span>
                          </div>
                          <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 rounded-full ${isCompleted ? "bg-gradient-to-r from-amber-500 to-yellow-400" : "bg-brand-blue"
                                }`}
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                        </div>

                        <button
                          onClick={() => navigate({ to: "/learning", search: { course: c.name } })}
                          className="w-full py-3 rounded-full font-bold text-sm bg-brand-blue text-white hover:scale-[1.02] active:scale-[0.98] transition shadow-md cursor-pointer border-none"
                        >
                          {isCompleted ? "Повторить курс 🎓" : "Продолжить обучение 🎓"}
                        </button>
                      </>
                    );
                  })()}
                </div>
              ) : (
                <div className="mt-5 flex flex-col gap-2">
                  <button
                    onClick={() => enroll(c.name)}
                    disabled={loading}
                    className="w-full py-2.5 rounded-full font-bold text-sm bg-brand-blue text-brand-blue-foreground hover:opacity-90 active:scale-[0.98] transition cursor-pointer border-none shadow-sm"
                  >
                    Записаться
                  </button>
                  <button
                    onClick={() => startTrial(c.name)}
                    disabled={loading}
                    className="w-full py-2.5 rounded-full font-bold text-sm bg-brand-orange/10 text-brand-orange border border-brand-orange/20 hover:bg-brand-orange hover:text-brand-orange-foreground active:scale-[0.98] transition cursor-pointer"
                  >
                    Пробный урок 🔓
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Pricing plans */}
      <section className="bg-[var(--gradient-soft)] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-display font-bold text-4xl md:text-5xl">Тарифы подписки</h2>
            <p className="mt-4 text-muted-foreground font-semibold">Учись столько, сколько хочешь — отменить можно в любой момент</p>
          </div>
          <div className="mt-14 grid md:grid-cols-3 gap-6">
            {plansList.map((p) => (
              <div
                key={p.name}
                className={`p-8 rounded-3xl border transition-all flex flex-col ${p.highlight
                  ? "bg-gradient-to-br from-brand-blue to-brand-orange text-white border-transparent shadow-[var(--shadow-glow)] scale-[1.03]"
                  : "bg-card border-border"
                  }`}
              >
                <div className={`text-xs font-bold uppercase tracking-wider ${p.highlight ? "text-white/80" : "text-brand-orange"}`}>
                  {p.desc}
                </div>
                <h3 className="mt-2 font-display font-bold text-2xl">{p.name}</h3>
                <div className="mt-4 font-display font-extrabold text-3xl">{p.price}</div>
                <ul className={`mt-6 space-y-3 text-sm flex-1 ${p.highlight ? "text-white/95" : "text-foreground/80"}`}>
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className={p.highlight ? "text-white" : "text-brand-blue"}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handlePlanSelect(p.name)}
                  disabled={loading || enrolledCourses.includes(p.name)}
                  className={`mt-8 py-3 rounded-full font-bold text-sm transition ${enrolledCourses.includes(p.name)
                    ? "bg-emerald-500 text-white border border-emerald-500 cursor-default"
                    : p.highlight
                      ? "bg-white text-brand-blue hover:bg-white/90 cursor-pointer"
                      : "bg-brand-blue text-brand-blue-foreground hover:opacity-90 cursor-pointer"
                    }`}
                >
                  {enrolledCourses.includes(p.name) ? "✓ Выбрано" : p.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Checkout Payment Modal */}
      {isPaymentOpen && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsPaymentOpen(false)}
          />

          <div className="relative w-full max-w-md bg-card rounded-3xl border border-border shadow-2xl p-8 overflow-hidden transform scale-100 transition-all z-10 animate-in fade-in zoom-in-95 duration-200 text-foreground">
            <button
              onClick={() => setIsPaymentOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-muted hover:bg-border flex items-center justify-center transition cursor-pointer text-muted-foreground hover:text-foreground border-none font-bold"
            >
              ✕
            </button>

            <span className="inline-flex px-3 py-1 rounded-full bg-brand-blue/15 text-brand-blue font-bold text-xs mb-3">
              💳 Безопасная оплата EduWave
            </span>

            <h2 className="font-display font-extrabold text-2xl">Оплата подписки</h2>
            <p className="text-sm text-muted-foreground mt-1 font-semibold">
              Тариф: <span className="font-bold text-foreground">«{selectedPlan.name}»</span>
            </p>

            <div className="mt-6 p-4 rounded-2xl bg-muted/50 border border-border flex items-center justify-between">
              <span className="text-sm font-semibold text-muted-foreground">Сумма к оплате:</span>
              <span className="font-display font-extrabold text-xl text-brand-blue">
                {selectedPlan.price.toLocaleString("ru")} ₸
              </span>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-2 gap-2 mt-6 p-1 bg-muted rounded-full">
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`py-2 rounded-full text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border-none ${paymentMethod === "card" ? "bg-white text-foreground shadow-sm font-extrabold" : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                <span>💳</span> Картой банка
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("kaspi")}
                className={`py-2 rounded-full text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border-none ${paymentMethod === "kaspi" ? "bg-white text-foreground shadow-sm font-extrabold" : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                <span className="w-4.5 h-4.5 rounded-md bg-red-500 text-[10px] text-white flex items-center justify-center font-bold">K</span> Kaspi.kz
              </button>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-4 mt-6">
              {paymentMethod === "card" ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold block mb-1">Номер карты</label>
                    <input
                      type="text"
                      required
                      placeholder="0000 0000 0000 0000"
                      value={cardNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 16);
                        const matches = val.match(/\d{4,16}/g);
                        const match = (matches && matches[0]) || "";
                        const parts = [];
                        for (let i = 0, len = match.length; i < len; i += 4) {
                          parts.push(match.substring(i, i + 4));
                        }
                        setCardNumber(parts.length > 0 ? parts.join(" ") : val);
                      }}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:border-brand-blue focus:outline-none transition text-sm font-semibold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold block mb-1">Срок действия</label>
                      <input
                        type="text"
                        required
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                          if (val.length >= 3) {
                            setCardExpiry(val.slice(0, 2) + "/" + val.slice(2));
                          } else {
                            setCardExpiry(val);
                          }
                        }}
                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:border-brand-blue focus:outline-none transition text-sm font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold block mb-1">CVV/CVC</label>
                      <input
                        type="password"
                        required
                        placeholder="•••"
                        maxLength={3}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:border-brand-blue focus:outline-none transition text-sm font-semibold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold block mb-1">Имя владельца</label>
                    <input
                      type="text"
                      required
                      placeholder="IVAN PETROV"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value.toUpperCase())}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:border-brand-blue focus:outline-none transition text-sm font-semibold"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold block mb-1">Номер телефона в Kaspi.kz</label>
                    <input
                      type="tel"
                      required
                      placeholder="+7 (700) 000-00-00"
                      value={kaspiPhone}
                      onChange={(e) => setKaspiPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:border-brand-blue focus:outline-none transition text-sm font-semibold"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
                    💡 После нажатия кнопки «Оплатить», вам придет push-уведомление в приложение Kaspi.kz для подтверждения выставленного счета.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isPaying}
                className="mt-6 w-full py-3.5 rounded-full bg-brand-orange text-brand-orange-foreground font-bold shadow-[var(--shadow-glow)] hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-default cursor-pointer text-sm border-none"
              >
                {isPaying ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-brand-orange-foreground border-t-transparent rounded-full animate-spin" />
                    <span>Обработка платежа...</span>
                  </div>
                ) : (
                  <span>
                    Оплатить {selectedPlan.price.toLocaleString("ru")} ₸
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      <footer className="border-t border-border py-10 text-center text-sm text-muted-foreground">
        © 2026 EduWave. Учись с удовольствием.
      </footer>
    </div>
  );
}
