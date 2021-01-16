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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getText = exports.getJson = exports.postJson = void 0;
const version_1 = require("@stopify/elementary-js/dist/version");
const version_2 = require("./version");
const apiHelpers_1 = require("./utils/api/apiHelpers");
function respHandler(resp, respType) {
    if (!resp.ok) {
        throw new Error(`Code ${resp.status} from ${resp.url}.`);
    }
    switch (respType) {
        case 'text':
            return resp.text();
        default: // 'json'
            return resp.json();
    }
}
function postJson(path, fields) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = {
            userEmail: localStorage.getItem('userEmail'),
            sessionId: localStorage.getItem('sessionId'),
            ejsVersion: version_1.EJSVERSION,
            ocelotVersion: version_2.OCELOTVERSION
        };
        for (const k of Object.keys(fields)) {
            body[k] = fields[k];
        }
        return yield respHandler(yield fetch(apiHelpers_1.getUrl(path), {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        }));
    });
}
exports.postJson = postJson;
function getJson(path) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield respHandler(yield fetch(path));
    });
}
exports.getJson = getJson;
function getText(path) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield respHandler(yield fetch(path), 'text');
    });
}
exports.getText = getText;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsaUVBQWlFO0FBQ2pFLHVDQUEwQztBQUMxQyx1REFBZ0Q7QUFJaEQsU0FBUyxXQUFXLENBQUMsSUFBYyxFQUFFLFFBQW1CO0lBQ3RELElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFO1FBQ1osTUFBTSxJQUFJLEtBQUssQ0FBQyxRQUFRLElBQUksQ0FBQyxNQUFNLFNBQVMsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7S0FDMUQ7SUFFRCxRQUFRLFFBQVEsRUFBRTtRQUNoQixLQUFLLE1BQU07WUFDVCxPQUFPLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNyQixTQUFTLFNBQVM7WUFDaEIsT0FBTyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDdEI7QUFDSCxDQUFDO0FBRUQsU0FBc0IsUUFBUSxDQUMxQixJQUFZLEVBQ1osTUFBOEI7O1FBR2hDLE1BQU0sSUFBSSxHQUFRO1lBQ2hCLFNBQVMsRUFBRSxZQUFZLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQztZQUM1QyxTQUFTLEVBQUUsWUFBWSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUM7WUFDNUMsVUFBVSxFQUFFLG9CQUFVO1lBQ3RCLGFBQWEsRUFBRSx1QkFBYTtTQUM3QixDQUFDO1FBRUYsS0FBSyxNQUFNLENBQUMsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ25DLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDckI7UUFFRCxPQUFPLE1BQU0sV0FBVyxDQUFDLE1BQU0sS0FBSyxDQUFDLG1CQUFNLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDakQsTUFBTSxFQUFFLE1BQU07WUFDZCxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7WUFDMUIsT0FBTyxFQUFFLEVBQUUsY0FBYyxFQUFFLGtCQUFrQixFQUFFO1NBQ2hELENBQUMsQ0FBQyxDQUFDO0lBQ04sQ0FBQztDQUFBO0FBckJELDRCQXFCQztBQUVELFNBQXNCLE9BQU8sQ0FBQyxJQUFZOztRQUN4QyxPQUFPLE1BQU0sV0FBVyxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDOUMsQ0FBQztDQUFBO0FBRkQsMEJBRUM7QUFFRCxTQUFzQixPQUFPLENBQUMsSUFBWTs7UUFDeEMsT0FBTyxNQUFNLFdBQVcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUN0RCxDQUFDO0NBQUE7QUFGRCwwQkFFQyJ9