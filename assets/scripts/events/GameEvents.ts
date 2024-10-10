export enum GameEvents {
    NONE = 0,

    GAME_START = 1,
    LEVEL_COMPLETE,

    WORD_CORRECT = 2,
    WORD_INCORRECT,

    LETTER_CHOSEN,
    LETTER_CANCELLED
}