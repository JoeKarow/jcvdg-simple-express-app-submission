import axios from 'axios'

const baseURL = () => {
	if (process.env.NODE_ENV === 'development')
		return `http://localhost:${process.env.PORT || 3000}`
	if (process.env.VERCEL) return process.env.VERCEL_URL
	return
}

const axiosClient = axios.create({
	baseURL: baseURL(),
})

export default axiosClient
