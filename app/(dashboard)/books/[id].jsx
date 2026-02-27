import { StyleSheet } from 'react-native'
import { useLocalSearchParams } from 'expo-router'

// themed components
import ThemedText from "../../../components/ThemedText"
import ThemedView from "../../../components/ThemedView"
import ThemedButton from "../../../components/ThemedButton"
import ThemedCard from "../../../components/ThemedCard"
import Spacer from "../../../components/Spacer"

const BookDetails = () => {
    const { id } = useLocalSearchParams()

    return (
        <ThemedView safe={true} styles={styles.container}>
          <ThemedText>BookDetails - {id}</ThemedText>
        </ThemedView>
  )
}

export default BookDetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "stretch"
    }
})