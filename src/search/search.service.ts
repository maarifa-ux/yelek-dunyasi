import { Injectable } from '@nestjs/common';
import { ClubsService } from '../clubs/clubs.service';
import { EventsService } from '../events/events.service';
import { UsersService } from '../users/users.service';
import { Club } from '../clubs/entities/club.entity';
import { Event } from '../events/entities/event.entity';
import { User } from '../users/entities/user.entity';

export interface SearchResult {
  clubs?: Club[];
  events?: Event[];
  users?: User[];
}

@Injectable()
export class SearchService {
  constructor(
    private readonly clubsService: ClubsService,
    private readonly eventsService: EventsService,
    private readonly usersService: UsersService,
  ) {}

  async search(query: string, type?: string): Promise<SearchResult> {
    const results: SearchResult = {};

    switch (type?.toLowerCase()) {
      case 'club':
        results.clubs = await this.searchClubs(query);
        break;
      case 'event':
        results.events = await this.searchEvents(query);
        break;
      case 'user':
        results.users = await this.searchUsers(query);
        break;
      default:
        // Eğer tip belirtilmediyse, tüm kategorilerde ara
        results.clubs = await this.searchClubs(query);
        results.events = await this.searchEvents(query);
        results.users = await this.searchUsers(query);
    }

    return results;
  }

  async searchClubs(query: string) {
    return this.clubsService.findAll(query);
  }

  async searchEvents(query: string) {
    return this.eventsService.findAll(
      undefined,
      undefined,
      undefined,
      undefined,
      query,
    );
  }

  async searchUsers(query: string) {
    return this.usersService.findManyWithPagination({
      filterOptions: { search: query },
      paginationOptions: { page: 1, limit: 10 },
    });
  }
}
