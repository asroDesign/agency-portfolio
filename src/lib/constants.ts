export const CATEGORY_LABELS: Record<string, string> = {
  web: "وب‌سایت",
  app: "اپلیکیشن",
  seo: "سئو",
  ecommerce: "فروشگاه",
  branding: "برندینگ",
};

export const CATEGORY_COLORS: Record<string, string> = {
  web: "bg-primary/10 text-primary border-primary/20",
  app: "bg-sky-500/10 text-sky-700 border-sky-500/20",
  seo: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  ecommerce: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  branding: "bg-teal-500/10 text-teal-700 border-teal-500/20",
};

export const ORDER_STATUS_LABELS: Record<string, string> = {
  new: "جدید",
  in_review: "در حال بررسی",
  in_progress: "در حال انجام",
  completed: "تکمیل شده",
  rejected: "رد شده",
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  in_review: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  in_progress: "bg-primary/10 text-primary border-primary/20",
  completed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  rejected: "bg-rose-500/10 text-rose-600 border-rose-500/20",
};

export const SERVICE_OPTIONS = [
  "طراحی وب‌سایت",
  "توسعه اپلیکیشن",
  "سئو و بهینه‌سازی",
  "فروشگاه اینترنتی",
  "برندینگ و هویت بصری",
  "پشتیبانی و نگهداری",
];

export const BUDGET_OPTIONS = [
  "زیر ۵ میلیون تومان",
  "۵ تا ۱۰ میلیون تومان",
  "۱۰ تا ۲۰ میلیون تومان",
  "۲۰ تا ۵۰ میلیون تومان",
  "بیش از ۵۰ میلیون تومان",
];

// ---------- Page builder section metadata ----------
export type SectionType =
  | "hero"
  | "stats"
  | "services"
  | "portfolio"
  | "courses"
  | "blog"
  | "testimonials"
  | "testimonial_form"
  | "cta";

export const SECTION_META: Record<
  SectionType,
  { label: string; defaultTitle: string; defaultSubtitle: string; count?: number }
> = {
  hero: {
    label: "هدر اصلی",
    defaultTitle: "ایده‌های شما را به محصولات دیجیتال خیره‌کننده تبدیل می‌کنیم",
    defaultSubtitle:
      "طراحی وب‌سایت، توسعه اپلیکیشن و ارتقای سئو — همه زیر یک سقف. ما با ترکیب خلاقیت و تکنولوژی، تجربه‌ای می‌سازیم که کاربران شما عاشقش شوند.",
  },
  stats: { label: "آمار و ارقام", defaultTitle: "", defaultSubtitle: "" },
  services: {
    label: "خدمات",
    defaultTitle: "خدمات ما",
    defaultSubtitle: "هر آنچه برای حضور قدرتمند در دنیای دیجیتال نیاز دارید.",
  },
  portfolio: {
    label: "نمونه‌کارها",
    defaultTitle: "نمونه‌کارهای منتخب",
    defaultSubtitle: "نگاهی به برخی از پروژه‌هایی که به آن‌ها افتخار می‌کنیم.",
    count: 6,
  },
  courses: {
    label: "دوره‌های آموزشی",
    defaultTitle: "دوره‌های آموزشی",
    defaultSubtitle: "یادگیری ویدیویی جلسه‌ای با خلاصه هر جلسه — رایگان و پولی.",
    count: 3,
  },
  blog: {
    label: "وبلاگ",
    defaultTitle: "از وبلاگ ما",
    defaultSubtitle: "آخرین مقالات و آموزش‌های تیم برنامه نویسی آسرو.",
    count: 3,
  },
  testimonials: {
    label: "نظرات مشتریان",
    defaultTitle: "نظرات مشتریان ما",
    defaultSubtitle: "آنچه مشتریان درباره تجربه همکاری با ما می‌گویند.",
  },
  testimonial_form: {
    label: "فرم ثبت نظر",
    defaultTitle: "تجربه خود را با ما به اشتراک بگذارید",
    defaultSubtitle: "نظر شما به ما کمک می‌کند تا بهتر شویم.",
  },
  cta: {
    label: "دعوت به اقدام (CTA)",
    defaultTitle: "آماده‌اید پروژه بعدی خود را شروع کنید؟",
    defaultSubtitle:
      "همین حالا سفارش خود را ثبت کنید تا کارشناسان ما در کمتر از ۲۴ ساعت با شما تماس بگیرند.",
  },
};

export const SECTION_ORDER: SectionType[] = [
  "hero",
  "stats",
  "services",
  "portfolio",
  "courses",
  "blog",
  "testimonials",
  "testimonial_form",
  "cta",
];
