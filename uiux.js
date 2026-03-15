import { iframeCont, closeBtn, modal } from "./variables.js";

export async function showPlugin(item) {
    iframeCont.style.display = "block";
    iframeCont.innerHTML = '';
    const url = `./plugins/${item}/index.html`;

    try {
        const response = await fetch(url, { method: "HEAD" });

        const myFrame = document.createElement("iframe");

        if (response.ok) {
            myFrame.src = url;
        } else {
            myFrame.src = "warn.html";
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