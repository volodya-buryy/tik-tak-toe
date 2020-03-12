const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

module.exports = class GameService {
    constructor(StorageService) {
        this.StorageService = StorageService;
    };

    async setNewMove(gameId, body) {
        let result;
        return new Promise(async (resolve, reject) => {
            this.gameObj = this.StorageService.getGameById(gameId);

            try {
                await this.setGameSatateValue(body);
            } catch (error) {
                reject(error);
                return;
            }

            const resultValidation = this.resultValidation();

            if (resultValidation.status != 'RUNNING') {
                resolve(resultValidation);
                return;
            }

            try {
                result = await this.setServerNextMove();
            } catch (error) {
                reject(error);
                return;
            }

            resolve(result);
        });
    }

    setGameSatateValue(body) {
        return new Promise((resolve, reject) => {
            if (this.gameObj.gameState[body.cellIndex] == '' && this.gameObj.status === 'RUNNING') {
                this.gameObj.gameState[body.cellIndex] = this.gameObj.currentPlayer;
                resolve();
                return;
            }

            reject({ message: 'this cell isn`t available' });
        });
    }

    resultValidation() {
        let roundWon = false;
        for (let i = 0; i <= 7; i++) {
            const winCondition = winningConditions[i];
            let a = this.gameObj.gameState[winCondition[0]];
            let b = this.gameObj.gameState[winCondition[1]];
            let c = this.gameObj.gameState[winCondition[2]];
            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                break
            }
        }
    
        if (roundWon) {
            this.gameObj.status = this.gameObj.currentPlayer === 'X' ? 'X_WON' : 'O_WON';
            return {
                status: this.gameObj.status
            };
        }
    
        let roundDraw = !this.gameObj.gameState.includes('');
        if (roundDraw) {
            this.gameObj.status = 'DRAW';
            return {
                status: this.gameObj.status
            };
        }
    
        return this.playerChange();
    }

    playerChange() {
        this.gameObj.currentPlayer = this.gameObj.currentPlayer === 'X' ? 'O' : 'X';

        return {
            status: this.gameObj.status,
            playerAvailable: this.gameObj.currentPlayer,
            message: `It's ${this.gameObj.currentPlayer}'s turn`,
            board: this.gameObj.gameState
        };
    }

    async setServerNextMove() {
        const index = this.gameObj.gameState.findIndex(i => i === '');

        return new Promise(async (resolve, reject) => {
            try {
                await this.setGameSatateValue({cellIndex: index});
            } catch (error) {
                reject(error);
            };
            
            resolve(this.resultValidation());
        });
    }
};