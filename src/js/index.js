/*
<메뉴추가 요구사항>
- 메뉴 이름을 입력 받고 확인버튼 OR 엔터키 로 메뉴가 추가된다.
- 추가되는 메뉴의 아래 마크업은 `<ul id="espresso-menu-list" class="mt-3 pl-0"></ul>` 안에 삽입해야 한다.
- 총 메뉴 갯수를 count하여 상단에 보여준다.
- 메뉴가 추가되고 나면, input은 빈 값으로 초기화한다.
- 사용자 입력값이 빈 값이라면 추가되지 않는다.
*/

const $ = (selector) => document.querySelector(selector);

function App() {
    // form태그가 자동으로 전송되는 걸 막아준다
    $("#espresso-menu-form").addEventListener("submit", (e) => {
        e.preventDefault();
    });

    // 엔터키와 확인버튼 동작이 동일하므로, 함수 재사용할 수 있도록
    const addMenuName = () => {
        // (예외상황1) 사용자 입력값이 빈 값이라면 추가되지 않는다.
        if ($('#espresso-menu-name').value === '') {
            alert('값을 입력해주세요.');
            return;   
        }

        const espressoMenuName = $('#espresso-menu-name').value;
        const menuItemTemplate = (espressoMenuName) => {
            return `
            <li class="menu-list-item d-flex items-center py-2">
            <span class="w-100 pl-2 menu-name">${espressoMenuName}</span>
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
        };
            
        // 추가되는 메뉴의 아래 마크업은 `<ul id="espresso-menu-list" class="mt-3 pl-0"></ul>` 안에 삽입해야 한다.
        $('#espresso-menu-list').insertAdjacentHTML(
            "beforeend",
            menuItemTemplate(espressoMenuName)
        );
            
        // 총 메뉴 갯수를 count해서 보여준다.
        // 메뉴 갯수는 li의 갯수를 카운팅해야 한다.
        const menuCount = $('#espresso-menu-list').querySelectorAll('li').length;
        $('.menu-count').innerText = `총 ${menuCount}개`;

        // 메뉴가 추가되고 나면, input은 빈 값으로 초기화한다.
        $('#espresso-menu-name').value = '';
    }

    $('#espresso-menu-submit-button').addEventListener("click", () => {
        addMenuName();
    });

    // 메뉴의 이름을 입력받기
    $('#espresso-menu-name').addEventListener("keypress", (e) => {
        // (예외상황2) 엔터키가 아닐 때도 무조건 종료 시키기
        if (e.key !== 'Enter') {
            return;
        };
        addMenuName();
    })
}

App();
