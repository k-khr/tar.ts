# tar.ts

ブラウザ上で tar ファイルを作成するクラス [Tar](./tar.ts)

## Example

使い方の例は [example/index.ts](./example/index.ts) に記載の通り。

実際にブラウザで読み込んでダウンロード処理を走らせるためには、以下の手順が必要:

1. `npm run example`
2. `example/` でサーバーを立てる  
    例: `cd example/ && python -m http.server`
3. ブラウザからサーバーの index.html にアクセスすると、test.txt と a.npy を含んだ tar ファイルがダウンロードされる

