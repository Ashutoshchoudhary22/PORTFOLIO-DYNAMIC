import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDatabase } from '../config/database.js';
import { Admin } from '../models/Admin.js';
import { SiteSettings } from '../models/SiteSettings.js';
import { Skill } from '../models/Skill.js';
import { Experience } from '../models/Experience.js';
import { Education } from '../models/Education.js';
import { Certification } from '../models/Certification.js';
import { Project } from '../models/Project.js';
import { Service } from '../models/Service.js';

const skillData = [
  { category: 'Languages', name: 'JavaScript', description: 'Core programming language for web development.', iconType: 'code', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', bgColor: '#F7DF1E', sortOrder: 0 },
  { category: 'Languages', name: 'TypeScript', description: 'Typed superset of JavaScript for scalable applications.', iconType: 'filecode', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', bgColor: '#3178C6', sortOrder: 1 },
  { category: 'Frontend', name: 'React.js', description: 'JavaScript library for building user interfaces.', iconType: 'zap', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', bgColor: '#20232A', sortOrder: 0 },
  { category: 'Frontend', name: 'Next.js', description: 'React framework for server-side rendering and static sites.', iconType: 'globe', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg', bgColor: '#000000', sortOrder: 1 },
  { category: 'Frontend', name: 'HTML5', description: 'Markup language for structuring web content.', iconType: 'filecode', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg', bgColor: '#E34F26', sortOrder: 2 },
  { category: 'Frontend', name: 'CSS3', description: 'Stylesheet language for designing and laying out web pages.', iconType: 'layers', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg', bgColor: '#1572B6', sortOrder: 3 },
  { category: 'Frontend', name: 'Tailwind CSS', description: 'Utility-first CSS framework for responsive interfaces.', iconType: 'layers', sortOrder: 4 },
  { category: 'Frontend', name: 'Vite', description: 'Next-generation frontend build tool.', iconType: 'zap', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg', bgColor: '#646CFF', sortOrder: 5 },
  { category: 'Backend', name: 'Node.js', description: 'JavaScript runtime for server-side development.', iconType: 'server', iconUrl: '/png-icons/node-js.png', bgColor: '#339933', sortOrder: 0 },
  { category: 'Backend', name: 'Express.js', description: 'Minimalist Node.js framework for building APIs.', iconType: 'server', iconUrl: 'https://ajeetchaulagain.com/static/7cb4af597964b0911fe71cb2f8148d64/8d565/express-js.webp', bgColor: '#000000', sortOrder: 1 },
  { category: 'Backend', name: 'MongoDB', description: 'NoSQL database for flexible, unstructured data storage.', iconType: 'database', iconUrl: '/png-icons/mongo-db2.png', bgColor: '#47A248', sortOrder: 2 },
  { category: 'Backend', name: 'MySQL', description: 'Relational database management system for structured data.', iconType: 'database', iconUrl: '/png-icons/my-sql.png', bgColor: '#4479A1', sortOrder: 3 },
  { category: 'Backend', name: 'PostgreSQL', description: 'Advanced open-source relational database.', iconType: 'database', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg', bgColor: '#336791', sortOrder: 4 },
  { category: 'Backend', name: 'Cron Jobs', description: 'Scheduled backend tasks for recurring automation.', iconType: 'settings', sortOrder: 5 },
  { category: 'DevOps & Cloud', name: 'AWS (CI/CD)', description: 'Cloud platform with continuous integration and deployment.', iconType: 'cloud', iconUrl: '/png-icons/Awss.png', bgColor: '#FF9900', sortOrder: 0 },
  { category: 'DevOps & Cloud', name: 'Git', description: 'Version control system for tracking code changes.', iconType: 'gitbranch', iconUrl: '/png-icons/git.png', bgColor: '#F05032', sortOrder: 1 },
  { category: 'DevOps & Cloud', name: 'GitHub', description: 'Code hosting platform for version control and collaboration.', iconType: 'gitbranch', iconUrl: '/png-icons/github.png', bgColor: '#181717', sortOrder: 2 },
  { category: 'DevOps & Cloud', name: 'Docker', description: 'Containerization platform for application deployment.', iconType: 'package', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', bgColor: '#2496ED', sortOrder: 3 },
  { category: 'DevOps & Cloud', name: 'Nginx', description: 'High-performance web server and reverse proxy.', iconType: 'server', iconUrl: '/png-icons/nginxs.png', bgColor: '#009639', sortOrder: 4 },
  { category: 'DevOps & Cloud', name: 'Vercel', description: 'Platform for deploying frontend applications.', iconType: 'cloud', iconUrl: '/png-icons/vercels.png', bgColor: '#000000', sortOrder: 5 },
  { category: 'DevOps & Cloud', name: 'Hostinger', description: 'Web hosting platform for deploying applications.', iconType: 'cloud', iconUrl: '/png-icons/hostinger.webp', bgColor: '#673DE6', sortOrder: 6 },
  { category: 'State Management', name: 'Redux', description: 'Predictable state container for JavaScript apps.', iconType: 'package', iconUrl: '/png-icons/redux-icon.webp', bgColor: '#764ABC', sortOrder: 0 },
  { category: 'State Management', name: 'Redux RTK Query', description: 'Data fetching and caching library for Redux.', iconType: 'package', iconUrl: '/png-icons/rtk-query2.png', bgColor: '#764ABC', sortOrder: 1 },
  { category: 'State Management', name: 'TanStack Query', description: 'Powerful data synchronization for React.', iconType: 'package', iconUrl: 'https://tanstack.com/favicon.ico', bgColor: '#FF4154', sortOrder: 2 },
];

const experienceData = [
  {
    role: 'Full Stack Developer',
    company: 'Dynaclean Industries Pvt. Limited',
    period: 'Mar 2026 – Present',
    description: 'Built and deployed a company-wide TypeScript MERN CRM used by 250+ active users. Owned REST APIs, JWT authentication, frontend UI, and database schema; automated salary-slip generation from attendance data and managed zero-downtime production releases.',
    sortOrder: 0,
  },
  {
    role: 'MERN Stack Developer',
    company: 'ITSYBIZZ (Powered by Deepnap Softech)',
    period: 'Jul 2025 – Mar 2026',
    description: 'Built a B2B SaaS platform from scratch across client and admin modules. Developed REST APIs, HRM payroll and leave workflows, and role-based access control; optimized MongoDB queries and backend APIs to improve response times.',
    sortOrder: 1,
  },
  {
    role: 'Web Developer',
    company: 'Einfratech Systems India Pvt. Ltd., Bengaluru',
    period: 'Jan 2025 – Jul 2025',
    description: 'Migrated a legacy LMS from PHP to the MERN stack. Developed admin dashboards, REST APIs, and authentication, and re-engineered frontend rendering and API calls to reduce page-load time by up to 75%.',
    sortOrder: 2,
  },
];

const educationData = [
  {
    degree: 'B.Tech – Computer Science Engineering',
    institution: 'Dr. A.P.J. Abdul Kalam Technical University, Lucknow',
    period: '2020 - 2024',
    description: 'CGPA: 6.34',
    sortOrder: 0,
  },
];

const certificationData = [
  { title: 'AWS Cloud Certification', issuer: 'Honeywell Empowerment Program', sortOrder: 0 },
  { title: 'UI/UX Design', issuer: 'NASSCOM Foundation', sortOrder: 1 },
  { title: 'Interview Skills', issuer: 'TCS iON', sortOrder: 2 },
];

const projectData = [
  {
    title: 'ApnaTenant – PG Management Platform',
    slug: 'apna-tenant',
    description: 'MERN-based PG and hostel management platform for tenant onboarding, room allocation, vacancy tracking, automated rent reminders, and real-time occupancy and payment monitoring.',
    tags: ['React.js', 'Node.js', 'MongoDB', 'JWT', 'Express.js'],
    liveUrl: 'https://apnatenant.com/',
    aiHint: 'property management',
    sortOrder: 0,
    media: [{ type: 'image', provider: 'local', publicId: 'apnatenant', secureUrl: '/apnatenant2.com.png', sortOrder: 0 }],
  },
  {
    title: 'ApniShop – Client Transaction Platform',
    slug: 'apni-shop',
    description: 'Client platform for tracking daily transactions and monthly profit in one streamlined MERN dashboard.',
    tags: ['React.js', 'Node.js', 'MongoDB', 'Shop Management'],
    liveUrl: 'https://apnishop.fun/',
    aiHint: 'shop management',
    sortOrder: 1,
    media: [
      { type: 'image', provider: 'local', publicId: 'apnishop2', secureUrl: '/Apnishop.fun2.png', sortOrder: 0 },
      { type: 'image', provider: 'local', publicId: 'apnishop1', secureUrl: '/Apnishop.fun.png', sortOrder: 1 },
    ],
  },
  {
    title: 'Sopas B2B Platform',
    slug: 'sopas-b2b',
    description: 'Subscription-based B2B marketplace connecting vendors and buyers with a searchable catalog, ordering workflow, order tracking, and role-based dashboards.',
    tags: ['React.js', 'Node.js', 'MongoDB', 'TypeScript', 'JWT'],
    liveUrl: 'https://subscription.rtpas.in/',
    aiHint: 'b2b marketplace',
    sortOrder: 2,
    media: [{ type: 'image', provider: 'local', publicId: 'rtpas', secureUrl: '/rtpas.png', sortOrder: 0 }],
  },
  {
    title: 'HRM System',
    slug: 'hrm-system',
    description: 'Enterprise HRM system with employee management, payroll processing, leave management, and role-based access control for streamlined HR operations.',
    tags: ['React.js', 'Node.js', 'MongoDB', 'RBAC', 'Express.js'],
    liveUrl: 'https://hrm.itsybizz.com/',
    aiHint: 'hrm system',
    sortOrder: 3,
    media: [{ type: 'image', provider: 'local', publicId: 'hrm', secureUrl: '/HRM.png', sortOrder: 0 }],
  },
  {
    title: 'JP Minda – Custom Digitization Software',
    slug: 'jp-minda',
    description: 'Enterprise workflow digitization software that replaces paper-based processes with structured digital workflows backed by MySQL.',
    tags: ['React.js', 'Node.js', 'MySQL', 'Enterprise', 'Automation'],
    liveUrl: 'https://digitization.jpmgroup.co.in/',
    aiHint: 'enterprise digitization',
    sortOrder: 4,
    media: [{ type: 'image', provider: 'local', publicId: 'jpminda', secureUrl: '/JPM-MINDA.png', sortOrder: 0 }],
  },
  {
    title: 'Kontrolix – Real-Time PLC Automation Dashboard',
    slug: 'kontrolix',
    description: 'Real-time industrial dashboard displaying machine-wise production counts and efficiency from PLC equipment.',
    tags: ['React.js', 'Real-Time', 'PLC', 'Dashboard', 'Automation'],
    liveUrl: 'https://kontrolixtest.rtpas.in/login',
    aiHint: 'plc automation',
    sortOrder: 5,
    media: [
      { type: 'image', provider: 'local', publicId: 'kontrolix1', secureUrl: '/kontrolix1.png', sortOrder: 0 },
      { type: 'image', provider: 'local', publicId: 'kontrolix2', secureUrl: '/kontrolix2.png', sortOrder: 1 },
    ],
  },
  {
    title: 'Dynaclean CRM',
    slug: 'dynaclean-crm',
    description: 'Company-wide MERN CRM used by 250+ employees, with office-Wi-Fi login controls, attendance-based salary slips, automated absent and half-day rules, and purchase-to-statement reconciliation.',
    tags: ['TypeScript', 'React.js', 'Node.js', 'MongoDB', 'JWT'],
    aiHint: 'enterprise crm',
    sortOrder: 6,
    media: [{ type: 'image', provider: 'local', publicId: 'globe', secureUrl: '/globe.svg', sortOrder: 0 }],
  },
  {
    title: 'Dynaclean Industries Website',
    slug: 'dynaclean-website',
    description: 'Responsive business website presenting Dynaclean Industries\' products, services, and company information.',
    tags: ['React.js', 'Responsive Design', 'Business Website'],
    aiHint: 'company website',
    sortOrder: 7,
    media: [{ type: 'image', provider: 'local', publicId: 'globe2', secureUrl: '/globe.svg', sortOrder: 0 }],
  },
];

const serviceData = [
  {
    title: 'Full Stack Development',
    description: 'End-to-end MERN and TypeScript application development, from responsive React interfaces and REST APIs to database design and authentication.',
    code: 'SV001',
    category: 'Web Development',
    iconType: 'code',
    sortOrder: 0,
    image: { type: 'image', provider: 'local', publicId: 'web-design', secureUrl: '/services/web-design2.jpeg', sortOrder: 0 },
    video: { type: 'video', provider: 'local', publicId: 'feature-3', secureUrl: '/feature-3.mp4', sortOrder: 0 },
  },
  {
    title: 'Mobile App Development',
    description: 'Native and cross-platform mobile applications with React Native and Flutter for iOS and Android.',
    code: 'SV002',
    category: 'Mobile Development',
    iconType: 'custom',
    sortOrder: 1,
    image: { type: 'image', provider: 'local', publicId: 'ui-ux', secureUrl: '/services/UI-UX.png', sortOrder: 0 },
    video: { type: 'video', provider: 'local', publicId: 'feature-2', secureUrl: '/feature-2.mp4', sortOrder: 0 },
  },
  {
    title: 'Cloud Solutions',
    description: 'Production deployment and optimization with AWS CI/CD, Docker, Nginx, Vercel, and Hostinger to deliver dependable, high-performance releases.',
    code: 'SV003',
    category: 'Cloud Services',
    iconType: 'cloud',
    sortOrder: 2,
    image: { type: 'image', provider: 'local', publicId: 'app-design', secureUrl: '/services/App-design2.png', sortOrder: 0 },
    video: { type: 'video', provider: 'local', publicId: 'feature-1', secureUrl: '/feature-1.mp4', sortOrder: 0 },
  },
];

async function seed() {
  await connectDatabase();

  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!';

  const existingAdmin = await Admin.findOne({ email });
  const adminCount = await Admin.countDocuments();

  if (existingAdmin) {
    console.log('Admin already exists, skipping admin creation');
  } else if (adminCount >= 1) {
    console.log('An admin account already exists. Only one admin is allowed.');
  } else {
    await Admin.create({ email, password, name: 'Portfolio Admin' });
    console.log(`Admin created: ${email}`);
  }

  await SiteSettings.deleteMany({});
  await SiteSettings.create({
    profileName: 'Ashutosh Choudhary',
    heroHeading: "Hi, I'm Ashutosh Choudhary",
    heroSubtitle:
      'Full Stack Developer with 1.5+ years of experience building production-grade MERN SaaS platforms, HRM systems, CRM solutions, and enterprise dashboards.',
    aboutText:
      'Full Stack Developer with 1.5+ years of experience building production-grade SaaS platforms, HRM systems, and enterprise dashboards with the MERN stack. I deliver scalable applications end-to-end, from database design and REST APIs to deployment, with a focus on performance, role-based enterprise systems, and reliable user experiences.',
    contactEmail: 'akkychoudhary5468@gmail.com',
    contactSubtitle:
      'Have a project, product, or team opportunity in mind? Send a message or email me at akkychoudhary5468@gmail.com.',
    resume: {
      type: 'image',
      provider: 'local',
      publicId: 'resume',
      secureUrl: '/Ashutosh.Choudhary.Resume.pdf',
    },
    logo: {
      type: 'image',
      provider: 'local',
      publicId: 'logo',
      secureUrl: '/main-logo2.png',
    },
    sectionVideos: [],
    socialLinks: [
      { platform: 'GitHub', url: 'https://github.com/Ashutoshchoudhary22', icon: 'github', sortOrder: 0 },
      { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/ashutosh-choudhary-693b1a264/', icon: 'linkedin', sortOrder: 1 },
    ],
    seo: {
      title: 'Ashutosh Choudhary Portfolio',
      description:
        'Portfolio of Ashutosh Choudhary, a Full Stack Developer specializing in MERN, SaaS, HRM, CRM, and enterprise dashboards.',
    },
  });

  await Promise.all([
    Skill.deleteMany({}).then(() => Skill.insertMany(skillData)),
    Experience.deleteMany({}).then(() => Experience.insertMany(experienceData)),
    Education.deleteMany({}).then(() => Education.insertMany(educationData)),
    Certification.deleteMany({}).then(() => Certification.insertMany(certificationData)),
    Project.deleteMany({}).then(() => Project.insertMany(projectData)),
    Service.deleteMany({}).then(() => Service.insertMany(serviceData)),
  ]);

  console.log('Database seeded successfully');
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error('Seed failed:', error);
  await mongoose.disconnect();
  process.exit(1);
});
