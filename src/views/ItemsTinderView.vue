<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { mockItems } from '@/mocks/wardrobe'

const route = useRoute()
const router = useRouter()

interface Item {
  id: number
  name: string
  image: string
  description?: string
  tags: string[]
}

interface Look {
  id: number
  name: string
  image: string
  items?: Item[]
}

const items = ref<Item[]>(mockItems)
const currentIndex = ref(0)
const isDragging = ref(false)
const startX = ref(0)
const offsetX = ref(0)

// Добавим моковые данные для лука
const currentLook = ref<Look>({
  id: parseInt(route.params.lookId as string),
  name: 'Повседневный образ',
  image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27',
  items: []
})

const handleTouchStart = (e: TouchEvent) => {
  startDrag(e.touches[0].clientX)
}

const handleMouseDown = (e: MouseEvent) => {
  startDrag(e.clientX)
}

const startDrag = (clientX: number) => {
  isDragging.value = true
  startX.value = clientX
  offsetX.value = 0
}

const handleTouchMove = (e: TouchEvent) => {
  if (isDragging.value) {
    updateDrag(e.touches[0].clientX)
  }
}

const handleMouseMove = (e: MouseEvent) => {
  if (isDragging.value) {
    updateDrag(e.clientX)
  }
}

const updateDrag = (clientX: number) => {
  offsetX.value = clientX - startX.value
}

const handleTouchEnd = () => {
  endDrag()
}

const handleMouseUp = () => {
  endDrag()
}

const endDrag = () => {
  isDragging.value = false
  if (Math.abs(offsetX.value) > 100) {
    if (offsetX.value > 0) {
      addItem()
    } else {
      skipItem()
    }
  }
  offsetX.value = 0
}

const addItem = () => {
  // Здесь будет логика добавления вещи в лук
  console.log('Добавлена вещь:', items.value[currentIndex.value])
  nextItem()
}

const skipItem = () => {
  console.log('Пропущена вещь:', items.value[currentIndex.value])
  nextItem()
}

const nextItem = () => {
  if (currentIndex.value < items.value.length - 1) {
    currentIndex.value++
  } else {
    // Вернуться к луку, когда вещи закончились
    router.back()
  }
}
</script>

<template>
     <!-- Заголовок -->
     <div class="text-center mb-6">
      <v-btn
        icon="mdi-arrow-left"
        variant="text"
        @click="router.back()"
        class="float-left"
      ></v-btn>
    </div>
  <v-container class="fill-height">
   

    <v-row class="fill-height" justify="center" align="start">
      <!-- Карточка текущего лука (слева) -->
      <v-col cols="12" sm="5" md="4" lg="3">
        <v-card class="current-look-card sticky-card">
          <v-img
            :src="currentLook.image"
            height="400"
            cover
            class="look-preview"
          >
            <template v-slot:placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <v-icon size="large" color="grey-lighten-1">
                  mdi-image
                </v-icon>
              </div>
            </template>
            <!-- Оверлей с информацией -->
            <div class="look-info-overlay">
              <div class="text-h6 text-white">
                {{ currentLook.name }}
              </div>
              <div class="text-subtitle-2 text-white">
                {{ currentLook.items?.length || 0 }} вещей в образе
              </div>
            </div>
          </v-img>
        </v-card>
      </v-col>

      <!-- Карточка вещи для свайпа (справа) -->
      <v-col cols="12" sm="7" md="6" lg="5">
        <v-card
          v-if="items[currentIndex]"
          class="mx-auto item-card"
          :style="{
            transform: isDragging ? `translateX(${offsetX}px) rotate(${offsetX * 0.1}deg)` : '',
          }"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
          @mousedown="handleMouseDown"
          @mousemove="handleMouseMove"
          @mouseup="handleMouseUp"
          @mouseleave="handleMouseUp"
        >
          <v-img
            :src="items[currentIndex].image"
            height="400"
            cover
          ></v-img>

          <v-card-title>{{ items[currentIndex].name }}</v-card-title>

          <v-card-subtitle v-if="items[currentIndex].tags.length">
            {{ items[currentIndex].tags.join(', ') }}
          </v-card-subtitle>

          <v-card-text v-if="items[currentIndex].description">
            {{ items[currentIndex].description }}
          </v-card-text>

          <!-- Кнопки управления -->
          <v-card-actions class="justify-center pa-4">
            <v-btn
              color="error"
              icon="mdi-close"
              variant="tonal"
              size="large"
              class="mx-2"
              @click="skipItem"
            ></v-btn>
            
            <v-btn
              color="success"
              icon="mdi-plus"
              variant="tonal"
              size="large"
              class="mx-2"
              @click="addItem"
            ></v-btn>
          </v-card-actions>
        </v-card>

        <!-- Сообщение, когда вещи закончились -->
        <v-card
          v-else
          class="mx-auto text-center pa-6"
        >
          <v-icon
            size="64"
            color="grey-lighten-1"
            class="mb-4"
          >
            mdi-hanger
          </v-icon>
          <div class="text-h6 mb-2">Вещи закончились</div>
          <div class="text-body-1 mb-4">Вы просмотрели все доступные вещи</div>
          <v-btn
            color="primary"
            @click="router.back()"
          >
            Вернуться к луку
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.current-look-card {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
}

.sticky-card {
  position: sticky;
  top: 24px;
}

.look-preview {
  position: relative;
}

.look-info-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
  color: white;
}

.item-card {
  transition: transform 0.3s ease;
  touch-action: none;
  user-select: none;
}

.item-card:not(.dragging) {
  transition: transform 0.3s ease;
}

@media (max-width: 599px) {
  .sticky-card {
    position: relative;
    top: 0;
    margin-bottom: 16px;
  }
}
</style> 