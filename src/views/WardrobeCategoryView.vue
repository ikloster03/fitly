<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { mockItems } from "../mocks/wardrobe";

interface ClothingItem {
  id: number;
  name: string;
  image: string;
  description: string;
  season: string[];
  color: string[];
}

interface ItemGroup {
  name: string;
  items: ClothingItem[];
}

const route = useRoute();
const categorySlug = route.params.slug as string;

const category = ref({
  name: "",
  slug: "",
  image: "",
});

const dialog = ref(false);
const groupDialog = ref(false);

const newItem = ref({
  name: "",
  image: null as File | null,
  imageUrl: "",
  description: "",
  season: [] as string[],
  color: [] as string[],
  group: null as string | null,
});

const newGroup = ref({
  name: "",
  description: "",
});

const seasons = ["Весна", "Лето", "Осень", "Зима"];
const colors = ["Черный", "Белый", "Серый", "Синий", "Красный", "Зеленый"];

const itemGroups = ref<ItemGroup[]>([
  {
    name: "Базовые",
    items: mockItems.filter((item) => item.tags.includes("Базовое")),
  },
  {
    name: "Принты",
    items: mockItems.filter((item) => item.tags.includes("Принт")),
  },
  {
    name: "Спортивные",
    items: mockItems.filter((item) => item.tags.includes("Спортивное")),
  },
]);

// Отдельный массив для вещей без группы
const ungroupedItems = ref(
  mockItems.filter(
    (item) =>
      !item.tags.some((tag) => ["Базовое", "Принт", "Спортивное"].includes(tag))
  )
);

const showSpeedDial = ref(false);

const editGroupDialog = ref(false);
const editingGroup = ref<{
  name: string;
  description: string;
  originalName: string;
}>({
  name: "",
  description: "",
  originalName: "",
});

onMounted(async () => {
  // Здесь будет запрос к API для получения информации о категории
  // Пока используем моковые данные
  category.value = {
    name: "Футболки",
    slug: categorySlug,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27",
  };
});

const addItem = () => {
  dialog.value = true;
};

const addGroup = () => {
  groupDialog.value = true;
};

const saveItem = () => {
  // Здесь будет логика сохранения
  console.log("Сохранение вещи:", newItem.value);

  const item = {
    id: Math.random(), // временное решение для генерации ID
    name: newItem.value.name,
    image: newItem.value.imageUrl || "placeholder-image-url",
    description: newItem.value.description,
    season: newItem.value.season,
    color: newItem.value.color,
  };

  // Добавляем вещь в выбранную группу или в ungroupedItems
  if (newItem.value.group) {
    const targetGroup = itemGroups.value.find(
      (g) => g.name === newItem.value.group
    );
    if (targetGroup) {
      targetGroup.items.push(item);
    }
  } else {
    ungroupedItems.value.push(item as any);
  }

  // Очищаем форму и закрываем диалог
  newItem.value = {
    name: "",
    image: null,
    imageUrl: "",
    description: "",
    season: [],
    color: [],
    group: null,
  };
  dialog.value = false;
};

const saveGroup = () => {
  // Здесь будет логика сохранения новой группы
  console.log("Сохранение группы:", newGroup.value);

  // Добавляем новую группу в массив
  itemGroups.value.push({
    name: newGroup.value.name,
    items: [],
  });

  // Очищаем форму и закрываем диалог
  newGroup.value = {
    name: "",
    description: "",
  };
  groupDialog.value = false;
};

const editGroup = (group: ItemGroup) => {
  editingGroup.value = {
    name: group.name,
    description: "", // Если у вас есть description в ItemGroup, добавьте его сюда
    originalName: group.name,
  };
  editGroupDialog.value = true;
};

const deleteGroup = async (groupName: string) => {
  if (
    confirm(
      'Вы уверены, что хотите удалить эту группу? Все вещи будут перемещены в раздел "Без группы"'
    )
  ) {
    const group = itemGroups.value.find((g) => g.name === groupName);
    if (group) {
      // Перемещаем все вещи в ungroupedItems
      ungroupedItems.value.push(...group.items as any);
      // Удаляем группу as any
      itemGroups.value = itemGroups.value.filter((g) => g.name !== groupName);
    }
  }
};

const saveEditedGroup = () => {
  const groupIndex = itemGroups.value.findIndex(
    (g) => g.name === editingGroup.value.originalName
  );
  if (groupIndex !== -1) {
    itemGroups.value[groupIndex].name = editingGroup.value.name;
    // Обновляем description, если он есть в вашей структуре данных
  }
  editGroupDialog.value = false;
};
</script>

<template>
  <v-container fluid class="pa-0">
    <!-- Заголовок категории -->
    <v-row class="ma-0">
      <v-col class="pa-0">
        <div
          class="category-header"
          :style="{ backgroundImage: `url(${category.image})` }"
        >
          <h1 class="text-h3">{{ category.name }}</h1>
        </div>
      </v-col>
    </v-row>

    <!-- Фильтры -->
    <v-row class="ma-0 mb-6">
      <v-col class="pa-2">
        <v-card>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6" md="3">
                <v-select
                  label="Сезон"
                  :items="seasons"
                  multiple
                  chips
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-select
                  label="Цвет"
                  :items="colors"
                  multiple
                  chips
                ></v-select>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Группы предметов одежды -->
    <v-row class="ma-0">
      <v-col class="pa-2">
        <v-expansion-panels>
          <v-expansion-panel v-for="(group, i) in itemGroups" :key="i">
            <v-expansion-panel-title>
              <div class="d-flex align-center justify-space-between w-100">
                <div class="d-flex align-center">
                  <span class="text-h6">{{ group.name }}</span>
                  <v-chip class="ml-4" size="small">
                    {{ group.items.length }}
                  </v-chip>
                </div>
                <div class="d-flex align-center group-actions">
                  <v-btn
                    icon
                    size="small"
                    variant="text"
                    @click.stop="editGroup(group)"
                  >
                    <v-icon>mdi-pencil</v-icon>
                    <v-tooltip activator="parent" location="top">
                      Редактировать группу
                    </v-tooltip>
                  </v-btn>
                  <v-btn
                    icon
                    size="small"
                    variant="text"
                    color="error"
                    @click.stop="deleteGroup(group.name)"
                  >
                    <v-icon>mdi-delete</v-icon>
                    <v-tooltip activator="parent" location="top">
                      Удалить группу
                    </v-tooltip>
                  </v-btn>
                </div>
              </div>
            </v-expansion-panel-title>

            <v-expansion-panel-text>
              <v-row>
                <v-col
                  v-for="item in group.items"
                  :key="item.id"
                  cols="12"
                  sm="6"
                  md="4"
                  lg="3"
                >
                  <v-card
                    :to="{ name: 'wardrobe-item', params: { id: item.id } }"
                    hover
                  >
                    <v-img :src="item.image" height="200" cover></v-img>

                    <v-card-title>{{ item.name }}</v-card-title>

                    <v-card-text>
                      <p>{{ item.description }}</p>
                      <v-chip-group>
                        <v-chip
                          v-for="season in item.season"
                          :key="season"
                          size="small"
                          color="primary"
                        >
                          {{ season }}
                        </v-chip>
                      </v-chip-group>
                      <v-chip-group>
                        <v-chip
                          v-for="color in item.color"
                          :key="color"
                          size="small"
                        >
                          {{ color }}
                        </v-chip>
                      </v-chip-group>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

        <!-- Вещи без группы -->
        <v-row class="mt-6" v-if="ungroupedItems.length > 0">
          <v-col cols="12">
            <div class="d-flex align-center mb-4">
              <span class="text-h6">Без группы</span>
              <v-chip class="ml-4" size="small">
                {{ ungroupedItems.length }}
              </v-chip>
            </div>
          </v-col>
          <v-col
            v-for="item in ungroupedItems"
            :key="item.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card
              :to="{ name: 'wardrobe-item', params: { id: item.id } }"
              hover
            >
              <v-img :src="item.image" height="200" cover></v-img>

              <v-card-title>{{ item.name }}</v-card-title>

              <v-card-text>
                <p>{{ item.description }}</p>
                <v-chip-group>
                  <v-chip
                    v-for="season in item.season"
                    :key="season"
                    size="small"
                    color="primary"
                  >
                    {{ season }}
                  </v-chip>
                </v-chip-group>
                <v-chip-group>
                  <v-chip v-for="color in item.color" :key="color" size="small">
                    {{ color }}
                  </v-chip>
                </v-chip-group>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

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
            @click="addItem"
          >
            <v-icon>mdi-hanger</v-icon>
            <v-tooltip activator="parent" location="left">
              Добавить вещь
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
        <v-tooltip activator="parent" location="left"> Добавить </v-tooltip>
      </v-btn>
    </div>

    <!-- Диалог добавления новой вещи -->
    <v-dialog v-model="dialog" max-width="600">
      <v-card>
        <v-card-title class="text-h5"> Новая вещь </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="newItem.name"
                  label="Название"
                  required
                  :rules="[(v) => !!v || 'Название обязательно']"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-select
                  v-model="newItem.group"
                  :items="itemGroups.map((g) => g.name)"
                  label="Группа"
                  clearable
                  hint="Оставьте пустым, чтобы добавить вещь без группы"
                  persistent-hint
                >
                  <template v-slot:prepend-item>
                    <v-list-item
                      title="Без группы"
                      @click="newItem.group = null"
                    >
                      <template v-slot:prepend>
                        <v-icon>mdi-cancel</v-icon>
                      </template>
                    </v-list-item>
                    <v-divider class="mt-2"></v-divider>
                  </template>
                </v-select>
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="newItem.description"
                  label="Описание"
                  rows="3"
                ></v-textarea>
              </v-col>

              <v-col cols="12" sm="6">
                <v-select
                  v-model="newItem.season"
                  :items="seasons"
                  label="Сезон"
                  multiple
                  chips
                ></v-select>
              </v-col>

              <v-col cols="12" sm="6">
                <v-select
                  v-model="newItem.color"
                  :items="colors"
                  label="Цвет"
                  multiple
                  chips
                ></v-select>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="newItem.imageUrl"
                  label="URL изображения"
                  hint="Укажите прямую ссылку на изображение"
                  persistent-hint
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="dialog = false">
            Отмена
          </v-btn>
          <v-btn
            color="primary"
            variant="text"
            @click="saveItem"
            :disabled="!newItem.name"
          >
            Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Диалог добавления новой группы -->
    <v-dialog v-model="groupDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h5"> Новая группа вещей </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="newGroup.name"
                  label="Название группы"
                  required
                  :rules="[(v) => !!v || 'Название обязательно']"
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
            :disabled="!newGroup.name"
          >
            Создать группу
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Диалог редактирования группы -->
    <v-dialog v-model="editGroupDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h5"> Редактировать группу </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="editingGroup.name"
                  label="Название группы"
                  required
                  :rules="[(v) => !!v || 'Название обязательно']"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="editingGroup.description"
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
            @click="editGroupDialog = false"
          >
            Отмена
          </v-btn>
          <v-btn
            color="primary"
            variant="text"
            @click="saveEditedGroup"
            :disabled="!editingGroup.name"
          >
            Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.category-header {
  height: 200px;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;
  padding: 24px;
  margin-bottom: 24px;
  position: relative;
}

.category-header::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.7));
}

.category-header h1 {
  color: white;
  position: relative;
  z-index: 1;
  margin: 0;
}

.add-button {
  position: fixed;
  bottom: 24px;
  right: 24px;
}

.v-expansion-panel-title {
  font-size: 1.1rem;
}

.v-expansion-panels {
  border-radius: 0;
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

.group-actions {
  opacity: 0.7;
  transition: opacity 0.2s;
}

.group-actions:hover {
  opacity: 1;
}

.v-expansion-panel-title:hover .group-actions {
  opacity: 1;
}
</style>
