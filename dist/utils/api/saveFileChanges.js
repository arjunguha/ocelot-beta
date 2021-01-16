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
exports.saveChanges = void 0;
const apiHelpers_1 = require("./apiHelpers");
const version_1 = require("@stopify/elementary-js/dist/version");
const version_2 = require("../../version");
exports.saveChanges = (fileChanges) => __awaiter(void 0, void 0, void 0, function* () {
    if (!apiHelpers_1.validEmailSession()) {
        return apiHelpers_1.failureResponse('Seems like your session expired, try logging in again');
    }
    const url = apiHelpers_1.getUrl('changefile');
    const userEmail = localStorage.getItem('userEmail');
    const sessionId = localStorage.getItem('sessionId');
    const data = { userEmail: userEmail,
        sessionId: sessionId,
        fileChanges: fileChanges,
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
        if (response.status !== 200) {
            // create snackbar
            return apiHelpers_1.failureResponse('Something went wrong, try refreshing the page');
        }
        const jsonResponse = yield response.json(); // get json response
        if (jsonResponse.status === 'error') {
            // create snackbar
            return apiHelpers_1.failureResponse('Something went wrong, try refreshing the page');
        }
        if (jsonResponse.status === 'failure') {
            // create snackbar
            return apiHelpers_1.failureResponse('Something went wrong, try refreshing the page');
        }
        return apiHelpers_1.successResponse({ message: 'Changes saved' });
    }
    catch (error) {
        return apiHelpers_1.failureResponse('Something went wrong, try refreshing the page');
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2F2ZUZpbGVDaGFuZ2VzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3V0aWxzL2FwaS9zYXZlRmlsZUNoYW5nZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsNkNBUXNCO0FBRXRCLGlFQUFpRTtBQUNqRSwyQ0FBOEM7QUFJakMsUUFBQSxXQUFXLEdBQUcsQ0FBTyxXQUF1QixFQUE4QixFQUFFO0lBRXJGLElBQUksQ0FBQyw4QkFBaUIsRUFBRSxFQUFFO1FBQ3RCLE9BQU8sNEJBQWUsQ0FBQyx1REFBdUQsQ0FBQyxDQUFDO0tBQ25GO0lBRUQsTUFBTSxHQUFHLEdBQUcsbUJBQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUNqQyxNQUFNLFNBQVMsR0FBRyxZQUFZLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3BELE1BQU0sU0FBUyxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7SUFFcEQsTUFBTSxJQUFJLEdBQUcsRUFBRSxTQUFTLEVBQUUsU0FBUztRQUMvQixTQUFTLEVBQUUsU0FBUztRQUNwQixXQUFXLEVBQUUsV0FBVztRQUN4QixVQUFVLEVBQUUsb0JBQVU7UUFDdEIsYUFBYSxFQUFFLHVCQUFhO0tBQy9CLENBQUM7SUFFRixJQUFJO1FBQ0EsTUFBTSxRQUFRLEdBQUcsTUFBTSxLQUFLLENBQUMsR0FBRyxFQUFFO1lBQzlCLE1BQU0sRUFBRSxNQUFNO1lBQ2QsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO1lBQzFCLE9BQU8sRUFBRTtnQkFDTCxjQUFjLEVBQUUsa0JBQWtCO2FBQ3JDO1NBQ0osQ0FBQyxDQUFDO1FBRUgsSUFBSSxRQUFRLENBQUMsTUFBTSxLQUFLLEdBQUcsRUFBRTtZQUN6QixrQkFBa0I7WUFDbEIsT0FBTyw0QkFBZSxDQUFDLCtDQUErQyxDQUFDLENBQUM7U0FDM0U7UUFFRCxNQUFNLFlBQVksR0FBRyxNQUFNLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLG9CQUFvQjtRQUVoRSxJQUFJLFlBQVksQ0FBQyxNQUFNLEtBQUssT0FBTyxFQUFFO1lBQ2pDLGtCQUFrQjtZQUNsQixPQUFPLDRCQUFlLENBQUMsK0NBQStDLENBQUMsQ0FBQztTQUMzRTtRQUVELElBQUksWUFBWSxDQUFDLE1BQU0sS0FBSyxTQUFTLEVBQUU7WUFDbkMsa0JBQWtCO1lBQ2xCLE9BQU8sNEJBQWUsQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO1NBQzNFO1FBQ0QsT0FBTyw0QkFBZSxDQUFzQixFQUFDLE9BQU8sRUFBRSxlQUFlLEVBQUMsQ0FBQyxDQUFDO0tBRTNFO0lBQUMsT0FBTyxLQUFLLEVBQUU7UUFDWixPQUFPLDRCQUFlLENBQUMsK0NBQStDLENBQUMsQ0FBQztLQUMzRTtBQUNMLENBQUMsQ0FBQSxDQUFDIn0=