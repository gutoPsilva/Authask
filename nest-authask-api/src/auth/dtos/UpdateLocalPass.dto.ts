import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class UpdateLocalPassDto {
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @MinLength(8) // doesn't need max length because it will be hashed anyway to a varchar(60)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_?.])[A-Za-z\d!@#$%^&*_?.]*$/,
    {
      message: `Password must contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character (ONLY !@#$%^&*_?.)`,
    },
  )
  newPassword: string;
}
