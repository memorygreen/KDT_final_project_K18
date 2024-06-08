# Final Project K18

<details>
<summary><strong>초기 세팅 </strong></summary>

## Git 설치 및 사용자 등록

### Git 설치
1. <a href="https://git-scm.com/download/win/" target="_blank">Git 공식 사이트</a>에서 Git을 다운로드하여 설치합니다.

### Git 사용자 등록
1. 터미널을 열고 다음 명령어를 실행합니다.
    ```sh
    git config --global user.name "Your Name"
    git config --global user.email "your.email@example.com"
    ```
### 프로젝트 클론
1. <a href="https://code.visualstudio.com/download" target="_blank">VSCode</a> 또는 <a href="https://www.cursor.com/" target="_blank">다른 IDE</a>를 실행합니다.
2. 터미널 창을 엽니다.
3. 다음 명령어를 실행하여 프로젝트를 클론합니다.
    ```sh
    git clone https://github.com/memorygreen/final_project_K18.git
    ```

## Front 실행 환경 구성
### 노드 설치하기
1. <a href="https://nodejs.org/en" target="_blank">Node.js 공식 사이트</a>에서 Node.js를 다운로드하여 설치합니다.
### 프로젝트 설정
1. VSCode에서 `final_project_K18` 폴더를 엽니다.
2. 터미널에서 다음 명령어를 실행합니다.
    ```sh
    cd final_project_K18/front
    npm install
    npm start
    ```

## Back 실행 환경 구성
### 파이썬 설치하기
1. <a href="https://www.python.org/downloads/" target="_blank">Python 공식 사이트</a>에서 Python을 다운로드하여 설치합니다.

## 프로젝트 설정
1. VSCode 실행 합니다.
2. `Ctrl + Shift + P`를 누르고 `>Python: Select Interpreter`를 선택합니다.
3. 파이썬 버전을 선택합니다.
4. 터미널에서 다음 명령어를 실행합니다
    ```sh
    cd final_project_K18/back
    pip install -r requirements.txt
    python app.py
    ```
5. 만약 `pip install` 명령어가 작동하지 않는다면 다음을 수행합니다.
    - 윈도우 검색창에 시스템 환경 변수 편집을 입력하고 엽니다.
    - 고급 탭에서 환경 변수를 클릭합니다.
    - 시스템 변수 목록에서 Path를 찾아 클릭한 후 편집을 클릭합니다.
    - 새로 만들기를 클릭하고 다음 경로를 추가합니다
        ```sh
        C:\Users\{사용자이름}\AppData\Local\Programs\Python\Python312\Scripts
        ```  
    - VSCode를 재실행합니다.
    - 터미널에서 해당 명령어를 다시 실행합니다.
        ```sh
        cd final_project_K18/back
        pip install -r requirements.txt
        python app.py
        ```
    - 문제가 해결되지 않으면 컴퓨터를 재부팅합니다.

</details>
