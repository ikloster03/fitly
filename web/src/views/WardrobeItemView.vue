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
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
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

const addCharacteristic = () => {
  item.value.characteristics.push({
    name: "",
    value: "",
  });
};

const removeCharacteristic = (index: number) => {
  item.value.characteristics.splice(index, 1);
};

const saveItem = async () => {
  // Здесь будет логика сохранения вещи
  // TODO: Добавить сохранение в базу данных или store
  console.log("Сохраняем вещь:", item.value);
  router.back();
};

onMounted(async () => {
  const itemId = route.params.id;
  if (itemId) {
    isEditing.value = true;
    // Загружаем данные из моков
    const foundItem = mockItems.find((i) => i.id === Number(itemId));
    if (foundItem) {
      item.value = { ...foundItem };
    }
  }
});
</script>

<style scoped>
.v-expansion-panel {
  background-color: transparent !important;
  box-shadow: none !important;
}
</style>
