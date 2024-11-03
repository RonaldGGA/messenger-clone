import bcrypt from "bcryptjs";

export const hashedPassword = async (
  password: string,
  salt: number = 10
): Promise<string> => {
  const genSalt = await bcrypt.genSalt(salt);
  const hashNewPassword = await bcrypt.hash(password, genSalt);
  return hashNewPassword;
};
