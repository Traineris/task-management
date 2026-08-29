export type UserRole = 'USER' | 'ADMIN';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'HIGHEST';
export type IssueType = 'STORY' | 'TASK' | 'BUG' | 'EPIC';
export type SprintStatus = 'PLANNED' | 'ACTIVE' | 'COMPLETED';
export type NotificationType = 'ASSIGNMENT' | 'COMMENT' | 'STATUS_CHANGE' | 'SYSTEM';

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  jobTitle?: string;
  role: UserRole;
  authProvider: 'local' | 'google';
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  _id: string;
  name: string;
  key: string;
  description?: string;
  leadId: User;
  members: User[];
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  _id: string;
  projectId: string | Project;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  issueType: IssueType;
  storyPoints?: number;
  sprintId?: string | Sprint;
  parentTaskId?: string | Task;
  assigneeId?: User;
  reporterId: User;
  position: number;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Sprint {
  _id: string;
  projectId: string;
  name: string;
  startDate?: string;
  endDate?: string;
  goal?: string;
  status: SprintStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  taskId: string;
  userId: User;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  _id: string;
  taskId: string;
  userId: User;
  action: string;
  details: string;
  createdAt: string;
}

export interface Attachment {
  _id: string;
  taskId: string;
  uploadedBy: User;
  filename: string;
  url: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
}

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface ProjectAnalytics {
  overview: {
    totalTasks: number;
    todoTasks: number;
    inProgressTasks: number;
    completedTasks: number;
    completionRate: number;
    totalMembers: number;
  };
  statusDistribution: Record<TaskStatus, number>;
  priorityDistribution: Record<TaskPriority, number>;
  issueTypeDistribution: Record<IssueType, number>;
  activeSprint: {
    id: string;
    name: string;
    startDate?: string;
    endDate?: string;
    goal?: string;
    totalTasks: number;
    completedTasks: number;
    totalStoryPoints: number;
    completionRate: number;
  } | null;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  debugOtpCode?: string;
}
