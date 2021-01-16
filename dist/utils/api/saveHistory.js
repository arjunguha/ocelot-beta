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
exports.saveHistory = void 0;
const apiHelpers_1 = require("./apiHelpers");
const version_1 = require("@stopify/elementary-js/dist/version");
const version_2 = require("../../version");
exports.saveHistory = (fileName, code, generation) => __awaiter(void 0, void 0, void 0, function* () {
    if (!apiHelpers_1.validEmailSession()) {
        return apiHelpers_1.failureResponse('Seems like your session expired, try logging in again');
    }
    const url = apiHelpers_1.getUrl('savehistory');
    const userEmail = localStorage.getItem('userEmail');
    const sessionId = localStorage.getItem('sessionId');
    const data = {
        userEmail: userEmail,
        sessionId: sessionId,
        snapshot: {
            fileName: fileName,
            code: code,
            generation: generation
        },
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
        const jsonResponse = yield response.json(); // get json response\
        if (jsonResponse.status === 'error') {
            return apiHelpers_1.failureResponse('Something went wrong, try refreshing the page');
        }
        if (jsonResponse.status === 'failure') {
            return apiHelpers_1.failureResponse(jsonResponse.message); // quite inconsistent actually
            // I have message as its own field in the response but for my response
            // for the frontend, I always have a data field that contains either message, or...data
        }
        // be sure to open this list (set state to open)
        return apiHelpers_1.successResponse({
            message: 'History saved'
        });
    }
    catch (error) {
        // Stop loading the file (set state to not loading)
        return apiHelpers_1.failureResponse('Couldn\'t connect to the server at the moment, try again later');
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2F2ZUhpc3RvcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvdXRpbHMvYXBpL3NhdmVIaXN0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLDZDQU9zQjtBQUV0QixpRUFBaUU7QUFDakUsMkNBQThDO0FBSWpDLFFBQUEsV0FBVyxHQUN0QixDQUFPLFFBQWdCLEVBQUUsSUFBWSxFQUFFLFVBQW1CLEVBQWdDLEVBQUU7SUFFNUYsSUFBSSxDQUFDLDhCQUFpQixFQUFFLEVBQUU7UUFDeEIsT0FBTyw0QkFBZSxDQUFDLHVEQUF1RCxDQUFDLENBQUM7S0FDakY7SUFFRCxNQUFNLEdBQUcsR0FBRyxtQkFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBRWxDLE1BQU0sU0FBUyxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDcEQsTUFBTSxTQUFTLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUVwRCxNQUFNLElBQUksR0FBRztRQUNYLFNBQVMsRUFBRSxTQUFTO1FBQ3BCLFNBQVMsRUFBRSxTQUFTO1FBQ3BCLFFBQVEsRUFBRTtZQUNSLFFBQVEsRUFBRSxRQUFRO1lBQ2xCLElBQUksRUFBRSxJQUFJO1lBQ1YsVUFBVSxFQUFFLFVBQVU7U0FDdkI7UUFDRCxVQUFVLEVBQUUsb0JBQVU7UUFDdEIsYUFBYSxFQUFFLHVCQUFhO0tBQzdCLENBQUM7SUFFRixJQUFJO1FBQ0YsTUFBTSxRQUFRLEdBQUcsTUFBTSxLQUFLLENBQUMsR0FBRyxFQUFFO1lBQ2hDLE1BQU0sRUFBRSxNQUFNO1lBQ2QsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO1lBQzFCLE9BQU8sRUFBRTtnQkFDUCxjQUFjLEVBQUUsa0JBQWtCO2FBQ25DO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsTUFBTSxZQUFZLEdBQUcsTUFBTSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxxQkFBcUI7UUFFakUsSUFBSSxZQUFZLENBQUMsTUFBTSxLQUFLLE9BQU8sRUFBRTtZQUNuQyxPQUFPLDRCQUFlLENBQUMsK0NBQStDLENBQUMsQ0FBQztTQUN6RTtRQUVELElBQUksWUFBWSxDQUFDLE1BQU0sS0FBSyxTQUFTLEVBQUU7WUFDckMsT0FBTyw0QkFBZSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLDhCQUE4QjtZQUM1RSxzRUFBc0U7WUFDdEUsdUZBQXVGO1NBQ3hGO1FBRUQsZ0RBQWdEO1FBQ2hELE9BQU8sNEJBQWUsQ0FBc0I7WUFDMUMsT0FBTyxFQUFFLGVBQWU7U0FDekIsQ0FBQyxDQUFDO0tBRUo7SUFBQyxPQUFPLEtBQUssRUFBRTtRQUNkLG1EQUFtRDtRQUNuRCxPQUFPLDRCQUFlLENBQ3BCLGdFQUFnRSxDQUNqRSxDQUFDO0tBQ0g7QUFDSCxDQUFDLENBQUEsQ0FBQyJ9