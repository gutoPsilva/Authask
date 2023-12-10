import * as bcrypt from 'bcrypt'; // importing only bcrypt was giving a error saying that .genSalt was not a function, so I had to import everything from bcrypt

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10); // async because it's a heavy operation
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (
  raw: string,
  hash: string,
): Promise<boolean> => {
  return bcrypt.compare(raw, hash);
};
