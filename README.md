git 설치
git 사용자 등록 ( 이메일 및 이름 등록 )

1. vscode 등 IDE 실행하기
2. 터미널 창열기
3. git clone https://github.com/memorygreen/final_project_K18.git

- front 실행 환경 구성
    1. 노드 설치하기
    2. 폴더 열기 (final_project_K18)
    3. cd front
    4. npm install
    5. npm start

- back 실행 환경 구성
    1. 파이썬 설치하기 ( 파이썬 홈페이지가서 설치하셈 )
        1-1. ctrl + shift + p > >python interpreter
        1-2. 파이썬 버전 선택
            1-2-1. pip install 등 실행이 안되면
            1-2-2. 윈도우 > 검색 > 시스템 환경 변수 편집 > 고급 > 환경변수 > 시스템 변수 > 변수 : path 클릭 > 편집 클릭 > 새로만들기 
            1-2-3. C:\Users\{사용자이름}\AppData\Local\Programs\Python\Python312\Scripts 추가 (AppData는 숨겨진 폴더에 있을 수 있음)
            1-2-4. vs 코드 재실행 , 안되면 재부팅
    2. 폴더 열기 (final_project_K18)
    3. cd back
    4. pip install -r requirements.txt
    5. python app.py
