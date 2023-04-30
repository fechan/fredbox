const StroopEffectMinigame = require("../../../game_logic/minigames/stroopEffect");

test("StroopEffectMinigame should return 5 on correct answer", () => {
  const stroop = new StroopEffectMinigame(1);
  const score = stroop.gradeAnswer({
    "word": stroop.correctColor,
    "textColor": stroop.correctColor,
  });
  expect(score).toBe(5);
});

test("StroopEffectMinigame should return 0 on wrong answer", () => {
  const stroop = new StroopEffectMinigame(1);
  const score = stroop.gradeAnswer({
    "word": "wrong",
    "textColor": "wrong",
  });
  expect(score).toBe(0);
});