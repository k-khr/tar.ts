class Tar {
    static _encoder: TextEncoder = new TextEncoder();

    static _chksum(header: Uint8Array): string {
        let chksum = 0;
        for (let i=0; i<header.length; i=(i+1)|0) {
            chksum += header[i];
        }
        return (chksum).toString(8).padStart(6, "0").slice(-6) + "\0 ";
    }

    static async _writestr(str: string, dstarr: Uint8Array, offset: number = 0): Promise<void> {
        const srcarr = this._encoder.encode(str);
        dstarr.set(srcarr, offset);
    }

    static async _createHeader(fname: string, fsize: number): Promise<Uint8Array> {
        const headerbuf = new Uint8Array(512);
        headerbuf.fill(0);
        const fnameblob = new Blob([fname]);
        const isLongName = fnameblob.size > 100;
        await Promise.all([
            // name, 100 bytes
            this._writestr(isLongName ? "././@LongLink" : fname, headerbuf),
            // mode, 8 bytes
            this._writestr("0000777", headerbuf, 100),
            // uid, 8 bytes
            this._writestr("0000000", headerbuf, 108),
            // gid, 8 bytes
            this._writestr("0000000", headerbuf, 116),
            // size, 12 bytes
            this._writestr((isLongName ? fnameblob.size : fsize).toString(8).padStart(11, "0"), headerbuf, 124),
            // mtime, 12 bytes
            this._writestr(("").padStart(11, "0"), headerbuf, 136),
            // checksum, 8 bytes, initially set as blank
            this._writestr("        ", headerbuf, 148),
            // typeflag, 1 byte
            this._writestr(isLongName ? "L" : "0", headerbuf, 156),
            // magic, 6 bytes
            this._writestr("ustar ", headerbuf, 257),
            // version, 2 bytes
            this._writestr(" \0", headerbuf, 263),
        ]);
        // checksum, 8 bytes
        await this._writestr(this._chksum(headerbuf), headerbuf, 148);
        if (!isLongName) return headerbuf;
    
        const fnameContentBuf = new Uint8Array(512 * Math.ceil(fnameblob.size/512));
        await this._writestr(fname, fnameContentBuf);
    
        const fileHeader = await this._createHeader(fname.slice(0, 24), fsize);
        const allHeader = new Uint8Array(headerbuf.length + fnameContentBuf.length + fileHeader.length);
        allHeader.set(headerbuf, 0);
        allHeader.set(fnameContentBuf, headerbuf.length);
        allHeader.set(fileHeader, headerbuf.length + fnameContentBuf.length);
        return allHeader;
    }

    static async create(filenames: string[] = [], filesrc: string[] = []): Promise<Blob> {
        /**
         * This method returns 
         */
        return Promise.all(filesrc.map(async (e, i) => {
            const r = await fetch(e, {mode: "no-cors"});
            const b = await r.blob();
            const fname = filenames[i];
            const header = await this._createHeader(fname, b.size);
        
            const buf = new Uint8Array(header.length + 512 * Math.ceil(b.size/512));
            const barrbuf = await b.arrayBuffer();
            const bu8arr = new Uint8Array(barrbuf);
            buf.set(header, 0);
            buf.set(bu8arr, header.length);
            return buf;
        })).then(res => {
            // tar file termination, 1024 bytes of 0
            const termBuf = new Uint8Array(1024);
            termBuf.fill(0);
            res.push(termBuf);
            return new Blob(res, {type: "application/x-tar"});
        })
    }
}

export default Tar
