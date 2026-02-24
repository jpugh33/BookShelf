import { createContext, useState } from "react"

const DATABASE_ID = "699e04ea0023c05b2d8c"
const COLLECTION_ID = "699e07b400194a81416a"

export const BooksContext = createContext()

export function BooksProvider({ children }) {
    const [books, setBooks] = useState([])

    async function fetchBooks() {
        try {

        } catch (error) {
            console.error(error.message)
        }
    }

    async function fetchBookByID(id) {
        try {

        } catch (error) {
            console.error(error.message)
        }
    }

    async function createBook(data) {
        try {

        } catch (error) {
            console.error(error.message)
        }
    }

    async function deleteBook(id) {
        try {

        } catch (error) {
            console.error(error.message)
        }
    }

    return (
        <BooksContext.Provider
          value={{ books, fetchBooks, fetchBookByID, createBook, deleteBook }}
        >
          {children}
        </BooksContext.Provider>
    )
}