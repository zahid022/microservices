# Order Microservice

Bu microservice gələn JWT token-ləri user-microservice-nə göndərərək doğrulayır və eyni zamanda autentifikasiya olunmuş istifadəçiyə order yaratmaq, order siyahısına baxmaq üçün REST APİ təklif edir.

---

## İstifadə olunan Texnologiyalar

- [NestJS](https://nestjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [RabbitMQ](https://www.rabbitmq.com/)
- [Prisma](https://www.prisma.io/)
- [Docker Compose](https://docs.docker.com/compose/)
- [JWT](https://jwt.io/)

---

## Quraşdırma və İşə Salma

### Əvvəl şərtlər

- Node.js (v18 və ya daha yuxarı)
- npm
- Docker Compose

### Repozitoriyanı klonla

```bash
git clone https://github.com/zahid022/microservices
cd order-service
```

### Enviromnet-lər (`.env`) əlavə et

`.env` faylı yaradın və aşağıdakını əlavə edin:

```env
DATABASE_URL=postgresql://postgres:123456@localhost:5433/second_db

RABBITMQ_URL=amqp://guest:guest@localhost:5672
```

### Docker ilə başlatmaq

```bash
npm run start:docker
```

Bu əmrlə PostgreSQL işə düşəcək.

### Microservice-i işə salmaq

```bash
npm run start:dev
```

Bu komanda order-service microservisini NestJS development modunda işə salır.

---

---

## İstifadə

### REST API endpoint-ləri:

| Method | Endpoint         | Açıqlama               |
|--------|------------------|------------------------|
| POST   | `/orders`        | Order yaratmaq         |
| GET    | `/orders`        | Order siyahısı         |
| GET    | `/orders/:id`    | Order məlumatları      |

### RabbitMQ Message Pattern-ləri:

| Göndərilən Pattern             | Açıqlama                     |
|--------------------------------|------------------------------|
| `{ cmd: 'validate_token' }`    | JWT token-in doğruluğunu yoxlayır |

---

## Test

Unit testlər NestJS testing util-ları ilə yazılmışdır. Əsas test faylı:

- `order.service.spec.ts`

Testləri işə salmaq üçün:

```bash
npm run test
```

---

## Docker Compose Konfiqurasiyası

`docker-compose.yml` faylı aşağıdakı servisi ehtiva edir:

- `postgres-second` (PostgreSQL verilənlər bazası)

---

## Müəllif

- [Zahid Həsənzadə]
- GitHub: [github.com/zahid022]