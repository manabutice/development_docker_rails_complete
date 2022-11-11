# README
以下のコマンドは、レクチャー内で実行しているコマンドです。
docker-compose.ymlファイルの置いてあるディレクトリで実行してください。
※ドルマークは、コマンドに含めないでください。

# Railsのコンテナを起動してRailsのプロジェクトを作成するコマンド
$ docker-compose run web rails new . --force --database=mysql

# Railsイメージのビルド実行コマンド
$ docker-compose build

# config/database.ymlの修正内容
# default内の項目を修正
password: password
host: db

# コンテナをデタッチドモード（バックグラウンド）で実行するコマンド
$ docker-compose up -d

# RailsのコンテナでDB作成のタスクを実行するコマンド
$ docker-compose run web bundle exec rake db:create


