let _id = 1;

module.exports = class StorageService {
    constructor(storage) {
        this.storage = storage;
    }

    createNewRecord() {
        this.storage.push({
            id: _id,
            currentPlayer: 'X',
            status: 'RUNNING',
            gameState: ['', '', '', '', '', '', '', '', '']
        });

        _id ++;
    }

    getAllRecords() {
        return this.storage;
    }

    getGameById(id) {
        const game = this.storage.find(i => i.id == id);

        return game;
    }

    removeGame(id) {
        const index = this.storage.findIndex(i => i.id == id);
        this.storage.splice(index, 1);
    }
}