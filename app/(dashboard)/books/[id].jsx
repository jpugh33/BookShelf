import { StyleSheet, Text } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { useBooks } from '../../../hooks/useBooks'
import { Colors } from '../../../constants/Colors'

// themed components
import ThemedText from "../../../components/ThemedText"
import ThemedView from "../../../components/ThemedView"
import ThemedButton from "../../../components/ThemedButton"
import ThemedCard from "../../../components/ThemedCard"
import ThemedLoader from "../../../components/ThemedLoader"
import Spacer from "../../../components/Spacer"

const BookDetails = () => {
    const [book, setBook] = useState(null)

    const { id } = useLocalSearchParams()
    const { fetchBookByID, deleteBook } = useBooks()
    const router = useRouter()

    const handleDelete = async () => {
        await deleteBook(id)
        router.replace('/books')
    }

    useEffect(() => {
        async function loadBook() {
            const bookData = await fetchBookByID(id)
            setBook(bookData)
        }

        loadBook()
    }, [id])

    if (!book) {
        return (
          <ThemedView safe={true} style={styles.container}>
            <ThemedLoader />
          </ThemedView>
        )
    }

    return (
        <ThemedView safe={true} style={styles.container}>
          <ThemedCard style={styles.card}>
            <ThemedText style={styles.title}>{book.title}</ThemedText>
            <ThemedText>Written by {book.author}</ThemedText>
            <Spacer />

            <ThemedText title={true}>Book Description:</ThemedText>
            <Spacer height={10} />

            <ThemedText>{book.description}</ThemedText>
          </ThemedCard>

          <ThemedButton style={styles.delete} onPress={handleDelete}>
            <Text style={{ color: '#fff', textAlign: 'center' }}>
              Delete Book
            </Text>
          </ThemedButton>
        </ThemedView>
  )
}

export default BookDetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "stretch"
    },
    title: {
        fontSize: 22,
        marginVertical: 10
    },
    card: {
        margin: 20
    },
    delete: {
        marginTop: 40,
        backgroundColor: Colors.warning,
        width: 200,
        alignSelf: 'center'
    }
})