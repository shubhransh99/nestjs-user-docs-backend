import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { Sequelize } from 'sequelize-typescript';
import { User } from 'src/entities/user.entity';
import { Role } from 'src/entities/role.entity';
import { Permission } from 'src/entities/permission.entity';
import { hashPassword } from 'src/shared/utils/password.util';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let sequelize: Sequelize;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    sequelize = moduleFixture.get(Sequelize);

    // Reset DB state (optional depending on test DB strategy)
    await sequelize.sync({ force: true });

    // Seed role + permissions manually
    const role = await Role.create({ name: 'admin' });
    const perms = await Permission.bulkCreate([
      { name: 'user.create' },
      { name: 'user.read' },
    ]);
    await role.$set('permissions', perms);

    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: await hashPassword('pass123'),
      role_id: role.id,
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it('should reject access to protected route without token', () => {
    return request(app.getHttpServer()).get('/users').expect(401);
  });

  it('should login and receive JWT', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'pass123' })
      .expect(201);

    expect(response.body).toHaveProperty('access_token');
    token = response.body.access_token;
  });

  it('should access protected route with valid token', () => {
    return request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('should reject login with wrong password', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'wrong' })
      .expect(401);
  });
});
