import axios from 'axios'
import { BASE_URL } from '../constants/constants'

const instance =  axios.create({
    baseURL: BASE_URL
})

export const axiosPrivate =  axios.create({
    baseURL: BASE_URL,
    headers: {'Content-Type': 'application/json'},
    withCredentials: true,
})

export default instance