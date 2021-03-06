import Item from '../../subscription/Item';
import userReducer from './state';

describe('Reducer Testing', () => {
  let initState;
  beforeEach(() => {
    initState = {
      error: null,
      isLoading: false,
      isAuthenticated: false,
      details: null
    }
  })
  it('should check if SET_USER', () => {


    const actionSetUser = {
      type: "AUTH/SET_USER",
      user: {
        name: 'Bob',
        email: 'bob@aol.com',
        role: 'USER'
      }
    }
    
    const updatedState = {
      error: null,
      isLoading: false,
      isAuthenticated: true,
      details: {
        name: 'Bob',
        email: 'bob@aol.com',
        role: 'USER'
      }
    } 

    const result = userReducer(initState, actionSetUser);

    expect(result).toEqual(updatedState);
  });

  it('should check LOGIN_REQUEST', () => {
      const actionLoginReq = {
        type: "AUTH/LOGIN_REQUEST",
        isLoading: true
      }

      const updatedState = {
        error: null,
        isLoading: true,
        isAuthenticated: false,
        details: null
      }

    const result = userReducer(initState, actionLoginReq);

    expect(result).toEqual(updatedState);
  })

  it('should check LOGIN_RESPONSE', () => {
    const actionLoginResponse = {
      type: 'AUTH/LOGIN_RESPONSE',
      error: '',
    }

    const updatedState = {
        error: '',
        isLoading: false,
        isAuthenticated: false,
        details: null
      }

    const result = userReducer(initState, actionLoginResponse)

    expect(result).toEqual(updatedState)

  })

  it('should check LOGOUT reducer', () => {
    const actionLogout = {
      type: 'AUTH/LOGOUT'
    }

    const updatedState = {
      error: null,
      isLoading: false,
      isAuthenticated: false,
      details: null
    }

    const result = userReducer(initState, actionLogout);

    expect(result).toEqual(updatedState);
  })

  it('should by default return state', () => {
    const actionDoesNotExist = {};

    const updatedState = {
      error: null,
      isLoading: false,
      isAuthenticated: false,
      details: null
    }

    const result = userReducer(initState, actionDoesNotExist);

    expect(result).toEqual(updatedState);


  })
})