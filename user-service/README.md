# User Microservice

Bu microservice digər microservicelərdən gələn JWT token-lərin doğruluğunu yoxlayır və eyni zamanda istifadəçi qeydiyyatı və girişi üçün REST API təklif edir.

---

## İstifadə olunan Texnologiyalar

- [NestJS](https://nestjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [RabbitMQ](https://www.rabbitmq.com/)
- [TypeORM](https://typeorm.io/)
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
cd user-service
```

### Enviromnet-lər (`.env`) əlavə et

`.env` faylı yaradın və aşağıdakını əlavə edin:

```env
JWT_SECRET=supersecret123

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=123456
DB_NAME=mydb

RABBITMQ_URL=amqp://guest:guest@localhost:5672
```

### Docker ilə başlatmaq

```bash
npm run start:docker
```

Bu əmrlə həm PostgreSQL, həm də RabbitMQ docker konteynerləri işə düşəcək.

---

## İstifadə

### REST API endpoint-ləri:

| Method | Endpoint         | Açıqlama               |
|--------|------------------|------------------------|
| POST   | `/auth/register` | İstifadəçi qeydiyyatı  |
| POST   | `/auth/login`    | İstifadəçi girişi      |
| GET    | `/user/:id`      | İstifadəçi məlumatları |

### RabbitMQ Message Pattern-ləri:

| Pattern                        | Açıqlama                     |
|--------------------------------|------------------------------|
| `{ cmd: 'validate_token' }`    | JWT token-in doğruluğunu yoxlayır |

---

## Test

Unit testlər NestJS testing util-ları ilə yazılmışdır. Əsas test faylı:

- `auth.service.spec.ts`

Testləri işə salmaq üçün:

```bash
npm run test
```

---

## Docker Compose Konfiqurasiyası

`docker-compose.yml` faylı aşağıdakı servisləri ehtiva edir:

- `postgres-first` (PostgreSQL verilənlər bazası)
- `rabbitmq` (Mesaj broker)

---

## Müəllif

- [Zahid Həsənzadə]
- GitHub: [github.com/zahid022]

---

## Qeyd

Bu microservice NestJS əsaslı authentication sistemidir. Digər microservicelər RabbitMQ vasitəsilə token-in etibarlılığını yoxlaya bilər. REST API vasitəsilə qeydiyyat və giriş funksionallığı da mövcuddur.

---