const form = document.getElementById("form1");
const fname = document.getElementById("first-name");
const fname_RGX = /^[a-z\u05D0-\u05EA']+$/i;
const lname = document.getElementById("last-name");
const email = document.getElementById("email");
const email_RGX = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
const phone = document.getElementById("phone");
const phone_RGX = /^05[0-9]{8}$/;
const pwd = document.getElementById("password");
const re_pwd = document.getElementById("re-password");
const pwd_RGX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;
const submit_btn = document.getElementById("submit-btn");
const error_area = document.getElementById("error");
let will_validate = 0;

function validate_fname() {
    const new_para = document.createElement("p");
    if (fname.value=="") {
        error_area.appendChild(new_para).innerHTML = "״שם פרטי״ חייב להיות מלא";
    } else if (fname.value.length < 2) {
        error_area.appendChild(new_para).innerHTML = "״שם פרטי״ חייב להיות יותר מ-2 תוים";
    } else if (fname.value.length > 12) {
        error_area.appendChild(new_para).innerHTML = "״שם פרטי״ לא יכול להיות יותר מ-12 תוים";
    } else if (!fname_RGX.test(fname.value)) {
        error_area.appendChild(new_para).innerHTML = "״שם פרטי״ חייב להכיל תוים בעברית או אנגלית בלבד";
    } else (will_validate++);
};

function validate_lname() {
    const new_para = document.createElement("p");
    if (lname.value=="") {
        error_area.appendChild(new_para).innerHTML = "״שם משפחה״ חייב להיות מלא";
    } else if (lname.value.length < 2) {
        error_area.appendChild(new_para).innerHTML = "״שם משפחה״ חייב להיות יותר מ-2 תוים";
    } else if (lname.value.length > 12) {
        error_area.appendChild(new_para).innerHTML = "״שם משפחה״ לא יכול להיות יותר מ-12 תוים";
    } else if (!fname_RGX.test(lname.value)) {
        error_area.appendChild(new_para).innerHTML = "״שם משפחה״ חייב להכיל תוים בעברית או אנגלית בלבד";
    } else (will_validate++);
};

function validate_mail() {
    const new_para = document.createElement("p");
    if (email.value=="") {
        error_area.appendChild(new_para).innerHTML = "״אימייל״ חייב להיות מלא";
    } else if (!email_RGX.test(email.value)) {
        error_area.appendChild(new_para).innerHTML = "״אימייל״ חייב להיות בפורמט הנכון";
    } else (will_validate++);
};

function validate_phone() {
    const new_para = document.createElement("p");
    if (phone.value=="") {
        error_area.appendChild(new_para).innerHTML = "״טלפון״ חייב להיות מלא";
    } else if (phone.value.length !== 10) {
        error_area.appendChild(new_para).innerHTML = "״טלפון״ חייב להיות 10 ספרות";
    } else if (!phone_RGX.test(phone.value)) {
        error_area.appendChild(new_para).innerHTML = "״טלפון״ חייב להיות מס׳ נייד ישראלי";
    } else (will_validate++);
};

function validate_passwords() {
    const new_para = document.createElement("p");
    if (pwd.value==="" || re_pwd.value==="") {
        error_area.appendChild(new_para).innerHTML = "חייב לבחור ולאמת סיסמה";
    } else if (pwd.value.length < 8 || re_pwd.value.length < 8) {
        error_area.appendChild(new_para).innerHTML = "הסיסמא חייבת להיות לפחות 8 תוים";
    } else if (!pwd_RGX.test(pwd.value) || !pwd_RGX.test(re_pwd.value)) {
        error_area.appendChild(new_para).innerHTML = "הסיסמא חייבת להיות מורכבת לפחות מאות גדולה, אות קטנה, מספר ותו מיוחד";
    } else if (pwd.value!==re_pwd.value) {
        error_area.appendChild(new_para).innerHTML = "הסיסמאות חייבות להיות זהות";     
    } else (will_validate++);
};

function valid_check() {
    if (will_validate === 5 && error_area.innerText === "") {
        error_area.appendChild(new_para).innerHTML = "FUCK YOU";
    }
}

submit_btn.addEventListener("click", function() {
    will_validate = 0;
    error_area.innerText = "";
    validate_fname();
    validate_lname();
    validate_mail();
    validate_phone();
    validate_passwords();
    valid_check();
});
