import { createContext, useEffect, useState } from "react"
import { databases, client } from "../lib/appwrite"
import { ID, Permission, Query, Role } from "react-native-appwrite"
import { useUser } from "../hooks/useUser"

const DATABASE_ID = "699e04ea0023c05b2d8c"
const COLLECTION_ID = "699e07b400194a81416a"

export const BooksContext = createContext()

export function BooksProvider({ children }) {
    const [books, setBooks] = useState([])
    const { user } = useUser()

    async function fetchBooks() {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTION_ID,
                [
                    Query.equal('userid', user.$id)
                ]
            )

            setBooks(response.documents)
            console.log(response.documents)
        } catch (error) {
            console.error(error.message)
        }
    }

    async function fetchBookByID(id) {
        try {
            const response = await databases.getDocument(
                DATABASE_ID,
                COLLECTION_ID,
                id
            )

            return response
        } catch (error) {
            console.error(error.message)
        }
    }

    async function createBook(data) {
        const temp = { ...data, $id: `temp-${Date.now()}`, userid: user.$id }
        setBooks(prev => [...prev, temp])

        try {
            const created = await databases.createDocument(
                DATABASE_ID,
                COLLECTION_ID,
                ID.unique(),
                { ...data, userid: user.$id },
                [
                    Permission.read(Role.user(user.$id)),
                    Permission.update(Role.user(user.$id)),
                    Permission.delete(Role.user(user.$id))
                ]
            )

            setBooks(prev =>
                prev.map(b => (b.$id === temp.$id ? created : b))
            )

            return created
        } catch (err) {
            console.error(err.message)

            setBooks(prev =>
                prev.filter(b => b.$id !== temp.$id)
            )
        }
    }

    async function deleteBook(id) {
        try {

        } catch (error) {
            console.error(error.message)
        }
    }

    useEffect(() => {
        if (user) {
            fetchBooks()
        } else {
            setBooks([])
        }
    }, [user])

    return (
        <BooksContext.Provider
          value={{ books, fetchBooks, fetchBookByID, createBook, deleteBook }}
        >
          {children}
        </BooksContext.Provider>
    )
}