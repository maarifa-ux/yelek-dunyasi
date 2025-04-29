import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { City } from '../../../cities/entities/city.entity';
import { CitiesSeed } from './cities.seed';

@Module({
  imports: [TypeOrmModule.forFeature([City])],
  providers: [CitiesSeed],
  exports: [CitiesSeed],
})
export class CitiesSeedModule {}
