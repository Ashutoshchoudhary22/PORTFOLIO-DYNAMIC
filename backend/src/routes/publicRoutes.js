import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { getPublicProfile, getPublicSettings, getSocialLinks } from '../controllers/settingsController.js';
import { getPublicSkills } from '../controllers/skillController.js';
import { getPublicExperience } from '../controllers/experienceController.js';
import { getPublicEducation } from '../controllers/educationController.js';
import { getPublicCertifications } from '../controllers/certificationController.js';
import { getPublicProjects, getProjectBySlug } from '../controllers/projectController.js';
import { getPublicServices } from '../controllers/serviceController.js';
import { submitContact } from '../controllers/contactController.js';
import { contactValidator } from '../validators/contactValidators.js';
import { validateRequest } from '../middleware/validate.js';

const router = Router();

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many contact requests. Please try again later.',
  },
});

router.get('/profile', getPublicProfile);
router.get('/settings', getPublicSettings);
router.get('/social-links', getSocialLinks);
router.get('/skills', getPublicSkills);
router.get('/experience', getPublicExperience);
router.get('/education', getPublicEducation);
router.get('/certifications', getPublicCertifications);
router.get('/projects', getPublicProjects);
router.get('/projects/:slug', getProjectBySlug);
router.get('/services', getPublicServices);
router.post('/contact', contactLimiter, contactValidator, validateRequest, submitContact);

export default router;
