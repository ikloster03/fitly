<template>
    <v-container fluid class="pa-0">
      <!-- Главный баннер -->
      <v-parallax
        src="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f"
        height="600"
      >
        <div class="d-flex flex-column fill-height justify-center align-center text-white text-center">
          <v-img src="/logo.svg" width="120" height="120" class="mb-4"/>
          <h1 class="text-h2 font-weight-bold mb-4">Ваш умный гардероб</h1>
          <div class="text-h5 mb-8">Организуйте свой гардероб. Создавайте образы. Одевайтесь стильно.</div>
          <v-btn
            color="primary"
            size="x-large"
            rounded="pill"
            class="text-capitalize"
            to="/wardrobe"
          >
            Начать сейчас
          </v-btn>
        </div>
      </v-parallax>
  
      <!-- Преимущества -->
      <v-container class="py-12">
        <v-row>
          <v-col cols="12" md="4">
            <v-card class="pa-4 h-100" elevation="0">
              <div class="text-center mb-4">
                <v-icon size="64" color="primary">mdi-hanger</v-icon>
              </div>
              <h3 class="text-h5 text-center mb-4">Организация гардероба</h3>
              <div class="text-body-1 text-center">
                Храните информацию о всех вещах в одном месте. Сортируйте по сезонам, цветам и категориям.
              </div>
            </v-card>
          </v-col>
  
          <v-col cols="12" md="4">
            <v-card class="pa-4 h-100" elevation="0">
              <div class="text-center mb-4">
                <v-icon size="64" color="primary">mdi-palette-outline</v-icon>
              </div>
              <h3 class="text-h5 text-center mb-4">Создание образов</h3>
              <div class="text-body-1 text-center">
                Комбинируйте вещи в стильные образы. Планируйте наряды заранее и экономьте время.
              </div>
            </v-card>
          </v-col>
  
          <v-col cols="12" md="4">
            <v-card class="pa-4 h-100" elevation="0">
              <div class="text-center mb-4">
                <v-icon size="64" color="primary">mdi-calendar-check</v-icon>
              </div>
              <h3 class="text-h5 text-center mb-4">Планирование</h3>
              <div class="text-body-1 text-center">
                Составляйте календарь нарядов. Отслеживайте частоту использования вещей.
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
  
      <!-- Статистика -->
      <v-sheet color="primary" class="py-12">
        <v-container>
          <v-row class="text-center text-white">
            <v-col cols="12" md="4">
              <div class="text-h3 font-weight-bold mb-2">1000+</div>
              <div class="text-h6">Довольных пользователей</div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="text-h3 font-weight-bold mb-2">5000+</div>
              <div class="text-h6">Созданных образов</div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="text-h3 font-weight-bold mb-2">15000+</div>
              <div class="text-h6">Организованных вещей</div>
            </v-col>
          </v-row>
        </v-container>
      </v-sheet>
  
      <!-- Призыв к действию -->
      <v-container class="py-12 text-center">
        <h2 class="text-h4 mb-6">Готовы организовать свой гардероб?</h2>
        <v-btn
          color="primary"
          size="x-large"
          rounded="pill"
          class="text-capitalize"
          to="/wardrobe"
        >
          Начать бесплатно
        </v-btn>
      </v-container>
    </v-container>
  </template>
  
  <style scoped>
  .v-parallax::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
  }
  </style> 