import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: any) {
    return this.prisma.user.create({ data });
  }

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({ 
      where: { email },
      include: {
        studentProfile: true,
        teacherProfile: true,
      }
    });
  }

  async findUserById(id: string) {
    return this.prisma.user.findUnique({ 
      where: { id },
      include: {
        studentProfile: true,
        teacherProfile: true,
      }
    });
  }

  async updateUser(id: string, data: any) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async getUserProgress(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: {
          include: {
            progress: true,
          }
        }
      }
    });

    return user?.studentProfile?.progress || [];
  }
}
