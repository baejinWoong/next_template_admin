- git 다운로드
  
    https://git-scm.com/

- node.js 다운로드
  
    https://nodejs.org/ko/
    (node.js 17이상)

- yarn install
  
    https://classic.yarnpkg.com/en/docs/install#windows-stable
    npm install --global yarn

- clone
  
    git clone https://github.com/baejinWoong/next_template_admin
    프로젝트 패칭후 npm install -g win-node-env 로 전체환경변수 설정(window 환경 한정)

    yarn install 또는 yarn

- 개발환경
  
    yarn dev

- 빌드시
  
    yarn build
  
- 배포시
  
    yarn build
    yarn start:background

- 재배포시
  
    yarn stop:background
    yarn build
    yarn start:background
