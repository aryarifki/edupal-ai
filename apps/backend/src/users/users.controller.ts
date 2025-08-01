import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found successfully' })
  async getUserById(@Param('id') id: string) {
    return this.usersService.findUserById(id);
  }

  @Get(':id/progress')
  @ApiOperation({ summary: 'Get user learning progress' })
  @ApiResponse({ status: 200, description: 'Progress retrieved successfully' })
  async getUserProgress(@Param('id') id: string) {
    return this.usersService.getUserProgress(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  async updateUser(@Param('id') id: string, @Body() updateData: any) {
    return this.usersService.updateUser(id, updateData);
  }
}
