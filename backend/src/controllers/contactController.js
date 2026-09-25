import { ContactMessage } from '../models/ContactMessage.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const submitContact = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;

  const contactMessage = await ContactMessage.create({
    name,
    email,
    message,
    ipAddress: req.ip,
    userAgent: req.get('user-agent'),
  });

  return successResponse(
    res,
    { id: contactMessage._id },
    'Message sent successfully',
    201
  );
});

export const getContactMessages = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
  const skip = (page - 1) * limit;
  const search = req.query.search?.trim();
  const filter = {};

  if (req.query.isRead === 'true') filter.isRead = true;
  if (req.query.isRead === 'false') filter.isRead = false;
  if (req.query.isReplied === 'true') filter.isReplied = true;
  if (req.query.isReplied === 'false') filter.isReplied = false;

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { message: { $regex: search, $options: 'i' } },
    ];
  }

  const [messages, total] = await Promise.all([
    ContactMessage.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    ContactMessage.countDocuments(filter),
  ]);

  return successResponse(res, {
    messages,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

export const getContactMessage = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findById(req.params.id);

  if (!message) {
    return errorResponse(res, 'Message not found', 404);
  }

  if (!message.isRead) {
    message.isRead = true;
    await message.save();
  }

  return successResponse(res, message);
});

export const updateContactMessage = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findByIdAndUpdate(
    req.params.id,
    {
      ...(req.body.isRead !== undefined && { isRead: req.body.isRead }),
      ...(req.body.isReplied !== undefined && { isReplied: req.body.isReplied }),
    },
    { new: true, runValidators: true }
  );

  if (!message) {
    return errorResponse(res, 'Message not found', 404);
  }

  return successResponse(res, message, 'Message updated successfully');
});

export const deleteContactMessage = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findByIdAndDelete(req.params.id);

  if (!message) {
    return errorResponse(res, 'Message not found', 404);
  }

  return successResponse(res, {}, 'Message deleted successfully');
});
