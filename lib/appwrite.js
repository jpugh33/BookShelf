import { Client, Account, Avatars, Databases } from 'react-native-appwrite'

export const client = new Client()
    .setProject("6993866c0029579b8ff1")
    .setPlatform("dev.jpugh33.bookshelf")
    .setEndpoint("https://fra.cloud.appwrite.io/v1");

export const account = new Account(client)
export const avatar = new Avatars(client)
export const databasees = new Databases(client)