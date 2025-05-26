# Базовый образ
FROM node:18-alpine

# Устанавливаем необходимые зависимости для сборки
RUN apk add --no-cache python3 make g++ git

# Рабочая директория
WORKDIR /app

# Устанавливаем concurrently глобально
RUN npm install -g concurrently

# Копируем только package.json из packages
COPY packages/server/package*.json ./packages/server/
COPY packages/web/package*.json ./packages/web/

# Устанавливаем зависимости для каждого проекта
WORKDIR /app/packages/server
RUN npm install

WORKDIR /app/packages/web
RUN npm install

# Копируем исходный код
WORKDIR /app
COPY . .

# Открываем порты
EXPOSE 3000 5173

# Запускаем оба приложения одновременно
CMD ["concurrently", "cd packages/server && npm run start", "cd packages/web && HOST=0.0.0.0 npm run dev"] 