const { sum, multiply, divide, subtract } = require("./math");

describe("Math functions testing", () => {

  test("sum adds numbers", () => {
    expect(sum(2, 3)).toBe(5);
  });

  test("subtract subtracts numbers", () => {
    expect(subtract(5, 2)).toBe(3);
  });

  test("multiply multiplies numbers", () => {
    expect(multiply(3, 4)).toBe(12);
  });

  test("divide divides numbers", () => {
    expect(divide(10, 2)).toBe(5);
  });

  test("divide handles division by zero", () => {
    expect(() => divide(10, 0)).toThrow("Division by zero is not allowed.");
  });

  test("divide throws an error when dividing by zero", () => {
    expect(() => divide(5, 0)).toThrow("Division by zero is not allowed.");
  });
  
});
