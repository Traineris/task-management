import * as notificationRepository from '../repositories/notificationRepository';
import { CustomError } from '../utils/customError';
import { StatusCodes } from 'http-status-codes';

export const getNotifications = async (userId: string) => {
  const notifications = await notificationRepository.findNotificationsByUserId(userId);
  const unreadCount = await notificationRepository.countUnreadNotifications(userId);
  return {
    unreadCount,
    notifications,
  };
};

export const markNotificationAsRead = async (id: string, userId: string) => {
  const notification = await notificationRepository.markAsRead(id, userId);
  if (!notification) {
    throw new CustomError('Notifikasi tidak ditemukan', StatusCodes.NOT_FOUND);
  }
  return notification;
};

export const markAllNotificationsAsRead = async (userId: string) => {
  await notificationRepository.markAllAsRead(userId);
  return { message: 'Semua notifikasi telah ditandai sebagai dibaca' };
};
