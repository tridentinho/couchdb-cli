import { Command } from 'commander';
import CouchDBClient from './couchdb';
import { environments } from './env';

const program = new Command();

function getClient(env: string) {
  const config = environments[env as keyof typeof environments];
  if (!config) {
    console.error('Ambiente não encontrado. Use dev, stg ou prd.');
    process.exit(1);
  }
  return new CouchDBClient(config);
}

// Comando para listar bancos
program
  .command('list-dbs <env>')
  .description('Listar bancos de dados')
  .action(async (env) => {
    const client = getClient(env);
    const dbs = await client.listDatabases();
    console.log(dbs);
  });

// Comando para listar usuários de um banco
program
  .command('list-users <env> <dbName>')
  .description('Listar usuários de um banco')
  .action(async (env, dbName) => {
    const client = getClient(env);
    const users = await client.listUsers(dbName);
    console.log(users);
  });

// Comando para criar banco
program
  .command('create-db <env> <dbName>')
  .description('Criar um banco de dados')
  .action(async (env, dbName) => {
    const client = getClient(env);
    const result = await client.createDatabase(dbName);
    console.log(result);
  });

// Comando para adicionar usuário a um banco
program
  .command('add-user <env> <dbName> <username>')
  .option('-r, --role <role>', 'Role do usuário')
  .description('Adicionar um usuário a um banco')
  .action(async (env, dbName, username, options) => {
    const client = getClient(env);
    const result = await client.addUserToDatabase(dbName, username, [options.role]);
    console.log(result);
  });

// Comando para remover usuário de um banco
program
  .command('remove-user <env> <dbName> <username>')
  .description('Remover um usuário de um banco')
  .action(async (env, dbName, username) => {
    const client = getClient(env);
    const result = await client.removeUserFromDatabase(dbName, username);
    console.log(result);
  });

// Comando para criar um usuário
program
  .command('create-user <env> <username> <password> <role>')
  .description('Criar um novo usuário')
  .action(async (env, username, password, role) => {
    const client = getClient(env);
    const result = await client.createUser(username, password, [role]);
    console.log(result);
  });

  // List server users
program
.command('list-server-users <env>')
.description('Listar usuários do servidor')
.action(async (env) => {
  const client = getClient(env);
  const users = await client.listServerUsers();
  console.log(users);
});

// Delete database
program
.command('delete-db <env> <dbName>')
.description('Deletar um banco de dados')
.action(async (env, dbName) => {
  const client = getClient(env);
  await client.deleteDatabase(dbName);
});

// Insert document
program
.command('insert-doc <env> <dbName> <doc>')
.description('Inserir um documento em um banco')
.action(async (env, dbName, doc) => {
  const client = getClient(env);
  const document = JSON.parse(doc);
  const result = await client.insertDocument(dbName, document);
  console.log(result);
});

// Get document
program
.command('get-doc <env> <dbName> <docId>')
.description('Buscar um documento em um banco')
.action(async (env, dbName, docId) => {
  const client = getClient(env);
  const result = await client.getDocument(dbName, docId);
  console.log(result);
});

// List documents
program
.command('list-docs <env> <dbName>')
.description('Listar documentos de um banco')
.action(async (env, dbName) => {
  const client = getClient(env);
  const result = await client.listDocuments(dbName);
  console.log(result);
});

// Update document
program
.command('update-doc <env> <dbName> <docId> <doc>')
.description('Atualizar um documento em um banco')
.action(async (env, dbName, docId, doc) => {
  const client = getClient(env);
  const document = JSON.parse(doc);
  const result = await client.updateDocument(dbName, docId, document);
  console.log(result);
});

// Delete document
program
.command('delete-doc <env> <dbName> <docId>')
.description('Deletar um documento de um banco')
.action(async (env, dbName, docId) => {
  const client = getClient(env);
  await client.deleteDocument(dbName, docId);
});

program.parse(process.argv);
