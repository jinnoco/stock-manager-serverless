import prisma from "./prisma-client";

export const createUser = async (
  email: string,
  passwordDigest: string,
  token: string,
) => {
  try {
    const newUser = await prisma.users.create({
      data: {
        email: email,
        token: token,
        passwordDigest: passwordDigest,
      },
    });
    return { data: newUser, error: null };
  } catch (error) {
    return { data: null, error: error };
  }
};

export const getUser = async (email: string) => {
  try {
    const user = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });
    return { data: user, error: null };
  } catch (error) {
    return { data: null, error: error };
  }
};
