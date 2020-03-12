module.exports = class GamesController {

    constructor(StorageService, GameService, storage) {
        this.StorageService = new StorageService(storage);
        this.GameService = new GameService(this.StorageService);
    };

    getGamesList(req, res, next) {
        res.send(this.StorageService.getAllRecords());
    };

    createGame(req, res, next) {
        this.StorageService.createNewRecord();
        res.send('ok');
    };

    getGameById(req, res, next) {
        res.send(this.StorageService.getGameById(req.params.id));
    };

    async setNewMoveInGame(req, res, next) {
        let result = null;

        try {
            result = await this.GameService.setNewMove(req.params.id, req.body);
        } catch (error) {
            next(error);
        }

        res.send(result);
    };

    deleteGame(req, res, next) {
        this.StorageService.removeGame(req.params.id);
        res.status(204).send('ok');
    };
}; 
