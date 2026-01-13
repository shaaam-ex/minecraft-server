import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getUserProfile(userId: number) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
      },
    });
    return user;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return false;
  }
}
