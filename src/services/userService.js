// import config from 'config';
// import { authHeader } from '../_helpers';
import axios from 'axios';

export const userService = {
    login,
    logout,
    register,
    getById,
};
const baseURL = "http://localhost:4000/api";

function login(email, password) {

    return axios.post(`${baseURL}/users/login`, {email, password})
        .then(response => {
            // login successful if there's a jwt token in the response
            const {data} = response;
            localStorage.setItem('user', JSON.stringify(data))
            return data;
        });
}

function logout() {
    localStorage.removeItem('user');
}

function getById(id) {
    const requestOptions = {
        method: 'GET',
        // headers: authHeader()
    };

    return fetch(`/users/${id}`, requestOptions).then(handleResponse);
}

function register(user) {
    return axios.post(`${baseURL}/users/register`, user).then(response => {
        const {data} = response;
        console.log(data);
    });
}



function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
                window.location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}