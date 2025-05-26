# Базовый образ
FROM node:18-alpine

# Рабочая директория
WORKDIR /app

# Устанавливаем concurrently глобально
RUN npm install -g concurrently

# Копируем файлы package.json и yarn.lock
COPY package*.json yarn.lock ./
COPY packages/server/package*.json ./packages/server/
COPY packages/web/package*.json ./packages/web/

# Устанавливаем зависимости
RUN yarn install

# Копируем исходный код
COPY . .

# Собираем проекты
RUN cd packages/server && yarn build
RUN cd packages/web && yarn build

# Открываем порты
EXPOSE 3000 5173

# Запускаем оба приложения одновременно
CMD concurrently "cd packages/server && yarn start" "cd packages/web && HOST=0.0.0.0 yarn dev" 