import axios from './axiosClient'
import Book from '../models/Book'
export const apiBooks = async () => {
	try {
		const url = `https://api.nytimes.com/svc/books/v3/lists//hardcover-fiction?api-key=${process.env.NYT_API}`
		const booksData = await axios.get(url)
		if (booksData.status !== 200) throw 'NYTimes Fetch error'
		const books = booksData.data.results.books
		// process results w/ the DB
		for (let i = 0; i < books.length; i++) {
			const book = books[i]
			const inDB = await Book.find({ isbn: String(book['primary_isbn13']) })
			if (inDB.length > 0) {
				book.added = true
			}
		}
		return { data: books }
	} catch (error) {
		console.log(error)
		return { message: `internal server error: ${error}` }
	}
}
