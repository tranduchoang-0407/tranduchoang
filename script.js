
const cards=document.querySelectorAll('.card');
const observer=new IntersectionObserver(entries=>{
entries.forEach(e=>{
if(e.isIntersecting){
e.target.style.opacity='1';
e.target.style.transform='translateY(0)';
}
});
});
cards.forEach(card=>{
card.style.opacity='0';
card.style.transform='translateY(30px)';
card.style.transition='0.6s';
observer.observe(card);
});
