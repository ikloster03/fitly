<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const menuItems = ref([
  { id: 1, name: 'Дома', icon: 'mdi-home', route: '/' },
  { id: 2, name: 'Гардероб', icon: 'mdi-hanger', route: '/wardrobe' },
  { id: 3, name: 'Looks', icon: 'mdi-tshirt-crew', route: '/looks' },
  { id: 4, name: 'Календарь', icon: 'mdi-calendar', route: '/calendar' },
  { id: 5, name: 'Референсы', icon: 'mdi-image-multiple', route: '/references' },
])

const navigateTo = (route: string) => {
  router.push(route)
}
</script>

<template>
  <v-app>
    <!-- Серверная панель -->
    <v-navigation-drawer
      permanent
      location="left"
      width="72"
      class="servers-drawer"
      elevation="1"
    >
      <v-list density="compact" nav>
        <v-list-item
          v-for="item in menuItems"
          :key="item.id"
          :value="item"
          class="server-item my-2"
          min-height="0"
          @click="navigateTo(item.route)"
        >
          <template v-slot:prepend>
            <v-avatar size="48" color="grey-darken-3">
              <v-icon :icon="item.icon" size="24" color="grey-lighten-2"></v-icon>
            </v-avatar>
          </template>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Основной контент -->
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<style scoped>
.servers-drawer {
  background-color: #202225;
}

.main-content {
  background-color: #36393f;
  margin-left: 72px;
}

.server-item {
  margin-bottom: 8px;
  border-radius: 50%;
  transition: border-radius 0.2s;
}

.server-item:hover {
  border-radius: 16px;
  background-color: #5865f2;
}

:deep(.v-navigation-drawer__content) {
  scrollbar-width: thin;
  scrollbar-color: #202225 transparent;
}

:deep(.v-navigation-drawer__content::-webkit-scrollbar) {
  width: 8px;
}

:deep(.v-navigation-drawer__content::-webkit-scrollbar-track) {
  background: transparent;
}

:deep(.v-navigation-drawer__content::-webkit-scrollbar-thumb) {
  background-color: #202225;
  border-radius: 4px;
}
</style> 