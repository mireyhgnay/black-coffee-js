/*
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

const $ = (selector) => document.querySelector(selector);

function App() {
    // 메뉴 갯수에 따른 count 업데이트
    const updateMenuCount = () => {
        const menuCount = $('#espresso-menu-list').querySelectorAll('li').length;
        $('.menu-count').innerText = `총 ${menuCount}개`;
    }

    // 메뉴 추가
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
        updateMenuCount();

        // 메뉴가 추가되고 나면, input은 빈 값으로 초기화한다.
        $('#espresso-menu-name').value = '';
    }

    // 메뉴 수정
    const updateMenuName = (e) => {
        // target에서 가장 가까운 요소를 찾아(closest)
        const $menuName = e.target.closest('li').querySelector('.menu-name');
        // 기존 메뉴이름이 prompt창에 디폴트값으로 입력되어있음
        const uqdateMenuName = prompt(
            "메뉴명을 수정하세요", 
            $menuName.innerText
        );
        // 변경한 메뉴명으로 업데이트 해준다.
        $menuName.innerText = uqdateMenuName;
    }

    // 메뉴 삭제
    const removeMenuName = (e) => {
        if(confirm('정말 삭제하시겠습니까?')){ // confirm ture 인 경우
            e.target.closest('li').remove();
            updateMenuCount();
        }
    }

    // 부모요소에 이벤트 위임할 수 있다. (아직 수정/삭제 버튼이 생성되기 전이기 때문에)
    $('#espresso-menu-list').addEventListener('click', (e) => { 
        // 수정버튼 클릭 이벤트
        if (e.target.classList.contains('menu-edit-button')) {
            updateMenuName(e);
        }

        // 삭제버튼 클릭 이벤트
        if (e.target.classList.contains('menu-remove-button')) {
            removeMenuName(e);
        }
    })

    // form태그가 자동으로 전송되는 걸 막아준다
    $("#espresso-menu-form").addEventListener("submit", (e) => {
        e.preventDefault();
    });

    // 확인버튼 클릭 이벤트
    $('#espresso-menu-submit-button').addEventListener("click", addMenuName);

    // 엔터키 keypress 이벤트
    $('#espresso-menu-name').addEventListener("keypress", (e) => {
        // (예외상황2) 엔터키가 아닐 때도 무조건 종료 시키기
        if (e.key !== 'Enter') {
            return;
        };
        addMenuName();
    })
}

App();
