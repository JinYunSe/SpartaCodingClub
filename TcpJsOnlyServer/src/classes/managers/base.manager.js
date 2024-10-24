class BaseManager {
  constructor() {
    if (new.target === BaseManager) {
      throw new TypeError('Cannot instantiate abstract class(BaseManager)');
    }
  }

  addPlayer(playerId, ...args) {
    throw new Error('Method not implemented.');
  }

  removePlayer(playerId) {
    throw new Error('Method not implemented.');
  }

  clearAll() {
    throw new Error('Method not implemented.');
  }
}

export default BaseManager;
