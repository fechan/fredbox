# Fredbox
A multiplayer game where you compete with your friends to answer a series of simple brain games as quickly as possible. Originally inspired by the math minigame in the Jackbox game, Trivia Murder Party. It can be played at [box.fredchan.org](https://box.fredchan.org/).

## Hosting your own server
### Docker compose
1. Clone and cd into the project root
2. Run `docker-compose build`
3. Run`docker-compose up` in the project directory.

### Dockerless
1. Clone and cd into the project root
2. Run `npm install`
3. Run `npm run build`
4. Run `npm start`

## Adding a minigame
### Basic concept
Every minigame generates questions like "What is 2+2?" and offers the user a selection of possible answers to choose. The minigame awards points depending on if the answer is correct.

Each minigame question is an instance of a minigame class on the server side. When a player encounters the question, the client asks the server for the necessary data to render the question, which must include its `id`, `name`, and a `choices` array that the player can select as answers. Any additional data sent can be used freely by the minigame maker to render the question.

The client side uses this data to render a React component for the minigame. When the player chooses an answer from choices, the server asks the minigame instance to grade the answer and return the number of points awarded/deducted to the player.

### Server-side
1. Add a js file to `/server/game_logic/minigames`
2. Add the following code and change all instances of `MyMinigame` to the name of your minigame:
```js
module.exports = class MyMinigame {
  constructor(id) {
    this.name = "MyMinigame";
    this.id = id;
    this.choices = [1, 2, 3, 4];
    this.answer = 4;
    this.questionText = "What is 2+2?";
  }

  /**
   * Get the data required for the client to render this minigame question
   * @returns {Object} Serialized version of this question's data
   */
  serialize() {
    return {
      "id": this.id,
      "name": this.name,
      "choices": this.choices,
      "questionText": this.questionText;
    };
  }

  /**
   * Award or deduct points depending on if the answer is correct
   * @param {any} answer Answer chosen by the player, same type as in `this.choices`
   * @returns Points to add to the player score
   */
  gradeAnswer(answer) {
    return this.answer === answer ? 5 : -5;
  }
}
```
3. In `constructor()`, change `this.choices` to be a list of possible player choices.
4. In `constructor()`, change `this.answer` to be the correct answer. If your question can have multiple correct answers, you'll need to define custom behavior in `gradeAnswer()`.
4. In `constructor()`, generate any additional data needed for the client to render this question. Then, add it to the object returned by `serialize()`.
    * `questionText` is an example of such data. This could be replaced by anything you need to send to the client, and you can add as much additional data as you need.