import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from './entities/city.entity';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
  ) {}

  async create(createCityDto: CreateCityDto): Promise<City> {
    const city = this.cityRepository.create(createCityDto);
    return this.cityRepository.save(city);
  }

  async findAll(region?: string): Promise<City[]> {
    const query = this.cityRepository
      .createQueryBuilder('city')
      .where('city.isActive = :isActive', { isActive: true })
      .orderBy('city.name', 'ASC');

    if (region) {
      query.andWhere('city.region = :region', { region });
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<City> {
    const city = await this.cityRepository.findOne({
      where: { id },
    });

    if (!city) {
      throw new NotFoundException('Şehir bulunamadı');
    }

    return city;
  }

  async update(id: string, updateCityDto: UpdateCityDto): Promise<City> {
    await this.cityRepository.update(id, updateCityDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<boolean> {
    const city = await this.findOne(id);
    await this.cityRepository.remove(city);
    return true;
  }
}
