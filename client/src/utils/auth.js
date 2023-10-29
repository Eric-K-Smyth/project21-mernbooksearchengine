// use this to decode a token and get the user's information out of it
import decode from 'jwt-decode';

// create a new class to instantiate for a user
class AuthService {
  // get user data
  getProfile() {
    return decode(this.getToken());
  }
  // Method to retrieve saved book IDs from user's profile data
getSavedBookIds() {
  const profile = this.getProfile();
  return profile.savedBooks.map((book) => book.bookId);
}


  // check if user's logged in
  loggedIn() {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token); // handwaiving here
  }

  // check if token is expired
  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      if (decoded.exp < Date.now() / 1000) {
        return true;
      } else return false;
    } catch (err) {
      return false;
    }
  }

  getToken() {
    // Retrieves the user token from localStorage
    const token = localStorage.getItem('id_token');
    console.log('Token:', token);
  
    if (!token) {
      console.log('No token found in local storage.');
      return null; // Return null when there's no token
    }
  
    const decodedPayload = decode(token);
   // console.log('Decoded Payload:', decodedPayload);
  
    return token; // Return the token after logging
  }

  login(idToken) {
    // Saves user token to localStorage
    localStorage.setItem('id_token', idToken);
    window.location.assign('/');
  }

  logout() {
    // Clear user token and profile data from localStorage
    localStorage.removeItem('id_token');
    // this will reload the page and reset the state of the application
    window.location.assign('/');
  }
}

export default new AuthService();
