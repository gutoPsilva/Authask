import {
  IsEmail,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
export class RegisterLocalUserDto {
  @IsNotEmpty()
  @MaxLength(255) // max length of varchar in MySQL
  username: string;

  @IsNotEmpty()
  @MinLength(8) // doesn't need max length because it will be hashed anyway to a varchar(60)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_?.])[A-Za-z\d!@#$%^&*_?.]*$/,
    {
      message: `Password must contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character (ONLY !@#$%^&*_?.)`,
    },
  )
  password: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255) // max length of varchar in MySQL
  email: string;
}
