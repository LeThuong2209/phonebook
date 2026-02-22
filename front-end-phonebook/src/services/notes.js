import axios from 'axios';

const baseUrl = '/api/person'

const getAllNotes = () => {
    const request = axios.get(baseUrl)
    return request.then((response) => response.data)
}

const create = (object) => {
    const request = axios.post(baseUrl, object)
    return request.then(response => response.data)
}

const removePerson = (id) => {
    return axios.delete(`${baseUrl}/${id}`)
}

const update = (id, newObj) => {
    const request = axios.put(`${baseUrl}/${id}`, newObj)
    return request.then(response => response.data)
}

export default {getAllNotes, create, removePerson, update}