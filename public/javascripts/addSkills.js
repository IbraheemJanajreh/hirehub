const skills = [];
let t = 0;
const btn = document.getElementById('add');
const skl = document.getElementById('skills'); 

btn.addEventListener('click', () => {
    Skills.push(skl.value);
    console.log(skills)
})

module.exports = skills;