function createPlugin(src) {
    const wrapper = document.createElement('div');
    wrapper.className = 'plugin-window';
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.onclick = () => wrapper.remove();
    
    const iframe = document.createElement('iframe');
    iframe.src = src;
    
    wrapper.appendChild(closeBtn);
    wrapper.appendChild(iframe);
    document.body.appendChild(wrapper);
}