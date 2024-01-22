const input = document.querySelector(".output");
const output = document.querySelector(".upper-display");
const buttons = Array.from(document.querySelectorAll("button"));
let num1 = null;
let num2 = null;
let operator = null;
let currentButton = null;
let operatorActive = false;
let isSolution = false;
let temp = null;
let isError = false;
let isFull = false;

const calculator = {
    init() {
        input.innerText = 0;
        output.innerText = null;
        buttons.forEach(button => {
            button.addEventListener("click", function() {
                currentButton = button.innerText;
                if (isError === true) {
                    calculator.clearAll();
                } else {
                    switch (currentButton) {
                        case "+":
                            if (!isSolution) {
                                if (!operatorActive) {
                                    if (num1 === null) {
                                        operatorActive = true;
                                        operator = "+";
                                        output.innerText = input.innerText;
                                        input.innerText = null;
                                        num1 = parseFloat(output.innerText);
                                    }  else {
                                        output.innerText = calculator.equals(num1,num2,operator);
                                        operatorActive = true;
                                        operator = "+";
                                        input.innerText = null;
                                        num1 = parseFloat(output.innerText);
                                        isSolution = false;
                                    };
                                };
                            } else {
                                operatorActive = true;
                                operator = "+";
                                output.innerText = input.innerText;
                                input.innerText = null;
                                num1 = parseFloat(output.innerText);
                                isSolution = false;
                            };
                            break;
                        case "-":
                            if (num2 === null) {
                                calculator.insert()
                            } else {
                                if (!isSolution) {
                                    if (!operatorActive) {
                                        if (num1 === null) {
                                            operatorActive = true;
                                            operator = "-";
                                            output.innerText = input.innerText;
                                            input.innerText = null;
                                            num1 = parseFloat(output.innerText);
                                        }  else {
                                            output.innerText = calculator.equals(num1,num2,operator);
                                            operatorActive = true;
                                            operator = "-";
                                            input.innerText = null;
                                            num1 = parseFloat(output.innerText);
                                            isSolution = false;
                                        };
                                    };
                                } else {
                                    operatorActive = true;
                                    operator = "-";
                                    output.innerText = input.innerText;
                                    input.innerText = null;
                                    num1 = parseFloat(output.innerText);
                                    isSolution = false;
                                };
                            };
                            break;
                        case "×":
                            if (!isSolution) {
                                if (!operatorActive) {
                                    if (num1 === null) {
                                        operatorActive = true;
                                        operator = "*";
                                        output.innerText = input.innerText;
                                        input.innerText = null;
                                        num1 = parseFloat(output.innerText);
                                    }  else {
                                        output.innerText = calculator.equals(num1,num2,operator);
                                        operatorActive = true;
                                        operator = "*";
                                        input.innerText = null;
                                        num1 = parseFloat(output.innerText);
                                        isSolution = false;
                                    };
                                };
                            } else {
                                operatorActive = true;
                                operator = "*";
                                output.innerText = input.innerText;
                                input.innerText = null;
                                num1 = parseFloat(output.innerText);
                                isSolution = false;
                            };
                            break;
                        case "÷":
                            if (!isSolution) {
                                if (!operatorActive) {
                                    if (num1 === null) {
                                        operatorActive = true;
                                        operator = "/";
                                        output.innerText = input.innerText;
                                        input.innerText = null;
                                        num1 = parseFloat(output.innerText);
                                    }  else {
                                        output.innerText = calculator.equals(num1,num2,operator);
                                        operatorActive = true;
                                        operator = "/";
                                        input.innerText = null;
                                        num1 = parseFloat(output.innerText);
                                        isSolution = false;
                                    };
                                };
                            } else {
                                operatorActive = true;
                                operator = "/";
                                output.innerText = input.innerText;
                                input.innerText = null;
                                num1 = parseFloat(output.innerText);
                                isSolution = false;
                            };
                            break;
                        case "√":
                            if (num2===null) {
                                calculator.insert();
                                operator = "√";
                            } else if (isSolution ) {
                                operator = "√";
                                num1 = parseFloat(input.innerText);
                                num1 = calculator.equals(num1,num2,operator)
                                input.innerText = num1;
                                output.innerText = null;
                                isSolution = true;
                            };
                            break;
                        case "^":
                            if (!isSolution) {
                                if (!operatorActive) {
                                    if (num1 === null) {
                                        operatorActive = true;
                                        operator = "^";
                                        output.innerText = input.innerText;
                                        input.innerText = null;
                                        num1 = parseFloat(output.innerText);
                                    }  else {
                                        output.innerText = calculator.equals(num1,num2,operator);
                                        operatorActive = true;
                                        operator = "^";
                                        input.innerText = null;
                                        num1 = parseFloat(output.innerText);
                                        isSolution = false;
                                    };
                                };
                            } else {
                                operatorActive = true;
                                operator = "^";
                                output.innerText = input.innerText;
                                input.innerText = null;
                                num1 = parseFloat(output.innerText);
                                isSolution = false;
                            };
                            break;
                        case "%":
                            if (!isSolution) {
                                if (!operatorActive) {
                                    if (num1 === null) {
                                        operatorActive = true;
                                        operator = "%";
                                        output.innerText = input.innerText;
                                        input.innerText = null;
                                        num1 = parseFloat(output.innerText);
                                    }  else {
                                        output.innerText = calculator.equals(num1,num2,operator);
                                        operatorActive = true;
                                        operator = "%";
                                        input.innerText = null;
                                        num1 = parseFloat(output.innerText);
                                        isSolution = false;
                                    };
                                };
                            } else {
                                operatorActive = true;
                                operator = "%";
                                output.innerText = input.innerText;
                                input.innerText = null;
                                num1 = parseFloat(output.innerText);
                                isSolution = false;
                            };
                            break;
                        case ".": 
                        if (!input.innerText.includes(".")) {
                            if (input.innerText != 0) {
                                calculator.insert();
                            } else {input.innerText = "0."}
                        };      
                            break;
                        case "=":
                            if (operator === "√") {
                                if (input.innerText.includes("√")) {input.innerText = input.innerText.substring(1)};
                                num1 = parseFloat(input.innerText);
                                num1 = calculator.equals(num1,num2,operator);
                                input.innerText = num1;
                                output.innerText = null;
                                isSolution = true;
                            } else {
                                if (!operatorActive) {
                                    input.innerText = calculator.equals(num1,num2,operator);
                                    num1 = parseFloat(input.innerText);
                                    output.innerText = null;
                                    isSolution = true;
                                };
                            }
                            
                            break;
                        case "DEL":
                            calculator.delete();
                            break;
                        case "AC":
                            calculator.clearAll();
                            break;
                        case "-/+":
                            input.innerText = calculator.negate(input.innerText);
                            break;     
                        default:
                            calculator.insert();
                            break;
                    };
                };
                if (input.innerText == "undefined" || Infinity || "NaN") {
                    if (input.innerText == "undefined") {
                        calculator.clearAll();
                        input.innerText = "ERROR";
                        isError = true;
                    } else if (input.innerText == "NaN") {
                        calculator.clearAll();
                        input.innerText = "What...?";
                        isError = true;
                    } else if (input.innerText == Infinity) {
                        calculator.clearAll();
                        output.innerText = "To infinity...";
                        input.innerText = "and BEYOND!";
                        isError = true;
                    };
                };
                if (input.innerText.includes(".")) { 
                    temp = input.innerText;
                    if (temp.length > 10) {temp = temp.substring(0,10); isFull = true;} else {isFull = false;};
                    input.innerText = temp;
                    temp = null ;
                } else if (output.innerText.includes(".")) { 
                    
                };
            });
        });
    },
    insert() {
        if (input.innerText.length < 10) {isFull = false};
        if (!isFull) {
            if (!isSolution) {
                if (input.innerText === "0") {
                    operatorActive = false;
                    input.innerText = currentButton;
                    num2 = parseFloat(input.innerText);
                } else if (isError) {
                    output.innerText = null;
                    operatorActive = false;
                    input.innerText = currentButton;
                    num2 = parseFloat(input.innerText);
                } else {
                    operatorActive = false;
                    input.innerText = input.innerText + currentButton;
                    num2 = parseFloat(input.innerText);
                };
            } else {
                temp = currentButton;
                calculator.clearAll();
                input.innerText = temp;
                num2 = parseFloat(input.innerText);
                temp = null;
            };
            if (input.innerText.length >= 10) {
                isFull = true;
            }
        };
    },
    add(a,b) {return a+b},
    substract(a,b) {return a-b},
    multiply(a,b) {return a*b},
    divide(a,b) {return a/b},
    sqrt(a) {return Math.sqrt(a)},
    powerOf(a,b) {return Math.pow(a,b)},
    modulo(a,b) {return a%b},
    negate(a) {return a*-1},
    delete() {
        if (input.innerText.length > 1) {
        input.innerText = input.innerText.slice(0,-1);
        } else if (input.innerText.length === 1) {input.innerText = 0} else {};
    },
    clearAll() {
        input.innerText = 0;
        output.innerText = null;
        num1 = null;
        num2 = null;
        operator = null;
        currentButton = null;
        isSolution = false;
        operatorActive = false;
        isError = false;
        isFull = false;
    },
    equals(a,b,operator) {
        let answer;
        switch (operator) {
            case "+":
                answer = calculator.add(a,b);
                break;
            case "-":
                answer = calculator.substract(a,b);
                break;
            case "*":
                answer = calculator.multiply(a,b);
                break;
            case "/":
                answer = calculator.divide(a,b);
                break;
            case "^":
                answer = calculator.powerOf(a,b);
                break;
            case "%":
                answer = calculator.modulo(a,b);
                break;
            case "√":
                answer = calculator.sqrt(a);
                break;
            default:
                break;
        }
        return answer;
    },


};

calculator.init();