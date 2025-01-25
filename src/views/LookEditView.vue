<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { mockLooks, type Look } from '@/mocks/looks'
import { mockItems } from '@/mocks/wardrobe'

const route = useRoute()
const router = useRouter()
const form = ref(null)
const isFormValid = ref(false)
const isEditing = ref(false)

const look = ref<Look>({
  id: 0,
  name: '',
  image: '',
  description: '',
  season: [],
  items: [],
  tags: [],
  group: ''
})

const imageFile = ref<File | null>(null)
const previewImage = ref<string>('')

// Списки для выбора
const seasons = ['Весна', 'Лето', 'Осень', 'Зима']
const availableTags = ['Casual', 'Деловой', 'Спортивный', 'Вечерний', 'Городской стиль', 'Пляжный', 'Молодежный', 'Эклектика', 'Авангард']
const availableGroups = ['Повседневные', 'Деловые', 'Праздничные', 'Спортивные', 'Домашние']

// Список доступных вещей для добавления в образ
const availableItems = ref(mockItems)

const handleImageUpload = (file: File | null) => {
  if (!file) {
    previewImage.value = ''
    return
  }
  previewImage.value = URL.createObjectURL(file)
  look.value.image = ''
}

const saveLook = async () => {
  if (imageFile.value) {
    // Здесь будет логика загрузки файла на сервер
    look.value.image = previewImage.value
  }

  // Здесь будет реальный запрос к API
  // Пока используем моковые данные
  if (!look.value.id) {
    look.value.id = Math.max(...mockLooks.map(l => l.id)) + 1
    mockLooks.push(look.value)
  } else {
    const index = mockLooks.findIndex(l => l.id === look.value.id)
    if (index !== -1) {
      mockLooks[index] = { ...look.value }
    }
  }

  console.log('Сохраняем образ:', look.value)
  return look.value
}

const goToItemsTinder = () => {
  if (!look.value.id) {
    // Если это новый лук (нет id), сначала сохраняем его
    saveLook().then(() => {
      router.push({
        name: 'items-tinder',
        params: { 
          lookId: look.value.id.toString()
        }
      })
    })
  } else {
    // Если лук уже существует, просто переходим на тиндер
    router.push({
      name: 'items-tinder',
      params: { 
        lookId: look.value.id.toString()
      }
    })
  }
}

onMounted(async () => {
  const lookId = route.params.id
  if (lookId) {
    isEditing.value = true
    const foundLook = mockLooks.find(l => l.id === Number(lookId))
    if (foundLook) {
      look.value = { ...foundLook }
    }
  }
})

onUnmounted(() => {
  if (previewImage.value) {
    URL.revokeObjectURL(previewImage.value)
  }
})
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="text-h4 mb-4">
            {{ isEditing ? 'Редактирование образа' : 'Новый образ' }}
          </v-card-title>

          <v-card-text>
            <v-form ref="form" v-model="isFormValid">
              <!-- Изображение -->
              <v-row class="mb-6">
                <v-col cols="12" sm="6">
                  <v-img
                    :src="previewImage || look.image || '/placeholder-image.jpg'"
                    height="300"
                    cover
                    class="bg-grey-lighten-2 rounded-lg"
                  >
                    <template v-slot:placeholder>
                      <div class="d-flex align-center justify-center fill-height">
                        <v-icon size="large" color="grey-lighten-1">mdi-image</v-icon>
                      </div>
                    </template>
                  </v-img>
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="d-flex flex-column h-100 justify-center">
                    <v-file-input
                      v-model="imageFile"
                      accept="image/*"
                      label="Загрузить изображение"
                      prepend-icon="mdi-camera"
                      @change="handleImageUpload"
                      :rules="[v => !v || v.size < 5000000 || 'Размер изображения должен быть меньше 5 МБ']"
                      hint="Максимальный размер файла: 5 МБ"
                      persistent-hint
                    ></v-file-input>

                    <v-text-field
                      v-model="look.image"
                      label="URL изображения"
                      hint="Или укажите прямую ссылку на изображение"
                      persistent-hint
                      class="mt-4"
                      @input="previewImage = ''"
                    ></v-text-field>
                  </div>
                </v-col>
              </v-row>

              <!-- Основная информация -->
              <v-text-field
                v-model="look.name"
                label="Название образа"
                :rules="[v => !!v || 'Обязательное поле']"
                required
              ></v-text-field>

              <v-textarea
                v-model="look.description"
                label="Описание"
                rows="3"
              ></v-textarea>

              <!-- Сезоны -->
              <v-select
                v-model="look.season"
                :items="seasons"
                label="Сезоны"
                multiple
                chips
                closable-chips
              ></v-select>

              <!-- Группа -->
              <v-select
                v-model="look.group"
                :items="availableGroups"
                label="Группа"
                clearable
              ></v-select>

              <!-- Теги -->
              <v-combobox
                v-model="look.tags"
                :items="availableTags"
                label="Теги"
                multiple
                chips
                closable-chips
                hint="Введите теги через запятую или выберите из списка"
                persistent-hint
              ></v-combobox>

              <!-- Вещи в образе -->
              <v-card class="mt-4" variant="outlined">
                <v-card-title>Вещи в образе</v-card-title>
                <v-card-text>
                  <v-autocomplete
                    v-model="look.items as any"
                    :items="availableItems"
                    label="Добавить вещь"
                    multiple
                    chips
                    closable-chips
                    item-title="name"
                    item-value="id"
                    return-object
                  >
                    <template v-slot:chip="{ props, item }">
                      <v-chip
                        v-bind="props"
                        :prepend-icon="'mdi-hanger'"
                      >
                        {{ item.raw.name }}
                      </v-chip>
                    </template>
                    <template v-slot:item="{ props, item }">
                      <v-list-item
                        v-bind="props"
                        :prepend-icon="'mdi-hanger'"
                        :title="item.raw.name"
                      >
                        <template v-slot:append>
                          <v-img
                            :src="item.raw.image"
                            width="50"
                            height="50"
                            cover
                            class="rounded"
                          ></v-img>
                        </template>
                      </v-list-item>
                    </template>
                  </v-autocomplete>
                </v-card-text>
              </v-card>
            </v-form>
          </v-card-text>

          <v-card-actions class="pa-4">
            <v-btn
              color="secondary"
              variant="text"
              @click="goToItemsTinder"
              class="mr-2"
            >
              <v-icon class="mr-2">mdi-cards</v-icon>
              Тиндер вещей
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              @click="saveLook"
              :disabled="!isFormValid"
            >
              {{ isEditing ? 'Сохранить' : 'Создать' }}
            </v-btn>
            <v-btn
              color="secondary"
              variant="text"
              @click="router.back()"
            >
              Отмена
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.v-img {
  border: 1px solid rgba(0, 0, 0, 0.12);
}
</style> 