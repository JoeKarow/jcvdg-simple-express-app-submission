import Book from '../../../models/Book'
import dbConnect from '../../../utils/dbConnect'
import axios from '../../../utils/axiosClient'

const handler = async (req, res) => {
	const { method } = req

	// connect to database
	await dbConnect()

	// create book
	if (method === 'POST') {
		try {
			const newBook = await new Book(req.body).save()
			res
				.status(201)
				.json({ data: newBook, message: 'Book added successfully!' })
		} catch (error) {
			res.status(500).json({ message: 'internal server error' })
			console.log(error)
		}
	}

	if (method === 'GET') {
		try {
			const url = `https://api.nytimes.com/svc/books/v3/lists//hardcover-fiction?api-key=${process.env.NYT_API}`
			const booksData = await axios.get(url)
			if (booksData.status !== 200) throw 'NYTimes Fetch error'
			const books = booksData.data.results.books
      const inDB = await Book.find();
			// cross reference books from NYT list with db book list, and tag as added=true
      books.forEach( book => {
        inDB.forEach( dbBook => {
            if (dbBook.isbn === book['primary_isbn13']) book.added=true;
        })
      })
			res.status(200).json({ data: books })
		} catch (error) {
			res.status(500).json({ message: `internal server error: ${error}` })
			console.log(error)
		}
	}
}
export default handler
