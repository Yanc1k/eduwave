-- Create courses table
create table if not exists public.courses (
  id uuid default gen_random_uuid() primary key,
  name text unique not null,
  emoji text not null,
  tag text not null,
  price integer default 0 not null,
  old_price integer,
  badge text,
  created_at timestamptz not null default now()
);

-- Enable RLS for courses
alter table public.courses enable row level security;

-- Policies for courses
drop policy if exists "Allow public read access to courses" on public.courses;
create policy "Allow public read access to courses"
  on public.courses for select
  using (true);


-- Create lessons table
create table if not exists public.lessons (
  id uuid default gen_random_uuid() primary key,
  course_name text not null references public.courses(name) on delete cascade,
  lesson_number integer not null,
  title text not null,
  duration text not null,
  is_trial boolean default false not null,
  theory text not null,
  video_url text default '' not null,
  question text not null,
  options text[] not null,
  correct_answer text not null,
  is_playground boolean default false not null,
  playground_template text,
  playground_task text,
  custom_visual_type text,
  created_at timestamptz not null default now(),
  unique (course_name, lesson_number)
);

-- Enable RLS for lessons
alter table public.lessons enable row level security;

-- Policies for lessons
drop policy if exists "Allow public read access to lessons" on public.lessons;
create policy "Allow public read access to lessons"
  on public.lessons for select
  using (true);


-- ---------------------------------------------------------
-- Insert initial courses
-- ---------------------------------------------------------
insert into public.courses (name, emoji, tag, price, old_price, badge) values
('Вводный IT-экспресс (Пробный)', '🚀', 'Старт в IT · Бесплатно', 0, 4990, 'Пробный'),
('Математика', '➗', 'Школа · ЕГЭ', 14990, 19990, 'Хит'),
('Физика', '⚛️', '7–11 класс', 13990, null, null),
('Химия', '🧪', 'Школа · Олимпиады', 13990, null, null),
('История', '🏛️', 'ОГЭ · ЕГЭ', 12490, null, null),
('Английский язык', '🇬🇧', 'A1 — C1', 17490, 22490, 'Новый'),
('Программирование', '💻', 'Python · Web', 24990, null, 'Топ'),
('Дизайн', '🎨', 'Figma · UI/UX · Бесплатно', 0, 19990, 'Бесплатно'),
('Русский язык', '📖', 'ОГЭ · ЕГЭ', 12490, null, null),
('Биология', '🧬', 'Школа · ОГЭ · ЕГЭ', 13490, 18990, 'Новый'),
('Маркетинг', '📢', 'SMM · SMM · SEO', 18990, 24990, 'Хит'),
('Мобильная разработка', '📱', 'iOS · Android · Flutter', 26490, 34990, 'Топ')
on conflict (name) do update set
  emoji = excluded.emoji,
  tag = excluded.tag,
  price = excluded.price,
  old_price = excluded.old_price,
  badge = excluded.badge;


-- ---------------------------------------------------------
-- Insert lessons for "Вводный IT-экспресс (Пробный)"
-- ---------------------------------------------------------
insert into public.lessons (course_name, lesson_number, title, duration, is_trial, theory, question, options, correct_answer, is_playground, playground_template, playground_task, custom_visual_type) values
('Вводный IT-экспресс (Пробный)', 1, 'Урок 1: Как устроен веб и интернет', '10 мин', true, 
 'Интернет — это глобальная сеть компьютеров, соединенных друг с другом. Когда вы вводите в адресную строку браузера доменное имя (например, google.com), ваш браузер запрашивает IP-адрес сервера у службы доменных имен (DNS). Затем отправляется HTTP/HTTPS-запрос. В ответ сервер присылает файлы разметки (HTML), оформления (CSS) и логики (JavaScript), которые браузер собирает в полноценную интерактивную страницу.',
 'Какая распределенная служба отвечает за преобразование буквенных имен сайтов (доменов) в числовые IP-адреса?',
 array['Служба DNS', 'Проводной провайдер', 'Протокол HTTPS', 'Локальный файрвол'],
 'Служба DNS', false, null, null, 'client_server'),

('Вводный IT-экспресс (Пробный)', 2, 'Урок 2: Разметка HTML и структура страницы', '15 мин', true, 
 'HTML (HyperText Markup Language) — это стандартный язык разметки документов во Всемирной паутине. HTML-код состоит из элементов (тегов), которые сообщают браузеру, как именно отображать контент. Теги обычно бывают парными (открывающий и закрывающий). Основная структура включает тег <html>, служебный раздел <head> (хранит кодировку, заголовки, стили) и визуальный раздел <body> (абзацы <p>, ссылки <a>, заголовки от <h1> до <h6>, изображения <img>).',
 'С помощью какого тега создаются гиперссылки для перехода на другие веб-страницы?',
 array['Тег <a>', 'Тег <link>', 'Тег <href>', 'Тег <p>'],
 'Тег <a>', true, 
 '<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: ''Segoe UI'', sans-serif;
      text-align: center;
      padding: 40px;
      background-color: #f8fafc;
      color: #334155;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      padding: 30px;
      border-radius: 16px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- ЗАДАНИЕ 1: Создайте ниже заголовок h1 с текстом "Привет от будущего разработчика!" -->
    
    
    <!-- ЗАДАНИЕ 2: Создайте ниже абзац p с текстом "Я учусь разметке HTML на платформе EduWave." -->
    
    
    <!-- ЗАДАНИЕ 3: Создайте ниже кнопку с текстом "Нажми на меня" -->
    <!-- Подсказка стилей кнопки: <button style="background: #3b82f6; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; cursor: pointer;"> -->
    
    
  </div>
</body>
</html>', 
 'Интерактивный HTML-тренажер!
Ниже приведен пустой шаблон. Добавьте в него HTML теги:
1. Заголовок <h1> с текстом ''Привет от будущего разработчика!''.
2. Абзац <p> с текстом ''Я учусь разметке HTML на платформе EduWave.''.
3. Кнопку <button> с текстом ''Нажми на меня'' (попробуйте добавить встроенный стиль style для красоты!).', null),

('Вводный IT-экспресс (Пробный)', 3, 'Урок 3: Стили CSS и основы оформления', '15 мин', true, 
 'CSS (Cascading Style Sheets) — каскадные таблицы стилей, используемые для описания внешнего вида страницы. Стили подключаются отдельно и связываются с HTML через селекторы. Селекторы указывают, к каким элементам применить свойства. Например, p { color: blue; font-size: 16px; }. CSS работает по принципу «блочной модели» (Box Model), где у каждого элемента есть ширина, высота, внутренние отступы (padding), рамка (border) и внешние поля (margin) для позиционирования.',
 'Какое CSS-свойство позволяет настроить внешнее расстояние (отступ) от границ текущего блока до соседних элементов?',
 array['margin', 'padding', 'border-spacing', 'content-align'],
 'margin', true, 
 '<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: ''Segoe UI'', sans-serif;
      text-align: center;
      background-color: #f0f9ff;
      padding: 20px;
    }
    
    .card {
      background: white;
      padding: 30px;
      border-radius: 20px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      max-width: 400px;
      margin: 40px auto;
      transition: all 0.3s;
      /* ЗАДАНИЕ 1: Добавьте рамку ''border: 3px solid #3b82f6;'' вокруг этой карточки */
      
    }
    
    h1 {
      /* ЗАДАНИЕ 2: Измените цвет текста заголовка ''color'' на #3b82f6 (синий) */
      color: #1e293b;
    }
    
    .btn {
      display: inline-block;
      padding: 10px 24px;
      border-radius: 9999px;
      text-decoration: none;
      font-weight: bold;
      /* ЗАДАНИЕ 3: Измените фоновый цвет кнопки ''background-color'' на #f97316 (оранжевый) */
      background-color: #3b82f6;
      color: white;
      transition: all 0.2s;
    }
    
    .btn:hover {
      transform: translateY(-2px);
    }
  </style>
</head>
<body>
 
  <div class="card">
    <h1>Мой стильный блок</h1>
    <p>CSS позволяет оживить простую HTML структуру и сделать её невероятно красивой!</p>
    <a href="#" class="btn">Нажми меня</a>
  </div>
 
</body>
</html>', 
 'Интерактивный HTML/CSS тренажер! Ниже приведен шаблон. Измените стили CSS внутри тега <style>:
1. Добавьте свойство ''border: 3px solid #3b82f6;'' в класс .card.
2. Измените цвет заголовка h1 (свойство color) на #3b82f6.
3. Измените background-color у кнопки .btn на #f97316.', null),

('Вводный IT-экспресс (Пробный)', 4, 'Урок 4: Основы JavaScript и интерактив', '20 мин', true, 
 'JavaScript (JS) — полноценный динамический язык программирования, выполняемый браузером на стороне пользователя. Он привносит на сайт интерактивность и логику. JS умеет реагировать на события (клики мыши, нажатия клавиш, прокрутку). Для отслеживания действий пользователя используется метод addEventListener, связывающий элемент веб-страницы с функцией-обработчиком. С помощью JS можно динамически изменять HTML-код страницы, добавлять анимации и отправлять формы без перезагрузки.',
 'Какой стандартный метод JS позволяет назначить функцию-слушатель для обработки клика пользователя на интерактивную кнопку?',
 array['addEventListener(''click'', ...)', 'attachClickEvent(''onclick'', ...)', 'createClickListener()', 'bind(''click'')'],
 'addEventListener(''click'', ...)', true, 
 '<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: ''Segoe UI'', sans-serif;
      text-align: center;
      padding: 40px;
      background-color: #faf5ff;
    }
    .panel {
      max-width: 450px;
      margin: 0 auto;
      background: white;
      padding: 30px;
      border-radius: 20px;
      box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05);
    }
    .btn {
      display: inline-block;
      padding: 12px 28px;
      background-color: #a855f7;
      color: white;
      font-weight: bold;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      font-size: 14px;
      box-shadow: 0 4px 6px -1px rgba(168, 85, 247, 0.2);
      transition: all 0.2s;
    }
    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 15px -3px rgba(168, 85, 247, 0.3);
    }
    #result-text {
      margin-top: 25px;
      font-size: 18px;
      font-weight: 800;
      color: #8b5cf6;
      min-height: 27px;
      transition: all 0.3s;
    }
  </style>
</head>
<body>
  <div class="panel">
    <h2>Интерактивный кликер</h2>
    <p>Нажмите на кнопку ниже, чтобы запустить JavaScript код.</p>
    
    <button id="my-button" class="btn">Запустить магию ✨</button>
    
    <div id="result-text"></div>
  </div>
 
  <script>
    const btn = document.getElementById(''my-button'');
    const output = document.getElementById(''result-text'');
 
    // ЗАДАНИЕ: Назначьте слушатель клика для кнопки btn с помощью метода addEventListener
    // Синтаксис: btn.addEventListener(''click'', () => { ... });
    // Внутри обработчика клика напишите: output.textContent = ''Ура! JavaScript успешно сработал! 🚀🎉'';
    // Также можете попробовать сменить цвет, например: output.style.color = ''#10b981'';
 
  </script>
</body>
</html>', 
 'Интерактивный JavaScript тренажер!
Давайте научим кнопку реагировать на нажатие:
1. Назначьте обработчик события ''click'' для кнопки btn с помощью метода addEventListener(''click'', ...).
2. При клике измените текст элемента output (output.textContent) на ''Ура! JavaScript успешно сработал! 🚀🎉''.', null),

('Вводный IT-экспресс (Пробный)', 5, 'Урок 5: Публикация сайта и карьерный путь в IT', '15 мин', true, 
 'После написания кода сайта его нужно разместить в сети. Для этого используются облачные хостинги, такие как GitHub Pages, Netlify или Vercel. Например, GitHub Pages позволяет бесплатно опубликовать статический сайт прямо из Git-репозитория за пару кликов. Создание простых сайтов — это первый шаг. Веб-разработка делится на Frontend (внешний вид в браузере), Backend (логика сервера и базы данных) и Fullstack (универсальный стек). Для старта достаточно освоить HTML, CSS, Git и базовый JavaScript.',
 'Какой популярный бесплатный сервис позволяет опубликовать свой сайт в интернет напрямую из публичного репозитория GitHub?',
 array['GitHub Pages', 'Google Drive Cloud', 'Yandex Disk Share', 'VS Code Live Server'],
 'GitHub Pages', false, null, null, 'roadmap'),

('Вводный IT-экспресс (Пробный)', 6, 'Урок 6: Git и системы контроля версий', '20 мин', true, 
 'Git — это распределенная система контроля версий. Она позволяет разработчикам записывать историю изменений файлов своего проекта, возвращаться к предыдущим версиям, создавать экспериментальные ветки и сливать код вместе при командной работе. GitHub — это облачная платформа, хостинг для Git-репозиториев. Базовые команды: git init (создать репозиторий), git add (подготовить файлы), git commit -m (сохранить снимок кода с сообщением) и git push (отправить в облако).',
 'Какая консольная команда Git инициализирует новый пустой Git-репозиторий в текущей папке проекта?',
 array['git init', 'git start', 'git create', 'git new-repo'],
 'git init', true, 
 '<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: sans-serif;
      padding: 30px;
      background: #f0fdf4;
      text-align: center;
    }
    .card {
      background: white;
      padding: 25px;
      border-radius: 16px;
      border: 2px dashed #22c55e;
      max-width: 400px;
      margin: 0 auto;
      box-shadow: 0 4px 10px rgba(0,0,0,0.05);
    }
  </style>
</head>
<body>
  <div class="card">
    <h3>Симулятор Терминала Git</h3>
    <p>Выполните команду инициализации Git-репозитория.</p>
    
    <!-- ЗАДАНИЕ: Впишите команду "git init" в тег code ниже, чтобы начать! -->
    <p>Команда: <code style="background: #e2e8f0; padding: 4px 8px; border-radius: 4px; font-weight: bold;">git init</code></p>
    
  </div>
</body>
</html>', 
 'Давайте проинициализируем репозиторий Git!
Впишите вместо ''???'' команду инициализации репозитория:
git init', null),

('Вводный IT-экспресс (Пробный)', 7, 'Урок 7: Базы данных и основы SQL', '20 мин', true, 
 'База данных — это структурированное хранилище информации, которой управляет веб-приложение. Для работы с базами данных используется язык SQL (Structured Query Language). Он позволяет запрашивать, обновлять, вставлять и удалять информацию. Самые популярные базы данных — реляционные (такие как PostgreSQL или MySQL), где данные хранятся в виде связанных таблиц с колонками и строками. Например, запрос SELECT * FROM users выберет всех зарегистрированных пользователей из таблицы.',
 'Какое ключевое слово SQL используется для извлечения (выборки) данных из таблицы базы данных?',
 array['SELECT', 'GET', 'EXTRACT', 'FETCH'],
 'SELECT', false, null, null, 'roadmap'),

('Вводный IT-экспресс (Пробный)', 8, 'Урок 8: Основы работы с API и запросами', '25 мин', true, 
 'API (Application Programming Interface) — это мост взаимодействия между различными программами. В вебе чаще всего используют REST API, передающий данные с помощью протокола HTTP. Клиент (браузер) отправляет запросы, такие как GET (для чтения данных), POST (для создания новых данных), PUT (для обновления) и DELETE (для удаления), а сервер возвращает ответ в формате JSON. JSON (JavaScript Object Notation) — это легкий и понятный текстовый формат обмена данными.',
 'Какой метод HTTP-запроса используется в веб-технологиях для чтения или получения информации с сервера?',
 array['GET', 'POST', 'CREATE', 'READ'],
 'GET', false, null, null, 'client_server')
on conflict (course_name, lesson_number) do nothing;


-- ---------------------------------------------------------
-- Insert lessons for "Дизайн"
-- ---------------------------------------------------------
insert into public.lessons (course_name, lesson_number, title, duration, is_trial, theory, question, options, correct_answer, is_playground, playground_template, playground_task, custom_visual_type) values
('Дизайн', 1, 'Урок 1: Введение в UI/UX дизайн и Figma', '15 мин', true, 
 'UI (User Interface) дизайн — это визуальный вид продукта: цвета, сетки, шрифты, иконки, кнопки. UX (User Experience) дизайн — это то, как пользователь взаимодействует с продуктом, насколько ему удобно находить информацию и совершать целевые действия. Figma — это самый популярный облачный графический редактор для создания интерфейсов сайтов и приложений, работающий прямо в браузере в реальном времени. В нем дизайнеры создают фреймы, векторные фигуры и интерактивные прототипы.',
 'Какая аббревиатура описывает проектирование удобства взаимодействия пользователя с веб-сайтом или мобильным приложением?',
 array['UX (User Experience)', 'UI (User Interface)', 'API (Application Interface)', 'SQL (Structured Language)'],
 'UX (User Experience)', false, null, null, null),

('Дизайн', 2, 'Урок 2: Работа с фреймами и фигурами в Figma', '20 мин', true, 
 'Фреймы в Figma — это основные рабочие области, контейнеры для вашего контента (например, экран iPhone или страница сайта). Внутри фреймов можно размещать базовые геометрические фигуры: прямоугольники (Rectangle), эллипсы (Ellipse), линии, полигоны и текстовые слои. Сочетая эти фигуры, настраивая скругление углов (Corner Radius) и заливку (Fill), дизайнеры создают кнопки, карточки товаров и целые секции будущего сайта.',
 'Какое CSS-свойство отвечает за скругление углов графических фигур и кнопок в веб-интерфейсе?',
 array['border-radius', 'corner-radius', 'border-rounding', 'box-shape'],
 'border-radius', true, 
 '<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: sans-serif;
      padding: 30px;
      background: #faf5ff;
      text-align: center;
    }
    .button-preview {
      display: inline-block;
      padding: 12px 30px;
      background: #a855f7;
      color: white;
      font-weight: bold;
      /* ЗАДАНИЕ: Задайте скругление углов (border-radius) в 12px, чтобы кнопка стала красивой! */
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(168, 85, 247, 0.2);
    }
  </style>
</head>
<body>
  <h3>Симулятор Figma</h3>
  <p>Скруглите углы у прямоугольной кнопки до 12px в редакоре CSS.</p>
  
  <div class="button-preview">Моя кнопка Figma</div>
</body>
</html>', 
 'Давайте скруглим углы у кнопки в нашем симуляторе Figma!
Впишите значение ''12px'' вместо ''0px'' в свойство border-radius в стилях .button-preview.', null),

('Дизайн', 3, 'Урок 3: Сетки, отступы и композиция', '20 мин', true, 
 'Сетки (Layout Grids) помогают структурировать контент на странице и выравнивать элементы относительно друг друга. Стандарт для веб-сайтов — 12-колоночная сетка. Отступы (Paddings и Margins) создают «воздух» в макете, позволяя глазам пользователя легко сканировать информацию. Существует правило внешнего и внутреннего: расстояние между логически отдельными блоками всегда должно быть больше, чем расстояние между элементами внутри одного блока.',
 'Какая сетка считается стандартной в веб-дизайне для горизонтального выравнивания контента на экранах компьютеров?',
 array['12-колоночная сетка', '5-колоночная сетка', 'Круговая сетка', 'Диагональная сетка'],
 '12-колоночная сетка', false, null, null, 'roadmap'),

('Дизайн', 4, 'Урок 4: Цветовые палитры и типографика', '25 мин', true, 
 'Цвета передают эмоции и расставляют визуальные акценты. Основное правило — 60-30-10: 60% площади должен занимать доминирующий фоновый цвет, 30% — вторичные цвета текста и карточек, и только 10% — яркий акцентный цвет для кнопок призыва к действию (CTA). В типографике важно соблюдать контраст размеров шрифтов (например, крупный заголовок H1 и читаемый основной текст) и выбирать современные геометрические гротески (Inter, Roboto, Nunito).',
 'Какой процент площади в правиле 60-30-10 рекомендуется выделять под яркий акцентный цвет (кнопки CTA, важные иконки)?',
 array['10%', '30%', '60%', '100%'],
 '10%', false, null, null, null),

('Дизайн', 5, 'Урок 5: Создание интерактивного прототипа', '25 мин', true, 
 'Интерактивный прототип — это модель будущего сайта, в которой можно нажимать кнопки и переходить по страницам прямо в Figma. Для создания переходов используется вкладка Prototype. Вы выбираете кнопку, вытягиваете из нее синюю стрелку (''синий волос'') и соединяете её с целевым фреймом. Можно настраивать триггеры (On Click, On Hover) и анимации переходов (Instant, Smart Animate) для достижения максимального реализма.',
 'В какой вкладке Figma настраивается интерактивное связывание экранов и кнопок для создания живой демонстрации сайта?',
 array['Prototype', 'Design', 'Inspect', 'Export'],
 'Prototype', false, null, null, 'client_server'),

('Дизайн', 6, 'Урок 6: Компоненты и Auto Layout в Figma', '20 мин', true, 
 'Компоненты — это элементы интерфейса многократного использования (например, кнопки, шапки, карточки). Изменение главного компонента (Master Component) автоматически обновляет все его копии (Instances) по всему проекту. Auto Layout — это мощная функция, позволяющая создавать динамические фреймы, которые автоматически сжимаются или расширяются в зависимости от размера их содержимого (как flexbox в CSS). Благодаря Auto Layout вы можете менять текст в кнопке, и её ширина будет увеличиваться сама, сохраняя отступы.',
 'Какая функция Figma позволяет создавать адаптивные фреймы, автоматически подстраивающиеся под размер содержимого?',
 array['Auto Layout', 'Smart Animate', 'Grid System', 'Constraints'],
 'Auto Layout', false, null, null, null),

('Дизайн', 7, 'Урок 7: Разработка дизайн-системы и UI Kit', '25 мин', true, 
 'Дизайн-система — это единый свод правил, стандартов, компонентов и паттернов проектирования интерфейсов. UI Kit — это библиотека визуальных компонентов (кнопки, чекбоксы, поля ввода, выпадающие списки), настроенных в соответствии с дизайн-системой. Разработка начинается с определения стилей цвета (Color Styles), стилей шрифтов (Text Styles) и эффектов теней. Это позволяет сохранять визуальную консистентность бренда на всех экранах и кратно ускоряет работу дизайнеров и разработчиков.',
 'Что представляет собой библиотека готовых интерфейсных компонентов (кнопок, полей ввода и т.д.), объединенных общим стилем?',
 array['UI Kit', 'API Key', 'Wireframe', 'Database Schema'],
 'UI Kit', false, null, null, 'roadmap'),

('Дизайн', 8, 'Урок 8: Передача макета в разработку и экспорт', '20 мин', true, 
 'После завершения дизайна макет передается разработчикам. Figma имеет специальный режим Dev Mode, в котором верстальщики могут просматривать точные размеры элементов в пикселях, отступы между ними, CSS-код стилей, шрифтов, теней и скруглений. Также дизайнеру необходимо подготовить ресурсы к экспорту: иконки переводят в векторный формат SVG, а фотографии экспортируют в PNG или WebP, настроив контейнеры экспорта (Export) в правом сайдбаре Figma.',
 'Какой векторный формат является стандартным и наиболее предпочтительным для экспорта иконок и логотипов из Figma в веб-код?',
 array['SVG', 'PNG', 'JPEG', 'GIF'],
 'SVG', false, null, null, 'client_server')
on conflict (course_name, lesson_number) do nothing;


-- ---------------------------------------------------------
-- Insert lessons for "Математика"
-- ---------------------------------------------------------
insert into public.lessons (course_name, lesson_number, title, duration, is_trial, theory, question, options, correct_answer, is_playground, playground_template, playground_task, custom_visual_type) values
('Математика', 1, 'Урок 1: Линейные уравнения и функции', '15 мин', true, 
 'Линейное уравнение — это уравнение вида ax + b = 0, где a и b — действительные числа. Для его решения перенесите слагаемые без переменной в одну сторону, а с переменной — в другую.',
 'Решите уравнение: 2x - 8 = 10. Чему равен x?',
 array['x = 5', 'x = 9', 'x = 6', 'x = 1'],
 'x = 9', false, null, null, null),

('Математика', 2, 'Урок 2: Квадратные уравнения и теорема Виета', '25 мин', false, 
 'Квадратное уравнение имеет вид ax² + bx + c = 0. Теорема Виета утверждает, что сумма корней равна -b/a, а произведение равно c/a.',
 'Найдите сумму корней уравнения x² - 5x + 6 = 0.',
 array['5', '6', '-5', '1'],
 '5', false, null, null, null),

('Математика', 3, 'Урок 3: Тригонометрия и формулы приведения', '30 мин', false, 
 'Тригонометрия изучает соотношения сторон и углов в треугольнике. Основные функции: синус, косинус, тангенс и котангенс.',
 'Чему равен sin(π/6)?',
 array['0.5', '1', '√3/2', '0'],
 '0.5', false, null, null, null),

('Математика', 4, 'Урок 4: Производная и исследование функций', '40 мин', false, 
 'Производная функции выражает скорость изменения функции в данной точке. Помогает находить точки экстремума (минимумы и максимумы).',
 'Найдите производную функции f(x) = x³.',
 array['3x²', 'x²', '3x', '3'],
 '3x²', false, null, null, null)
on conflict (course_name, lesson_number) do nothing;


-- ---------------------------------------------------------
-- Insert lessons for "Программирование"
-- ---------------------------------------------------------
insert into public.lessons (course_name, lesson_number, title, duration, is_trial, theory, question, options, correct_answer, is_playground, playground_template, playground_task, custom_visual_type) values
('Программирование', 1, 'Урок 1: Введение в Python и переменные', '20 мин', true, 
 'Python — это высокоуровневый язык программирования с понятным синтаксисом. Переменные используются для хранения данных и объявляются простым присваиванием: x = 10.',
 'Какой тип данных вернет встроенная функция type(15.5) в Python?',
 array['int', 'str', 'float', 'list'],
 'float', false, null, null, null),

('Программирование', 2, 'Урок 2: Условные операторы и циклы', '25 мин', false, 
 'Условные конструкции if-elif-else направляют ход программы в зависимости от логических условий. Циклы for и while повторяют выполнение блоков кода.',
 'Какой оператор используется для бесконечного цикла, пока условие истинно?',
 array['for', 'while', 'if', 'break'],
 'while', false, null, null, null),

('Программирование', 3, 'Урок 3: Функции и основы ООП', '35 мин', false, 
 'Функции объявляются ключевым словом def и инкапсулируют логику для повторного использования. ООП организует код вокруг объектов и классов.',
 'Какое ключевое слово используется для создания класса в Python?',
 array['def', 'class', 'object', 'struct'],
 'class', false, null, null, null),

('Программирование', 4, 'Урок 4: Разработка веб-приложения на FastAPI', '45 min', false, 
 'FastAPI — это современный быстрый веб-фреймворк для создания API с автодокументацией OpenAPI.',
 'Какая библиотека используется в FastAPI для валидации типов данных?',
 array['FastAPI', 'Pydantic', 'SQLAlchemy', 'Vite'],
 'Pydantic', false, null, null, null)
on conflict (course_name, lesson_number) do nothing;


-- ---------------------------------------------------------
-- Helper queries to insert fallback lessons for other courses
-- ---------------------------------------------------------
do $$
declare
  cname text;
  courses_list text[] := array['Физика', 'Химия', 'История', 'Английский язык', 'Русский язык', 'Биология', 'Маркетинг', 'Мобильная разработка'];
begin
  foreach cname in array courses_list loop
    insert into public.lessons (course_name, lesson_number, title, duration, is_trial, theory, question, options, correct_answer, is_playground, custom_visual_type) values
    (cname, 1, 'Урок 1: Введение и базовые понятия', '10 мин', true, 
     'На этом вводном уроке мы рассмотрим ключевые понятия дисциплины и поставим цели на весь учебный курс.',
     'Готовы ли вы начать увлекательное обучение?',
     array['Да, я готов!', 'Нет', 'Позже', 'Не знаю'],
     'Да, я готов!', false, null),
    (cname, 2, 'Урок 2: Разбор фундаментальных принципов', '20 мин', false, 
     'Переходим к глубокому пониманию предмета. Разбираем основные схемы, правила и формулы на практических примерах.',
     'Все ли концепции первого урока были вам ясны?',
     array['Да, всё понятно', 'Остались вопросы', 'Частично', 'Пропустил первый урок'],
     'Да, всё понятно', false, null),
    (cname, 3, 'Урок 3: Углубленные практические кейсы', '30 мин', false, 
     'Решаем сложные нестандартные кейсы, которые часто встречаются на экзаменах или реальной практике.',
     'Согласны ли вы, что практика — ключ к мастерству?',
     array['Абсолютно согласен', 'Теория важнее', '50 на 50', 'Нет'],
     'Абсолютно согласен', false, null),
    (cname, 4, 'Урок 4: Итоговое тестирование и сертификат', '40 мин', false, 
     'Поздравляем с прохождением курса! Данный финальный шаг проверит все накопленные знания.',
     'Закреплен ли материал курса в полном объеме?',
     array['Да, полностью', 'Нужно повторить', 'Не уверен', 'Нет'],
     'Да, полностью', false, null)
    on conflict (course_name, lesson_number) do nothing;
  end loop;
end;
$$;
