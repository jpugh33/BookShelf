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

    function optimistic(setter, { applyOptimistic, applySuccess, applyFailure, action }) {
        // 1. Apply optimistic UI
        setter(prev => applyOptimistic(prev))

        return action()
        .then(result => {
            // 2. Apply success state
            setter(prev => applySuccess(prev, result))
            return result
        }).catch(err => {
            console.error(err.message)
            // 3. Roll back UI
            setter(prev => applyFailure(prev))
            throw err
        })
    }


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
        const tempId = `temp-${Date.now()}`
        const tempBook = { ...data, $id: tempId, userid: user.$id }

        return optimistic(setBooks, {
            applyOptimistic: prev => [...prev, tempBook],

            action: () =>
            databases.createDocument(
                DATABASE_ID,
                COLLECTION_ID,
                ID.unique(),
                { ...data, userid: user.$id },
                [
                Permission.read(Role.user(user.$id)),
                Permission.update(Role.user(user.$id)),
                Permission.delete(Role.user(user.$id))
                ]
            ),

            applySuccess: (prev, created) =>
            prev.map(b => (b.$id === tempId ? created : b)),

            applyFailure: prev =>
            prev.filter(b => b.$id !== tempId)
        })
    }

    async function deleteBook(id) {
        const deletedBook = books.find(b => b.$id === id)

        return optimistic(setBooks, {
            applyOptimistic: prev =>
            prev.filter(b => b.$id !== id),

            action: () =>
            databases.deleteDocument(
                DATABASE_ID,
                COLLECTION_ID,
                id
            ),

            applySuccess: prev => prev, // nothing to replace

            applyFailure: prev =>
            [...prev, deletedBook] // restore removed book
        })
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