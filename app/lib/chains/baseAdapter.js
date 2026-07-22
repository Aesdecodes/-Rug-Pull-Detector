// Base Adapter Interface
export class BaseChainAdapter {
  constructor(chainId) {
    this.chainId = chainId;
  }

  // Must be implemented by child adapters
  async connect() {
    throw new Error('connect() must be implemented');
  }

  async disconnect() {
    throw new Error('disconnect() must be implemented');
  }

  async getAccountData(address) {
    throw new Error('getAccountData() must be implemented');
  }

  async getTokenData(address) {
    throw new Error('getTokenData() must be implemented');
  }

  async getTransactionHistory(address) {
    throw new Error('getTransactionHistory() must be implemented');
  }

  async analyzeRiskForToken(tokenAddress, overrides = {}) {
    throw new Error('analyzeRiskForToken() must be implemented');
  }
}
