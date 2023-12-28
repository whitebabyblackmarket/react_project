import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import App from './App';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

test('renders welcome heading', () => {
    render(<App />);
    const headingElement = screen.getByText(/Welcome to the Stable Diffusion Integration!/i);
    expect(headingElement).toBeInTheDocument();
});

test('generates an image when the form is submitted', async () => {
    const { getByLabelText, getByText, findByAltText } = render(<App />);

    const promptInput = getByLabelText(/Prompt:/i);
    const negativePromptInput = getByLabelText(/Negative Prompt:/i);
    const fileInput = getByLabelText(/Upload Image:/i);
    const submitButton = getByText(/Generate/i);

    // Mock the fetch call
    fetch.mockResponseOnce('<img src="http://example.com/generated-image.jpg">');

    // Fill out the form
    fireEvent.change(promptInput, { target: { value: 'Test prompt' } });
    fireEvent.change(negativePromptInput, { target: { value: 'Test negative prompt' } });
    fireEvent.change(fileInput, { target: { files: [new File([''], 'test.jpg', { type: 'image/jpeg' })] } });

    // Submit the form
    fireEvent.click(submitButton);

    // Wait for the generated image to be displayed
    const generatedImage = await findByAltText(/Generated/i);

    // Check that the generated image has the correct src
    expect(generatedImage.src).toBe('http://example.com/generated-image.jpg');
});