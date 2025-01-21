export interface Look {
  id: number
  name: string
  image: string
  description: string
  season: string[]
  items: {
    id: number
    name: string
    image: string
  }[]
  tags: string[]
  group: string
}

export const mockLooks: Look[] = [
  {
    id: 1,
    name: 'Повседневный casual',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b',
    description: 'Комфортный образ для прогулок по городу',
    season: ['Весна', 'Лето'],
    items: [
      { id: 1, name: 'Белая футболка', image: 'https://example.com/tshirt.jpg' },
      { id: 2, name: 'Джинсы', image: 'https://example.com/jeans.jpg' },
    ],
    tags: ['Casual', 'Городской стиль'],
    group: 'Повседневные'
  },
  {
    id: 2,
    name: 'Деловая встреча',
    image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2',
    description: 'Строгий костюм для важных переговоров',
    season: ['Осень', 'Зима'],
    items: [
      { id: 3, name: 'Пиджак', image: 'https://example.com/blazer.jpg' },
      { id: 4, name: 'Брюки', image: 'https://example.com/pants.jpg' },
      { id: 5, name: 'Рубашка', image: 'https://example.com/shirt.jpg' },
    ],
    tags: ['Деловой', 'Формальный'],
    group: 'Деловые'
  },
  {
    id: 3,
    name: 'Вечерний выход',
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446',
    description: 'Элегантный образ для особого случая',
    season: ['Весна'],
    items: [
      { id: 6, name: 'Платье', image: 'https://example.com/dress.jpg' },
      { id: 7, name: 'Туфли', image: 'https://example.com/shoes.jpg' },
    ],
    tags: ['Вечерний', 'Элегантный'],
    group: 'Праздничные'
  },
  {
    id: 4,
    name: 'Спортивный комплект',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f',
    description: 'Удобный комплект для тренировок',
    season: ['Весна', 'Лето', 'Осень', 'Зима'],
    items: [
      { id: 8, name: 'Спортивные легинсы', image: 'https://example.com/leggings.jpg' },
      { id: 9, name: 'Спортивный топ', image: 'https://example.com/top.jpg' },
    ],
    tags: ['Спортивный'],
    group: 'Спортивные'
  },
  {
    id: 5,
    name: 'Уютный домашний',
    image: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d',
    description: 'Комфортная одежда для дома',
    season: ['Осень', 'Зима'],
    items: [
      { id: 10, name: 'Свитер оверсайз', image: 'https://example.com/sweater.jpg' },
      { id: 11, name: 'Домашние брюки', image: 'https://example.com/home-pants.jpg' },
    ],
    tags: ['Casual'],
    group: 'Домашние'
  },
  {
    id: 6,
    name: 'Летняя прогулка',
    image: 'https://images.unsplash.com/photo-1523359346063-d879354c0ea5',
    description: 'Легкий образ для летних прогулок',
    season: ['Лето'],
    items: [
      { id: 12, name: 'Летнее платье', image: 'https://example.com/summer-dress.jpg' },
      { id: 13, name: 'Соломенная шляпа', image: 'https://example.com/hat.jpg' },
    ],
    tags: ['Casual', 'Городской стиль'],
    group: 'Повседневные'
  },
  {
    id: 7,
    name: 'Пляжный образ',
    image: 'https://images.unsplash.com/photo-1528493366314-e317cd94fc8c',
    description: 'Идеальный образ для пляжного отдыха',
    season: ['Лето'],
    items: [
      { id: 14, name: 'Купальник', image: 'https://example.com/swimsuit.jpg' },
      { id: 15, name: 'Парео', image: 'https://example.com/pareo.jpg' },
      { id: 16, name: 'Сандалии', image: 'https://example.com/sandals.jpg' },
    ],
    tags: ['Пляжный', 'Летний'],
    group: ''
  },
  {
    id: 8,
    name: 'Фестивальный лук',
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b',
    description: 'Яркий образ для музыкального фестиваля',
    season: ['Лето'],
    items: [
      { id: 17, name: 'Джинсовые шорты', image: 'https://example.com/shorts.jpg' },
      { id: 18, name: 'Топ с принтом', image: 'https://example.com/top-print.jpg' },
      { id: 19, name: 'Ботинки', image: 'https://example.com/boots.jpg' },
    ],
    tags: ['Casual', 'Молодежный'],
    group: ''
  },
  {
    id: 9,
    name: 'Экспериментальный микс',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae',
    description: 'Креативное сочетание разных стилей',
    season: ['Весна', 'Осень'],
    items: [
      { id: 20, name: 'Кожаная куртка', image: 'https://example.com/leather-jacket.jpg' },
      { id: 21, name: 'Платье-комбинация', image: 'https://example.com/slip-dress.jpg' },
      { id: 22, name: 'Грубые ботинки', image: 'https://example.com/combat-boots.jpg' },
    ],
    tags: ['Эклектика', 'Авангард'],
    group: ''
  }
]

// Добавим функцию для группировки образов
export const groupedLooks = (looks: Look[]) => {
  const groups = {} as Record<string, Look[]>
  
  looks.forEach(look => {
    if (!groups[look.group]) {
      groups[look.group] = []
    }
    groups[look.group].push(look)
  })
  
  return Object.entries(groups).map(([name, items]) => ({
    name,
    items
  }))
}

// Добавим функцию для получения образов без группы
export const ungroupedLooks = (looks: Look[]) => {
  return looks.filter(look => !look.group)
} 