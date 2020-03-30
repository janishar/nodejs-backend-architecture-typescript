db = db.getSiblingDB('afteracademy-blog-db')

db.createUser({
	user: 'afteracademy-blog-db-user',
	pwd: 'changeit',
	roles: [{ role: 'readWrite', db: 'afteracademy-blog-db' }]
})

db.createCollection("api_keys")
db.createCollection("roles")

db.api_keys.insert({
	metadata: "To be used by the xyz vendor",
	key: "GCMUDiuY5a7WvyUNt9n3QztToSHzK7Uj",
	version: 1,
	status: true,
	createdAt: new Date(),
	updatedAt: new Date()
})

db.roles.insertMany([
	{ code: "LEARNER", status: true, createdAt: new Date(), updatedAt: new Date()},
	{ code: "WRITER", status: true, createdAt: new Date(), updatedAt: new Date()},
	{ code: "EDITOR", status: true, createdAt: new Date(), updatedAt: new Date()},
	{ code: "ADMIN", status: true, createdAt: new Date(), updatedAt: new Date()},
])