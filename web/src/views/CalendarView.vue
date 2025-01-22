<script setup lang="ts">
import { ref, computed } from 'vue'
import { mockCalendarLooks } from '@/mocks/looks'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { CalendarLook } from '@/mocks/looks'

const today = ref(new Date().toISOString().substr(0, 10))
const viewType = ref('dayGridMonth')
const showLookDialog = ref(false)
const selectedDate = ref('')
const looks = ref<CalendarLook[]>(mockCalendarLooks)

// Моковые данные для погоды (здесь будет API)
const weather = ref({
  temp: 24,
  condition: 'Солнечно',
  icon: 'mdi-weather-sunny'
})

const newLook = ref({
  image: null,
  title: '',
  description: '',
  tags: [] as string[]
})

// Конфигурация календаря
const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: viewType.value,
  locale: 'ru',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: ''
  },
  editable: true,
  selectable: true,
  weekends: true,
  events: looks.value.map(look => ({
    id: look.id,
    title: look.title,
    start: look.date,
    extendedProps: {
      image: look.image,
      description: look.description,
      tags: look.tags
    }
  })),
  eventContent: (arg) => {
    return {
      html: `
        <div class="fc-content">
          <div class="d-flex align-center">
            ${arg.event.extendedProps.image ? 
              `<img src="${arg.event.extendedProps.image}" class="look-thumbnail mr-2"/>` : 
              ''}
            <div class="fc-title">${arg.event.title}</div>
          </div>
          <div class="fc-description text-caption">
            ${arg.event.extendedProps.description}
          </div>
        </div>
      `
    }
  },
  dateClick: (info) => {
    selectedDate.value = info.dateStr
    showLookDialog.value = true
  },
  eventClick: (info) => {
    const look = looks.value.find(l => l.id === Number(info.event.id))
    if (look) {
      newLook.value = { ...look }
      selectedDate.value = look.date
      showLookDialog.value = true
    }
  }
}))

const saveLook = () => {
  if (newLook.value.title) {
    const lookIndex = looks.value.findIndex(l => l.id === newLook.value.id)
    
    if (lookIndex !== -1) {
      // Обновляем существующий лук
      looks.value[lookIndex] = {
        ...newLook.value,
        date: selectedDate.value
      } as Look
    } else {
      // Добавляем новый лук
      looks.value.push({
        id: Date.now(),
        date: selectedDate.value,
        ...newLook.value,
        tags: newLook.value.tags || []
      } as Look)
    }
    
    showLookDialog.value = false
    newLook.value = {
      image: null,
      title: '',
      description: '',
      tags: []
    }
  }
}
</script>

<template>
  <v-container fluid class="pa-6">
    <h1>Календарь</h1>
    
    <!-- Переключатель вида -->
    <v-btn-toggle v-model="viewType" mandatory class="mb-4">
      <v-btn value="dayGridMonth">Месяц</v-btn>
      <v-btn value="dayGridWeek">Неделя</v-btn>
    </v-btn-toggle>
    
    <!-- Погода -->
    <v-card class="mb-4">
      <v-card-text class="d-flex align-center">
        <v-icon size="36" color="primary" class="mr-4">{{ weather.icon }}</v-icon>
        <div>
          <div class="text-h5">{{ weather.temp }}°C</div>
          <div class="text-subtitle-2">{{ weather.condition }}</div>
        </div>
      </v-card-text>
    </v-card>
    
    <!-- FullCalendar -->
    <v-sheet height="600">
      <FullCalendar
        :options="calendarOptions"
        class="calendar-container"
      />
    </v-sheet>

    <!-- Диалог для добавления/редактирования лука -->
    <v-dialog v-model="showLookDialog" max-width="500">
      <v-card>
        <v-card-title>
          Добавить лук на {{ selectedDate }}
        </v-card-title>
        <v-card-text>
          <v-file-input
            v-model="newLook.image"
            label="Загрузить фото"
            accept="image/*"
            prepend-icon="mdi-camera"
          ></v-file-input>
          <v-text-field
            v-model="newLook.title"
            label="Название"
          ></v-text-field>
          <v-textarea
            v-model="newLook.description"
            label="Описание"
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="saveLook">Сохранить</v-btn>
          <v-btn color="grey" @click="showLookDialog = false">Отмена</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style>
.calendar-container {
  height: 100%;
}

.look-thumbnail {
  width: 30px;
  height: 30px;
  object-fit: cover;
  border-radius: 50%;
  margin-top: 4px;
}

.fc-event {
  cursor: pointer;
}

.fc-event-title {
  font-size: 0.9em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Стили для русской локализации */
.fc {
  font-family: 'Roboto', sans-serif;
}

.fc-button {
  text-transform: capitalize;
}

.fc-description {
  font-size: 0.8em;
  color: #666;
  margin-top: 2px;
}

.d-flex {
  display: flex;
}

.align-center {
  align-items: center;
}

.mr-2 {
  margin-right: 8px;
}
</style> 