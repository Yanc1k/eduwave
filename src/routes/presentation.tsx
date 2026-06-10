import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { 
  Play, ArrowRight, ArrowLeft, Maximize2, Minimize2, Check, Sparkles, 
  Laptop, BookOpen, CreditCard, Layers, Award, TrendingUp, X, Moon, Sun, 
  Code, RefreshCw, Smartphone, HelpCircle, ArrowUpRight, Zap
} from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/presentation")({
  component: PresentationPage,
  head: () => ({
    meta: [
      { title: "Интерактивная презентация EduWave" },
      { name: "description", content: "Познакомьтесь с возможностями платформы EduWave в интерактивном формате." },
    ],
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Unbounded:wght@600;700;800&display=swap",
      },
    ],
  }),
});

function PresentationPage() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
    }
    return 'light';
  });

  // Theme control
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Fullscreen control
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.error("Error enabling fullscreen:", err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "Space") {
        e.preventDefault();
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevSlide();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide]);

  const slideCount = 7;

  const nextSlide = () => {
    if (currentSlide < slideCount - 1) {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  // Slide 4: Interactive Sandbox Sandbox State
  const [sandboxHtml, setSandboxHtml] = useState(true);
  const [sandboxCss, setSandboxCss] = useState(false);
  const [sandboxJs, setSandboxJs] = useState(false);
  const [clicksCount, setClicksCount] = useState(0);

  // Slide 5: Kaspi payment simulator State
  const [kaspiPhone, setKaspiPhone] = useState("");
  const [kaspiStep, setKaspiStep] = useState(1); // 1 = input, 2 = sending request, 3 = success

  const triggerKaspiSim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kaspiPhone) {
      toast.error("Пожалуйста, введите номер телефона");
      return;
    }
    setKaspiStep(2);
    setTimeout(() => {
      setKaspiStep(3);
      toast.success("Счет успешно выставлен в приложении Kaspi.kz! 📱");
    }, 2000);
  };

  const resetKaspiSim = () => {
    setKaspiPhone("");
    setKaspiStep(1);
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex flex-col justify-between overflow-hidden relative select-none">
      <Toaster richColors position="top-center" />
      
      {/* Top progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-muted z-50">
        <div 
          className="h-full bg-gradient-to-r from-brand-blue to-brand-orange transition-all duration-500"
          style={{ width: `${((currentSlide + 1) / slideCount) * 100}%` }}
        />
      </div>

      {/* Top Controls Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-border/50 bg-background/50 backdrop-blur-md z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--gradient-hero)] flex items-center justify-center text-white font-display font-bold text-sm">
            E
          </div>
          <span className="font-display font-bold text-lg hidden sm:inline">EduWave Presentation</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-orange/15 text-brand-orange font-bold uppercase tracking-wider">
            Слайд {currentSlide + 1} из {slideCount}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition cursor-pointer bg-transparent border-none"
            title="Переключить тему"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition cursor-pointer bg-transparent border-none"
            title={isFullscreen ? "Выйти из полноэкранного режима" : "Войти в полноэкранный режим"}
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>

          <Link
            to="/"
            className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition cursor-pointer bg-transparent border-none"
            title="Выйти на сайт"
          >
            <X className="w-5 h-5" />
          </Link>
        </div>
      </header>

      {/* Slide Content container */}
      <main className="flex-1 flex items-center justify-center p-6 relative">
        
        {/* Decorative elements */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-brand-blue/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-brand-orange/10 blur-3xl pointer-events-none" />

        {/* Slide 1: Welcome Slide */}
        {currentSlide === 0 && (
          <div className="max-w-4xl text-center flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-500">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-brand-orange/15 text-brand-orange font-bold text-xs uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Презентация Платформы
            </span>
            <h1 className="font-display font-extrabold text-5xl md:text-7xl leading-tight tracking-tight">
              EduWave
            </h1>
            <p className="mt-4 font-display font-bold text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-orange">
              Новое поколение онлайн-обучения школьников и студентов
            </p>
            <p className="mt-6 text-muted-foreground max-w-xl text-base md:text-lg font-semibold leading-relaxed">
              Интерактивные тренажеры, визуальные диаграммы, индивидуальный прогресс и простое управление подписками.
            </p>
            <div className="mt-10 flex items-center gap-6 bg-card/60 backdrop-blur-md p-6 rounded-3xl border border-border/60 shadow-lg">
              <div className="text-center px-4">
                <div className="font-display font-extrabold text-2xl text-brand-blue">8k+</div>
                <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mt-1">Студентов</div>
              </div>
              <div className="w-px h-10 bg-border/80" />
              <div className="text-center px-4">
                <div className="font-display font-extrabold text-2xl text-foreground">12+</div>
                <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mt-1">Направлений</div>
              </div>
              <div className="w-px h-10 bg-border/80" />
              <div className="text-center px-4">
                <div className="font-display font-extrabold text-2xl text-brand-orange">+92</div>
                <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mt-1">ЕГЭ баллов</div>
              </div>
            </div>
            <button
              onClick={nextSlide}
              className="mt-10 px-8 py-4 rounded-full bg-brand-blue text-white font-bold hover:scale-105 transition-transform flex items-center gap-2 cursor-pointer shadow-lg shadow-brand-blue/25 border-none"
            >
              <span>Посмотреть презентацию</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <div className="mt-4 text-xs text-muted-foreground font-semibold flex items-center gap-1.5">
              <span>Используйте стрелки</span>
              <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border text-[10px]">←</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border text-[10px]">→</kbd>
              <span>или пробел для навигации</span>
            </div>
          </div>
        )}

        {/* Slide 2: Problem Slide */}
        {currentSlide === 1 && (
          <div className="max-w-5xl w-full grid md:grid-cols-2 gap-12 items-center animate-in fade-in slide-in-from-right-8 duration-500">
            <div>
              <span className="inline-flex px-3 py-1 rounded-full bg-red-500/10 text-red-500 font-bold text-xs uppercase tracking-wider mb-4">
                ⚠️ Проблема
              </span>
              <h2 className="font-display font-bold text-3xl md:text-4xl leading-tight">
                Почему классические онлайн-курсы <span className="text-red-500">не работают</span>?
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed font-semibold">
                Большинство современных сайтов предлагают однотипный формат: запишитесь, смотрите видеолекции длительностью по 2 часа и скачивайте текстовые PDF. В результате:
              </p>
              
              <ul className="mt-6 space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center font-bold text-sm shrink-0">✕</div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">Потеря мотивации</h4>
                    <p className="text-xs text-muted-foreground">Ученики скучают и забрасывают обучение на первой неделе.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center font-bold text-sm shrink-0">✕</div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">Отсутствие быстрой практики</h4>
                    <p className="text-xs text-muted-foreground">Теория не закрепляется сразу в коде или интерактивных тестах.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center font-bold text-sm shrink-0">✕</div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">Сложная и скрытая ценовая политика</h4>
                    <p className="text-xs text-muted-foreground">Требуется брать кредиты на сотни тысяч или оплачивать кота в мешке.</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="bg-card border border-border p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl" />
              <h3 className="font-display font-bold text-xl text-center mb-6">Типичный путь студента на обычных курсах</h3>
              
              <div className="space-y-6 relative before:absolute before:top-2 before:bottom-2 before:left-[17px] before:w-0.5 before:bg-red-500/20">
                <div className="flex gap-4 relative">
                  <div className="w-9 h-9 rounded-full bg-red-500/10 border border-red-500/25 flex items-center justify-center text-sm font-bold text-red-500 shrink-0 z-10">1</div>
                  <div>
                    <div className="font-bold text-sm">Оплата огромного кредита</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Приходится сразу платить за год вперед без уверенности.</div>
                  </div>
                </div>
                
                <div className="flex gap-4 relative">
                  <div className="w-9 h-9 rounded-full bg-red-500/10 border border-red-500/25 flex items-center justify-center text-sm font-bold text-red-500 shrink-0 z-10">2</div>
                  <div>
                    <div className="font-bold text-sm">Просмотр скучного 2-часового видео</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Много сухой теории без примеров, тяжело удержать фокус.</div>
                  </div>
                </div>

                <div className="flex gap-4 relative">
                  <div className="w-9 h-9 rounded-full bg-red-500/10 border border-red-500/25 flex items-center justify-center text-sm font-bold text-red-500 shrink-0 z-10">3</div>
                  <div>
                    <div className="font-bold text-sm">Попытка написать домашнее задание</div>
                    <div className="text-xs text-muted-foreground mt-0.5">В локальной среде ничего не запускается, ошибки, куратор отвечает через сутки.</div>
                  </div>
                </div>

                <div className="flex gap-4 relative">
                  <div className="w-9 h-9 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-sm font-bold text-red-500 shrink-0 z-10">4</div>
                  <div>
                    <div className="font-bold text-sm text-red-500 font-extrabold">Заброшенное обучение (90% случаев)</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Итог: долг по рассрочке и отсутствие новых навыков.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Slide 3: Solution Slide */}
        {currentSlide === 2 && (
          <div className="max-w-5xl w-full grid md:grid-cols-2 gap-12 items-center animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="order-2 md:order-1 bg-card border border-border p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl" />
              <h3 className="font-display font-bold text-xl text-center mb-6">Инновационный подход EduWave</h3>
              
              <div className="space-y-6 relative before:absolute before:top-2 before:bottom-2 before:left-[17px] before:w-0.5 before:bg-brand-blue/20">
                <div className="flex gap-4 relative">
                  <div className="w-9 h-9 rounded-full bg-brand-blue/10 border border-brand-blue/25 flex items-center justify-center text-sm font-bold text-brand-blue shrink-0 z-10">1</div>
                  <div>
                    <div className="font-bold text-sm">Пробный бесплатный урок</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Доступ открыт мгновенно без привязки карт. Проверьте платформу сами.</div>
                  </div>
                </div>
                
                <div className="flex gap-4 relative">
                  <div className="w-9 h-9 rounded-full bg-brand-blue/10 border border-brand-blue/25 flex items-center justify-center text-sm font-bold text-brand-blue shrink-0 z-10">2</div>
                  <div>
                    <div className="font-bold text-sm">Интерактивный класс с практикой</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Теория разбита на краткие абзацы с интерактивным симулятором прямо на сайте.</div>
                  </div>
                </div>

                <div className="flex gap-4 relative">
                  <div className="w-9 h-9 rounded-full bg-brand-blue/10 border border-brand-blue/25 flex items-center justify-center text-sm font-bold text-brand-blue shrink-0 z-10">3</div>
                  <div>
                    <div className="font-bold text-sm">Контроль прогресса по шагам</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Каждая лекция требует прохождения теста или квиза для открытия следующего шага.</div>
                  </div>
                </div>

                <div className="flex gap-4 relative">
                  <div className="w-9 h-9 rounded-full bg-brand-orange/20 border border-brand-orange/40 flex items-center justify-center text-sm font-bold text-brand-orange shrink-0 z-10">4</div>
                  <div>
                    <div className="font-bold text-sm text-brand-orange font-extrabold">Успешное завершение курса 🏆</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Изучение прикладных навыков с сияющей золотой короной в ЛК.</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <span className="inline-flex px-3 py-1 rounded-full bg-brand-blue/10 text-brand-blue font-bold text-xs uppercase tracking-wider mb-4">
                ✨ Наше решение
              </span>
              <h2 className="font-display font-bold text-3xl md:text-4xl leading-tight">
                Интерактивное обучение <span className="text-brand-blue">EduWave</span>
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed font-semibold">
                Мы создали платформу, которая переносит фокус со скучного зазубривания лекций на увлекательный интерактивный процесс:
              </p>
              
              <ul className="mt-6 space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center font-bold text-sm shrink-0">✓</div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">Практика на лету</h4>
                    <p className="text-xs text-muted-foreground">Интегрированный в браузер веб-тренажер для HTML, CSS, JS и Git.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center font-bold text-sm shrink-0">✓</div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">Гибкая подписка</h4>
                    <p className="text-xs text-muted-foreground">Никаких кредитов. Оплачивайте ежемесячно по тарифам через Kaspi или карту.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center font-bold text-sm shrink-0">✓</div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">Геймификация и прогресс-бары</h4>
                    <p className="text-xs text-muted-foreground">Визуальные шкалы завершения курсов мотивируют дойти до конца.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Slide 4: Interactive Playground Demo (Live Showcase) */}
        {currentSlide === 3 && (
          <div className="max-w-5xl w-full flex flex-col items-center animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="text-center max-w-2xl mb-6">
              <span className="inline-flex px-3 py-1 rounded-full bg-brand-orange/15 text-brand-orange font-bold text-xs uppercase tracking-wider mb-2">
                🚀 Живое интерактивное демо
              </span>
              <h2 className="font-display font-bold text-2xl md:text-3xl">
                Попробуйте тренажер EduWave прямо сейчас!
              </h2>
              <p className="text-xs md:text-sm text-muted-foreground font-semibold">
                Кликните на переключатели в редакторе, чтобы мгновенно применить стили или запустить интерактивную логику в окне превью справа.
              </p>
            </div>

            {/* Sandbox Widget */}
            <div className="w-full grid md:grid-cols-2 gap-6 bg-card border border-border p-5 rounded-[2.5rem] shadow-2xl relative">
              
              {/* Code editor side */}
              <div className="bg-slate-900 text-slate-200 rounded-3xl p-5 font-mono text-xs flex flex-col justify-between min-h-[340px] shadow-inner relative overflow-hidden">
                <div className="absolute top-2 right-4 flex gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                </div>
                
                <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest font-sans font-bold border-b border-slate-800 pb-2 mb-3 flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-brand-orange" /> index.html & styles.css
                  </div>

                  <pre className="text-slate-300 leading-relaxed">
                    {`<!-- HTML разметка -->`} <br/>
                    <span className="text-blue-400">&lt;div</span> <span className="text-purple-400">class</span>=<span className="text-emerald-400">"preview-card"</span><span className="text-blue-400">&gt;</span> <br/>
                    {`  `} <span className="text-blue-400">&lt;h3&gt;</span>Привет, EduWave!<span className="text-blue-400">&lt;/h3&gt;</span> <br/>
                    {sandboxJs ? (
                      <>
                        {`  `} <span className="text-blue-400">&lt;button</span> <span className="text-purple-400">id</span>=<span className="text-emerald-400">"magic-btn"</span><span className="text-blue-400">&gt;</span>Кликни меня<span className="text-blue-400">&lt;/button&gt;</span> <br/>
                        {`  `} <span className="text-blue-400">&lt;p&gt;</span>Кликнуто: <span className="text-amber-400">{clicksCount}</span> раз(а)<span className="text-blue-400">&lt;/p&gt;</span> <br/>
                      </>
                    ) : (
                      <>
                        {`  `} <span className="text-blue-400">&lt;p&gt;</span>Здесь скоро появится кнопка...<span className="text-blue-400">&lt;/p&gt;</span> <br/>
                      </>
                    )}
                    <span className="text-blue-400">&lt;/div&gt;</span>
                  </pre>

                  <pre className="text-slate-300 mt-4 pt-4 border-t border-slate-800 leading-relaxed">
                    {`/* Стили CSS */`} <br/>
                    <span className="text-emerald-500">.preview-card</span> {`{`} <br/>
                    {sandboxCss ? (
                      <span className="text-orange-400">
                        {`  background: linear-gradient(135deg, #3b82f6, #f97316);`} <br/>
                        {`  color: white;`} <br/>
                        {`  border-radius: 20px;`} <br/>
                        {`  padding: 24px;`} <br/>
                        {`  box-shadow: 0 10px 15px rgba(59, 130, 246, 0.3);`} <br/>
                      </span>
                    ) : (
                      <span className="text-slate-500">
                        {`  background: #ffffff;`} <br/>
                        {`  color: #333333;`} <br/>
                        {`  border: 1px solid #cccccc;`} <br/>
                        {`  border-radius: 0px;`} <br/>
                        {`  padding: 10px;`} <br/>
                      </span>
                    )}
                    {`}`}
                  </pre>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap gap-2">
                  <button 
                    onClick={() => setSandboxCss(!sandboxCss)}
                    className={`px-3 py-1.5 rounded-lg font-sans font-bold text-[10px] cursor-pointer transition flex items-center gap-1 border-none ${
                      sandboxCss ? "bg-brand-blue text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    <span>{sandboxCss ? "✓ Стили CSS подключены" : "Подключить CSS"}</span>
                  </button>

                  <button 
                    onClick={() => {
                      setSandboxJs(!sandboxJs);
                      setClicksCount(0);
                    }}
                    className={`px-3 py-1.5 rounded-lg font-sans font-bold text-[10px] cursor-pointer transition flex items-center gap-1 border-none ${
                      sandboxJs ? "bg-brand-orange text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    <span>{sandboxJs ? "✓ JS Клик-логика активна" : "Добавить кнопку и JS"}</span>
                  </button>
                </div>
              </div>

              {/* Preview side */}
              <div className="bg-slate-100 dark:bg-slate-950 rounded-3xl p-5 border border-border flex flex-col justify-between min-h-[340px] relative">
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-sans font-bold border-b border-border/60 pb-2 flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" /> Живой предпросмотр результата
                </div>

                <div className="flex-1 flex items-center justify-center p-4">
                  
                  {/* Dynamic simulated card */}
                  <div className={`transition-all duration-500 text-center w-full max-w-sm ${
                    sandboxCss 
                      ? "bg-gradient-to-br from-brand-blue to-brand-orange text-white p-8 rounded-3xl shadow-lg scale-105" 
                      : "bg-white text-slate-800 p-4 border border-slate-300 rounded-none shadow-none text-left"
                  }`}>
                    <h4 className={`font-display font-bold transition-all ${sandboxCss ? "text-lg text-white" : "text-sm text-slate-800"}`}>
                      Привет, EduWave!
                    </h4>
                    
                    {sandboxJs ? (
                      <div className="mt-4 space-y-3">
                        <button
                          onClick={() => setClicksCount(c => c + 1)}
                          className={`px-5 py-2.5 rounded-xl font-bold text-xs cursor-pointer shadow-md hover:scale-105 active:scale-95 transition-all border-none ${
                            sandboxCss 
                              ? "bg-white text-brand-blue font-extrabold" 
                              : "bg-slate-900 text-white"
                          }`}
                        >
                          Кликни меня
                        </button>
                        <p className={`text-[10px] font-bold ${sandboxCss ? "text-white/80" : "text-muted-foreground"}`}>
                          Кнопка нажата: <span className="font-display font-extrabold text-sm">{clicksCount}</span> раз(а)
                        </p>
                      </div>
                    ) : (
                      <p className={`text-xs mt-3 ${sandboxCss ? "text-white/80" : "text-slate-500"}`}>
                        Здесь скоро появится кнопка...
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-[10px] text-muted-foreground font-semibold flex justify-between items-center bg-card/60 backdrop-blur-sm p-2 rounded-xl border border-border/40">
                  <span>Статус компилятора: <span className="text-emerald-500 font-bold">Ожидание клика</span></span>
                  <button 
                    onClick={() => {
                      setSandboxCss(false);
                      setSandboxJs(false);
                      setClicksCount(0);
                    }}
                    className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer border-none bg-transparent"
                    title="Сбросить состояние"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Slide 5: Courses & Kaspi Billing Flow Simulator */}
        {currentSlide === 4 && (
          <div className="max-w-5xl w-full grid md:grid-cols-2 gap-12 items-center animate-in fade-in slide-in-from-right-8 duration-500">
            <div>
              <span className="inline-flex px-3 py-1 rounded-full bg-brand-orange/15 text-brand-orange font-bold text-xs uppercase tracking-wider mb-4">
                💳 Доступная оплата
              </span>
              <h2 className="font-display font-bold text-3xl md:text-4xl leading-tight">
                Интеграция с <span className="text-red-500 font-extrabold">Kaspi.kz</span> и картами
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed font-semibold">
                Мы заботимся о доступности образования. Оплата подписки на EduWave реализована максимально просто и безопасно для рынка Казахстана:
              </p>
              
              <ul className="mt-6 space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✓</div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">Мгновенный пуш-счет</h4>
                    <p className="text-xs text-muted-foreground">Впишите свой номер телефона и подтвердите оплату в приложении Kaspi одним кликом.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✓</div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">Защищенное шифрование карт</h4>
                    <p className="text-xs text-muted-foreground">Полная поддержка международных стандартов безопасности платежей.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✓</div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">Никаких автосписаний без ведома</h4>
                    <p className="text-xs text-muted-foreground">Управляйте подпиской и отменяйте ее в личном кабинете в любое время.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Simulated Checkout Box */}
            <div className="bg-card border border-border p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
              <span className="absolute -top-3 -right-3 px-8 py-4 bg-brand-orange text-brand-orange-foreground text-[10px] font-bold uppercase tracking-wider rotate-12">
                СИМУЛЯТОР
              </span>
              
              <div className="flex items-center gap-2 mb-6">
                <div className="w-4 h-4 rounded bg-red-500 text-[10px] text-white flex items-center justify-center font-bold">K</div>
                <h3 className="font-display font-bold text-lg">Оплата через Kaspi.kz</h3>
              </div>

              {kaspiStep === 1 && (
                <form onSubmit={triggerKaspiSim} className="space-y-4">
                  <div className="p-4 rounded-2xl bg-muted/50 border border-border flex justify-between items-center">
                    <span className="text-xs text-muted-foreground font-semibold">Тариф «Стандарт»</span>
                    <span className="font-display font-extrabold text-lg text-brand-blue">14 990 ₸</span>
                  </div>

                  <div>
                    <label className="text-xs font-bold block mb-1">Номер телефона в Kaspi.kz</label>
                    <input 
                      type="tel"
                      required
                      placeholder="+7 (707) 123-45-67"
                      value={kaspiPhone}
                      onChange={(e) => setKaspiPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-brand-blue focus:outline-none transition text-sm font-semibold"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-full bg-brand-orange text-brand-orange-foreground font-bold hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer text-sm border-none shadow-md"
                  >
                    Выставить счет на оплату
                  </button>
                </form>
              )}

              {kaspiStep === 2 && (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mb-4" />
                  <h4 className="font-bold text-sm">Отправка запроса в Kaspi...</h4>
                  <p className="text-xs text-muted-foreground mt-1">Формируем защищенную сессию оплаты...</p>
                </div>
              )}

              {kaspiStep === 3 && (
                <div className="py-8 text-center flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-3xl mb-4">
                    ✓
                  </div>
                  <h4 className="font-display font-bold text-lg text-emerald-500">Счет успешно выставлен!</h4>
                  <p className="text-xs text-muted-foreground max-w-xs mx-auto mt-2 leading-relaxed font-semibold">
                    На номер <span className="font-bold text-foreground">{kaspiPhone}</span> отправлено push-уведомление в приложение Kaspi.kz. Подтвердите оплату там.
                  </p>
                  
                  <button
                    onClick={resetKaspiSim}
                    className="mt-6 px-6 py-2.5 rounded-full bg-muted text-xs font-bold hover:bg-border transition cursor-pointer border-none"
                  >
                    Попробовать снова
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Slide 6: Technology Stack */}
        {currentSlide === 5 && (
          <div className="max-w-5xl w-full flex flex-col items-center animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="text-center max-w-2xl mb-10">
              <span className="inline-flex px-3 py-1 rounded-full bg-brand-blue/10 text-brand-blue font-bold text-xs uppercase tracking-wider mb-2">
                🛠️ Под капотом
              </span>
              <h2 className="font-display font-bold text-3xl">
                Наш технологический стек
              </h2>
              <p className="text-sm text-muted-foreground font-semibold">
                EduWave спроектирован на базе самых быстрых и передовых веб-технологий для мгновенной загрузки и плавного интерфейса.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
              <div className="bg-card border border-border p-6 rounded-3xl text-center shadow-md flex flex-col items-center justify-between hover:border-brand-blue transition">
                <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 text-brand-blue flex items-center justify-center text-2xl mb-4">
                  ⚛️
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm">React & TS</h4>
                  <p className="text-[11px] text-muted-foreground mt-1 font-semibold leading-relaxed">
                    Строгая типизация кода и быстрый рендеринг интерфейса.
                  </p>
                </div>
              </div>

              <div className="bg-card border border-border p-6 rounded-3xl text-center shadow-md flex flex-col items-center justify-between hover:border-brand-blue transition">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-2xl mb-4 font-bold">
                  T
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm">TanStack Router</h4>
                  <p className="text-[11px] text-muted-foreground mt-1 font-semibold leading-relaxed">
                    Умная маршрутизация с предзагрузкой данных и валидацией.
                  </p>
                </div>
              </div>

              <div className="bg-card border border-border p-6 rounded-3xl text-center shadow-md flex flex-col items-center justify-between hover:border-brand-blue transition">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-2xl mb-4">
                  ⚡
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm">Supabase Backend</h4>
                  <p className="text-[11px] text-muted-foreground mt-1 font-semibold leading-relaxed">
                    База данных PostgreSQL, авторизация и хранение прогресса.
                  </p>
                </div>
              </div>

              <div className="bg-card border border-border p-6 rounded-3xl text-center shadow-md flex flex-col items-center justify-between hover:border-brand-blue transition">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center text-2xl mb-4">
                  🎨
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm">Tailwind CSS v4</h4>
                  <p className="text-[11px] text-muted-foreground mt-1 font-semibold leading-relaxed">
                    Премиум-дизайн с OKLCH цветами и плавной анимацией.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-muted/40 border border-border/50 rounded-3xl p-5 w-full text-center max-w-xl">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Деплой и хостинг</span>
              <p className="text-xs text-foreground font-semibold mt-1">
                Сайт полностью оптимизирован под облачный деплой в <span className="font-bold text-brand-blue">Vercel</span> с автоматической сборкой и защитой.
              </p>
            </div>
          </div>
        )}

        {/* Slide 7: Call to Action (Outro) */}
        {currentSlide === 6 && (
          <div className="max-w-3xl text-center flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-500">
            <span className="inline-flex px-4 py-1.5 rounded-full bg-brand-orange/15 text-brand-orange font-bold text-xs uppercase tracking-wider mb-6">
              🎉 Начните прямо сейчас
            </span>
            
            <h2 className="font-display font-extrabold text-4xl md:text-5xl leading-tight tracking-tight">
              Готовы войти в волну <span className="text-brand-blue">EduWave</span>?
            </h2>
            
            <p className="mt-6 text-muted-foreground max-w-xl text-base md:text-lg font-semibold leading-relaxed">
              Попробуйте первый урок бесплатно прямо сейчас, пройдите интерактивные тренажеры и убедитесь в эффективности нового подхода самостоятельно.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                to="/courses"
                className="px-8 py-4 rounded-full bg-brand-orange text-brand-orange-foreground font-bold text-base shadow-[var(--shadow-glow)] hover:scale-105 transition-transform"
              >
                Выбрать курс и начать
              </Link>
              
              <Link
                to="/"
                className="px-8 py-4 rounded-full bg-white text-gray-900 border-2 border-border font-bold text-base hover:bg-gray-50 hover:border-brand-blue dark:bg-card dark:text-foreground dark:hover:bg-muted dark:border-border/50 transition"
              >
                На главную страницу
              </Link>
            </div>

            <div className="mt-14 flex items-center gap-3 text-xs text-muted-foreground font-bold uppercase tracking-wider">
              <span>© 2026 EduWave</span>
              <span className="w-1.5 h-1.5 rounded-full bg-brand-blue" />
              <span>Сделано с любовью к знаниям</span>
            </div>
          </div>
        )}

      </main>

      {/* Footer / Presentation Controls Navigation */}
      <footer className="px-6 py-4 flex items-center justify-between border-t border-border/50 bg-background/50 backdrop-blur-md z-40">
        
        {/* Previous Button */}
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="px-4 py-2.5 rounded-full bg-card hover:bg-muted text-muted-foreground hover:text-foreground border border-border/50 font-bold text-xs transition cursor-pointer flex items-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Назад</span>
        </button>

        {/* Dots indicators */}
        <div className="hidden sm:flex items-center gap-2">
          {Array.from({ length: slideCount }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-3 h-3 rounded-full transition-all cursor-pointer border-none ${
                idx === currentSlide 
                  ? "bg-brand-blue w-6 scale-110" 
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/60"
              }`}
              title={`Перейти к слайду ${idx + 1}`}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={nextSlide}
          disabled={currentSlide === slideCount - 1}
          className="px-4 py-2.5 rounded-full bg-brand-blue text-white hover:bg-brand-blue/90 font-bold text-xs transition cursor-pointer flex items-center gap-1.5 border-none disabled:opacity-30 disabled:cursor-not-allowed shadow-md shadow-brand-blue/15"
        >
          <span>Далее</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </footer>
    </div>
  );
}
