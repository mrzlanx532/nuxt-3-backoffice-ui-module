## Готовые layouts

Находятся в папке `./playground/layouts`

## Темы

#### Как выставить тему?

```ts
// nuxt.config.ts
...
css: [
    '@mrzlanx532/nuxt-3-backoffice-ui/dist/runtime/assets/scss/themes/default.scss',
]
...
```

#### Доступные темы:
1. `default.scss`
2. `alt-1.scss`
3. `alt-2.scss`

## Правила построения архитектуры

#### Создание компонента формы (input, select и подобное)

1. При удалении (очищении) значения из компонента `update:modelValue` отправляет `null`
