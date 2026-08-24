import { NotificationModel, INotification, NotificationType } from '../models/notificationModel';

export const findNotificationsByUserId = async (userId: string): Promise<INotification[]> => {
  return NotificationModel.find({ userId }).sort({ createdAt: -1 }).limit(50);
};

export const countUnreadNotifications = async (userId: string): Promise<number> => {
  return NotificationModel.countDocuments({ userId, isRead: false });
};

export const createNotification = async (data: {
  userId: string;
  title: string;
  message: string;
  type?: NotificationType;
  link?: string;
}): Promise<INotification> => {
  return NotificationModel.create(data);
};

export const markAsRead = async (id: string, userId: string): Promise<INotification | null> => {
  return NotificationModel.findOneAndUpdate({ _id: id, userId }, { isRead: true }, { new: true });
};

export const markAllAsRead = async (userId: string): Promise<void> => {
  await NotificationModel.updateMany({ userId, isRead: false }, { isRead: true });
};
