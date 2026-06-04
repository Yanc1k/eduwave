import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { z } from "zod";

const learningSearchSchema = z.object({
  course: z.string(),
});

export const Route = createFileRoute("/learning")({
  validateSearch: (search) => learningSearchSchema.parse(search),
  component: LearningPage,
  head: () => ({
    meta: [
      { title: "Обучение — EduWave" },
      { name: "description", content: "Интерактивный учебный процесс по шагам в EduWave." },
    ],
  }),
});

export interface Lesson {
  id: number;
  title: string;
  duration: string;
  isTrial: boolean;
  theory: string;
  videoUrl: string;
  question: string;
  options: string[];
  correctAnswer: string;
  isPlayground?: boolean;
  playgroundTemplate?: string;
  playgroundTask?: string;
  customVisualType?: 'client_server' | 'roadmap';
}

// Generate custom step-by-step lessons based on the course name
export const getLessonsForCourse = (courseName: string): Lesson[] => {
  const norm = courseName.toLowerCase();
  
  if (norm.includes("вводный") || norm.includes("пробный")) {
    return [
      {
        id: 1,
        title: "Урок 1: Как устроен веб и интернет",
        duration: "10 мин",
        isTrial: true,
        theory: "Интернет — это глобальная сеть компьютеров, соединенных друг с другом. Когда вы вводите в адресную строку браузера доменное имя (например, google.com), ваш браузер запрашивает IP-адрес сервера у службы доменных имен (DNS). Затем отправляется HTTP/HTTPS-запрос. В ответ сервер присылает файлы разметки (HTML), оформления (CSS) и логики (JavaScript), которые браузер собирает в полноценную интерактивную страницу.",
        videoUrl: "",
        customVisualType: "client_server",
        question: "Какая распределенная служба отвечает за преобразование буквенных имен сайтов (доменов) в числовые IP-адреса?",
        options: ["Служба DNS", "Проводной провайдер", "Протокол HTTPS", "Локальный файрвол"],
        correctAnswer: "Служба DNS",
      },
      {
        id: 2,
        title: "Урок 2: Разметка HTML и структура страницы",
        duration: "15 мин",
        isTrial: true,
        theory: "HTML (HyperText Markup Language) — это стандартный язык разметки документов во Всемирной паутине. HTML-код состоит из элементов (тегов), которые сообщают браузеру, как именно отображать контент. Теги обычно бывают парными (открывающий и закрывающий). Основная структура включает тег <html>, служебный раздел <head> (хранит кодировку, заголовки, стили) и визуальный раздел <body> (абзацы <p>, ссылки <a>, заголовки от <h1> до <h6>, изображения <img>).",
        videoUrl: "",
        isPlayground: true,
        playgroundTemplate: `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: 'Segoe UI', sans-serif;
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
</html>`,
        playgroundTask: "Интерактивный HTML-тренажер!\nНиже приведен пустой шаблон. Добавьте в него HTML теги:\n1. Заголовок <h1> с текстом 'Привет от будущего разработчика!'.\n2. Абзац <p> с текстом 'Я учусь разметке HTML на платформе EduWave.'.\n3. Кнопку <button> с текстом 'Нажми на меня' (попробуйте добавить встроенный стиль style для красоты!).",
        question: "С помощью какого тега создаются гиперссылки для перехода на другие веб-страницы?",
        options: ["Тег <a>", "Тег <link>", "Тег <href>", "Тег <p>"],
        correctAnswer: "Тег <a>",
      },
      {
        id: 3,
        title: "Урок 3: Стили CSS и основы оформления",
        duration: "15 мин",
        isTrial: true,
        theory: "CSS (Cascading Style Sheets) — каскадные таблицы стилей, используемые для описания внешнего вида страницы. Стили подключаются отдельно и связываются с HTML через селекторы. Селекторы указывают, к каким элементам применить свойства. Например, p { color: blue; font-size: 16px; }. CSS работает по принципу «блочной модели» (Box Model), где у каждого элемента есть ширина, высота, внутренние отступы (padding), рамка (border) и внешние поля (margin) для позиционирования.",
        videoUrl: "",
        isPlayground: true,
        playgroundTemplate: `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: 'Segoe UI', sans-serif;
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
      /* ЗАДАНИЕ 1: Добавьте рамку 'border: 3px solid #3b82f6;' вокруг этой карточки */
      
    }
    
    h1 {
      /* ЗАДАНИЕ 2: Измените цвет текста заголовка 'color' на #3b82f6 (синий) */
      color: #1e293b;
    }
    
    .btn {
      display: inline-block;
      padding: 10px 24px;
      border-radius: 9999px;
      text-decoration: none;
      font-weight: bold;
      /* ЗАДАНИЕ 3: Измените фоновый цвет кнопки 'background-color' на #f97316 (оранжевый) */
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
</html>`,
        playgroundTask: "Интерактивный HTML/CSS тренажер! Ниже приведен шаблон. Измените стили CSS внутри тега <style>:\n1. Добавьте свойство 'border: 3px solid #3b82f6;' в класс .card.\n2. Измените цвет заголовка h1 (свойство color) на #3b82f6.\n3. Измените background-color у кнопки .btn на #f97316.",
        question: "Какое CSS-свойство позволяет настроить внешнее расстояние (отступ) от границ текущего блока до соседних элементов?",
        options: ["margin", "padding", "border-spacing", "content-align"],
        correctAnswer: "margin",
      },
      {
        id: 4,
        title: "Урок 4: Основы JavaScript и интерактив",
        duration: "20 мин",
        isTrial: true,
        theory: "JavaScript (JS) — полноценный динамический язык программирования, выполняемый браузером на стороне пользователя. Он привносит на сайт интерактивность и логику. JS умеет реагировать на события (клики мыши, нажатия клавиш, прокрутку). Для отслеживания действий пользователя используется метод addEventListener, связывающий элемент веб-страницы с функцией-обработчиком. С помощью JS можно динамически изменять HTML-код страницы, добавлять анимации и отправлять формы без перезагрузки.",
        videoUrl: "",
        isPlayground: true,
        playgroundTemplate: `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: 'Segoe UI', sans-serif;
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
    const btn = document.getElementById('my-button');
    const output = document.getElementById('result-text');

    // ЗАДАНИЕ: Назначьте слушатель клика для кнопки btn с помощью метода addEventListener
    // Синтаксис: btn.addEventListener('click', () => { ... });
    // Внутри обработчика клика напишите: output.textContent = 'Ура! JavaScript успешно сработал! 🚀🎉';
    // Также можете попробовать сменить цвет, например: output.style.color = '#10b981';

  </script>
</body>
</html>`,
        playgroundTask: "Интерактивный JavaScript тренажер!\nДавайте научим кнопку реагировать на нажатие:\n1. Назначьте обработчик события 'click' для кнопки btn с помощью метода addEventListener('click', ...).\n2. При клике измените текст элемента output (output.textContent) на 'Ура! JavaScript успешно сработал! 🚀🎉'.",
        question: "Какой стандартный метод JS позволяет назначить функцию-слушатель для обработки клика пользователя на интерактивную кнопку?",
        options: ["addEventListener('click', ...)", "attachClickEvent('onclick', ...)", "createClickListener()", "bind('click')"],
        correctAnswer: "addEventListener('click', ...)",
      },
      {
        id: 5,
        title: "Урок 5: Публикация сайта и карьерный путь в IT",
        duration: "15 мин",
        isTrial: true,
        theory: "После написания кода сайта его нужно разместить в сети. Для этого используются облачные хостинги, такие как GitHub Pages, Netlify или Vercel. Например, GitHub Pages позволяет бесплатно опубликовать статический сайт прямо из Git-репозитория за пару кликов. Создание простых сайтов — это первый шаг. Веб-разработка делится на Frontend (внешний вид в браузере), Backend (логика сервера и базы данных) и Fullstack (универсальный стек). Для старта достаточно освоить HTML, CSS, Git и базовый JavaScript.",
        videoUrl: "",
        customVisualType: "roadmap",
        question: "Какой популярный бесплатный сервис позволяет опубликовать свой сайт в интернет напрямую из публичного репозитория GitHub?",
        options: ["GitHub Pages", "Google Drive Cloud", "Yandex Disk Share", "VS Code Live Server"],
        correctAnswer: "GitHub Pages",
      },
      {
        id: 6,
        title: "Урок 6: Git и системы контроля версий",
        duration: "20 мин",
        isTrial: true,
        theory: "Git — это распределенная система контроля версий. Она позволяет разработчикам записывать историю изменений файлов своего проекта, возвращаться к предыдущим версиям, создавать экспериментальные ветки и сливать код вместе при командной работе. GitHub — это облачная платформа, хостинг для Git-репозиториев. Базовые команды: git init (создать репозиторий), git add (подготовить файлы), git commit -m (сохранить снимок кода с сообщением) и git push (отправить в облако).",
        videoUrl: "",
        isPlayground: true,
        playgroundTemplate: `<!DOCTYPE html>
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
</html>`,
        playgroundTask: "Давайте проинициализируем репозиторий Git!\nВпишите вместо '???' команду инициализации репозитория:\ngit init",
        question: "Какая консольная команда Git инициализирует новый пустой Git-репозиторий в текущей папке проекта?",
        options: ["git init", "git start", "git create", "git new-repo"],
        correctAnswer: "git init",
      },
      {
        id: 7,
        title: "Урок 7: Базы данных и основы SQL",
        duration: "20 мин",
        isTrial: true,
        theory: "База данных — это структурированное хранилище информации, которой управляет веб-приложение. Для работы с базами данных используется язык SQL (Structured Query Language). Он позволяет запрашивать, обновлять, вставлять и удалять информацию. Самые популярные базы данных — реляционные (такие как PostgreSQL или MySQL), где данные хранятся в виде связанных таблиц с колонками и строками. Например, запрос SELECT * FROM users выберет всех зарегистрированных пользователей из таблицы.",
        videoUrl: "",
        customVisualType: "roadmap",
        question: "Какое ключевое слово SQL используется для извлечения (выборки) данных из таблицы базы данных?",
        options: ["SELECT", "GET", "EXTRACT", "FETCH"],
        correctAnswer: "SELECT",
      },
      {
        id: 8,
        title: "Урок 8: Основы работы с API и запросами",
        duration: "25 мин",
        isTrial: true,
        theory: "API (Application Programming Interface) — это мост взаимодействия между различными программами. В вебе чаще всего используют REST API, передающий данные с помощью протокола HTTP. Клиент (браузер) отправляет запросы, такие как GET (для чтения данных), POST (для создания новых данных), PUT (для обновления) и DELETE (для удаления), а сервер возвращает ответ в формате JSON. JSON (JavaScript Object Notation) — это легкий и понятный текстовый формат обмена данными.",
        videoUrl: "",
        customVisualType: "client_server",
        question: "Какой метод HTTP-запроса используется в веб-технологиях для чтения или получения информации с сервера?",
        options: ["GET", "POST", "CREATE", "READ"],
        correctAnswer: "GET",
      }
    ];
  }

  if (norm.includes("дизайн")) {
    return [
      {
        id: 1,
        title: "Урок 1: Введение в UI/UX дизайн и Figma",
        duration: "15 мин",
        isTrial: true,
        theory: "UI (User Interface) дизайн — это визуальный вид продукта: цвета, сетки, шрифты, иконки, кнопки. UX (User Experience) дизайн — это то, как пользователь взаимодействует с продуктом, насколько ему удобно находить информацию и совершать целевые действия. Figma — это самый популярный облачный графический редактор для создания интерфейсов сайтов и приложений, работающий прямо в браузере в реальном времени. В нем дизайнеры создают фреймы, векторные фигуры и интерактивные прототипы.",
        videoUrl: "",
        question: "Какая аббревиатура описывает проектирование удобства взаимодействия пользователя с веб-сайтом или мобильным приложением?",
        options: ["UX (User Experience)", "UI (User Interface)", "API (Application Interface)", "SQL (Structured Language)"],
        correctAnswer: "UX (User Experience)",
      },
      {
        id: 2,
        title: "Урок 2: Работа с фреймами и фигурами в Figma",
        duration: "20 мин",
        isTrial: true,
        theory: "Фреймы в Figma — это основные рабочие области, контейнеры для вашего контента (например, экран iPhone или страница сайта). Внутри фреймов можно размещать базовые геометрические фигуры: прямоугольники (Rectangle), эллипсы (Ellipse), линии, полигоны и текстовые слои. Сочетая эти фигуры, настраивая скругление углов (Corner Radius) и заливку (Fill), дизайнеры создают кнопки, карточки товаров и целые секции будущего сайта.",
        videoUrl: "",
        isPlayground: true,
        playgroundTemplate: `<!DOCTYPE html>
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
  <p>Скруглите углы у прямоугольной кнопки до 12px в редакторе CSS.</p>
  
  <div class="button-preview">Моя кнопка Figma</div>
</body>
</html>`,
        playgroundTask: "Давайте скруглим углы у кнопки в нашем симуляторе Figma!\nВпишите значение '12px' вместо '0px' в свойство border-radius в стилях .button-preview.",
        question: "Какое CSS-свойство отвечает за скругление углов графических фигур и кнопок в веб-интерфейсе?",
        options: ["border-radius", "corner-radius", "border-rounding", "box-shape"],
        correctAnswer: "border-radius",
      },
      {
        id: 3,
        title: "Урок 3: Сетки, отступы и композиция",
        duration: "20 мин",
        isTrial: true,
        theory: "Сетки (Layout Grids) помогают структурировать контент на странице и выравнивать элементы относительно друг друга. Стандарт для веб-сайтов — 12-колоночная сетка. Отступы (Paddings и Margins) создают «воздух» в макете, позволяя глазам пользователя легко сканировать информацию. Существует правило внешнего и внутреннего: расстояние между логически отдельными блоками всегда должно быть больше, чем расстояние между элементами внутри одного блока.",
        videoUrl: "",
        customVisualType: "roadmap",
        question: "Какая сетка считается стандартной в веб-дизайне для горизонтального выравнивания контента на экранах компьютеров?",
        options: ["12-колоночная сетка", "5-колоночная сетка", "Круговая сетка", "Диагональная сетка"],
        correctAnswer: "12-колоночная сетка",
      },
      {
        id: 4,
        title: "Урок 4: Цветовые палитры и типографика",
        duration: "25 мин",
        isTrial: true,
        theory: "Цвета передают эмоции и расставляют визуальные акценты. Основное правило — 60-30-10: 60% площади должен занимать доминирующий фоновый цвет, 30% — вторичные цвета текста и карточек, и только 10% — яркий акцентный цвет для кнопок призыва к действию (CTA). В типографике важно соблюдать контраст размеров шрифтов (например, крупный заголовок H1 и читаемый основной текст) и выбирать современные геометрические гротески (Inter, Roboto, Nunito).",
        videoUrl: "",
        question: "Какой процент площади в правиле 60-30-10 рекомендуется выделять под яркий акцентный цвет (кнопки CTA, важные иконки)?",
        options: ["10%", "30%", "60%", "100%"],
        correctAnswer: "10%",
      },
      {
        id: 5,
        title: "Урок 5: Создание интерактивного прототипа",
        duration: "25 мин",
        isTrial: true,
        theory: "Интерактивный прототип — это модель будущего сайта, в которой можно нажимать кнопки и переходить по страницам прямо в Figma. Для создания переходов используется вкладка Prototype. Вы выбираете кнопку, вытягиваете из нее синюю стрелку ('синий волос') и соединяете её с целевым фреймом. Можно настраивать триггеры (On Click, On Hover) и анимации переходов (Instant, Smart Animate) для достижения максимального реализма.",
        videoUrl: "",
        customVisualType: "client_server",
        question: "В какой вкладке Figma настраивается интерактивное связывание экранов и кнопок для создания живой демонстрации сайта?",
        options: ["Prototype", "Design", "Inspect", "Export"],
        correctAnswer: "Prototype",
      },
      {
        id: 6,
        title: "Урок 6: Компоненты и Auto Layout в Figma",
        duration: "20 мин",
        isTrial: true,
        theory: "Компоненты — это элементы интерфейса многократного использования (например, кнопки, шапки, карточки). Изменение главного компонента (Master Component) автоматически обновляет все его копии (Instances) по всему проекту. Auto Layout — это мощная функция, позволяющая создавать динамические фреймы, которые автоматически сжимаются или расширяются в зависимости от размера их содержимого (как flexbox в CSS). Благодаря Auto Layout вы можете менять текст в кнопке, и её ширина будет увеличиваться сама, сохраняя отступы.",
        videoUrl: "",
        question: "Какая функция Figma позволяет создавать адаптивные фреймы, автоматически подстраивающиеся под размер содержимого?",
        options: ["Auto Layout", "Smart Animate", "Grid System", "Constraints"],
        correctAnswer: "Auto Layout",
      },
      {
        id: 7,
        title: "Урок 7: Разработка дизайн-системы и UI Kit",
        duration: "25 мин",
        isTrial: true,
        theory: "Дизайн-система — это единый свод правил, стандартов, компонентов и паттернов проектирования интерфейсов. UI Kit — это библиотека визуальных компонентов (кнопки, чекбоксы, поля ввода, выпадающие списки), настроенных в соответствии с дизайн-системой. Разработка начинается с определения стилей цвета (Color Styles), стилей шрифтов (Text Styles) и эффектов теней. Это позволяет сохранять визуальную консистентность бренда на всех экранах и кратно ускоряет работу дизайнеров и разработчиков.",
        videoUrl: "",
        customVisualType: "roadmap",
        question: "Что представляет собой библиотека готовых интерфейсных компонентов (кнопок, полей ввода и т.д.), объединенных общим стилем?",
        options: ["UI Kit", "API Key", "Wireframe", "Database Schema"],
        correctAnswer: "UI Kit",
      },
      {
        id: 8,
        title: "Урок 8: Передача макета в разработку и экспорт",
        duration: "20 мин",
        isTrial: true,
        theory: "После завершения дизайна макет передается разработчикам. Figma имеет специальный режим Dev Mode, в котором верстальщики могут просматривать точные размеры элементов в пикселях, отступы между ними, CSS-код стилей, шрифтов, теней и скруглений. Также дизайнеру необходимо подготовить ресурсы к экспорту: иконки переводят в векторный формат SVG, а фотографии экспортируют в PNG или WebP, настроив контейнеры экспорта (Export) в правом сайдбаре Figma.",
        videoUrl: "",
        customVisualType: "client_server",
        question: "Какой векторный формат является стандартным и наиболее предпочтительным для экспорта иконок и логотипов из Figma в веб-код?",
        options: ["SVG", "PNG", "JPEG", "GIF"],
        correctAnswer: "SVG",
      }
    ];
  }

  if (norm.includes("математика")) {
    return [
      {
        id: 1,
        title: "Урок 1: Линейные уравнения и функции",
        duration: "15 мин",
        isTrial: true,
        theory: "Линейное уравнение — это уравнение вида ax + b = 0, где a и b — действительные числа. Для его решения перенесите слагаемые без переменной в одну сторону, а с переменной — в другую.",
        videoUrl: "",
        question: "Решите уравнение: 2x - 8 = 10. Чему равен x?",
        options: ["x = 5", "x = 9", "x = 6", "x = 1"],
        correctAnswer: "x = 9",
      },
      {
        id: 2,
        title: "Урок 2: Квадратные уравнения и теорема Виета",
        duration: "25 мин",
        isTrial: false,
        theory: "Квадратное уравнение имеет вид ax² + bx + c = 0. Теорема Виета утверждает, что сумма корней равна -b/a, а произведение равно c/a.",
        videoUrl: "",
        question: "Найдите сумму корней уравнения x² - 5x + 6 = 0.",
        options: ["5", "6", "-5", "1"],
        correctAnswer: "5",
      },
      {
        id: 3,
        title: "Урок 3: Тригонометрия и формулы приведения",
        duration: "30 мин",
        isTrial: false,
        theory: "Тригонометрия изучает соотношения сторон и углов в треугольнике. Основные функции: синус, косинус, тангенс и котангенс.",
        videoUrl: "",
        question: "Чему равен sin(π/6)?",
        options: ["0.5", "1", "√3/2", "0"],
        correctAnswer: "0.5",
      },
      {
        id: 4,
        title: "Урок 4: Производная и исследование функций",
        duration: "40 мин",
        isTrial: false,
        theory: "Производная функции выражает скорость изменения функции в данной точке. Помогает находить точки экстремума (минимумы и максимумы).",
        videoUrl: "",
        question: "Найдите производную функции f(x) = x³.",
        options: ["3x²", "x²", "3x", "3"],
        correctAnswer: "3x²",
      }
    ];
  }

  if (norm.includes("программирование")) {
    return [
      {
        id: 1,
        title: "Урок 1: Введение в Python и переменные",
        duration: "20 мин",
        isTrial: true,
        theory: "Python — это высокоуровневый язык программирования с понятным синтаксисом. Переменные используются для хранения данных и объявляются простым присваиванием: x = 10.",
        videoUrl: "",
        question: "Какой тип данных вернет встроенная функция type(15.5) в Python?",
        options: ["int", "str", "float", "list"],
        correctAnswer: "float",
      },
      {
        id: 2,
        title: "Урок 2: Условные операторы и циклы",
        duration: "25 мин",
        isTrial: false,
        theory: "Условные конструкции if-elif-else направляют ход программы в зависимости от логических условий. Циклы for и while повторяют выполнение блоков кода.",
        videoUrl: "",
        question: "Какой оператор используется для бесконечного цикла, пока условие истинно?",
        options: ["for", "while", "if", "break"],
        correctAnswer: "while",
      },
      {
        id: 3,
        title: "Урок 3: Функции и основы ООП",
        duration: "35 мин",
        isTrial: false,
        theory: "Функции объявляются ключевым словом def и инкапсулируют логику для повторного использования. ООП организует код вокруг объектов и классов.",
        videoUrl: "",
        question: "Какое ключевое слово используется для создания класса в Python?",
        options: ["def", "class", "object", "struct"],
        correctAnswer: "class",
      },
      {
        id: 4,
        title: "Урок 4: Разработка веб-приложения на FastAPI",
        duration: "45 min",
        isTrial: false,
        theory: "FastAPI — это современный быстрый веб-фреймворк для создания API с автодокументацией OpenAPI.",
        videoUrl: "",
        question: "Какая библиотека используется в FastAPI для валидации типов данных?",
        options: ["FastAPI", "Pydantic", "SQLAlchemy", "Vite"],
        correctAnswer: "Pydantic",
      }
    ];
  }

  // General default fallback step-by-step timeline
  return [
    {
      id: 1,
      title: "Урок 1: Введение и базовые понятия",
      duration: "10 мин",
      isTrial: true,
      theory: "На этом вводном уроке мы рассмотрим ключевые понятия дисциплины и поставим цели на весь учебный курс.",
      videoUrl: "",
      question: "Готовы ли вы начать увлекательное обучение?",
      options: ["Да, я готов!", "Нет", "Позже", "Не знаю"],
      correctAnswer: "Да, я готов!",
    },
    {
      id: 2,
      title: "Урок 2: Разбор фундаментальных принципов",
      duration: "20 мин",
      isTrial: false,
      theory: "Переходим к глубокому пониманию предмета. Разбираем основные схемы, правила и формулы на практических примерах.",
      videoUrl: "",
      question: "Все ли концепции первого урока были вам ясны?",
      options: ["Да, всё понятно", "Остались вопросы", "Частично", "Пропустил первый урок"],
      correctAnswer: "Да, всё понятно",
    },
    {
      id: 3,
      title: "Урок 3: Углубленные практические кейсы",
      duration: "30 мин",
      isTrial: false,
      theory: "Решаем сложные нестандартные кейсы, которые часто встречаются на экзаменах или реальной практике.",
      videoUrl: "",
      question: "Согласны ли вы, что практика — ключ к мастерству?",
      options: ["Абсолютно согласен", "Теория важнее", "50 на 50", "Нет"],
      correctAnswer: "Абсолютно согласен",
    },
    {
      id: 4,
      title: "Урок 4: Итоговое тестирование и сертификат",
      duration: "40 мин",
      isTrial: false,
      theory: "Поздравляем с прохождением курса! Данный финальный шаг проверит все накопленные знания.",
      videoUrl: "",
      question: "Закреплен ли материал курса в полном объеме?",
      options: ["Да, полностью", "Нужно повторить", "Не уверен", "Нет"],
      correctAnswer: "Да, полностью",
    }
  ];
};

const shuffleArray = <T,>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

function LearningPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const courseName = search.course;

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
  const [isPaid, setIsPaid] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [activeLessonId, setActiveLessonId] = useState<number>(1);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [loading, setLoading] = useState(true);
  const [playgroundCode, setPlaygroundCode] = useState("");
  const [clientServerStep, setClientServerStep] = useState(1);
  const [careerTrack, setCareerTrack] = useState<'frontend' | 'backend' | 'fullstack'>('frontend');
  const [gitChecks, setGitChecks] = useState({ init: false, add: false, commit: false, push: false });
  const [isReadingMode, setIsReadingMode] = useState(false);

  const lessons = useMemo(() => getLessonsForCourse(courseName), [courseName]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const uid = data.session?.user.id ?? null;
      if (!uid) {
        toast.error("Необходима авторизация");
        navigate({ to: "/auth" });
        return;
      }
      setUserId(uid);

      // Check payment status
      const localPaid = localStorage.getItem(`eduwave_paid_courses_${uid}`);
      if (localPaid) {
        const paidList = JSON.parse(localPaid) as string[];
        setIsPaid(paidList.includes(courseName));
      }

      // Check progress
      const localProgress = localStorage.getItem(`eduwave_progress_${uid}_${courseName}`);
      if (localProgress) {
        setCompletedLessons(JSON.parse(localProgress));
      }
      
      setLoading(false);
    });
  }, [courseName, navigate]);

  const activeLesson = lessons.find((l) => l.id === activeLessonId) ?? lessons[0];
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);

  useEffect(() => {
    if (activeLesson) {
      if (activeLesson.isPlayground) {
        setPlaygroundCode(activeLesson.playgroundTemplate || "");
      } else {
        setPlaygroundCode("");
      }
      // Shuffle options to randomize order
      setShuffledOptions(shuffleArray(activeLesson.options));
    }
  }, [activeLessonId, activeLesson]);

  const handleOptionSelect = (opt: string) => {
    if (answered) return;
    setSelectedOption(opt);
  };

  const checkAnswer = () => {
    if (!selectedOption) return;
    
    const correct = selectedOption === activeLesson.correctAnswer;
    setIsAnswerCorrect(correct);
    setAnswered(true);

    if (correct) {
      toast.success("Правильный ответ! Отличный шаг вперед! 🎉");
      
      if (!completedLessons.includes(activeLessonId)) {
        const newCompleted = [...completedLessons, activeLessonId];
        setCompletedLessons(newCompleted);
        if (userId) {
          localStorage.setItem(`eduwave_progress_${userId}_${courseName}`, JSON.stringify(newCompleted));
        }
      }
    } else {
      toast.error("К сожалению, ответ неверный. Попробуйте еще раз!");
    }
  };

  const resetQuestion = () => {
    setSelectedOption(null);
    setAnswered(false);
    setIsAnswerCorrect(false);
    // Re-shuffle the options for a fresh try
    if (activeLesson) {
      setShuffledOptions(shuffleArray(activeLesson.options));
    }
  };

  const handleLessonSwitch = (id: number) => {
    const target = lessons.find((l) => l.id === id);
    if (!target) return;

    // Check lock conditions
    if (!target.isTrial && !isPaid) {
      toast.error("Этот урок доступен только в платной версии курса!");
      return;
    }

    // Step-by-step lock: Cannot jump over uncompleted lessons
    if (id > 1) {
      const prevLesson = lessons.find((l) => l.id === id - 1);
      if (prevLesson && !completedLessons.includes(prevLesson.id)) {
        toast.info(`Пройдите сначала предыдущий урок: «${prevLesson.title}»`);
        return;
      }
    }

    setActiveLessonId(id);
    resetQuestion();
  };

  const progressPercent = Math.round((completedLessons.length / lessons.length) * 100);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--gradient-soft)] flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground font-semibold">Загрузка учебных материалов...</p>
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
          <div className="flex items-center gap-4">
            <Link
              to="/profile"
              className="w-10 h-10 rounded-full bg-muted hover:bg-border flex items-center justify-center transition cursor-pointer text-foreground"
              title="Назад в личный кабинет"
            >
              ←
            </Link>
            <div>
              <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">Курс: {courseName}</span>
              <h1 className="font-display font-bold text-lg leading-tight">Интерактивный класс</h1>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-2.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition cursor-pointer flex items-center justify-center font-bold border-none bg-transparent"
              title="Переключить тему"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <div className="hidden sm:block text-right">
              <span className="text-xs text-muted-foreground font-semibold">Ваш прогресс</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-brand-blue transition-all duration-500" 
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="text-sm font-extrabold text-brand-blue">{progressPercent}%</span>
              </div>
            </div>
            {courseName.includes("Пробный") || courseName.includes("Дизайн") ? (
              <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 text-xs font-extrabold flex items-center gap-1.5 animate-pulse">
                🎓 Бесплатный курс (Все уроки открыты)
              </span>
            ) : !isPaid ? (
              <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-600 text-xs font-extrabold flex items-center gap-1.5 animate-pulse">
                🔓 Демо-доступ (Урок 1 бесплатно)
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 text-xs font-extrabold flex items-center gap-1.5">
                💎 Полный доступ
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Step-by-Step Navigation (Left Sidebar) */}
          <div className="lg:col-span-1 space-y-4">
            <div className="p-6 rounded-3xl bg-card border border-border shadow-[var(--shadow-card)]">
              <h2 className="font-display font-bold text-lg mb-4">Учебный план</h2>
              <div className="space-y-3">
                {lessons.map((lesson) => {
                  const isUnlocked = lesson.isTrial || isPaid;
                  const isCompleted = completedLessons.includes(lesson.id);
                  const isActive = lesson.id === activeLessonId;
                  
                  // Check if this step is locked due to previous step incomplete
                  let isStepLockedByProgress = false;
                  if (lesson.id > 1) {
                    const prev = lessons.find((l) => l.id === lesson.id - 1);
                    if (prev && !completedLessons.includes(prev.id)) {
                      isStepLockedByProgress = true;
                    }
                  }

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => handleLessonSwitch(lesson.id)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${
                        isActive
                          ? "bg-brand-blue/10 border-brand-blue/30 text-brand-blue font-semibold"
                          : !isUnlocked
                            ? "bg-muted/40 border-border/50 text-muted-foreground opacity-75 hover:bg-muted/65"
                            : isStepLockedByProgress
                              ? "bg-muted/30 border-border/30 text-muted-foreground opacity-60"
                              : "bg-card border-border hover:border-brand-blue/30 text-foreground"
                      }`}
                    >
                      <div className="text-xl mt-0.5">
                        {isCompleted ? (
                          <span className="text-emerald-500">✓</span>
                        ) : !isUnlocked ? (
                          <span className="text-amber-500">🔒</span>
                        ) : (
                          <span>●</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold truncate leading-snug">{lesson.title}</div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[10px] text-muted-foreground font-semibold">⏳ {lesson.duration}</span>
                          {lesson.isTrial && !isPaid && (
                            <span className="text-[9px] bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded font-extrabold">Бесплатно</span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {!isPaid && !courseName.includes("Пробный") && (
                <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-brand-orange/15 to-brand-orange/5 border border-brand-orange/20 text-center">
                  <h3 className="font-display font-bold text-sm text-brand-orange">Хотите полный курс?</h3>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed font-semibold">
                    Разблокируйте все остальные уроки и получите диплом по окончании!
                  </p>
                  <Link
                    to="/profile"
                    className="block mt-4 py-2 rounded-full bg-brand-orange text-brand-orange-foreground font-bold text-xs hover:scale-105 transition shadow-sm"
                  >
                    Оплатить курс
                  </Link>
                </div>
              )}

              {courseName.includes("Пробный") && (
                <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-brand-blue/15 to-brand-blue/5 border border-brand-blue/20 text-center">
                  <h3 className="font-display font-bold text-sm text-brand-blue">Пробный IT-экспресс</h3>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed font-semibold">
                    Курс полностью бесплатный! Пройдите 5 этапов, чтобы ощутить всю мощь нашей платформы и получить королевскую корону в профиле.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Lesson Main Content (Center) */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Interactive Player */}
            <div className="p-8 rounded-3xl bg-card border border-border shadow-[var(--shadow-card)] space-y-6">
              <h2 className="font-display font-extrabold text-2xl leading-snug">{activeLesson.title}</h2>
              
              {activeLesson.isPlayground ? (
                <div className="grid md:grid-cols-12 gap-6 bg-card rounded-2xl overflow-hidden border border-border/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                  {/* Left Side: Editor + Task Instructions */}
                  <div className="md:col-span-6 flex flex-col gap-4 p-5 bg-muted/20 border-r border-border/50">
                    <div className="flex items-center justify-between border-b border-border/60 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">💻</span>
                        <span className="font-display font-bold text-sm text-foreground">Интерактивный редактор</span>
                      </div>
                      <button
                        onClick={() => {
                          if (activeLesson.playgroundTemplate) {
                            setPlaygroundCode(activeLesson.playgroundTemplate);
                            toast.info("Код сброшен к исходному шаблону ✏️");
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-muted hover:bg-border text-[11px] font-bold text-foreground transition cursor-pointer flex items-center gap-1 border border-border/50"
                        title="Сбросить код к исходному состоянию"
                      >
                        🔄 Сбросить
                      </button>
                    </div>

                    <div className="p-4 rounded-xl bg-brand-blue/5 border border-brand-blue/15 space-y-2">
                      <span className="inline-flex px-2 py-0.5 rounded-full bg-brand-blue/10 text-brand-blue font-bold text-[10px] uppercase tracking-wider">
                        Задание на уроке
                      </span>
                      <p className="text-xs text-foreground/80 leading-relaxed font-semibold whitespace-pre-line">
                        {activeLesson.playgroundTask}
                      </p>
                    </div>

                    <div className="flex-1 relative min-h-[300px] flex flex-col">
                      <div className="absolute top-2 right-3 text-[10px] font-bold text-muted-foreground bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded pointer-events-none uppercase tracking-widest">
                        index.html
                      </div>
                      <textarea
                        value={playgroundCode}
                        onChange={(e) => setPlaygroundCode(e.target.value)}
                        spellCheck={false}
                        className="w-full flex-1 p-4 rounded-xl bg-[#18181b] text-[#f4f4f5] font-mono text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-brand-blue border border-zinc-800 resize-y min-h-[280px] shadow-inner selection:bg-brand-blue/30 selection:text-white"
                        style={{ fontFamily: "'Fira Code', 'Courier New', Courier, monospace" }}
                      />
                    </div>
                  </div>

                  {/* Right Side: Live Render Preview */}
                  <div className="md:col-span-6 flex flex-col gap-4 p-5">
                    <div className="flex items-center justify-between border-b border-border/60 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="font-display font-bold text-sm text-foreground">Живое превью</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider bg-muted px-2 py-0.5 rounded">
                        Результат
                      </span>
                    </div>

                    <div className="flex-1 min-h-[350px] rounded-xl bg-white border border-border/60 overflow-hidden shadow-sm flex flex-col relative">
                      <iframe
                        srcDoc={playgroundCode}
                        title="Playground Preview"
                        sandbox="allow-scripts"
                        className="w-full flex-1 border-none bg-white min-h-[330px]"
                      />
                    </div>
                  </div>
                </div>
              ) : activeLesson.customVisualType === 'client_server' ? (
                <div className="grid md:grid-cols-12 gap-6 bg-card rounded-2xl overflow-hidden border border-border/80 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                  {/* Left Column: Visual Diagram */}
                  <div className="md:col-span-7 bg-muted/20 border border-border/40 rounded-xl p-6 flex flex-col items-center justify-center relative min-h-[300px]">
                    <span className="absolute top-3 left-3 text-[10px] bg-brand-blue/15 text-brand-blue font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Симулятор веб-запроса
                    </span>
                    
                    {/* The Visual Schema Map */}
                    <div className="w-full flex items-center justify-between gap-4 mt-6 max-w-md relative">
                      {/* Browser Mockup */}
                      <div className="flex flex-col items-center z-10">
                        <div className="w-16 h-16 rounded-2xl bg-white border-2 border-brand-blue flex items-center justify-center shadow-md text-3xl animate-bounce">
                          🖥️
                        </div>
                        <span className="text-[11px] font-bold text-foreground mt-2 bg-muted px-2 py-0.5 rounded-full">Клиент (Браузер)</span>
                      </div>

                      {/* Connection Wire */}
                      <div className="flex-1 h-1 bg-border/80 relative rounded-full overflow-hidden">
                        {/* Pacman / Data Dot moving along line */}
                        <div 
                          className="absolute h-2 w-2 rounded-full bg-brand-orange animate-ping"
                          style={{
                            left: clientServerStep === 1 ? '10%' : clientServerStep === 2 ? '40%' : clientServerStep === 3 ? '70%' : '90%',
                            transition: 'left 0.6s ease-in-out',
                            top: '-2px'
                          }}
                        />
                        <div 
                          className="absolute h-2 w-2 rounded-full bg-brand-orange"
                          style={{
                            left: clientServerStep === 1 ? '10%' : clientServerStep === 2 ? '40%' : clientServerStep === 3 ? '70%' : '90%',
                            transition: 'left 0.6s ease-in-out',
                            top: '-2px'
                          }}
                        />
                      </div>

                      {/* DNS / Server node */}
                      <div className="flex flex-col items-center z-10">
                        <div className={`w-16 h-16 rounded-2xl bg-white border-2 transition-all flex items-center justify-center shadow-md text-3xl ${
                          clientServerStep === 1 ? 'border-brand-orange scale-105 shadow-brand-orange/25' : 'border-border'
                        }`}>
                          🌐
                        </div>
                        <span className="text-[11px] font-bold text-foreground mt-2 bg-muted px-2 py-0.5 rounded-full">DNS-Сервер</span>
                      </div>

                      {/* Connection Wire 2 */}
                      <div className="flex-1 h-1 bg-border/80 relative rounded-full overflow-hidden">
                        <div 
                          className="absolute h-2 w-2 rounded-full bg-brand-blue animate-ping"
                          style={{
                            left: clientServerStep === 4 ? '10%' : '50%',
                            transition: 'left 0.6s ease-in-out',
                            top: '-2px'
                          }}
                        />
                      </div>

                      {/* Cloud Web Server Mockup */}
                      <div className="flex flex-col items-center z-10">
                        <div className={`w-16 h-16 rounded-2xl bg-white border-2 transition-all flex items-center justify-center shadow-md text-3xl ${
                          clientServerStep >= 3 ? 'border-emerald-500 scale-105 shadow-emerald-500/25 animate-pulse' : 'border-border'
                        }`}>
                          ☁️
                        </div>
                        <span className="text-[11px] font-bold text-foreground mt-2 bg-muted px-2 py-0.5 rounded-full">Веб-Сервер</span>
                      </div>
                    </div>

                    {/* Step descriptions visual indicator */}
                    <div className="mt-8 w-full p-4 rounded-xl bg-card border border-border/60 text-center shadow-sm">
                      <span className="text-[10px] font-extrabold text-brand-orange uppercase tracking-widest block mb-1">
                        Шаг {clientServerStep} из 4
                      </span>
                      <h4 className="font-display font-bold text-sm text-foreground mb-1">
                        {clientServerStep === 1 && "🌐 Шаг 1: DNS-преобразование"}
                        {clientServerStep === 2 && "🤝 Шаг 2: Установление защищенного HTTPS канала"}
                        {clientServerStep === 3 && "📥 Шаг 3: Отправка HTTP GET-запроса"}
                        {clientServerStep === 4 && "🖥️ Шаг 4: Рендеринг страницы в браузере"}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
                        {clientServerStep === 1 && "Когда вы ввели адрес, браузер не знает IP-адрес сервера. Сначала он делает быстрый запрос в службу DNS, чтобы узнать числовой IP (например, 142.250.74.46)."}
                        {clientServerStep === 2 && "Получив IP, браузер выполняет 'HTTPS Handshake' с сервером — согласовывает протокол шифрования и ключи безопасности для полной защиты ваших данных от перехвата."}
                        {clientServerStep === 3 && "Защищенный туннель построен! Браузер отправляет HTTP-запрос GET /index.html. Сервер получает запрос, достает файл из хранилища и присылает в ответ его контент."}
                        {clientServerStep === 4 && "Браузер получает пакеты кода, читает разметку HTML, строит структуру страницы, стилизует её по CSS и оживляет скрипты на JS. Сайт открыт!"}
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Tab Controls */}
                  <div className="md:col-span-5 flex flex-col gap-3 justify-center">
                    <h3 className="font-display font-bold text-base text-foreground mb-2 flex items-center gap-1.5">
                      <span>🕹️</span> Управление симулятором
                    </h3>
                    
                    {[
                      { id: 1, label: "DNS-преобразование", desc: "Узнаем IP-адрес по домену", emoji: "🔍" },
                      { id: 2, label: "HTTPS-рукопожатие", desc: "Шифруем будущую переписку", emoji: "🤝" },
                      { id: 3, label: "HTTP GET-запрос", desc: "Скачиваем файлы с сервера", emoji: "📥" },
                      { id: 4, label: "Рендеринг в браузере", desc: "Превращаем код в красивый сайт", emoji: "🖥️" }
                    ].map((step) => {
                      const isActive = clientServerStep === step.id;
                      return (
                        <button
                          key={step.id}
                          onClick={() => setClientServerStep(step.id)}
                          className={`w-full text-left p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                            isActive
                              ? "bg-brand-blue/10 border-brand-blue/40 shadow-sm"
                              : "bg-card border-border/80 hover:bg-muted/30"
                          }`}
                        >
                          <span className="text-xl">{step.emoji}</span>
                          <div>
                            <div className={`text-xs font-bold ${isActive ? 'text-brand-blue' : 'text-foreground'}`}>
                              {step.label}
                            </div>
                            <div className="text-[10px] text-muted-foreground font-medium mt-0.5">{step.desc}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : activeLesson.customVisualType === 'roadmap' ? (
                <div className="grid md:grid-cols-12 gap-6 bg-card rounded-2xl overflow-hidden border border-border/80 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                  {/* Left Column: Track Details */}
                  <div className="md:col-span-7 bg-muted/20 border border-border/40 rounded-xl p-5 flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-border/40 pb-3">
                      <span className="text-xs font-extrabold text-brand-orange uppercase tracking-wider">
                        Карьерный IT-навигатор
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-extrabold text-[10px]">
                        Казахстан 2026 ₸
                      </span>
                    </div>

                    {careerTrack === 'frontend' && (
                      <div className="space-y-3">
                        <h4 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
                          <span>🎨</span> Frontend-разработчик
                        </h4>
                        <p className="text-xs text-muted-foreground font-semibold leading-relaxed">
                          Создает визуальную часть сайтов и приложений: кнопки, анимации, слайдеры, формы, адаптивную верстку под все типы экранов. Работает в тесной связке с дизайнерами.
                        </p>
                        <div className="p-3.5 rounded-xl bg-card border border-border/60">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase">Стек технологий для старта:</span>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {["HTML5", "CSS3", "JavaScript ES6", "React / Next.js", "Tailwind CSS", "Git / GitHub"].map(t => (
                              <span key={t} className="text-[10px] font-bold bg-brand-blue/10 text-brand-blue px-2 py-0.5 rounded-md">{t}</span>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                          <span className="text-[11px] font-bold text-muted-foreground">Зарплата (Junior):</span>
                          <span className="text-sm font-extrabold text-emerald-600">350 000 — 550 000 ₸</span>
                        </div>
                      </div>
                    )}

                    {careerTrack === 'backend' && (
                      <div className="space-y-3">
                        <h4 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
                          <span>⚙️</span> Backend-разработчик
                        </h4>
                        <p className="text-xs text-muted-foreground font-semibold leading-relaxed">
                          Управляет «мозгами» приложения: сервером, бизнес-логикой и базами данных. Создает API-интерфейсы, настраивает регистрацию, платежные шлюзы (например, Kaspi) и безопасность.
                        </p>
                        <div className="p-3.5 rounded-xl bg-card border border-border/60">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase">Стек технологий для старта:</span>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {["Python / Node.js", "FastAPI / Express", "SQL / PostgreSQL", "Docker", "REST API", "Git / GitHub"].map(t => (
                              <span key={t} className="text-[10px] font-bold bg-purple-500/10 text-purple-600 px-2 py-0.5 rounded-md">{t}</span>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                          <span className="text-[11px] font-bold text-muted-foreground">Зарплата (Junior):</span>
                          <span className="text-sm font-extrabold text-emerald-600">400 000 — 600 000 ₸</span>
                        </div>
                      </div>
                    )}

                    {careerTrack === 'fullstack' && (
                      <div className="space-y-3">
                        <h4 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
                          <span>👑</span> Fullstack-разработчик
                        </h4>
                        <p className="text-xs text-muted-foreground font-semibold leading-relaxed">
                          Универсальный специалист, способный в одиночку создать приложение с нуля — от дизайна интерфейса до настройки баз данных и развертывания проекта в облаке. Очень востребован в стартапах.
                        </p>
                        <div className="p-3.5 rounded-xl bg-card border border-border/60">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase">Стек технологий для старта:</span>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {["React + Node.js", "Python + React", "FastAPI + Next.js", "SQL & NoSQL", "DevOps basics", "Git / GitHub"].map(t => (
                              <span key={t} className="text-[10px] font-bold bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-md">{t}</span>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                          <span className="text-[11px] font-bold text-muted-foreground">Зарплата (Junior):</span>
                          <span className="text-sm font-extrabold text-emerald-600">600 000 — 850 000 ₸</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Career Selection & Git Interactive Checklist */}
                  <div className="md:col-span-5 flex flex-col gap-4">
                    {/* Track toggles */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-muted-foreground">Выберите направление:</span>
                      <div className="grid grid-cols-3 gap-1.5 bg-muted/40 p-1 rounded-xl border border-border/30">
                        {(['frontend', 'backend', 'fullstack'] as const).map((t) => (
                          <button
                            key={t}
                            onClick={() => setCareerTrack(t)}
                            className={`py-1.5 px-2 rounded-lg text-[10px] font-extrabold uppercase transition cursor-pointer border-none text-center ${
                              careerTrack === t
                                ? "bg-brand-blue text-white shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {t === 'frontend' && "Frontend"}
                            {t === 'backend' && "Backend"}
                            {t === 'fullstack' && "Fullstack"}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Interactive Git Checklist */}
                    <div className="p-4 rounded-xl bg-card border border-border/80 space-y-3">
                      <span className="text-[10px] font-extrabold text-brand-orange uppercase tracking-wider block">
                        🛠️ Публикация сайта на GitHub
                      </span>
                      
                      <div className="space-y-2">
                        {[
                          { key: 'init', label: "git init", desc: "Инициализация репозитория" },
                          { key: 'add', label: "git add .", desc: "Добавление файлов в индекс" },
                          { key: 'commit', label: "git commit -m \"first site\"", desc: "Создание снимка (коммита)" },
                          { key: 'push', label: "git push origin main", desc: "Отправка кода на хостинг" }
                        ].map((cmd) => {
                          const isChecked = gitChecks[cmd.key as keyof typeof gitChecks];
                          return (
                            <button
                              key={cmd.key}
                              onClick={() => setGitChecks(prev => ({ ...prev, [cmd.key]: !isChecked }))}
                              className={`w-full text-left p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                                isChecked
                                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600"
                                  : "bg-muted/20 border-border/60 hover:bg-muted/40 text-foreground"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-xs">{isChecked ? "✅" : "⬜"}</span>
                                <div>
                                  <code className="text-xs font-mono font-bold">{cmd.label}</code>
                                  <span className="text-[9px] text-muted-foreground block font-medium">{cmd.desc}</span>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {Object.values(gitChecks).every(Boolean) && (
                        <div className="p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 text-center animate-bounce mt-2">
                          <span className="text-xs font-extrabold block">🎉 Проект опубликован в Сети!</span>
                          <span className="text-[10px] font-semibold block mt-0.5">Вы готовы начать настоящую карьеру в IT!</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* Premium Visual Text Module */
                <div className="relative overflow-hidden rounded-3xl bg-card border border-border p-6 md:p-8 shadow-[var(--shadow-card)] space-y-6 animate-fade-in">
                  {/* Decorative Glassmorphic Background Circles */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/5 rounded-full blur-3xl -z-10 animate-pulse" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-orange/5 rounded-full blur-3xl -z-10 animate-pulse" />

                  {/* Header Banner */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border/60">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-blue/15 to-brand-blue/5 border border-brand-blue/20 flex items-center justify-center text-3xl shadow-inner">
                        {courseName.toLowerCase().includes("матем") ? "📐" : 
                         courseName.toLowerCase().includes("програм") ? "💻" : 
                         courseName.toLowerCase().includes("физик") ? "⚛️" : 
                         courseName.toLowerCase().includes("хим") ? "🧪" : "📖"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-brand-blue/10 text-brand-blue text-[10px] font-extrabold uppercase tracking-wider">
                            Учебный модуль
                          </span>
                          <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                            ⏳ {activeLesson.duration}
                          </span>
                        </div>
                        <h3 className="font-display font-extrabold text-base sm:text-lg text-foreground mt-1.5 leading-snug">
                          {activeLesson.title}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-muted/40 p-1.5 rounded-xl border border-border/50">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase px-1">Сложность:</span>
                      <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-600 text-[10px] font-extrabold">
                        Базовая
                      </span>
                    </div>
                  </div>

                  {/* Core Takeaways / Objectives */}
                  <div className="bg-muted/30 border border-border/50 rounded-2xl p-5 space-y-3">
                    <h4 className="text-xs font-extrabold text-brand-orange uppercase tracking-widest flex items-center gap-1.5">
                      🚀 Что вы узнаете на этом занятии:
                    </h4>
                    <ul className="grid sm:grid-cols-2 gap-3 text-xs font-bold text-foreground/80">
                      <li className="flex items-start gap-2 leading-relaxed">
                        <span className="text-brand-blue mt-0.5">✦</span>
                        Разберете фундаментальные понятия и правила
                      </li>
                      <li className="flex items-start gap-2 leading-relaxed">
                        <span className="text-brand-blue mt-0.5">✦</span>
                        Изучите детальный теоретический конспект с примерами
                      </li>
                      <li className="flex items-start gap-2 leading-relaxed">
                        <span className="text-brand-blue mt-0.5">✦</span>
                        Отработаете навыки на интерактивных кейсах
                      </li>
                      <li className="flex items-start gap-2 leading-relaxed">
                        <span className="text-brand-blue mt-0.5">✦</span>
                        Закрепите тему с помощью проверочного тестирования
                      </li>
                    </ul>
                  </div>

                  {/* Immersive Study Banner */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-brand-blue/5 to-transparent border border-brand-blue/10 flex items-center gap-3">
                    <span className="text-lg">📚</span>
                    <p className="text-[11px] font-semibold text-muted-foreground leading-relaxed">
                      Учебный материал подготовлен ведущими методистами. Вы можете активировать специальный <span className="text-foreground font-bold">Режим чтения</span> ниже для максимальной концентрации на тексте конспекта.
                    </p>
                  </div>
                </div>
              )}

              {/* Theory text */}
              <div className="space-y-3 transition-all duration-300">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="font-display font-bold text-lg flex items-center gap-2">
                    <span>📖</span> Теоретическая часть
                  </h3>
                  <button
                    onClick={() => setIsReadingMode(!isReadingMode)}
                    className={`px-3 py-1.5 rounded-xl border text-[10px] font-extrabold uppercase transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                      isReadingMode 
                        ? "bg-brand-blue/15 border-brand-blue/30 text-brand-blue scale-105" 
                        : "bg-muted border-border/60 hover:bg-border text-foreground hover:scale-102"
                    }`}
                    title={isReadingMode ? "Вернуть стандартный шрифт" : "Включить крупный шрифт для чтения"}
                  >
                    {isReadingMode ? "👁️ Обычный режим" : "📖 Режим чтения"}
                  </button>
                </div>
                <p className={`transition-all duration-300 rounded-2xl border border-border/50 font-medium leading-relaxed ${
                  isReadingMode 
                    ? "text-foreground p-8 md:p-10 bg-amber-50/10 dark:bg-amber-950/5 font-serif text-base sm:text-lg tracking-wide border-amber-500/20 max-w-4xl mx-auto shadow-inner text-justify" 
                    : "text-foreground/90 text-sm p-5 bg-muted/40"
                }`}>
                  {activeLesson.theory}
                </p>
              </div>
            </div>

            {/* Step-by-Step Task Checklist (Bottom) */}
            <div className="p-8 rounded-3xl bg-card border border-border shadow-[var(--shadow-card)] space-y-6">
              <div>
                <span className="inline-flex px-2.5 py-0.5 rounded-full bg-brand-blue/15 text-brand-blue font-bold text-xs">
                  ✏️ Интерактивный тест
                </span>
                <h3 className="font-display font-bold text-lg mt-2">
                  Ответьте на вопрос, чтобы открыть следующий шаг:
                </h3>
                <p className="text-xs font-semibold text-muted-foreground mt-1">
                  {activeLesson.question}
                </p>
              </div>

              {/* Option Selection Grid */}
              <div className="grid sm:grid-cols-2 gap-3">
                {(shuffledOptions.length > 0 ? shuffledOptions : activeLesson.options).map((opt) => {
                  const isSelected = selectedOption === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => handleOptionSelect(opt)}
                      disabled={answered}
                      className={`p-4 rounded-xl border transition-all text-left text-sm font-bold cursor-pointer flex items-center justify-between ${
                        answered
                          ? opt === activeLesson.correctAnswer
                            ? "bg-emerald-500 text-white border-emerald-500 shadow-md"
                            : isSelected
                              ? "bg-rose-500 text-white border-rose-500 shadow-md scale-[0.99]"
                              : "bg-muted/30 text-muted-foreground border-transparent opacity-40 cursor-not-allowed"
                          : isSelected
                            ? "bg-brand-blue text-white border-brand-blue shadow-md scale-[1.01]"
                            : "bg-background hover:bg-muted text-foreground border-border/80 hover:border-brand-blue/30"
                      }`}
                    >
                      <span>{opt}</span>
                      {answered ? (
                        opt === activeLesson.correctAnswer ? (
                          <span className="text-xs bg-white/20 px-2 py-0.5 rounded flex items-center gap-1 font-bold">✓ Правильно</span>
                        ) : isSelected ? (
                          <span className="text-xs bg-white/20 px-2 py-0.5 rounded flex items-center gap-1 font-bold">✗ Неверно</span>
                        ) : null
                      ) : (
                        isSelected && <span className="text-xs bg-white/20 px-2 py-0.5 rounded font-bold">✓ Выбрано</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between gap-4 pt-2">
                {answered ? (
                  <div className="flex items-center gap-4 flex-1 flex-wrap sm:flex-nowrap">
                    <div className={`p-4 rounded-2xl border flex-1 text-sm font-bold flex items-center gap-2.5 ${
                      isAnswerCorrect 
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600" 
                        : "bg-red-500/10 border-red-500/30 text-red-500"
                    }`}>
                      <span className="text-lg">{isAnswerCorrect ? "🎉" : "❌"}</span>
                      <span>
                        {isAnswerCorrect 
                          ? (activeLessonId === lessons.length 
                            ? "Потрясающе! Вы ответили на все вопросы и успешно завершили этот курс!" 
                            : "Ответ абсолютно верен! Шаг успешно пройден!")
                          : "Ответ неверный. Почитайте теорию и повторите попытку."}
                      </span>
                    </div>
                    
                    {!isAnswerCorrect ? (
                      <button
                        onClick={resetQuestion}
                        className="px-6 py-3.5 rounded-full bg-brand-orange text-brand-orange-foreground font-bold text-sm cursor-pointer hover:scale-105 active:scale-95 transition border-none shadow-sm"
                      >
                        Попробовать снова
                      </button>
                    ) : (
                      activeLessonId < lessons.length ? (
                        <button
                          onClick={() => {
                            const nextId = activeLessonId + 1;
                            const next = lessons.find((l) => l.id === nextId);
                            if (next && (next.isTrial || isPaid)) {
                              handleLessonSwitch(nextId);
                            } else {
                              toast.info("Для доступа к следующему уроку необходимо оплатить курс!");
                            }
                          }}
                          className="px-6 py-3.5 rounded-full bg-brand-blue text-white font-bold text-sm cursor-pointer hover:scale-105 active:scale-95 transition border-none shadow-md"
                        >
                          Следующий урок →
                        </button>
                      ) : (
                        <Link
                          to="/profile"
                          className="px-6 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-white font-bold text-sm cursor-pointer hover:scale-105 active:scale-95 transition border-none shadow-md text-center flex items-center justify-center gap-1.5"
                        >
                          <span>🏆</span> В профиль за дипломом!
                        </Link>
                      )
                    )}
                  </div>
                ) : (
                  <button
                    onClick={checkAnswer}
                    disabled={!selectedOption}
                    className="ml-auto px-8 py-3.5 rounded-full bg-brand-blue text-white font-bold text-sm disabled:opacity-50 disabled:cursor-default cursor-pointer hover:scale-105 active:scale-95 transition border-none shadow-md"
                  >
                    Проверить ответ
                  </button>
                )}
              </div>

            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
