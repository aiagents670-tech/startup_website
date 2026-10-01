import type {
  DbBlog,
  DbService,
  DbPortfolio,
  DbTestimonial,
  DbContactMessage,
  DbSetting,
} from '@/lib/types/db';

const DB_VERSION = '2'; // Bump this to reset seed data on next load
const DB_VERSION_KEY = 'tervom_db_version';

const STORAGE_KEYS = {
  BLOGS: 'tervom_blogs',
  SERVICES: 'tervom_services',
  PORTFOLIO: 'tervom_portfolio',
  TESTIMONIALS: 'tervom_testimonials',
  MESSAGES: 'tervom_messages',
  SETTINGS: 'tervom_settings',
  SUBSCRIBERS: 'tervom_subscribers',
};

// Clear stale seed data when DB version changes
if (typeof window !== 'undefined') {
  const storedVersion = localStorage.getItem(DB_VERSION_KEY);
  if (storedVersion !== DB_VERSION) {
    // Only clear the seed collections (messages & settings are user-generated, preserve them)
    [
      STORAGE_KEYS.BLOGS,
      STORAGE_KEYS.SERVICES,
      STORAGE_KEYS.PORTFOLIO,
      STORAGE_KEYS.TESTIMONIALS,
    ].forEach(key => localStorage.removeItem(key));
    localStorage.setItem(DB_VERSION_KEY, DB_VERSION);
  }
}

const INITIAL_SERVICES: DbService[] = [
  {
    id: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: 'Website Development',
    slug: 'website-development',
    category: 'Development',
    icon: '🌐',
    image_url: null,
    short_description: 'We craft stunning, high-performance websites that convert visitors into customers.',
    full_description: 'Complete end-to-end custom web design and engineering built with top frameworks like React and Next.js.',
    features: ['Responsive Design', 'SEO Optimized', 'Fast Loading', 'CMS Integration', 'Custom Animations'],
    technologies: ['React', 'Next.js', 'Tailwind CSS', 'TypeScript'],
    pricing: 'Starts at ₹25,000',
    delivery_time: '1-2 Weeks',
    button_text: 'Get Started',
    button_link: '/contact',
    color: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-500/10',
    is_featured: true,
    is_active: true,
    display_order: 1,
    seo_title: 'Custom Website Development Services',
    seo_description: 'Professional website design and development solutions.',
  },
  {
    id: '2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: 'Web Applications',
    slug: 'web-applications',
    category: 'Development',
    icon: '⚡',
    image_url: null,
    short_description: 'Scalable, secure web apps built with modern frameworks and cloud-native architecture.',
    full_description: 'Enterprise web application development with real-time analytics, user authentication, and API integrations.',
    features: ['React / Next.js', 'Real-time Features', 'API Integration', 'Authentication', 'Dashboard & Analytics'],
    technologies: ['React', 'Next.js', 'Node.js', 'PostgreSQL'],
    pricing: 'Starts at ₹45,000',
    delivery_time: '2-4 Weeks',
    button_text: 'Get Started',
    button_link: '/contact',
    color: 'from-violet-500 to-purple-500',
    bg: 'bg-violet-500/10',
    is_featured: true,
    is_active: true,
    display_order: 2,
    seo_title: null,
    seo_description: null,
  },
  {
    id: '3',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: 'Mobile App Development',
    slug: 'mobile-apps',
    category: 'Mobile',
    icon: '📱',
    image_url: null,
    short_description: 'Cross-platform and native mobile apps for iOS & Android that users love.',
    full_description: 'High performance iOS & Android mobile app development with push notifications and cloud backend.',
    features: ['Flutter & React Native', 'Push Notifications', 'Offline Support', 'App Store Publishing', 'Performance Optimized'],
    technologies: ['Flutter', 'React Native', 'Firebase', 'iOS', 'Android'],
    pricing: 'Starts at ₹50,000',
    delivery_time: '3-6 Weeks',
    button_text: 'Get Started',
    button_link: '/contact',
    color: 'from-pink-500 to-rose-500',
    bg: 'bg-pink-500/10',
    is_featured: true,
    is_active: true,
    display_order: 3,
    seo_title: null,
    seo_description: null,
  },
  {
    id: '4',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: 'UI/UX Design',
    slug: 'ui-ux-design',
    category: 'Design',
    icon: '🎨',
    image_url: null,
    short_description: 'Beautiful, intuitive interfaces designed to delight users and drive conversions.',
    full_description: 'User-centric UI/UX design, wireframing, interactive prototyping, and design systems.',
    features: ['User Research', 'Wireframing', 'Prototyping', 'Design Systems', 'Usability Testing'],
    technologies: ['Figma', 'Adobe XD', 'Prototyping'],
    pricing: 'Starts at ₹20,000',
    delivery_time: '1 Week',
    button_text: 'Get Started',
    button_link: '/contact',
    color: 'from-orange-500 to-amber-500',
    bg: 'bg-orange-500/10',
    is_featured: true,
    is_active: true,
    display_order: 4,
    seo_title: null,
    seo_description: null,
  },
  {
    id: '5',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: 'Ecommerce Development',
    slug: 'ecommerce-development',
    category: 'Ecommerce',
    icon: '🛒',
    image_url: null,
    short_description: 'Full-featured online stores that drive sales with seamless shopping experiences.',
    full_description: 'Custom e-commerce platforms with multi-currency payment gateways and inventory tracking.',
    features: ['Shopify / WooCommerce', 'Payment Gateways', 'Inventory Management', 'Order Tracking', 'Multi-currency'],
    technologies: ['Shopify', 'Next.js Commerce', 'Stripe', 'Razorpay'],
    pricing: 'Starts at ₹35,000',
    delivery_time: '2 Weeks',
    button_text: 'Get Started',
    button_link: '/contact',
    color: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-500/10',
    is_featured: true,
    is_active: true,
    display_order: 5,
    seo_title: null,
    seo_description: null,
  },
  {
    id: '6',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: 'AI Solutions',
    slug: 'ai-solutions',
    category: 'AI',
    icon: '🤖',
    image_url: null,
    short_description: 'Intelligent automation and AI-powered features that give your business a competitive edge.',
    full_description: 'Custom LLM integrations, AI chatbots, computer vision, and predictive analytics engines.',
    features: ['LLM Integration', 'Chatbots', 'Computer Vision', 'Predictive Analytics', 'NLP'],
    technologies: ['Python', 'OpenAI', 'TensorFlow', 'FastAPI'],
    pricing: 'Starts at ₹60,000',
    delivery_time: '3-5 Weeks',
    button_text: 'Get Started',
    button_link: '/contact',
    color: 'from-cyan-500 to-blue-500',
    bg: 'bg-cyan-500/10',
    is_featured: true,
    is_active: true,
    display_order: 6,
    seo_title: null,
    seo_description: null,
  },
];

const INITIAL_PORTFOLIO: DbPortfolio[] = [
  {
    id: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: 'FinTrack Pro',
    slug: 'fintrack-pro',
    category: 'Web',
    client_name: 'FinTrack Inc.',
    image_url: null,
    short_description: 'A comprehensive financial management dashboard with real-time analytics and portfolio tracking.',
    full_description: 'Built a real-time dashboard with WebSocket data feeds, AI insights, and automated reporting.',
    technologies: ['Next.js', 'TypeScript', 'PostgreSQL', 'FastAPI'],
    features: ['300% faster reporting', '45% reduced operational costs', '10,000+ active users'],
    demo_url: 'https://fintrack.demo.com',
    github_url: null,
    case_study: null,
    completion_date: '2025-01',
    is_featured: true,
    is_active: true,
    display_order: 1,
  },
  {
    id: '2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: 'MediCare Mobile',
    slug: 'medicare-mobile',
    category: 'Mobile',
    client_name: 'MediCare Health',
    image_url: null,
    short_description: 'A telemedicine platform enabling patients to consult doctors via video and track health metrics.',
    full_description: 'Developed a cross-platform app with HD video consultations and offline-capable health tracking.',
    technologies: ['Flutter', 'Firebase', 'Node.js', 'WebRTC'],
    features: ['50,000+ downloads', '4.8 App Store rating', '98% patient satisfaction'],
    demo_url: 'https://medicare.demo.com',
    github_url: null,
    case_study: null,
    completion_date: '2024-12',
    is_featured: true,
    is_active: true,
    display_order: 2,
  },
  {
    id: '3',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: 'ShopSmart AI',
    slug: 'shopsmart-ai',
    category: 'Ecommerce',
    client_name: 'ShopSmart Retail',
    image_url: null,
    short_description: 'AI-powered ecommerce platform with personalized product recommendations and dynamic pricing.',
    full_description: 'Implemented ML-based recommendation engine and AI-driven personalization.',
    technologies: ['React', 'Python', 'TensorFlow', 'AWS'],
    features: ['62% increase in conversions', '38% reduction in cart abandonment', '$2M additional revenue'],
    demo_url: 'https://shopsmart.demo.com',
    github_url: null,
    case_study: null,
    completion_date: '2024-11',
    is_featured: true,
    is_active: true,
    display_order: 3,
  },
];

const INITIAL_TESTIMONIALS: DbTestimonial[] = [
  {
    id: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    client_name: 'Sarah Mitchell',
    company: 'FinTrack Pro',
    position: 'CEO',
    image_url: null,
    review: 'TERVOM delivered beyond our expectations. The platform completely transformed how we manage portfolios. Their team was professional, communicative, and technically brilliant throughout.',
    rating: 5,
    project: 'Financial Dashboard',
    is_featured: true,
    is_active: true,
    display_order: 1,
  },
  {
    id: '2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    client_name: 'Dr. James Chen',
    company: 'MediCare Health',
    position: 'CTO',
    image_url: null,
    review: 'The telemedicine app TERVOM built has genuinely improved healthcare access for thousands of patients. The quality of the code and the user experience were exceptional.',
    rating: 5,
    project: 'Telemedicine Platform',
    is_featured: true,
    is_active: true,
    display_order: 2,
  },
  {
    id: '3',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    client_name: 'Maria Rodriguez',
    company: 'ShopSmart Retail',
    position: 'Head of Digital',
    image_url: null,
    review: 'The AI-powered recommendation engine increased our conversion rate by 62%. TERVOM\'s deep understanding of ecommerce and AI made this project a massive success.',
    rating: 5,
    project: 'AI Ecommerce Platform',
    is_featured: true,
    is_active: true,
    display_order: 3,
  },
];

const INITIAL_BLOGS: DbBlog[] = [
  {
    id: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: 'The Future of AI in Web Development: What to Expect in 2025',
    slug: 'future-of-ai-in-web-development',
    author: 'Alex Rivera',
    category: 'AI',
    image_url: null,
    short_description: 'Explore how artificial intelligence is reshaping web development, from AI coding to dynamic UI generation.',
    content: '<p>Artificial Intelligence is rapidly revolutionizing web engineering...</p>',
    tags: ['AI', 'Web Development', 'Future Tech'],
    reading_time: 8,
    seo_title: 'Future of AI in Web Development 2025',
    seo_description: 'Explore how AI is reshaping modern web development.',
    status: 'published',
    published_at: new Date().toISOString(),
  },
  {
    id: '2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: 'Next.js 15 Performance Optimization: A Complete Guide',
    slug: 'nextjs-performance-optimization',
    author: 'Priya Sharma',
    category: 'React',
    image_url: null,
    short_description: 'Learn advanced techniques to optimize your Next.js application for maximum performance.',
    content: '<p>Next.js 15 introduces powerful Server Components and caching optimization...</p>',
    tags: ['Next.js', 'Performance', 'React'],
    reading_time: 12,
    seo_title: 'Next.js 15 Performance Guide',
    seo_description: 'Learn performance optimization for Next.js apps.',
    status: 'published',
    published_at: new Date().toISOString(),
  },
];

function notifyChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('tervom_db_updated'));
  }
}

function getItem<T>(key: string, initial: T[]): T[] {
  if (typeof window === 'undefined') return initial;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return initial;
  }
}

function setItem<T>(key: string, data: T[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
    notifyChange();
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }
}

export const db = {
  // ── Blogs ──
  getBlogs: async (): Promise<DbBlog[]> => getItem<DbBlog>(STORAGE_KEYS.BLOGS, INITIAL_BLOGS),
  getBlogById: async (id: string): Promise<DbBlog | null> => {
    const list = await db.getBlogs();
    return list.find((b) => b.id === id) || null;
  },
  saveBlog: async (blog: Partial<DbBlog> & { id?: string }): Promise<DbBlog> => {
    const list = await db.getBlogs();
    const now = new Date().toISOString();
    let saved: DbBlog;
    if (blog.id) {
      const idx = list.findIndex((b) => b.id === blog.id);
      saved = {
        ...(list[idx] || {}),
        ...blog,
        updated_at: now,
      } as DbBlog;
      if (idx >= 0) list[idx] = saved;
      else list.unshift(saved);
    } else {
      saved = {
        id: Date.now().toString(),
        created_at: now,
        updated_at: now,
        title: blog.title || '',
        slug: blog.slug || '',
        author: blog.author || 'Admin',
        category: blog.category || null,
        image_url: blog.image_url || null,
        short_description: blog.short_description || '',
        content: blog.content || '',
        tags: blog.tags || [],
        reading_time: blog.reading_time || 5,
        seo_title: blog.seo_title || null,
        seo_description: blog.seo_description || null,
        status: blog.status || 'published',
        published_at: blog.status === 'published' ? now : null,
      };
      list.unshift(saved);
    }
    setItem(STORAGE_KEYS.BLOGS, list);
    return saved;
  },
  deleteBlog: async (id: string): Promise<boolean> => {
    const list = await db.getBlogs();
    const filtered = list.filter((b) => b.id !== id);
    setItem(STORAGE_KEYS.BLOGS, filtered);
    return true;
  },

  // ── Services ──
  getServices: async (): Promise<DbService[]> => getItem<DbService>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES),
  getServiceById: async (id: string): Promise<DbService | null> => {
    const list = await db.getServices();
    return list.find((s) => s.id === id) || null;
  },
  saveService: async (service: Partial<DbService> & { id?: string }): Promise<DbService> => {
    const list = await db.getServices();
    const now = new Date().toISOString();
    let saved: DbService;
    if (service.id) {
      const idx = list.findIndex((s) => s.id === service.id);
      saved = {
        ...(list[idx] || {}),
        ...service,
        updated_at: now,
      } as DbService;
      if (idx >= 0) list[idx] = saved;
      else list.unshift(saved);
    } else {
      saved = {
        id: Date.now().toString(),
        created_at: now,
        updated_at: now,
        name: service.name || '',
        slug: service.slug || '',
        category: service.category || null,
        icon: service.icon || null,
        image_url: service.image_url || null,
        short_description: service.short_description || '',
        full_description: service.full_description || null,
        features: service.features || [],
        technologies: service.technologies || [],
        pricing: service.pricing || null,
        delivery_time: service.delivery_time || null,
        button_text: service.button_text || 'Get Started',
        button_link: service.button_link || '/contact',
        color: service.color || 'from-blue-500 to-cyan-500',
        bg: service.bg || 'bg-blue-500/10',
        is_featured: service.is_featured ?? true,
        is_active: service.is_active ?? true,
        display_order: service.display_order || list.length + 1,
        seo_title: service.seo_title || null,
        seo_description: service.seo_description || null,
      };
      list.unshift(saved);
    }
    setItem(STORAGE_KEYS.SERVICES, list);
    return saved;
  },
  deleteService: async (id: string): Promise<boolean> => {
    const list = await db.getServices();
    const filtered = list.filter((s) => s.id !== id);
    setItem(STORAGE_KEYS.SERVICES, filtered);
    return true;
  },

  // ── Portfolio ──
  getPortfolio: async (): Promise<DbPortfolio[]> => getItem<DbPortfolio>(STORAGE_KEYS.PORTFOLIO, INITIAL_PORTFOLIO),
  getPortfolioById: async (id: string): Promise<DbPortfolio | null> => {
    const list = await db.getPortfolio();
    return list.find((p) => p.id === id) || null;
  },
  savePortfolio: async (item: Partial<DbPortfolio> & { id?: string }): Promise<DbPortfolio> => {
    const list = await db.getPortfolio();
    const now = new Date().toISOString();
    let saved: DbPortfolio;
    if (item.id) {
      const idx = list.findIndex((p) => p.id === item.id);
      saved = {
        ...(list[idx] || {}),
        ...item,
        updated_at: now,
      } as DbPortfolio;
      if (idx >= 0) list[idx] = saved;
      else list.unshift(saved);
    } else {
      saved = {
        id: Date.now().toString(),
        created_at: now,
        updated_at: now,
        title: item.title || '',
        slug: item.slug || '',
        category: item.category || 'Web',
        client_name: item.client_name || null,
        image_url: item.image_url || null,
        short_description: item.short_description || '',
        full_description: item.full_description || null,
        technologies: item.technologies || [],
        features: item.features || [],
        demo_url: item.demo_url || null,
        github_url: item.github_url || null,
        case_study: item.case_study || null,
        completion_date: item.completion_date || null,
        is_featured: item.is_featured ?? true,
        is_active: item.is_active ?? true,
        display_order: item.display_order || list.length + 1,
      };
      list.unshift(saved);
    }
    setItem(STORAGE_KEYS.PORTFOLIO, list);
    return saved;
  },
  deletePortfolio: async (id: string): Promise<boolean> => {
    const list = await db.getPortfolio();
    const filtered = list.filter((p) => p.id !== id);
    setItem(STORAGE_KEYS.PORTFOLIO, filtered);
    return true;
  },

  // ── Testimonials ──
  getTestimonials: async (): Promise<DbTestimonial[]> => getItem<DbTestimonial>(STORAGE_KEYS.TESTIMONIALS, INITIAL_TESTIMONIALS),
  getTestimonialById: async (id: string): Promise<DbTestimonial | null> => {
    const list = await db.getTestimonials();
    return list.find((t) => t.id === id) || null;
  },
  saveTestimonial: async (item: Partial<DbTestimonial> & { id?: string }): Promise<DbTestimonial> => {
    const list = await db.getTestimonials();
    const now = new Date().toISOString();
    let saved: DbTestimonial;
    if (item.id) {
      const idx = list.findIndex((t) => t.id === item.id);
      saved = {
        ...(list[idx] || {}),
        ...item,
        updated_at: now,
      } as DbTestimonial;
      if (idx >= 0) list[idx] = saved;
      else list.unshift(saved);
    } else {
      saved = {
        id: Date.now().toString(),
        created_at: now,
        updated_at: now,
        client_name: item.client_name || '',
        company: item.company || '',
        position: item.position || '',
        image_url: item.image_url || null,
        review: item.review || '',
        rating: item.rating || 5,
        project: item.project || null,
        is_featured: item.is_featured ?? true,
        is_active: item.is_active ?? true,
        display_order: item.display_order || list.length + 1,
      };
      list.unshift(saved);
    }
    setItem(STORAGE_KEYS.TESTIMONIALS, list);
    return saved;
  },
  deleteTestimonial: async (id: string): Promise<boolean> => {
    const list = await db.getTestimonials();
    const filtered = list.filter((t) => t.id !== id);
    setItem(STORAGE_KEYS.TESTIMONIALS, filtered);
    return true;
  },

  // ── Contact Messages ──
  getMessages: async (): Promise<DbContactMessage[]> => getItem<DbContactMessage>(STORAGE_KEYS.MESSAGES, []),
  saveMessage: async (msg: Omit<DbContactMessage, 'id' | 'created_at' | 'is_read' | 'replied_at'>): Promise<DbContactMessage> => {
    const list = await db.getMessages();
    const newMsg: DbContactMessage = {
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      ...msg,
      is_read: false,
      replied_at: null,
    };
    list.unshift(newMsg);
    setItem(STORAGE_KEYS.MESSAGES, list);
    return newMsg;
  },
  markMessageRead: async (id: string, is_read: boolean): Promise<boolean> => {
    const list = await db.getMessages();
    const idx = list.findIndex((m) => m.id === id);
    if (idx >= 0) {
      list[idx].is_read = is_read;
      setItem(STORAGE_KEYS.MESSAGES, list);
    }
    return true;
  },
  deleteMessage: async (id: string): Promise<boolean> => {
    const list = await db.getMessages();
    const filtered = list.filter((m) => m.id !== id);
    setItem(STORAGE_KEYS.MESSAGES, filtered);
    return true;
  },

  // ── Settings ──
  getSettings: async (): Promise<DbSetting[]> => getItem<DbSetting>(STORAGE_KEYS.SETTINGS, []),
  saveSetting: async (key: string, value: any): Promise<DbSetting> => {
    const list = await db.getSettings();
    const now = new Date().toISOString();
    const idx = list.findIndex((s) => s.key === key);
    let setting: DbSetting;
    if (idx >= 0) {
      setting = { ...list[idx], value, updated_at: now };
      list[idx] = setting;
    } else {
      setting = { id: Date.now().toString(), key, value, updated_at: now };
      list.push(setting);
    }
    setItem(STORAGE_KEYS.SETTINGS, list);
    return setting;
  },

  // ── Newsletter Subscribers ──
  getSubscribers: async (): Promise<string[]> => getItem<string>(STORAGE_KEYS.SUBSCRIBERS, []),
  addSubscriber: async (email: string): Promise<boolean> => {
    const list = await db.getSubscribers();
    if (!list.includes(email.toLowerCase())) {
      list.push(email.toLowerCase());
      setItem(STORAGE_KEYS.SUBSCRIBERS, list);
    }
    return true;
  },
};
