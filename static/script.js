document.addEventListener('DOMContentLoaded', () => {
    const markdown = `
### การจัดกลุ่ม
การเลือก หรือ การจัดหมู่ เป็นการจัดเรียงแบบไม่สนใจลำดับ<br><br>
ถ้ากำหนดเซต A = {1, 2, 3, 4}<br><br>
หากทำการจัดเรียงเลข 2 หลักจากเลขโดดในเซต A โดยไม่ใช้เลขซ้ำ<br><br>
จะได้ P(4,2) = $ \\frac{4!}{2!} $ = 12<br><br>
แต่หากทำการเลือกจำนวน 2 จำนวนจากเซต A<br><br>
จะพบว่าการเลือก 1 และ 2 เป็นสิ่งเดียวกันกับการเลือก 2 และ 1<br><br>
นั้นคือ {1, 2} = {2, 1}<br><br>
การเลือกนี้มีความหมายเทียบเท่ากับสับเซตของเซต A ที่มีสมาชิกสองตัว<br><br>
ได้แก่ {1, 2}, {1, 3}, {1, 4}, {2, 3}, {2, 4}, {3, 4} มีทั้งหมด 6 แบบ<br><br>
เมื่อเราคิดย้อนกลับจะพบว่าหากเรามองการจัดหมู่ให้เป็นลำดับโดยการสลับสมาชิกในเซตที่ถูกเลือก<br><br>
จะทำให้ได้การจัดเรียงเชิงเส้น
<br><br>
### ปัญหาการจัดหมู่
สมมติให้มีสิ่งของ n สิ่ง N = {n1, n2, n3,…, nn}<br><br>
ทำการเลือก k สิ่งจะแทนด้วย C(n,k)<br><br>
จะได้เซตในรูปของ {c1, c2, …, ck} เป็นสับเซตของ N ที่มีสมาชิก k ตัว<br><br>
หากเราทำการเรียงสับเปลี่ยน k ตัวนี้จะได้ k! จะเกิดเป็นการจัดเรียงสิ่งของ n สิ่ง k ตำแหน่ง<br><br>
P(n,k) เขียนเป็นสมการได้ดังนี้ C(n,k) x k! = P(n,k)<br><br>
จะได้ว่า C(n,k) = $ \\frac{P(n,k)}{k!} $ = $ \\frac{n!}{(n - k)!k!} $<br><br>
**ตัวอย่าง** กำหนดพื้นที่ขนาด 3x4 ตารางเมตรดังรูป จงหาจำนวนรูปสี่เหลี่ยมมุมฉาก<br><br>
![](https://www.scimath.org/images/2019/Lesson/11244/11244-8.JPG)<br><br>
ขั้นตอนที่ 1 เลือกเส้นแนวตั้งได้ 2 เส้นจาก 4 เส้น C(4,2)<br><br>
ขั้นตอนที่ 2 เลือกเส้นแนวตั้งได้ 2 เส้นจาก 5 เส้น C(5,2)<br><br>
จำนวนรูปสี่เหลี่ยมมุมฉากทั้งหมดเท่ากับ C(4,2) x C(5,2) = 60 รูป<br><br>
คุณสมบัติที่ควรรู้ของ C(n,k) พิจารณา C(100,9) = $ \\frac{100!}{91! 9!} $ = $ \\frac{100!}{9! 91!} $ = C(100,91)<br><br>
สังเกตได้ว่า C(n,r) = C(n,k) ถ้า r + k = n เนื่องจาก r = n - k จะได้ C(n,r) = n! / [ (n - r)!r! ] = n! / [ k!(n - k)! ] = C(n,k)<br><br>
หากตีความหมายของ C(n,k) = C(n, n - k) จะแปลความได้ว่า<br><br>
การจัดหมู่หรือเลือกสิ่งของจำนวน k สิ่ง จะทำให้ได้สิ่งของที่ไม่ถูกเลือกจะเกิดเป็นการจัดกลุ่มของสิ่งของที่มีจำนวน n - k สิ่งพร้อมกัน<br><br>
ที่มา : www.scimath.org
`;

    window.onload = function () {
        const html = marked.parse(markdown);
        document.getElementById('paragraph').innerHTML = html;
        MathJax.typesetPromise(); 
    };


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
