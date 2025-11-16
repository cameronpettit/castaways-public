import { Component } from '@angular/core';
import { PageHeader } from '../fragments/page-header/page-header';
import { CommonModule } from '@angular/common';

interface MerchandiseItem {
  id: string;
  image: string;
  category: string;
}

@Component({
  selector: 'app-merchandise',
  imports: [PageHeader, CommonModule],
  templateUrl: './merchandise.html',
  styleUrl: './merchandise.scss'
})
export class MerchandiseComponent {
  // URL for the external order form
  orderFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSc0w7yoQYBAGPcX_VKqDRz1Pza8t4rpUBqz8l8Al6J00bD8GA/viewform?usp=header';
  public endDate = new Date('2025-11-16T17:00:00');
  public now = new Date();

  merchandiseItems: MerchandiseItem[] = [
    {
      id: 'long-sleeve-m-navy',
      image: '/assets/images/MERCH_2025/long-sleeve-m-navy.png',
      category: 'long-sleeves'
    },
    {
      id: 'long-sleeve-m-white',
      image: '/assets/images/MERCH_2025/long-sleeve-m-white.png',
      category: 'long-sleeves'
    },
    {
      id: 'long-sleeve-w-navy',
      image: '/assets/images/MERCH_2025/long-sleeve-w-navy.png',
      category: 'long-sleeves'
    },
    {
      id: 'long-sleeve-w-white',
      image: '/assets/images/MERCH_2025/long-sleeve-w-white.png',
      category: 'long-sleeves'
    },
    {
      id: 'short-sleeve-m-gray',
      image: '/assets/images/MERCH_2025/short-sleeve-m-gray.png',
      category: 'short-sleeves'
    },
    {
      id: 'short-sleeve-m-white',
      image: '/assets/images/MERCH_2025/short-sleeve-m-white.png',
      category: 'short-sleeves'
    },
    {
      id: 'short-sleeve-m-navy',
      image: '/assets/images/MERCH_2025/short-sleeve-m-navy.png',
      category: 'short-sleeves'
    },
    {
      id: 'short-sleeve-m-blue',
      image: '/assets/images/MERCH_2025/short-sleeve-m-blue.png',
      category: 'short-sleeves'
    },
    {
      id: 'short-sleeve-w-gray',
      image: '/assets/images/MERCH_2025/short-sleeve-w-gray.png',
      category: 'short-sleeves'
    },
    {
      id: 'short-sleeve-w-white',
      image: '/assets/images/MERCH_2025/short-sleeve-w-white.png',
      category: 'short-sleeves'
    },
    {
      id: 'short-sleeve-w-navy',
      image: '/assets/images/MERCH_2025/short-sleeve-w-navy.png',
      category: 'short-sleeves'
    },
    {
      id: 'short-sleeve-m-blue',
      image: '/assets/images/MERCH_2025/short-sleeve-m-blue.png',
      category: 'short-sleeves'
    },
    {
      id: 'hoodie-m-blue',
      image: '/assets/images/MERCH_2025/hoodie-m-blue.png',
      category: 'hoodies'
    },
    {
      id: 'hoodie-m-grey',
      image: '/assets/images/MERCH_2025/hoodie-m-grey.png',
      category: 'hoodies'
    },
    {
      id: 'hoodie-m-white',
      image: '/assets/images/MERCH_2025/hoodie-m-white.png',
      category: 'hoodies'
    },
    {
      id: 'hoodie-m-navy',
      image: '/assets/images/MERCH_2025/hoodie-m-navy.png',
      category: 'hoodies'
    },
    {
      id: 'hoodie-small-logo-blue',
      image: '/assets/images/MERCH_2025/hoodie-small-logo-blue.png',
      category: 'hoodies'
    },
    {
      id: 'hoodie-small-logo-gray',
      image: '/assets/images/MERCH_2025/hoodie-small-logo-gray.png',
      category: 'hoodies'
    },
    {
      id: 'hoodie-small-logo-white',
      image: '/assets/images/MERCH_2025/hoodie-small-logo-white.png',
      category: 'hoodies'
    },
    {
      id: 'hoodie-small-logo-navy',
      image: '/assets/images/MERCH_2025/hoodie-small-logo-navy.png',
      category: 'hoodies'
    },
        {
      id: 'crewneck-blue',
      image: '/assets/images/MERCH_2025/crewneck-blue.png',
      category: 'crewnecks'
    },
    {
      id: 'crewneck-gray',
      image: '/assets/images/MERCH_2025/crewneck-gray.png',
      category: 'crewnecks'
    },
    {
      id: 'crewneck-white',
      image: '/assets/images/MERCH_2025/crewneck-white.png',
      category: 'crewnecks'
    },
    {
      id: 'crewneck-navy',
      image: '/assets/images/MERCH_2025/crewneck-navy.png',
      category: 'crewnecks'
    },
    {
      id: 'crewneck-small-logo-blue',
      image: '/assets/images/MERCH_2025/crewneck-small-logo-blue.png',
      category: 'crewnecks'
    },
    {
      id: 'crewneck-small-logo-gray',
      image: '/assets/images/MERCH_2025/crewneck-small-logo-gray.png',
      category: 'crewnecks'
    },
    {
      id: 'crewneck-small-logo-white',
      image: '/assets/images/MERCH_2025/crewneck-small-logo-white.png',
      category: 'crewnecks'
    },
    {
      id: 'crewneck-small-logo-navy',
      image: '/assets/images/MERCH_2025/crewneck-small-logo-navy.png',
      category: 'crewnecks'
    },
    {
      id: 'toque-blue',
      image: '/assets/images/MERCH_2025/toque-blue.png',
      category: 'touques'
    },
    {
      id: 'toque-white',
      image: '/assets/images/MERCH_2025/toque-white.png',
      category: 'touques'
    },
    {
      id: 'toque-navy',
      image: '/assets/images/MERCH_2025/toque-navy.png',
      category: 'touques'
    },
    {
      id: 'backpack',
      image: '/assets/images/MERCH_2025/backpack.png',
      category: 'other'
    },
    {
      id: 'socks',
      image: '/assets/images/MERCH_2025/socks.png',
      category: 'other'
    },
    {
      id: 'pet-bandana',
      image: '/assets/images/MERCH_2025/pet-bandana.png',
      category: 'other'
    },


  ];

  getItemsByCategory(category: string): MerchandiseItem[] {
    return this.merchandiseItems.filter(item => item.category === category);
  }

  getCategories(): string[] {
    return [...new Set(this.merchandiseItems.map(item => item.category))];
  }

  openOrderForm(): void {
    window.open(this.orderFormUrl, '_blank');
  }
}
