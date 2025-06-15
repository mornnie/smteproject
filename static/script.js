document.addEventListener('DOMContentLoaded', () => {
    const topicButton = document.getElementById('topic-button');
    const scannerButton = document.getElementById('scanner-button');
    const exampleButton = document.getElementById('example-button');
    const ratingButton = document.getElementById('rating-button');
    
    const menuToggleOutside = document.getElementById('menu-toggle-outside');
    const menuToggleInside = document.getElementById('menu-toggle-inside');
    const sideMenu = document.getElementById('side-menu');
    const overlay = document.getElementById('overlay');

    function useSideMenu(){
        if(sideMenu.style.width == '250px'){
            sideMenu.style.width = '0';
            overlay.style.display = 'none';
        }
        else{
            sideMenu.style.width = '250px';
            overlay.style.display = 'block';
        }
    }

    menuToggleOutside.addEventListener('click', useSideMenu);
    menuToggleInside.addEventListener('click', useSideMenu);
    overlay.addEventListener('click', useSideMenu);

    const dropdownButton = document.getElementById('dropdown-button');
    const dropdownMenu = document.getElementById('dropdown-menu');

    function useDropDown(){
        dropdownButton.classList.toggle('active');
        if(dropdownMenu.style.height == '100px'){
            dropdownMenu.style.height = '0';
            dropdownMenu.style.border = 'none';
        }
        else{
            dropdownMenu.style.height = '100px';
            dropdownMenu.style.display = 'flex';
            dropdownMenu.style.flexDirection = 'column';
            dropdownMenu.style.border = 'black 1px solid';
        }
    }

    dropdownButton.addEventListener('click', useDropDown);

    const buttonCamera = document.getElementById('button-camera');
    const realCamera = document.getElementById('real-camera');
    const buttonInput = document.getElementById('button-input');
    const realInput = document.getElementById('real-input');
    const buttonProcess = document.getElementById('button-process');
    const uploadcontainer = document.getElementById('upload-container');
    const textResult = document.getElementById('text-result');
    const textExplain = document.getElementById('text-explain');

    buttonCamera.addEventListener('click', () => {
        realCamera.click();
    })

    realCamera.addEventListener('change', () => {
        const file = realCamera.files[0];
        
        if(file){
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file)
            img.style.width = '300px';
            img.style.height = '300px';
            uploadcontainer.innerHTML = '';
            uploadcontainer.appendChild(img);
        }
    })

    buttonInput.addEventListener('click', () => {
        realInput.click();
    });

    realInput.addEventListener('change', () => {
        const file = realInput.files[0];

        if(file){
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file)
            img.style.width = '300px';
            img.style.height = '300px';
            uploadcontainer.innerHTML = '';
            uploadcontainer.appendChild(img);
        }
    });

    buttonProcess.addEventListener('click', async() => {
        let file = null;

        if(realCamera.files.length > 0){
            file = realCamera.files[0];
        }
        else{
            file = realInput.files[0];
        }

        if(file){
            const formData = new FormData();
            formData.append('image', file);

            try{
                const response = await fetch('/upload', {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();

                if(data.ret_image_url){
                    const img = document.createElement('img');
                    img.src = data.ret_image_url;
                    img.style.width = '300px';
                    img.style.height = '300px';
                    
                    uploadcontainer.innerHTML = '';
                    uploadcontainer.appendChild(img);

                    const resultTemplate = "คำตอบ คือ {{answer}} รูป";
                    const explanationTemplateTri = `ฐานที่ {{i}} เลือกด้านประกอบมุมยอดได้ {{x}} เส้น สร้างได้ \\( \\binom{{x}}{2} = {{y}} \\) รูป<br>`;
                    const explanationTemplateRec = `ฐานที่ {{i}} เลือกด้านประกอบมุมยอดได้ {{x}} เส้น สร้างได้ \\( \\binom{{x}}{2} = {{y}} \\) รูป<br>`

                    function renderTemplate(template, values){
                        return template.replace(/{{(.*?)}}/g, (match, key) => values[key.trim()] ?? '');
                    }

                    let resultHTML = '';
                    if(data.answer){
                        resultHTML += renderTemplate(resultTemplate, {answer: data.answer});
                    }

                    let explanationHTML = '';
                    if(data.arr_info){
                        data.arr_info.forEach((x, index) => {
                            const i = index + 1;
                            const y = x * (x-1) / 2;
                            explanationHTML += renderTemplate(explanationTemplateTri, { i, x, y });
                        });
                    }

                    textResult.innerHTML = resultHTML;
                    textExplain.innerHTML = explanationHTML;

                    if(window.MathJax){
                        MathJax.typeset();
                    }
                }
                else{
                    alert('cannot upload');
                }
            }
            catch{
                alert(error.message);
            }
        }
    });
});
