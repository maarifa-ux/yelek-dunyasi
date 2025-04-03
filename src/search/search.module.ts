import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { ClubsModule } from '../clubs/clubs.module';
import { EventsModule } from '../events/events.module';
import { MarketplaceModule } from '../marketplace/marketplace.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [ClubsModule, EventsModule, MarketplaceModule, UsersModule],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
