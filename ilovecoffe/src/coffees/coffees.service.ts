import { Injectable } from '@nestjs/common';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {
  private coffees: Coffee[] = [
    {
      id: 1,
      name: 'Cappuccino',
      brand: 'Starbucks',
      flavors: ['vanilla', 'caramel'],
    }
  ];

  create(createCoffeeDto: any) {
    this.coffees.push(createCoffeeDto);
  }

  findAll() {
    return this.coffees;
  }

  findOne(id: number) {
    return this.coffees.find(coffee => coffee.id === id);
  }

  update(id: number, updateCoffeeDto: UpdateCoffeeDto) {
    const coffee = this.findOne(id);
    if (coffee) {
      // Find it and update it
    }
  }

  remove(id: number) {
    const coffeeIndex = this.coffees.findIndex(coffee => coffee.id === id);
    if (coffeeIndex >= 0) {
      this.coffees.splice(coffeeIndex, 1);
    }
  }
}
