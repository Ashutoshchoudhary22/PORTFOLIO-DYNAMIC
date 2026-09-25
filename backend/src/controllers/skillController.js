import { Skill } from '../models/Skill.js';
import { createCrudController } from './crudFactory.js';
import { successResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const crud = createCrudController(Skill, {
  notFoundMessage: 'Skill not found',
  createMessage: 'Skill created successfully',
  updateMessage: 'Skill updated successfully',
  deleteMessage: 'Skill deleted successfully',
});

export const getPublicSkills = asyncHandler(async (_req, res) => {
  const skills = await Skill.find({ isActive: true }).sort({
    category: 1,
    sortOrder: 1,
  });

  const grouped = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});

  const categories = Object.entries(grouped).map(([category, items]) => ({
    category,
    skills: items,
  }));

  return successResponse(res, categories);
});

export const {
  getAdminList: getAdminSkills,
  getById: getSkillById,
  create: createSkill,
  update: updateSkill,
  remove: deleteSkill,
} = crud;
