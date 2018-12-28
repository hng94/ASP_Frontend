export const listService = {
    getListById,
    createList
}

const baseURL = "http://localhost:4000";

function createList(list) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(list)
    };
    
    return fetch(`${baseURL}/lists/`, requestOptions)
    .then(handleResponse)
    .then(data => {
        return data;
    })
}

// function getBoards() {
//     const requestOptions = {
//         method: 'GET',
//         headers: { 'Content-Type': 'application/json' },
//     };

//     return fetch(`${baseURL}/boards`, requestOptions)
//         .then(handleResponse)
//         .then(data => {
//             return data;
//         })
// }

function getListById(listId) {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    };

    return fetch(`${baseURL}/lists?listID=${listId}`, requestOptions)
        .then(handleResponse)
        .then(data => {
            const list = data[0];
            return list;
        })
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                // logout();
                // window.location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}