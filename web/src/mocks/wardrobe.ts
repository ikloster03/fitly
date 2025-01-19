export interface Characteristic {
  name: string;
  value: string;
}

export interface Care {
  storage: string;
  washing: string;
  additional: string;
}

export interface WardrobeItem {
  id: number;
  name: string;
  image: string;
  description: string;
  season: string[];
  color: string[];
  tags: string[];
  characteristics: Characteristic[];
  care: Care;
  isArchived?: boolean;
}

export const mockItems: WardrobeItem[] = [
  {
    id: 1,
    name: "Черная футболка",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27",
    description: "Базовая черная футболка из хлопка",
    season: ["Весна", "Лето", "Осень"],
    color: ["Черный"],
    tags: ["Базовое", "Повседневное"],
    characteristics: [
      { name: "Материал", value: "100% хлопок" },
      { name: "Размер", value: "M" },
      { name: "Производитель", value: "Uniqlo" },
    ],
    care: {
      storage: "Хранить на вешалке в шкафу",
      washing: "Стирка при 30°C, не отбеливать",
      additional: "Гладить при средней температуре",
    },
    isArchived: false,
  },
  {
    id: 2,
    name: "Белая футболка",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
    description: "Базовая белая футболка из хлопка",
    season: ["Весна", "Лето", "Осень"],
    color: ["Белый"],
    tags: ["Базовое", "Повседневное"],
    characteristics: [
      { name: "Материал", value: "95% хлопок, 5% эластан" },
      { name: "Размер", value: "L" },
      { name: "Производитель", value: "H&M" },
    ],
    care: {
      storage: "Хранить в сложенном виде",
      washing: "Стирка при 40°C, не отбеливать",
      additional: "Не сушить в машинке",
    },
    isArchived: false,
  },
  {
    id: 3,
    name: "Футболка с принтом",
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a",
    description: "Черная футболка с графическим принтом",
    season: ["Весна", "Лето"],
    color: ["Черный", "Красный"],
    tags: ["Принт", "Повседневное"],
    characteristics: [
      { name: "Материал", value: "100% хлопок" },
      { name: "Размер", value: "S" },
      { name: "Тип принта", value: "Шелкография" },
    ],
    care: {
      storage: "Хранить на вешалке в темном месте",
      washing: "Стирать наизнанку при 30°C",
      additional: "Гладить только с изнаночной стороны",
    },
    isArchived: false,
  },
];
