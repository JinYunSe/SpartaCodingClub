import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDFHJXiFM2YtnoDYIYZL9tFH7fi2gSRuXA",
    authDomain: "sparta-d46a3.firebaseapp.com",
    projectId: "sparta-d46a3",
    storageBucket: "sparta-d46a3.appspot.com",
    messagingSenderId: "736869860855",
    appId: "1:736869860855:web:f5e7e878753119d06f5af2",
    measurementId: "G-4LND2EJ73P"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', function() {
    loadMembers();
});

async function loadMembers() {
    const membersCol = collection(db, 'members');
    const membersSnapshot = await getDocs(membersCol);
    const memberList = membersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const memberSection = document.getElementById('team-members');
    memberSection.innerHTML = '';  

    memberList.forEach(member => {
        const memberDiv = createMemberElement(member);
        memberSection.appendChild(memberDiv);
    });
}

function createMemberElement(member) {
    const newMember = document.createElement('div');
    newMember.className = 'member';

    newMember.innerHTML = `
        <div class="member-photo" style="background-image: url('${member.photoUrl}');"></div>
        <div class="member-info">
            <h3>${member.name} <a href="${member.githubUrl}" target="_blank" class="github-button">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.54 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.13 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.11.16 1.93.08 2.13.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38A8.002 8.002 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                </svg>
            </a></h3>
            <p>${member.description}</p>
            <p class="mbti">MBTI: ${member.mbti}</p>
        </div>
        <button class="member-button" onclick="openModal('${member.name}')">Info</button>
        <button class="delete-member-button" onclick="deleteMember('${member.id}')">X</button>
    `;

    return newMember;
}

export async function openModal(name) {
    const membersCol = collection(db, 'members');
    const q = query(membersCol, where('name', '==', name));
    const membersSnapshot = await getDocs(q);

    if (!membersSnapshot.empty) {
        const member = membersSnapshot.docs[0].data();
        document.getElementById('modal-name').innerText = member.name;
        document.getElementById('modal-description').value = member.description;
        document.getElementById('modal-strength').value = member.strength || '';
        document.getElementById('modal-style').value = member.style || '';
        document.getElementById('modal-photo').style.backgroundImage = `url(${member.photoUrl})`;

        var modal = document.getElementById("modal");
        var modalContent = modal.querySelector(".modal-content");

        modal.style.display = "block";
        modal.classList.remove("hide");
        modalContent.classList.remove("hide");
    }
}

export function closeModal() {
    var modal = document.getElementById("modal");
    var modalContent = modal.querySelector(".modal-content");

    modalContent.addEventListener('animationend', handleAnimationEnd);
    modal.classList.add("hide");
    modalContent.classList.add("hide");
}

function handleAnimationEnd() {
    var modal = document.getElementById("modal");
    var modalContent = modal.querySelector(".modal-content");

    modal.style.display = "none";
    modalContent.removeEventListener('animationend', handleAnimationEnd);
}

export async function saveMemberData() {
    const name = document.getElementById('modal-name').innerText;
    const description = document.getElementById('modal-description').value;
    const strength = document.getElementById('modal-strength').value;
    const style = document.getElementById('modal-style').value;

    const membersCol = collection(db, 'members');
    const q = query(membersCol, where('name', '==', name));
    const membersSnapshot = await getDocs(q);

    if (!membersSnapshot.empty) {
        const memberDoc = membersSnapshot.docs[0];
        await updateDoc(memberDoc.ref, {
            description: description,
            strength: strength,
            style: style
        });
        loadMembers();
        closeModal();
    }
}

export async function deleteMember(id) {
    const memberDoc = doc(db, 'members', id);
    await deleteDoc(memberDoc);
    loadMembers();
}

export function openAddModal() {
    var addModal = document.getElementById("add-modal");
    addModal.style.display = "block";
}

export function closeAddModal() {
    var addModal = document.getElementById("add-modal");
    addModal.style.display = "none";
}

export async function addMember() {
    var name = document.getElementById("name-input").value;
    var description = document.getElementById("description-input").value;
    var mbti = document.getElementById("mbti-input").value;
    var photoInput = document.getElementById("photo-input");
    var githubUrl = prompt("Github URL을 입력하세요:");

    var reader = new FileReader();
    reader.onload = async function(e) {
        var photoUrl = e.target.result;

        await addDoc(collection(db, 'members'), {
            name: name,
            description: description,
            mbti: mbti,
            photoUrl: photoUrl,
            githubUrl: githubUrl
        });
        loadMembers();
        closeAddModal();
    }

    if (photoInput.files[0]) {
        reader.readAsDataURL(photoInput.files[0]);
    } else {
        alert("프로필 사진을 선택해주세요.");
    }
}

document.getElementById('dark-mode-toggle').addEventListener('change', function() {
    document.body.classList.toggle('dark-mode');
    document.querySelector('header').classList.toggle('dark-mode');
    document.querySelector('.team-details').classList.toggle('dark-mode');
    document.querySelector('.team-logo').classList.toggle('dark-mode');
    document.querySelector('.team-members').classList.toggle('dark-mode');
    document.querySelectorAll('.member').forEach(function(member) {
        member.classList.toggle('dark-mode');
    });
    document.querySelector('.modal-content').classList.toggle('dark-mode');
    document.querySelector('.close-button').classList.toggle('dark-mode');
    document.querySelectorAll('.github-button').forEach(function(button) {
        button.classList.toggle('dark-mode');
    });
    document.querySelector('.team-name h1').classList.toggle('dark-mode');
    document.querySelector('.team-name h2').classList.toggle('dark-mode');
    document.querySelectorAll('.team-details h3').forEach(function(element) {
        element.classList.toggle('dark-mode');
    });
    document.querySelectorAll('.team-details p').forEach(function(element) {
        element.classList.toggle('dark-mode');
    });
    document.querySelectorAll('.member-info h3').forEach(function(element) {
        element.classList.toggle('dark-mode');
    });
    document.querySelectorAll('.member-info p').forEach(function(element) {
        element.classList.toggle('dark-mode');
    });
});