import { DataSource } from "typeorm"

export const appDataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'EVM_TRACKER2',
    entities: [__dirname + '/../**/*.entity.js'],
    // synchronize: true,
    
  })
