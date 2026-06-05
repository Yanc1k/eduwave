import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { getLessonsForCourse } from "./learning";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
  head: () => ({
    meta: [
      { title: "Личный кабинет — EduWave" },
      { name: "description", content: "Управление вашим профилем и курсами в EduWave." },
    ],
  }),
});

// A local courses dictionary to lookup emoji/tags for enrolled courses
const catalogCourses = [
  { emoji: "🚀", name: "Вводный IT-экспресс (Пробный)", tag: "Старт в IT · Бесплатно", price: 0 },
  { emoji: "➗", name: "Математика", tag: "Школа · ЕГЭ", price: 14990 },
  { emoji: "⚛️", name: "Физика", tag: "7–11 класс", price: 13990 },
  { emoji: "🧪", name: "Химия", tag: "Школа · Олимпиады", price: 13990 },
  { emoji: "🏛️", name: "История", tag: "ОГЭ · ЕГЭ", price: 12490 },
  { emoji: "🇬🇧", name: "Английский язык", tag: "A1 — C1", price: 17490 },
  { emoji: "💻", name: "Программирование", tag: "Python · Web", price: 24990 },
  { emoji: "🎨", name: "Дизайн", tag: "Figma · UI/UX · Бесплатно", price: 0 },
  { emoji: "📖", name: "Русский язык", tag: "ОГЭ · ЕГЭ", price: 12490 },
  { emoji: "🧬", name: "Биология", tag: "Школа · ОГЭ · ЕГЭ", price: 13490 },
  { emoji: "📢", name: "Маркетинг", tag: "SMM · Таргет · SEO", price: 18990 },
  { emoji: "📱", name: "Мобильная разработка", tag: "iOS · Android · Flutter", price: 26490 },
];

const resizeAvatar = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 250;
        const MAX_HEIGHT = 250;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.onerror = reject;
      img.src = event.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

function ProfilePage() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

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
  const [fullName, setFullName] = useState("");
  const [initialName, setInitialName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [initialAvatar, setInitialAvatar] = useState("");
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Payment system states
  const [paidCourses, setPaidCourses] = useState<string[]>([]);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedPaymentCourse, setSelectedPaymentCourse] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "kaspi">("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [kaspiPhone, setKaspiPhone] = useState("");
  const [isPaying, setIsPaying] = useState(false);

  // Dynamic stats calculations
  const myFinishedCount = enrolledCourses.filter(name => {
    if (["Старт", "Стандарт", "Премиум"].includes(name)) return false;
    const lessons = getLessonsForCourse(name);
    const localProgress = localStorage.getItem(`eduwave_progress_${userId}_${name}`);
    const completedLessons = localProgress ? (JSON.parse(localProgress) as number[]) : [];
    const progressPercent = Math.round((completedLessons.length / lessons.length) * 100);
    return progressPercent === 100;
  }).length;

  const myActiveCount = enrolledCourses.filter(name => {
    if (["Старт", "Стандарт", "Премиум"].includes(name)) return false;
    const lessons = getLessonsForCourse(name);
    const localProgress = localStorage.getItem(`eduwave_progress_${userId}_${name}`);
    const completedLessons = localProgress ? (JSON.parse(localProgress) as number[]) : [];
    const progressPercent = Math.round((completedLessons.length / lessons.length) * 100);
    return progressPercent < 100;
  }).length;

  useEffect(() => {
    let active = true;

    async function loadUserData() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          if (active) navigate({ to: "/auth" });
          return;
        }

        const email = session.user.email ?? "";
        const uid = session.user.id;
        if (active) {
          setUserEmail(email);
          setUserId(uid);
          
          // Load paid courses from localStorage
          const localPaid = localStorage.getItem(`eduwave_paid_courses_${uid}`);
          if (localPaid) {
            setPaidCourses(JSON.parse(localPaid));
          }
        }

        // Fetch profiles table data
        let pName = "";
        let pAvatar = "";
        try {
          const { data: profile, error: profileErr } = await supabase
            .from("profiles")
            .select("full_name, avatar_url")
            .eq("id", uid)
            .maybeSingle();

          if (profileErr) {
            // fallback if avatar_url column doesn't exist
            const { data: profileFallback, error: fallbackErr } = await supabase
              .from("profiles")
              .select("full_name")
              .eq("id", uid)
              .maybeSingle();
            
            if (fallbackErr) throw fallbackErr;
            if (profileFallback) {
              pName = profileFallback.full_name ?? "";
            }
          } else if (profile) {
            pName = profile.full_name ?? "";
            pAvatar = (profile as any).avatar_url ?? "";
          }
        } catch (pErr) {
          console.warn("Profiles fetch failed, using localStorage:", pErr);
          pName = localStorage.getItem(`eduwave_profile_name_${uid}`) ?? "";
          pAvatar = localStorage.getItem(`eduwave_profile_avatar_${uid}`) ?? "";
        }
        
        if (active) {
          setFullName(pName);
          setInitialName(pName);
          setAvatarUrl(pAvatar);
          setInitialAvatar(pAvatar);
        }

        // Fetch enrollments
        let coursesList: string[] = [];
        let paidList: string[] = [];
        try {
          const { data: enrollments, error: enrollmentsErr } = await supabase
            .from("enrollments")
            .select("course_name, is_paid")
            .eq("user_id", uid);

          if (enrollmentsErr) throw enrollmentsErr;
          if (enrollments) {
            coursesList = enrollments.map((e) => e.course_name);
            paidList = enrollments.filter((e) => (e as any).is_paid).map((e) => e.course_name);
            localStorage.setItem(`eduwave_enrollments_${uid}`, JSON.stringify(coursesList));
            localStorage.setItem(`eduwave_paid_courses_${uid}`, JSON.stringify(paidList));
          }
        } catch (eErr) {
          console.warn("Enrollments fetch failed, using localStorage:", eErr);
          const localEnc = localStorage.getItem(`eduwave_enrollments_${uid}`);
          if (localEnc) {
            coursesList = JSON.parse(localEnc);
          }
          const localPaid = localStorage.getItem(`eduwave_paid_courses_${uid}`);
          if (localPaid) {
            paidList = JSON.parse(localPaid);
          }
        }

        if (active) {
          setEnrolledCourses(coursesList);
          setPaidCourses(paidList);
        }
      } catch (err: any) {
        console.error("Error loading user data:", err);
        toast.error("Не удалось загрузить данные аккаунта");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadUserData();

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) {
        if (active) navigate({ to: "/auth" });
      }
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  // Payment triggers & processing
  const startPayment = (courseName: string) => {
    setSelectedPaymentCourse(courseName);
    setIsPaymentOpen(true);
    setCardNumber("");
    setCardExpiry("");
    setCardCvv("");
    setCardName("");
    setKaspiPhone("");
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !selectedPaymentCourse) return;

    setIsPaying(true);

    setTimeout(async () => {
      try {
        const { error } = await supabase
          .from("enrollments")
          .upsert({ user_id: userId, course_name: selectedPaymentCourse, is_paid: true }, { onConflict: "user_id,course_name" });

        if (error) throw error;
      } catch (err) {
        console.warn("Supabase payment update failed, using localStorage fallback:", err);
      }

      const updatedPaid = [...paidCourses, selectedPaymentCourse];
      setPaidCourses(updatedPaid);
      localStorage.setItem(`eduwave_paid_courses_${userId}`, JSON.stringify(updatedPaid));
      
      setIsPaying(false);
      setIsPaymentOpen(false);
      toast.success(`Оплата курса «${selectedPaymentCourse}» успешно завершена! Доступ к урокам открыт. 🚀`, {
        duration: 5000,
      });
    }, 2000);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Файл слишком большой. Выберите изображение менее 5 МБ.");
      return;
    }

    try {
      const resized = await resizeAvatar(file);
      setAvatarUrl(resized);
      toast.success("Изображение успешно загружено! Нажмите 'Сохранить изменения' для применения.");
    } catch (err) {
      console.error(err);
      toast.error("Не удалось обработать изображение.");
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({ id: userId, full_name: fullName, avatar_url: avatarUrl });

      if (error) {
        // try fallback if avatar_url column doesn't exist
        const { error: fallbackErr } = await supabase
          .from("profiles")
          .upsert({ id: userId, full_name: fullName });
        if (fallbackErr) throw fallbackErr;
      }

      setInitialName(fullName);
      setInitialAvatar(avatarUrl);
      localStorage.setItem(`eduwave_profile_name_${userId}`, fullName);
      localStorage.setItem(`eduwave_profile_avatar_${userId}`, avatarUrl);
      toast.success("Профиль успешно обновлен!");
    } catch (err: any) {
      console.warn("Profile update failed, using localStorage fallback:", err);
      setInitialName(fullName);
      setInitialAvatar(avatarUrl);
      localStorage.setItem(`eduwave_profile_name_${userId}`, fullName);
      localStorage.setItem(`eduwave_profile_avatar_${userId}`, avatarUrl);
      toast.success("Профиль успешно обновлен!");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Вы вышли из системы");
    navigate({ to: "/" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--gradient-soft)] flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground font-semibold">Загрузка личного кабинета...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <Toaster richColors position="top-center" />
      
      {/* Header */}
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
            <Link to="/courses" className="hover:text-foreground transition">Курсы и цены</Link>
          </nav>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-2.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition cursor-pointer flex items-center justify-center font-bold border-none bg-transparent"
              title="Переключить тему"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button onClick={handleLogout} className="px-4 py-2 rounded-full bg-muted text-sm font-bold hover:bg-border transition cursor-pointer">
              Выйти
            </button>
          </div>
        </div>
      </header>

      {/* Main content container */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="font-display font-extrabold text-4xl leading-tight">
              Личный <span className="text-brand-blue">кабинет</span>
            </h1>
            <p className="text-muted-foreground mt-2 font-semibold">
              Управляйте своим обучением и личной информацией
            </p>
          </div>
          
          {/* Global platform quick pulse */}
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 shadow-sm">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider">Платформа активна</span>
          </div>
        </div>

        {/* Stats Grid Dashboard */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* Stat 1: Personal Finished */}
          <div className="p-6 rounded-3xl bg-card border border-border shadow-sm relative overflow-hidden group hover:border-brand-orange/30 transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-orange/5 rounded-full blur-2xl group-hover:bg-brand-orange/10 transition-all" />
            <div className="text-3xl">🏆</div>
            <div className="mt-3 text-2xl font-extrabold text-brand-orange leading-none">{myFinishedCount}</div>
            <div className="text-[10px] text-muted-foreground font-bold mt-2.5 uppercase tracking-wider leading-snug">Моих завершённых курсов</div>
          </div>

          {/* Stat 2: Personal In Progress */}
          <div className="p-6 rounded-3xl bg-card border border-border shadow-sm relative overflow-hidden group hover:border-brand-blue/30 transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-blue/5 rounded-full blur-2xl group-hover:bg-brand-blue/10 transition-all" />
            <div className="text-3xl">📖</div>
            <div className="mt-3 text-2xl font-extrabold text-brand-blue leading-none">{myActiveCount}</div>
            <div className="text-[10px] text-muted-foreground font-bold mt-2.5 uppercase tracking-wider leading-snug">Моих курсов в процессе</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Profile Card (Left) */}
          <div className="lg:col-span-1 p-8 rounded-3xl bg-card border border-border shadow-[var(--shadow-card)]">
            <div className="flex flex-col items-center text-center pb-6 border-b border-border">
              <div className="relative group mb-4 cursor-pointer">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Аватар"
                    className="w-24 h-24 rounded-full object-cover border-2 border-brand-blue/30 shadow-[var(--shadow-glow)] group-hover:border-brand-blue transition duration-200"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-[var(--gradient-hero)] flex items-center justify-center text-white font-display font-extrabold text-3xl shadow-[var(--shadow-glow)]">
                    {fullName ? fullName.charAt(0).toUpperCase() : userEmail ? userEmail.charAt(0).toUpperCase() : "?"}
                  </div>
                )}
                <label className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition duration-200 cursor-pointer">
                  <span className="text-base mb-0.5">📷</span>
                  <span>Изменить</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>
              <h2 className="font-display font-bold text-xl">{fullName || "Пользователь"}</h2>
              <p className="text-sm text-muted-foreground font-semibold mt-1 break-all">{userEmail}</p>
              <span className="mt-4 px-3 py-1 rounded-full bg-brand-blue/15 text-brand-blue font-bold text-xs">
                Студент EduWave
              </span>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5 pt-6">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                  Имя и фамилия
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-brand-blue focus:outline-none transition font-semibold"
                  placeholder="Иван Петров"
                />
              </div>

              <button
                type="submit"
                disabled={saving || (fullName === initialName && avatarUrl === initialAvatar)}
                className="w-full py-3.5 rounded-full bg-brand-blue text-brand-blue-foreground font-bold shadow-md hover:opacity-95 transition disabled:opacity-50 disabled:cursor-default cursor-pointer text-sm"
              >
                {saving ? "Сохранение..." : "Сохранить изменения"}
              </button>
            </form>
          </div>

          {/* Enrolled Courses (Right) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-8 rounded-3xl bg-card border border-border shadow-[var(--shadow-card)]">
              <h2 className="font-display font-bold text-2xl mb-6 flex items-center gap-3">
                <span>📖 Мои курсы</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-orange text-brand-orange-foreground font-bold">
                  {enrolledCourses.filter((e) => !["Старт", "Стандарт", "Премиум"].includes(e)).length}
                </span>
              </h2>

              {enrolledCourses.filter((e) => !["Старт", "Стандарт", "Премиум"].includes(e)).length === 0 ? (
                <div className="text-center py-10">
                  <div className="text-5xl mb-4">🎓</div>
                  <p className="font-bold text-lg mb-2">Вы пока не записались ни на один курс</p>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
                    Выберите интересующее направление в нашем каталоге и приступайте к обучению!
                  </p>
                  <Link
                    to="/courses"
                    className="inline-block px-6 py-3 rounded-full bg-brand-orange text-brand-orange-foreground font-bold text-sm shadow-[var(--shadow-glow)] hover:scale-105 transition"
                  >
                    Открыть каталог курсов
                  </Link>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {catalogCourses
                    .filter((c) => enrolledCourses.includes(c.name))
                    .map((c) => {
                      const isPaid = paidCourses.includes(c.name);
                      
                      // Progress calculation
                      const lessons = getLessonsForCourse(c.name);
                      const localProgress = localStorage.getItem(`eduwave_progress_${userId}_${c.name}`);
                      const completedLessons = localProgress ? (JSON.parse(localProgress) as number[]) : [];
                      const progressPercent = Math.round((completedLessons.length / lessons.length) * 100);
                      const isCompleted = progressPercent === 100;

                      return (
                        <div
                          key={c.name}
                          onClick={() => {
                            if (isPaid || isCompleted) {
                              navigate({ to: "/learning", search: { course: c.name } });
                            } else {
                              startPayment(c.name);
                            }
                          }}
                          className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between hover:shadow-md cursor-pointer hover:scale-[1.01] active:scale-[0.99] ${
                            isCompleted 
                              ? "bg-gradient-to-br from-amber-500/10 to-yellow-500/5 border-amber-400/60 shadow-[0_4px_20px_rgba(245,158,11,0.05)] hover:border-amber-400"
                              : "bg-background border-border hover:border-brand-blue"
                          }`}
                        >
                          <div>
                            <div className="flex justify-between items-start">
                              <div className="text-4xl">{c.emoji}</div>
                              {isCompleted ? (
                                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-xs font-extrabold flex items-center gap-1 animate-pulse">
                                  👑 Завершён!
                                </span>
                              ) : isPaid ? (
                                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                  Оплачен
                                </span>
                              ) : (
                                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-xs font-bold flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                  Демо-доступ
                                </span>
                              )}
                            </div>
                            <h3 className="font-display font-bold text-lg mt-4">{c.name}</h3>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-0.5">{c.tag}</p>
                            {!isPaid && !isCompleted && (
                              <p className="text-sm font-extrabold text-brand-blue mt-2">
                                {c.price.toLocaleString("ru")} ₸ <span className="text-xs font-normal text-muted-foreground">/ мес</span>
                              </p>
                            )}

                            {/* Beautiful visual progress bar */}
                            <div className="mt-4 p-3.5 rounded-xl bg-muted/40 border border-border/30">
                              <div className="flex justify-between items-center text-xs font-bold text-muted-foreground mb-1.5">
                                <span>Пройдено: {completedLessons.length} из {lessons.length}</span>
                                <span className={isCompleted ? "text-amber-600 font-extrabold" : "text-brand-blue font-extrabold"}>
                                  {progressPercent}%
                                </span>
                              </div>
                              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className={`h-full transition-all duration-700 rounded-full ${
                                    isCompleted 
                                      ? "bg-gradient-to-r from-amber-500 to-yellow-400" 
                                      : "bg-brand-blue"
                                  }`}
                                  style={{ width: `${progressPercent}%` }}
                                />
                              </div>
                              {isCompleted && (
                                <div className="mt-2 text-[10px] text-amber-600 font-bold flex items-center gap-1">
                                  🎉 Вы освоили весь материал курса!
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between gap-2">
                            {isPaid || isCompleted ? (
                              <>
                                <span className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                                  <span>●</span> Доступ открыт
                                </span>
                                <Link
                                  to="/learning"
                                  search={{ course: c.name }}
                                  className="text-xs font-bold text-brand-blue hover:underline cursor-pointer flex items-center gap-1"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {isCompleted ? "Повторить уроки →" : "Продолжить обучение →"}
                                </Link>
                              </>
                            ) : (
                              <>
                                 <Link
                                   to="/learning"
                                   search={{ course: c.name }}
                                   className="text-sm font-bold text-muted-foreground hover:text-brand-blue transition cursor-pointer"
                                   onClick={(e) => e.stopPropagation()}
                                 >
                                   Пробный урок 🔓
                                 </Link>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    startPayment(c.name);
                                  }}
                                  className="px-3.5 py-1.5 rounded-full bg-brand-orange text-brand-orange-foreground text-xs font-bold hover:scale-[1.03] active:scale-95 transition shadow-sm cursor-pointer border-none"
                                >
                                  Оплатить
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            {/* Subscriptions Card */}
            <div className="p-8 rounded-3xl bg-card border border-border shadow-[var(--shadow-card)]">
              <h2 className="font-display font-bold text-2xl mb-4">💳 Тариф подписки</h2>
              
              {enrolledCourses.some((e) => ["Старт", "Стандарт", "Премиум"].includes(e)) ? (
                <div>
                  {enrolledCourses
                    .filter((e) => ["Старт", "Стандарт", "Премиум"].includes(e))
                    .map((planName) => (
                      <div
                        key={planName}
                        className="p-6 rounded-2xl bg-gradient-to-r from-brand-blue/10 to-brand-orange/10 border border-brand-blue/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wider text-brand-orange">
                            Текущий статус
                          </div>
                          <h3 className="font-display font-extrabold text-2xl mt-1">Тариф: «{planName}»</h3>
                          <p className="text-sm text-muted-foreground mt-1">Подписка активна и продлевается автоматически.</p>
                        </div>
                        <Link
                          to="/courses"
                          className="px-5 py-2.5 rounded-full bg-white text-gray-900 border border-border text-xs font-bold hover:bg-gray-50 dark:bg-card dark:text-foreground dark:hover:bg-muted dark:border-border/50 transition"
                        >
                          Сменить тариф
                        </Link>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-muted/50 border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display font-bold text-lg">Подписка не оформлена</h3>
                    <p className="text-sm text-muted-foreground mt-1">Выберите тариф, чтобы получить полный доступ ко всем курсам платформы.</p>
                  </div>
                  <Link
                    to="/courses"
                    className="px-5 py-2.5 rounded-full bg-brand-blue text-brand-blue-foreground text-xs font-bold hover:opacity-90 transition whitespace-nowrap"
                  >
                    Выбрать тариф
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Checkout Payment Modal */}
      {isPaymentOpen && selectedPaymentCourse && (
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

            <h2 className="font-display font-extrabold text-2xl">Оплата обучения</h2>
            <p className="text-sm text-muted-foreground mt-1 font-semibold">
              Курс: <span className="font-bold text-foreground">«{selectedPaymentCourse}»</span>
            </p>

            <div className="mt-6 p-4 rounded-2xl bg-muted/50 border border-border flex items-center justify-between">
              <span className="text-sm font-semibold text-muted-foreground">Сумма к оплате:</span>
              <span className="font-display font-extrabold text-xl text-brand-blue">
                {(catalogCourses.find((c) => c.name === selectedPaymentCourse)?.price ?? 0).toLocaleString("ru")} ₸
              </span>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-2 gap-2 mt-6 p-1 bg-muted rounded-full">
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`py-2 rounded-full text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border-none ${
                  paymentMethod === "card" ? "bg-white text-foreground shadow-sm font-extrabold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span>💳</span> Картой банка
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("kaspi")}
                className={`py-2 rounded-full text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border-none ${
                  paymentMethod === "kaspi" ? "bg-white text-foreground shadow-sm font-extrabold" : "text-muted-foreground hover:text-foreground"
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
                    Оплатить {(catalogCourses.find((c) => c.name === selectedPaymentCourse)?.price ?? 0).toLocaleString("ru")} ₸
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
