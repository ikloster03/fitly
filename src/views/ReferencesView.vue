<template>
  <v-container fluid class="pa-6">
    <h1>Референсы</h1>

    <!-- Поиск и фильтры -->
    <v-row class="mb-4">
      <v-col cols="12" sm="6" md="4">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Поиск референсов"
          variant="outlined"
          density="comfortable"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-select
          v-model="selectedCategory"
          :items="categories"
          label="Категория"
          variant="outlined"
          density="comfortable"
        ></v-select>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-select
          v-model="selectedStyle"
          :items="styles"
          label="Стиль"
          variant="outlined"
          density="comfortable"
        ></v-select>
      </v-col>
    </v-row>

    <!-- Галерея референсов -->
    <v-row>
      <v-col
        v-for="reference in filteredReferences"
        :key="reference.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card>
          <v-img
            :src="reference.image"
            height="300"
            cover
            class="reference-image"
          ></v-img>
          <v-card-text>
            <div class="d-flex justify-space-between align-center">
              <div>
                <div class="text-subtitle-1">{{ reference.title }}</div>
                <div class="text-caption">{{ reference.category }}</div>
              </div>
              <v-btn icon="mdi-heart" variant="text" @click="toggleFavorite(reference)">
              </v-btn>
            </div>
            <v-chip-group class="mt-2">
              <v-chip
                v-for="tag in reference.tags"
                :key="tag"
                size="small"
                class="mr-1"
              >
                {{ tag }}
              </v-chip>
            </v-chip-group>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Добавляем секцию FAQ после галереи референсов и перед кнопкой добавления -->
    <v-container class="mt-8">
      <h2 class="mb-4">Часто задаваемые вопросы</h2>
      
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-title>
            Как подобрать базовый гардероб?
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <p>Для создания базового гардероба следуйте этим принципам:</p>
            <ul>
              <li>Выбирайте нейтральные цвета (черный, белый, бежевый, серый)</li>
              <li>Начните с основных предметов: белая рубашка, джинсы, базовые футболки</li>
              <li>Добавьте классические пиджаки и брюки</li>
              <li>Подберите универсальную обувь</li>
              <li>Дополните базовыми аксессуарами</li>
            </ul>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-title>
            Как сочетать цвета в образе?
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <p>Основные правила сочетания цветов:</p>
            <ul>
              <li>Используйте цветовой круг для подбора гармоничных сочетаний</li>
              <li>Сочетайте не более 3 цветов в одном образе</li>
              <li>Придерживайтесь правила 60-30-10 для распределения цветов</li>
              <li>Нейтральные цвета сочетаются со всеми остальными</li>
            </ul>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-title>
            Как создать капсульный гардероб?
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <p>Шаги по созданию капсульного гардероба:</p>
            <ul>
              <li>Определите свой стиль жизни и потребности</li>
              <li>Выберите цветовую палитру из 2-3 основных и 2-3 акцентных цветов</li>
              <li>Составьте список необходимых вещей</li>
              <li>Убедитесь, что все вещи сочетаются между собой</li>
              <li>Регулярно обновляйте гардероб, следуя принципу "одна вещь входит - одна выходит"</li>
            </ul>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-title>
            Как использовать референсы для создания образов?
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <p>Эффективное использование референсов:</p>
            <ul>
              <li>Сохраняйте понравившиеся образы в отдельные коллекции по стилям или сезонам</li>
              <li>Анализируйте цветовые сочетания и пропорции</li>
              <li>Отмечайте детали и аксессуары</li>
              <li>Адаптируйте понравившиеся образы под свой гардероб</li>
              <li>Используйте теги для быстрого поиска нужных референсов</li>
            </ul>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-title>
            Как подобрать аксессуары к образу?
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <p>Рекомендации по подбору аксессуаров:</p>
            <ul>
              <li>Учитывайте общий стиль образа</li>
              <li>Соблюдайте баланс (не более 3-4 аксессуаров)</li>
              <li>Сочетайте металлы в украшениях</li>
              <li>Подбирайте сумку и обувь в едином стиле</li>
              <li>Используйте аксессуары для расставления акцентов</li>
            </ul>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-container>

    <!-- Добавляем секцию Tips & Tricks после FAQ -->
    <v-container class="mt-8">
      <h2 class="mb-4">Советы и приемы</h2>

      <v-row>
        <!-- Базовые правила -->
        <v-col cols="12" md="4">
          <v-card class="h-100">
            <v-card-title class="text-h6">
              <v-icon color="primary" class="mr-2">mdi-lightbulb</v-icon>
              Базовые правила
            </v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item v-for="(tip, index) in basicTips" :key="index">
                  <v-list-item-title class="text-body-2">{{ tip }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Продвинутые техники -->
        <v-col cols="12" md="4">
          <v-card class="h-100">
            <v-card-title class="text-h6">
              <v-icon color="primary" class="mr-2">mdi-star</v-icon>
              Продвинутые техники
            </v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item v-for="(tip, index) in advancedTips" :key="index">
                  <v-list-item-title class="text-body-2">{{ tip }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Частые ошибки -->
        <v-col cols="12" md="4">
          <v-card class="h-100">
            <v-card-title class="text-h6">
              <v-icon color="error" class="mr-2">mdi-alert-circle</v-icon>
              Частые ошибки
            </v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item v-for="(tip, index) in commonMistakes" :key="index">
                  <v-list-item-title class="text-body-2">{{ tip }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- FAB для добавления нового референса -->
    <v-btn
      color="primary"
      icon="mdi-plus"
      size="large"
      class="floating-btn"
      @click="showAddDialog = true"
    ></v-btn>

    <!-- Диалог добавления референса -->
    <v-dialog v-model="showAddDialog" max-width="500px">
      <v-card>
        <v-card-title>Добавить референс</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="addReference">
            <v-text-field
              v-model="newReference.title"
              label="Название"
              required
            ></v-text-field>
            <v-file-input
              v-model="newReference.image"
              label="Изображение"
              accept="image/*"
              required
            ></v-file-input>
            <v-select
              v-model="newReference.category"
              :items="categories"
              label="Категория"
              required
            ></v-select>
            <v-combobox
              v-model="newReference.tags"
              :items="availableTags"
              label="Теги"
              multiple
              chips
            ></v-combobox>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="addReference">Сохранить</v-btn>
          <v-btn color="grey" @click="showAddDialog = false">Отмена</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const search = ref('')
const selectedCategory = ref('')
const selectedStyle = ref('')
const showAddDialog = ref(false)

const categories = [
  'Повседневные образы',
  'Деловой стиль',
  'Вечерние наряды',
  'Спортивная одежда',
  'Аксессуары'
]

const styles = [
  'Классический',
  'Casual',
  'Бохо',
  'Минимализм',
  'Романтический'
]

const references = ref([
  {
    id: 1,
    title: 'Летний casual',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600',
    category: 'Повседневные образы',
    tags: ['лето', 'casual', 'джинсы'],
    favorite: false
  },
  {
    id: 2,
    title: 'Деловой костюм',
    image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600',
    category: 'Деловой стиль',
    tags: ['офис', 'костюм', 'классика'],
    favorite: false
  },
  {
    id: 3,
    title: 'Вечернее платье',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600',
    category: 'Вечерние наряды',
    tags: ['платье', 'вечеринка', 'элегантность'],
    favorite: false
  },
  {
    id: 4,
    title: 'Спортивный комплект',
    image: 'https://images.unsplash.com/photo-1483721310020-03333e577078?w=600',
    category: 'Спортивная одежда',
    tags: ['спорт', 'комфорт', 'фитнес'],
    favorite: false
  },
  {
    id: 5,
    title: 'Богемный стиль',
    image: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=600',
    category: 'Повседневные образы',
    tags: ['бохо', 'лето', 'платье'],
    favorite: false
  },
  {
    id: 6,
    title: 'Минималистичный образ',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600',
    category: 'Повседневные образы',
    tags: ['минимализм', 'базовый гардероб', 'монохром'],
    favorite: false
  },
  {
    id: 7,
    title: 'Коктейльное платье',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600',
    category: 'Вечерние наряды',
    tags: ['коктейль', 'платье', 'вечеринка'],
    favorite: false
  },
  {
    id: 8,
    title: 'Осенний лук',
    image: 'https://images.unsplash.com/photo-1511401139252-f158d3209c17?w=600',
    category: 'Повседневные образы',
    tags: ['осень', 'уютный', 'многослойность'],
    favorite: false
  },
  {
    id: 9,
    title: 'Деловая встреча',
    image: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=600',
    category: 'Деловой стиль',
    tags: ['офис', 'формальный', 'брюки'],
    favorite: false
  },
  {
    id: 10,
    title: 'Летние аксессуары',
    image: 'https://images.unsplash.com/photo-1509319117193-57bab727e09d?w=600',
    category: 'Аксессуары',
    tags: ['лето', 'сумка', 'украшения'],
    favorite: false
  },
  {
    id: 11,
    title: 'Зимний гардероб',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600',
    category: 'Повседневные образы',
    tags: ['зима', 'пальто', 'теплый'],
    favorite: false
  },
  {
    id: 12,
    title: 'Романтический образ',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600',
    category: 'Повседневные образы',
    tags: ['романтика', 'весна', 'юбка'],
    favorite: false
  },
  {
    id: 13,
    title: 'Спортивный шик',
    image: 'https://images.unsplash.com/photo-1483721310020-03333e577078?w=600',
    category: 'Спортивная одежда',
    tags: ['спорт-шик', 'кроссовки', 'casual'],
    favorite: false
  },
  {
    id: 14,
    title: 'Вечерние аксессуары',
    image: 'https://images.unsplash.com/photo-1509319117193-57bab727e09d?w=600',
    category: 'Аксессуары',
    tags: ['вечер', 'клатч', 'украшения'],
    favorite: false
  },
  {
    id: 15,
    title: 'Пляжный образ',
    image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600',
    category: 'Повседневные образы',
    tags: ['пляж', 'лето', 'отпуск'],
    favorite: false
  }
])

const newReference = ref({
  title: '',
  image: null,
  category: '',
  tags: []
})

const availableTags = [
  'лето', 'зима', 'осень', 'весна',
  'casual', 'офис', 'вечеринка',
  'джинсы', 'платье', 'юбка'
]

const filteredReferences = computed(() => {
  return references.value.filter(ref => {
    const matchSearch = ref.title.toLowerCase().includes(search.value.toLowerCase()) ||
      ref.tags.some(tag => tag.toLowerCase().includes(search.value.toLowerCase()))
    const matchCategory = !selectedCategory.value || ref.category === selectedCategory.value
    return matchSearch && matchCategory
  })
})

const toggleFavorite = (reference: any) => {
  reference.favorite = !reference.favorite
}

const addReference = () => {
  // Здесь будет логика добавления нового референса
  showAddDialog.value = false
}

// Добавляем массивы с советами
const basicTips = [
  'Начните с базовых вещей нейтральных цветов',
  'Следите за качеством материалов и посадкой',
  'Подбирайте вещи, подходящие вашему образу жизни',
  'Учитывайте особенности своей фигуры',
  'Соблюдайте баланс между комфортом и стилем'
]

const advancedTips = [
  'Используйте правило третей при составлении пропорций',
  'Создавайте акценты с помощью аксессуаров и цвета',
  'Экспериментируйте с текстурами и принтами',
  'Адаптируйте тренды под свой стиль',
  'Планируйте образы заранее для разных случаев'
]

const commonMistakes = [
  'Покупка вещей только из-за скидки',
  'Игнорирование особенностей своей фигуры',
  'Следование всем трендам без разбора',
  'Неправильный уход за вещами',
  'Пренебрежение базовыми вещами'
]
</script>

<style scoped>
.floating-btn {
  position: fixed;
  bottom: 24px;
  right: 24px;
}

.reference-image {
  cursor: pointer;
  transition: transform 0.2s;
}

.reference-image:hover {
  transform: scale(1.02);
}

.v-expansion-panels {
  margin-bottom: 24px;
}

.v-expansion-panel-text ul {
  padding-left: 20px;
  margin-top: 8px;
}

.v-expansion-panel-text li {
  margin-bottom: 8px;
}

.h-100 {
  height: 100%;
}

.v-card-title {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  padding-bottom: 12px;
}

.v-list-item {
  min-height: 40px;
  padding: 4px 0;
}

.text-body-2 {
  line-height: 1.4;
}
</style> 