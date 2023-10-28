import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { SEARCH_BOOKS } from '../utils/queries';
import { SAVE_BOOK } from '../utils/mutations';
import { Container, Col, Form, Button, Card, Row } from 'react-bootstrap';
import Auth from '../utils/auth'; // Import the Auth utility to check if the user is logged in

const SearchBooks = () => {
  const [searchInput, setSearchInput] = useState('');
  
  const { loading, error, data } = useQuery(SEARCH_BOOKS, {
    variables: { searchTerm: searchInput },
  });
  
  const [saveBook] = useMutation(SAVE_BOOK);
  
  const savedBookIds = Auth.getSavedBookIds(); // Fetch saved book IDs from Auth utility
  
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    
    if (!searchInput) {
      return false;
    }
    
    // Perform the search
    setSearchInput('');
  };
  
  const handleSaveBook = async (bookId, title, authors, description, image, link) => {
    try {
      await saveBook({
        variables: { bookId, authors, description, title, image, link },
      });
    } catch (err) {
      console.error(err);
    }
  };
  
  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Search for Books!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name="searchInput"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type="text"
                  size="lg"
                  placeholder="Search for a book"
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type="submit" variant="success" size="lg">
                  Submit Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>
      
      <Container>
        <h2 className="pt-5">
          {data && data.searchBooks.length
            ? `Viewing ${data.searchBooks.length} results:`
            : 'Search for a book to begin'}
        </h2>
        <Row>
          {data && data.searchBooks.map((book) => {
            return (
              <Col md="4" key={book.bookId}>
                <Card border="dark">
                  {book.image ? (
                    <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant="top" />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className="small">Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    {Auth.loggedIn() && (
                      <Button
                        disabled={savedBookIds?.includes(book.bookId)}
                        className="btn-block btn-info"
                        onClick={() => handleSaveBook(book.bookId, book.title, book.authors, book.description, book.image, book.link)}>
                        {savedBookIds?.includes(book.bookId)
                          ? 'This book has already been saved!'
                          : 'Save this Book!'}
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SearchBooks;
