import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { protectAdmin } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';
import { loginValidator } from '../validators/authValidators.js';
import { login, logout, getMe } from '../controllers/authController.js';
import { getDashboardStats } from '../controllers/dashboardController.js';
import {
  getAdminSettings,
  updateSettings,
} from '../controllers/settingsController.js';
import {
  getAdminSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
} from '../controllers/skillController.js';
import {
  getAdminExperience,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience,
} from '../controllers/experienceController.js';
import {
  getAdminEducation,
  getEducationById,
  createEducation,
  updateEducation,
  deleteEducation,
} from '../controllers/educationController.js';
import {
  getAdminCertifications,
  getCertificationById,
  createCertification,
  updateCertification,
  deleteCertification,
} from '../controllers/certificationController.js';
import {
  getAdminProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
import {
  getAdminServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from '../controllers/serviceController.js';
import {
  getContactMessages,
  getContactMessage,
  updateContactMessage,
  deleteContactMessage,
} from '../controllers/contactController.js';
import {
  getUploadSignature,
  saveUploadedMedia,
  deleteMediaAsset,
} from '../controllers/mediaController.js';

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts. Please try again later.',
  },
});

router.post('/auth/login', loginLimiter, loginValidator, validateRequest, login);
router.post('/auth/logout', protectAdmin, logout);
router.get('/auth/me', protectAdmin, getMe);

router.use(protectAdmin);

router.get('/dashboard', getDashboardStats);

router.get('/settings', getAdminSettings);
router.put('/settings', updateSettings);

router.get('/skills', getAdminSkills);
router.get('/skills/:id', getSkillById);
router.post('/skills', createSkill);
router.put('/skills/:id', updateSkill);
router.delete('/skills/:id', deleteSkill);

router.get('/experience', getAdminExperience);
router.get('/experience/:id', getExperienceById);
router.post('/experience', createExperience);
router.put('/experience/:id', updateExperience);
router.delete('/experience/:id', deleteExperience);

router.get('/education', getAdminEducation);
router.get('/education/:id', getEducationById);
router.post('/education', createEducation);
router.put('/education/:id', updateEducation);
router.delete('/education/:id', deleteEducation);

router.get('/certifications', getAdminCertifications);
router.get('/certifications/:id', getCertificationById);
router.post('/certifications', createCertification);
router.put('/certifications/:id', updateCertification);
router.delete('/certifications/:id', deleteCertification);

router.get('/projects', getAdminProjects);
router.get('/projects/:id', getProjectById);
router.post('/projects', createProject);
router.put('/projects/:id', updateProject);
router.delete('/projects/:id', deleteProject);

router.get('/services', getAdminServices);
router.get('/services/:id', getServiceById);
router.post('/services', createService);
router.put('/services/:id', updateService);
router.delete('/services/:id', deleteService);

router.get('/messages', getContactMessages);
router.get('/messages/:id', getContactMessage);
router.patch('/messages/:id', updateContactMessage);
router.delete('/messages/:id', deleteContactMessage);

router.get('/media/signature', getUploadSignature);
router.post('/media/save', saveUploadedMedia);
router.delete('/media', deleteMediaAsset);

export default router;
