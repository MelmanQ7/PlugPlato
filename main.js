let btn = document.getElementById('choiceBtn');
let cont = document.getElementById('iframeCont');
const modal = document.querySelector('.modal');
const contentModal = document.querySelector('.contentModal');

let plugins = {};

async function getPlugs() {
    let responce = await fetch('./plugins.json');
    let data = await responce.json();

    return data;
}

async function showList() {
    let userlist = document.querySelector('#list');
    let plugs = await getPlugs();

    const list = Object.values(plugs);

    let html = ``;

    for (let i = 0; i < list.length; i++) {
        html += `
        <li>
        <button class="item" data-index="${i}">${list[i]}</button>
        </li>
        `;
    }

    userlist.innerHTML = html;

    userlist.onclick = (e) => {
        if (e.target.classList.contains('item')) {
            const index = Number(e.target.dataset.index);
            showPlugin(list[index]);
        }
    };
}

async function showPlugin(item) {
    console.log("start");

    cont.style.display = "block";
    cont.innerHTML = '';
    const url = `./plugins/${item}/index.html`;

    try {

        console.log("fetch:", url);

        const response = await fetch(url, { method: "HEAD" });

        console.log("status:", response.status);

        const myFrame = document.createElement("iframe");

        if (response.ok) {
            console.log("file exists");
            myFrame.src = url;
        } else {
            console.log("file NOT found");
            myFrame.src = "warn.html";
        }

        cont.append(myFrame);

    } catch (error) {

        console.log("FETCH ERROR", error);

        const myFrame = document.createElement("iframe");
        myFrame.src = "warn.html";
        cont.append(myFrame);

    }
}

cont.style.display = "none";

window.addEventListener('keyup', (e) => {
    if (e.altKey && e.key === "w") {
        modal.style.display = "flex";
        showList();
    }
});

btn.addEventListener('click', () => {
    modal.style.display = "flex";
    showList();
});

contentModal.addEventListener('click', (e) => {
    e.stopPropagation();
});

modal.addEventListener('click', () => {
    modal.style.display = "none";
});