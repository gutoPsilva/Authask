type TaskStatus = 'OPEN' | 'IN_PROGRESS' | 'DONE';
export type sortBy = 'Recently Added' | 'Start Date' | 'End Date' | 'Urgent';

export interface ITask {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  urgent: boolean;
  startsAt: Date;
  endsAt: Date;
  createdAt: Date;
}

export interface ITaskInfo {
  title: string;
  description: string;
  status: TaskStatus;
  urgent: boolean;
  startsAt: Date;
  endsAt: Date;
}

export interface ITaskStats {
  totalTasks: number;
  openTasks: number;
  inProgressTasks: number;
  doneTasks: number;
  urgentTasks: number;
}

export interface IFilters {
  "OPEN": boolean,
  "IN_PROGRESS": boolean,
  "DONE": boolean,
}

export interface ISDate {
  startDate: string;
  startHour: string;
}

export interface IEDate {
  endDate: string;
  endHour: string;
}
