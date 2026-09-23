const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

const drawer = $("#drawer"), overlay = $("#overlay");
$("#menuBtn").onclick = () => { drawer.classList.add("open"); overlay.classList.add("show"); };
$("#closeMenu").onclick = closeDrawer;
overlay.onclick = closeDrawer;
function closeDrawer(){ drawer.classList.remove("open"); overlay.classList.remove("show"); }
$$(".drawer a").forEach(a => a.onclick = closeDrawer);

const chapterData = {
  transition: {
    badge: "الباب الأول",
    title: "العناصر الانتقالية",
    description: "اختر الدرس الذي تريد البدء به.",
    lessons: [
      ["الدرس الأول", "مقدمة إلى العناصر الانتقالية", "شرح الأساسيات والخصائص العامة."],
      ["الدرس الثاني", "التوزيع الإلكتروني للعناصر الانتقالية", "فهم التوزيع الإلكتروني بطريقة سهلة."],
      ["الدرس الثالث", "خواص العناصر الانتقالية", "أهم الخواص والأفكار التي تتكرر في الأسئلة."],
      ["الدرس الرابع", "تفاعلات ومركبات العناصر الانتقالية", "شرح التفاعلات والتطبيقات المهمة."]
    ]
  },
  analysis: {
    badge: "الباب الثاني",
    title: "التحليل الكيميائي",
    description: "اختر الدرس الذي تريد البدء به.",
    lessons: [
      ["الدرس الأول", "مقدمة في التحليل الكيميائي", "تعريف التحليل وأنواعه وخطواته."],
      ["الدرس الثاني", "التحليل النوعي", "التعرف على الأيونات والمجموعات المهمة."],
      ["الدرس الثالث", "الكشف عن الأيونات", "أهم الاختبارات والتفاعلات في التحليل."],
      ["الدرس الرابع", "مسائل وتطبيقات التحليل الكيميائي", "تدريب على الأفكار والأسئلة."]
    ]
  }
};

const home = $("#home"), chapterPage = $("#chapterPage"), accountPage = $("#accountPage");
const chapterTitle = $("#chapterTitle"), chapterBadge = $("#chapterBadge"), chapterDescription = $("#chapterDescription"), chapterLessons = $("#chapterLessons");

function showHome(){
  home.hidden = false; chapterPage.hidden = true; accountPage.hidden = true;
  window.scrollTo({top:0, behavior:"smooth"});
  setActiveNav("home");
}
function showChapter(key){
  const data = chapterData[key];
  if(!data) return;
  home.hidden = true; accountPage.hidden = true; chapterPage.hidden = false;
  chapterBadge.textContent = data.badge;
  chapterTitle.textContent = data.title;
  chapterDescription.textContent = data.description;
  chapterLessons.innerHTML = data.lessons.map((l,i)=>`
    <button class="lesson" data-lesson="${l[1]}">
      <span class="lesson-icon">${i % 2 ? "⚛" : "⚗"}</span>
      <span class="lesson-info"><b>${l[0]} — ${l[1]}</b><small>${l[2]}</small></span>
      <span class="duration">فيديو</span><span class="play">▶</span>
    </button>`).join("");
  $$(".lesson").forEach(btn => btn.onclick = () => showToast(`سيتم فتح درس «${btn.dataset.lesson}» عند إضافة رابط الفيديو.`));
  window.scrollTo({top:0, behavior:"smooth"});
  setActiveNav("chapters");
}

$$(".chapter-card").forEach(card => card.onclick = () => showChapter(card.dataset.chapter));
$("#backHome").onclick = showHome;

function setActiveNav(name){
  $$(".bottom-nav a").forEach(a=>a.classList.remove("active"));
  const link = [...$$(".bottom-nav a")].find(a=>a.getAttribute("href") === `#${name}` || (name === "chapters" && a.getAttribute("href") === "#chapters"));
  if(link) link.classList.add("active");
}

$$('.bottom-nav a').forEach(a=>a.onclick=e=>{
  e.preventDefault();
  const target=a.getAttribute('href');
  if(target==='#account') showAccount();
  else if(target==='#chapters'){ showHome(); setTimeout(()=>$('#chapters').scrollIntoView({behavior:'smooth'}),50); }
  else showHome();
});

function showAccount(){
  home.hidden=true; chapterPage.hidden=true; accountPage.hidden=false;
  renderAccount();
  window.scrollTo({top:0,behavior:'smooth'});
  setActiveNav('account');
}
$("#accountBtn").onclick=showAccount;
$("#backAccount").onclick=showHome;

const AUTH_KEY='argoon_student_account';
let loginMode=false;
function getAccount(){ try{return JSON.parse(localStorage.getItem(AUTH_KEY));}catch{return null;} }
function saveAccount(data){localStorage.setItem(AUTH_KEY,JSON.stringify(data));}

function renderAccount(){
  const account=getAccount();
  const authCard=$("#authCard"), profileCard=$("#profileCard");
  if(account){
    authCard.hidden=true; profileCard.hidden=false;
    $("#profileName").textContent=account.name;
    $("#profileEmail").textContent=account.email;
    $("#accountHeading").textContent='أهلاً بك، '+account.name;
    $("#accountStatus").textContent='حسابك محفوظ على هذا الجهاز.';
    $("#accountBtn").textContent='فتح حسابي';
  }else{
    authCard.hidden=false; profileCard.hidden=true;
    $("#accountHeading").textContent='سجّل حسابك وابدأ رحلتك';
    $("#accountStatus").textContent='احفظ تقدمك على هذا الجهاز وادخل لحسابك في أي وقت.';
    $("#accountBtn").textContent='تسجيل حساب';
    updateAuthMode();
  }
}
function updateAuthMode(){
  $("#authTitle").textContent=loginMode?'تسجيل الدخول':'إنشاء حساب جديد';
  $("#authSubtitle").textContent=loginMode?'ادخل بيانات حسابك للمتابعة.':'أنشئ حسابًا لحفظ بياناتك وتقدمك على هذا الجهاز.';
  $("#nameInput").closest('label').style.display=loginMode?'none':'';
  $("#nameInput").required=!loginMode;
  $("#passwordInput").autocomplete=loginMode?'current-password':'new-password';
  $("#authSubmit").textContent=loginMode?'تسجيل الدخول':'إنشاء الحساب';
  $("#switchAuth").textContent=loginMode?'ليس لديك حساب؟ إنشاء حساب جديد':'لديك حساب بالفعل؟ تسجيل الدخول';
}
$("#switchAuth").onclick=()=>{loginMode=!loginMode; updateAuthMode();};

$("#authForm").onsubmit=e=>{
  e.preventDefault();
  const name=$("#nameInput").value.trim();
  const email=$("#emailInput").value.trim().toLowerCase();
  const password=$("#passwordInput").value;
  const old=getAccount();
  if(loginMode){
    if(!old || old.email!==email || old.password!==password){ showToast('البريد الإلكتروني أو كلمة المرور غير صحيحة.'); return; }
    showToast('تم تسجيل الدخول بنجاح.');
  }else{
    if(password.length<6){showToast('كلمة المرور يجب أن تكون 6 أحرف على الأقل.');return;}
    saveAccount({name,email,password});
    showToast('تم إنشاء الحساب وحفظه على هذا الجهاز.');
  }
  e.target.reset(); loginMode=false; renderAccount();
};

$("#logoutBtn").onclick=()=>{localStorage.removeItem(AUTH_KEY);showToast('تم تسجيل الخروج.');renderAccount();};

function showToast(message){
  const t=$("#toast"); t.textContent=message; t.classList.add('show');
  clearTimeout(window.toastTimer); window.toastTimer=setTimeout(()=>t.classList.remove('show'),2600);
}

const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.08});
$$('.reveal').forEach(x=>io.observe(x));

// If the page is opened with #account, open the account screen directly.
if(location.hash==='#account') showAccount();
