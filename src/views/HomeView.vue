<script setup lang="ts">
import { ref, computed } from 'vue'
import { mockLooks } from '@/mocks/looks'
import { mockItems } from '@/mocks/wardrobe'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

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

// Данные для графика использования гардероба
const usageData = ref([
  { date: '2024-01', count: 15 },
  { date: '2024-02', count: 18 },
  { date: '2024-03', count: 12 },
  { date: '2024-04', count: 22 },
  { date: '2024-05', count: 25 },
  { date: '2024-06', count: 20 }
])

const chartData = computed(() => ({
  labels: usageData.value.map(d => d.date),
  datasets: [{
    label: 'Использование',
    data: usageData.value.map(d => d.count),
    borderColor: '#1867C0',
    backgroundColor: '#5CBBF6',
    tension: 0.4
  }]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
}

const currentUsage = computed(() => {
  const lastMonth = usageData.value[usageData.value.length - 1]
  const previousMonth = usageData.value[usageData.value.length - 2]
  const change = lastMonth.count - previousMonth.count
  return {
    current: lastMonth.count,
    change,
    trend: change > 0 ? 'positive' : 'negative'
  }
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

      <!-- График использования -->
      <v-col cols="12" md="4">
        <v-card class="mb-4">
          <v-card-title class="pb-0">Использование гардероба</v-card-title>
          <v-card-text>
            <div class="d-flex align-center mb-2">
              <span class="text-h4 mr-2">{{ currentUsage.current }}</span>
              <v-chip
                :color="currentUsage.trend === 'positive' ? 'success' : 'error'"
                size="small"
                class="ml-2"
              >
                <v-icon
                  start
                  size="small"
                >
                  {{ currentUsage.trend === 'positive' ? 'mdi-arrow-up' : 'mdi-arrow-down' }}
                </v-icon>
                {{ Math.abs(currentUsage.change) }}
              </v-chip>
            </div>
            <div class="text-caption text-medium-emphasis mb-4">
              образов за последний месяц
            </div>
            
            <div style="height: 200px">
              <Line
                :data="chartData"
                :options="chartOptions"
              />
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Рекомендации -->
      <v-col cols="12" md="5">
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

.text-medium-emphasis {
  color: rgba(0, 0, 0, 0.6);
}
</style>
