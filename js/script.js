
class Calculator {
    constructor(calcInput, charButtons, resetButton, deleteButton, calcButton) {  
        this.calcInput = calcInput;
        this.charButtons = charButtons;
        this.resetButton = resetButton;
        this.deleteButton = deleteButton;
        this.calcButton = calcButton;

        this.typeIn();
        this.listenForKeys();

        this.deleteButton.addEventListener('click', this.delete);
        this.resetButton.addEventListener('click', this.reset);
        this.calcButton.addEventListener('click', this.calculate);
    }

    delete = () => {
        this.calcInput.innerHTML = this.calcInput.innerHTML.slice(0, -1);
    }

    reset = () => {
        this.calcInput.innerHTML = "";
    }

    calculate = () => {  
        while(
            this.calcInput.innerHTML.slice(0, 1) == "0" 
            || this.calcInput.innerHTML.slice(0, 1) == "/" 
            || this.calcInput.innerHTML.slice(0, 1) == "×" 
            || this.calcInput.innerHTML.slice(0, 1) == "*")
            {
            this.calcInput.innerHTML = this.calcInput.innerHTML.slice(1);
        }
        if(this.calcInput.innerHTML != 0){
            this.calcInput.innerHTML = eval(this.calcInput.innerHTML.replace(/×/g, "*"));
        }else{
            this.calcInput.innerHTML = "0";
        }
    }

    typeIn(){
        this.charButtons.forEach(el => {
            el.addEventListener('click', () => {
                this.calcInput.innerHTML += el.textContent;
            });
        })
    }

    listenForKeys = () => {
        let charList = [];

        this.charButtons.forEach(el => {
            let char = el.textContent;
            charList.push(char);

            if(el.getAttribute("data-alt-char") !== null){
                charList.push(el.getAttribute("data-alt-char"));
            }
        });

        document.addEventListener("keydown", press => {
            if(charList.includes(press.key)){
                this.charButtons.forEach(btn => {
                    if(btn.textContent == press.key || btn.getAttribute("data-alt-char") == press.key){
                        btn.click();
                    }
                })
                press.preventDefault();
            }
            //else if(press.key == "Enter" && this.calcInput.value.length !== 0)
            else if(press.key == "Enter" && this.calcInput.innerHTML.length !== 0){
                calculateBtn.click();
                press.preventDefault();
            }
            else if(press.key == "Delete" || press.key == "Backspace"){
                deleteBtn.click();
                press.preventDefault();
            }
        })
    }
}

class ThemedPage {
    constructor(themeSwitch, allThemesList, elements, preferedTheme){
        this.themeSwitch = themeSwitch;
        this.allThemesList = allThemesList;
        this.elements = elements;
        this.preferedTheme = preferedTheme;

        if(localStorage.getItem('lastTheme') !== null){
            this.startingTheme = localStorage.getItem('lastTheme');
            console.log("Poslední: " + this.startingTheme);
        } else if(this.preferedTheme.length !== 0){
            this.startingTheme = this.preferedTheme;
            console.log("Preferované: " + this.startingTheme);
        } else{
            this.startingTheme = this.themeSwitch.getAttribute('data-starting-theme');
            console.log("Výchozí: " + this.startingTheme);
        }

        this.transformElements(this.startingTheme);
        this.themeIndex = this.allThemesList.indexOf(this.startingTheme);

        themeSwitch.addEventListener('click', this.nextTheme);
       
    }

    nextTheme = () => {
        
        if(this.themeIndex >= this.allThemesList.length-1){
            this.themeIndex = -1;
        }

        this.currentTheme = this.allThemesList[this.themeIndex+1];
        this.themeIndex++;

        localStorage.setItem('lastTheme', this.currentTheme);

        this.transformElements(this.currentTheme);
    }

    transformElements = (themeName) => {
        this.elements.forEach(element => {
            this.allThemesList.forEach(themeToDelete => {
                element.classList.remove(themeToDelete);
            })
            element.classList.add(themeName);
        });
    }
}

const themeSwitch = document.querySelector('[data-theme-switch]');
const themesList = themeSwitch.getAttribute('data-theme-switch').split(" ");
const elementsToSwitch = document.querySelectorAll("." + themesList.join(', .'));
let preferedTheme = "";

if(window.matchMedia("(prefers-color-scheme: light)").matches){
    preferedTheme = themeSwitch.getAttribute('data-light-theme');
} else if(window.matchMedia("(prefers-color-scheme: dark)").matches){
    preferedTheme = themeSwitch.getAttribute('data-dark-theme');
}

new ThemedPage(themeSwitch, themesList, elementsToSwitch, preferedTheme);

const input = document.querySelector('[data-calc-role="input"]');
const charBtns = document.querySelectorAll('[data-calc-role="char-button"]');
const resetBtn = document.querySelector('[data-calc-role="reset"]');
const deleteBtn = document.querySelector('[data-calc-role="delete"]');
const calculateBtn = document.querySelector('[data-calc-role="calculate"]');

new Calculator(input, charBtns, resetBtn, deleteBtn, calculateBtn);
