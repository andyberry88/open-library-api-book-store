import React from 'react';
import styled from '@emotion/styled';

const BookWrapper = styled.div`
    width: 50%;
`;

const BookDetails = styled.div`
    display: flex;
    img, ul {
        max-width: 50%;
    }
`;

export default ({
    ID: olid,
    title,
    url,
    numberOfPages,
    coverUrl,
    authors,
    publishers,
    publishDate,
}) => <BookWrapper>
    <a href={url}>
        <h1>{title}</h1>
    </a>
    <BookDetails>
        <img src={coverUrl} alt={title} />
        <div>
            <ul>
                <li>OLID: {olid}</li>
                <li>Page: {numberOfPages}</li>
                <li>Published: {publishDate}</li>
                <li>Publishers: {publishers.map(publisher => publisher.name).join(', ')}</li>
                <li>Authors: {authors.map(author => author.name).join(', ')}</li>
            </ul>
        </div>
    </BookDetails>
</BookWrapper>;
