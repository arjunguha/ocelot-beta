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
exports.getFileHistory = void 0;
const apiHelpers_1 = require("./apiHelpers");
const version_1 = require("@stopify/elementary-js/dist/version");
const version_2 = require("../../version");
exports.getFileHistory = (fileName) => __awaiter(void 0, void 0, void 0, function* () {
    // This function should be called in a SAGA right after logging in
    // BE SURE TO SET LOADING BEFORE CALLING THIS FUNCTION
    if (!apiHelpers_1.validEmailSession()) {
        return apiHelpers_1.failureResponse('Seems like your session expired, try logging in again');
    }
    const url = apiHelpers_1.getUrl('gethistory');
    const userEmail = localStorage.getItem('userEmail');
    const sessionId = localStorage.getItem('sessionId');
    const data = {
        userEmail: userEmail,
        sessionId: sessionId,
        fileName: fileName,
        ejsVersion: version_1.EJSVERSION,
        ocelotVersion: version_2.OCELOTVERSION
    };
    try {
        const response = yield fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const jsonResponse = yield response.json(); // get json response
        if (jsonResponse.status === 'error') {
            return apiHelpers_1.failureResponse('Something went wrong, try refreshing the page');
        }
        if (jsonResponse.status === 'failure') {
            return apiHelpers_1.failureResponse(jsonResponse.message); // quite inconsistent actually
            // I have message as its own field in the response but for my response
            // for the frontend, I always have a data field that contains either message, or...data
        }
        const history = jsonResponse.data.history;
        history.map((elem) => {
            const dateTime = new Date(elem.dateCreated + ' ' + elem.timeCreated + ' UTC');
            elem.dateCreated = dateTime.toLocaleDateString('en-US');
            elem.timeCreated = dateTime.toLocaleTimeString('en-US');
        });
        const reversedHistory = history.map((elem, index) => history[history.length - 1 - index]);
        // be sure to open this list (set state to open)
        return apiHelpers_1.successResponse({
            history: reversedHistory
        });
    }
    catch (error) {
        // Stop loading the file (set state to not loading)
        // tslint:disable-next-line:no-console
        return apiHelpers_1.failureResponse('Couldn\'t connect to the server at the moment, try again later');
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0SGlzdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy91dGlscy9hcGkvZ2V0SGlzdG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSw2Q0FPc0I7QUFFdEIsaUVBQWlFO0FBQ2pFLDJDQUE4QztBQVdqQyxRQUFBLGNBQWMsR0FBRyxDQUFPLFFBQWdCLEVBQWdDLEVBQUU7SUFDbkYsa0VBQWtFO0lBQ2xFLHNEQUFzRDtJQUV0RCxJQUFJLENBQUMsOEJBQWlCLEVBQUUsRUFBRTtRQUN0QixPQUFPLDRCQUFlLENBQUMsdURBQXVELENBQUMsQ0FBQztLQUNuRjtJQUVELE1BQU0sR0FBRyxHQUFHLG1CQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7SUFFakMsTUFBTSxTQUFTLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNwRCxNQUFNLFNBQVMsR0FBRyxZQUFZLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBRXBELE1BQU0sSUFBSSxHQUFHO1FBQ1QsU0FBUyxFQUFFLFNBQVM7UUFDcEIsU0FBUyxFQUFFLFNBQVM7UUFDcEIsUUFBUSxFQUFFLFFBQVE7UUFDbEIsVUFBVSxFQUFFLG9CQUFVO1FBQ3RCLGFBQWEsRUFBRSx1QkFBYTtLQUMvQixDQUFDO0lBRUYsSUFBSTtRQUNBLE1BQU0sUUFBUSxHQUFHLE1BQU0sS0FBSyxDQUFDLEdBQUcsRUFBRTtZQUM5QixNQUFNLEVBQUUsTUFBTTtZQUNkLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztZQUMxQixPQUFPLEVBQUU7Z0JBQ0wsY0FBYyxFQUFFLGtCQUFrQjthQUNyQztTQUNKLENBQUMsQ0FBQztRQUVILE1BQU0sWUFBWSxHQUFHLE1BQU0sUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsb0JBQW9CO1FBRWhFLElBQUksWUFBWSxDQUFDLE1BQU0sS0FBSyxPQUFPLEVBQUU7WUFDakMsT0FBTyw0QkFBZSxDQUFDLCtDQUErQyxDQUFDLENBQUM7U0FDM0U7UUFFRCxJQUFJLFlBQVksQ0FBQyxNQUFNLEtBQUssU0FBUyxFQUFFO1lBQ25DLE9BQU8sNEJBQWUsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyw4QkFBOEI7WUFDNUUsc0VBQXNFO1lBQ3RFLHVGQUF1RjtTQUMxRjtRQUNELE1BQU0sT0FBTyxHQUFrQixZQUFZLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUN6RCxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDakIsTUFBTSxRQUFRLEdBQUcsSUFBSSxJQUFJLENBQ3JCLElBQUksQ0FBQyxXQUFXLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDLENBQUM7WUFDeEQsSUFBSSxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDeEQsSUFBSSxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDNUQsQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLGVBQWUsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFFMUYsZ0RBQWdEO1FBQ2hELE9BQU8sNEJBQWUsQ0FBNkI7WUFDL0MsT0FBTyxFQUFFLGVBQWU7U0FDM0IsQ0FBQyxDQUFDO0tBRU47SUFBQyxPQUFPLEtBQUssRUFBRTtRQUNaLG1EQUFtRDtRQUNuRCxzQ0FBc0M7UUFDdEMsT0FBTyw0QkFBZSxDQUNsQixnRUFBZ0UsQ0FDbkUsQ0FBQztLQUNMO0FBQ0wsQ0FBQyxDQUFBLENBQUMifQ==