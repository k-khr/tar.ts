"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var Tar = /** @class */ (function () {
    function Tar() {
    }
    Tar._chksum = function (header) {
        var chksum = 0;
        for (var i = 0; i < header.length; i = (i + 1) | 0) {
            chksum += header[i];
        }
        return (chksum).toString(8).padStart(6, "0").slice(-6) + "\0 ";
    };
    Tar._writestr = function (str, dstarr, offset) {
        if (offset === void 0) { offset = 0; }
        return __awaiter(this, void 0, void 0, function () {
            var srcarr;
            return __generator(this, function (_a) {
                srcarr = this._encoder.encode(str);
                dstarr.set(srcarr, offset);
                return [2 /*return*/];
            });
        });
    };
    Tar._createHeader = function (fname, fsize) {
        return __awaiter(this, void 0, void 0, function () {
            var headerbuf, fnameblob, isLongName, fnameContentBuf, fileHeader, allHeader;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        headerbuf = new Uint8Array(512);
                        headerbuf.fill(0);
                        fnameblob = new Blob([fname]);
                        isLongName = fnameblob.size > 100;
                        return [4 /*yield*/, Promise.all([
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
                            ])];
                    case 1:
                        _a.sent();
                        // checksum, 8 bytes
                        return [4 /*yield*/, this._writestr(this._chksum(headerbuf), headerbuf, 148)];
                    case 2:
                        // checksum, 8 bytes
                        _a.sent();
                        if (!isLongName)
                            return [2 /*return*/, headerbuf];
                        fnameContentBuf = new Uint8Array(512 * Math.ceil(fnameblob.size / 512));
                        return [4 /*yield*/, this._writestr(fname, fnameContentBuf)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this._createHeader(fname.slice(0, 24), fsize)];
                    case 4:
                        fileHeader = _a.sent();
                        allHeader = new Uint8Array(headerbuf.length + fnameContentBuf.length + fileHeader.length);
                        allHeader.set(headerbuf, 0);
                        allHeader.set(fnameContentBuf, headerbuf.length);
                        allHeader.set(fileHeader, headerbuf.length + fnameContentBuf.length);
                        return [2 /*return*/, allHeader];
                }
            });
        });
    };
    Tar.create = function (filenames, filesrc) {
        if (filenames === void 0) { filenames = []; }
        if (filesrc === void 0) { filesrc = []; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                /**
                 * This method returns
                 */
                return [2 /*return*/, Promise.all(filesrc.map(function (e, i) { return __awaiter(_this, void 0, void 0, function () {
                        var r, b, fname, header, buf, barrbuf, bu8arr;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, fetch(e, { mode: "no-cors" })];
                                case 1:
                                    r = _a.sent();
                                    return [4 /*yield*/, r.blob()];
                                case 2:
                                    b = _a.sent();
                                    fname = filenames[i];
                                    return [4 /*yield*/, this._createHeader(fname, b.size)];
                                case 3:
                                    header = _a.sent();
                                    buf = new Uint8Array(header.length + 512 * Math.ceil(b.size / 512));
                                    return [4 /*yield*/, b.arrayBuffer()];
                                case 4:
                                    barrbuf = _a.sent();
                                    bu8arr = new Uint8Array(barrbuf);
                                    buf.set(header, 0);
                                    buf.set(bu8arr, header.length);
                                    return [2 /*return*/, buf];
                            }
                        });
                    }); })).then(function (res) {
                        // tar file termination, 1024 bytes of 0
                        var termBuf = new Uint8Array(1024);
                        termBuf.fill(0);
                        res.push(termBuf);
                        return new Blob(res, { type: "application/x-tar" });
                    })];
            });
        });
    };
    Tar._encoder = new TextEncoder();
    return Tar;
}());
exports["default"] = Tar;
