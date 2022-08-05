import axios from './axiosClient'
import Book from '../models/Book'
import dbConnect from './dbConnect'
export const apiBooks = async () => {
	try {
		const url = `https://api.nytimes.com/svc/books/v3/lists//hardcover-fiction?api-key=${process.env.NYT_API}`
		const booksData = await axios.get(url)
		if (booksData.status !== 200) throw 'NYTimes Fetch error'
		await dbConnect()
		const books = booksData.data.results.books
		const inDB = await Book.find();
			// cross reference books from NYT list with db book list, and tag as added=true
      books.forEach( book => {
        inDB.forEach( dbBook => {
            if (dbBook.isbn === book['primary_isbn13']) book.added=true;
        })
      })
		return { data: books }
	} catch (error) {
		console.log(error)
		return { message: `internal server error: ${error}` }
	}
}
