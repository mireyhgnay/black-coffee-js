const BASE_URL = 'http://localhost:3000/api';

const HTTP_METHOD = {
    POST(data) {
        return {
            method: "POST", // 객체가 새로 생성되는 경우
            headers: {
                "Content-Type": "application/json", // json 형태
            },
            body: JSON.stringify(data),
        };
    },
    PUT(data){
        return {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: data ? JSON.stringify(data) : null,
        };
    },
    DELETE() {
        return {
            method: "DELETE",
        }
    }
};

// 데이터를 내려주는 형태
const request = async (url, option) => {
    const response = await fetch(url, option);
    if (!response.ok) {
        alert('에러가 발생했습니다.');
        console.error(e);
    };
    return response.json();
};

// 데이터 없이 ok사인만 내려준다. (데이터 안내려주는 형태)
const requestWithoutJson = async(url, option)=>{
    const request = async (url, option)=>{
        const response = await fetch(url, option);
        if(!response.ok){
           alert("에러");
           console.log(e);
        }
        return response.json;
   }
}

const MenuApi = {
    getAllMenuByCategory(category) {
        return request(`${BASE_URL}/category/${category}/menu`);
    },

    // fetch : 서버에 데이터를 요청/수정/삭제 등을 요청할 때 fetch 메서드 사용
    // await : 기다렸으면 하는 로직 부분 앞에 await 키워드 쓰기 (fethc 작성한 순서대로 실행됨)
    // 생성
    async createMenu(category, name) {
        return request(`${BASE_URL}/category/${category}/menu`, HTTP_METHOD.POST({ name })
        );
    },
    
    // 수정
    async updatedMenu(category, name, menuId) {
        return request(`${BASE_URL}/category/${category}/menu/${menuId}`, HTTP_METHOD.PUT({ name })); 
    },

    // 품절
    async toggleSoldOutMenu(category, menuId) {
        return request(`${BASE_URL}/category/${category}/menu/${menuId}/soldout`, HTTP_METHOD.PUT());
    },

    // 제거
    async deleteMenu(category, menuId) {
        return requestWithoutJson(`${BASE_URL}/category/${category}/menu/${menuId}`, HTTP_METHOD.DELETE());
    },
}

export default MenuApi;