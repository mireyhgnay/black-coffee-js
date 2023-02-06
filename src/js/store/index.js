// localStorage - 메뉴 정보 저장하고, 불러올 수 있는 객체 만들기
const store = {
    setLocalStorage(menu){
        localStorage.setItem("menu", JSON.stringify(menu)); // 문자열로만 저장해줘야한다.(stringify)
    },
    getLocalStorage(){
        return JSON.parse(localStorage.getItem("menu"));
    },
}; 

export default store;