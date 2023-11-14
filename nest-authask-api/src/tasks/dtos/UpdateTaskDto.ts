import {
  IsBoolean,
  IsDate,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { TaskStatus } from 'src/utils/interfaces e types/task.interface';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description: string;

  @IsOptional()
  @IsIn(['OPEN', 'IN_PROGRESS', 'DONE'])
  status: TaskStatus;

  @IsOptional()
  @IsBoolean()
  urgent: boolean;

  @IsOptional()
  @IsDate()
  startsAt: Date;

  @IsOptional()
  @IsDate()
  endsAt: Date;
}
