const MAX_CHARACTERS = 15;

var characterCounter = 0,
    isNegative = false,
    isInvalid = false;

const FIRST_DISPLAYER = document.querySelector('#output div:nth-child(1)'),
    SECOND_DISPLAYER = document.querySelector('#output div:nth-child(2)'),
    NUMBER_BUTTONs = Array.from(document.querySelectorAll('.number-button')),
    SPECIAL_NUMBER_BUTTONs = Array.from(document.querySelectorAll('.special-number-button')),
    OPERATION_BUTTONs = Array.from(document.querySelectorAll('.operation-button')),
    FUNCTION_BUTTONs = Array.from(document.querySelectorAll('.function-button')),
    PERIOD_BUTTON = document.querySelector('#period-button'),
    CLEAR_BUTTON = document.querySelector('#clear-button'),
    DELETE_BUTTON = document.querySelector('#delete-button'),
    NEGATION_BUTTON = document.querySelector('#negation-button'),
    EQUALIZATION_BUTTON = document.querySelector('#equalization-button'),
    SAWAP_PAGE_BUTTONs = Array.from(document.querySelectorAll('.swap-page-button')),
    EXTRA_CONTAINERs = Array.from(document.querySelectorAll(".extra"));

(
    /** Sets up the document. */
    function SetUp() {
        SetUpNumberButtons();
        SetUpOperationButtons();
        SetUpDeleteButton();
        SetUpPeriodButton();
        SetUpClearButton();
        SetUpNegationButton();
        SetUpSpecialNumberButtons();
        SetUpEqualizationButton();
        SetUpFunctionButtons();
        SetUpKeyboard();
        SetUpSwapPageButtons();
    }
)();

function SetUpNumberButtons() {
    NUMBER_BUTTONs.forEach(button => {
        button.addEventListener('click', e => {
            if (button.innerText == "(" && !["(", undefined].includes(SECOND_DISPLAYER.innerText.at(-1))) {
                return;
            }

            if (isInvalid) {
                SECOND_DISPLAYER.innerText = button.innerText;
                characterCounter = 1;
                isInvalid = false;

                return;
            }

            if (characterCounter > MAX_CHARACTERS) { return; }


            if (SECOND_DISPLAYER.innerText.at(-1) == "(") {
                SECOND_DISPLAYER.innerText += " " + button.innerText;
                characterCounter++;

                return;
            }

            if (button.innerText == ")") {
                SECOND_DISPLAYER.innerText += " )";
                characterCounter++;

                return;
            }

            SECOND_DISPLAYER.innerText += button.innerText;
            characterCounter++;
        });
    });
}

function SetUpOperationButtons() {
    OPERATION_BUTTONs.forEach(button => {
        button.addEventListener('click', e => {
            if (isInvalid) { return; }

            if (!SECOND_DISPLAYER.innerText.length) {
                FIRST_DISPLAYER.innerText =
                    FIRST_DISPLAYER.innerText.substring(0, FIRST_DISPLAYER.innerText.length - 1)
                    + button.innerText;

                return;
            }

            let operation = button.hasAttribute("operation") ? button.getAttribute("operation") : button.innerText;

            FIRST_DISPLAYER.innerText += " " + SECOND_DISPLAYER.innerText + " " + operation;
            SECOND_DISPLAYER.innerText = "";

            characterCounter = 0;
            isNegative = false;
        });
    });
}

function SetUpDeleteButton() {
    DELETE_BUTTON.addEventListener('click', e => {
        if (isInvalid) {
            SECOND_DISPLAYER.innerText = "";
            characterCounter = 0;
            isNegative = isInvalid = false;

            return;
        }

        SECOND_DISPLAYER.innerText = SECOND_DISPLAYER.innerText.substring(0, characterCounter - 1);
        characterCounter -= characterCounter > 0 ? 1 : 0;

        if (SECOND_DISPLAYER.innerText == "-") {
            SECOND_DISPLAYER.innerText = "-0";
            characterCounter++;
        }
    });
}

function SetUpPeriodButton() {
    PERIOD_BUTTON.addEventListener('click', e => {
        if (SECOND_DISPLAYER.innerText.indexOf('.') != -1) { return; }

        if (characterCounter == 0) {
            SECOND_DISPLAYER.innerText = "0";
            characterCounter++;
        }

        SECOND_DISPLAYER.innerText += ".";
        characterCounter++;
    });
}

function SetUpClearButton() {
    CLEAR_BUTTON.addEventListener('click', e => {
        FIRST_DISPLAYER.innerText = SECOND_DISPLAYER.innerText = "";
        characterCounter = 0;
        isNegative = false;
    });
}

function SetUpNegationButton() {
    NEGATION_BUTTON.addEventListener('click', e => {
        if (isInvalid) { return; }

        if (characterCounter == 0) {
            SECOND_DISPLAYER.innerText = "0";
            characterCounter++;
        }

        SECOND_DISPLAYER.innerText = (isNegative ? "" : "-") + SECOND_DISPLAYER.innerText.replace("-", "");
        isNegative = !isNegative;
        characterCounter++;
    });
}

function SetUpSpecialNumberButtons() {
    SPECIAL_NUMBER_BUTTONs.forEach(button => {
        button.addEventListener("click", e => {
            isInvalid = false;

            let numberName = button.innerText,
                value;

            switch (numberName) {
                case "Pi": value = Math.PI; break;
                case "e": value = Math.E; break;
            }

            SECOND_DISPLAYER.innerText = value;
            characterCounter = (value + "").length;
            isNegative = value < 0;
        });
    });
}

function SetUpEqualizationButton() {
    EQUALIZATION_BUTTON.addEventListener("click", e => {
        FIRST_DISPLAYER.innerText += " " + SECOND_DISPLAYER.innerText;
        characterCounter = 0;
        isNegative = isInvalid = false;

        let result = Evaluate(FIRST_DISPLAYER.innerText.split(" "));
        SECOND_DISPLAYER.innerText = result;
        characterCounter = (result + "").length;
        isNegative = result < 0;

        FIRST_DISPLAYER.innerText = "";
    });
}

/**
 * 
 * @param {Number} x 
 * @param {Number} y 
 * @param {String} operation 
 * @returns 
 */
function EvaluateTwo(x, y, operation) {
    switch (operation) {
        case '+': return x + y;
        case '-': return x - y;
        case '×': return x * y;
        case '÷': return x / y;
        case '^': return Math.pow(x, y);
        case 'Log': return Math.log(y) / Math.log(x);
    }
}

function SetUpFunctionButtons() {
    FUNCTION_BUTTONs.forEach(button => {
        button.addEventListener("click", e => {
            if (isInvalid || !SECOND_DISPLAYER.innerText.length) { return; }

            let x = parseFloat(SECOND_DISPLAYER.innerText),
                functionName = button.innerText,
                result;

            switch (functionName) {
                case 'Sin': result = Math.sin(x); break;
                case 'Cos': result = Math.cos(x); break;
                case 'Tan': result = Math.tan(x); break;
                case 'Log': result = Math.log10(x); break;
                case 'e': result = Math.exp(x); break;
                case 'Ln': result = Math.log(x); break;
                case '1/x': result = 1 / x; break;
                case 'x!':
                    if (!Number.isInteger(x)) {
                        SECOND_DISPLAYER.innerText = "INVALID INPUT";
                        isInvalid = true;
                        return;
                    }

                    result = Factorial(x);
                    break;
                case 'Sqrt': result = Math.sqrt(x); break;
                case '%': result = x / 100; break;
                case 'Asin': result = Math.asin(x); break;
                case 'Acos': result = Math.acos(x); break;
                case 'Atan': result = Math.atan(x); break;
                case 'Sinh': result = Math.sinh(x); break;
                case 'Cosh': result = Math.cosh(x); break;
                case 'Tanh': result = Math.tanh(x); break;
                case 'Abs': result = Math.abs(x); break;
                case 'Asinh': result = Math.asinh(x); break;
                case 'Acosh': result = Math.acosh(x); break;
                case 'Atanh': result = Math.atanh(x); break;
                case 'Sgn': result = x > 0 ? +1 : x < 0 ? -1 : 0; break;
                case '‰': result = x / 1000; break;
            }

            SECOND_DISPLAYER.innerText = result;
            characterCounter = (result + "").length;
            isNegative = result < 0;
        });
    });
}

function Factorial(x) {
    const MAXIMUM_ALLOWED_VALUE = 22;

    if (x >= MAXIMUM_ALLOWED_VALUE) { return Infinity; }

    let result = 1;
    for (let i = 2; i <= x; i++) {
        result *= i;
    }
    return result;
}

/** Checks if a mathematical expression has balanced parentheses.
 * @param {String} expression A string that contains the expression.
 * @returns A boolean representing whether or not the expression is a valid one.
 */
function CheckIfParenthesesBalanced(expression) {
    let counterOpen = 0, counterClose = 0;
    for (let i = 0; i < expression.length; i++) {
        switch (expression[i]) {
            case "(": counterOpen++; break;
            case ")":
                if (counterOpen) { counterOpen--; }
                else { counterClose++; }
                break;
        }
    }
    return !counterOpen && !counterClose;

    // let stack = [];
    // for (let i = 0; i < expression.length; i++) {
    //     if (expression[i] == "(") {
    //         stack.push("(");
    //     }
    //     if (expression[i] == ")") {
    //         if (!stack.length) { return false; }
    //         stack.pop();
    //     }
    // }

    // return !stack.length;
}

/** Converts an expression from an infix form into a postfix form.
 * @param {Array<String>} expression An array of string that contains the mathematical expression.
 * @returns A string that contains the expression in the postfix form.
 */
function ToPostfix(expression) {
    if (!CheckIfParenthesesBalanced(expression.join(""))) { return null; }

    let result = [],
        stack = [],
        map = new Map();

    map["("] = -1;
    map["+"] = 1; map["-"] = 1;
    map["×"] = 2; map["÷"] = 2;
    map["^"] = 3;
    map["Log"] = 4;
    map[")"] = 5;

    for (let i = 0; i < expression.length; i++) {
        if (expression[i] == Number.parseFloat(expression[i])) {
            result.push(expression[i]);
        }
        else if (["+", "-", "×", "÷", "^", "Log", "(", ")"].includes(expression[i])) {
            let last = stack[stack.length - 1];

            if (last == null || map[expression[i]] > map[last]) {
                if (expression[i] == ")") {
                    while (stack.length && stack[stack.length - 1] != "(") {
                        result.push(stack.pop());
                    }
                    stack.pop();
                    continue;
                }

                stack.push(expression[i]);
            }
            else {
                if (expression[i] != "(" && expression[i] != ")") {
                    result.push(stack.pop());
                }
                stack.push(expression[i]);
            }
        }
    }

    while (stack.length) {
        result.push(stack.pop());
    }

    return result;
}

/** Calculates the output of a mathematical expression.
 * @param {Array<String>} expression An array of strings that contains the mathematical expression.
 * @returns A number representing the output of the expression.
 */
function Evaluate(expression) {
    console.log(expression);
    let expressionArray = ToPostfix(expression);

    while (expressionArray.length > 1) {
        console.log(expressionArray);

        let operationIndex =
            expressionArray.findIndex(item => ["+", "-", "×", "÷", "^", "Log"].includes(item));

        let x = Number.parseFloat(expressionArray[operationIndex - 2]),
            y = Number.parseFloat(expressionArray[operationIndex - 1]),
            operation = expressionArray[operationIndex],
            result = EvaluateTwo(x, y, operation);

        expressionArray =
            expressionArray.filter((item, index) => index != operationIndex && index != operationIndex - 1);

        expressionArray[operationIndex - 2] = result;
    }

    return expressionArray[0];
}

function SetUpKeyboard() {
    document.addEventListener("keydown", e => {
        if (e.key == Number.parseInt(e.key)) {
            const BUTTON = document.querySelector(".number-button.k" + e.key);
            BUTTON.click();
        }
    });
}

function SetUpSwapPageButtons() {
    SAWAP_PAGE_BUTTONs.forEach(button => {
        button.addEventListener("click", e => {
            EXTRA_CONTAINERs.forEach(extraContainer => extraContainer.classList.toggle("hidden"));
        });
    });
}