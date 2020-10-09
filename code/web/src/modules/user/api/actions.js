// Imports
import axios from 'axios'
import { query, mutation } from 'gql-query-builder'
import cookie from 'js-cookie'

// App Import for routes object
import { routeApi } from '../../../setup/routes'

// Action types: each type has '/AUTH' added to the front of the string 
export const LOGIN_REQUEST = 'AUTH/LOGIN_REQUEST'
export const LOGIN_RESPONSE = 'AUTH/LOGIN_RESPONSE'
export const SET_USER = 'AUTH/SET_USER'
export const LOGOUT = 'AUTH/LOGOUT'

// Actions relating to the user information 

// Set a user after login or using localStorage token
export function setUser(token, user) {
  //if there is a localStorage token, set a default header for axios request that includes that token; otherwise delete that header; this fn is used later in actual axios requests 
  //then an action is returned that includes the user info passed in to fn 
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }

  return { type: SET_USER, user }
}

// Login a user using credentials
export function login(userCredentials, isLoading = true) {
  //first, action is dispatched to store that ultimately updates isLoading to true while the async request needs to be made 
  return dispatch => {
    dispatch({
      type: LOGIN_REQUEST,
      isLoading
    })

    //Uses axios library to make a request to the back-end; first argument is the routeApi, second is the query made to the database
    //the query targets the 'userLogin' operation to read data 
    //variables value is accepted as variable within the operation to get specific info for that particular user  
    //fields relates to the fields that are being requested/get returned 
    //Overall, this request is looking to see if the user exists in the database 
    return axios.post(routeApi, query({
      operation: 'userLogin',
      variables: userCredentials,
      fields: ['user {name, email, role}', 'token']
    }))

      .then(response => {
        //response is object - access data.data & get something like the following:
        // { userLogin: 
        //   { 
            // token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9", 
        //     user: { name: "Rachel Williams", email:      "rachelwilliams659@gmail.com", role: null } 
       //     }
       // }
        let error = ''

        //if response contains an error, set the user error to be that message
        if (response.data.errors && response.data.errors.length > 0) {
          error = response.data.errors[0].message
        
          //if there is no error & a userLogin token was returned, dispatch the setUser function above with the token & user from the response 
        } else if (response.data.data.userLogin.token !== '') {
          const token = response.data.data.userLogin.token
          const user = response.data.data.userLogin.user

          dispatch(setUser(token, user))

          //after user is set, localStorage & cookies are set with that info 
          loginSetUserLocalStorageAndCookie(token, user)
        }

        //another action is dispatched, which will ultimately update isLoading to false & display an error if needed 
        dispatch({
          type: LOGIN_RESPONSE,
          error
        })
      })
      //if the axios request errors, a different action is dispatched to the store, which also updates isLoading to false but displays an error msg to try again
      .catch(error => {
        dispatch({
          type: LOGIN_RESPONSE,
          error: 'Please try again'
        })
      })
  }
}

// Set user token and info in localStorage and cookie
export function loginSetUserLocalStorageAndCookie(token, user) {
  // Sets items in local storage for token and user, to avoid having to log in again every time the site is revisited 
  window.localStorage.setItem('token', token)
  window.localStorage.setItem('user', JSON.stringify(user))

  // Set cookie for SSR
  cookie.set('auth', { token, user }, { path: '/' })
}

// Register a user
export function register(userDetails) {
  return dispatch => {
    //makes an axios post request to add new user to server
    //targets userSignup operation passing in the variables provided
    //adds id, name, email info to database
    return axios.post(routeApi, mutation({
      operation: 'userSignup',
      variables: userDetails,
      fields: ['id', 'name', 'email']
    }))
  }
}

// Log out user and remove token from localStorage
export function logout() {
  return dispatch => {
    //remove user info from local storage & cookies
    logoutUnsetUserLocalStorageAndCookie()

    //dispatch action, which ultimately resets user info in store 
    dispatch({
      type: LOGOUT
    })
  }
}

// Unset user token and info in localStorage and cookie
export function logoutUnsetUserLocalStorageAndCookie() {
  // Remove token & user info from local storage 
  window.localStorage.removeItem('token')
  window.localStorage.removeItem('user')

  // Remove cookie
  cookie.remove('auth')
}

// Get user gender
export function getGenders() {
  return dispatch => {
    //makes query to database for userGenders operation to get back available genders?
    //returns id & gender name fields?  
    return axios.post(routeApi, query({
      operation: 'userGenders',
      fields: ['id', 'name']
    }))
  }
}
