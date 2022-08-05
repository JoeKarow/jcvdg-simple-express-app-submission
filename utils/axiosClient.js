import axios from 'axios'

const baseURL = () => {
	if (process.env.NODE_ENV === 'development')
		return `http://localhost:${process.env.PORT || 3000}`
	return process.env.VERCEL_URL
}

const axiosClient = axios.create({
	baseURL: baseURL(),
})

export default axiosClient
