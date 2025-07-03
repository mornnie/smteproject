function setupSideMenu(){
    const menuToggleOutside = document.getElementById('menu-toggle-outside');
    const menuToggleInside = document.getElementById('menu-toggle-inside');
    const sideMenu = document.getElementById('side-menu');
    const overlay = document.getElementById('overlay');

    if(!menuToggleOutside || !menuToggleInside || !sideMenu || !overlay) return;

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
}

function setupDropDown(){
    const dropdownButton = document.getElementById('dropdown-button');
    const dropdownMenu = document.getElementById('dropdown-menu');

    if(!dropdownButton || !dropdownMenu) return;

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
}

function setupInput(){
    const buttonCamera = document.getElementById('button-camera');
    const realCamera = document.getElementById('real-camera');
    const buttonInput = document.getElementById('button-input');
    const realInput = document.getElementById('real-input');
    const buttonProcess = document.getElementById('button-process');
    const uploadcontainer = document.getElementById('upload-container');
    const textResult = document.getElementById('text-result');
    const textExplain = document.getElementById('text-explain');

    if(buttonCamera && realCamera){
        buttonCamera.addEventListener('click', () => {
            realCamera.click();
        });
    }

    if(realCamera && uploadcontainer){
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
        });
    }

    if(buttonInput){
        buttonInput.addEventListener('click', () => {
            realInput.click();
        });
    }

    if(realInput && uploadcontainer){
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
    }

    if(!buttonProcess || !realCamera || !uploadcontainer || !textResult || !textExplain) return;
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

                if(!data.image_type) throw new Error();
                console.log(data);
                const img = document.createElement('img');
                img.src = data.ret_image_url;
                img.style.width = '300px';
                img.style.height = '300px';
                
                uploadcontainer.innerHTML = '';
                uploadcontainer.appendChild(img);

                const resultTemplate = "คำตอบ คือ {{answer}} รูป";
                const explanationTemplateTri = `ฐานที่ {{i}} เลือกด้านประกอบมุมยอดได้ {{x}} เส้น สร้างได้ \\( \\binom{{x}}{2} = {{y}} \\) รูป<br>`;
                const explanationTemplateRec = `เมื่อเลือกเส้นแนวนอนที่ {{i}} และ {{j}} เลือกเส้นแนวตั้งได้ 2 เส้น จาก {{x}} เส้น สร้างได้ \\( \\binom{{x}}{2} = {{y}} \\) รูป<br>`

                function renderTemplate(template, values){
                    return template.replace(/{{(.*?)}}/g, (match, key) => values[key.trim()] ?? '');
                }

                let resultHTML = '';
                let explanationHTML = '';

                resultHTML += renderTemplate(resultTemplate, {answer: data.answer});

                if(data.image_type === 'triangle'){
                    console.log('check');
                    data.arr_info.forEach((x, index) => {
                        const i = index + 1;
                        const y = x * (x-1) / 2;
                        explanationHTML += renderTemplate(explanationTemplateTri, { i, x, y });
                    })
                }
                else if(data.image_type === 'rectangle'){
                    console.log('checked')
                    for(let i=0; i<data.arr_info.length; i++){
                        for(let j=i+1; j<data.arr_info.length; j++){
                            const x = Math.min(data.arr_info[i], data.arr_info[j]);
                            const y = x * (x-1) / 2;
                            console.log(x);
                            explanationHTML += renderTemplate(explanationTemplateRec, { i: i+1, j: j+1, x, x, y });
                        }
                    }
                }

                textResult.innerHTML = resultHTML;
                textExplain.innerHTML = explanationHTML;

                if(window.MathJax){
                    MathJax.typeset();
                }
            }
            catch{
                textResult.innerHTML = 'ไม่สามารถหาคำตอบได้'
                textExplain.innerHTML = 'ปัญหานี้อาจอยู่นอกขอบเขตที่เราแก้ได้'
                
                textResult.style.color = 'red';
                textExplain.style.color = 'red';
            }
        }
    });
}

function renderMarkdown(id, markdown){
    const obj = document.getElementById(id);
    if(!obj) return Promise.resolve();

    const html = marked.parse(markdown);
    obj.innerHTML = html;

    return MathJax.typesetPromise();
}

const topicMarkdown = `
### การจัดกลุ่ม
การเลือก หรือ การจัดหมู่ เป็นการจัดเรียงแบบไม่สนใจลำดับ<br><br>
ถ้ากำหนดเซต A = {1, 2, 3, 4}<br><br>
หากทำการจัดเรียงเลข 2 หลักจากเลขโดดในเซต A โดยไม่ใช้เลขซ้ำ<br><br>
จะได้ P(4,2) = $ \\Large \\frac{4!}{2!} $ = 12<br><br>
แต่หากทำการเลือกจำนวน 2 จำนวนจากเซต A<br><br>
จะพบว่าการเลือก 1 และ 2 เป็นสิ่งเดียวกันกับการเลือก 2 และ 1<br><br>
นั้นคือ {1, 2} = {2, 1}<br><br>
การเลือกนี้มีความหมายเทียบเท่ากับสับเซตของเซต A ที่มีสมาชิกสองตัว<br><br>
ได้แก่ {1, 2}, {1, 3}, {1, 4}, {2, 3}, {2, 4}, {3, 4} มีทั้งหมด 6 แบบ<br><br>
เมื่อเราคิดย้อนกลับจะพบว่าหากเรามองการจัดหมู่ให้เป็นลำดับโดยการสลับสมาชิกในเซตที่ถูกเลือก<br><br>
จะทำให้ได้การจัดเรียงเชิงเส้น
<br><br>
### ปัญหาการจัดหมู่
สมมติให้มีสิ่งของ n สิ่ง N = {n1, n2, n3, …, nn}<br><br>
ทำการเลือก k สิ่งจะแทนด้วย C(n,k)<br><br>
จะได้เซตในรูปของ {c1, c2, …, ck} เป็นสับเซตของ N ที่มีสมาชิก k ตัว<br><br>
หากเราทำการเรียงสับเปลี่ยน k ตัวนี้จะได้ k! จะเกิดเป็นการจัดเรียงสิ่งของ n สิ่ง k ตำแหน่ง<br><br>
P(n,k) เขียนเป็นสมการได้ดังนี้ C(n,k) x k! = P(n,k)<br><br>
จะได้ว่า C(n,k) = $ \\Large \\frac{P(n,k)}{k!} $ = $ \\Large \\frac{n!}{(n - k)!k!} $<br><br>
**ตัวอย่าง** กำหนดพื้นที่ขนาด 3x4 ตารางเมตรดังรูป จงหาจำนวนรูปสี่เหลี่ยมมุมฉาก<br><br>
![](https://www.scimath.org/images/2019/Lesson/11244/11244-8.JPG)<br><br>
ขั้นตอนที่ 1 เลือกเส้นแนวตั้งได้ 2 เส้นจาก 4 เส้น C(4,2)<br><br>
ขั้นตอนที่ 2 เลือกเส้นแนวตั้งได้ 2 เส้นจาก 5 เส้น C(5,2)<br><br>
จำนวนรูปสี่เหลี่ยมมุมฉากทั้งหมดเท่ากับ C(4,2) x C(5,2) = 60 รูป<br><br>
คุณสมบัติที่ควรรู้ของ C(n,k) พิจารณา C(100,9) = $ \\Large \\frac{100!}{91! 9!} $ = $ \\Large \\frac{100!}{9! 91!} $ = C(100,91)<br><br>
สังเกตได้ว่า C(n,r) = C(n,k) ถ้า r + k = n เนื่องจาก r = n - k จะได้ C(n,r) = $ \\Large \\frac{n!}{(n - r)!r!} $ = $ \\Large \\frac{n!}{k!(n - k)!} $ = C(n,k)<br><br>
หากตีความหมายของ C(n,k) = C(n, n - k) จะแปลความได้ว่า<br><br>
การจัดหมู่หรือเลือกสิ่งของจำนวน k สิ่ง จะทำให้ได้สิ่งของที่ไม่ถูกเลือกจะเกิดเป็นการจัดกลุ่มของสิ่งของที่มีจำนวน n - k สิ่งพร้อมกัน<br><br>
ที่มา : www.scimath.org
`;

const exampleMarkdown = `
### จงหาจำนวนรูปสามเหลี่ยมทั้งหมด
<img src='static/example_tri.jpg' height='300px'>

### แนวคิด
สามเหลี่ยม ประกอบด้วย ฐาน 1 ด้าน และด้านประกอบมุมยอด 2 ด้าน<br><br>
ให้เส้นแนวนอนแต่ละเส้นเป็นฐานของรูปสามเหลี่ยมย่อย<br><br>
เมื่อจากด้านล่างขึ้นด้านบน<br><br>
ฐานที่ 1 สามารถเลือกด้านประกอบมุมยอดได้ 2 จาก 4 เส้น<br>
เท่ากับสร้างได้ $ \\Large \\binom{4}{2} $ = $ \\Large \\frac{4!}{2!2!} $ = 6 รูป<br><br>
เส้นที่ 2 สามารถเลือกด้านประกอบมุมยอดได้ 2 จาก 4 เส้น<br>
เท่ากับสร้างได้ $ \\Large \\binom{4}{2} $ = $ \\Large \\frac{4!}{2!2!} $ = 6 รูป<br><br>
เส้นที่ 3 สามารถเลือกด้านประกอบมุมยอดได้ 2 จาก 4 เส้น<br>
เท่ากับสร้างได้ $ \\Large \\binom{4}{2} $ = $ \\Large \\frac{4!}{2!2!} $ = 6 รูป<br><br>
รวม สร้างสามเหลี่ยมได้ 6 + 6 + 6 = 18 รูป<br><hr>

### จงหาจำนวนรูปสี่เหลี่ยมมุมฉากทั้งหมด
<img src='static/example_rec.jpg' height='300px'>

### แนวคิด
เลือกเส้นแนวตั้งได้ 2 จาก 5 เส้น<br>
เท่ากับสร้างได้ $ \\Large \\binom{5}{2} $ = $ \\Large \\frac{5!}{2!3!} $ = 10 รูป<br><br>
เลือกเส้นแนวนอนได้ 2 จาก 3 เส้น<br>
เท่ากับสร้างได้ $ \\Large \\binom{3}{2} $ = $ \\Large \\frac{3!}{2!1!} $ = 3 รูป<br><br>
รวม สร้างสี่เหลี่ยมมุมฉากได้ 10 x 3 = 30 รูป
`;

document.addEventListener('DOMContentLoaded', () => {
    setupSideMenu();
    setupDropDown();
    setupInput();

    renderMarkdown('paragraph', topicMarkdown);
    renderMarkdown('triangle-text', exampleMarkdown);
});
