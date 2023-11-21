type TaskStatus = 'OPEN' | 'IN_PROGRESS' | 'DONE';
export type sortBy = 'Recently Added' | 'Start Date' | 'End Date' | 'Urgent';

export interface ITask {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  urgent: boolean;
  startsAt: Date;
  endsAt: Date | null;
  createdAt: Date;
}

export interface ITaskCreate {
  title: string;
  description: string;
  status: TaskStatus;
  urgent: boolean;
  startsAt: Date | null;
  endsAt: Date | null;
}
