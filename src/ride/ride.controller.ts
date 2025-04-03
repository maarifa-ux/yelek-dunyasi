import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Delete,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RideService } from './ride.service';
import { CreateRideDto } from './dto/create-ride.dto';
import { Ride } from './entities/ride.entity';
import { RideParticipant } from './entities/ride.entity';
import { RideStatus } from './entities/ride.entity';

@ApiTags('rides')
@Controller('rides')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RideController {
  constructor(private readonly rideService: RideService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new ride' })
  @ApiResponse({
    status: 201,
    description: 'Ride created successfully',
    type: Ride,
  })
  async createRide(
    @Body() createRideDto: CreateRideDto,
    @Request() req,
  ): Promise<Ride> {
    return this.rideService.createRide(createRideDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all rides for the current user' })
  @ApiResponse({ status: 200, description: 'Returns all rides', type: [Ride] })
  async getRides(@Request() req): Promise<Ride[]> {
    return this.rideService.getRides(req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific ride by ID' })
  @ApiResponse({ status: 200, description: 'Returns the ride', type: Ride })
  async getRideById(@Param('id') id: string): Promise<Ride> {
    return this.rideService.getRideById(id);
  }

  @Post(':id/join')
  @ApiOperation({ summary: 'Join a ride' })
  @ApiResponse({
    status: 201,
    description: 'Successfully joined the ride',
    type: RideParticipant,
  })
  async joinRide(
    @Param('id') id: string,
    @Request() req,
  ): Promise<RideParticipant> {
    return this.rideService.joinRide(id, req.user);
  }

  @Delete(':id/leave')
  @ApiOperation({ summary: 'Leave a ride' })
  @ApiResponse({ status: 200, description: 'Successfully left the ride' })
  async leaveRide(@Param('id') id: string, @Request() req): Promise<void> {
    return this.rideService.leaveRide(id, req.user);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update ride status' })
  @ApiResponse({
    status: 200,
    description: 'Status updated successfully',
    type: Ride,
  })
  async updateRideStatus(
    @Param('id') id: string,
    @Body('status') status: RideStatus,
  ): Promise<Ride> {
    return this.rideService.updateRideStatus(id, status);
  }
}
