import React from 'react';
import { render, screen } from '@testing-library/react';
import AppWrapper from './App';

// Mock Web3 and API calls to ensure stable unit testing
jest.mock('./services/api', () => ({
  checkHealth: jest.fn().mockResolvedValue({ status: 'healthy' }),
  analyzeToken: jest.fn().mockResolvedValue({
    address: '0x123',
    risk_level: 'LOW',
    score: 0.15,
    details: 'Token appears low risk'
  }),
  batchAnalyzeTokens: jest.fn().mockResolvedValue({
    results: []
  }),
}));

test('renders Rug Pull Detector header and title', () => {
  render(<AppWrapper />);
  const titleElement = screen.getByText(/Rug Pull Detector/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders DeFi Token Scam Predictive Analytics subtitle', () => {
  render(<AppWrapper />);
  const subtitleElement = screen.getByText(/DeFi Token Scam Predictive Analytics/i);
  expect(subtitleElement).toBeInTheDocument();
});
