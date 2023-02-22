let deviceChosen
let osChosen
let loadInterval

const desktopButton = document.getElementById("desktop-button");
const laptopButton = document.getElementById("laptop-button");
const phoneButton = document.getElementById("phone-button");
const otherButton = document.getElementById("other-button");
const mobileRow = document.getElementById('mobile-row');
const computerRow = document.getElementById('computer-row');
const platformLabel = document.getElementById('select-plat-label');

const buttons = [desktopButton, laptopButton, phoneButton, otherButton];

buttons.forEach(button => {
    button.addEventListener("click", function() {
        deviceChosen = button.value;
        console.log(`${deviceChosen} button pressed`);
        buttons.forEach(button => {
            button.classList.remove("selected");
        });
        button.classList.add("selected");
        
        // const osRow = document.getElementById("os-row");
        
        if (deviceChosen === "Desktop" || deviceChosen === "Laptop") {
            platformLabel.classList.remove('hiddenNoVis');
            mobileRow.classList.remove("hiddenNoVis");
            computerRow.classList.remove("hiddenNoVis");
            mobileRow.classList.add("hidden");
            computerRow.classList.remove("hidden");
        } else if (deviceChosen === "Phone") {
            platformLabel.classList.remove('hiddenNoVis')
            mobileRow.classList.remove("hiddenNoVis");
            computerRow.classList.remove("hiddenNoVis");
            computerRow.classList.add("hidden");
            mobileRow.classList.remove("hidden");
        } else if (deviceChosen === "Other") {
            platformLabel.classList.add('hiddenNoVis')
            computerRow.classList.add("hiddenNoVis");
            mobileRow.classList.add("hiddenNoVis");

            deviceChosen = "";
            osChosen = "";
        }
    });
});
  
const windowsButton = document.getElementById("windows-button");
const macButton = document.getElementById("mac-button");
const iosButton = document.getElementById("ios-button");
const androidButton = document.getElementById("android-button");

const osButtons = [windowsButton, macButton, iosButton, androidButton];

osButtons.forEach(button => {
    button.addEventListener("click", function() {
        osChosen = button.value;
        console.log(`${osChosen} button pressed`);
        osButtons.forEach(button => {
            button.classList.remove("selected");
        });
        button.classList.add("selected");
    });
});
 
function handleSubmit(e) {
    e.preventDefault();

    // document.querySelector('.msg').textContent = '';
    // document.querySelector('#response').textContent = '';

    const prompt = sanitizeInput(document.querySelector('#prompt').value);

    if(prompt === '') {
        alert('Please enter in a question');
        return;
    }

    generateResponseRequest(prompt, deviceChosen, osChosen);
}

async function generateResponseRequest(prompt, device, osChosen) {
    try {
        showLoadingScreen();

        const response = await fetch('/openai/generateResponse', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify( {
                prompt,
                device,
                osChosen
            })
        });

        if(!response.ok) {
            hideLoadingScreen();
            throw new Error('That prompt could not be generated.');
        }

        const data = await response.json();
        const responseData = data.data;

        // Displays old data
        // document.querySelector('#response').textContent = responseData;

        hideLoadingScreen();

        // Displays data
        displaySteps(responseData);

    } catch (error) {
        document.querySelector('.msg').textContent = error;
    }
}

function displaySteps(answer) {
    //regex
    const pattern = /\d+\.\s+/;
    const stepArray = answer.split(pattern).filter(Boolean).map(str => str.replace(/\n/g, ""));
    // console.log(stepArray);

    // const stepsText = stepArray.map((step, index) => `${index + 1}. ${step}`).join('\n');

    const stepsList = document.getElementById("stepsList");
    stepsList.textContent = "";

    //creates the ordered list 
    for (let i = 0; i < stepArray.length; i++) {
        if (stepArray[i] !== "") {
            let listItem = document.createElement("li");
            listItem.innerText = stepArray[i];
            stepsList.appendChild(listItem);
        }
    }
}

const generatingResponse = document.getElementById('generatingResponse');

function loader(element) {
    element.textContent = "Generating response";
    loadInterval = setInterval(() => {
        element.textContent += ".";

        if (element.textContent === "Generating response....") {
            element.textContent = "Generating response.";
        }
    }, 300)
}

function showLoadingScreen() {
    document.querySelector('#loading-screen').classList.add('show');
    loader(generatingResponse);
    document.querySelector('main').classList.add('hidden');
}

function hideLoadingScreen() {
    document.querySelector('#loading-screen').classList.remove('show');
    document.querySelector('main').classList.remove('hidden');
    document.querySelector('#home-animation').classList.add('hide'); //hides home animation after loaded
    clearInterval(loadInterval);
}

// Called when the response is recieved -> shows a list of stuff
function showResponseScreen() {
    document.querySelector('main').classList.add('hidden');
    document.querySelector('#loading-screen').classList.remove('show');
}

document.querySelector('#prompt-form').addEventListener('submit', handleSubmit);

