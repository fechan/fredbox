module.exports = class DummyMinigame {
  constructor(id) {
    this.name = "DummyMinigame";
    this.id = id;
  }

  serializable() {
    return {
      "name": this.name,
      "choices": [Math.random(), Math.random(), Math.random(), Math.random()]
    }
  }

  gradeAnswer(answer) {
    return 5;
  }
}