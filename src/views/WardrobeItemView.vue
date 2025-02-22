<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="text-h4 mb-4">
            {{ isEditing ? "Редактирование вещи" : "Новая вещь" }}
          </v-card-title>

          <v-card-text>
            <v-form ref="form" v-model="isFormValid">
              <!-- Изображение -->
              <v-row class="mb-6">
                <v-col cols="12" sm="6">
                  <v-img
                    :src="
                      previewImage || item.image || '/placeholder-image.jpg'
                    "
                    height="300"
                    cover
                    class="bg-grey-lighten-2 rounded-lg"
                  >
                    <template v-slot:placeholder>
                      <div
                        class="d-flex align-center justify-center fill-height"
                      >
                        <v-icon size="large" color="grey-lighten-1"
                          >mdi-image</v-icon
                        >
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
                      :rules="[
                        (v) =>
                          !v ||
                          v.size < 5000000 ||
                          'Размер изображения должен быть меньше 5 МБ',
                      ]"
                      hint="Максимальный размер файла: 5 МБ"
                      persistent-hint
                    ></v-file-input>

                    <v-text-field
                      v-model="item.image"
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
                v-model="item.name"
                label="Наименование"
                :rules="[(v) => !!v || 'Обязательное поле']"
                required
              ></v-text-field>

              <!-- Теги -->
              <v-combobox
                v-model="item.tags"
                label="Теги"
                multiple
                chips
                closable-chips
                :items="availableTags"
                hint="Введите теги через запятую или выберите из списка"
                persistent-hint
              ></v-combobox>

              <!-- Характеристики -->
              <v-expansion-panels class="mt-4">
                <v-expansion-panel>
                  <v-expansion-panel-title>
                    Характеристики
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <v-row
                      v-for="(char, index) in item.characteristics"
                      :key="index"
                    >
                      <v-col cols="5">
                        <v-text-field
                          v-model="char.name"
                          label="Название характеристики"
                          density="compact"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="5">
                        <v-text-field
                          v-model="char.value"
                          label="Значение"
                          density="compact"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="2">
                        <v-btn
                          icon
                          color="error"
                          variant="text"
                          @click="removeCharacteristic(index)"
                        >
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>
                    <v-btn
                      prepend-icon="mdi-plus"
                      variant="text"
                      @click="addCharacteristic"
                    >
                      Добавить характеристику
                    </v-btn>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>

              <!-- Уход -->
              <v-expansion-panels class="mt-4">
                <v-expansion-panel>
                  <v-expansion-panel-title>
                    Уход за вещью
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <v-textarea
                      v-model="item.care.storage"
                      label="Хранение"
                      rows="3"
                      hint="Как правильно хранить вещь"
                      persistent-hint
                    ></v-textarea>

                    <v-textarea
                      v-model="item.care.washing"
                      label="Стирка"
                      rows="3"
                      class="mt-4"
                      hint="Рекомендации по стирке"
                      persistent-hint
                    ></v-textarea>

                    <v-textarea
                      v-model="item.care.additional"
                      label="Дополнительные рекомендации"
                      rows="3"
                      class="mt-4"
                      hint="Прочие рекомендации по уходу"
                      persistent-hint
                    ></v-textarea>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-btn
              v-if="isEditing"
              color="warning"
              variant="text"
              prepend-icon="mdi-archive-outline"
              @click="archiveItem"
            >
              {{ item.isArchived ? "Разархивировать" : "Архивировать" }}
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="grey-darken-1" variant="text" @click="$router.back()">
              Отмена
            </v-btn>
            <v-btn color="primary" :disabled="!isFormValid" @click="saveItem">
              Сохранить
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Луки с этой вещью -->
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center">
            Луки с этой вещью
            <v-spacer></v-spacer>
            <v-btn
              variant="text"
              color="primary"
              @click="showAllLooks"
              class="text-none"
            >
              Смотреть все луки
              <v-icon class="ml-1">mdi-chevron-right</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text>
            <v-row>
              <v-col
                v-for="look in previewLooks"
                :key="look.id"
                cols="12"
                sm="6"
                md="4"
                lg="2.4"
              >
                <v-card
                  :to="`/looks/${look.id}`"
                  elevation="0"
                  class="look-card"
                >
                  <v-img
                    :src="look.image"
                    height="200"
                    cover
                    class="rounded-lg"
                  >
                    <template v-slot:placeholder>
                      <div class="d-flex align-center justify-center fill-height">
                        <v-icon size="large" color="grey-lighten-1">
                          mdi-image
                        </v-icon>
                      </div>
                    </template>
                  </v-img>
                  
                  <v-card-title class="pt-2 px-0 text-subtitle-1">
                    {{ look.name }}
                  </v-card-title>
                  
                  <v-card-subtitle class="px-0 pb-0">
                    {{ look.season.join(', ') }}
                  </v-card-subtitle>
                </v-card>
              </v-col>

              <v-col
                v-if="previewLooks.length === 0"
                cols="12"
                class="text-center py-8"
              >
                <v-icon
                  size="64"
                  color="grey-lighten-1"
                  class="mb-2"
                >
                  mdi-tshirt-crew
                </v-icon>
                <div class="text-grey">
                  Эта вещь пока не используется ни в одном луке
                </div>
                <v-btn
                  color="primary"
                  class="mt-4"
                  @click="createLook"
                >
                  Создать лук
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Диалог подтверждения архивации -->
    <v-dialog v-model="archiveDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5">
          {{ item.isArchived ? "Разархивировать вещь?" : "Архивировать вещь?" }}
        </v-card-title>

        <v-card-text>
          {{
            item.isArchived
              ? "Вещь снова появится в вашем гардеробе."
              : "Вещь будет скрыта из основного гардероба, но её можно будет восстановить позже."
          }}
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="archiveDialog = false"
          >
            Отмена
          </v-btn>
          <v-btn
            :color="item.isArchived ? 'success' : 'warning'"
            variant="text"
            @click="confirmArchive"
          >
            {{ item.isArchived ? "Разархивировать" : "Архивировать" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Модальное окно со всеми луками -->
    <v-dialog
      v-model="allLooksDialog"
      fullscreen
      :scrim="false"
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          color="primary"
        >
          <v-btn
            icon
            @click="allLooksDialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          
          <v-toolbar-title>Все луки с вещью "{{ item.name }}"</v-toolbar-title>
          
          <v-spacer></v-spacer>
          
          <v-toolbar-items>
            <!-- Кнопка режима выбора -->
            <v-btn
              v-if="!selectionMode"
              variant="text"
              @click="toggleSelectionMode"
            >
              <v-icon class="mr-2">mdi-checkbox-multiple-marked-outline</v-icon>
              Выбрать
            </v-btn>

            <!-- Кнопки в режиме выбора -->
            <template v-else>
              <v-btn
                variant="text"
                color="error"
                :disabled="selectedLooks.length === 0"
                @click="deleteSelectedLooks"
              >
                <v-icon class="mr-2">mdi-delete</v-icon>
                Удалить ({{ selectedLooks.length }})
              </v-btn>
              <v-btn
                variant="text"
                @click="toggleSelectionMode"
              >
                Отмена
              </v-btn>
            </template>

            <!-- Кнопка создания -->
            <v-btn
              v-if="!selectionMode"
              variant="text"
              @click="createLook"
            >
              <v-icon class="mr-2">mdi-plus</v-icon>
              Создать лук
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <v-container class="py-8">
          <!-- Фильтры -->
          <v-row class="mb-6" v-if="!selectionMode">
            <v-col cols="12" sm="6" md="3">
              <v-select
                label="Сезон"
                :items="['Весна', 'Лето', 'Осень', 'Зима']"
                multiple
                chips
                clearable
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-text-field
                label="Поиск по названию"
                prepend-inner-icon="mdi-magnify"
                clearable
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Сетка луков -->
          <v-row>
            <v-col
              v-for="look in allLooks"
              :key="look.id"
              cols="12"
              sm="6"
              md="4"
              lg="3"
            >
              <v-card
                :class="['look-card', { 'selectable': selectionMode }]"
                elevation="0"
                @click="selectionMode ? toggleLookSelection(look.id) : $router.push(`/looks/${look.id}`)"
              >
                <div class="look-image-container">
                  <v-img
                    :src="look.image"
                    height="300"
                    cover
                    class="rounded-lg"
                  >
                    <template v-slot:placeholder>
                      <div class="d-flex align-center justify-center fill-height">
                        <v-icon size="large" color="grey-lighten-1">
                          mdi-image
                        </v-icon>
                      </div>
                    </template>
                  </v-img>
                  
                  <!-- Оверлей выбора -->
                  <div
                    v-if="selectionMode"
                    class="selection-overlay"
                    :class="{ 'selected': selectedLooks.includes(look.id) }"
                  >
                    <v-icon
                      size="large"
                      :color="selectedLooks.includes(look.id) ? 'white' : 'grey-lighten-1'"
                    >
                      {{ selectedLooks.includes(look.id) ? 'mdi-checkbox-marked-circle' : 'mdi-checkbox-blank-circle-outline' }}
                    </v-icon>
                  </div>
                </div>
                
                <v-card-title class="pt-2 px-0 text-h6">
                  {{ look.name }}
                </v-card-title>
                
                <v-card-subtitle class="px-0">
                  {{ look.season.join(', ') }}
                </v-card-subtitle>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { mockItems, type WardrobeItem } from "../mocks/wardrobe";

const route = useRoute();
const router = useRouter();
const form = ref(null);
const isFormValid = ref(false);
const isEditing = ref(false);

const item = ref<WardrobeItem>({
  id: 0,
  name: "",
  image: "",
  description: "",
  season: [],
  color: [],
  tags: [],
  characteristics: [],
  care: {
    storage: "",
    washing: "",
    additional: "",
  },
});

// Примерный список доступных тегов
const availableTags = ref([
  "Верхняя одежда",
  "Повседневное",
  "Праздничное",
  "Летнее",
  "Зимнее",
  "Деловое",
]);

const imageFile = ref<File | null>(null);
const previewImage = ref<string>("");

const addCharacteristic = () => {
  item.value.characteristics.push({
    name: "",
    value: "",
  });
};

const removeCharacteristic = (index: number) => {
  item.value.characteristics.splice(index, 1);
};

const handleImageUpload = (file: File | null) => {
  if (!file) {
    previewImage.value = "";
    return;
  }

  // Создаем URL для предпросмотра
  previewImage.value = URL.createObjectURL(file);

  // Очищаем URL изображения, если оно было указано
  item.value.image = "";
};

const saveItem = async () => {
  if (imageFile.value) {
    // Здесь будет логика загрузки файла на сервер
    // и получение URL загруженного изображения
    // Пока просто используем локальный URL для демонстрации
    item.value.image = previewImage.value;
  }

  console.log("Сохраняем вещь:", item.value);
  router.back();
};

const archiveDialog = ref(false);

const archiveItem = () => {
  archiveDialog.value = true;
};

const confirmArchive = async () => {
  item.value.isArchived = !item.value.isArchived;

  // Здесь будет логика сохранения статуса архивации на сервере
  console.log(
    `Вещь ${item.value.isArchived ? "архивирована" : "разархивирована"}:`,
    item.value
  );

  archiveDialog.value = false;

  // Опционально: вернуться назад после архивации
  if (item.value.isArchived) {
    router.back();
  }
};

onMounted(async () => {
  const itemId = route.params.id;
  if (itemId) {
    isEditing.value = true;
    const foundItem = mockItems.find((i) => i.id === Number(itemId));
    if (foundItem) {
      item.value = {
        ...foundItem,
        isArchived: foundItem.isArchived || false, // Устанавливаем значение по умолчанию
      };
    }
  }
});

// Очищаем URL предпросмотра при размонтировании компонента
onUnmounted(() => {
  if (previewImage.value) {
    URL.revokeObjectURL(previewImage.value);
  }
});

interface Look {
  id: number
  name: string
  image: string
  season: string[]
}

// Моковые данные для луков
const previewLooks = ref<Look[]>([
  {
    id: 1,
    name: 'Повседневный casual',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27',
    season: ['Весна', 'Лето']
  },
  {
    id: 2,
    name: 'Деловой стиль',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea',
    season: ['Осень', 'Зима']
  },
  {
    id: 3,
    name: 'Вечерний выход',
    image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157',
    season: ['Лето']
  }
])

const allLooksDialog = ref(false)

// Расширенный список луков для модального окна
const allLooks = ref<Look[]>([
  {
    id: 1,
    name: 'Повседневный casual',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27',
    season: ['Весна', 'Лето']
  },
  {
    id: 2,
    name: 'Деловой стиль',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea',
    season: ['Осень', 'Зима']
  },
  {
    id: 3,
    name: 'Вечерний выход',
    image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157',
    season: ['Лето']
  },
  {
    id: 4,
    name: 'Спортивный лук',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f',
    season: ['Весна', 'Лето']
  },
  {
    id: 5,
    name: 'Для прогулки',
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105',
    season: ['Осень']
  },
  // ... можно добавить больше луков
])

const showAllLooks = () => {
  allLooksDialog.value = true
}

const createLook = () => {
  router.push({
    name: 'look-new',
    query: {
      itemId: route.params.id // передаем ID текущей вещи в параметрах
    }
  })
}

const selectionMode = ref(false)
const selectedLooks = ref<number[]>([])

const toggleSelectionMode = () => {
  selectionMode.value = !selectionMode.value
  if (!selectionMode.value) {
    selectedLooks.value = [] // Сбрасываем выбор при выходе из режима
  }
}

const toggleLookSelection = (lookId: number) => {
  const index = selectedLooks.value.indexOf(lookId)
  if (index === -1) {
    selectedLooks.value.push(lookId)
  } else {
    selectedLooks.value.splice(index, 1)
  }
}

const deleteSelectedLooks = () => {
  // Здесь будет логика удаления на бэкенде
  allLooks.value = allLooks.value.filter(look => !selectedLooks.value.includes(look.id))
  selectedLooks.value = [] // Очищаем выбор
  selectionMode.value = false // Выходим из режима выбора
}
</script>

<style scoped>
.v-expansion-panel {
  background-color: transparent !important;
  box-shadow: none !important;
}

.v-img {
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.look-card {
  transition: transform 0.2s;
}

.look-card:hover {
  transform: translateY(-4px);
}

.v-card-title {
  line-height: 1.2;
}

.dialog-bottom-transition-enter-active,
.dialog-bottom-transition-leave-active {
  transition: transform .3s ease-in-out;
}

.dialog-bottom-transition-enter-from,
.dialog-bottom-transition-leave-to {
  transform: translateY(100%);
}

.look-image-container {
  position: relative;
}

.selection-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity 0.2s;
  border-radius: 8px;
}

.selectable:hover .selection-overlay {
  opacity: 1;
}

.selection-overlay.selected {
  opacity: 1;
  background-color: rgba(var(--v-theme-primary), 0.4);
}

.selectable {
  cursor: pointer;
}
</style>
