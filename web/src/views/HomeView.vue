<script setup lang="ts">
import { ref, computed } from 'vue'
import { mockLooks } from '@/mocks/looks'
import { mockItems } from '@/mocks/wardrobe'

// Данные для виджетов
const recentLooks = computed(() => mockLooks.slice(0, 4))
const recentItems = computed(() => mockItems.slice(0, 4))

// Статистика гардероба
const stats = computed(() => ({
  totalItems: mockItems.length,
  totalLooks: mockLooks.length,
  seasonalItems: mockItems.filter(item => item.season.includes('Лето')).length,
  unusedItems: mockItems.filter(item => !item.lastWorn).length
}))

// Погода (здесь будет API)
const weather = ref({
  temp: 24,
  condition: 'Солнечно',
  icon: 'mdi-weather-sunny'
})
</script>

<template>
  <v-container fluid>
    <!-- Приветствие и погода -->
    <v-row class="mb-6">
      <v-col cols="12" md="8">
        <h1 class="text-h4 mb-2">Добро пожаловать в ваш гардероб</h1>
        <div class="text-subtitle-1">Организуйте, планируйте, создавайте образы</div>
      </v-col>
      <v-col cols="12" md="4">
        <v-card>
          <v-card-text class="d-flex align-center">
            <v-icon size="36" color="primary" class="mr-4">{{ weather.icon }}</v-icon>
            <div>
              <div class="text-h5">{{ weather.temp }}°C</div>
              <div class="text-subtitle-2">{{ weather.condition }}</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Быстрые действия -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card class="mb-4">
          <v-card-text>
            <div class="d-flex flex-wrap gap-4">
              <v-btn
                prepend-icon="mdi-hanger"
                color="primary"
                to="/wardrobe/items/new"
              >
                Добавить вещь
              </v-btn>
              <v-btn
                prepend-icon="mdi-tshirt-crew"
                color="primary"
                to="/looks/new"
              >
                Создать образ
              </v-btn>
              <v-btn
                prepend-icon="mdi-calendar"
                color="primary"
                to="/calendar"
              >
                Запланировать
              </v-btn>
              <v-btn
                prepend-icon="mdi-tag-multiple"
                color="primary"
                to="/wardrobe"
              >
                Категории
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Статистика и рекомендации -->
    <v-row class="mb-6">
      <v-col cols="12" md="3">
        <v-card class="mb-4">
          <v-card-text>
            <div class="text-h6 mb-2">Ваш гардероб</div>
            <div class="d-flex justify-space-between mb-2">
              <span>Всего вещей:</span>
              <span class="font-weight-bold">{{ stats.totalItems }}</span>
            </div>
            <div class="d-flex justify-space-between mb-2">
              <span>Образов:</span>
              <span class="font-weight-bold">{{ stats.totalLooks }}</span>
            </div>
            <div class="d-flex justify-space-between mb-2">
              <span>Сезонных вещей:</span>
              <span class="font-weight-bold">{{ stats.seasonalItems }}</span>
            </div>
            <div class="d-flex justify-space-between">
              <span>Неиспользуемых:</span>
              <span class="font-weight-bold text-error">{{ stats.unusedItems }}</span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="9">
        <v-card class="mb-4">
          <v-card-title class="d-flex justify-space-between align-center">
            Рекомендации
            <v-btn
              variant="text"
              color="primary"
              size="small"
              to="/recommendations"
            >
              Все рекомендации
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-alert
              type="info"
              variant="tonal"
              class="mb-2"
            >
              <v-icon start>mdi-lightbulb</v-icon>
              У вас {{ stats.unusedItems }} вещей, которые вы давно не носили
            </v-alert>
            <v-alert
              type="success"
              variant="tonal"
              class="mb-2"
            >
              <v-icon start>mdi-weather-sunny</v-icon>
              Идеальная погода для легких нарядов
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Последние образы и вещи -->
    <v-row>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            Последние образы
            <v-btn
              variant="text"
              color="primary"
              size="small"
              to="/looks"
            >
              Все образы
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col
                v-for="look in recentLooks"
                :key="look.id"
                cols="6"
              >
                <v-card variant="outlined">
                  <v-img
                    :src="look.image"
                    height="150"
                    cover
                  ></v-img>
                  <v-card-text class="pa-2">
                    <div class="text-subtitle-2">{{ look.name }}</div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            Последние вещи
            <v-btn
              variant="text"
              color="primary"
              size="small"
              to="/wardrobe"
            >
              Весь гардероб
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col
                v-for="item in recentItems"
                :key="item.id"
                cols="6"
              >
                <v-card variant="outlined">
                  <v-img
                    :src="item.image"
                    height="150"
                    cover
                  ></v-img>
                  <v-card-text class="pa-2">
                    <div class="text-subtitle-2">{{ item.name }}</div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.gap-4 {
  gap: 16px;
}
</style>
