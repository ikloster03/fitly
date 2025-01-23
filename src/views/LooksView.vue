<script setup lang="ts">
import { ref, computed } from 'vue'
import { mockLooks, type Look, ungroupedLooks } from '@/mocks/looks'
import { useRouter } from 'vue-router'

const router = useRouter()

const looks = ref<Look[]>(mockLooks)

// Добавим интерфейс для группы
interface LookGroup {
  name: string
  description: string
}

// Создадим массив для хранения групп
const lookGroups = ref<LookGroup[]>([
  { name: 'Повседневные', description: 'Образы для повседневной носки' },
  { name: 'Деловые', description: 'Образы для работы и деловых встреч' },
  { name: 'Праздничные', description: 'Образы для особых случаев' },
  { name: 'Спортивные', description: 'Образы для спорта и активного отдыха' },
  { name: 'Домашние', description: 'Образы для дома' }
])

const groupedLooksData = computed(() => {
  const groups = {} as Record<string, Look[]>
  
  looks.value.forEach(look => {
    if (!groups[look.group]) {
      groups[look.group] = []
    }
    groups[look.group].push(look)
  })
  
  // Возвращаем только группы, которые есть в lookGroups
  return lookGroups.value.map(group => ({
    name: group.name,
    description: group.description,
    items: groups[group.name] || []
  }))
})

const ungroupedLooksData = computed(() => ungroupedLooks(looks.value))

const dialog = ref(false)
const newLook = ref({
  name: '',
  image: null as File | null,
  imageUrl: '',
  description: '',
  season: [] as string[],
  items: [] as { id: number; name: string; image: string }[],
  tags: [] as string[],
  group: ''
})

const seasons = ['Весна', 'Лето', 'Осень', 'Зима']
const availableTags = ['Casual', 'Деловой', 'Спортивный', 'Вечерний', 'Городской стиль']
const availableGroups = ['Повседневные', 'Деловые', 'Праздничные', 'Спортивные', 'Домашние']

const showSpeedDial = ref(false)
const groupDialog = ref(false)

const newGroup = ref<LookGroup>({
  name: '',
  description: ''
})

const saveLook = () => {
  // Здесь будет логика сохранения нового образа
  console.log('Сохранение образа:', newLook.value)
  dialog.value = false
}

const navigateToItem = (itemId: number) => {
  router.push(`/wardrobe/items/${itemId}`)
}

const createLook = () => {
  router.push('/looks/new')
}

const addGroup = () => {
  groupDialog.value = true
}

const saveGroup = () => {
  // Проверяем, не существует ли уже группа с таким именем
  if (!lookGroups.value.some(group => group.name === newGroup.value.name)) {
    // Добавляем новую группу в массив
    lookGroups.value.push({
      name: newGroup.value.name,
      description: newGroup.value.description
    })

    console.log('Группа создана:', newGroup.value)
  } else {
    console.warn('Группа с таким названием уже существует')
    // Здесь можно добавить уведомление пользователю
  }
  
  // Очищаем форму и закрываем диалог
  newGroup.value = {
    name: '',
    description: ''
  }
  groupDialog.value = false
}
</script>

<template>
  <v-container fluid>
    <!-- Фильтры -->
    <v-row class="mb-4">
      <v-col cols="12">
        <v-card>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-select
                  label="Сезон"
                  :items="seasons"
                  multiple
                  chips
                  clearable
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-select
                  label="Теги"
                  :items="availableTags"
                  multiple
                  chips
                  clearable
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-select
                  label="Группа"
                  :items="availableGroups"
                  clearable
                ></v-select>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Сгруппированные образы -->
    <v-expansion-panels class="mb-6">
      <v-expansion-panel
        v-for="group in groupedLooksData"
        :key="group.name"
      >
        <v-expansion-panel-title>
          <div class="d-flex align-center">
            <v-icon class="mr-2">
              {{ 
                group.name === 'Повседневные' ? 'mdi-hanger' :
                group.name === 'Деловые' ? 'mdi-briefcase' :
                group.name === 'Праздничные' ? 'mdi-party-popper' :
                group.name === 'Спортивные' ? 'mdi-dumbbell' :
                'mdi-home'
              }}
            </v-icon>
            {{ group.name }}
            <v-chip
              class="ml-2"
              size="small"
              color="primary"
            >
              {{ group.items.length }}
            </v-chip>
          </div>
        </v-expansion-panel-title>
        
        <v-expansion-panel-text>
          <v-row>
            <v-col
              v-for="look in group.items"
              :key="look.id"
              cols="12"
              sm="6"
              md="4"
              lg="3"
            >
              <v-card>
                <v-img
                  :src="look.image"
                  height="300"
                  cover
                  class="align-end"
                >
                  <v-card-title class="text-white">
                    {{ look.name }}
                  </v-card-title>
                </v-img>

                <v-card-text>
                  <p class="mb-2">{{ look.description }}</p>
                  
                  <v-chip-group>
                    <v-chip
                      v-for="season in look.season"
                      :key="season"
                      size="small"
                      color="primary"
                    >
                      {{ season }}
                    </v-chip>
                  </v-chip-group>

                  <v-chip-group class="mt-2">
                    <v-chip
                      v-for="tag in look.tags"
                      :key="tag"
                      size="small"
                    >
                      {{ tag }}
                    </v-chip>
                  </v-chip-group>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-text>
                  <div class="text-subtitle-2 mb-2">Вещи в образе:</div>
                  <v-list density="compact">
                    <v-list-item
                      v-for="item in look.items"
                      :key="item.id"
                      :title="item.name"
                      prepend-icon="mdi-hanger"
                      @click="navigateToItem(item.id)"
                      class="cursor-pointer"
                    >
                      <template v-slot:append>
                        <v-icon size="small">mdi-chevron-right</v-icon>
                      </template>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <!-- Образы без группы -->
    <template v-if="ungroupedLooksData.length > 0">
      <v-row>
        <v-col cols="12">
          <h2 class="text-h5 mb-4">Другие образы</h2>
        </v-col>
      </v-row>
      
      <v-row>
        <v-col
          v-for="look in ungroupedLooksData"
          :key="look.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card>
            <v-img
              :src="look.image"
              height="300"
              cover
              class="align-end"
            >
              <v-card-title class="text-white">
                {{ look.name }}
              </v-card-title>
            </v-img>

            <v-card-text>
              <p class="mb-2">{{ look.description }}</p>
              
              <v-chip-group>
                <v-chip
                  v-for="season in look.season"
                  :key="season"
                  size="small"
                  color="primary"
                >
                  {{ season }}
                </v-chip>
              </v-chip-group>

              <v-chip-group class="mt-2">
                <v-chip
                  v-for="tag in look.tags"
                  :key="tag"
                  size="small"
                >
                  {{ tag }}
                </v-chip>
              </v-chip-group>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-text>
              <div class="text-subtitle-2 mb-2">Вещи в образе:</div>
              <v-list density="compact">
                <v-list-item
                  v-for="item in look.items"
                  :key="item.id"
                  :title="item.name"
                  prepend-icon="mdi-hanger"
                  @click="navigateToItem(item.id)"
                  class="cursor-pointer"
                >
                  <template v-slot:append>
                    <v-icon size="small">mdi-chevron-right</v-icon>
                  </template>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>

    <!-- Кнопки добавления -->
    <div
      class="speed-dial-container"
      @mouseenter="showSpeedDial = true"
      @mouseleave="showSpeedDial = false"
    >
      <!-- Дополнительные кнопки -->
      <v-scale-transition>
        <div v-show="showSpeedDial" class="speed-dial-actions">
          <v-btn
            class="mb-2"
            color="primary"
            size="large"
            elevation="3"
            icon
            @click="addGroup"
          >
            <v-icon>mdi-tag-plus-outline</v-icon>
            <v-tooltip activator="parent" location="left">
              Добавить группу
            </v-tooltip>
          </v-btn>

          <v-btn
            class="mb-2"
            color="primary"
            size="large"
            elevation="3"
            icon
            @click="createLook"
          >
            <v-icon>mdi-tshirt-crew-outline</v-icon>
            <v-tooltip activator="parent" location="left">
              Добавить образ
            </v-tooltip>
          </v-btn>
        </div>
      </v-scale-transition>

      <!-- Основная кнопка -->
      <v-btn
        class="main-add-button"
        color="primary"
        size="x-large"
        elevation="3"
        icon
      >
        <v-icon>mdi-plus-circle-outline</v-icon>
        <v-tooltip activator="parent" location="left">
          Добавить
        </v-tooltip>
      </v-btn>
    </div>

    <!-- Диалог создания образа -->
    <v-dialog v-model="dialog" max-width="600">
      <v-card>
        <v-card-title class="text-h5">
          Новый образ
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="newLook.name"
                  label="Название образа"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="newLook.description"
                  label="Описание"
                  rows="3"
                ></v-textarea>
              </v-col>

              <v-col cols="12">
                <v-file-input
                  v-model="newLook.image"
                  accept="image/*"
                  label="Фото образа"
                  prepend-icon="mdi-camera"
                ></v-file-input>
              </v-col>

              <v-col cols="12" sm="6">
                <v-select
                  v-model="newLook.season"
                  :items="seasons"
                  label="Сезон"
                  multiple
                  chips
                ></v-select>
              </v-col>

              <v-col cols="12" sm="6">
                <v-combobox
                  v-model="newLook.tags"
                  :items="availableTags"
                  label="Теги"
                  multiple
                  chips
                  closable-chips
                ></v-combobox>
              </v-col>

              <v-col cols="12" sm="6">
                <v-select
                  v-model="newLook.group"
                  :items="availableGroups"
                  label="Группа"
                  required
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="dialog = false"
          >
            Отмена
          </v-btn>
          <v-btn
            color="primary"
            variant="text"
            @click="saveLook"
          >
            Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Диалог добавления группы -->
    <v-dialog v-model="groupDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h5">
          Новая группа образов
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="newGroup.name"
                  label="Название группы"
                  required
                  :rules="[
                    (v) => !!v || 'Название обязательно',
                    (v) => !lookGroups.some(group => group.name === v) || 'Такая группа уже существует'
                  ]"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="newGroup.description"
                  label="Описание группы"
                  rows="3"
                  hint="Необязательное описание для группы"
                  persistent-hint
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="groupDialog = false"
          >
            Отмена
          </v-btn>
          <v-btn
            color="primary"
            variant="text"
            @click="saveGroup"
          >
            Создать
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.add-button {
  position: fixed;
  bottom: 24px;
  right: 24px;
}

.v-card-title {
  background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%);
  width: 100%;
}

.cursor-pointer {
  cursor: pointer;
}

.cursor-pointer:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.speed-dial-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 100;
}

.speed-dial-actions {
  position: absolute;
  bottom: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 8px;
  z-index: 101;
}

.main-add-button {
  transition: transform 0.2s;
  z-index: 102;
}

.speed-dial-container:hover .main-add-button {
  transform: rotate(45deg);
}
</style> 