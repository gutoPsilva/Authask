export type TaskStatus = 'OPEN' | 'IN_PROGRESS' | 'DONE';

export interface ICreateTaskDetails {
  title: string;
  description: string;
  status: TaskStatus;
  urgent: boolean;
  startsAt?: Date; // optional but not null in DB
  endsAt?: Date; // optional
  // createdAt is generated automatically when registering the task
}

export interface IUpdateTaskDetails {
  title?: string;
  description?: string;
  status?: TaskStatus;
  urgent?: boolean;
  startsAt?: Date;
  endsAt?: Date;
}

export interface ITaskInfo {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  urgent: boolean;
  startsAt: Date;
  endsAt?: Date;
}
