import axios from 'axios';

interface CouchDBConfig {
  url: string;
  user: string;
  password: string;
}

class CouchDBClient {
  private config: CouchDBConfig;

  constructor(config: CouchDBConfig) {
    this.config = config;
  }

  private async request(method: 'get' | 'post' | 'put' | 'delete', endpoint: string, data?: any) {
    const auth = {
      username: this.config.user,
      password: this.config.password,
    };

    const domain = this.config.url.replace('http://', '').replace('https://', '');

    const url = `https://${auth.username}:${auth.password}@${domain}/${endpoint}`;
    return axios({ method, url, data });
  }

  // Listar bancos
  async listDatabases() {
    const response = await this.request('get', '_all_dbs');
    return response.data;
  }

  // Criar banco
  async createDatabase(dbName: string) {
    const response = await this.request('put', dbName);
    return response.data;
  }

  // Listar usuários (em _security)
  async listUsers(dbName: string) {
    const response = await this.request('get', `${dbName}/_security`);
    return response.data;
  }

  // Adicionar usuário a um banco
  async addUserToDatabase(dbName: string, username: string, roles?: string[]) {
    const security = await this.listUsers(dbName);
    console.log(security);
    if(!security.members.names) security.members.names = [];
    security.members.names.push(username); // Adiciona o usuário
    const response = await this.request('put', `${dbName}/_security`, security);
    return response.data;
  }

  // Remover usuário de um banco
  async removeUserFromDatabase(dbName: string, username: string) {
    const security = await this.listUsers(dbName);
    security.members.names = security.members.names.filter((name: string) => name !== username);
    const response = await this.request('put', `${dbName}/_security`, security);
    return response.data;
  }

  // Criar usuário
  async createUser(username: string, password: string, roles: string[]) {
    const data = {
      _id: `org.couchdb.user:${username}`,
      name: username,
      roles: roles,
      type: 'user',
      password: password,
    };
    const response = await this.request('post', '_users', data);
    return response.data;
  }

  async listServerUsers() {
    const response = await this.request('get', '_users/_all_docs?include_docs=true');
    const users = response.data.rows.map((row: any) => row.doc);
    return users.filter((user: any) => user.type === 'user');
  }

  async deleteDatabase(dbName: string) {
    const response = await this.request('delete', dbName);
    console.log(`Banco de dados ${dbName} removido com sucesso.`);
    return response.data;
  }

  async insertDocument(dbName: string, document: any) {
    const response = await this.request('post', `${dbName}`, document);
    return response.data;
  }

  async listDocuments(dbName: string) {
    const response = await this.request('get', `${dbName}/_all_docs`);
    return response.data;
  }

  async getDocument(dbName: string, docId: string) {
    const response = await this.request('get', `${dbName}/${docId}`);
    return response.data;
  }

  async updateDocument(dbName: string, docId: string, document: any) {
    const response = await this.request('put', `${dbName}/${docId}`, document);
    return response.data;
  }

  async deleteDocument(dbName: string, docId: string) {
    const doc = await this.getDocument(dbName, docId);
    const response = await this.request('delete', `${dbName}/${docId}?rev=${doc._rev}`);
    return response.data;
  }
}

export default CouchDBClient;
