class Calculator {
  constructor(prevElement, currentElement, calculatorBody) {
    this.prevElement = prevElement;
    this.currentElement = currentElement;
    this.calculatorBody = calculatorBody;

    this.prevValue = "";
    this.currValue = "";
    this.operation = null;

    this.theme = "";

    this.clear();
    this.updateTheme();
  }

  clear() {
    this.prevValue = "";
    this.currValue = "";
    this.operation = null;
    this.updateDispaly();
  }

  delete() {
    this.currValue = this.currValue.slice(0, -1);
    this.updateDispaly();
  }

  appendNumber(number) {
    if (number === "." && this.currValue.includes(".")) return;

    this.currValue += number;
    this.updateDispaly();
  }

  chooseOperation(operation) {
    if (!this.currValue) {
      this.operation = operation;
      return this.updateDispaly();
    }
    if (this.prevValue) this.compute();

    this.prevValue = this.currValue;
    this.currValue = "";
    this.operation = operation;

    this.updateDispaly();
  }

  compute() {
    let computation;
    const prev = +this.prevValue;
    const cur = +this.currValue;

    switch (this.operation) {
      case "+":
        computation = prev + cur;
        break;

      case "-":
        computation = prev - cur;
        break;

      case "*":
        computation = prev * cur;
        break;

      case "/":
        computation = prev / cur;
        break;

      default:
        return;
    }

    this.currValue = computation.toString();
    this.prevValue = "";
    this.operation = null;

    this.updateDispaly();
  }

  formatNumber(number) {
    const stringNum = number.toString();
    const integerDigits = parseFloat(stringNum.split(".")[0]);
    const decimalDigits = stringNum.split(".")[1];

    let integerDisplay;
    if (isNaN(integerDigits)) {
      integerDisplay = "";
    } else {
      integerDisplay = integerDigits.toLocaleString("en", {
        maximumFractionDigits: 0,
      });
    }

    if (decimalDigits != null) return `${integerDisplay}.${decimalDigits}`;

    return integerDisplay;
  }

  updateDispaly() {
    const prev = this.formatNumber(this.prevValue);
    const cur = this.formatNumber(this.currValue);

    this.prevElement.textContent = this.operation
      ? `${prev} ${this.operation}`
      : prev;

    this.currentElement.textContent = cur;
  }

  changeTheme(curThemeNum) {
    const nextThemeNum = curThemeNum % 3;
    const theme =
      nextThemeNum === 1
        ? "theme-light"
        : nextThemeNum === 2
        ? "theme-dark"
        : "";

    this.theme = theme;
    localStorage.setItem("calc-theme", JSON.stringify(theme));
    this.updateTheme();
  }

  updateTheme() {
    const theme = localStorage.getItem("calc-theme")
      ? JSON.parse(localStorage.getItem("calc-theme"))
      : this.theme;

    this.calculatorBody.className = `calculator ${theme}`;
  }
}

const calculatorContainer = document.querySelector(".calculator");
const calcControls = document.querySelector(".calculator-control");
const calcScreenPrev = document.querySelector(".calculator-screen .prev-value");
const calcScreenCurrent = document.querySelector(
  ".calculator-screen .current-value"
);
const themeBtn = document.querySelector(".theme-btn");

const calculator = new Calculator(
  calcScreenPrev,
  calcScreenCurrent,
  calculatorContainer
);

calcControls.addEventListener("click", ({ target }) => {
  if (!target.dataset.target) return;
  const btn = target.dataset.target;

  if (btn === "reset") return calculator.clear();
  if (btn === "del") return calculator.delete();
  if (btn === "=") return calculator.compute();
  if (btn === "+" || btn === "-" || btn === "*" || btn === "/")
    return calculator.chooseOperation(btn);

  return calculator.appendNumber(btn);
});

themeBtn.addEventListener("click", ({ target: btn }) =>
  calculator.changeTheme(++btn.dataset.target)
);
