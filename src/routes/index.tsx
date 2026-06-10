import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/hero-students.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "EduWave — Онлайн-курсы для школьников и студентов" },
      {
        name: "description",
        content:
          "Учись легко, развивайся уверенно, достигай больше. Онлайн-курсы по школьным предметам, программированию, дизайну и английскому языку.",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Unbounded:wght@600;700;800&display=swap",
      },
    ],
  }),
});

const advantages = [
  { icon: "📘", title: "Школьные предметы", desc: "Полный охват школьной программы" },
  { icon: "💻", title: "Современные навыки", desc: "Программирование, дизайн, английский" },
  { icon: "🧑‍🏫", title: "Опытные преподаватели", desc: "Эксперты с многолетним стажем" },
  { icon: "🚀", title: "Гибкий формат", desc: "Учись в своём темпе, когда удобно" },
  { icon: "🎯", title: "Подготовка к экзаменам", desc: "ОГЭ, ЕГЭ и поступление в вуз" },
];

const courses = [
  { emoji: "🚀", name: "Вводный IT-экспресс (Пробный)", tag: "Старт в IT · Бесплатно" },
  { emoji: "➗", name: "Математика", tag: "Школа · ЕГЭ" },
  { emoji: "⚛️", name: "Физика", tag: "7–11 класс" },
  { emoji: "🧪", name: "Химия", tag: "Школа · Олимпиады" },
  { emoji: "🏛️", name: "История", tag: "ОГЭ · ЕГЭ" },
  { emoji: "🇬🇧", name: "Английский язык", tag: "A1 — C1" },
  { emoji: "💻", name: "Программирование", tag: "Python · Web" },
  { emoji: "🎨", name: "Дизайн", tag: "Figma · UI/UX · Бесплатно" },
  { emoji: "📖", name: "Русский язык", tag: "ОГЭ · ЕГЭ" },
  { emoji: "🧬", name: "Биология", tag: "Школа · ОГЭ · ЕГЭ" },
  { emoji: "📢", name: "Маркетинг", tag: "SMM · SMM · SEO" },
  { emoji: "📱", name: "Мобильная разработка", tag: "iOS · Android · Flutter" },
];

const reviews = [
  {
    name: "Екатерина Соколова",
    role: "Студентка 1 курса IT-направления",
    avatar: "https://i.pravatar.cc/120?img=47",
    rating: 5,
    date: "14 мая 2026",
    course: "Программирование (Python & Web)",
    category: "it",
    verified: true,
    text: "Честно говоря, сначала я очень сомневалась. В интернете полно курсов-пустышек. Но здесь меня зацепила возможность пройти первый урок бесплатно в пробном режиме. Прошла тест в конце урока, и мне сразу открылся доступ дальше. Объясняют сложные вещи невероятно просто: от устройства серверов до функций и ООП. В итоге за 4 месяца я не просто освоила базу Python, но и написала своё первое полноценное API на FastAPI! Интерактивный класс с интерактивными тренажёрами и тестами после каждой темы — это лучшее решение, прогресс видишь сразу. Поступила на грант в МУИТ в Алматы!",
  },
  {
    name: "Дмитрий Козлов",
    role: "Выпускник школы, 11 класс",
    avatar: "https://i.pravatar.cc/120?img=12",
    rating: 5,
    date: "28 апреля 2026",
    course: "Математика (Подготовка к ЕГЭ)",
    category: "school",
    verified: true,
    text: "Готовился к ЕГЭ с нуля, пробники в школе писал еле-еле на 40-50 баллов. В EduWave занимался в течение полугода по 3 раза в неделю. Понравилось, что обучение идёт строго по шагам — пока не разберёшься с линейными уравнениями и не решишь тест, тригонометрию тебе никто не откроет, это заставляет реально учиться, а не просто перелистывать лекции. Преподаватели разбирают именно те ловушки, которые потом реально встретились на экзамене. Результат — 88 баллов на реальном ЕГЭ и поступил на бюджет в Астане!",
  },
  {
    name: "Арсен Кусаинов",
    role: "Начинающий веб-разработчик",
    avatar: "https://i.pravatar.cc/120?img=33",
    rating: 5,
    date: "18 мая 2026",
    course: "Вводный IT-экспресс (Пробный)",
    category: "trial",
    verified: true,
    text: "Я долго не знал, с чего начать в программировании, боялся, что это слишком сложно и дорого. Увидел курс 'Вводный IT-экспресс' и то, что он полностью бесплатный. Это просто космос! Прошёл все 5 уроков за один вечер: от понимания работы интернета до стилизации на CSS и первой функции в JS. Всё это по шагам, с мини-квизами. В личном кабинете загорелась золотая корона 'Завершён 100%'. Именно этот пробный курс дал мне веру в себя, и я сразу же оплатил профессиональный курс по Web-разработке. Всем советую попробовать именно с него в Караганде!",
  },
  {
    name: "Алина Исмаилова",
    role: "Ученица 9 класса",
    avatar: "https://i.pravatar.cc/120?img=45",
    rating: 5,
    date: "3 мая 2026",
    course: "Английский язык (A1 — C1)",
    category: "school",
    verified: true,
    text: "У меня всегда был языковой барьер, боялась разговаривать на уроках в школе. Начала с бесплатного пробного урока по английскому в EduWave и поняла, что формат онлайн-класса мне идеально подходит. Заниматься можно в своём темпе. Теория подана кратко, без лишней «воды», а озвучка и интерактивные диалоги помогают быстро привыкнуть к живому произношению. Мой прогресс-бар в личном кабинете мотивировал меня не забрасывать занятия. Сейчас спокойно смотрю фильмы на английском!",
  },
  {
    name: "Марина Васильевна",
    role: "Мама ученика 8 класса",
    avatar: "https://i.pravatar.cc/120?img=38",
    rating: 5,
    date: "10 мая 2026",
    course: "Физика & Химия (Школьный курс)",
    category: "school",
    verified: true,
    text: "Мой сын Никита сильно отстал по физике и химии, не понимал формулы, скатился на тройки. Записала его в EduWave. Очень удобно, что оплатили подписку прямо через Kaspi без лишних сложностей. Ребенок занимается с огромным удовольствием! Курсы выстроены как интерактивная игра: изучает интерактивные схемы, читает теорию и решает задачу. Если решает неправильно, система объясняет ошибку и дает попробовать снова. Оценки в школе за четверть поднялись до твердой пятерки в Павлодаре!",
  },
  {
    name: "Тимур Ахметов",
    role: "UI/UX Дизайнер на фрилансе",
    avatar: "https://i.pravatar.cc/120?img=11",
    rating: 5,
    date: "22 апреля 2026",
    course: "Дизайн (Figma · UI/UX)",
    category: "it",
    verified: true,
    text: "Работал менеджером по продажам в Алматы, но всегда тянуло к дизайну. Прошел первый пробный урок в EduWave, сделал простую карточку товара в Figma прямо по пошаговой интерактивной инструкции и загорелся! Понравилось отношение к деталям: никакой сухой теории, только реальные дизайн-системы, сетки и композиция. За полгода собрал портфолио, взял первый заказ на фрилансе на дизайн лендинга и полностью отбил стоимость обучения! Сейчас работаю удаленно на зарубежную студию.",
  },
];

function Index() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [activeReviewTab, setActiveReviewTab] = useState<"all" | "trial" | "it" | "school">("all");
  const [coursesList, setCoursesList] = useState<{ emoji: string; name: string; tag: string }[]>(courses);

  useEffect(() => {
    async function loadCourses() {
      try {
        const { data, error } = await supabase
          .from("courses")
          .select("emoji, name, tag")
          .order("created_at", { ascending: true });
        if (error) throw error;
        if (data && data.length > 0) {
          setCoursesList(data);
        }
      } catch (err) {
        console.warn("Error loading courses from Supabase index:", err);
      }
    }
    loadCourses();
  }, []);

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

  const filteredReviews = activeReviewTab === "all"
    ? reviews
    : reviews.filter((r) => r.category === activeReviewTab);

  useEffect(() => {
    async function loadUserAvatar(uid: string) {
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
        console.warn("Error loading avatar from db in index:", err);
      }
    }

    supabase.auth.getSession().then(({ data }) => {
      const email = data.session?.user.email ?? null;
      const uid = data.session?.user.id;
      setUserEmail(email);
      if (uid) loadUserAvatar(uid);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      const email = session?.user.email ?? null;
      const uid = session?.user.id;
      setUserEmail(email);
      if (uid) {
        loadUserAvatar(uid);
      } else {
        setAvatarUrl(null);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[var(--gradient-hero)] flex items-center justify-center text-white font-display font-bold">
              E
            </div>
            <span className="font-display font-bold text-xl">EduWave</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-muted-foreground">
            <a href="#advantages" className="hover:text-foreground transition">Преимущества</a>
            <a href="#courses" className="hover:text-foreground transition">Курсы</a>
            <a href="#reviews" className="hover:text-foreground transition">Отзывы</a>
          </nav>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-2.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition cursor-pointer flex items-center justify-center font-bold border-none bg-transparent"
              title="Переключить тему"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            {userEmail ? (
              <div className="flex items-center gap-4">
                <Link to="/courses" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition">
                  Курсы
                </Link>
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
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[var(--gradient-soft)]" aria-hidden />
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-brand-orange/20 blur-3xl" aria-hidden />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-brand-blue/20 blur-3xl" aria-hidden />

        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-orange/15 text-brand-orange font-bold text-xs uppercase tracking-wider">
              🎓 Образовательная платформа
            </span>
            <h1 className="mt-6 font-display font-extrabold text-5xl md:text-6xl leading-[1.05] tracking-tight">
              Учись легко.<br />
              Развивайся <span className="text-brand-blue">уверенно</span>.<br />
              Достигай <span className="text-brand-orange">больше</span>.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-lg font-semibold">
              Онлайн-курсы для школьников и студентов
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/courses"
                className="px-8 py-4 rounded-full bg-brand-orange text-brand-orange-foreground font-bold text-base shadow-[var(--shadow-glow)] hover:scale-105 transition-transform"
              >
                Начать обучение →
              </Link>

            </div>
            <div className="mt-10 flex flex-wrap items-center gap-6 sm:gap-8 bg-white/40 dark:bg-card/40 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-white/60 dark:border-border/40 shadow-sm max-w-lg">
              <div className="flex-1 min-w-[120px]">
                <div className="font-display font-extrabold text-2xl sm:text-3xl text-brand-blue flex items-center gap-1.5 leading-none">
                  <span>8 914</span>
                  <span className="text-xl sm:text-2xl">🎓</span>
                </div>
                <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider mt-1.5">Закончили курс</div>
              </div>
              <div className="h-8 w-px bg-border hidden sm:block" />
              <div className="flex-1 min-w-[120px]">
                <div className="font-display font-extrabold text-2xl sm:text-3xl text-foreground flex items-center gap-2 leading-none">
                  <span>4 582</span>
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                </div>
                <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider mt-1.5">Учатся сейчас</div>
              </div>
              <div className="h-8 w-px bg-border hidden sm:block" />
              <div className="flex-1 min-w-[100px]">
                <div className="font-display font-extrabold text-2xl sm:text-3xl text-brand-orange flex items-center gap-1 leading-none">
                  <span>4.9</span>
                  <span className="text-xl text-amber-500">★</span>
                </div>
                <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider mt-1.5">Рейтинг</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-[var(--gradient-hero)] rounded-[2.5rem] rotate-3 opacity-20" aria-hidden />
            <img
              src={heroImage}
              alt="Школьники и студенты учатся онлайн"
              width={1280}
              height={960}
              className="relative rounded-[2.5rem] shadow-[var(--shadow-card)] bg-card w-full h-auto"
            />
            <div className="absolute -bottom-6 -left-6 bg-card text-foreground border border-border/50 rounded-2xl p-4 shadow-[var(--shadow-card)] flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center text-2xl">🏆</div>
              <div>
                <div className="font-bold text-sm">+92 балла</div>
                <div className="text-xs text-muted-foreground">средний рост на ЕГЭ</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section id="advantages" className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-display font-bold text-4xl md:text-5xl">Почему выбирают нас</h2>
          <p className="mt-4 text-muted-foreground font-semibold">
            Всё, что нужно для уверенного роста — в одной платформе
          </p>
        </div>
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {advantages.map((a, i) => (
            <div
              key={a.title}
              className={`p-7 rounded-3xl border border-border bg-card hover:shadow-[var(--shadow-card)] hover:-translate-y-1 transition-all ${
                i === 0 ? "lg:col-span-1" : ""
              }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-brand-blue/10 flex items-center justify-center text-3xl">
                {a.icon}
              </div>
              <h3 className="mt-5 font-display font-bold text-xl">{a.title}</h3>
              <p className="mt-2 text-muted-foreground">{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Courses */}
      <section id="courses" className="bg-[var(--gradient-soft)] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display font-bold text-4xl md:text-5xl">Каталог курсов</h2>
              <p className="mt-3 text-muted-foreground font-semibold">
                Выбирай направление и начинай прямо сейчас
              </p>
            </div>
            <span className="text-sm font-bold text-brand-blue">{coursesList.length} направлений →</span>
          </div>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coursesList.map((c) => (
              <div
                key={c.name}
                className="group p-6 rounded-3xl bg-card border border-border hover:border-brand-orange hover:shadow-[var(--shadow-card)] transition-all"
              >
                <div className="text-5xl">{c.emoji}</div>
                <h3 className="mt-5 font-display font-bold text-lg">{c.name}</h3>
                <div className="mt-1 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  {c.tag}
                </div>
                <Link
                  to={userEmail ? "/courses" : "/auth"}
                  className="mt-5 w-full inline-block text-center py-3 rounded-full bg-brand-blue/5 text-brand-blue font-bold text-sm group-hover:bg-brand-orange group-hover:text-brand-orange-foreground transition"
                >
                  Записаться
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex px-4 py-1.5 rounded-full bg-brand-orange/15 text-brand-orange font-bold text-xs uppercase tracking-wider animate-pulse">
            ⭐ Доверие и результаты
          </span>
          <h2 className="mt-4 font-display font-bold text-4xl md:text-5xl">Отзывы учеников</h2>
          <p className="mt-4 text-muted-foreground font-semibold">
            Честные истории о пробных уроках, пошаговом обучении и реальных результатах на экзаменах
          </p>

          {/* Interactive filter pills */}
          <div className="mt-10 flex flex-wrap justify-center gap-2.5">
            {[
              { id: "all", label: "Все отзывы", emoji: "📋" },
              { id: "trial", label: "Пробный курс", emoji: "🚀" },
              { id: "it", label: "IT & Программирование", emoji: "💻" },
              { id: "school", label: "Школьные предметы", emoji: "➗" }
            ].map((tab) => {
              const isActive = activeReviewTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveReviewTab(tab.id as any)}
                  className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? "bg-brand-blue text-white shadow-md scale-105 border-none"
                      : "bg-card hover:bg-muted text-muted-foreground hover:text-foreground border border-border/40"
                  }`}
                >
                  <span>{tab.emoji}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-8">
          {filteredReviews.map((r) => (
            <figure
              key={r.name}
              className="p-8 rounded-3xl border border-border bg-card hover:shadow-[var(--shadow-card)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="text-brand-orange flex gap-0.5 text-lg">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  {r.verified && (
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-600 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Проверен
                    </span>
                  )}
                </div>
                <div className="text-[11px] font-bold text-brand-blue uppercase tracking-wider mb-2">
                  Курс: {r.course}
                </div>
                <blockquote className="text-foreground/95 leading-relaxed text-sm font-semibold italic">
                  "{r.text}"
                </blockquote>
              </div>
              
              <figcaption className="mt-8 pt-4 border-t border-border/50 flex items-center gap-3">
                <img
                  src={r.avatar}
                  alt={r.name}
                  loading="lazy"
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover border border-border"
                />
                <div>
                  <div className="font-display font-bold text-sm text-foreground">{r.name}</div>
                  <div className="text-xs text-muted-foreground font-semibold mt-0.5">{r.role}</div>
                  <div className="text-[10px] text-muted-foreground/75 mt-1 font-bold">{r.date}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="px-6 pb-24">
        <div className="relative max-w-6xl mx-auto rounded-[2.5rem] overflow-hidden bg-[var(--gradient-hero)] p-12 md:p-20 text-center">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl" aria-hidden />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-orange/30 rounded-full blur-3xl" aria-hidden />
          <div className="relative">
            <h2 className="font-display font-extrabold text-4xl md:text-6xl text-brand-orange tracking-tight drop-shadow-[0_2px_20px_rgba(0,0,0,0.25)]">
              Начни обучение прямо сейчас!
            </h2>
            <p className="mt-5 text-amber-200 text-lg font-bold max-w-2xl mx-auto drop-shadow-sm">
              ✨ Первое занятие — абсолютно бесплатно! Найдите идеальный курс под свои цели всего за пару кликов.
            </p>
            <Link
              to={userEmail ? "/courses" : "/auth"}
              className="inline-block mt-10 px-10 py-5 rounded-full bg-brand-orange text-brand-orange-foreground font-bold text-lg shadow-2xl hover:scale-105 transition-transform"
            >
              Записаться на курс
            </Link>
          </div>
        </div>
      </section>

      {/* Support Footer */}
      <footer className="border-t border-border bg-card/50">
        {/* Support Section */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-blue/10 text-brand-blue font-bold text-xs uppercase tracking-wider">
              💬 Поддержка
            </span>
            <h2 className="mt-5 font-display font-bold text-3xl md:text-4xl">Свяжитесь с нами</h2>
            <p className="mt-4 text-muted-foreground font-semibold leading-relaxed text-base">
              Если вы обнаружили ошибку или какую-то неисправность — пожалуйста, сообщите нам.
              Мы будем рады каждому вашему сообщению! 🙏
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {/* Phone 1 */}
            <a
              href="tel:87768485011"
              className="group flex flex-col items-center gap-4 p-7 rounded-3xl border border-border bg-background hover:border-brand-blue hover:shadow-[var(--shadow-card)] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-brand-blue/10 flex items-center justify-center text-2xl group-hover:bg-brand-blue group-hover:text-white transition-all duration-300">
                📞
              </div>
              <div className="text-center">
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Телефон 1</div>
                <div className="font-display font-bold text-base text-foreground group-hover:text-brand-blue transition">
                  8 776 848 50 11
                </div>
              </div>
            </a>

            {/* Phone 2 */}
            <a
              href="tel:87003879593"
              className="group flex flex-col items-center gap-4 p-7 rounded-3xl border border-border bg-background hover:border-brand-blue hover:shadow-[var(--shadow-card)] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-brand-blue/10 flex items-center justify-center text-2xl group-hover:bg-brand-blue group-hover:text-white transition-all duration-300">
                📱
              </div>
              <div className="text-center">
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Телефон 2</div>
                <div className="font-display font-bold text-base text-foreground group-hover:text-brand-blue transition">
                  8 700 387 95 93
                </div>
              </div>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/zholdasbeko_v"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-4 p-7 rounded-3xl border border-border bg-background hover:border-brand-orange hover:shadow-[var(--shadow-card)] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-brand-orange/10 flex items-center justify-center text-2xl group-hover:bg-gradient-to-br group-hover:from-pink-500 group-hover:to-brand-orange group-hover:text-white transition-all duration-300">
                📸
              </div>
              <div className="text-center">
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Instagram</div>
                <div className="font-display font-bold text-base text-foreground group-hover:text-brand-orange transition">
                  @zholdasbeko_v
                </div>
              </div>
            </a>
          </div>
        </section>

        {/* Copyright */}
        <div className="border-t border-border py-6 text-center text-sm text-muted-foreground">
          © 2026 EduWave. Учись с удовольствием.
        </div>
      </footer>
    </div>
  );
}
