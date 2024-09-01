import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { TaskStatus } from 'src/utils/interfaces_types/task.interface';
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
  @IsDateString()
  startsAt: Date;

  @IsOptional()
  @IsDateString()
  endsAt: Date;
}
