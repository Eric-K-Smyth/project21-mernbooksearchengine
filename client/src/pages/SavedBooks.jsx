import React from 'react';
import { useQuery, useMutation } from '@apollo/client'; // Import necessary Apollo Client hooks
import { GET_ME } from '../utils/queries'; // Import your GraphQL query for user data
import { REMOVE_BOOK } from '../utils/mutations'; // Import your GraphQL mutation for removing a book
import Auth from '../utils/auth';

import { Container, Col, Card, Row, Button } from 'react-bootstrap';

const SavedBooks = () => {
  // Use the useQuery Hook to execute the GET_ME query
  const { loading, error, data } = useQuery(GET_ME);

  // Use the useMutation Hook to execute the REMOVE_BOOK mutation
  const [removeBook] = useMutation(REMOVE_BOOK);

  const userData = data?.me || {}; // Get user data from the query result

  // Define the function to handle deleting a book
  const handleDeleteBook = async (bookId) => {
    try {
      await removeBook({
        variables: { bookId },
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container>
      <h2 className="pt-5">
        {userData.savedBooks?.length
          ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
          : 'You have no saved books!'}
      </h2>
      <Row>
        {userData.savedBooks?.map((book) => (
          <Col md="4" key={book.bookId}>
            <Card border="dark">
              {book.image ? (
                <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant="top" />
              ) : null}
              <Card.Body>
                <Card.Title>{book.title}</Card.Title>
                <p className="small">Authors: {book.authors.join(', ')}</p>
                <Card.Text>{book.description}</Card.Text>
                {Auth.loggedIn() && (
                  <Button
                    className="btn-block btn-danger"
                    onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default SavedBooks;

