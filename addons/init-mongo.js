function seed(dbName, user, password) {
  db = db.getSiblingDB(dbName);
  db.createUser({
    user: user,
    pwd: password,
    roles: [{ role: 'readWrite', db: dbName }],
  });

  db.createCollection('api_keys');
  db.createCollection('roles');

  db.api_keys.insert({
    metadata: 'To be used by the xyz vendor',
    key: 'GCMUDiuY5a7WvyUNt9n3QztToSHzK7Uj',
    version: 1,
    status: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  db.roles.insertMany([
    { code: 'LEARNER', status: true, createdAt: new Date(), updatedAt: new Date() },
    { code: 'WRITER', status: true, createdAt: new Date(), updatedAt: new Date() },
    { code: 'EDITOR', status: true, createdAt: new Date(), updatedAt: new Date() },
    { code: 'ADMIN', status: true, createdAt: new Date(), updatedAt: new Date() },
  ]);
}

seed('afteracademy-blog-db', 'afteracademy-blog-db-user', 'changeit');
seed('afteracademy-blog-test-db', 'afteracademy-blog-test-db-user', 'changeit');
