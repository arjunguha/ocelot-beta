"use strict";
// BEING USED IN A SAGA at store/userLogin/
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
exports.validateUser = void 0;
const apiHelpers_1 = require("./apiHelpers");
const version_1 = require("@stopify/elementary-js/dist/version");
const version_2 = require("../../version");
function validateUser(googleUser) {
    return __awaiter(this, void 0, void 0, function* () {
        const email = googleUser.getBasicProfile().getEmail();
        const id_token = googleUser.getAuthResponse().id_token; // get id token
        const url = apiHelpers_1.getUrl('login');
        let data = {
            token: id_token, sessionId: null,
            ejsVersion: version_1.EJSVERSION,
            ocelotVersion: version_2.OCELOTVERSION
        }; // data to be sent
        const possibleSessionId = localStorage.getItem('sessionId');
        if (possibleSessionId !== null) {
            data.sessionId = possibleSessionId;
        }
        try {
            const response = yield fetch(url, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const jsonResponse = yield response.json(); // get json response
            if (response.status !== 200 || jsonResponse.message === 'Unauthorized') {
                // if messaged back as unauthorized
                googleUser.disconnect(); // sign user out (revoke given permissions)
                return apiHelpers_1.failureResponse('Only students and professors of CS 220 are allowed to log in');
            }
            // important: the key here is 'sessionId'
            localStorage.setItem('sessionId', jsonResponse.data.sessionId);
            localStorage.setItem('userEmail', googleUser.getBasicProfile().getEmail());
            return apiHelpers_1.successResponse({ email: email });
        }
        catch (error) {
            googleUser.disconnect();
            console.error(error);
            return apiHelpers_1.failureResponse('The authentication server seems to be down. Try again in a bit.');
        }
    });
}
exports.validateUser = validateUser;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdGVVc2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3V0aWxzL2FwaS92YWxpZGF0ZVVzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDJDQUEyQzs7Ozs7Ozs7Ozs7O0FBRzNDLDZDQUEwRztBQUUxRyxpRUFBaUU7QUFDakUsMkNBQThDO0FBSTlDLFNBQXNCLFlBQVksQ0FBQyxVQUErQjs7UUFDOUQsTUFBTSxLQUFLLEdBQUcsVUFBVSxDQUFDLGVBQWUsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBRXRELE1BQU0sUUFBUSxHQUFHLFVBQVUsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxlQUFlO1FBRXZFLE1BQU0sR0FBRyxHQUFHLG1CQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFNUIsSUFBSSxJQUFJLEdBQTJGO1lBQy9GLEtBQUssRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLElBQUk7WUFDaEMsVUFBVSxFQUFFLG9CQUFVO1lBQ3RCLGFBQWEsRUFBRSx1QkFBYTtTQUMvQixDQUFDLENBQUMsa0JBQWtCO1FBRXJCLE1BQU0saUJBQWlCLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUM1RCxJQUFJLGlCQUFpQixLQUFLLElBQUksRUFBRTtZQUM1QixJQUFJLENBQUMsU0FBUyxHQUFHLGlCQUFpQixDQUFDO1NBQ3RDO1FBRUQsSUFBSTtZQUNBLE1BQU0sUUFBUSxHQUFHLE1BQU0sS0FBSyxDQUFDLEdBQUcsRUFBRTtnQkFDOUIsTUFBTSxFQUFFLE1BQU07Z0JBQ2QsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO2dCQUMxQixPQUFPLEVBQUU7b0JBQ0wsY0FBYyxFQUFFLGtCQUFrQjtpQkFDckM7YUFDSixDQUFDLENBQUM7WUFFSCxNQUFNLFlBQVksR0FBRyxNQUFNLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLG9CQUFvQjtZQUNoRSxJQUFJLFFBQVEsQ0FBQyxNQUFNLEtBQUssR0FBRyxJQUFJLFlBQVksQ0FBQyxPQUFPLEtBQUssY0FBYyxFQUFFO2dCQUNwRSxtQ0FBbUM7Z0JBQ25DLFVBQVUsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLDJDQUEyQztnQkFDcEUsT0FBTyw0QkFBZSxDQUFDLDhEQUE4RCxDQUFDLENBQUM7YUFDMUY7WUFFRCx5Q0FBeUM7WUFDekMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsWUFBWSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUMvRCxZQUFZLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxVQUFVLENBQUMsZUFBZSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztZQUUzRSxPQUFPLDRCQUFlLENBQWtCLEVBQUMsS0FBSyxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7U0FFM0Q7UUFBQyxPQUFPLEtBQUssRUFBRTtZQUNaLFVBQVUsQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUN4QixPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3JCLE9BQU8sNEJBQWUsQ0FBQyxpRUFBaUUsQ0FBQyxDQUFDO1NBQzdGO0lBQ0wsQ0FBQztDQUFBO0FBN0NELG9DQTZDQyJ9