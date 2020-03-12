const express = require('express');
const router = express.Router();

const GamesController = require('../controllers/games-controller');
const StorageService = require('../services/storage-service');
const GameService = require('../services/game-service');

const storage = require('../storage');

const gamesController = new GamesController(StorageService, GameService, storage);

router.get('/', (req, res, next) => {
    return gamesController.getGamesList(req, res, next);
});

router.post('/', (req, res, next) => {
    return gamesController.createGame(req, res, next);
});

router.get('/:id', (req, res, next) => {
    return gamesController.getGameById(req, res, next);
});

router.put('/:id', (req, res, next) => {
    return gamesController.setNewMoveInGame(req, res, next);
});

router.delete('/:id', (req, res, next) => {
    return gamesController.deleteGame(req, res, next);
});

module.exports = router;
