fetch("data.json")
.then(res => res.json())
.then(data => {

$('#chart-container').orgchart({

    data: data,

    pan: true,

    zoom: true,

    nodeContent: 'title'

});

$('.node').on('click', function(){

    let nodeData = $(this).data('nodeData');

    document.getElementById("personName").innerText =
        nodeData.name || '';

    document.getElementById("personPosition").innerText =
        nodeData.title || '';

    document.getElementById("personPhoto").src =
        nodeData.photo || 'photos/default.png';

    document.getElementById("detailModal").style.display =
        "block";
});

});

document.querySelector(".close").onclick = () => {

document.getElementById("detailModal").style.display = "none";

};

const ADMIN_PASSWORD = "0910655667";

document
.getElementById("adminBtn")
.addEventListener("click",()=>{

    const pass = prompt("กรอกรหัสแอดมิน");

    if(pass === ADMIN_PASSWORD){

        localStorage.setItem(
            "isAdmin",
            "true"
        );

        alert("เข้าสู่โหมดแอดมินสำเร็จ");

        enableAdminMode();

    }else{

        alert("รหัสผ่านไม่ถูกต้อง");

    }

});

function enableAdminMode(){

    document.body.classList.add("admin-mode");

    console.log("ADMIN MODE");

}

function enableAdminMode(){

    const editBtn =
    document.createElement("button");

    editBtn.innerText = "แก้ไขข้อมูล";

    editBtn.onclick = ()=>{

        alert("เปิดหน้าแก้ไข");

    };

    document.body.appendChild(editBtn);

}