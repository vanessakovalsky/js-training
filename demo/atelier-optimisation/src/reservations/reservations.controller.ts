// === CONTRÔLEUR DES RÉSERVATIONS ===

import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  /**
   * GET /reservations
   */
  @Get()
  findAll(@Query('clientId') clientId?: string) {
    if (clientId) {
      const reservations = this.reservationsService.findByClient(+clientId);
      return {
        succes: true,
        data: reservations,
        total: reservations.length,
      };
    }

    const reservations = this.reservationsService.findAll();
    return {
      succes: true,
      data: reservations,
      total: reservations.length,
    };
  }

  /**
   * POST /reservations
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createReservationDto: CreateReservationDto) {
    const reservation = await this.reservationsService.create(
      createReservationDto,
    );

    return {
      succes: true,
      message: 'Réservation créée avec succès',
      data: reservation,
    };
  }

  /**
   * DELETE /reservations/:id
   */
  @Delete(':id')
  cancel(@Param('id') id: string) {
    const reservation = this.reservationsService.cancel(+id);

    return {
      succes: true,
      message: 'Réservation annulée et remboursée',
      data: reservation,
    };
  }
}