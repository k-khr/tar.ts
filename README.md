# tar.ts

Create .tar file via [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob) object.


## How to use

```ts
import Tar from "./tar"

filenames = ["a.png"]
// source url to fetch
src = ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAAAXNSR0IArs4c6QAABGJJREFUeF7t1AEJAAAMAsHZv/RyPNwSyDncOQIECEQEFskpJgECBM5geQICBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAgQdWMQCX4yW9owAAAABJRU5ErkJggg=="]

const tarBlob: Blob = await Tar.create(filenames, src)
```

More detailed example available on [example/](./example) directory.

1. `npm run example`
2. Launch web server on `example/`.
    e.g. `cd example/ && python -m http.server 8080`
3. Access http://localhost:8080
4. The tar file which contains `test.txt` and `a.npy` will be downloaded.


## License

These codes are licensed under CC0.  
http://creativecommons.org/publicdomain/zero/1.0/deed
