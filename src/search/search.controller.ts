import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SearchService, SearchResult } from './search.service';

@ApiTags('Arama')
@Controller({
  path: 'search',
  version: '1',
})
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Genel arama yap' })
  @ApiQuery({ name: 'q', required: true, description: 'Arama sorgusu' })
  @ApiQuery({
    name: 'type',
    required: false,
    description: 'Arama tipi (club, event, user)',
  })
  search(
    @Query('q') query: string,
    @Query('type') type?: string,
  ): Promise<SearchResult> {
    return this.searchService.search(query, type);
  }

  @Get('clubs')
  @ApiOperation({ summary: 'Kulüplerde ara' })
  searchClubs(@Query('q') query: string) {
    return this.searchService.searchClubs(query);
  }

  @Get('events')
  @ApiOperation({ summary: 'Etkinliklerde ara' })
  searchEvents(@Query('q') query: string) {
    return this.searchService.searchEvents(query);
  }

  @Get('users')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kullanıcılarda ara' })
  searchUsers(@Query('q') query: string) {
    return this.searchService.searchUsers(query);
  }
}
