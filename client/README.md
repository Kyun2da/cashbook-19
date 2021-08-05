# 우테캠 4기 4~5주차 프로젝트 19팀<br />Client

## 실행 환경

- node.js/14.17.4
- npm/7.20.3

## 클라이언트 설정

클라이언트 설정을 위해서 `.env`파일을 생성하고 작성해야 합니다.<br />
`.env.sample`을 복사해서 작성하면 됩니다.

```
BASE_URL=https://cashbook-19.woowa.work
```

`BASE_URL`은 서버의 도매인 입니다.

## 클라이언트 실행

```bash
$ cd client_directory
$ npm install
```

```bash
$ npm run dev
```

위와 같이 실행하면 테스트를 위한 클라이언트 서버가 실행됩니다.

```bash
$ npm run build
```

위와 같이 실행할 경우 `dist/`로 소스코드가 빌드됩니다.

## 배포

배포는 [서버 설정](../server/README.md)의 `nginx` 파트를 확인해 주세요.
