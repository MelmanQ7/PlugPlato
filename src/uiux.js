import { iframeCont, closeBtn, modal } from "./variables.js";

const { invoke } = window.__TAURI__.core;
const { convertFileSrc } = window.__TAURI__.core;

export async function showPlugin(item, external) {
    let a = invoke('plugin_exists', { name: item, external: external });

    iframeCont.style.display = "block";
    iframeCont.innerHTML = '';
    const url = `./plugins/${item}/index.html`;

    const exists = await a;

    try {

        const myFrame = document.createElement("iframe");

        if (exists) {
            if (external) {
                const instaled = await invoke('install_pligin', { name: item });
                if (instaled) {
                    myFrame.src = `./plugins/${item}/index.html`;
                    console.log(myFrame.src);
                }
            } else {
                // для внутрішніх - як раніше
                myFrame.src = `./plugins/${item}/index.html`;
            }
        } else {
            myFrame.src = "./warn.html";
        }

        iframeCont.append(myFrame);

    } catch (error) {

        console.log("FETCH ERROR", error);

        const myFrame = document.createElement("iframe");
        myFrame.src = "warn.html";
        iframeCont.append(myFrame);

    }
}

export function closeModal() {
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}