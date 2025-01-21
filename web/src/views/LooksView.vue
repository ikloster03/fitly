<script setup lang="ts">
import { ref, computed } from 'vue'
import { mockLooks, type Look, groupedLooks, ungroupedLooks } from '@/mocks/looks'
import { useRouter } from 'vue-router'

const router = useRouter()

const looks = ref<Look[]>(mockLooks)
const groupedLooksData = computed(() => groupedLooks(looks.value))
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

const saveLook = () => {
  // Здесь будет логика сохранения нового образа
  console.log('Сохранение образа:', newLook.value)
  dialog.value = false
}

const navigateToItem = (itemId: number) => {
  router.push(`/wardrobe/items/${itemId}`)
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

    <!-- Кнопка добавления -->
    <v-btn
      class="add-button"
      color="primary"
      icon="mdi-plus"
      size="x-large"
      elevation="3"
      @click="dialog = true"
    ></v-btn>

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
</style> 