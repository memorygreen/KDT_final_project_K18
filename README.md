# 프로젝트명(팀명:윌리를 찾아라)
    윌리를 찾아라👕👖- PAR(Pedestrian-Attribute-Recognition)  기반 CCTV 영상 속 인상착의를 통한 실종자 찾기🎥
    
    2023 인공지능 개발자과정 18회차 - 스마트인재개발원
    프로젝트 기간 : 24.05.22 ~ 24.06.20

# 목차
1. [서비스소개](#서비스소개)
2. [주요기능](#주요기능)
3. [시스템 아키텍처](#시스템-아키텍처)
4. [서비스 흐름도](#서비스-흐름도)
5. [화면구성(시연영상)](#화면구성시연영상) 
6. [팀원역할](#팀원역할)
7. [초기 세팅](#초기-세팅)



## 서비스소개
    사용자로부터 인상착의 정보를 받아 CCTV의 데이터에서 인상착의 정보와 일치한 객체를 찾아 실종자를 찾아주는 서비스
## 주요기능
    1. 사용자로부터 인상착의 정보를 라디오 버튼으로 입력을 받음
    2. 입력 받은 인상착의 정보를 DB 저장 및 모델로 전송
    3. 모델이 입력받은 실종자 최종 위치를 기반으로 CCTV를 조회
    4. 인상착의와 일치한 인물을 발견시 해당 CCTV화면 캡쳐 후 사용자에게 전송
    5. 사용자는 캡쳐를 확인하여 실종자와 비교
    6. CCTV위치를 기반으로 실종자 위치로 이동 하여 찾음
    7. 부가적인 기능으로 인상착의 정보로 생성형 AI를 사용하여 포스터 생성 
    8. 다른 사용자가 포스터 사진으로 위치 제보 가능

## 시스템-아키텍처
![alt text](/assets/image.png)

## 서비스 흐름도
![alt text](/assets/image-1.png)

## 화면구성시연영상
<video controls src="assets/Demo.mp4" title="Title"></video>

## 팀원역할
![alt text](/assets/image-2.png)

## 초기 세팅
### 1. Git 설치 및 사용자 등록

#### Git 설치
1. <a href="https://git-scm.com/download/win/" target="_blank">Git 공식 사이트</a>에서 Git을 다운로드하여 설치합니다.

#### Git 사용자 등록
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

### 2. Front 실행 환경 구성
#### 노드 설치하기
1. <a href="https://nodejs.org/en" target="_blank">Node.js 공식 사이트</a>에서 Node.js를 다운로드하여 설치합니다.

#### 프로젝트 설정
1. VSCode에서 `final_project_K18` 폴더를 엽니다.
2. 터미널에서 다음 명어를 실행합니다.
        ```sh
        cd final_project_K18/front
        npm install
        npm start
        ```
    3. `.env` 파일을 생성하여 보안 관련 코드 작성한다.

### 3. Back 실행 환경 구성
#### 파이썬 설치하기
1. <a href="https://www.python.org/downloads/" target="_blank">Python 공식 사이트</a>에서 Python을 다운로드하여 설치합니다.

#### 프로젝트 설정
1.  VSCode에서 `final_project_K18` 폴더를 엽니다.
2. `Ctrl + Shift + P`를 누르고 `>Python: Select Interpreter`를 선택합니다.
3. 파이썬 버전을 선택합니다.
4. 터미널에서 다음 명령어를 실행합니다
    ```sh
      cd back
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
    - VSCode 재실행 하고 `final_project_K18` 폴더를 엽니다.
    - 터미널에서 해당 명령어를 다시 실행합니다.
            ```sh
            cd back
            pip install -r requirements.txt
            python app.py
            ```
    - 문제가 해결되지 않으면 컴퓨터를 재부팅합니다.
    6. `.env` 파일을 생성하여 보안 관련 코드 작성한다.


### 4. Model 실행 환경 구성
#### model 설치
1. <a href="https://www.dropbox.com/scl/fo/e1l7kwn6qdnu91auiw13m/AIQCWlAnK3vJwwoc7pgUak4?rlkey=1e6pwpoa3x14nk6fmg8ewhvva&st=8ydslwcc&dl=0" target="_blank">모델 다운로드</a> 링크를 클릭해서 모델을 설치합니다.
2. 모델을 설치한 후 프로젝트 폴더에 위치시킵니다.
3. 터미널에서 다음 명령어를 실행합니다.
        ```sh
            cd model
            pip install -r requirements.txt
            python app.py
        ``` 
4. `.env` 파일을 생성하여 보안 관련 코드 작성한다.
    



