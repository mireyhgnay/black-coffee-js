/*
step1 요구사항 - 돔 조작과 이벤트 핸들링으로 메뉴 관리하기
TODO 메뉴 추가
    - 메뉴 이름을 입력 받고 확인버튼 OR 엔터키 로 메뉴가 추가된다.
    - 추가되는 메뉴의 아래 마크업은 `<ul id="espresso-menu-list" class="mt-3 pl-0"></ul>` 안에 삽입해야 한다.
    - 총 메뉴 갯수를 count하여 상단에 보여준다.
    - 메뉴가 추가되고 나면, input은 빈 값으로 초기화한다.
    - 사용자 입력값이 빈 값이라면 추가되지 않는다.

TODO 메뉴 수정
    - 메뉴의 수정 버튼 클릭 이벤트를 받고, 메뉴를 수정할 수 있는 모달창이 뜬다.(prompt 인터페이스)
    - 모달창(prompt)에서 신규메뉴명을 입력 받고, 확인 버튼을 누르면 메뉴이름이 수정된다.

TODO 메뉴 삭제
    - 메뉴 삭제 버튼 클릭 이벤트를 받고, 메뉴 삭제 컨펌 모달창이 뜬다.(confirm 인터페이스)
    - 확인 버튼을 클릭하면 메뉴가 삭제된다.
    - 총 메뉴 갯수를 count해서 상단에 보여준다.
*/

/*
step2 요구사항 - 상태 관리로 메뉴 관리하기
TODO localStorage Read & Write
    - localStorage에 데이터를 저장한다.    
        - 메뉴를 추가할 때 저장
        - 메뉴를 수정할 때 저장
        - 메뉴를 삭제할 때 저장
    - localStorage에 있는 데이터를 읽어온다.

TODO 카테고리별 메뉴판 관리
    - 에스프레소 메뉴판 관리
    - 프라푸치노 메뉴판 관리
    - 블렌디드 메뉴판 관리
    - 티바나 메뉴판 관리
    - 디저트 메뉴판 관리

TODO 페이지 접근시 최초 데이터 Read & Rendering
    - 페이지에 최초로 로딩될 때 localStorage에 에스프레소 메뉴를 읽어온다.
    - 에스프레소 메뉴를 페이지에 그려준다.

TODO 품절 상태 관리
    - 품절 상태인 겨우를 보여줄 수 있게, 품절 버튼을 추가하고 sold-out class를 추가하여 상태를 변경한다.
    - 품절 버튼을 추가한다.
    - 품절 버튼을 클릭하면 localStorage에 상태값이 저장된다.
    - 클릭이벤트에서 가장 가까운 li태그의 class속성 값에 sold-out을 추가한다.
*/

/*
step3 요구사항 - 서버와의 통신을 통해 메뉴 관리하기
TODO 서버 요청 부분
    - 웹 서버를 띄운다
    - 서버에 새로운 메뉴명이 추가될 수 있도록 요청한다
    - 서버에 카테고리별 메뉴리스트를 불러온다
    - 서버에 메뉴가 수정 될 수 있도록 요청한다
    - 서버에 품절상태를 변경할 수 있도록 요청한다(toggle)
    - 서버에 메뉴가 삭제될 수 있도록 요청한다

TODO 리팩터링 부분
    - localStorage 에 저장하는 로직은 지운다
    - fetch 비동기 api를 사용하는 부분을 async await을 사용하여 구현한다

TODO 사용자 경험
    - API 통신이 실패하는 경우에 대해 사용자가 알 수 있게 alert창으로 예외처리를 진행한다
    - 중복되는 메뉴는 추가할 수 없다
*/

import { $ } from "./utils/dom.js";
import store from "./store/index.js";
import MenuApi from "./api/index.js";

function App() {
    // 상태는 변하는 데이터, 이 앱에서 변하는 것이 무엇인가? - 메뉴명
    // 초기화를 안하면? => 상태가 어떤 데이터 형태로 들어올지 모르게 됨. 어떤 형태로 관리될건지!
    this.menu = {
        espresso: [],
        frappuccino:[],
        blended: [],
        teavana: [],
        desert: [],
    };
    // 현재 선택된 카테고리 상태 관리하기 (초기값 : espresso)
    this.currentCategory = 'espresso'; 
    
    this.init = async () => {
        // async, await : 커피주문 진동벨 예시로 기억하자~
        this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
            this.currentCategory
        );
        render();
        initEventListeners();
    }

    // template 그려주는 함수(재사용)
    const render = async () => {
        this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
            this.currentCategory
        );

        const template = this.menu[this.currentCategory]
        .map((menuItem) => {
            return `
            <li data-menu-id ="${menuItem.id}"class="menu-list-item d-flex items-center py-2">
            <span class="w-100 pl-2 menu-name ${
                menuItem.isSoldOut ? 'sold-out' : ""
                } ">${menuItem.name}</span>
            <button
                type="button"
                class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
            >
                품절
            </button>
            <button
                type="button"
                class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
            >
                수정
            </button>
            <button
                type="button"
                class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
            >
                삭제
            </button>
            </li>`;
        })
        .join("");
            
        // 추가되는 메뉴의 아래 마크업은 `<ul id="espresso-menu-list" class="mt-3 pl-0"></ul>` 안에 삽입해야 한다.
        $('#menu-list').innerHTML = template;
            
        // 총 메뉴 갯수를 count해서 보여준다.
        // 메뉴 갯수는 li의 갯수를 카운팅해야 한다.
        updateMenuCount();
    }

    // 메뉴 갯수에 따른 count 업데이트
    const updateMenuCount = () => {
        const menuCount = this.menu[this.currentCategory].length;
        $('.menu-count').innerText = `총 ${menuCount} 개`;
    }

    // 메뉴 추가
    // 비동기 통신이 있는 함수에 async 키워드를 쓴다
    const addMenuName = async () => {
        // (예외상황1) 사용자 입력값이 빈 값이라면 추가되지 않는다.
        if ($('#menu-name').value === '') {
            alert('값을 입력해주세요.');
            return;   
        };

        const duplicatedItem =  this.menu[this.currentCategory].find(menuItem => menuItem.name === $('#menu-name').value);
        // (예외사항2) 사용자가 동일한 메뉴명을 입력했을 경우
        if (duplicatedItem) {
            alert('이미 등록된 메뉴입니다. 다시 입력해주세요.');
            $('#menu-name').value = ''; // 사용자 측면에서 고려하여 추가
            return;
        };

        const MenuName = $('#menu-name').value;
        // 서버 요청하는 부분
        await MenuApi.createMenu(this.currentCategory, MenuName);
        render();
        $('#menu-name').value = '';
    }

    // 메뉴 수정
    const updateMenuName = async (e) => {
        const menuId = e.target.closest("li").dataset.menuId;
        // target에서 가장 가까운 요소를 찾아(closest)
        const $menuName = e.target.closest('li').querySelector('.menu-name');
        // 기존 메뉴이름이 prompt창에 디폴트값으로 입력되어있음
        const updatedMenuName = prompt("메뉴명을 수정하세요", $menuName.innerText);
        await MenuApi.updateMenu(this.currentCategory, updatedMenuName, menuId);
        // 변경한 메뉴명으로 업데이트 해준다.
        render();
    }

    // 품절 메뉴
    const soldOutMenu = async (e) => {
        const menuId = e.target.closest('li').dataset.menuId;
        await MenuApi.toggleSoldOutMenu(this.currentCategory, menuId);
        render();
    } 

    // 메뉴 삭제
    const removeMenuName = async (e) => {
        if(confirm('정말 삭제하시겠습니까?')){ // confirm ture 인 경우
            const menuId = e.target.closest('li').dataset.menuId;
            await MenuApi.deleteMenu(this.currentCategory, menuId);
            render();
        }
    }

    // 함수로 따로 작성하며 리팩토링한 이유는 : 
    // 함수명만 보고도 카테고리를 변경할때의 함수구나 를 알 수 있도록 하기 위함
    const changeCategory = (e) => {
        const isCategoryButton = e.target.classList.contains('cafe-category-name');
        // nav > button 영역에만 적용될 수 있도록 예외처리
        if(isCategoryButton) {
            // dataset 으로 각 data=category-name 값 가져오기
            const categoryName = e.target.dataset.categoryName;
            this.currentCategory = categoryName;
            $('#category-title').innerText = `${e.target.innerText} 메뉴 관리`;
            render();
        }
    };

    // addEventListner 함수들을 모아 한군데서 관리할 수 있도록
    const initEventListeners = () => {
        // 부모요소에 이벤트 위임할 수 있다. (아직 수정/삭제 버튼이 생성되기 전이기 때문에)
        $('#menu-list').addEventListener('click', (e) => { 
            // 수정버튼 클릭 이벤트
            if (e.target.classList.contains('menu-edit-button')) {
                updateMenuName(e);
                // if문이 연속으로 있을 때는 함수가 끝날때마다 return을 해주는 편이 좋다.
                // 다른 불필요한 함수 이벤트가 실행되지 않도록
                return; 
            }

            // 삭제버튼 클릭 이벤트
            if (e.target.classList.contains('menu-remove-button')) {
                removeMenuName(e);
                return;
            }

            // 품절버튼 클릭 이벤트
            if (e.target.classList.contains('menu-sold-out-button')) {
                soldOutMenu(e);
                return;
            }
        })

        // form태그가 자동으로 전송되는 걸 막아준다
        $("#menu-form").addEventListener("submit", (e) => {
            e.preventDefault();
        });

        // 확인버튼 클릭 이벤트
        $('#menu-submit-button').addEventListener("click", addMenuName);

        // 엔터키 keypress 이벤트
        $('#menu-name').addEventListener("keypress", (e) => {
            // (예외상황2) 엔터키가 아닐 때도 무조건 종료 시키기
            if (e.key !== 'Enter') {
                return;
            };
            addMenuName();
        });

        // 카테고리별 메뉴판 관리하기 (버튼 상위 부모에 이벤트리스너를 적용)
        $('nav').addEventListener("click", changeCategory);

        $("#menu-form").addEventListener("submit", (e) =>{
            e.preventDefault();
        }); 
    };
}

const app = new App();
app.init();
