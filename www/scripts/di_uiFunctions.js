var typeQuery=0;
document.getElementById('B1').onclick=function(){
    this.classList.toggle("active");
    if (this.nextElementSibling.style.maxHeight){
        this.nextElementSibling.style.maxHeight = null;
        typeQuery=0;
    } else {
        this.nextElementSibling.style.maxHeight = this.nextElementSibling.scrollHeight + "px";
        document.getElementById('B2').nextElementSibling.style.maxHeight = null;
        typeQuery=1;
    }    
};
document.getElementById('B2').onclick=function(){
    this.classList.toggle("active");
    if (this.nextElementSibling.style.maxHeight){
        this.nextElementSibling.style.maxHeight = null;
        typeQuery=0;
    } else {
        this.nextElementSibling.style.maxHeight = this.nextElementSibling.scrollHeight + "px";
        document.getElementById('B1').nextElementSibling.style.maxHeight = null;
        typeQuery=2;
    }    
};