import {
  IsBoolean,
  IsDate,
  IsIn,
  IsNotEmpty,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { TaskStatus } from 'src/utils/interfaces e types/task.interface';

export class CreateTaskDto {
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsNotEmpty()
  @MaxLength(255)
  description: string;

  @IsNotEmpty()
  @IsIn(['OPEN', 'IN_PROGRESS', 'DONE'])
  status: TaskStatus;

  @IsNotEmpty()
  @IsBoolean()
  urgent: boolean;

  @IsOptional() // it is optional however it will not be null, if startsAt isn't provided, it will be generated automatically at the instant of the registration
  @IsDate()
  startsAt: Date;

  @IsOptional() // it can be null
  @IsDate()
  endsAt: Date;
}
