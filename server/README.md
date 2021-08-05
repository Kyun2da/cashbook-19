# 우테캠 4기 4~5주차 프로젝트 19팀 <br />Server

## 실행 환경

### 테스트 환경

아래의 조건에서 배포하고 테스트하였습니다.

- AMI: Ubuntu Server 20.04 LTS (HVM), SSD Volume Type (64비트 x86)
- 인스턴스 유형: t2.small
- 8GiB 저장용량
- 2GiB swap

### 사용 프로그램

- nginx/1.20.1
- node.js/14.17.4
- npm/7.20.3
- mysql-server/8.0.26

## 프로그램 설치

### nginx

[해당 지시사항](https://nginx.org/en/linux_packages.html#Ubuntu)을 따라서 설치합니다.

```bash
$ sudo systemctl enable nginx
$ sudo systemctl start nginx
```

nginx를 서비스로 등록해주고 실행시킵니다.

이후에 실행할 서버와 클라이언트 코드의 연결을 설정합니다.<br />
`/etc/nginx/conf.d/domain.conf` 파일을 생성합니다.
`domain` 자리에는 사용하는 domain을 넣으면 됩니다.<br />
실제 본 프로젝트의 배포환경에는 `cashbook-19.woowa.work.conf`로 만들어져 있습니다.

```
server {
  listen 80;
  server_name cashbook-19.woowa.work;

  root /home/ubuntu/cashbook-19/client/client/dist;

  location /api/v1 {
    proxy_pass http://localhost:3000;
  }

  location /auth {
    proxy_pass http://localhost:4000;
  }

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

위 설정파일과 같이 적절하게 작성합니다.<br />
물론 `server_name`이나 `root`는 환경에 맞춰서 변경합니다.<br />
또한 `proxy_pass`를 `http://localhost:3000`으로 설정돼 있는데 port는 변경될 수 있습니다.

위와 같은 설정을 통해서 한 EC2 인스턴스에서 같은 domain으로 별도의 server와 client 프로젝트를 모두 배포할 수 있습니다.

### node.js

[해당 지시사항](https://github.com/nodesource/distributions/blob/master/README.md#debinstall)을 따라서 설치합니다.

```bash
$ sudo npm install --global npm
$ sudo npm install --global pm2
$ pm install pm2-logrotate
```

설치 이후 npm을 업데이트 해줍니다.<br />
또한 배포 실행을 위한 pm2를 설치합니다.<br />
[pm2-logrotate](https://github.com/keymetrics/pm2-logrotate)를 추가 설치하여 이후 log가 적절한 용량, 날짜에 맞춰서 나눠져서 저장되게 해줍니다.

### mysql-server

[해당 지시사항](https://dev.mysql.com/doc/mysql-apt-repo-quick-guide/en/)을 따라서 설치합니다.

```bash
$ sudo systemctl enable mysql
$ sudo systemctl start mysql
```

mysql을 서비스로 등록해주고 실행시킵니다.

## 프로그램 설정

### mysql-server

`/etc/mysql/my.cnf`를 열어서 맨 아래에 아래와 같이 추가 작성합니다.

```
[client]
default-character-set=utf8mb4

[mysql]
default-character-set=utf8mb4

[mysqld]
collation-server=utf8mb4_unicode_ci
init-connect='SET NAMES utf8mb4'
character-set-server=utf8mb4

bind-address=0.0.0.0
```

설정을 마치고 해당 필요에 따라서 database와 user를 생성합니다.<br />
database 생성 뒤에 [해당 위키](https://github.com/woowa-techcamp-2021/cashbook-19/wiki/db-%EC%8A%A4%ED%82%A4%EB%A7%88-%EC%A0%95%EC%9D%98)에 나와있는 DDL을 실행합니다.


## 프로젝트 설정

프로젝트를 실행시키기 위해서는 반드시 `.env`를 만들어서 작성해야 합니다.<br />
`.evn.sample`을 복사하여 작성하면 됩니다.

```
SITE_URI=https://cashbook-19.woowa.work
PORT=3000

TYPEORM_HOST=localhost
TYPEORM_PORT=3306
TYPEORM_USERNAME=username
TYPEORM_PASSWORD=password
TYPEORM_DATABASE=database

OAUTH_GITHUB_CLIENT_ID=
OAUTH_GITHUB_CLIENT_SECRET=
OAUTH_GITHUB_REDIRECT_URI=https://cashbook-19.woowa.work/auth/github/callback

JWT_SECRET=
JWT_ALGORITHM=HS256
JWT_ACCESS_EXPIRES_IN=1800
JWT_REFRESH_EXPIRES_IN=604800

TZ=Asia/Seoul
```

oauth의 경우는 [해당링크](https://docs.github.com/en/developers/apps/building-github-apps/creating-a-github-app)에 지시를 따라서 github app을 만들고 관련 정보를 얻어서 작성하면 됩니다.<br />
jwt_secret의 경우 반드시 base64로 인코딩된 문자열을 채워 넣으며 [링크](https://generate.plus/en/base64)를 통해서 랜덤한 문자열을 생성할 수 있습니다.


## 프로젝트 실행

```bash
npm install
```

위 명령어를 통해서 관련 의존성을 받습니다.

```bash
$ npm run dev
```

위 명령어를 통해서 개발용 로그를 확인할 수 있게 실행할 수 있습니다.

```bash
$ npm run start
```

위 명령어를 통해서 일반 로그만 확인할 수 있게 실행할 수 있습니다.

## 배포

배포를 위해서 `pm2`를 사용합니다.

```bash
$ cd project_directory
$ pm2 start ecosystem.config.js
```

을 통해서 프로젝트를 배포 실행할 수 있습니다.
