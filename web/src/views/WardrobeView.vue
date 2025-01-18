<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

interface Category {
  id: number
  name: string
  slug: string
  image: string
}

const generateSlug = (name: string): string => {
  return name
    .toLowerCase() // переводим в нижний регистр
    .replace(/[^а-яёa-z0-9\s-]/g, '') // удаляем спецсимволы кроме пробелов и дефисов
    .replace(/\s+/g, '-') // заменяем пробелы на дефисы
    .replace(/ё/g, 'e') // заменяем ё на е
    .replace(/[а-я]/g, char => { // транслитерация
      const translitMap: { [key: string]: string } = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
        'е': 'e', 'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y',
        'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
        'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
        'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh',
        'щ': 'sch', 'ы': 'y', 'э': 'e', 'ю': 'yu', 'я': 'ya'
      }
      return translitMap[char] || char
    })
    .replace(/-+/g, '-') // убираем множественные дефисы
    .replace(/^-+|-+$/g, '') // убираем дефисы в начале и конце
}

const categories = ref<Category[]>([
  { 
    id: 1, 
    name: 'Верхняя одежда', 
    slug: 'verhnyaya-odezhda',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80' 
  },
  { 
    id: 2, 
    name: 'Футболки', 
    slug: 'futbolki',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80' 
  },
  { 
    id: 3, 
    name: 'Брюки', 
    slug: 'bryuki',
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80' 
  },
  { 
    id: 4, 
    name: 'Обувь', 
    slug: 'obuv',
    image: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&q=80' 
  },
  { 
    id: 5, 
    name: 'Аксессуары', 
    slug: 'aksessuary',
    image: 'https://images.unsplash.com/photo-1611923134239-b9be5816e23c?auto=format&fit=crop&q=80' 
  },
  { 
    id: 6, 
    name: 'Рубашки', 
    slug: 'rubashki',
    image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&q=80' 
  },
  { 
    id: 7, 
    name: 'Свитера', 
    slug: 'svitera',
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80' 
  },
  { 
    id: 8, 
    name: 'Костюмы', 
    slug: 'kostyumy',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80' 
  },
])

const dialog = ref(false)
const newCategory = ref({
  name: '',
  image: null as File | null,
  imageUrl: ''
})
const dragOver = ref(false)
const uploadType = ref('file')

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  dragOver.value = false
  
  const files = e.dataTransfer?.files
  if (files?.length) {
    newCategory.value.image = files[0]
    newCategory.value.imageUrl = '' // Сбрасываем URL при загрузке файла
  }
}

const handleFileInput = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (files?.length) {
    newCategory.value.image = files[0]
    newCategory.value.imageUrl = '' // Сбрасываем URL при загрузке файла
  }
}

const resetForm = () => {
  newCategory.value = {
    name: '',
    image: null,
    imageUrl: ''
  }
  uploadType.value = 'file'
  dialog.value = false
}

const saveCategory = async () => {
  let imageUrl = ''
  
  if (uploadType.value === 'file' && newCategory.value.image) {
    imageUrl = URL.createObjectURL(newCategory.value.image)
  } else {
    imageUrl = newCategory.value.imageUrl
  }

  // Генерируем slug из названия
  const slug = generateSlug(newCategory.value.name)

  // Проверяем уникальность slug
  let uniqueSlug = slug
  let counter = 1
  while (categories.value.some(cat => cat.slug === uniqueSlug)) {
    uniqueSlug = `${slug}-${counter}`
    counter++
  }

  // Добавляем новую категорию в массив
  categories.value.push({
    id: categories.value.length + 1,
    name: newCategory.value.name,
    slug: uniqueSlug,
    image: imageUrl
  })

  resetForm()
}

const isFormValid = () => {
  return newCategory.value.name && 
    ((uploadType.value === 'file' && newCategory.value.image) || 
     (uploadType.value === 'url' && newCategory.value.imageUrl))
}

const navigateToCategory = (slug: string) => {
  router.push(`/wardrobe/${slug}`)
}
</script>

<template>
  <v-container fluid class="pa-0">
    <v-row class="ma-0">
      <v-col
        v-for="category in categories"
        :key="category.id"
        cols="12"
        sm="6"
        md="3"
        class="pa-2"
      >
        <v-card
          class="category-card"
          :style="{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url(${category.image})`
          }"
          height="200"
          @click="navigateToCategory(category.slug)"
        >
          <v-card-title class="category-title">
            {{ category.name }}
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <!-- Плавающая кнопка добавления -->
    <v-btn
      class="add-button"
      color="primary"
      icon="mdi-plus"
      size="x-large"
      elevation="3"
      @click="dialog = true"
    ></v-btn>

    <!-- Модальное окно -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title class="text-h5">
          Новый раздел
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="newCategory.name"
                  label="Название раздела"
                  required
                ></v-text-field>
              </v-col>
              
              <v-col cols="12">
                <v-btn-toggle
                  v-model="uploadType"
                  mandatory
                  class="mb-4"
                >
                  <v-btn value="file">
                    <v-icon start>mdi-file-upload</v-icon>
                    Загрузить файл
                  </v-btn>
                  <v-btn value="url">
                    <v-icon start>mdi-link</v-icon>
                    Указать URL
                  </v-btn>
                </v-btn-toggle>

                <!-- Область загрузки файла -->
                <div
                  v-if="uploadType === 'file'"
                  class="upload-area"
                  :class="{ 'drag-over': dragOver }"
                  @dragover.prevent="dragOver = true"
                  @dragleave.prevent="dragOver = false"
                  @drop="handleDrop"
                  @click="$refs.fileInput.click()"
                >
                  <input
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    class="hidden-input"
                    @change="handleFileInput"
                  >
                  <v-icon size="40" class="mb-2">mdi-cloud-upload</v-icon>
                  <div v-if="newCategory.image">
                    Выбран файл: {{ newCategory.image.name }}
                  </div>
                  <div v-else>
                    Перетащите изображение сюда или кликните для выбора
                  </div>
                </div>

                <!-- Поле для URL -->
                <v-text-field
                  v-else
                  v-model="newCategory.imageUrl"
                  label="URL изображения"
                  placeholder="https://example.com/image.jpg"
                  :rules="[v => !!v || 'URL обязателен']"
                  @input="newCategory.image = null"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="resetForm"
          >
            Отмена
          </v-btn>
          <v-btn
            color="primary"
            variant="text"
            @click="saveCategory"
            :disabled="!isFormValid()"
          >
            Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.category-card {
  background-size: cover;
  background-position: center;
  cursor: pointer;
  transition: transform 0.2s;
  display: flex;
  align-items: flex-end;
}

.category-card:hover {
  transform: translateY(-4px);
}

.category-title {
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6);
  font-size: 1.5rem;
  font-weight: 500;
  padding: 16px;
  width: 100%;
}

.add-button {
  position: fixed;
  bottom: 24px;
  right: 24px;
}

.upload-area {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 32px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.upload-area:hover {
  border-color: #666;
}

.drag-over {
  border-color: var(--v-primary-base);
  background-color: rgba(var(--v-primary-base), 0.05);
}

.hidden-input {
  display: none;
}

.v-btn-toggle {
  width: 100%;
  display: flex;
}

.v-btn-toggle .v-btn {
  flex: 1;
}
</style> 