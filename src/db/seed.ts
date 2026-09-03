import "dotenv/config";
import { db } from "@/db";
import {
  users,
  services,
  portfolioItems,
  orders,
  messages,
  settings,
  blogPosts,
  courses,
  courseSessions,
  testimonials,
  templates,
  templateCategories,
  pageSections,
  templateTutorials,
  templateFaqs,
  templateUpdates,
  templateQuestions,
  pageMeta,
  enrollments,
  templateOrders,
} from "@/db/schema";
import { sql, eq } from "drizzle-orm";
import { hash } from "bcryptjs";
import { newId } from "@/lib/utils";

const portfolio = [
  {
    title: "فروشگاه آنلاین استایل‌شاپ",
    slug: "style-shop",
    description:
      "طراحی و توسعه فروشگاه اینترنتی مد و پوشاک با پنل مدیریت پیشرفته، درگاه پرداخت آنلاین و تجربه خرید موبایل‌محور.",
    category: "ecommerce" as const,
    imageUrl:
      "https://images.pexels.com/photos/6986455/pexels-photo-6986455.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    liveUrl: "https://example.com/style-shop",
    demoUrl: "https://demo.example.com/style-shop",
    technologies: ["Next.js", "TypeScript", "Stripe", "Tailwind"],
    featured: true,
    sortOrder: 1,
  },
  {
    title: "اپلیکیشن مدیریت مالی بودجه‌یار",
    slug: "budget-yar",
    description:
      "اپلیکیشن موبایل برای مدیریت بودجه شخصی با نمودارهای تعاملی، گزارش‌گیری هوشمند و همگام‌سازی ابری.",
    category: "app" as const,
    imageUrl:
      "https://images.pexels.com/photos/6406691/pexels-photo-6406691.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    liveUrl: "https://example.com/budget-yar",
    demoUrl: "https://demo.example.com/budget-yar",
    technologies: ["React Native", "Node.js", "PostgreSQL"],
    featured: true,
    sortOrder: 2,
  },
  {
    title: "وب‌سایت شرکتی فولاد پارس",
    slug: "foolad-pars",
    description:
      "وب‌سایت معرفی شرکت صنعتی با طراحی مینیمال، سیستم مدیریت محتوا و صفحات چندزبانه فارسی و انگلیسی.",
    category: "web" as const,
    imageUrl:
      "https://images.pexels.com/photos/1181449/pexels-photo-1181449.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    liveUrl: "https://example.com/foolad-pars",
    demoUrl: "https://demo.example.com/foolad-pars",
    technologies: ["Next.js", "Prisma", "i18n"],
    featured: false,
    sortOrder: 3,
  },
  {
    title: "سئو و رشد ارگانیک کلینیک زیبایی",
    slug: "beauty-clinic-seo",
    description:
      "کمپین سئو جامع که ترافیک ارگانیک را در ۶ ماه بیش از ۴ برابر کرد و رتبه اول گوگل را برای کلمات کلیدی هدف به ارمغان آورد.",
    category: "seo" as const,
    imageUrl:
      "https://images.pexels.com/photos/7948067/pexels-photo-7948067.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    liveUrl: "https://example.com/beauty-clinic",
    demoUrl: "https://demo.example.com/beauty-clinic",
    technologies: ["Google Analytics", "Search Console", "Semrush"],
    featured: false,
    sortOrder: 4,
  },
  {
    title: "وب‌سایت رستوران طعم ایرانی",
    slug: "taam-irani",
    description:
      "وب‌سایت رستوران با منوی آنلاین، سیستم رزرو میز و گالری تصاویر با طراحی گرم و اشتهابرانگیز.",
    category: "web" as const,
    imageUrl:
      "https://images.pexels.com/photos/7214629/pexels-photo-7214629.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    liveUrl: "https://example.com/taam-irani",
    demoUrl: "https://demo.example.com/taam-irani",
    technologies: ["React", "Node.js", "MongoDB"],
    featured: true,
    sortOrder: 5,
  },
  {
    title: "اپلیکیشن تاکسی اینترنتی سفر‌یار",
    slug: "safar-yar",
    description:
      "پلتفرم درخواست خودرو با نقشه زنده، سیستم امتیازدهی راننده و مسیردهی بهینه در زمان واقعی.",
    category: "app" as const,
    imageUrl:
      "https://images.pexels.com/photos/3850263/pexels-photo-3850263.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    liveUrl: "https://example.com/safar-yar",
    demoUrl: "https://demo.example.com/safar-yar",
    technologies: ["Flutter", "Firebase", "Mapbox"],
    featured: false,
    sortOrder: 6,
  },
  {
    title: "فروشگاه لوازم دیجیتال تک‌شاپ",
    slug: "tech-shop",
    description:
      "فروشگاه اینترنتی لوازم دیجیتال با فیلتر هوشمند محصولات، مقایسه کالا و باشگاه مشتریان.",
    category: "ecommerce" as const,
    imageUrl:
      "https://images.pexels.com/photos/242492/pexels-photo-242492.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    liveUrl: "https://example.com/tech-shop",
    demoUrl: "https://demo.example.com/tech-shop",
    technologies: ["Next.js", "PostgreSQL", "Redis"],
    featured: false,
    sortOrder: 7,
  },
  {
    title: "هویت بصری برند قهوه‌خانه",
    slug: "coffee-brand",
    description:
      "طراحی لوگو، پالت رنگی و هویت بصری کامل برای کافه زنجیره‌ای به همراه طراحی بسته‌بندی محصولات.",
    category: "branding" as const,
    imageUrl:
      "https://images.pexels.com/photos/39225972/pexels-photo-39225972.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    liveUrl: "https://example.com/coffee-brand",
    demoUrl: "https://demo.example.com/coffee-brand",
    technologies: ["Figma", "Illustrator", "Photoshop"],
    featured: false,
    sortOrder: 8,
  },
];

const serviceList = [
  {
    title: "طراحی وب‌سایت",
    slug: "web-design",
    description:
      "طراحی وب‌سایت‌های مدرن، واکنش‌گرا و بهینه با جدیدترین تکنولوژی‌های روز دنیا.",
    icon: "globe",
    gradient: "from-indigo-500 to-blue-500",
    features: ["طراحی اختصاصی و منحصربه‌فرد", "واکنش‌گرا در تمام دستگاه‌ها", "سرعت بارگذاری بالا"],
    sortOrder: 1,
  },
  {
    title: "توسعه اپلیکیشن",
    slug: "app-development",
    description:
      "ساخت اپلیکیشن‌های اندروید و iOS با تجربه کاربری بی‌نظیر و عملکرد روان.",
    icon: "smartphone",
    gradient: "from-violet-500 to-purple-500",
    features: ["نسخه اندروید و iOS", "طراحی رابط کاربری مدرن", "پشتیبانی و به‌روزرسانی"],
    sortOrder: 2,
  },
  {
    title: "سئو و بهینه‌سازی",
    slug: "seo",
    description:
      "افزایش رتبه در گوگل و جذب بازدیدکننده واقعی با استراتژی‌های اثبات‌شده سئو.",
    icon: "trending",
    gradient: "from-emerald-500 to-teal-500",
    features: ["تحلیل کامل رقبا", "بهینه‌سازی فنی و محتوایی", "گزارش پیشرفت ماهانه"],
    sortOrder: 3,
  },
  {
    title: "فروشگاه اینترنتی",
    slug: "ecommerce",
    description:
      "راه‌اندازی فروشگاه آنلاین کامل با درگاه پرداخت، مدیریت انبار و گزارش فروش.",
    icon: "cart",
    gradient: "from-amber-500 to-orange-500",
    features: ["درگاه پرداخت آنلاین", "مدیریت محصولات و انبار", "گزارش‌گیری فروش"],
    sortOrder: 4,
  },
  {
    title: "برندینگ و هویت بصری",
    slug: "branding",
    description:
      "خلق هویت بصری ماندگار با طراحی لوگو، رنگ سازمانی و دستورالعمل برند.",
    icon: "palette",
    gradient: "from-fuchsia-500 to-pink-500",
    features: ["طراحی لوگو حرفه‌ای", "پالت رنگی سازمانی", "دستورالعمل برند"],
    sortOrder: 5,
  },
  {
    title: "پشتیبانی و نگهداری",
    slug: "support",
    description:
      "پشتیبانی فنی ۲۴/۷، مانیتورینگ مداوم و به‌روزرسانی امنیتی برای محصولات شما.",
    icon: "lifebuoy",
    gradient: "from-cyan-500 to-sky-500",
    features: ["پاسخگویی سریع", "مانیتورینگ ۲۴/۷", "به‌روزرسانی امنیتی"],
    sortOrder: 6,
  },
];

const orderList = [
  {
    name: "سارا محمدی",
    email: "sara.mohammadi@gmail.com",
    phone: "09121234567",
    service: "طراحی وب‌سایت",
    budget: "۱۰ تا ۲۰ میلیون تومان",
    description: "یک وب‌سایت فروشگاهی برای برند پوشاک خود می‌خواهم با درگاه پرداخت و پنل مدیریت.",
    status: "new" as const,
  },
  {
    name: "علی رضایی",
    email: "ali.rezaei@yahoo.com",
    phone: "09351112233",
    service: "توسعه اپلیکیشن",
    budget: "بیش از ۵۰ میلیون تومان",
    description: "اپلیکیشن رزرو آنلاین برای سالن زیبایی خود نیاز دارم، اندروید و iOS.",
    status: "in_review" as const,
  },
  {
    name: "مریم احمدی",
    email: "maryam.ahmadi@gmail.com",
    phone: "09193445566",
    service: "سئو و بهینه‌سازی",
    budget: "۵ تا ۱۰ میلیون تومان",
    description: "وب‌سایت کلینیک دندانپزشکی دارم و می‌خواهم در گوگل دیده شوم.",
    status: "in_progress" as const,
  },
  {
    name: "رضا کریمی",
    email: "reza.karimi@outlook.com",
    phone: "09127778899",
    service: "فروشگاه اینترنتی",
    budget: "۲۰ تا ۵۰ میلیون تومان",
    description: "فروشگاه لوازم ورزشی با سیستم انبارداری و گزارش فروش کامل.",
    status: "completed" as const,
  },
];

const messageList = [
  {
    name: "امیر حسینی",
    email: "amir.hosseini@gmail.com",
    subject: "همکاری در پروژه",
    message:
      "سلام، تیم شما را دنبال می‌کنم و کارهایتان را خیلی دوست دارم. برای پروژه بعدی شرکت‌مان می‌خواهم با شما همکاری کنم. لطفاً با من تماس بگیرید.",
    read: false,
  },
  {
    name: "نگار موسوی",
    email: "negar.mousavi@gmail.com",
    subject: "سوال درباره خدمات سئو",
    message:
      "وقت بخیر، می‌خواستم بدانم خدمات سئو شما به چه صورت است و آیا قرارداد ماهانه دارید یا پروژه‌ای؟",
    read: false,
  },
  {
    name: "کاوه نادری",
    email: "kaveh.naderi@yahoo.com",
    subject: "تشکر از پروژه",
    message:
      "فقط خواستم تشکر کنم، وب‌سایتی که طراحی کردید فوق‌العاده است و فروش ما دو برابر شده!",
    read: true,
  },
];

const settingList = [
  { key: "about_title", value: "تیمی از توسعه‌دهندگان عاشق خلق تجربه‌های دیجیتال" },
  {
    key: "about_description",
    value:
      "ما یک تیم متشکل از چند برنامه‌نویس حرفه‌ای هستیم که با سال‌ها تجربه، کارهایی مانند طراحی وب‌سایت، توسعه اپلیکیشن و ارتقای سئو را به صورت کاملاً حرفه‌ای انجام می‌دهیم. ماموریت ما خلق محصولات دیجیتالی است که هم زیبا باشند و هم کارآمد. ما باور داریم که هر کسب‌وکاری شایسته یک حضور آنلاین قدرتمند است.",
  },
  {
    key: "about_mission",
    value:
      "کمک به کسب‌وکارها برای رشد و دیده‌شدن در دنیای دیجیتال با ارائه راهکارهای نوآورانه و باکیفیت.",
  },
  {
    key: "about_vision",
    value:
      "تبدیل‌شدن به معتبرترین تیم توسعه وب و اپلیکیشن منطقه با تمرکز بر کیفیت، خلاقیت و رضایت مشتری.",
  },
  { key: "logo_text", value: "نکساتک" },
  { key: "logo_image_url", value: "" },
  { key: "footer_about", value: "تیم حرفه‌ای برنامه‌نویسان برای طراحی وب‌سایت، توسعه اپلیکیشن و ارتقای سئو." },
  { key: "footer_copyright", value: "نکسا تک — تمامی حقوق محفوظ است." },
  { key: "contact_phone", value: "021-88776655" },
  { key: "contact_mobile", value: "0912-345-6789" },
  { key: "contact_email", value: "hello@nexatech.ir" },
  { key: "contact_address", value: "تهران، خیابان ولیعصر، برج فناوری، طبقه ۵" },
  { key: "social_instagram", value: "https://instagram.com/nexatech" },
  { key: "social_telegram", value: "https://t.me/nexatech" },
  { key: "social_linkedin", value: "https://linkedin.com/company/nexatech" },
  { key: "social_github", value: "https://github.com/nexatech" },
  { key: "stats_clients", value: "120" },
  { key: "stats_years", value: "8" },
  { key: "stats_team", value: "14" },
  {
    key: "team",
    value: JSON.stringify([
      { name: "محمد رستمی", role: "بنیان‌گذار و توسعه‌دهنده ارشد", initials: "مر" },
      { name: "الهام شریفی", role: "طراح رابط و تجربه کاربری", initials: "اش" },
      { name: "پویا کاظمی", role: "متخصص سئو و بازاریابی", initials: "پک" },
      { name: "نیلوفر صادقی", role: "مدیر پروژه", initials: "نص" },
    ]),
  },
];

const blogList = [
  {
    title: "چرا هر کسب‌وکاری به وب‌سایت حرفه‌ای نیاز دارد؟",
    slug: "why-business-needs-website",
    excerpt: "در دنیای امروز، نداشتن وب‌سایت یعنی نداشتن ویترین. در این مقاله دلایل ضرورت حضور آنلاین را بررسی می‌کنیم.",
    content:
      "## مقدمه\n\nدر عصر دیجیتال، **اولین جایی که مشتریان به دنبال شما می‌گردند، اینترنت است**. یک وب‌سایت حرفه‌ای نه‌تنها اعتبار برند شما را بالا می‌برد، بلکه دروازه‌ای برای جذب مشتریان جدید است.\n\n## چرا وب‌سایت مهم است؟\n\n- حضور ۲۴ ساعته برای مشتریان\n- افزایش اعتماد و اعتبار برند\n- امکان فروش آنلاین و افزایش درآمد\n- بازاریابی ارزان‌تر نسبت به روش‌های سنتی\n\n> نکته: وب‌سایتی که در موبایل خوب نمایش داده نشود، بیش از نیمی از مشتریان را از دست می‌دهد.\n\n## جمع‌بندی\n\nاگر هنوز وب‌سایت ندارید، همین امروز اقدام کنید. تیم نکسا تک آماده کمک به شماست.",
    coverUrl:
      "https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    category: "طراحی وب",
    author: "تیم نکسا تک",
    tags: ["وب‌سایت", "کسب‌وکار", "بازاریابی"],
    published: true,
    featured: true,
  },
  {
    title: "راهنمای کامل سئو برای مبتدیان",
    slug: "seo-guide-for-beginners",
    excerpt: "سئو یا بهینه‌سازی موتور جستجو چیست و چرا اهمیت دارد؟ در این راهنما قدم‌به‌قدم با اصول سئو آشنا می‌شوید.",
    content:
      "## سئو چیست؟\n\nسئو (SEO) فرآیند بهینه‌سازی وب‌سایت برای کسب رتبه بهتر در نتایج موتورهای جستجو مانند **گوگل** است.\n\n## اصول اولیه سئو\n\n1. تحقیق کلمات کلیدی\n2. بهینه‌سازی محتوای صفحات\n3. ساخت لینک‌های داخلی و خارجی\n4. بهبود سرعت سایت\n5. ریسپانسیو بودن برای موبایل\n\n## چرا سئو مهم است؟\n\nبیش از ۹۰٪ کاربران روی لینک‌های صفحه اول گوگل کلیک می‌کنند. یعنی اگر در صفحه اول نباشید، عملاً دیده نمی‌شوید.",
    coverUrl:
      "https://images.pexels.com/photos/270637/pexels-photo-270637.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    category: "سئو",
    author: "پویا کاظمی",
    tags: ["سئو", "گوگل", "بازاریابی دیجیتال"],
    published: true,
    featured: true,
  },
  {
    title: "Next.js یا React؟ کدام را انتخاب کنیم؟",
    slug: "nextjs-vs-react",
    excerpt: "انتخاب فریم‌ورک مناسب برای پروژه‌های وب می‌تواند سخت باشد. در این مقاله تفاوت‌های Next.js و React را بررسی می‌کنیم.",
    content:
      "## معرفی\n\n**React** یک کتابخانه برای ساخت رابط کاربری است، در حالی که **Next.js** یک فریم‌ورک کامل بر پایه React است که امکانات بیشتری ارائه می‌دهد.\n\n## مزایای Next.js\n\n- رندر سمت سرور (SSR) و استاتیک (SSG)\n- مسیردهی مبتنی بر فایل\n- بهینه‌سازی خودکار تصاویر\n- پشتیبانی از TypeScript\n\n## چه زمانی از React استفاده کنیم؟\n\nوقتی به کنترل کامل نیاز دارید یا پروژه شما یک SPA ساده است.\n\n## جمع‌بندی\n\nبرای اکثر پروژه‌های جدید، Next.js انتخاب بهتری است.",
    coverUrl:
      "https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    category: "برنامه‌نویسی",
    author: "محمد رستمی",
    tags: ["Next.js", "React", "فرانت‌اند"],
    published: true,
    featured: true,
  },
];

const courseList = [
  {
    title: "دوره جامع طراحی وب با HTML و CSS",
    slug: "html-css-course",
    description:
      "از صفر تا صد ساخت صفحات وب با HTML و CSS. مناسب افرادی که می‌خواهند وارد دنیای طراحی وب شوند.",
    coverUrl:
      "https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    level: "مقدماتی",
    instructor: "الهام شریفی",
    price: 0,
    totalDuration: "۴ ساعت",
    published: true,
    featured: true,
    sessions: [
      {
        title: "آشنایی با ساختار HTML",
        summary:
          "در این جلسه با ساختار کلی یک سند HTML، تگ‌های پایه و نحوه نوشتن اولین صفحه وب آشنا می‌شوید.",
        videoUrl: "https://www.youtube.com/watch?v=W6NZfCO5SIk",
        duration: "۲۵ دقیقه",
        isPreview: true,
      },
      {
        title: "استایل‌دهی با CSS",
        summary:
          "یادگیری انتخابگرها، رنگ‌ها، فونت‌ها و باکس‌مدل برای زیباسازی صفحات وب.",
        videoUrl: "https://www.youtube.com/watch?v=OXGznpKZ_sA",
        duration: "۳۰ دقیقه",
        isPreview: true,
      },
      {
        title: "چیدمان با Flexbox و Grid",
        summary:
          "ساخت چیدمان‌های مدرن و واکنش‌گرا با استفاده از Flexbox و CSS Grid.",
        videoUrl: "https://www.youtube.com/watch?v=aircAruvnKk",
        duration: "۴۰ دقیقه",
        isPreview: false,
      },
    ],
  },
  {
    title: "دوره پیشرفته Next.js — ساخت اپلیکیشن واقعی",
    slug: "nextjs-advanced",
    description:
      "ساخت وب‌اپلیکیشن‌های کامل و حرفه‌ای با Next.js، TypeScript و PostgreSQL از پایه تا استقرار.",
    coverUrl:
      "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    level: "پیشرفته",
    instructor: "محمد رستمی",
    price: 1490000,
    totalDuration: "۱۲ ساعت",
    published: true,
    featured: true,
    sessions: [
      {
        title: "معرفی دوره و نصب ابزارها",
        summary: "آشنایی با سرفصل‌ها، نصب Node.js و راه‌اندازی اولین پروژه Next.js.",
        videoUrl: "https://www.youtube.com/watch?v=W6NZfCO5SIk",
        duration: "۱۸ دقیقه",
        isPreview: true,
      },
      {
        title: "مسیردهی و صفحات داینامیک",
        summary: "آشنایی با App Router، صفحات داینامیک و لینک‌ها در Next.js.",
        videoUrl: "https://www.youtube.com/watch?v=OXGznpKZ_sA",
        duration: "۳۵ دقیقه",
        isPreview: false,
      },
      {
        title: "اتصال به پایگاه داده",
        summary: "اتصال به PostgreSQL با Drizzle ORM و ساخت اولین مدل‌های داده.",
        videoUrl: "https://www.youtube.com/watch?v=aircAruvnKk",
        duration: "۴۵ دقیقه",
        isPreview: false,
      },
    ],
  },
  {
    title: "مبانی سئو و بهینه‌سازی سایت",
    slug: "seo-basics",
    description:
      "آموزش اصول و تکنیک‌های سئو برای کسب رتبه بهتر در گوگل و افزایش ترافیک ارگانیک.",
    coverUrl:
      "https://images.pexels.com/photos/1591060/pexels-photo-1591060.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    level: "مقدماتی",
    instructor: "پویا کاظمی",
    price: 490000,
    totalDuration: "۶ ساعت",
    published: true,
    featured: false,
    sessions: [
      {
        title: "سئو چیست و چرا مهم است؟",
        summary: "مفاهیم پایه سئو و اهمیت آن برای رشد کسب‌وکارها.",
        videoUrl: "https://www.youtube.com/watch?v=W6NZfCO5SIk",
        duration: "۲۰ دقیقه",
        isPreview: true,
      },
      {
        title: "تحقیق کلمات کلیدی",
        summary: "یافتن کلمات کلیدی مناسب و تحلیل رقبا با ابزارهای رایگان.",
        videoUrl: "https://www.youtube.com/watch?v=OXGznpKZ_sA",
        duration: "۳۰ دقیقه",
        isPreview: false,
      },
    ],
  },
];

const testimonialList = [
  {
    name: "سارا محمدی",
    role: "مدیر فروشگاه استایل‌شاپ",
    content:
      "همکاری با تیم نکسا تک یکی از بهترین تصمیم‌های ما بود. فروشگاه آنلاین ما در کمتر از دو ماه راه‌اندازی شد و فروش ما ۲ برابر شد. طراحی فوق‌العاده و پشتیبانی عالی!",
    rating: 5,
    approved: true,
    featured: true,
    sortOrder: 1,
  },
  {
    name: "علی رضایی",
    role: "مدیرعامل کلینیک زیبایی",
    content:
      "بعد از سئوی سایت توسط این تیم، رتبه ما در گوگل به طرز چشمگیری بهبود یافت و ترافیک ارگانیک ما ۴ برابر شد. کاملاً حرفه‌ای و نتیجه‌گرا.",
    rating: 5,
    approved: true,
    featured: true,
    sortOrder: 2,
  },
  {
    name: "مریم احمدی",
    role: "بنیان‌گذار استارتاپ سفر‌یار",
    content:
      "اپلیکیشنی که برای ما ساختند دقیقاً همان چیزی بود که می‌خواستیم. تیم فنی قوی و ارتباط عالی در طول پروژه. قطعاً دوباره با آن‌ها کار می‌کنم.",
    rating: 5,
    approved: true,
    featured: true,
    sortOrder: 3,
  },
  {
    name: "رضا کریمی",
    role: "صاحب فروشگاه تک‌شاپ",
    content:
      "قالبی که از نکسا تک خریدم کیفیت بسیار بالایی داشت و نصب آن خیلی ساده بود. پشتیبانی هم سریع پاسخ دادند. ارزش هر ریالش را داشت.",
    rating: 4,
    approved: true,
    featured: false,
    sortOrder: 4,
  },
];

const templateCategoriesSeed = [
  { id: "cat_shop", name: "فروشگاهی", slug: "shop", sortOrder: 1 },
  { id: "cat_education", name: "آموزشی", slug: "education", sortOrder: 2 },
  { id: "cat_corporate", name: "شرکتی", slug: "corporate", sortOrder: 3 },
  { id: "cat_blog", name: "بلاگ", slug: "blog", sortOrder: 4 },
  { id: "cat_portfolio", name: "پورتفولیو", slug: "portfolio", sortOrder: 5 },
];

const templateList = [
  {
    title: "قالب دیجی‌آکادمی — فروش دوره آموزشی",
    slug: "digiacademy",
    description:
      "قالب کامل و حرفه‌ای برای راه‌اندازی سیستم آموزش آنلاین و فروش دوره‌های ویدیویی. مناسب آموزشگاه‌ها، مدرسین و هر کسب‌وکار مرتبط با یادگیری آنلاین.",
    coverUrl:
      "https://images.pexels.com/photos/4145153/pexels-photo-4145153.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    gallery: [
      "https://images.pexels.com/photos/4145190/pexels-photo-4145190.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      "https://images.pexels.com/photos/4145155/pexels-photo-4145155.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      "https://images.pexels.com/photos/5905709/pexels-photo-5905709.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    ],
    price: 1900000,
    category: "آموزشی",
    categoryId: "cat_education",
    technology: "Next.js",
    version: "۲.۴.۰",
    compatibility: "Chrome، Firefox، Safari، Edge",
    rating: 5,
    ratingCount: 35,
    features: [
      "سیستم فروش دوره آنلاین",
      "پروفایل اختصاصی مدرسین",
      "سیستم ورود و عضویت",
      "نمایش دوره به صورت جلسه‌ای",
      "صدور گواهینامه پایان دوره",
      "درگاه پرداخت آنلاین",
      "طراحی کاملاً ریسپانسیو",
      "پشتیبانی رایگان ۶ ماهه",
    ],
    liveUrl: "https://example.com/digiacademy",
    demoUrl: "https://example.com/digiacademy",
    downloadUrl: "https://example.com/downloads/digiacademy.zip",
    published: true,
    featured: true,
  },
  {
    title: "قالب دیجی‌لند — فروشگاه دیجیتال",
    slug: "digiland",
    description:
      "قالب کامل فروشگاه محصولات دیجیتال با طراحی مدرن، سبد خرید، درگاه پرداخت و پنل مدیریت. مناسب فروشگاه‌های آنلاین لوازم دیجیتال.",
    coverUrl:
      "https://images.pexels.com/photos/341523/pexels-photo-341523.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    gallery: [
      "https://images.pexels.com/photos/6446709/pexels-photo-6446709.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    ],
    price: 1890000,
    category: "فروشگاهی",
    categoryId: "cat_shop",
    technology: "Next.js",
    version: "۱.۸.۲",
    compatibility: "Chrome، Firefox، Safari، Edge",
    rating: 5,
    ratingCount: 48,
    features: [
      "طراحی کاملاً ریسپانسیو",
      "پنل مدیریت قدرتمند",
      "اتصال به درگاه پرداخت",
      "سیستم جستجو و فیلتر پیشرفته",
      "سئو شده و بهینه",
      "پشتیبانی رایگان ۶ ماهه",
    ],
    liveUrl: "https://example.com/digiland",
    demoUrl: "https://example.com/digiland",
    downloadUrl: "https://example.com/downloads/digiland.zip",
    published: true,
    featured: true,
  },
  {
    title: "قالب شرکتی آریا — وب‌سایت سازمانی",
    slug: "aria-corporate",
    description:
      "قالب مدرن و حرفه‌ای برای وب‌سایت‌های شرکتی و سازمانی با صفحات خدمات، تیم، نمونه‌کار و بلاگ.",
    coverUrl:
      "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    gallery: [],
    price: 1290000,
    category: "شرکتی",
    categoryId: "cat_corporate",
    technology: "Next.js",
    version: "۱.۲.۰",
    compatibility: "Chrome، Firefox، Safari",
    rating: 4,
    ratingCount: 22,
    features: ["طراحی مینیمال و شیک", "چندزبانه", "سرعت بارگذاری بالا", "سئو شده"],
    liveUrl: "https://example.com/aria",
    demoUrl: "https://example.com/aria",
    downloadUrl: "https://example.com/downloads/aria.zip",
    published: true,
    featured: true,
  },
  {
    title: "قالب بلاگ مجله — نوسی",
    slug: "nosi-blog",
    description:
      "قالب زیبا و خوانا برای وبلاگ و مجله آنلاین با دسته‌بندی، برچسب‌ها و حالت دارک.",
    coverUrl:
      "https://images.pexels.com/photos/267569/pexels-photo-267569.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    gallery: [],
    price: 690000,
    category: "بلاگ",
    categoryId: "cat_blog",
    technology: "Next.js",
    version: "۱.۰.۴",
    compatibility: "Chrome، Firefox، Safari، Edge",
    rating: 4,
    ratingCount: 15,
    features: ["حالت دارک و لایت", "دسته‌بندی و برچسب", "جستجوی پیشرفته", "بهینه برای سئو"],
    liveUrl: "https://example.com/nosi",
    demoUrl: "https://example.com/nosi",
    downloadUrl: "https://example.com/downloads/nosi.zip",
    published: true,
    featured: false,
  },
  {
    title: "قالب پورتفولیو — پرتو",
    slug: "parto-portfolio",
    description:
      "قالب مینیمال و شیک برای نمایش نمونه‌کارها و معرفی شخصی، مناسب طراحان و فریلنسرها.",
    coverUrl:
      "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    gallery: [],
    price: 0,
    category: "پورتفولیو",
    categoryId: "cat_portfolio",
    technology: "Next.js",
    version: "۱.۰.۰",
    compatibility: "Chrome، Firefox، Safari",
    rating: 5,
    ratingCount: 9,
    features: ["طراحی مینیمال", "گالری نمونه‌کار", "فرم تماس", "رایگان!"],
    liveUrl: "https://example.com/parto",
    demoUrl: "https://example.com/parto",
    downloadUrl: "https://example.com/downloads/parto.zip",
    published: true,
    featured: false,
  },
];

const pageSectionsSeed = [
  { type: "hero", title: null, subtitle: null, count: 3, sortOrder: 0 },
  { type: "stats", title: null, subtitle: null, count: 3, sortOrder: 1 },
  { type: "services", title: "خدمات ما", subtitle: "هر آنچه برای حضور قدرتمند در دنیای دیجیتال نیاز دارید.", count: 3, sortOrder: 2 },
  { type: "portfolio", title: "نمونه‌کارهای منتخب", subtitle: "نگاهی به برخی از پروژه‌هایی که به آن‌ها افتخار می‌کنیم.", count: 6, sortOrder: 3 },
  { type: "courses", title: "دوره‌های آموزشی", subtitle: "یادگیری ویدیویی جلسه‌ای با خلاصه هر جلسه — رایگان و پولی.", count: 3, sortOrder: 4 },
  { type: "blog", title: "از وبلاگ ما", subtitle: "آخرین مقالات و آموزش‌های تیم نکسا تک.", count: 3, sortOrder: 5 },
  { type: "testimonials", title: "نظرات مشتریان ما", subtitle: "آنچه مشتریان درباره تجربه همکاری با ما می‌گویند.", count: 3, sortOrder: 6 },
  { type: "testimonial_form", title: "تجربه خود را با ما به اشتراک بگذارید", subtitle: "نظر شما به ما کمک می‌کند تا بهتر شویم.", count: 3, sortOrder: 7 },
  { type: "cta", title: "آماده‌اید پروژه بعدی خود را شروع کنید؟", subtitle: "همین حالا سفارش خود را ثبت کنید تا کارشناسان ما در کمتر از ۲۴ ساعت با شما تماس بگیرند.", count: 3, sortOrder: 8 },
];

export async function seedDatabase() {
  const existing = await db.select({ count: sql<number>`count(*)` }).from(users);
  if (Number(existing[0]?.count ?? 0) > 0) {
    return false;
  }

  // Admin user
  const passwordHash = await hash("admin123", 10);
  await db.insert(users).values({
    id: newId("usr"),
    name: "مدیر سیستم",
    email: "admin@nexatech.ir",
    passwordHash,
    role: "admin",
  });

  // Demo customer user
  const customerHash = await hash("customer123", 10);
  await db.insert(users).values({
    id: newId("usr"),
    name: "کاربر نمونه",
    email: "customer@nexatech.ir",
    passwordHash: customerHash,
    role: "customer",
  });

  // Services
  for (const s of serviceList) {
    await db.insert(services).values({ id: newId("svc"), ...s });
  }

  // Portfolio
  for (const p of portfolio) {
    await db.insert(portfolioItems).values({ id: newId("pf"), ...p });
  }

  // Orders
  for (const o of orderList) {
    await db.insert(orders).values({ id: newId("ord"), ...o });
  }

  // Messages
  for (const m of messageList) {
    await db.insert(messages).values({ id: newId("msg"), ...m });
  }

  // Settings
  for (const s of settingList) {
    await db.insert(settings).values(s);
  }

  // Blog posts
  for (const p of blogList) {
    await db.insert(blogPosts).values({ id: newId("post"), ...p });
  }

  // Courses + sessions
  for (const c of courseList) {
    const courseId = newId("crs");
    const sessionsData = c.sessions ?? [];
    const { sessions: _s, ...courseData } = c;
    await db.insert(courses).values({ id: courseId, ...courseData });
    let i = 1;
    for (const s of sessionsData) {
      await db.insert(courseSessions).values({
        id: newId("ses"),
        courseId,
        sortOrder: i++,
        ...s,
      });
    }
  }

  // Testimonials
  for (const t of testimonialList) {
    await db.insert(testimonials).values({ id: newId("tst"), ...t });
  }

  // Template categories
  for (const c of templateCategoriesSeed) {
    await db.insert(templateCategories).values(c);
  }

  // Templates
  for (const t of templateList) {
    await db.insert(templates).values({ id: newId("tpl"), ...t });
  }

  // Page sections
  for (const s of pageSectionsSeed) {
    await db.insert(pageSections).values({ id: newId("sec"), enabled: true, ...s });
  }

  // Template tutorials, FAQs, updates (for digiacademy)
  const digiacademyId = templateList.find((t) => t.slug === "digiacademy")?.slug ?? "digiacademy";
  const [digiacademyRow] = await db.select().from(templates).where(eq(templates.slug, digiacademyId));
  const digiacademyTplId = digiacademyRow?.id;

  if (digiacademyTplId) {
    const tutorials = [
      {
        title: "آموزش نصب قالب",
        type: "video",
        videoUrl: "https://www.youtube.com/watch?v=W6NZfCO5SIk",
        content: null,
        sortOrder: 1,
      },
      {
        title: "آموزش ویرایش صفحه اصلی",
        type: "video",
        videoUrl: "https://www.youtube.com/watch?v=OXGznpKZ_sA",
        content: null,
        sortOrder: 2,
      },
      {
        title: "آموزش اتصال درگاه پرداخت",
        type: "text",
        videoUrl: null,
        content:
          "برای اتصال درگاه پرداخت مراحل زیر را دنبال کنید:\n\n1. به بخش تنظیمات → پرداخت بروید.\n2. مرچنت‌کد زرین‌پال خود را وارد کنید.\n3. آدرس بازگشت (Callback) را به صورت زیر تنظیم کنید.\n4. تغییرات را ذخیره کرده و یک پرداخت آزمایشی انجام دهید.\n\n**نکته:** درگاه در حالت آزمایشی (Sandbox) بدون دریافت وجه واقعی کار می‌کند.",
        sortOrder: 3,
      },
      {
        title: "آموزش مدیریت دوره‌ها",
        type: "text",
        videoUrl: null,
        content:
          "از بخش مدیریت، می‌توانید دوره‌های جدید ایجاد کنید:\n\n- عنوان و توضیحات دوره را وارد کنید.\n- جلسات ویدیویی را اضافه کنید.\n- قیمت دوره را تعیین کنید (۰ برای رایگان).\n- دوره را منتشر کنید.\n\nبا فعال‌سازی گزینه «پیش‌نمایش»، جلسه برای همه کاربران قابل مشاهده خواهد بود.",
        sortOrder: 4,
      },
    ];

    const faqs = [
      {
        question: "آیا بعد از خرید، آپدیت رایگان دریافت می‌کنم؟",
        answer: "بله، همه خریداران به صورت رایگان به تمامی به‌روزرسانی‌های همان قالب دسترسی دارند.",
        sortOrder: 1,
      },
      {
        question: "قالب روی چه هاستی نصب می‌شود؟",
        answer: "قالب با اکثر هاست‌های استاندارد (لینوکس با PHP 8 به بالا) سازگار است.",
        sortOrder: 2,
      },
      {
        question: "آیا می‌توانم قالب را روی چند دامنه نصب کنم؟",
        answer: "لایسنس هر قالب برای یک دامنه فعال است. برای دامنه‌های بیشتر باید لایسنس جداگانه تهیه کنید.",
        sortOrder: 3,
      },
      {
        question: "پشتیبانی تا چه زمانی است؟",
        answer: "هر خرید شامل ۶ ماه پشتیبانی رایگان است که قابل تمدید می‌باشد.",
        sortOrder: 4,
      },
    ];

    const updates = [
      { version: "۲.۴.۰", title: "بهبودهای رابط کاربری", changes: "- بهبود نمایش دوره‌ها در موبایل\n- رفع باگ جستجو\n- اضافه شدن حالت دارک" },
      { version: "۲.۳.۰", title: "افزودن سیستم گواهینامه", changes: "- صدور گواهینامه پایان دوره\n- بهبود صفحه پروفایل مدرس" },
      { version: "۲.۰.۰", title: "بازطراحی کامل", changes: "- طراحی جدید و مدرن\n- بهبود سرعت بارگذاری\n- پشتیبانی از نسخه جدید Next.js" },
    ];

    for (const t of tutorials) {
      await db.insert(templateTutorials).values({ id: newId("tut"), templateId: digiacademyTplId, ...t });
    }
    for (const f of faqs) {
      await db.insert(templateFaqs).values({ id: newId("faq"), templateId: digiacademyTplId, ...f });
    }
    for (const u of updates) {
      await db.insert(templateUpdates).values({ id: newId("upd"), templateId: digiacademyTplId, ...u, releasedAt: new Date() });
    }

    // Sample user questions (Q&A)
    const userQuestions = [
      {
        name: "علی محمدی",
        email: "ali@example.com",
        question: "آیا این قالب از پرداخت ارزی (دلاری) هم پشتیبانی می‌کند؟",
        answer: "بله، در تنظیمات قالب می‌توانید واحد پول را به دلار تغییر دهید و درگاه‌های ارزی را فعال کنید.",
        answered: true,
      },
      {
        name: "نگار کریمی",
        email: "negar@example.com",
        question: "امکان تعریف چند مدرس در این قالب وجود دارد؟",
        answer: "بله، هر مدرس می‌تواند پروفایل اختصاصی داشته باشد و دوره‌های خود را مدیریت کند.",
        answered: true,
      },
      {
        name: "حسین راد",
        email: "hossein@example.com",
        question: "آیا امکان اتصال به پیامک برای اطلاع‌رسانی خرید وجود دارد؟",
        answer: null,
        answered: false,
      },
    ];

    for (const q of userQuestions) {
      await db.insert(templateQuestions).values({ id: newId("tq"), templateId: digiacademyTplId, userId: null, ...q });
    }
  }

  // SEO defaults
  const seoDefaults = [
    { path: "/", title: "نکسا تک | طراحی وب‌سایت، اپلیکیشن و سئو", description: "تیم حرفه‌ای برنامه‌نویسان برای طراحی وب‌سایت، توسعه اپلیکیشن و ارتقای سئو.", keywords: "طراحی سایت, طراحی وب سایت, سئو, اپلیکیشن, فروشگاه اینترنتی, برنامه نویسی" },
    { path: "/portfolio", title: "نمونه‌کارهای طراحی وب و اپلیکیشن | نکسا تک", description: "مشاهده نمونه‌کارهای تیم نکسا تک در زمینه طراحی وب‌سایت، اپلیکیشن و سئو.", keywords: "نمونه کار, پورتفولیو, طراحی وب, اپلیکیشن" },
    { path: "/blog", title: "وبلاگ آموزش طراحی وب و سئو | نکسا تک", description: "مقالات و آموزش‌های کاربردی در دنیای طراحی وب، برنامه‌نویسی و سئو.", keywords: "آموزش طراحی وب, مقالات سئو, برنامه نویسی" },
    { path: "/courses", title: "دوره‌های آموزشی برنامه‌نویسی | نکسا تک", description: "دوره‌های ویدیویی طراحی وب، برنامه‌نویسی و سئو به صورت جلسه‌ای.", keywords: "دوره آموزشی, آموزش برنامه نویسی, دوره سئو" },
    { path: "/templates", title: "فروشگاه قالب وب‌سایت | نکسا تک", description: "خرید قالب‌های آماده وب‌سایت با کیفیت بالا و پشتیبانی کامل.", keywords: "قالب وب سایت, قالب فروشگاهی, خرید قالب" },
    { path: "/about", title: "درباره ما | نکسا تک", description: "آشنایی با تیم نکسا تک؛ برنامه‌نویسان حرفه‌ای در زمینه وب‌سایت، اپلیکیشن و سئو.", keywords: "درباره ما, تیم برنامه نویسی" },
    { path: "/contact", title: "تماس با ما | نکسا تک", description: "راه‌های ارتباط با تیم نکسا تک.", keywords: "تماس با ما, پشتیبانی" },
    { path: "/order", title: "سفارش پروژه | نکسا تک", description: "ثبت سفارش پروژه طراحی وب‌سایت، اپلیکیشن یا سئو.", keywords: "سفارش پروژه, سفارش طراحی سایت" },
  ];

  for (const s of seoDefaults) {
    await db.insert(pageMeta).values({ id: newId("seo"), noIndex: false, ogImage: null, ...s });
  }

  return true;
}

// Allow running standalone: npx tsx src/db/seed.ts
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then((seeded) => {
      console.log(seeded ? "✓ Database seeded successfully" : "↷ Database already has data, skipping");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Seed failed:", err);
      process.exit(1);
    });
}
