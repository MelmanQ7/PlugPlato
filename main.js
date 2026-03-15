import { btn, iframeCont, modal, contentModal } from "./variables.js";
import { showPlugin, closeModal } from "./uiux.js";

function init() {
    closeModal();
}

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

window.addEventListener('keydown', (e) => {
    let second = e.key === "w" || e.key === "W" || e.key === "c" || e.key === "C";
    if (e.altKey && second) {
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

window.addEventListener('message', (e) => {
    if (e.data.type) {
        console.log("Plugin error:", e.data.message);
    }
});

window.addEventListener('keyup', (e) => {
    let second = e.key === 'q' || e.key === 'Q';
    if (e.key === 'Escape' || (e.altKey && second)) {
        modal.style.display = 'none';
    }
});

init();