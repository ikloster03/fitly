## Описание переходов

```mermaid
graph TD;
    Home[Главная] --> Wardrobe[Гардероб]
    Home --> Looks[Луки]
    Wardrobe --> Category[Категория одежды]
    Category --> ItemView[Просмотр вещи]
    Category --> ItemCreate[Создание вещи]
    ItemView --> ItemEdit[Редактирование вещи]
    ItemEdit --> Category
    ItemCreate --> Category
    ItemView --> Archive[Архив]
    Archive --> ItemView
    Category --> GroupCreate[Создание группы]
    Category --> GroupEdit[Редактирование группы]
    GroupCreate --> Category
    GroupEdit --> Category
    Looks --> LookCreate[Создание лука]
    Looks --> LookView[Просмотр лука]
    LookCreate --> Looks
    LookView --> LookEdit[Редактирование лука]
    LookEdit --> Looks

    classDef default fill:#f9f9f9,stroke:#333,stroke-width:2px;
    classDef active fill:#e1f5fe,stroke:#0288d1,stroke-width:2px;
    classDef archive fill:#fff3e0,stroke:#ff9800,stroke-width:2px;
    class Home,Wardrobe,Looks active;
    class Archive archive;
```

### Основные разделы

- **Главная** → **Гардероб** / **Луки**
  - Основная навигация по разделам приложения

### Гардероб

- **Категория одежды**
  - Просмотр списка вещей в категории
  - Управление группами вещей
  - Добавление новых вещей
- **Вещь**
  - Просмотр детальной информации
  - Редактирование характеристик
  - Архивация/восстановление

### Управление группами

- Создание новых групп
- Редактирование существующих групп
- Удаление групп

### Луки

- Просмотр списка луков
- Создание новых луков
- Редактирование существующих луков

### Архив

- Доступ к архивированным вещам
- Возможность восстановления вещей

## Особенности навигации

- Все изменения (создание, редактирование) возвращают пользователя к списку
- Архивация доступна только из режима просмотра вещи
- Группы управляются только из категории
